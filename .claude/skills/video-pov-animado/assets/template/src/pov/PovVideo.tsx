import React from "react";
import { AbsoluteFill, Audio, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/fonts";
import { Mascot, OUT, Tag } from "./Mascot";
import type { Hand } from "./Mascot";
import { Cloud, Mountains, Sparkle, blobPath } from "../art";
import { FONT, mod, ramp, rnd } from "../utils";

loadFont({
  family: "Montserrat",
  url: staticFile("fonts/Montserrat-Black.ttf"),
  weight: "900",
});

const CX = 620;
const CY = 1390;
const S = 1.15;
const W = (x: number, y: number): [number, number] => [CX + x * S, CY + y * S];

const ol = { stroke: OUT, strokeWidth: 6, strokeLinejoin: "round", strokeLinecap: "round" } as const;

// --- utilería ----------------------------------------------------------------
const Clock: React.FC<{ x: number; y: number; s?: number; rot?: number; ring?: boolean; t: number }> = ({
  x,
  y,
  s = 1,
  rot = 0,
  ring,
  t,
}) => {
  const shake = ring ? Math.sin(t * 2.7) * 6 : 0;
  return (
    <g transform={`translate(${x + shake} ${y}) rotate(${rot + (ring ? Math.sin(t * 2.7) * 4 : 0)}) scale(${s})`}>
      {ring &&
        [-1, 1].map((d) =>
          [0, 1].map((k) => (
            <path
              key={`${d}${k}`}
              d={`M ${d * (92 + k * 26)} -40 Q ${d * (112 + k * 26)} 0 ${d * (92 + k * 26)} 40`}
              stroke="#ffd23f"
              strokeWidth={8}
              strokeLinecap="round"
              fill="none"
              opacity={0.45 + 0.55 * Math.abs(Math.sin(t * 0.7 + k))}
            />
          )),
        )}
      <path d="M -50 80 L -64 112 L -36 96 Z M 50 80 L 64 112 L 36 96 Z" fill={OUT} />
      <path d="M -52 -62 Q -62 -104 -22 -92 Z" fill="#ffb02e" {...ol} />
      <path d="M 52 -62 Q 62 -104 22 -92 Z" fill="#ffb02e" {...ol} />
      <circle r={76} fill="#e0453a" {...ol} />
      <circle r={58} fill="#fff8ee" {...ol} strokeWidth={5} />
      <path d="M 0 -44 V -34 M 0 44 V 34 M -44 0 H -34 M 44 0 H 34" stroke={OUT} strokeWidth={5} strokeLinecap="round" />
      <path d={`M 0 0 L ${Math.sin(t / 30) * 24} ${-Math.cos(t / 30) * 24}`} stroke={OUT} strokeWidth={6} strokeLinecap="round" />
      <path d="M 0 0 L 22 12" stroke={OUT} strokeWidth={7} strokeLinecap="round" />
    </g>
  );
};

const Barbell: React.FC<{ x1: number; x2: number; y: number }> = ({ x1, x2, y }) => (
  <g>
    <rect x={x1} y={y - 12} width={x2 - x1} height={24} fill="#b7bcc9" {...ol} />
    {[x1, x2].map((x, i) => {
      const d = i === 0 ? -1 : 1;
      return (
        <g key={i}>
          <rect x={x + d * 20 - 20} y={y - 76} width={40} height={152} rx={10} fill="#3b4256" {...ol} />
          <rect x={x + d * 62 - 16} y={y - 56} width={32} height={112} rx={9} fill="#566080" {...ol} />
        </g>
      );
    })}
  </g>
);

const Pencil: React.FC = () => (
  <g transform="rotate(35)" {...ol} strokeWidth={5}>
    <rect x={-8} y={-96} width={16} height={92} fill="#ffd23f" />
    <path d="M -8 -4 L 0 24 L 8 -4 Z" fill="#f2d3a0" />
    <path d="M -3 14 L 0 24 L 3 14 Z" fill={OUT} />
    <rect x={-8} y={-112} width={16} height={16} rx={3} fill="#ff8fa6" />
  </g>
);

const Notebook: React.FC<{ f: number }> = ({ f }) => {
  const lines = Math.min(5, Math.floor(f / 18));
  return (
    <g transform="rotate(-4)">
      <rect x={-30} y={-120} width={400} height={250} rx={14} fill="#f2e6c9" {...ol} />
      {Array.from({ length: 6 }).map((_, i) => (
        <rect key={i} x={-44} y={-100 + i * 38} width={26} height={14} rx={7} fill="#c9cbd8" {...ol} strokeWidth={4} />
      ))}
      {Array.from({ length: 5 }).map((_, i) => (
        <path
          key={i}
          d={`M 30 ${-78 + i * 40} q 30 -14 60 0 t 60 0 t 60 0 t 50 0`}
          stroke="#2b3a67"
          strokeWidth={5}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={400}
          strokeDashoffset={i < lines ? 0 : i === lines ? 400 - ((f % 18) / 18) * 400 : 400}
        />
      ))}
    </g>
  );
};

const Trophy: React.FC<{ t: number }> = ({ t }) => (
  <g transform="translate(0 -128)">
    <path d="M -84 -70 Q -128 -70 -118 -20 Q -108 20 -56 22" fill="none" stroke={OUT} strokeWidth={16} strokeLinecap="round" />
    <path d="M 84 -70 Q 128 -70 118 -20 Q 108 20 56 22" fill="none" stroke={OUT} strokeWidth={16} strokeLinecap="round" />
    <path d="M -84 -70 Q -122 -70 -112 -22 Q -104 14 -56 18" fill="none" stroke="#ffc400" strokeWidth={8} strokeLinecap="round" />
    <path d="M 84 -70 Q 122 -70 112 -22 Q 104 14 56 18" fill="none" stroke="#ffc400" strokeWidth={8} strokeLinecap="round" />
    <path d="M -86 -86 H 86 Q 90 10 0 44 Q -90 10 -86 -86 Z" fill="#ffc400" {...ol} />
    <path d="M -58 -70 Q -62 -10 -30 20" stroke="#fff3a0" strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.8} />
    <path
      d="M 0 -64 L 11 -38 L 38 -36 L 17 -18 L 24 8 L 0 -6 L -24 8 L -17 -18 L -38 -36 L -11 -38 Z"
      fill="#fff3a0"
      stroke={OUT}
      strokeWidth={4}
      strokeLinejoin="round"
    />
    <rect x={-14} y={42} width={28} height={36} fill="#e5a900" {...ol} />
    <rect x={-52} y={76} width={104} height={32} rx={8} fill="#7a4a2a" {...ol} />
    <Sparkle x={-96} y={-96} s={20} t={t} color="#fff" />
    <Sparkle x={100} y={-60} s={16} t={t} phase={2} color="#fff" />
  </g>
);

