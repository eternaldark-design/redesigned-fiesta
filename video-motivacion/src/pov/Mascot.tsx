import React from "react";
import { blobPath, smoothClosed } from "../art";
import { rnd } from "../utils";

export const OUT = "#14142b";
const NAVY = "#2a3b78";
const SUIT = "#1f2a55";
const HEAD = "#eef1fb";

export type Mood = "tired" | "grit" | "effort" | "happy" | "wow";

export type Hand = {
  x: number;
  y: number;
  rot?: number;
  prop?: React.ReactNode;
  /** Se dibuja encima de la cabeza (por ejemplo, para agarrar la gorra). */
  front?: boolean;
  fist?: boolean;
  /** Índice extendido, para señalar. */
  point?: boolean;
};

const MOODS: Record<
  Mood,
  { lid: number; low: number; tilt: number; bags: number; brow: "none" | "angry" | "sad" | "happy"; mouth: "flat" | "smile" | "grit" | "open" | "o"; blush: number }
> = {
  tired: { lid: 0.52, low: 0, tilt: -6, bags: 0.85, brow: "sad", mouth: "flat", blush: 0.3 },
  grit: { lid: 0.3, low: 0.05, tilt: 16, bags: 0.65, brow: "angry", mouth: "grit", blush: 0.3 },
  effort: { lid: 0.46, low: 0.38, tilt: 10, bags: 0.6, brow: "angry", mouth: "grit", blush: 0.45 },
  happy: { lid: 0, low: 0.12, tilt: 0, bags: 0, brow: "happy", mouth: "open", blush: 0.7 },
  wow: { lid: 0, low: 0, tilt: 0, bags: 0.25, brow: "happy", mouth: "o", blush: 0.5 },
};

const Glove: React.FC<{ fist?: boolean; point?: boolean }> = ({ fist, point }) => (
  <g stroke={OUT} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round">
    {point && <path d="M -10 -40 L -12 -104 Q -12 -118 0 -118 Q 12 -118 12 -104 L 12 -40 Z" fill="#fff" />}
    <ellipse cx={-36} cy={10} rx={16} ry={26} transform="rotate(28 -36 10)" fill="#fff" />
    <path
      d="M -34 20 Q -38 -26 -26 -42 Q -14 -54 0 -50 Q 18 -56 30 -42 Q 42 -26 36 20 Q 34 44 0 46 Q -30 44 -34 20 Z"
      fill="#fff"
    />
    {fist || point ? (
      <path d="M -24 -30 Q 0 -22 26 -30 M -26 -10 Q 0 -2 28 -10" fill="none" strokeWidth={4} />
    ) : (
      <path d="M -13 -48 L -13 -22 M 4 -52 L 4 -22 M 21 -46 L 21 -22" fill="none" strokeWidth={4} />
    )}
  </g>
);

const Arm: React.FC<{ from: [number, number]; hand: Hand; side: -1 | 1; sleeve: string }> = ({ from, hand, side, sleeve }) => {
  const mx = (from[0] + hand.x) / 2 + side * 40;
  const my = (from[1] + hand.y) / 2 + 40;
  const d = `M ${from[0]} ${from[1]} Q ${mx} ${my} ${hand.x} ${hand.y}`;
  return (
    <g>
      <path d={d} stroke={OUT} strokeWidth={76} strokeLinecap="round" fill="none" />
      <path d={d} stroke={sleeve} strokeWidth={62} strokeLinecap="round" fill="none" />
      <g transform={`translate(${hand.x} ${hand.y}) rotate(${hand.rot ?? 0})`}>
        {hand.prop}
        <Glove fist={hand.fist} point={hand.point} />
      </g>
    </g>
  );
};

