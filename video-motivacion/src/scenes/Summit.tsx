import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CHEER, PALETTES, Person, STAND_H, lerpPose, STAND } from "../Person";
import { Cloud, Flock, LightShafts, Mountains, PineTree, Sparkle, blobPath, smoothClosed } from "../art";
import { mod, ramp, rnd } from "../utils";

export const SUMMIT_FRAMES = 180;

const TOP = 1310;
const SCALE = 2.3;
const CONFETTI = ["#ff5a36", "#ffd23f", "#19c3a6", "#8b5cf6", "#ff6fae", "#3aa0ff", "#ffffff"];

/** Pieza de confeti: cinta, estrella o pétalo que gira y se voltea al caer. */
const Confetto: React.FC<{ i: number; frame: number }> = ({ i, frame }) => {
  const speed = 5 + rnd(i + 1) * 6;
  const y = mod((frame - 6) * speed + rnd(i + 2) * 2200, 2300) - 250;
  const x = rnd(i) * 1080 + Math.sin(frame / 14 + i) * 30;
  const flip = Math.cos(frame / 5 + i * 2);
  const kind = i % 3;
  const color = CONFETTI[i % CONFETTI.length];
  return (
    <g transform={`translate(${x} ${y}) rotate(${frame * (3 + rnd(i + 5) * 6) + i * 30}) scale(1 ${flip})`}>
      {kind === 0 && <path d="M -9 0 Q -4 -6 0 0 Q 4 6 9 0 L 9 3 Q 4 9 0 3 Q -4 -3 -9 3 Z" fill={color} />}
      {kind === 1 && (
        <path d="M 0 -9 L 2.6 -2.8 L 9 -2.4 L 4 1.6 L 5.6 8 L 0 4.4 L -5.6 8 L -4 1.6 L -9 -2.4 L -2.6 -2.8 Z" fill={color} />
      )}
      {kind === 2 && <path d="M 0 -8 Q 7 0 0 8 Q -7 0 0 -8 Z" fill={color} />}
    </g>
  );
};

