#!/usr/bin/env python3
"""Verifica el guion contra guion_original.txt y genera dist/dia1_<perfil>.html y .srt"""
import json, re, sys, pathlib

here = pathlib.Path(__file__).parent
FPS = 30
W0, W1_END = 0.8, 0.6


def parse_reference():
    parts, cur = {}, None
    for line in (here / "guion_original.txt").read_text(encoding="utf-8").splitlines():
        if line.startswith("## "):
            cur = line[3:].strip()
            parts[cur] = []
        elif line.strip():
            parts[cur].append(line.strip())
    return {k: " ".join(v) for k, v in parts.items()}


def plain(s):
    return s.replace("[[", "").replace("]]", "")


def check(guion):
    ref = parse_reference()
    ok = True
    for p in guion["parts"]:
        got = " ".join(plain(c) for c in p["chunks"])
        exp = ref[p["name"]]
        same = got == exp
        ok &= same
        print(f"  [{'OK' if same else 'DIFERENTE'}] {p['name']}: {len(exp)} caracteres")
        if not same:
            print("   esperado:", exp, "\n   obtenido:", got)
    got = " ".join(plain(c) for c in guion["final"])
    same = got == ref["Pantalla final"]
    ok &= same
    print(f"  [{'OK' if same else 'DIFERENTE'}] Pantalla final")
    return ok


def srt_time(t):
    ms = round(t * 1000)
    return f"{ms//3600000:02d}:{ms//60000%60:02d}:{ms//1000%60:02d},{ms%1000:03d}"


def build(profile, durs, final_dur, guion):
    parts = []
    for p, d in zip(guion["parts"], durs):
        parts.append({"name": p["name"], "chunks": p["chunks"], "dur": d})
    cfg = {"fps": FPS, "parts": parts, "final": guion["final"], "finalDur": final_dur}
    html = (here / "template.html").read_text(encoding="utf-8").replace("/*CFG*/null", json.dumps(cfg, ensure_ascii=False))
    (here / "dist").mkdir(exist_ok=True)
    (here / f"dist/dia1_{profile}.html").write_text(html, encoding="utf-8")
    # SRT con los mismos tiempos que la animación
    out, n, start = [], 1, 0.0
    for p in parts:
        w = [len(plain(c)) + 10 for c in p["chunks"]]
        span = p["dur"] - W0 - W1_END
        a = start + W0
        for c, x in zip(p["chunks"], w):
            b = a + span * x / sum(w)
            out.append(f"{n}\n{srt_time(a)} --> {srt_time(b)}\n{plain(c)}\n")
            n += 1
            a = b
        start += p["dur"]
    (here / f"dist/dia1_{profile}.srt").write_text("\n".join(out), encoding="utf-8")
    print(f"  perfil {profile}: partes {durs} + final {final_dur}s = {sum(durs)+final_dur}s")


if __name__ == "__main__":
    guion = json.loads((here / "guion.json").read_text(encoding="utf-8"))
    print("Comparando guion con guion_original.txt:")
    if not check(guion):
        sys.exit("El guion NO coincide")
    chars = [len(plain(" ".join(p["chunks"]))) for p in guion["parts"]]
    build("60s", [14, 14, 14, 14], 5, guion)
    build("ritmo", [max(12, round(1.4 + c / 17)) for c in chars], 6, guion)
