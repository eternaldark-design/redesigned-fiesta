import React from "react";

/** Ángulos en grados, "hacia adelante" es positivo y 0 = brazo/pierna colgando. */
export type Joint = [number, number];
export type Pose = {
  torso: number;
  head: number;
  armF: Joint;
  armB: Joint;
  legF: Joint;
  legB: Joint;
};

export type HairStyle = "short" | "ponytail" | "curly" | "buzz";

export type Palette = {
  shirt: string;
  pants: string;
  skin: string;
  hair: string;
  shoe: string;
  hairStyle: HairStyle;
  /** Pantalón corto: deja ver la pierna. */
  shorts?: boolean;
};

export const PALETTES: Palette[] = [
  { shirt: "#ff5a36", pants: "#1f2a44", skin: "#e8b48a", hair: "#2b1b17", shoe: "#f4f4f4", hairStyle: "short" },
  { shirt: "#19c3a6", pants: "#2d3561", skin: "#b9774a", hair: "#1a1110", shoe: "#ffd23f", hairStyle: "curly", shorts: true },
  { shirt: "#ffd23f", pants: "#3b2f63", skin: "#8d5524", hair: "#111111", shoe: "#f4f4f4", hairStyle: "buzz" },
  { shirt: "#8b5cf6", pants: "#1b2a3a", skin: "#f2cfa8", hair: "#7a3b1d", shoe: "#f4f4f4", hairStyle: "ponytail" },
  { shirt: "#ff6fae", pants: "#26324f", skin: "#d9a273", hair: "#3a2314", shoe: "#f4f4f4", hairStyle: "ponytail", shorts: true },
  { shirt: "#3aa0ff", pants: "#2a2a40", skin: "#e8b48a", hair: "#c9892f", shoe: "#ff5a36", hairStyle: "short", shorts: true },
  { shirt: "#7ed957", pants: "#32304f", skin: "#a96f45", hair: "#1c1c1c", shoe: "#f4f4f4", hairStyle: "curly" },
];

const TORSO = 64;
const THIGH = 52;
const SHIN = 52;
const UARM = 31;
const FARM = 29;

/** Alto de la pierna + pie, para apoyar la cadera sobre el suelo. */
export const FOOT = 14;
export const SHIN_LEN = SHIN;
export const STAND_H = THIGH + SHIN + FOOT;

export const SIT: Pose = {
  torso: 38,
  head: 16,
  armF: [52, 62],
  armB: [44, 70],
  legF: [90, 90],
  legB: [93, 88],
};
export const SIT_UP: Pose = {
  torso: 14,
  head: -6,
  armF: [40, 60],
  armB: [34, 66],
  legF: [90, 90],
  legB: [93, 88],
};
export const STAND: Pose = {
  torso: 0,
  head: 0,
  armF: [6, 12],
  armB: [-4, 10],
  legF: [0, 0],
  legB: [-2, 0],
};
export const STRETCH: Pose = {
  torso: -6,
  head: -8,
  armF: [172, 6],
  armB: [190, 6],
  legF: [0, 0],
  legB: [-2, 0],
};
export const CHEER: Pose = {
  torso: -2,
  head: -6,
  armF: [152, 14],
  armB: [206, 10],
  legF: [4, 6],
  legB: [-6, 8],
};

const lj = (a: Joint, b: Joint, t: number): Joint => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
];

export const lerpPose = (a: Pose, b: Pose, t: number): Pose => ({
  torso: a.torso + (b.torso - a.torso) * t,
  head: a.head + (b.head - a.head) * t,
  armF: lj(a.armF, b.armF, t),
  armB: lj(a.armB, b.armB, t),
  legF: lj(a.legF, b.legF, t),
  legB: lj(a.legB, b.legB, t),
});