const Mug: React.FC<{ t: number }> = ({ t }) => (
  <g>
    {[-1, 0, 1].map((i) => (
      <path
        key={i}
        d={`M ${i * 24} -10 q ${10 + Math.sin(t / 8 + i) * 8} -26 0 -50 t 0 -50`}
        stroke="#fff"
        strokeWidth={7}
        fill="none"
        strokeLinecap="round"
        opacity={0.5 + 0.2 * Math.sin(t / 6 + i)}
        transform={`translate(0 ${-Math.abs(Math.sin(t / 20 + i)) * 10})`}
      />
    ))}
    <path d="M 56 14 q 44 -4 40 36 q -4 34 -44 28" fill="none" stroke={OUT} strokeWidth={22} strokeLinecap="round" />
    <path d="M 56 14 q 40 -4 36 36 q -4 30 -40 24" fill="none" stroke="#f4f4f4" strokeWidth={10} strokeLinecap="round" />
    <path d="M -64 -4 H 64 L 54 96 Q 0 112 -54 96 Z" fill="#f4f4f4" {...ol} />
    <path d="M -64 -4 H 64 Q 0 20 -64 -4 Z" fill="#6b3f26" {...ol} strokeWidth={5} />
  </g>
);

const Window: React.FC<{ x: number; y: number; sky: string; moon?: boolean; t: number }> = ({ x, y, sky, moon, t }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={0} y={0} width={240} height={300} fill={sky} stroke={OUT} strokeWidth={8} />
    {moon && (
      <g transform="translate(90 90)">
        <path d={blobPath(44, 44, 3, 0.04, 12)} fill="#f6f1d8" {...ol} strokeWidth={4} />
        <path d={blobPath(40, 40, 3, 0.04, 12)} transform="translate(22 -8)" fill={sky} />
      </g>
    )}
    {moon &&
      [0, 1, 2, 3].map((i) => <Sparkle key={i} x={30 + i * 62} y={190 + (i % 2) * 40} s={10} t={t} phase={i} color="#fff" />)}
    <path d="M 120 0 V 300 M 0 150 H 240" stroke={OUT} strokeWidth={8} />
    <rect x={-14} y={296} width={268} height={20} fill="#c9cbd8" stroke={OUT} strokeWidth={6} />
  </g>
);