const Eye: React.FC<{
  x: number;
  m: (typeof MOODS)[Mood];
  look: [number, number];
  lid: number;
  happy: boolean;
  side: -1 | 1;
}> = ({ x, m, look, lid, happy, side }) => {
  const ex = look[0] * 12;
  const ey = look[1] * 10;
  const tilt = side * m.tilt * -1;
  return (
    <g transform={`translate(${x} 22)`}>
      <circle r={54} fill="#fff" stroke={OUT} strokeWidth={5} />
      <g clipPath="url(#povEyeClip)">
        <circle cx={ex} cy={ey} r={37} fill="#e8742a" stroke="#a8480f" strokeWidth={3} />
        <circle cx={ex} cy={ey} r={17} fill="#2a1408" />
        <circle cx={ex - 11} cy={ey - 13} r={9} fill="#fff" />
        {happy && (
          <path
            transform={`translate(${ex + 12} ${ey + 10})`}
            d="M 0 -8 Q 1 -1 8 0 Q 1 1 0 8 Q -1 1 -8 0 Q -1 -1 0 -8 Z"
            fill="#fff"
          />
        )}
        {/* párpado superior */}
        <g transform={`rotate(${tilt})`}>
          <rect x={-80} y={-90} width={160} height={36 + 108 * lid} fill={HEAD} />
          <line x1={-80} x2={80} y1={-54 + 108 * lid} y2={-54 + 108 * lid} stroke={OUT} strokeWidth={5} />
        </g>
        {/* párpado inferior (esfuerzo) */}
        {m.low > 0 && (
          <g>
            <rect x={-80} y={54 - 108 * m.low} width={160} height={108 * m.low + 40} fill={HEAD} />
            <path
              d={`M -70 ${54 - 108 * m.low} Q 0 ${54 - 108 * m.low - 14} 70 ${54 - 108 * m.low}`}
              stroke={OUT}
              strokeWidth={5}
              fill="none"
            />
          </g>
        )}
      </g>
      <circle r={54} fill="none" stroke={OUT} strokeWidth={5} />
    </g>
  );
};