/** Ciclo de carrera; `phase` en radianes. */
export const runPose = (phase: number, lean = 14, vigor = 1): Pose => {
  const leg = (p: number): Joint => [
    44 * vigor * Math.sin(p),
    12 + 80 * Math.pow(Math.max(0, Math.cos(p - 0.4)), 1.5),
  ];
  return {
    torso: lean + 2 * Math.cos(phase * 2),
    head: -lean * 0.6,
    legF: leg(phase),
    legB: leg(phase + Math.PI),
    armF: [-46 * vigor * Math.sin(phase), 88],
    armB: [46 * vigor * Math.sin(phase), 88],
  };
};

/** Subir escalones: rodillas altas y pasos más cortos. */
export const climbPose = (phase: number): Pose => {
  const leg = (p: number): Joint => [
    28 + 36 * Math.sin(p),
    20 + 66 * Math.pow(Math.max(0, Math.cos(p - 0.4)), 1.3),
  ];
  return {
    torso: 20,
    head: -12,
    legF: leg(phase),
    legB: leg(phase + Math.PI),
    armF: [-32 * Math.sin(phase), 74],
    armB: [32 * Math.sin(phase), 74],
  };
};

// --- utilidades de color y forma ---------------------------------------------
const shade = (hex: string, f: number) => {
  const n = parseInt(hex.slice(1), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) =>
    Math.round(f < 0 ? c * (1 + f) : c + (255 - c) * f),
  );
  return `rgb(${ch[0]},${ch[1]},${ch[2]})`;
};

/** Extremidad cónica con extremos redondeados y un leve abultamiento (músculo). */
const taper = (len: number, w0: number, wm: number, w1: number) => {
  const r0 = w0 / 2;
  const r1 = w1 / 2;
  const m = wm / 2;
  return (
    `M ${-r0} 0 A ${r0} ${r0} 0 0 1 ${r0} 0 ` +
    `Q ${m * 1.12} ${len * 0.42} ${r1} ${len} ` +
    `A ${r1} ${r1} 0 0 1 ${-r1} ${len} ` +
    `Q ${-m * 1.12} ${len * 0.42} ${-r0} 0 Z`
  );
};

