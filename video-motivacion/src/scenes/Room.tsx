import React from "react";
import { AbsoluteFill, interpolateColors, useCurrentFrame } from "remotion";
import { Person, PALETTES, SIT, SIT_UP, STAND, STRETCH, lerpPose } from "../Person";
import { lerp, ramp, rnd } from "../utils";

const FLOOR = 1480;
const SCALE = 2.6;
const ALARM_AT = 120;

export const ROOM_FRAMES = 254;

export const Room: React.FC = () => {
  const frame = useCurrentFrame();
  const dawn = ramp(frame, ALARM_AT, 250);

  const wall = interpolateColors(dawn, [0, 1], ["#18214d", "#f2b58f"]);
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
  const hipY = lerp(FLOOR - 45 * SCALE - 2, FLOOR - 90 * SCALE, rise);

  // --- despertador ----------------------------------------------------------
  const ringing = frame >= ALARM_AT && frame < 205;
  const shake = ringing ? Math.sin(frame * 2.6) * 5 : 0;

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
        </defs>

        {/* pared y piso */}
        <rect x={0} y={0} width={1080} height={FLOOR} fill={wall} />
        <rect x={0} y={FLOOR} width={1080} height={1920 - FLOOR} fill={floor} />
        <rect x={0} y={FLOOR - 14} width={1080} height={16} fill="rgba(0,0,0,0.25)" />
        {Array.from({ length: 6 }).map((_, i) => (
          <line
            key={i}
            x1={0}
            x2={1080}
            y1={FLOOR + 70 + i * 70}
            y2={FLOOR + 70 + i * 70}
            stroke="rgba(0,0,0,0.18)"
            strokeWidth={3}
          />
        ))}

        {/* ventana */}
        <g clipPath="url(#win)">
          <rect x={640} y={700} width={320} height={420} fill="url(#winSky)" />
          {Array.from({ length: 22 }).map((_, i) => (
            <circle
              key={i}
              cx={650 + rnd(i) * 300}
              cy={710 + rnd(i + 40) * 300}
              r={1.5 + rnd(i + 9) * 2.5}
              fill="#fff"
              opacity={(1 - dawn) * (0.5 + 0.5 * Math.sin(frame / 8 + i))}
            />
          ))}
          <circle cx={760} cy={810 + dawn * 330} r={46} fill="#f6f1d8" opacity={1 - dawn * 0.9} />
          <circle cx={778} cy={800 + dawn * 330} r={40} fill={skyTop} opacity={1 - dawn * 0.9} />
          <circle cx={810} cy={1150 - dawn * 300} r={110} fill="#fff3b0" opacity={0.35 * dawn} />
          <circle cx={810} cy={1150 - dawn * 300} r={70} fill="#ffe066" opacity={dawn} />
          <path
            d="M640 1090 L720 1010 L790 1070 L870 990 L960 1080 L960 1120 L640 1120 Z"
            fill="#2c2152"
            opacity={0.85}
          />
        </g>
        <rect x={640} y={700} width={320} height={420} rx={6} fill="none" stroke="#e9e4f5" strokeWidth={14} />
        <line x1={800} y1={700} x2={800} y2={1120} stroke="#e9e4f5" strokeWidth={10} />
        <line x1={640} y1={910} x2={960} y2={910} stroke="#e9e4f5" strokeWidth={10} />
        <rect x={620} y={1120} width={360} height={20} rx={6} fill="#cfc8e6" />
        <path d="M600 690 Q640 900 610 1130 L660 1130 Q690 900 660 690 Z" fill="#6d4fc2" />
        <path d="M1000 690 Q960 900 990 1130 L940 1130 Q910 900 940 690 Z" fill="#6d4fc2" />

        {/* póster de la montaña */}
        <rect x={90} y={760} width={290} height={290} rx={10} fill="#2a1d44" />
        <rect x={106} y={776} width={258} height={258} rx={4} fill="url(#posterSky)" />
        <circle cx={290} cy={870} r={30} fill="#ffe066" />
        <path d="M106 1034 L190 890 L250 970 L300 920 L364 1034 Z" fill="#2c2152" />
        <path d="M190 890 L172 920 L190 912 L208 922 Z" fill="#fff" />
        <line x1={190} y1={890} x2={190} y2={860} stroke="#fff" strokeWidth={3} />
        <path d="M190 860 L214 868 L190 876 Z" fill="#ff5a36" />

        {/* alfombra */}
        <ellipse cx={720} cy={1560} rx={340} ry={42} fill="#5a3fa8" opacity={0.75} />
        <ellipse cx={720} cy={1560} rx={260} ry={28} fill="#7a5be0" opacity={0.6} />

        {/* cama */}
        <rect x={10} y={1230} width={46} height={250} rx={10} fill="#5b3a2a" />
        <rect x={30} y={1420} width={600} height={60} rx={8} fill="#6b4532" />
        <rect x={30} y={1372} width={590} height={64} rx={26} fill="#5b7bd5" />
        <rect x={30} y={1384} width={340} height={52} rx={22} fill="#7d98ea" />
        <ellipse cx={110} cy={1362} rx={72} ry={28} fill="#f4f1fb" />

        {/* mesita y despertador */}
        <rect x={840} y={1340} width={170} height={140} rx={10} fill="#6b4532" />
        <rect x={856} y={1380} width={138} height={8} rx={4} fill="rgba(0,0,0,0.25)" />
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
          <circle cx={-26} cy={-38} r={14} fill="#ff5a36" />
          <circle cx={26} cy={-38} r={14} fill="#ff5a36" />
          <circle cx={0} cy={0} r={42} fill={ringing ? "#ff5a36" : "#d9d4ea"} />
          <circle cx={0} cy={0} r={32} fill="#fffaf0" />
          <line x1={0} y1={0} x2={0} y2={-22} stroke="#222" strokeWidth={4} strokeLinecap="round" />
          <line x1={0} y1={0} x2={15} y2={6} stroke="#222" strokeWidth={4} strokeLinecap="round" />
        </g>

        {/* personaje */}
        <ellipse cx={hipX + 40} cy={FLOOR + 8} rx={150} ry={16} fill="rgba(0,0,0,0.28)" />
        <Person x={hipX} y={hipY} scale={SCALE} pose={pose} palette={PALETTES[0]} />

        {/* oscuridad de la noche */}
        <rect x={0} y={0} width={1080} height={1920} fill="#050822" opacity={0.38 * (1 - dawn)} />
      </svg>
    </AbsoluteFill>
  );
};
