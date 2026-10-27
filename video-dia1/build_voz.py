#!/usr/bin/env python3
"""Genera dist/dia1_voz.html y dia1_voz.srt a partir de guion.json + dist/timeline_voz.json (ver voz.py)."""
import json, sys, pathlib
import build

here = pathlib.Path(__file__).parent
g = json.loads((here / "guion.json").read_text(encoding="utf-8"))
print("Comparando guion con guion_original.txt:")
if not build.check(g):
    sys.exit("El guion NO coincide")
T = json.loads((here / "dist/timeline_voz.json").read_text(encoding="utf-8"))
parts = [{"name": p["name"], "chunks": p["chunks"], "dur": t["dur"], "bounds": t["bounds"]} for p, t in zip(g["parts"], T["parts"])]
cfg = {"fps": build.FPS, "parts": parts, "final": g["final"], "finalDur": T["finalDur"], "finalDelays": T["finalDelays"], "mouth": T["mouth"]}
html = (here / "template_voz.html").read_text(encoding="utf-8").replace("/*CFG*/null", json.dumps(cfg, ensure_ascii=False))
(here / "dist/dia1_voz.html").write_text(html, encoding="utf-8")

out, n, start = [], 1, 0.0
for p in parts:
    for i, c in enumerate(p["chunks"]):
        a = start + p["bounds"][i]
        b = start + (p["bounds"][i + 1] if i + 1 < len(p["bounds"]) else p["dur"] - 0.6)
        out.append(f"{n}\n{build.srt_time(a)} --> {build.srt_time(b)}\n{build.plain(c)}\n")
        n += 1
    start += p["dur"]
(here / "dist/dia1_voz.srt").write_text("\n".join(out), encoding="utf-8")
print("total", round(start + T["finalDur"], 1), "s")
