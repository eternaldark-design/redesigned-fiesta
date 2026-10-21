import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Person, PALETTES, STAND_H, climbPose } from "../Person";
import { Cloud, Flock, GrassTuft, LeafShape, LightShafts, Mountains, PineTree, Sparkle, blobPath } from "../art";
import { mod, rnd } from "../utils";

export const CLIMB_FRAMES = 134;

const DX = 110;
const DY = 64;
const P = 15; // frames por escalón
const FOOT_X = 480;
const FOOT_Y = 1400;
const SCALE = 2.3;

const stairsPath = () => {
  let d = `M ${FOOT_X - 16 * DX} 3200`;
  for (let i = -16; i <= 24; i++) {
    const x = FOOT_X + i * DX;
    const y = FOOT_Y - i * DY;
    d += ` L ${x - DX / 2} ${y} L ${x + DX / 2} ${y}`;
  }
  return d + ` L ${FOOT_X + 24 * DX + DX} 3200 Z`;
};

const STAIRS = stairsPath();

export const Climb: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame + 420;
  const s = frame / P;
  const ox = -s * DX;
  const oy = s * DY;
  const phase = (frame / P) * Math.PI;
  const bob = Math.abs(Math.cos(phase)) * 10;
  const pulse = 1 + Math.sin(frame / 12) * 0.03;

  const follower = (back: number, scale: number, pal: number, ph: number) => {
    const fx = FOOT_X - back;
    const fy = FOOT_Y + (back * DY) / DX;
    return (
      <Person
        key={pal}
        x={fx}
        y={fy - STAND_H * scale - Math.abs(Math.cos(phase + ph)) * 6 * scale}
        scale={scale}
        pose={climbPose(phase + ph)}
        palette={PALETTES[pal]}
        t={t + pal * 13}
      />
    );
  };

  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <defs>
          <linearGradient id="climbSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4a3392" />
            <stop offset="0.45" stopColor="#ff7aa0" />
            <stop offset="0.8" stopColor="#ffc07a" />
            <stop offset="1" stopColor="#ffe0a0" />
          </linearGradient>
          <linearGradient id="stone" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7a67a8" />
            <stop offset="1" stopColor="#2c2150" />
          </linearGradient>
          <radialGradient id="climbSun">
            <stop offset="0" stopColor="#fff2b0" stopOpacity="0.9" />
            <stop offset="1" stopColor="#fff2b0" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#climbSky)" />

        <g transform={`translate(800 940) scale(${pulse})`}>
          <circle r={400} fill="url(#climbSun)" />
          <path d={blobPath(150, 150, 5, 0.03, 14, frame / 20, 0.01)} fill="#fff1a8" />
        </g>
        <LightShafts x={800} y={940} t={frame} count={8} len={1400} op={0.14} />

        {[0, 1, 2].map((i) => (
          <Cloud
            key={i}
            x={mod(i * 520 - frame * (0.8 + i * 0.25), 1700) - 300}
            y={720 + i * 120}
            s={1 + (i % 2) * 0.3}
            seed={i * 5 + 2}
            color="#fff0ee"
            shade="#ffb7c4"
            opacity={0.85}
            t={frame}
          />
        ))}
        <Flock t={frame} y={600} speed={3.5} count={5} seed={2} color="#3f2360" />

        {/* cordilleras con nieve y parallax */}
        <g transform={`translate(0 ${oy * 0.05})`}>
          <Mountains base={1300} amp={420} seed={1.7} fill="#b05fa6" scroll={frame * 2.2} shadow={0.16} />
        </g>
        <g transform={`translate(0 ${oy * 0.12})`}>
          <Mountains base={1480} amp={380} seed={4.2} fill="#74408f" scroll={frame * 4.5} shadow={0.2} />
          {/* pinos sobre la ladera cercana */}
          {Array.from({ length: 7 }).map((_, i) => {
            const x = mod(i * 190 - frame * 4.5 * 1.02, 1500) - 200;
            return <PineTree key={i} x={x} y={1560} s={0.8 + rnd(i) * 0.4} t={t} seed={i} color="#2a3f7a" light="#4660b0" />;
          })}
        </g>

        {/* escalera con textura de piedra */}
        <g transform={`translate(${ox} ${oy})`}>
          <path d={STAIRS} fill="url(#stone)" />
          {Array.from({ length: 41 }).map((_, k) => {
            const i = k - 16;
            const x = FOOT_X + i * DX;
            const y = FOOT_Y - i * DY;
            return (
              <g key={i}>
                <path
                  d={`M ${x - DX / 2 + 3} ${y} h ${DX - 6} q 4 0 4 5 v 5 h ${-(DX - 6) - 8} v -5 q 0 -5 4 -5 Z`}
                  fill="#c4b4ee"
                />
                <path
                  d={`M ${x + DX / 2} ${y + 6} v ${DY} M ${x - 20} ${y + 24} l 14 8 l -6 14 M ${x + 24} ${y + 30} l -10 12`}
                  stroke="#1f1640"
                  strokeWidth={3}
                  fill="none"
                  opacity={0.35}
                  strokeLinecap="round"
                />
                <path
                  d={blobPath(10, 6, i + 40, 0.4, 6)}
                  transform={`translate(${x - 28} ${y + 44})`}
                  fill="#5b4a8c"
                  opacity={0.6}
                />
                {i % 2 === 0 && <GrassTuft x={x + DX / 2 - 12} y={y + 4} s={0.7} t={t} seed={i} color="#4fb06b" />}
              </g>
            );
          })}
        </g>

        {/* polvo en cada pisada */}
        {Array.from({ length: 4 }).map((_, k) => {
          const age = mod(frame + k * 8, 30) / 30;
          return (
            <path
              key={k}
              transform={`translate(${FOOT_X - 40 - age * 70} ${FOOT_Y - 6 - age * 30}) scale(${0.5 + age})`}
              d={blobPath(18, 11, k + 3, 0.35, 7)}
              fill="#e6d9f5"
              opacity={0.55 * (1 - age)}
            />
          );
        })}

        {/* seguidores pequeños */}
        {follower(430, 1.2, 3, 1.2)}
        {follower(250, 1.4, 4, 2.4)}

        {/* personaje principal */}
        <ellipse cx={FOOT_X + 20} cy={FOOT_Y + 8} rx={110} ry={12} fill="rgba(0,0,0,0.3)" />
        <Person
          x={FOOT_X}
          y={FOOT_Y - STAND_H * SCALE - bob}
          scale={SCALE}
          pose={climbPose(phase)}
          palette={PALETTES[0]}
          t={t}
        />

        {/* bandera en la cima lejana, siempre visible */}
        <g transform="translate(900 700)">
          <line x1={0} y1={0} x2={0} y2={-80} stroke="#fff" strokeWidth={5} strokeLinecap="round" />
          <path
            d={`M 0 -80 Q ${22 + Math.sin(frame / 5) * 5} ${-84 + Math.sin(frame / 4) * 3} ${46 + Math.sin(frame / 5) * 6} -72 Q ${24 + Math.sin(frame / 5 + 1) * 5} -62 0 -58 Z`}
            fill="#ff5a36"
          />
        </g>

        {/* hojas al viento y destellos */}
        {Array.from({ length: 8 }).map((_, i) => {
          const x = mod(i * 190 - frame * (7 + rnd(i) * 4), 1400) - 150;
          const y = 900 + mod(i * 233 + frame * 1.4, 800) + Math.sin(frame / 14 + i) * 28;
          return <LeafShape key={i} x={x} y={y} rot={frame * (2 + rnd(i) * 3) + i * 50} s={0.8 + rnd(i + 2) * 0.6} color={i % 2 ? "#ffd27a" : "#ff8f6b"} />;
        })}
        {Array.from({ length: 6 }).map((_, i) => (
          <Sparkle key={i} x={120 + i * 170} y={780 + rnd(i + 4) * 420} s={14} t={frame} phase={i * 1.4} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};
