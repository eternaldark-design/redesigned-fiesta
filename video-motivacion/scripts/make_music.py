"""Genera una pista motivacional original (24 s, 120 BPM, La menor épico).

Arreglo, sincronizado con las escenas del video (1 compás = 2 s):
  0-8 s    intro: pad + arpegio (entra a los 4 s)
  8-14 s   bombo, bajo y hi-hats: arranca la carrera
  14-18 s  build-up: riser + redoble de caja
  18-24 s  impacto + todo el arreglo hasta el final
Uso: python3 scripts/make_music.py public/music.wav
Para otra duración, mueve las secciones (en segundos):
  python3 scripts/make_music.py public/music.wav --dur 60 --arp 8 --drums 18 \
      --clap 24 --impact 43 --outro 55
"""
import argparse
import wave

import numpy as np

ap = argparse.ArgumentParser()
ap.add_argument("out", nargs="?", default="music.wav")
ap.add_argument("--dur", type=float, default=24.0)
ap.add_argument("--arp", type=float, default=4.0, help="entra el arpegio")
ap.add_argument("--drums", type=float, default=8.0, help="entran bombo, bajo y hi-hats")
ap.add_argument("--clap", type=float, default=12.0, help="entran las palmas")
ap.add_argument("--impact", type=float, default=18.0, help="impacto (el build-up dura 4 s antes)")
ap.add_argument("--outro", type=float, default=None, help="desde aquí solo pad y arpegio")
args = ap.parse_args()

SR = 44100
DUR = args.dur
ARP, DRUMS, CLAP, IMPACT = args.arp, args.drums, args.clap, args.impact
OUTRO = args.outro if args.outro is not None else DUR
BEAT = 0.5
BAR = 2.0
N = int(SR * DUR)
T = np.arange(N) / SR
rng = np.random.default_rng(7)


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


CHORDS = [
    (45, [57, 60, 64, 69]),  # Am
    (41, [53, 57, 60, 65]),  # F
    (48, [60, 64, 67, 72]),  # C
    (43, [59, 62, 67, 71]),  # G
]


def add(buf, start, sig):
    i = int(start * SR)
    if i >= N:
        return
    seg = sig[: N - i]
    buf[i : i + len(seg)] += seg


def saw_soft(freq, length, detune=0.0, harm=14):
    t = np.arange(int(length * SR)) / SR
    out = np.zeros_like(t)
    f = freq * (1 + detune)
    for k in range(1, harm + 1):
        out += np.sin(2 * np.pi * k * f * t) / k / (1 + (k / 5) ** 2)
    return out


def adsr(n, a, r):
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    e[:na] = np.linspace(0, 1, na)
    e[-nr:] = np.minimum(e[-nr:], np.linspace(1, 0, nr))
    return e


def pluck(freq, length=0.5):
    t = np.arange(int(length * SR)) / SR
    s = np.sin(2 * np.pi * freq * t) + 0.4 * np.sin(2 * np.pi * 2 * freq * t) \
        + 0.15 * np.sin(2 * np.pi * 3 * freq * t)
    return s * np.exp(-t * 7) * np.minimum(1, t * 400)


def kick():
    t = np.arange(int(0.45 * SR)) / SR
    f = 45 + 110 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 7.5) * 1.1


def noise_burst(length, decay, hp=True):
    n = rng.standard_normal(int(length * SR))
    if hp:
        n = np.diff(n, prepend=0)
    t = np.arange(len(n)) / SR
    return n * np.exp(-t * decay)


def clap():
    s = noise_burst(0.35, 14)
    s += 0.7 * np.roll(noise_burst(0.35, 14), int(0.012 * SR))
    return s * 0.5


def hat():
    return noise_burst(0.08, 70) * 0.35


# --- buses -----------------------------------------------------------------
pad_L, pad_R = np.zeros(N), np.zeros(N)
arp = np.zeros(N)
bass = np.zeros(N)
drums = np.zeros(N)
fx = np.zeros(N)
impact = np.zeros(N)

n_bars = int(DUR / BAR)
for bar in range(n_bars):
    root, notes = CHORDS[bar % 4]
    t0 = bar * BAR
    length = BAR + 0.6
    level = 0.55 if t0 < DRUMS else 0.8
    for m in notes[:3]:
        env = adsr(int(length * SR), 0.5, 0.6)
        add(pad_L, t0, saw_soft(midi(m), length, -0.003) * env * level * 0.09)
        add(pad_R, t0, saw_soft(midi(m), length, +0.003) * env * level * 0.09)
    # sub-pad de la fundamental
    env = adsr(int(length * SR), 0.3, 0.6)
    sub = np.sin(2 * np.pi * midi(root) * np.arange(int(length * SR)) / SR)
    add(pad_L, t0, sub * env * 0.18)
    add(pad_R, t0, sub * env * 0.18)

    # arpegio en corcheas a partir del compás 2
    if t0 >= ARP:
        order = [0, 1, 2, 3, 2, 1, 2, 3]
        for i, o in enumerate(order):
            add(arp, t0 + i * 0.25, pluck(midi(notes[o] + 12), 0.5) * 0.22)

    # bajo en corcheas a partir del compás 4
    if DRUMS <= t0 < OUTRO:
        for i in range(8):
            f = midi(root + (12 if i % 4 == 3 else 0))
            t = np.arange(int(0.24 * SR)) / SR
            note = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 2 * f * t)
            add(bass, t0 + i * 0.25, note * np.exp(-t * 5) * 0.55)

