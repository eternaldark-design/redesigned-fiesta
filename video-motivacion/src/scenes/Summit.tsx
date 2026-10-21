import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CHEER, PALETTES, Person, STAND_H, lerpPose, STAND } from "../Person";
import { mod, ramp, rnd } from "../utils";

export const SUMMIT_FRAMES = 180;

const TOP = 1310;
const SCALE = 2.3;
const CONFETTI = ["#ff5a36", "#ffd23f", "#19c3a6", "#8b5cf6", "#ff6fae", "#3aa0ff", "#ffffff"];

export const Summit: React.FC = () => {
  const frame = useCurrentFrame();
  const shake = frame < 10 ? Math.sin(frame * 5) * (10 - frame) * 1.2 : 0;
  const t = ramp(frame, 0, 10);
  const jump = frame > 12 ? Math.abs(Math.sin((frame - 12) / 9)) * 34 : 0;
  const pose = lerpPose(STAND, CHEER, t);

  const crowd = [
    { x: 120, y: 1640, pal: 1, s: 1.25 },
    { x: 230, y: 1640, pal: 2, s: 1.15 },
    { x: 340, y: 1640, pal: 3, s: 1.3 },
    { x: 740, y: 1640, pal: 4, s: 1.3 },
    { x: 850, y: 1640, pal: 5, s: 1.15 },
    { x: 960, y: 1640, pal: 6, s: 1.25 },
    { x: 80, y: 1790, pal: 5, s: 1.5 },
    { x: 1000, y: 1790, pal: 2, s: 1.5 },
  ];

  return (
    <AbsoluteFill>
      <svg
        width={1080}
        height={1920}
        viewBox="0 0 1080 1920"
        style={{ transform: `translate(${shake}px, ${shake * 0.6}px)` }}
      >
        <defs>
          <linearGradient id="sumSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#23369b" />
            <stop offset="0.45" stopColor="#ff7a6b" />
            <stop offset="0.8" stopColor="#ffc36b" />
            <stop offset="1" stopColor="#ffe9a6" />
          </linearGradient>
          <linearGradient id="rock" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6a5a96" />
            <stop offset="1" stopColor="#261c44" />
          </linearGradient>
          <radialGradient id="sumSun">
            <stop offset="0" stopColor="#fff6c0" stopOpacity="0.95" />
            <stop offset="1" stopColor="#fff6c0" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#sumSky)" />

        {/* rayos de sol giratorios */}
        <g transform={`translate(540 960) rotate(${frame * 0.35})`} opacity={0.2}>
          {Array.from({ length: 14 }).map((_, i) => (
            <path
              key={i}
              d="M0 0 L -60 -1200 L 60 -1200 Z"
              fill="#fff6c0"
              transform={`rotate(${i * (360 / 14)})`}
            />
          ))}
        </g>
        <circle cx={540} cy={960} r={400} fill="url(#sumSun)" />
        <circle cx={540} cy={960} r={170} fill="#fff6b8" />

        {/* montañas lejanas */}
        <path
          d="M -100 1500 L 160 1180 L 330 1330 L 520 1120 L 700 1330 L 880 1160 L 1180 1500 L 1180 1920 L -100 1920 Z"
          fill="#9a4f98"
          opacity={0.85}
        />

        {/* la cima */}
        <path
          d={`M -300 1920 L 90 1700 L 330 1460 L 440 ${TOP} L 640 ${TOP} L 760 1460 L 990 1700 L 1380 1920 Z`}
          fill="url(#rock)"
        />
        <path d="M440 1310 L640 1310 L610 1356 L570 1336 L540 1372 L500 1340 L468 1360 Z" fill="#fff" opacity={0.95} />
        <rect x={420} y={1300} width={240} height={16} rx={8} fill="#c8bdf0" />

        {/* repisas con el público */}
        <rect x={40} y={1640} width={380} height={26} rx={13} fill="#4b3a7c" />
        <rect x={680} y={1640} width={360} height={26} rx={13} fill="#4b3a7c" />
        <rect x={0} y={1790} width={200} height={26} rx={13} fill="#3a2c66" />
        <rect x={880} y={1790} width={200} height={26} rx={13} fill="#3a2c66" />

        {/* bandera */}
        <line x1={740} y1={TOP - 4} x2={740} y2={1040} stroke="#fff" strokeWidth={8} strokeLinecap="round" />
        <path
          d={`M740 1044 Q ${790 + Math.sin(frame / 6) * 10} ${1030 + Math.sin(frame / 5) * 6} ${850 + Math.sin(frame / 6) * 12} 1052 Q ${800 + Math.sin(frame / 6 + 1) * 10} ${1090} 740 1096 Z`}
          fill="#ff5a36"
        />

        {/* público pequeño */}
        {crowd.map((c, i) => {
          const jp = Math.abs(Math.sin((frame - 14 - i * 3) / 8)) * 22 * (frame > 14 ? 1 : 0);
          return (
            <g key={i}>
              <ellipse cx={c.x + 6} cy={c.y + 4} rx={34 * c.s} ry={6} fill="rgba(0,0,0,0.25)" />
              <Person
                x={c.x}
                y={c.y - STAND_H * c.s - jp}
                scale={c.s}
                pose={lerpPose(STAND, CHEER, ramp(frame, 4 + i, 16 + i))}
                palette={PALETTES[c.pal]}
              />
            </g>
          );
        })}

        {/* personaje principal */}
        <ellipse cx={560} cy={TOP + 4} rx={150 - jump * 0.8} ry={14} fill="rgba(0,0,0,0.3)" />
        <Person
          x={540}
          y={TOP - STAND_H * SCALE - jump}
          scale={SCALE}
          pose={pose}
          palette={PALETTES[0]}
        />

        {/* nubes al frente */}
        {[0, 1, 2].map((i) => {
          const x = mod(i * 500 + frame * (0.8 + i * 0.3), 1700) - 250;
          return (
            <g key={i} opacity={0.8}>
              <ellipse cx={x} cy={1560 + i * 130} rx={150} ry={30} fill="#fff" />
              <ellipse cx={x - 70} cy={1545 + i * 130} rx={80} ry={26} fill="#fff" />
            </g>
          );
        })}

        {/* confeti */}
        {frame > 6 &&
          Array.from({ length: 70 }).map((_, i) => {
            const speed = 5 + rnd(i + 1) * 6;
            const y = mod((frame - 6) * speed + rnd(i + 2) * 2200, 2300) - 250;
            const x = rnd(i) * 1080 + Math.sin(frame / 14 + i) * 24;
            return (
              <rect
                key={i}
                x={-8}
                y={-5}
                width={16}
                height={10}
                fill={CONFETTI[i % CONFETTI.length]}
                transform={`translate(${x} ${y}) rotate(${frame * (4 + rnd(i + 5) * 8) + i * 30})`}
              />
            );
          })}

        {/* destello del impacto */}
        <rect width={1080} height={1920} fill="#fff" opacity={1 - ramp(frame, 0, 14)} />
      </svg>
    </AbsoluteFill>
  );
};