export const Summit: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame + 540;
  const shake = frame < 10 ? Math.sin(frame * 5) * (10 - frame) * 1.2 : 0;
  const tt = ramp(frame, 0, 10);
  const jump = frame > 12 ? Math.abs(Math.sin((frame - 12) / 9)) * 34 : 0;
  const pose = lerpPose(STAND, CHEER, tt);
  const pulse = 1 + Math.sin(frame / 10) * 0.035;

  const crowd = [
    { x: 120, y: 1640, pal: 1, s: 1.15 },
    { x: 230, y: 1640, pal: 2, s: 1.05 },
    { x: 340, y: 1640, pal: 3, s: 1.2 },
    { x: 740, y: 1640, pal: 4, s: 1.2 },
    { x: 850, y: 1640, pal: 5, s: 1.05 },
    { x: 960, y: 1640, pal: 6, s: 1.15 },
    { x: 80, y: 1790, pal: 5, s: 1.4 },
    { x: 1000, y: 1790, pal: 2, s: 1.4 },
  ];

  const flag = (dx: number) => Math.sin(frame / 6 + dx) * 10;
  const flagPath = `M740 1044 Q ${780 + flag(0)} ${1026 + flag(1) * 0.6} ${826 + flag(2)} 1046 Q ${870 + flag(3)} ${1060 + flag(4) * 0.5} ${900 + flag(5) * 1.2} 1050 L ${896 + flag(5)} 1092 Q ${850 + flag(3)} ${1100 + flag(2) * 0.4} ${816 + flag(2)} 1086 Q ${780 + flag(1)} ${1070 + flag(0) * 0.5} 740 1096 Z`;

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
            <stop offset="0" stopColor="#7b6aa8" />
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
            <path key={i} d="M0 0 L -60 -1200 L 60 -1200 Z" fill="#fff6c0" transform={`rotate(${i * (360 / 14)})`} />
          ))}
        </g>
        <LightShafts x={540} y={960} t={frame} count={9} len={1300} op={0.12} />
        <g transform={`translate(540 960) scale(${pulse})`}>
          <circle r={400} fill="url(#sumSun)" />
          <path d={blobPath(172, 172, 6, 0.03, 14, frame / 14, 0.012)} fill="#fff6b8" />
        </g>

        <Flock t={frame} y={820} speed={4} count={6} seed={1} color="#3a2056" />

        {/* montañas lejanas con nieve */}
        <Mountains base={1500} amp={380} seed={3.3} fill="#a65aa0" scroll={frame * 0.6} shadow={0.16} />

        {/* la cima: roca facetada con nieve */}
        <path
          d={`M -300 1920 L 90 1700 L 250 1540 L 330 1460 L 400 1380 L 440 ${TOP} L 640 ${TOP} L 700 1390 L 760 1460 L 860 1560 L 990 1700 L 1380 1920 Z`}
          fill="url(#rock)"
        />
        <path d={`M 440 ${TOP} L 400 1380 L 330 1460 L 380 1500 L 420 1420 L 470 1500 L 520 1380 Z`} fill="#fff" opacity={0.08} />
        <path d="M 640 1310 L 700 1390 L 760 1460 L 700 1500 L 660 1420 L 600 1480 L 560 1350 Z" fill="#0a0630" opacity={0.2} />
        <path d="M 330 1460 L 250 1540 L 90 1700 L 300 1640 L 380 1560 Z" fill="#0a0630" opacity={0.15} />
        <path
          d="M 440 1310 L 640 1310 L 624 1344 L 600 1338 L 584 1372 L 548 1340 L 520 1380 L 496 1342 L 466 1360 Z"
          fill="#fff"
          opacity={0.95}
        />
        <path d="M 440 1310 L 400 1380 L 430 1368 L 450 1392 L 466 1360 Z" fill="#fff" opacity={0.9} />
        <path
          d={smoothClosed([
            [420, 1306],
            [470, 1296],
            [560, 1298],
            [630, 1296],
            [662, 1306],
            [640, 1322],
            [450, 1322],
          ])}
          fill="#c8bdf0"
        />
        <PineTree x={250} y={1600} s={0.6} t={t} seed={1} color="#2a3f7a" light="#4660b0" />
        <PineTree x={850} y={1620} s={0.55} t={t} seed={2} color="#2a3f7a" light="#4660b0" />

        {/* repisas con el público */}
        <path d="M 40 1650 Q 230 1626 420 1650 L 416 1668 Q 230 1690 44 1668 Z" fill="#4b3a7c" />
        <path d="M 680 1650 Q 860 1626 1040 1650 L 1036 1668 Q 860 1690 684 1668 Z" fill="#4b3a7c" />
        <path d="M 0 1800 Q 100 1780 200 1800 L 200 1820 Q 100 1840 0 1820 Z" fill="#3a2c66" />
        <path d="M 880 1800 Q 980 1780 1080 1800 L 1080 1820 Q 980 1840 880 1820 Z" fill="#3a2c66" />

        {/* bandera ondeando */}
        <line x1={740} y1={TOP - 4} x2={740} y2={1040} stroke="#fff" strokeWidth={8} strokeLinecap="round" />
        <path d={flagPath} fill="#ff5a36" />
        <path
          d={`M740 1044 Q ${780 + flag(0)} ${1026 + flag(1) * 0.6} ${826 + flag(2)} 1046 L ${822 + flag(2)} 1060 Q 780 1042 740 1058 Z`}
          fill="#ff8a5c"
          opacity={0.7}
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
                t={t + i * 11}
              />
            </g>
          );
        })}

        {/* personaje principal */}
        <ellipse cx={560} cy={TOP + 4} rx={150 - jump * 0.8} ry={14} fill="rgba(0,0,0,0.3)" />
        <Person x={540} y={TOP - STAND_H * SCALE - jump} scale={SCALE} pose={pose} palette={PALETTES[0]} t={t} />

        {/* nubes al frente */}
        {[0, 1, 2].map((i) => (
          <Cloud
            key={i}
            x={mod(i * 520 + frame * (0.9 + i * 0.3), 1800) - 300}
            y={1580 + i * 120}
            s={1.2}
            seed={i * 4 + 1}
            color="#fff6f2"
            shade="#ffc2c8"
            opacity={0.9}
            t={frame}
          />
        ))}

        {/* destellos alrededor del protagonista */}
        {Array.from({ length: 10 }).map((_, i) => (
          <Sparkle
            key={i}
            x={540 + Math.cos(i * 0.63 + frame / 40) * (230 + (i % 3) * 40)}
            y={920 + Math.sin(i * 0.63 + frame / 40) * (230 + (i % 3) * 30)}
            s={16 + (i % 3) * 6}
            t={frame}
            phase={i * 0.8}
          />
        ))}

        {/* confeti */}
        {frame > 6 && Array.from({ length: 70 }).map((_, i) => <Confetto key={i} i={i} frame={frame} />)}

        {/* destello del impacto */}
        <rect width={1080} height={1920} fill="#fff" opacity={1 - ramp(frame, 0, 14)} />
      </svg>
    </AbsoluteFill>
  );
};