const Lamp: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M -10 -20 L -260 330 L 220 330 L 90 -20 Z" fill="#ffe7a0" opacity={0.16 + 0.03 * Math.sin(t / 7)} />
    <ellipse cx={0} cy={300} rx={70} ry={16} fill="#3a3a55" {...ol} />
    <path d="M 0 300 L -40 160 L 30 60" stroke={OUT} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M 0 300 L -40 160 L 30 60" stroke="#8a8fb0" strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M 10 30 L 100 20 L 80 78 L -2 88 Z" fill="#ffb02e" {...ol} transform="rotate(-10 40 50)" />
  </g>
);

const Confetti: React.FC<{ f: number }> = ({ f }) => (
  <g>
    {Array.from({ length: 60 }).map((_, i) => {
      const y = mod(f * (5 + rnd(i + 1) * 6) + rnd(i + 2) * 2000, 2300) - 250;
      const x = rnd(i) * 1080 + Math.sin(f / 14 + i) * 30;
      const flip = Math.cos(f / 5 + i * 2);
      const c = ["#ff5a36", "#ffd23f", "#19c3a6", "#8b5cf6", "#ff6fae", "#3aa0ff", "#fff"][i % 7];
      return (
        <g key={i} transform={`translate(${x} ${y}) rotate(${f * (3 + rnd(i + 5) * 6) + i * 30}) scale(1 ${flip})`}>
          {i % 3 === 0 && <path d="M -9 0 Q -4 -6 0 0 Q 4 6 9 0 L 9 3 Q 4 9 0 3 Q -4 -3 -9 3 Z" fill={c} />}
          {i % 3 === 1 && (
            <path d="M 0 -9 L 2.6 -2.8 L 9 -2.4 L 4 1.6 L 5.6 8 L 0 4.4 L -5.6 8 L -4 1.6 L -9 -2.4 L -2.6 -2.8 Z" fill={c} />
          )}
          {i % 3 === 2 && <path d="M 0 -8 Q 7 0 0 8 Q -7 0 0 -8 Z" fill={c} />}
        </g>
      );
    })}
  </g>
);

const Spot: React.FC<{ color?: string; op?: number }> = ({ color = "#cfe0ff", op = 0.12 }) => (
  <path d="M 420 470 L 660 470 L 1060 1920 L 20 1920 Z" fill={color} opacity={op} />
);

// --- escenas -----------------------------------------------------------------
type BeatProps = { f: number; t: number };

const Beat1: React.FC<BeatProps> = ({ f, t }) => {
  const [lx, ly] = W(-300, -50);
  return (
    <g>
      <rect y={470} width={1080} height={1450} fill="#16243a" />
      <Spot />
      <Window x={780} y={620} sky="#0d1535" moon t={t} />
      <Clock x={200} y={1250} s={1.35} ring t={t} />
      {["Z", "z", "z"].map((z, i) => (
        <text
          key={i}
          x={880 + i * 40}
          y={1250 - ((f * 1.2 + i * 30) % 160)}
          fontFamily={FONT}
          fontWeight={900}
          fontSize={70 - i * 12}
          fill="#cfe0ff"
          stroke={OUT}
          strokeWidth={5}
          paintOrder="stroke"
          opacity={0.9 - ((f * 1.2 + i * 30) % 160) / 200}
        >
          {z}
        </text>
      ))}
      <Mascot
        cx={CX}
        cy={CY}
        s={S}
        mood="tired"
        t={t}
        droop={32 + Math.sin(f / 18) * 6}
        look={[-0.4 + Math.sin(f / 30) * 0.2, 0.7]}
        left={{ x: -300, y: -50, rot: -20 }}
        right={{ x: 215, y: 430, rot: 10 }}
      />
      <Tag x={290} y={900} text="05:00 AM" color="#d6342c" f={f} />
      <circle cx={lx} cy={ly} r={0} />
    </g>
  );
};

const Beat2: React.FC<BeatProps> = ({ f, t }) => {
  const cl = Math.min(f, 60);
  const flying = f < 60;
  const right: Hand = { x: 205, y: -60, rot: -25, front: true };
  const left: Hand = { x: -310, y: 40 - Math.sin(f / 6) * 10, rot: 10, fist: true };
  return (
    <g>
      <rect y={470} width={1080} height={1450} fill="#1d3550" />
      <Spot color="#fff0c0" op={0.14} />
      <Window x={780} y={620} sky="#ff9a6b" t={t} />
      {flying && <Clock x={200 - cl * 22} y={1250 - cl * 14 + cl * cl * 0.9} s={1.35} rot={cl * 25} t={t} />}
      <Mascot cx={CX} cy={CY} s={S} mood="grit" t={t} look={[0, 0]} left={left} right={right} sweat={false} />
      <Tag x={290} y={900} text="SIN EXCUSAS" color="#e8742a" f={f} size={72} />
    </g>
  );
};