const keyOf = (p: Palette) => (p.shirt + p.skin + p.pants + p.shoe).replace(/#/g, "");

const Defs: React.FC<{ p: Palette; k: string }> = ({ p, k }) => (
  <defs>
    <linearGradient id={`sk${k}`} x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stopColor={shade(p.skin, -0.22)} />
      <stop offset="0.5" stopColor={p.skin} />
      <stop offset="1" stopColor={shade(p.skin, -0.08)} />
    </linearGradient>
    <linearGradient id={`sh${k}`} x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stopColor={shade(p.shirt, -0.28)} />
      <stop offset="0.55" stopColor={p.shirt} />
      <stop offset="1" stopColor={shade(p.shirt, 0.08)} />
    </linearGradient>
    <linearGradient id={`pa${k}`} x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stopColor={shade(p.pants, -0.3)} />
      <stop offset="0.5" stopColor={p.pants} />
      <stop offset="1" stopColor={shade(p.pants, 0.12)} />
    </linearGradient>
  </defs>
);

const Shoe: React.FC<{ p: Palette }> = ({ p }) => (
  <g>
    <path
      d="M -8 -6 L 8 -6 L 9 2 Q 24 3 28 10 L 28 14 L -9 14 L -9 2 Z"
      fill={p.shoe}
    />
    <path d="M -9 9 L 28 9 L 28 14 L -9 14 Z" fill="rgba(0,0,0,0.28)" />
    <path d="M -9 12 L 28 12 L 28 15 L -9 15 Z" fill="#fafafa" opacity={0.9} />
    <path d="M 4 -1 L 12 3 M 8 -3 L 15 1" stroke="rgba(0,0,0,0.3)" strokeWidth={1.4} />
  </g>
);

const Leg: React.FC<{ a: Joint; p: Palette; k: string; dark?: boolean }> = ({ a, p, k, dark }) => {
  const foot = Math.max(-25, Math.min(30, (a[0] - a[1]) * 0.5));
  return (
    <g transform={`rotate(${-a[0]})`} style={dark ? { filter: "brightness(0.68)" } : undefined}>
      {p.shorts ? (
        <>
          <path d={taper(THIGH, 25, 26, 17)} fill={`url(#sk${k})`} />
          <path d={taper(THIGH * 0.66, 27, 28, 24)} fill={`url(#pa${k})`} />
        </>
      ) : (
        <path d={taper(THIGH, 25, 27, 18)} fill={`url(#pa${k})`} />
      )}
      <g transform={`translate(0 ${THIGH}) rotate(${a[1]})`}>
        <circle r={8.6} fill={p.shorts ? `url(#sk${k})` : `url(#pa${k})`} />
        <path
          d={taper(SHIN, 17, 16, 10)}
          fill={p.shorts ? `url(#sk${k})` : `url(#pa${k})`}
        />
        {!p.shorts && <rect x={-6.5} y={SHIN - 8} width={13} height={7} rx={3} fill={shade(p.pants, -0.35)} />}
        <g transform={`translate(0 ${SHIN - 1}) rotate(${foot})`}>
          <Shoe p={p} />
        </g>
      </g>
    </g>
  );
};

const Arm: React.FC<{ a: Joint; p: Palette; k: string; torso: number; dark?: boolean }> = ({
  a,
  p,
  k,
  torso,
  dark,
}) => (
  <g
    transform={`translate(0 ${-(TORSO - 8)}) rotate(${-a[0] - torso})`}
    style={dark ? { filter: "brightness(0.68)" } : undefined}
  >
    <path d={taper(UARM, 14, 15, 11)} fill={`url(#sk${k})`} />
    <path d={taper(UARM * 0.5, 18, 19, 16)} fill={`url(#sh${k})`} />
    <g transform={`translate(0 ${UARM}) rotate(${-a[1]})`}>
      <circle r={5.8} fill={`url(#sk${k})`} />
      <path d={taper(FARM, 11, 11, 7.5)} fill={`url(#sk${k})`} />
      <ellipse cx={0.6} cy={FARM + 4.5} rx={5.2} ry={7} fill={`url(#sk${k})`} />
      <path d={`M 3 ${FARM} q 6 3 3 10`} stroke={shade(p.skin, -0.2)} strokeWidth={2.2} fill="none" strokeLinecap="round" />
    </g>
  </g>
);

const Hair: React.FC<{ p: Palette }> = ({ p }) => {
  const cap =
    "M -10.8 -17 C -14 -31 -4 -41 5 -40 C 13 -39 17 -33 15 -26.5 C 12.5 -30.5 8 -31.5 3 -31 C -2 -30.5 -5.5 -27 -5.8 -21 C -6 -17.5 -8.5 -13.5 -10.8 -17 Z";
  const dark = shade(p.hair, -0.25);
  switch (p.hairStyle) {
    case "ponytail":
      return (
        <g>
          <path d="M -9 -31 C -24 -32 -28 -14 -21 -1 C -18 -12 -14 -22 -7 -26 Z" fill={dark} />
          <path d={cap} fill={p.hair} />
          <circle cx={-9} cy={-29} r={2.6} fill="#ff5a36" />
        </g>
      );
    case "curly":
      return (
        <g fill={p.hair}>
          <path d={cap} />
          {[
            [-9, -32],
            [-4, -38],
            [3, -40.5],
            [10, -37.5],
            [-12, -24],
            [-9, -19],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={5.6} />
          ))}
        </g>
      );
    case "buzz":
      return <path d={cap} fill={p.hair} opacity={0.55} />;
    default:
      return (
        <g>
          <path d={cap} fill={p.hair} />
          <path d="M -3 -39 C 4 -42 13 -38 15 -29" stroke={shade(p.hair, 0.25)} strokeWidth={1.4} fill="none" opacity={0.6} />
        </g>
      );
  }
};

