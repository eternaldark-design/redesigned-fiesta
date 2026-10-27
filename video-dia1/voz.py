#!/usr/bin/env python3
"""Sintetiza la narración (Kokoro, voz em_alex) y calcula la línea de tiempo.

Requiere: pip install kokoro-onnx soundfile
Modelos (GitHub releases de thewh1teagle/kokoro-onnx, model-files-v1.0):
  kokoro-v1.0.int8.onnx y voices-v1.0.bin  -> rutas por KOKORO_MODEL / KOKORO_VOICES

Salida: dist/voz/narracion.wav y dist/timeline_voz.json (duraciones, subtítulos y apertura de boca por cuadro).
"""
import json, os, pathlib, re
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

here = pathlib.Path(__file__).parent
SR, FPS = 24000, 30
VOICE, SPEED = "em_alex", 1.08
LEAD, TAIL = 0.7, 0.6          # silencio al inicio / final de cada parte
GAP = 0.30                     # pausa entre oraciones
FINAL_LEAD, FINAL_GAP, FINAL_HOLD = 1.5, 0.45, 2.2


def plain(s):
    return s.replace("[[", "").replace("]]", "")


def tts_text(s):
    # Solo para la pronunciación: no cambia el texto que se muestra
    s = plain(s).replace('"', "").replace("Día 1", "Día uno").replace("Día 2", "Día dos")
    return s.replace("online", "onlain")


def sentences(chunks):
    groups, cur = [], []
    for c in chunks:
        cur.append(c)
        if re.search(r'[.!?]"?$', plain(c)):
            groups.append(cur)
            cur = []
    if cur:
        groups.append(cur)
    return groups


def trim(x):
    idx = np.where(np.abs(x) > 0.012)[0]
    return x[max(0, idx[0] - int(.03 * SR)): min(len(x), idx[-1] + int(.06 * SR))]


def synth(k, text):
    x, sr = k.create(text, voice=VOICE, speed=SPEED, lang="es")
    assert sr == SR
    return trim(x.astype(np.float32))


def chunk_bounds(chunks, a, L):
    w = [len(plain(c)) + (6 if plain(c).endswith(",") else 0) for c in chunks]
    cum, out = 0, []
    for x in w:
        out.append(a + L * cum / sum(w))
        cum += x
    return out


def main():
    k = Kokoro(os.environ["KOKORO_MODEL"], os.environ["KOKORO_VOICES"])
    g = json.loads((here / "guion.json").read_text(encoding="utf-8"))
    audio, t = [], 0.0   # (inicio_s, muestras)
    parts = []

    for p in g["parts"]:
        start, cursor, bounds = t, LEAD, []
        sents = sentences(p["chunks"])
        for i, grp in enumerate(sents):
            x = synth(k, " ".join(tts_text(c) for c in grp))
            L = len(x) / SR
            bounds += chunk_bounds(grp, cursor, L)
            audio.append((start + cursor, x))
            cursor += L + (GAP if i < len(sents) - 1 else 0)
        dur = round(cursor + TAIL, 3)
        parts.append({"name": p["name"], "dur": dur, "bounds": [round(b, 3) for b in bounds]})
        t += dur
    final_start = t

    cursor, delays = FINAL_LEAD, []
    for i, line in enumerate(g["final"]):
        x = synth(k, tts_text(line))
        delays.append(round(cursor - 0.15, 3))
        audio.append((final_start + cursor, x))
        cursor += len(x) / SR + FINAL_GAP
    final_dur = round(cursor - FINAL_GAP + FINAL_HOLD, 3)
    total = final_start + final_dur

    wav = np.zeros(int(np.ceil(total * SR)), dtype=np.float32)
    for s, x in audio:
        i = int(s * SR)
        wav[i:i + len(x)] += x
    wav *= 0.89 / max(1e-6, np.abs(wav).max())
    (here / "dist/voz").mkdir(parents=True, exist_ok=True)
    sf.write(here / "dist/voz/narracion.wav", wav, SR)

    # apertura de boca por cuadro (envolvente de energía)
    hop, n = SR // FPS, int(np.ceil(total * FPS)) + 2
    pad = np.concatenate([wav, np.zeros(hop * 4, dtype=np.float32)])
    rms = np.array([np.sqrt(np.mean(pad[max(0, i * hop - hop // 2): i * hop + hop + hop // 2] ** 2)) for i in range(n)])
    ref = np.percentile(rms[rms > 0.01], 90)
    v = np.clip(rms / ref, 0, 1.2) ** 0.85
    v[rms < 0.012] = 0
    y, prev = np.zeros(n), 0.0
    for i in range(n):
        prev = v[i] if v[i] > prev else prev * 0.55 + v[i] * 0.45
        y[i] = prev
    mouth = [round(float(min(1, a)), 2) for a in y]

    (here / "dist/timeline_voz.json").write_text(json.dumps({
        "parts": parts, "finalDur": final_dur, "finalDelays": delays, "mouth": mouth,
    }, ensure_ascii=False))
    print("partes", [p["dur"] for p in parts], "final", final_dur, "total", round(total, 1), "s")


if __name__ == "__main__":
    main()