const Beat3: React.FC<BeatProps> = ({ f, t }) => {
  const dy = Math.sin(f / 7) * 46;
  const y = -330 + dy;
  const [lx, ly] = W(-270, y);
  const [rx] = W(270, y);
  return (
    <g>
      <rect y={470} width={1080} height={1450} fill="#1b3a3c" />
      <Spot color="#bfe9ff" op={0.12} />
      {/* rack de pesas */}
      <g transform="translate(790 720)">
        <rect x={0} y={150} width={260} height={16} fill="#2d3550" {...ol} />
        <rect x={0} y={0} width={260} height={16} fill="#2d3550" {...ol} />
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${34 + i * 80} 0)`}>
            <rect x={-8} y={-52} width={16} height={52} rx={4} fill="#566080" {...ol} strokeWidth={4} />
            <rect x={-8} y={100} width={16} height={50} rx={4} fill="#566080" {...ol} strokeWidth={4} />
            <rect x={-3} y={-30} width={6} height={160} fill="#8a8fb0" />
          </g>
        ))}
      </g>
      <path d="M 90 760 L 190 760 L 160 840 L 210 840 L 110 980 L 130 880 L 80 880 Z" fill="#ffd23f" {...ol} />
      <Barbell x1={lx - 130} x2={rx + 130} y={ly} />
      <Mascot
        cx={CX}
        cy={CY}
        s={S}
        mood="effort"
        t={t}
        sweat
        look={[0, -0.3]}
        left={{ x: -270, y, rot: 0, fist: true }}
        right={{ x: 270, y, rot: 0, fist: true }}
      />
      <Tag x={540} y={770} text="DÍA 30" color="#2d9d4b" f={f} size={76} />
    </g>
  );
};

const Beat4: React.FC<BeatProps> = ({ f, t }) => {
  const wx = Math.sin(f / 5) * 20;
  const wy = Math.cos(f / 3) * 7;
  return (
    <g>
      <rect y={470} width={1080} height={1450} fill="#261f3f" />
      <Lamp x={190} y={760} t={t} />
      <Window x={780} y={620} sky="#0a0f2c" moon t={t} />
      <rect x={0} y={1590} width={380} height={330} fill="#4a2f2a" {...ol} />
      <g transform="translate(180 1520) scale(0.9)">
        <Mug t={t} />
      </g>
      <Mascot
        cx={CX}
        cy={CY}
        s={S}
        mood="tired"
        t={t}
        droop={10}
        look={[0.1 + Math.sin(f / 25) * 0.1, 0.85]}
        left={{ x: -190, y: 350, rot: -6, prop: <g transform="translate(30 -120)"><Notebook f={f} /></g> }}
        right={{ x: 150 + wx, y: 380 + wy, rot: 20, prop: <g transform="translate(0 6)"><Pencil /></g> }}
      />
      <Tag x={870} y={1010} text="DÍA 90" color="#2d9d4b" f={f} />
    </g>
  );
};

const Beat5: React.FC<BeatProps & { final?: boolean }> = ({ f, t, final }) => {
  const wave = Math.sin(f / 4) * 14;
  const [hx, hy] = [CX, CY];
  return (
    <g>
      <defs>
        <linearGradient id="povDay" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff8a5c" />
          <stop offset="0.6" stopColor="#ffc87a" />
          <stop offset="1" stopColor="#ffe6a8" />
        </linearGradient>
      </defs>
      <rect y={470} width={1080} height={1450} fill="url(#povDay)" />
      <g transform={`translate(${hx} ${hy}) rotate(${f * 0.4})`} opacity={0.25}>
        {Array.from({ length: 12 }).map((_, i) => (
          <path key={i} d="M0 0 L -70 -1300 L 70 -1300 Z" fill="#fff6c0" transform={`rotate(${i * 30})`} />
        ))}
      </g>
      <Cloud x={mod(f * 0.8 + 100, 1500) - 200} y={700} s={1.1} color="#fff6f2" shade="#ffc2c8" t={t} />
      <Cloud x={mod(f * 0.5 + 700, 1500) - 200} y={900} s={0.8} seed={4} color="#fff6f2" shade="#ffc2c8" t={t} />
      <g opacity={0.9}>
        <Mountains base={1500} amp={300} seed={3.3} fill="#a65aa0" scroll={f * 0.6} shadow={0.16} />
      </g>
      <Mascot
        cx={CX}
        cy={CY}
        s={S}
        mood="happy"
        t={t}
        look={[0.2, -0.1]}
        left={{ x: -320, y: -80 + wave, rot: -14 + wave, fist: true }}
        right={{ x: 300, y: -140, rot: 12, prop: <Trophy t={t} /> }}
      />
      <Confetti f={f} />
      {Array.from({ length: 8 }).map((_, i) => (
        <Sparkle key={i} x={140 + rnd(i) * 800} y={700 + rnd(i + 5) * 700} s={20} t={t} phase={i} />
      ))}
      {!final && <Tag x={290} y={900} text="DÍA 365" color="#2d9d4b" f={f} />}
      {final && <FinalSticker f={f} />}
    </g>
  );
};

const FinalSticker: React.FC<{ f: number }> = ({ f }) => {
  const k = Math.min(1, Math.max(0, f / 14));
  const pop = k === 0 ? 0 : 1 + Math.sin(k * Math.PI) * 0.25 - (1 - k) * 0.4;
  return (
    <g transform={`translate(540 760) rotate(${-5 + Math.sin(f / 10) * 1.2}) scale(${pop})`}>
      {["EMPIEZA", "HOY."].map((line, i) => (
        <text
          key={i}
          y={i * 150}
          textAnchor="middle"
          fontFamily={FONT}
          fontWeight={900}
          fontSize={i === 0 ? 170 : 190}
          fill={i === 0 ? "#ffffff" : "#ffd23f"}
          stroke={OUT}
          strokeWidth={22}
          paintOrder="stroke"
          strokeLinejoin="round"
        >
          {line}
        </text>
      ))}
    </g>
  );
};

// --- estructura --------------------------------------------------------------
const BEATS = [
  { from: 0, dur: 120, text: "POV: Son las 5 AM y no tienes ganas de nada", C: Beat1 },
  { from: 120, dur: 120, text: "POV: Te levantas de todos modos", C: Beat2 },
  { from: 240, dur: 180, text: "POV: Entrenas aunque nadie te esté viendo", C: Beat3 },
  { from: 420, dur: 120, text: "POV: Sigues estudiando cuando todos duermen", C: Beat4 },
  { from: 540, dur: 90, text: "POV: 365 días después, ya no eres el mismo", C: Beat5 },
  { from: 630, dur: 90, text: "POV: Empezar hoy fue la mejor decisión", C: (p: BeatProps) => <Beat5 {...p} final /> },
];

const Caption: React.FC<{ text: string }> = ({ text }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 1080,
        height: 470,
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "150px 70px 0",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 62,
          lineHeight: 1.22,
          letterSpacing: 1.5,
          color: "#fff",
          textAlign: "center",
        }}
      >
        {words.map((w, i) => {
          const p = spring({ frame: f - i * 3, fps, config: { damping: 14, stiffness: 180 } });
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                marginRight: 16,
                opacity: Math.min(1, p * 1.6),
                transform: `translateY(${(1 - p) * 26}px) scale(${0.85 + 0.15 * p})`,
                color: i === 0 ? "#ffd23f" : "#fff",
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const BeatFrame: React.FC<{ from: number; text: string; C: React.FC<BeatProps> }> = ({ from, text, C }) => {
  const f = useCurrentFrame();
  const punch = 1 + 0.06 * (1 - ramp(f, 0, 8));
  const flash = 1 - ramp(f, 0, 4);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <defs>
          <radialGradient id="povVig" cx="0.5" cy="0.6" r="0.75">
            <stop offset="0.55" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.55" />
          </radialGradient>
          <filter id="povGrain" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={Math.floor((from + f) / 2) % 40} />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
        <g transform={`translate(540 1195) scale(${punch}) translate(-540 -1195)`}>
          <C f={f} t={from + f} />
        </g>
        <rect y={470} width={1080} height={1450} fill="url(#povVig)" />
        <rect y={470} width={1080} height={1450} filter="url(#povGrain)" opacity={0.09} style={{ mixBlendMode: "overlay" }} />
        <rect y={470} width={1080} height={1450} fill="#fff" opacity={flash * 0.7} />
      </svg>
      <Caption text={text} />
    </AbsoluteFill>
  );
};

export const PovVideo: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Audio src={staticFile("music.wav")} />
    {BEATS.map((b, i) => (
      <Sequence key={i} from={b.from} durationInFrames={b.dur}>
        <BeatFrame from={b.from} text={b.text} C={b.C} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
