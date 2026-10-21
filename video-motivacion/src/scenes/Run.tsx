import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Person, PALETTES, runPose } from "../Person";
import { mod, ramp, rnd } from "../utils";

export const RUN_FRAMES = 194;
const GROUND = 1700;
const SCALE = 2.6;

const hills = (off: number, base: number, amp: number, wl: number) => {
  let d = `M -20 1920 L -20 ${base}`;
  for (let x = -20; x <= 1100; x += 20) {
    const y =
      base + amp * Math.sin((x + off) / wl) + (amp / 2) * Math.sin((x + off) / (wl * 0.43));
    d += ` L ${x} ${y.toFixed(1)}`;
  }
  return d + " L 1100 1920 Z";
};

export const Run: React.FC = () => {
  const frame = useCurrentFrame();
  const sunY = 1290 - ramp(frame, 0, 180) * 120;
  const phase = frame * 0.55;
  const bob = Math.abs(Math.cos(phase)) * 14;

  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <defs>
          <linearGradient id="runSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4a2f87" />
            <stop offset="0.45" stopColor="#ff6f91" />
            <stop offset="0.75" stopColor="#ffc37a" />
            <stop offset="1" stopColor="#ffe3a3" />
          </linearGradient>
          <radialGradient id="sunGlow">
            <stop offset="0" stopColor="#fff2b0" stopOpacity="0.9" />
            <stop offset="1" stopColor="#fff2b0" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#runSky)" />

        {/* sol */}
        <circle cx={540} cy={sunY} r={420} fill="url(#sunGlow)" />
        <circle cx={540} cy={sunY} r={170} fill="#fff1a8" />

        {/* nubes */}
        {[0, 1, 2, 3].map((i) => {
          const x = mod(i * 360 - frame * (0.6 + i * 0.15), 1500) - 200;
          const y = 720 + i * 90 + (i % 2) * 40;
          return (
            <g key={i} opacity={0.55}>
              <ellipse cx={x} cy={y} rx={120} ry={26} fill="#fff" />
              <ellipse cx={x + 60} cy={y - 18} rx={70} ry={24} fill="#fff" />
            </g>
          );
        })}

        {/* colinas y ciudad */}
        <path d={hills(frame * 0.8, 1200, 40, 130)} fill="#8a4b98" />
        {Array.from({ length: 14 }).map((_, i) => {
          const w = 70 + rnd(i) * 70;
          const h = 120 + rnd(i + 20) * 230;
          const x = mod(i * 120 - frame * 2.2, 1700) - 150;
          return (
            <g key={i}>
              <rect x={x} y={1330 - h} width={w} height={h + 100} fill="#4b2a63" />
              {Array.from({ length: 5 }).map((__, r) => (
                <rect
                  key={r}
                  x={x + 12}
                  y={1330 - h + 20 + r * 34}
                  width={w - 24}
                  height={10}
                  fill="#ffd27a"
                  opacity={0.35 + 0.25 * rnd(i * 7 + r)}
                />
              ))}
            </g>
          );
        })}
        <path d={hills(frame * 3, 1385, 22, 90)} fill="#2e1d46" />

        {/* árboles */}
        {Array.from({ length: 8 }).map((_, i) => {
          const x = mod(i * 190 - frame * 9, 1600) - 200;
          return (
            <g key={i}>
              <rect x={x - 8} y={1390} width={16} height={70} fill="#3a2418" />
              <circle cx={x} cy={1370} r={58} fill="#1f5a45" />
              <circle cx={x - 28} cy={1395} r={38} fill="#2a7357" />
            </g>
          );
        })}

        {/* pasto, acera y camino */}
        <rect x={0} y={1440} width={1080} height={110} fill="#2a7a50" />
        <rect x={0} y={1550} width={1080} height={40} fill="#c9bfd8" />
        <rect x={0} y={1590} width={1080} height={330} fill="#2a2a3d" />
        <rect x={0} y={1590} width={1080} height={8} fill="#fff" opacity={0.5} />
        {Array.from({ length: 9 }).map((_, i) => {
          const x = mod(i * 220 - frame * 26, 1980) - 220;
          return <rect key={i} x={x} y={1800} width={130} height={14} rx={7} fill="#ffd23f" />;
        })}

        {/* corredores pequeños al fondo */}
        {[
          { x: 150, pal: 1, ph: 0.4, s: 1.05 },
          { x: 860, pal: 4, ph: 2.1, s: 0.95 },
          { x: 985, pal: 5, ph: 3.3, s: 0.85 },
        ].map((j, i) => (
          <g key={i}>
            <ellipse cx={j.x + 6} cy={1560} rx={40 * j.s} ry={6} fill="rgba(0,0,0,0.25)" />
            <Person
              x={j.x + Math.sin(frame / 40 + i) * 14}
              y={1560 - 90 * j.s - Math.abs(Math.cos(phase + j.ph)) * 6}
              scale={j.s}
              pose={runPose(phase + j.ph, 12, 0.9)}
              palette={PALETTES[j.pal]}
            />
          </g>
        ))}

        {/* corredor principal */}
        <ellipse cx={500} cy={GROUND + 6} rx={150} ry={16} fill="rgba(0,0,0,0.35)" />
        <Person
          x={470}
          y={GROUND - 90 * SCALE - bob}
          scale={SCALE}
          pose={runPose(phase, 16)}
          palette={PALETTES[0]}
        />

        {/* líneas de velocidad */}
        {Array.from({ length: 9 }).map((_, i) => {
          const x = mod(i * 330 - frame * (40 + rnd(i) * 20), 1700) - 300;
          const y = 1620 + rnd(i + 3) * 280;
          return (
            <rect key={i} x={x} y={y} width={180 + rnd(i) * 120} height={5} rx={2.5} fill="#fff" opacity={0.28} />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
