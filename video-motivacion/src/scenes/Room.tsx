import React from "react";
import { AbsoluteFill, interpolateColors, useCurrentFrame } from "remotion";
import {
  FOOT,
  PALETTES,
  Person,
  SHIN_LEN,
  SIT,
  SIT_UP,
  STAND,
  STAND_H,
  STRETCH,
  lerpPose,
} from "../Person";
import { Sparkle, blobPath, smoothClosed } from "../art";
import { lerp, mod, ramp, rnd } from "../utils";

const FLOOR = 1480;
const SCALE = 2.3;
const ALARM_AT = 120;

export const ROOM_FRAMES = 254;

/** Hoja alargada de planta con balanceo. */
const PlantLeaf: React.FC<{ rot: number; len: number; t: number; i: number }> = ({ rot, len, t, i }) => (
  <path
    transform={`rotate(${rot + Math.sin(t / 18 + i) * 3})`}
    d={`M 0 0 Q ${len * 0.3} ${-len * 0.12} ${len} ${-len * 0.05} Q ${len * 0.35} ${len * 0.16} 0 0 Z`}
    fill={i % 2 ? "#3fa066" : "#2f8556"}
    style={{ transformOrigin: "0 0" }}
  />
);

export const Room: React.FC = () => {
  const frame = useCurrentFrame();
  const dawn = ramp(frame, ALARM_AT, 250);

  const wall = interpolateColors(dawn, [0, 1], ["#18214d", "#f2b58f"]);
  const wall2 = interpolateColors(dawn, [0, 1], ["#111a40", "#e59e7a"]);
  const floor = interpolateColors(dawn, [0, 1], ["#2b1f26", "#8a5a3c"]);
  const skyTop = interpolateColors(dawn, [0, 1], ["#080c2a", "#ff9a5a"]);
  const skyBot = interpolateColors(dawn, [0, 1], ["#1b2a6b", "#ffd9a0"]);

  // --- pose del personaje ---------------------------------------------------
  const breathe = Math.sin(frame / 9) * 2;
  const liftHead = ramp(frame, 128, 150);
  const rise = ramp(frame, 156, 200);
  const stretch = ramp(frame, 200, 232);

  let pose = lerpPose(SIT, SIT_UP, liftHead);
  pose = lerpPose(pose, STAND, rise);
  pose = lerpPose(pose, STRETCH, stretch);
  if (frame < 128) {
    pose = { ...pose, torso: pose.torso + breathe, head: pose.head + breathe * 0.6 };
  }
  const hipX = lerp(540, 650, rise);
  const hipY = lerp(FLOOR - (SHIN_LEN + FOOT) * SCALE, FLOOR - STAND_H * SCALE, rise);

  // --- despertador ----------------------------------------------------------
  const ringing = frame >= ALARM_AT && frame < 205;
  const shake = ringing ? Math.sin(frame * 2.6) * 5 : 0;

  // cortinas que se mecen con la brisa
  const wind = Math.sin(frame / 22) * 10 * (0.4 + dawn);
  const curtainL = `M 596 690 Q ${648 + wind} 900 ${612 + wind * 0.6} 1130 L ${668 + wind * 0.4} 1130 Q ${704 + wind} 900 ${668 + wind * 0.3} 690 Z`;
  const curtainR = `M 1004 690 Q ${952 - wind} 900 ${988 - wind * 0.6} 1130 L ${936 - wind * 0.4} 1130 Q ${900 - wind} 900 ${936 - wind * 0.3} 690 Z`;

  const sunC = { x: 810, y: 1150 - dawn * 300 };

  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <defs>
          <clipPath id="win">
            <rect x={640} y={700} width={320} height={420} rx={6} />
          </clipPath>
          <linearGradient id="winSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={skyTop} />
            <stop offset="1" stopColor={skyBot} />
          </linearGradient>
          <linearGradient id="posterSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4b3b8f" />
            <stop offset="1" stopColor="#ffa86b" />
          </linearGradient>
          <linearGradient id="wallG" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={wall2} />
            <stop offset="0.6" stopColor={wall} />
            <stop offset="1" stopColor={wall2} />
          </linearGradient>
          <linearGradient id="blanket" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8aa3f0" />
            <stop offset="1" stopColor="#5b78d4" />
          </linearGradient>
          <linearGradient id="beam" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff0b8" stopOpacity="0.55" />
            <stop offset="1" stopColor="#fff0b8" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* pared y piso */}
        <rect x={0} y={0} width={1080} height={FLOOR} fill="url(#wallG)" />
        {/* papel tapiz con hojas */}
        {Array.from({ length: 26 }).map((_, i) => (
          <path
            key={i}
            transform={`translate(${(i % 6) * 190 + (Math.floor(i / 6) % 2) * 95 + 30} ${620 + Math.floor(i / 6) * 190}) rotate(${(i * 37) % 90 - 45})`}
            d="M 0 -16 Q 12 -4 0 16 Q -12 -4 0 -16 Z"
            fill="#ffffff"
            opacity={0.05}
          />
        ))}
        <rect x={0} y={FLOOR} width={1080} height={1920 - FLOOR} fill={floor} />
        <rect x={0} y={FLOOR - 16} width={1080} height={18} fill="rgba(0,0,0,0.25)" />
        {Array.from({ length: 6 }).map((_, i) => (
          <path
            key={i}
            d={`M 0 ${FLOOR + 70 + i * 70} Q 270 ${FLOOR + 62 + i * 70} 540 ${FLOOR + 72 + i * 70} T 1080 ${FLOOR + 70 + i * 70}`}
            stroke="rgba(0,0,0,0.2)"
            strokeWidth={3}
            fill="none"
          />
        ))}

        {/* ventana */}
        <g clipPath="url(#win)">
          <rect x={640} y={700} width={320} height={420} fill="url(#winSky)" />
          {Array.from({ length: 14 }).map((_, i) => (
            <g key={i} opacity={1 - dawn}>
              <Sparkle x={655 + rnd(i) * 290} y={715 + rnd(i + 40) * 280} s={4 + rnd(i + 9) * 6} t={frame} phase={i} color="#fff" />
            </g>
          ))}
          {/* luna con cráteres */}
          <g transform={`translate(760 ${810 + dawn * 330})`} opacity={1 - dawn * 0.9}>
            <path d={blobPath(46, 46, 3, 0.04, 12)} fill="#f6f1d8" />
            <path d={blobPath(10, 8, 5, 0.3, 7)} transform="translate(-14 -10)" fill="#d9d2b0" />
            <path d={blobPath(7, 6, 8, 0.3, 7)} transform="translate(16 12)" fill="#d9d2b0" />
            <path d={blobPath(5, 5, 9, 0.3, 7)} transform="translate(10 -20)" fill="#d9d2b0" />
          </g>
          <circle cx={sunC.x} cy={sunC.y} r={120} fill="#fff3b0" opacity={0.35 * dawn} />
          <path
            transform={`translate(${sunC.x} ${sunC.y})`}
            d={blobPath(70, 70, 2, 0.05, 12, frame / 15, 0.02)}
            fill="#ffe066"
            opacity={dawn}
          />
          <path
            d="M640 1090 L690 1030 L720 1048 L780 990 L840 1050 L880 1020 L960 1080 L960 1120 L640 1120 Z"
            fill="#2c2152"
            opacity={0.85}
          />
        </g>
        <rect x={640} y={700} width={320} height={420} rx={6} fill="none" stroke="#e9e4f5" strokeWidth={14} />
        <line x1={800} y1={700} x2={800} y2={1120} stroke="#e9e4f5" strokeWidth={10} />
        <line x1={640} y1={910} x2={960} y2={910} stroke="#e9e4f5" strokeWidth={10} />
        <rect x={620} y={1120} width={360} height={20} rx={6} fill="#cfc8e6" />
        <path d={curtainL} fill="#6d4fc2" />
        <path d={curtainL} fill="none" stroke="#5a3fa8" strokeWidth={4} transform="translate(14 0)" opacity={0.6} />
        <path d={curtainR} fill="#6d4fc2" />
        <path d={curtainR} fill="none" stroke="#5a3fa8" strokeWidth={4} transform="translate(-14 0)" opacity={0.6} />

        {/* haz de sol que entra al cuarto, con motas de polvo */}
        <path d="M 640 1120 L 960 1120 L 520 1500 L 140 1500 Z" fill="url(#beam)" opacity={dawn * 0.8} />
        {Array.from({ length: 16 }).map((_, i) => (
          <g key={i} opacity={dawn}>
            <Sparkle
              x={300 + mod(rnd(i) * 500 + frame * (0.4 + rnd(i + 3)), 500)}
              y={1130 + mod(rnd(i + 8) * 360 + Math.sin(frame / 30 + i) * 18 + frame * 0.2, 360)}
              s={5}
              t={frame}
              phase={i}
            />
          </g>
        ))}

        {/* póster de la montaña */}
        <rect x={90} y={760} width={290} height={290} rx={10} fill="#2a1d44" />
        <rect x={106} y={776} width={258} height={258} rx={4} fill="url(#posterSky)" />
        <path transform="translate(290 870)" d={blobPath(30, 30, 6, 0.05, 10)} fill="#ffe066" />
        <path d="M106 1034 L150 940 L190 890 L236 960 L270 930 L300 940 L364 1034 Z" fill="#2c2152" />
        <path d="M190 890 L170 925 L184 916 L190 930 L204 914 L214 924 Z" fill="#fff" />
        <line x1={190} y1={890} x2={190} y2={860} stroke="#fff" strokeWidth={3} />
        <path d={`M190 860 Q 204 ${860 + Math.sin(frame / 6) * 3} 216 866 Q 204 ${872 + Math.sin(frame / 6) * 3} 190 876 Z`} fill="#ff5a36" />

        {/* planta en maceta */}
        <g transform="translate(450 1480)">
          <path d="M -44 -90 L 44 -90 L 34 0 L -34 0 Z" fill="#c4683e" />
          <path d="M -44 -90 L 44 -90 L 42 -76 L -42 -76 Z" fill="#d9794c" />
          <g transform="translate(0 -88)">
            {[-70, -48, -26, -8, 12, 34].map((r, i) => (
              <PlantLeaf key={i} rot={r - 90} len={90 + (i % 3) * 22} t={frame} i={i} />
            ))}
          </g>
        </g>

        {/* alfombra con patrón */}
        <ellipse cx={720} cy={1560} rx={340} ry={42} fill="#5a3fa8" opacity={0.75} />
        <ellipse cx={720} cy={1560} rx={260} ry={28} fill="#7a5be0" opacity={0.6} />
        {Array.from({ length: 9 }).map((_, i) => (
          <path key={i} transform={`translate(${470 + i * 62} 1560)`} d="M 0 -9 Q 8 0 0 9 Q -8 0 0 -9 Z" fill="#c9b8ff" opacity={0.6} />
        ))}

        {/* cama con pliegues */}
        <rect x={10} y={1230} width={46} height={250} rx={14} fill="#5b3a2a" />
        <path d="M 10 1230 Q 33 1210 56 1230" fill="#6b4532" />
        <rect x={30} y={1420} width={600} height={60} rx={8} fill="#6b4532" />
        <path d="M 30 1400 Q 30 1372 60 1372 L 600 1372 Q 622 1372 622 1400 L 622 1436 L 30 1436 Z" fill="#5b78d4" />
        <path
          d="M 30 1390 Q 150 1370 280 1388 Q 330 1396 372 1390 L 372 1436 L 30 1436 Z"
          fill="url(#blanket)"
        />
        <path d="M 80 1396 Q 100 1412 90 1434 M 170 1392 Q 190 1410 178 1434 M 260 1394 Q 276 1412 268 1434" stroke="#4c66bd" strokeWidth={3} fill="none" opacity={0.6} strokeLinecap="round" />
        <path d={smoothClosed([[40, 1366], [90, 1334], [150, 1340], [182, 1362], [150, 1380], [80, 1384]])} fill="#f4f1fb" />
        <path d="M 60 1366 Q 110 1352 160 1364" stroke="#d7d1ea" strokeWidth={3} fill="none" />

        {/* mesita, lámpara y despertador */}
        <rect x={840} y={1340} width={170} height={140} rx={10} fill="#6b4532" />
        <rect x={856} y={1356} width={138} height={50} rx={6} fill="rgba(0,0,0,0.18)" />
        <circle cx={925} cy={1381} r={5} fill="#e0b98a" />
        <rect x={856} y={1412} width={138} height={50} rx={6} fill="rgba(0,0,0,0.18)" />
        <circle cx={925} cy={1437} r={5} fill="#e0b98a" />
        <g transform={`translate(${925 + shake} 1296)`}>
          {ringing &&
            [-1, 1].map((d) =>
              [0, 1].map((k) => (
                <path
                  key={`${d}${k}`}
                  d={`M ${d * (52 + k * 16)} -20 Q ${d * (62 + k * 16)} 0 ${d * (52 + k * 16)} 20`}
                  stroke="#ffd23f"
                  strokeWidth={5}
                  strokeLinecap="round"
                  fill="none"
                  opacity={0.5 + 0.5 * Math.sin(frame * 1.2 + k)}
                />
              )),
            )}
          <path d="M -34 -34 Q -26 -56 -14 -40 Z" fill="#ff5a36" />
          <path d="M 34 -34 Q 26 -56 14 -40 Z" fill="#ff5a36" />
          <path d={blobPath(42, 42, 12, 0.03, 12)} fill={ringing ? "#ff5a36" : "#d9d4ea"} />
          <path d={blobPath(32, 32, 13, 0.03, 12)} fill="#fffaf0" />
          <line x1={0} y1={0} x2={Math.sin(frame / 40) * 16} y2={-Math.cos(frame / 40) * 16} stroke="#222" strokeWidth={3} strokeLinecap="round" />
          <line x1={0} y1={0} x2={13} y2={6} stroke="#222" strokeWidth={4} strokeLinecap="round" />
        </g>

        {/* personaje */}
        <ellipse cx={hipX + 40} cy={FLOOR + 8} rx={150} ry={16} fill="rgba(0,0,0,0.28)" />
        <Person x={hipX} y={hipY} scale={SCALE} pose={pose} palette={PALETTES[0]} t={frame} />

        {/* oscuridad de la noche */}
        <rect x={0} y={0} width={1080} height={1920} fill="#050822" opacity={0.38 * (1 - dawn)} />
      </svg>
    </AbsoluteFill>
  );
};
