import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Person, PALETTES, STAND_H, runPose } from "../Person";
import {
  Cloud,
  Flock,
  GrassTuft,
  LeafShape,
  LeafyTree,
  LightShafts,
  Mountains,
  PineTree,
  Skyline,
  Sparkle,
  blobPath,
} from "../art";
import { mod, ramp, rnd } from "../utils";

export const RUN_FRAMES = 194;
const GROUND = 1700;
const SCALE = 2.3;

const Lamp: React.FC<{ x: number; t: number }> = ({ x, t }) => (
  <g transform={`translate(${x} 1590)`}>
    <path d="M -7 0 L -4 -300 L 4 -300 L 7 0 Z" fill="#2b2140" />
    <path d="M 0 -300 Q 0 -340 40 -338" stroke="#2b2140" strokeWidth={7} fill="none" strokeLinecap="round" />
    <path d="M 26 -338 L 64 -338 L 56 -326 L 34 -326 Z" fill="#3a2d55" />
    <path d="M 36 -326 L 54 -326 L 90 -250 L 0 -250 Z" fill="#ffe08a" opacity={0.1 + 0.04 * Math.sin(t / 5)} />
    <path d="M 34 -326 L 56 -326 L 52 -320 L 38 -320 Z" fill="#fff3b0" />
  </g>
);

