import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Person, PALETTES, STAND_H, climbPose } from "../Person";
import { mod } from "../utils";

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
  const s = frame / P;
  const ox = -s * DX;
  const oy = s * DY;
  const phase = (frame / P) * Math.PI; // un escalón por cada pierna
  const bob = Math.abs(Math.cos(phase)) * 10;

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
      />
    );
  };

  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <defs>
          <linearGradient id="climbSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5b3a9a" />
            <stop offset="0.5" stopColor="#ff7aa0" />
            <stop offset="1" stopColor="#ffd08a" />
          </linearGradient>
          <linearGradient id="stone" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6d5a98" />
            <stop offset="1" stopColor="#2c2150" />
          </linearGradient>
          <radialGradient id="climbSun">
            <stop offset="0" stopColor="#fff2b0" stopOpacity="0.85" />
            <stop offset="1" stopColor="#fff2b0" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#climbSky)" />

        <circle cx={800} cy={940} r={380} fill="url(#climbSun)" />
        <circle cx={800} cy={940} r={150} fill="#fff1a8" />

        {[0, 1, 2].map((i) => {
          const x = mod(i * 520 - frame * (0.7 + i * 0.2), 1500) - 200;
          return (
            <g key={i} opacity={0.6}>
              <ellipse cx={x} cy={760 + i * 110} rx={130} ry={28} fill="#fff" />
              <ellipse cx={x + 70} cy={742 + i * 110} rx={80} ry={26} fill="#fff" />
            </g>
          );
        })}

        {/* montañas con parallax */}
        <g transform={`translate(${ox * 0.06} ${oy * 0.06})`}>
          <path
            d="M -200 1500 L 100 1050 L 280 1220 L 520 900 L 760 1180 L 980 880 L 1300 1300 L 1300 1900 L -200 1900 Z"
            fill="#a24f9c"
          />
        </g>
        <g transform={`translate(${ox * 0.14} ${oy * 0.14})`}>
          <path
            d="M -300 1650 L 60 1230 L 300 1420 L 640 1000 L 900 1400 L 1100 1200 L 1500 1650 L 1500 2000 L -300 2000 Z"
            fill="#6f3a8c"
          />
          {/* bandera en la cima */}
          <line x1={640} y1={1000} x2={640} y2={930} stroke="#fff" strokeWidth={4} />
          <path d={`M640 930 L ${676 + Math.sin(frame / 5) * 4} 942 L 640 954 Z`} fill="#ff5a36" />
        </g>

        {/* escalera */}
        <g transform={`translate(${ox} ${oy})`}>
          <path d={STAIRS} fill="url(#stone)" />
          {Array.from({ length: 41 }).map((_, k) => {
            const i = k - 16;
            const x = FOOT_X + i * DX;
            const y = FOOT_Y - i * DY;
            return (
              <rect
                key={i}
                x={x - DX / 2}
                y={y}
                width={DX}
                height={10}
                rx={3}
                fill="#b9a7e6"
                opacity={0.9}
              />
            );
          })}
        </g>

        {/* seguidores pequeños */}
        {follower(430, 1.25, 3, 1.2)}
        {follower(250, 1.5, 4, 2.4)}

        {/* personaje principal */}
        <ellipse cx={FOOT_X + 20} cy={FOOT_Y + 8} rx={110} ry={12} fill="rgba(0,0,0,0.3)" />
        <Person
          x={FOOT_X}
          y={FOOT_Y - STAND_H * SCALE - bob}
          scale={SCALE}
          pose={climbPose(phase)}
          palette={PALETTES[0]}
        />
      </svg>
    </AbsoluteFill>
  );
};