const Head: React.FC<{ p: Palette; k: string }> = ({ p, k }) => (
  <g>
    <path d={taper(11, 11, 11, 12)} fill={shade(p.skin, -0.25)} transform="translate(0 -9)" />
    <path d="M -5 -9 L 6 -9 L 6 -2 L -5 -2 Z" fill={`url(#sk${k})`} />
    <ellipse cx={-6} cy={-21} rx={3.2} ry={4.4} fill={shade(p.skin, -0.18)} />
    <ellipse cx={2} cy={-23} rx={12} ry={14.5} fill={`url(#sk${k})`} />
    <ellipse cx={3} cy={-12} rx={8.5} ry={5.5} fill={`url(#sk${k})`} />
    <path d="M 12 -25 L 17 -18.5 L 12.4 -18 Z" fill={shade(p.skin, -0.1)} />
    <ellipse cx={8} cy={-24} rx={2.5} ry={1.8} fill="#fff" />
    <circle cx={8.9} cy={-24} r={1.3} fill="#2a1a14" />
    <path d="M 4.5 -28 Q 8.5 -30 12.5 -27.5" stroke={p.hair} strokeWidth={1.9} fill="none" strokeLinecap="round" />
    <path d="M 9 -13.5 Q 11.5 -12.5 14 -14" stroke="#7a3f33" strokeWidth={1.4} fill="none" strokeLinecap="round" />
    <Hair p={p} />
  </g>
);

/** Persona: (x, y) es la cadera; `dir=-1` la voltea. */
export const Person: React.FC<{
  x: number;
  y: number;
  scale?: number;
  dir?: 1 | -1;
  pose: Pose;
  palette?: Palette;
  opacity?: number;
}> = ({ x, y, scale = 1, dir = 1, pose, palette = PALETTES[0], opacity = 1 }) => {
  const p = palette;
  const k = keyOf(p);
  return (
    <g transform={`translate(${x} ${y}) scale(${scale * dir} ${scale})`} opacity={opacity}>
      <Defs p={p} k={k} />
      <Leg a={pose.legB} p={p} k={k} dark />
      <g transform={`rotate(${pose.torso})`}>
        <Arm a={pose.armB} p={p} k={k} torso={pose.torso} dark />
      </g>
      <g transform={`rotate(${pose.torso})`}>
        {/* cadera */}
        <path d="M -18 -4 L 18 -4 L 20 14 Q 0 21 -20 14 Z" fill={`url(#pa${k})`} />
        {/* camiseta */}
        <path
          d="M -17 8 C -20 -14 -21 -38 -19 -54 C -18 -62 -12 -67 -3 -68 L 6 -68 C 15 -67 20 -60 19 -50 C 18 -32 18 -12 17 8 Q 0 12 -17 8 Z"
          fill={`url(#sh${k})`}
        />
        <path d="M -17 8 Q 0 12 17 8 L 17.2 3 Q 0 7 -17.2 3 Z" fill={shade(p.shirt, -0.22)} opacity={0.7} />
        <path d="M -5 -68 Q 1 -60 7 -68" stroke={shade(p.shirt, -0.35)} strokeWidth={2.4} fill="none" strokeLinecap="round" />
        <path d="M 8 -52 C 10 -36 10 -22 9 -8" stroke={shade(p.shirt, 0.25)} strokeWidth={2} fill="none" opacity={0.35} strokeLinecap="round" />
        <g transform={`translate(0 ${-TORSO - 2}) rotate(${pose.head})`}>
          <Head p={p} k={k} />
        </g>
        <Arm a={pose.armF} p={p} k={k} torso={pose.torso} />
      </g>
      <Leg a={pose.legF} p={p} k={k} />
    </g>
  );
};