export const Mascot: React.FC<{
  cx: number;
  cy: number;
  s?: number;
  mood: Mood;
  t: number;
  look?: [number, number];
  left: Hand;
  right: Hand;
  droop?: number;
  sweat?: boolean;
  headFront?: React.ReactNode;
  /** Colores de gorra [copa, visera] y traje: sirven para otros personajes. */
  cap?: [string, string];
  suit?: string;
  mustache?: boolean;
  /** Luz de color sobre la cara (por ejemplo, el brillo de una pantalla). */
  light?: { color: string; op: number };
  id?: string;
}> = ({
  cx,
  cy,
  s = 1.15,
  mood,
  t,
  look = [0, 0],
  left,
  right,
  droop = 0,
  sweat,
  headFront,
  cap = [NAVY, "#202e63"],
  suit = SUIT,
  mustache,
  light,
  id = "a",
}) => {
  const m = MOODS[mood];
  const blink = t % 110 < 4 ? 1 : 0;
  const lid = Math.max(m.lid, blink);
  const jx = (rnd(Math.floor(t / 3)) - 0.5) * 3;
  const jy = (rnd(Math.floor(t / 3) + 99) - 0.5) * 3;
  const bob = Math.sin(t / 12) * 4;
  const rot = Math.sin(t / 30) * 1.6 + droop * 0.35;
  const breathe = 1 + Math.sin(t / 14) * 0.008;

  const headPath = smoothClosed(
    Array.from({ length: 16 }, (_, i) => {
      const a = (i / 16) * Math.PI * 2;
      const r = 232 * (1 + (rnd(i + 3) - 0.5) * 0.02);
      return [Math.cos(a) * r, Math.sin(a) * r * 0.97] as [number, number];
    }),
  );

  return (
    <g transform={`translate(${cx + jx} ${cy + jy}) scale(${s * breathe})`}>
      <defs>
        <clipPath id="povEyeClip">
          <circle r={54} />
        </clipPath>
        <radialGradient id="povHead" cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.7" stopColor={HEAD} />
          <stop offset="1" stopColor="#c9cfec" />
        </radialGradient>
        {light && (
          <linearGradient id={`povLight${id}`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor={light.color} stopOpacity="1" />
            <stop offset="0.8" stopColor={light.color} stopOpacity="0" />
          </linearGradient>
        )}
        <filter id="povBlur">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* cuerpo */}
      <path
        d="M -270 340 Q -262 196 -150 172 L 150 172 Q 262 196 270 340 L 270 900 L -270 900 Z"
        fill={suit}
        stroke={OUT}
        strokeWidth={7}
        strokeLinejoin="round"
        transform={`translate(0 ${droop})`}
      />
      <path d="M -150 172 Q 0 230 150 172" stroke="#3b4a86" strokeWidth={6} fill="none" opacity={0.6} transform={`translate(0 ${droop})`} />
      <g transform={`translate(0 ${droop})`} stroke={OUT} strokeWidth={5}>
        <circle cx={0} cy={370} r={20} fill="#f4f4f8" />
        <circle cx={0} cy={470} r={20} fill="#f4f4f8" />
      </g>

      {/* brazos */}
      {!left.front && <Arm from={[-205, 260 + droop]} hand={left} side={-1} sleeve={cap[0]} />}
      {!right.front && <Arm from={[205, 260 + droop]} hand={right} side={1} sleeve={cap[0]} />}

      {/* cabeza */}
      <g transform={`translate(0 ${bob + droop}) rotate(${rot})`}>
        <path d={headPath} fill="url(#povHead)" stroke={OUT} strokeWidth={7} strokeLinejoin="round" />
        <path d="M 150 -150 Q 238 -20 160 150 Q 214 20 150 -150 Z" fill="#6a5fb0" opacity={0.18} />

        {/* mejillas y ojeras */}
        {[-1, 1].map((sd) => (
          <g key={sd}>
            <ellipse cx={sd * 140} cy={104} rx={36} ry={22} fill="#ff8fa6" opacity={m.blush} filter="url(#povBlur)" />
            <ellipse cx={sd * 82} cy={92} rx={64} ry={24} fill="#6b4a9e" opacity={0.75 * m.bags} filter="url(#povBlur)" />
            {m.bags > 0 && (
              <path
                d={`M ${sd * 82 - 46} 108 Q ${sd * 82} 122 ${sd * 82 + 46} 108`}
                stroke="#4b3380"
                strokeWidth={3}
                fill="none"
                opacity={0.55 * m.bags}
                strokeLinecap="round"
              />
            )}
          </g>
        ))}

        <Eye x={-82} m={m} look={look} lid={lid} happy={mood === "happy"} side={-1} />
        <Eye x={82} m={m} look={look} lid={lid} happy={mood === "happy"} side={1} />

        {/* cejas */}
        {m.brow === "angry" && (
          <g stroke={OUT} strokeWidth={13} strokeLinecap="round" fill="none">
            <path d="M -150 -44 L -36 -12" />
            <path d="M 150 -44 L 36 -12" />
          </g>
        )}
        {m.brow === "sad" && (
          <g stroke={OUT} strokeWidth={8} strokeLinecap="round" fill="none">
            <path d="M -140 -16 Q -100 -40 -40 -22" />
            <path d="M 140 -16 Q 100 -40 40 -22" />
          </g>
        )}
        {m.brow === "happy" && (
          <g stroke={OUT} strokeWidth={8} strokeLinecap="round" fill="none">
            <path d="M -134 -34 Q -92 -62 -42 -38" />
            <path d="M 134 -34 Q 92 -62 42 -38" />
          </g>
        )}

        {/* boca */}
        {m.mouth === "flat" && (
          <path d="M -30 132 Q 0 140 30 130" stroke={OUT} strokeWidth={7} fill="none" strokeLinecap="round" />
        )}
        {m.mouth === "smile" && (
          <path d="M -34 126 Q 0 152 34 126" stroke={OUT} strokeWidth={7} fill="none" strokeLinecap="round" />
        )}
        {m.mouth === "grit" && (
          <g stroke={OUT} strokeWidth={6} strokeLinejoin="round">
            <path d="M -52 118 L 52 118 Q 58 146 40 150 L -40 150 Q -58 146 -52 118 Z" fill="#fff" />
            <path d="M -26 118 V 150 M 0 118 V 150 M 26 118 V 150" fill="none" strokeWidth={4} />
          </g>
        )}
        {m.mouth === "o" && (
          <g stroke={OUT} strokeWidth={6}>
            <ellipse cx={0} cy={140} rx={26} ry={32} fill="#7a2230" />
            <ellipse cx={0} cy={158} rx={14} ry={9} fill="#ff7a8f" strokeWidth={0} />
          </g>
        )}
        {mustache && (
          <path
            d="M -70 108 Q -40 82 0 100 Q 40 82 70 108 Q 50 120 0 110 Q -50 120 -70 108 Z"
            fill="#4a2c1e"
            stroke={OUT}
            strokeWidth={5}
            strokeLinejoin="round"
          />
        )}
        {m.mouth === "open" && (
          <g stroke={OUT} strokeWidth={6} strokeLinejoin="round">
            <path d="M -62 112 Q 0 108 62 112 Q 58 184 0 188 Q -58 184 -62 112 Z" fill="#7a2230" />
            <path d="M -48 114 Q 0 112 48 114 L 46 128 Q 0 130 -46 128 Z" fill="#fff" strokeWidth={4} />
            <path d="M -30 166 Q 0 148 30 166 Q 20 184 0 184 Q -20 184 -30 166 Z" fill="#ff7a8f" strokeWidth={4} />
          </g>
        )}

        {/* gotas de sudor */}
        {sweat && (
          <g>
            {[0, 1].map((k) => {
              const age = ((t + k * 14) % 28) / 28;
              return (
                <path
                  key={k}
                  transform={`translate(${176 + k * 22} ${-20 + age * 150}) scale(${1 - age * 0.3})`}
                  d="M 0 -26 Q 16 0 0 18 Q -16 0 0 -26 Z"
                  fill="#bfe9ff"
                  stroke={OUT}
                  strokeWidth={4}
                  opacity={1 - age * 0.6}
                />
              );
            })}
          </g>
        )}

        {light && (
          <path d={headPath} fill={`url(#povLight${id})`} opacity={light.op} style={{ mixBlendMode: "screen" }} />
        )}

        {/* gorra */}
        <g stroke={OUT} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round">
          <path d="M -218 -34 Q -236 -252 0 -266 Q 236 -252 218 -34 Q 0 -78 -218 -34 Z" fill={cap[0]} />
          <path d="M 0 -266 Q 6 -150 0 -62 M -96 -254 Q -128 -160 -146 -66 M 96 -254 Q 128 -160 146 -66" fill="none" strokeWidth={4} opacity={0.7} />
          <path d="M -246 -28 Q 0 -112 246 -28 Q 258 -6 226 6 Q 0 -56 -226 6 Q -258 -6 -246 -28 Z" fill={cap[1]} />
          <circle cx={0} cy={-272} r={14} fill={cap[1]} />
          <path d="M 36 -150 L 62 -196 L 80 -170 L 94 -186 L 120 -150 Z" fill="#fff" strokeWidth={4} />
          <path d="M 62 -196 L 62 -218 L 84 -210 L 62 -204" fill="#ff5a36" strokeWidth={3} />
        </g>
        <path
          transform="translate(-110 -150)"
          d="M 0 -18 Q 2 -2 18 0 Q 2 2 0 18 Q -2 2 -18 0 Q -2 -2 0 -18 Z"
          fill="#cfe6ff"
          opacity={0.6 + 0.4 * Math.sin(t / 8)}
        />
        {headFront}
      </g>

      {left.front && <Arm from={[-205, 260 + droop]} hand={left} side={-1} sleeve={cap[0]} />}
      {right.front && <Arm from={[205, 260 + droop]} hand={right} side={1} sleeve={cap[0]} />}
    </g>
  );
};