export const Run: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame + 240;
  const sunY = 1290 - ramp(frame, 0, 180) * 120;
  const phase = frame * 0.55;
  const bob = Math.abs(Math.cos(phase)) * 14;
  const pulse = 1 + Math.sin(frame / 12) * 0.03;

  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <defs>
          <linearGradient id="runSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3f2a82" />
            <stop offset="0.4" stopColor="#c2507f" />
            <stop offset="0.68" stopColor="#ff8d6b" />
            <stop offset="0.85" stopColor="#ffc983" />
            <stop offset="1" stopColor="#ffe8ae" />
          </linearGradient>
          <radialGradient id="sunGlow">
            <stop offset="0" stopColor="#fff2b0" stopOpacity="0.95" />
            <stop offset="1" stopColor="#fff2b0" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="road" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3a3552" />
            <stop offset="1" stopColor="#1f1c33" />
          </linearGradient>
          <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3f9a5a" />
            <stop offset="1" stopColor="#1f6a46" />
          </linearGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#runSky)" />

        {/* sol con halo que respira */}
        <g transform={`translate(540 ${sunY}) scale(${pulse})`}>
          <circle r={460} fill="url(#sunGlow)" />
          <path d={blobPath(176, 176, 4, 0.03, 14, frame / 20, 0.01)} fill="#fff1a8" />
        </g>
        <LightShafts x={540} y={sunY} t={frame} count={9} len={1300} op={0.16} />

        {/* nubes y pájaros */}
        {[0, 1, 2, 3].map((i) => (
          <Cloud
            key={i}
            x={mod(i * 400 - frame * (0.7 + i * 0.2), 1600) - 260}
            y={640 + i * 95 + (i % 2) * 40}
            s={0.9 + (i % 3) * 0.25}
            seed={i * 3 + 1}
            color="#ffe9ea"
            shade="#ffb0bf"
            opacity={0.85}
            t={frame}
          />
        ))}
        <Flock t={frame} y={560} speed={4} count={6} color="#40235a" />

        {/* montañas y ciudad en capas */}
        <Mountains base={1240} amp={230} seed={2.1} fill="#a65aa0" scroll={frame * 0.5} snow={false} shadow={0.14} />
        <Mountains base={1310} amp={190} seed={5.4} fill="#7c3f8f" scroll={frame * 1.1} snow={false} shadow={0.18} />
        <Skyline base={1370} scroll={frame * 1.6} seed={1} color="#6b3b86" rim="#ffb089" t={t} hScale={0.8} />
        <Skyline base={1420} scroll={frame * 3} seed={7} color="#3d2457" rim="#ff9a78" windows="#ffd27a" t={t} />

        {/* arbolado */}
        {Array.from({ length: 6 }).map((_, i) => {
          const x = mod(i * 300 - frame * 7, 1900) - 280;
          return i % 2 === 0 ? (
            <LeafyTree key={i} x={x} y={1500} s={0.9 + rnd(i) * 0.3} t={t} seed={i} />
          ) : (
            <PineTree key={i} x={x} y={1500} s={1.05} t={t} seed={i} />
          );
        })}

        {/* pasto, acera y camino */}
        <path
          d={`M 0 1470 ${Array.from({ length: 12 })
            .map((_, i) => `Q ${i * 100 + 50} ${1452 + Math.sin(i + frame / 30) * 6} ${i * 100 + 100} 1470`)
            .join(" ")} L 1080 1560 L 0 1560 Z`}
          fill="url(#grass)"
        />
        {Array.from({ length: 12 }).map((_, i) => (
          <GrassTuft
            key={i}
            x={mod(i * 130 - frame * 9, 1500) - 150}
            y={1520 + (i % 3) * 12}
            s={0.9 + rnd(i) * 0.6}
            t={t}
            seed={i}
          />
        ))}
        <rect x={0} y={1555} width={1080} height={40} fill="#d8cde6" />
        <rect x={0} y={1590} width={1080} height={8} fill="#a89cc0" />
        <rect x={0} y={1598} width={1080} height={330} fill="url(#road)" />
        {Array.from({ length: 10 }).map((_, i) => {
          const x = mod(i * 220 - frame * 26, 2200) - 220;
          return <path key={i} d={`M ${x} 1810 h 130 q 8 0 8 7 q 0 7 -8 7 h -130 q -8 0 -8 -7 q 0 -7 8 -7 Z`} fill="#ffd23f" />;
        })}
        {Array.from({ length: 8 }).map((_, i) => {
          const x = mod(i * 260 - frame * 26, 2200) - 200;
          return <path key={i} d={`M ${x} ${1650 + (i % 3) * 40} q 40 -8 90 4`} stroke="#ffffff" opacity={0.1} strokeWidth={3} fill="none" />;
        })}

        {/* faroles que pasan */}
        {[0, 1, 2].map((i) => (
          <Lamp key={i} x={mod(i * 520 - frame * 9, 1560) - 200} t={t} />
        ))}

        {/* corredores pequeños al fondo */}
        {[
          { x: 150, pal: 1, ph: 0.4, s: 0.95 },
          { x: 860, pal: 4, ph: 2.1, s: 0.85 },
          { x: 985, pal: 5, ph: 3.3, s: 0.78 },
        ].map((j, i) => (
          <g key={i}>
            <ellipse cx={j.x + 6} cy={1580} rx={40 * j.s} ry={6} fill="rgba(0,0,0,0.25)" />
            <Person
              x={j.x + Math.sin(frame / 40 + i) * 14}
              y={1580 - STAND_H * j.s - Math.abs(Math.cos(phase + j.ph)) * 6}
              scale={j.s}
              pose={runPose(phase + j.ph, 12, 0.9)}
              palette={PALETTES[j.pal]}
              t={t + i * 17}
            />
          </g>
        ))}

        {/* polvo que levantan los pasos */}
        {Array.from({ length: 6 }).map((_, k) => {
          const age = mod(frame + k * 7, 36) / 36;
          return (
            <path
              key={k}
              transform={`translate(${380 - age * 150} ${GROUND - 10 - age * 40}) scale(${0.5 + age * 1.3})`}
              d={blobPath(22, 14, k, 0.35, 7)}
              fill="#d6c9e8"
              opacity={0.5 * (1 - age)}
            />
          );
        })}

        {/* corredor principal */}
        <ellipse cx={500} cy={GROUND + 6} rx={150} ry={16} fill="rgba(0,0,0,0.35)" />
        <Person
          x={470}
          y={GROUND - STAND_H * SCALE - bob}
          scale={SCALE}
          pose={runPose(phase, 16)}
          palette={PALETTES[0]}
          t={t}
        />

        {/* gotas de sudor */}
        {[0, 1, 2].map((k) => {
          const age = mod(frame + k * 9, 28) / 28;
          return (
            <path
              key={k}
              transform={`translate(${420 - age * 90} ${1300 - age * 40 + age * age * 90}) rotate(${-30 + age * 50})`}
              d="M 0 -9 Q 6 0 0 7 Q -6 0 0 -9 Z"
              fill="#bfe9ff"
              opacity={0.9 * (1 - age)}
            />
          );
        })}

        {/* líneas de velocidad curvas */}
        {Array.from({ length: 9 }).map((_, i) => {
          const x = mod(i * 330 - frame * (40 + rnd(i) * 20), 1700) - 300;
          const y = 1640 + rnd(i + 3) * 260;
          const w = 180 + rnd(i) * 120;
          return (
            <path
              key={i}
              d={`M ${x} ${y} q ${w / 2} -10 ${w} 0`}
              stroke="#fff"
              strokeWidth={4}
              strokeLinecap="round"
              fill="none"
              opacity={0.3}
            />
          );
        })}

        {/* hojas y destellos flotando */}
        {Array.from({ length: 9 }).map((_, i) => {
          const x = mod(i * 170 - frame * (6 + rnd(i) * 5), 1400) - 150;
          const y = 700 + mod(i * 211 + frame * 1.2, 800) + Math.sin(frame / 15 + i) * 30;
          return <LeafShape key={i} x={x} y={y} rot={frame * (2 + rnd(i) * 3) + i * 40} s={0.8 + rnd(i + 2) * 0.6} color={i % 2 ? "#ffb347" : "#e86b4a"} />;
        })}
        {Array.from({ length: 5 }).map((_, i) => (
          <Sparkle key={i} x={150 + i * 210} y={820 + rnd(i) * 300} s={14} t={frame} phase={i * 1.7} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};
