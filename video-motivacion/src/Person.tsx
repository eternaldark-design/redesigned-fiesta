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

export type Palette = {
  shirt: string;
  pants: string;
  skin: string;
  hair: string;
  shoe: string;
};

export const PALETTES: Palette[] = [
  { shirt: "#ff5a36", pants: "#1f2a44", skin: "#f1c27d", hair: "#2b1b17", shoe: "#ffffff" },
  { shirt: "#19c3a6", pants: "#2d3561", skin: "#c68642", hair: "#1a1110", shoe: "#ffd23f" },
  { shirt: "#ffd23f", pants: "#3b2f63", skin: "#8d5524", hair: "#111111", shoe: "#ffffff" },
  { shirt: "#8b5cf6", pants: "#1b2a3a", skin: "#ffdbac", hair: "#7a3b1d", shoe: "#ffffff" },
  { shirt: "#ff6fae", pants: "#26324f", skin: "#e0ac69", hair: "#3a2314", shoe: "#ffffff" },
  { shirt: "#3aa0ff", pants: "#2a2a40", skin: "#f1c27d", hair: "#c9892f", shoe: "#ff5a36" },
  { shirt: "#7ed957", pants: "#32304f", skin: "#a96f45", hair: "#1c1c1c", shoe: "#ffffff" },
];

const TORSO = 62;
const THIGH = 45;
const SHIN = 45;
const UARM = 30;
const FARM = 30;

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
    42 * vigor * Math.sin(p),
    15 + 75 * Math.pow(Math.max(0, Math.cos(p - 0.4)), 1.5),
  ];
  return {
    torso: lean,
    head: -4,
    legF: leg(phase),
    legB: leg(phase + Math.PI),
    armF: [-42 * vigor * Math.sin(phase), 82],
    armB: [42 * vigor * Math.sin(phase), 82],
  };
};

/** Subir escalones: rodillas altas y pasos más cortos. */
export const climbPose = (phase: number): Pose => {
  const leg = (p: number): Joint => [
    28 + 34 * Math.sin(p),
    20 + 62 * Math.pow(Math.max(0, Math.cos(p - 0.4)), 1.3),
  ];
  return {
    torso: 20,
    head: -8,
    legF: leg(phase),
    legB: leg(phase + Math.PI),
    armF: [-30 * Math.sin(phase), 70],
    armB: [30 * Math.sin(phase), 70],
  };
};

const Leg: React.FC<{ a: Joint; p: Palette; dark?: boolean }> = ({ a, p, dark }) => (
  <g
    transform={`rotate(${-a[0]})`}
    style={dark ? { filter: "brightness(0.7)" } : undefined}
  >
    <line x1={0} y1={0} x2={0} y2={THIGH} stroke={p.pants} strokeWidth={18} strokeLinecap="round" />
    <g transform={`translate(0 ${THIGH}) rotate(${a[1]})`}>
      <line x1={0} y1={0} x2={0} y2={SHIN} stroke={p.pants} strokeWidth={15} strokeLinecap="round" />
      <ellipse cx={8} cy={SHIN + 3} rx={15} ry={7.5} fill={p.shoe} stroke="rgba(0,0,0,0.25)" strokeWidth={1.5} />
    </g>
  </g>
);

const Arm: React.FC<{ a: Joint; p: Palette; torso: number; dark?: boolean }> = ({
  a,
  p,
  torso,
  dark,
}) => (
  <g
    transform={`translate(0 -52) rotate(${-a[0] - torso})`}
    style={dark ? { filter: "brightness(0.7)" } : undefined}
  >
    <line x1={0} y1={0} x2={0} y2={UARM} stroke={p.shirt} strokeWidth={14} strokeLinecap="round" />
    <g transform={`translate(0 ${UARM}) rotate(${-a[1]})`}>
      <line x1={0} y1={0} x2={0} y2={FARM} stroke={p.skin} strokeWidth={11} strokeLinecap="round" />
      <circle cx={0} cy={FARM + 2} r={7} fill={p.skin} />
    </g>
  </g>
);

/** Persona estilo "flat": (x, y) es la cadera; `dir=-1` la voltea. */
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
  return (
    <g transform={`translate(${x} ${y}) scale(${scale * dir} ${scale})`} opacity={opacity}>
      <Leg a={pose.legB} p={p} dark />
      <g transform={`rotate(${pose.torso})`}>
        <Arm a={pose.armB} p={p} torso={pose.torso} dark />
      </g>
      <g transform={`rotate(${pose.torso})`}>
        <line x1={0} y1={0} x2={0} y2={-TORSO} stroke={p.shirt} strokeWidth={38} strokeLinecap="round" />
        <rect x={-19} y={-6} width={38} height={14} rx={6} fill={p.pants} />
        <g transform={`translate(0 ${-TORSO}) rotate(${pose.head})`}>
          <line x1={0} y1={0} x2={0} y2={-10} stroke={p.skin} strokeWidth={11} strokeLinecap="round" />
          <circle cx={-3} cy={-28} r={21} fill={p.hair} />
          <circle cx={3} cy={-26} r={18} fill={p.skin} />
          <circle cx={11} cy={-27} r={2.4} fill="#222" />
        </g>
        <Arm a={pose.armF} p={p} torso={pose.torso} />
      </g>
      <Leg a={pose.legF} p={p} />
    </g>
  );
};