# percusión
K = kick()
for b in range(int(DUR / BEAT)):
    t = b * BEAT
    if DRUMS <= t < OUTRO:
        add(drums, t, K * 0.95)
        add(drums, t + 0.25, hat())
        if t >= CLAP and b % 2 == 1 and t < IMPACT - 1:
            add(drums, t, clap())
        if t >= IMPACT and b % 2 == 1:
            add(drums, t, clap() * 1.2)
# redoble de caja (2 s antes del impacto): corcheas -> semicorcheas, creciendo
roll_t = IMPACT - 2
step = 0.25
while roll_t < IMPACT - 0.2:
    g = (roll_t - (IMPACT - 2)) / 1.8
    add(drums, roll_t, noise_burst(0.2, 18) * (0.25 + 0.6 * g))
    if roll_t > IMPACT - 1:
        add(drums, roll_t + step / 2, noise_burst(0.15, 22) * (0.3 + 0.6 * g))
    roll_t += step
# hi-hats abiertos en cada contratiempo tras el impacto
for b in range(int(IMPACT / BEAT), int(OUTRO / BEAT)):
    add(drums, b * BEAT + 0.25, hat() * 1.4)

# riser durante los 4 s previos al impacto
rs, re_ = IMPACT - 4, IMPACT
i0, i1 = int(rs * SR), int(re_ * SR)
tt = (T[i0:i1] - rs) / (re_ - rs)
nz = np.diff(rng.standard_normal(i1 - i0), prepend=0)
fx[i0:i1] += nz * (tt ** 2.2) * 0.35
sweep = np.cumsum(180 + 2200 * tt ** 2) / SR * 2 * np.pi
fx[i0:i1] += np.sin(sweep) * (tt ** 1.8) * 0.12

# impacto en 18 s: boom + platillo
tb = np.arange(int(2.6 * SR)) / SR
boom = np.sin(2 * np.pi * (48 + 70 * np.exp(-tb * 10)) * tb) * np.exp(-tb * 1.6) * 0.9
crash = noise_burst(2.6, 1.6) * 0.38
add(impact, IMPACT, boom + crash)

# --- reverb en pad + arpegio ------------------------------------------------
def reverb(sig, seed, wet=0.32):
    r = np.random.default_rng(seed)
    n = int(1.7 * SR)
    ir = r.standard_normal(n) * np.exp(-np.arange(n) / SR / 0.55)
    ir = np.convolve(ir, np.ones(40) / 40, mode="same")
    size = 1 << (N + n).bit_length()
    out = np.fft.irfft(np.fft.rfft(sig, size) * np.fft.rfft(ir, size), size)[:N]
    out /= np.max(np.abs(out)) + 1e-9
    return out * wet * np.max(np.abs(sig)) * 4


# sidechain: el pad, arpegio y bajo "respiran" con el bombo desde los 8 s
phase = np.mod(T, BEAT)
duck = np.where((T >= DRUMS) & (T < OUTRO), 1 - 0.65 * np.exp(-phase / 0.11), 1.0)

pad_L *= duck
pad_R *= duck
arp *= duck
bass *= duck

wetL = reverb(pad_L + arp * 0.8, 1)
wetR = reverb(pad_R + arp * 0.8, 2)

# corte dramático justo antes del impacto
gate = np.ones(N)
g0, g1 = int((IMPACT - 0.18) * SR), int(IMPACT * SR)
gate[g0:g1] = 0.0
core_L = (pad_L + arp * 0.9 + bass + drums + wetL) * gate
core_R = (pad_R + arp * 1.1 + bass + drums + wetR) * gate
L = core_L + fx + impact
R = core_R + fx + impact

# fundido de entrada/salida
fade = np.minimum(1, T / 0.8) * np.minimum(1, (DUR - T) / 1.4)
L *= fade
R *= fade

# compresión suave: sube el volumen medio sin que el impacto lo domine
L, R = np.tanh(L * 1.5), np.tanh(R * 1.5)
peak = max(np.max(np.abs(L)), np.max(np.abs(R)))
L, R = L / peak * 0.7, R / peak * 0.7
pcm = (np.stack([L, R], axis=1) * 32767).astype("<i2")

out = args.out
with wave.open(out, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("ok", out)