/** Etiqueta blanca tipo "sticker", con sombra y rebote de entrada. */
export const Tag: React.FC<{
  x: number;
  y: number;
  rot?: number;
  text: string;
  color: string;
  f: number;
  delay?: number;
  size?: number;
}> = ({ x, y, rot = -4, text, color, f, delay = 8, size = 84 }) => {
  const k = Math.max(0, Math.min(1, (f - delay) / 10));
  const pop = k === 0 ? 0 : 1 + Math.sin(k * Math.PI) * 0.18 - (1 - k) * 0.3;
  const w = text.length * size * 0.66 + 70;
  const h = size + 46;
  return (
    <g transform={`translate(${x} ${y + Math.sin(f / 14) * 5}) rotate(${rot + Math.sin(f / 18) * 1.2}) scale(${pop})`}>
      <rect x={-w / 2 + 10} y={-h / 2 + 12} width={w} height={h} fill="rgba(0,0,0,0.45)" />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} fill="#f6f6f6" stroke={OUT} strokeWidth={4} />
      <text
        x={0}
        y={size * 0.34}
        textAnchor="middle"
        fontFamily="Montserrat, sans-serif"
        fontWeight={900}
        fontSize={size}
        fill={color}
      >
        {text}
      </text>
    </g>
  );
};

export { blobPath };
