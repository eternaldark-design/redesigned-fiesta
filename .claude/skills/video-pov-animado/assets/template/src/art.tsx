import React from "react";
import { mod, rnd } from "./utils";

type Pt = [number, number];

/** Curva cerrada suave (Catmull-Rom → Bézier): formas orgánicas, no círculos. */
export const smoothClosed = (pts: Pt[]) => {
  const n = pts.length;
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    d +=
      ` C ${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)}` +
      ` ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)}` +
      ` ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + " Z";
};

export const blobPath = (rx: number, ry: number, seed: number, wob = 0.3, n = 9, t = 0, amp = 0) =>
  smoothClosed(
    Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2;
      const k = 1 + (rnd(seed * 31 + i) - 0.5) * wob + Math.sin(t + i * 1.9) * amp;
      return [Math.cos(a) * rx * k, Math.sin(a) * ry * k] as Pt;
    }),
  );

export const Cloud: React.FC<{
  x: number;
  y: number;
  s?: number;
  seed?: number;
  color?: string;
  shade?: string;
  opacity?: number;
  t?: number;
}> = ({ x, y, s = 1, seed = 1, color = "#ffffff", shade = "#e9d9ee", opacity = 1, t = 0 }) => {
  const lobes: [number, number, number, number][] = [
    [-70, 6, 40, 26],
    [-30, -14, 52, 38],
    [28, -22, 56, 42],
    [74, -2, 42, 30],
    [4, 10, 100, 24],
  ];
  return (
    <g transform={`translate(${x} ${y + Math.sin(t / 40 + seed) * 4}) scale(${s})`} opacity={opacity}>
      {lobes.map(([lx, ly, rx, ry], i) => (
        <path
          key={`s${i}`}
          transform={`translate(${lx} ${ly + 9})`}
          d={blobPath(rx, ry, seed + i, 0.18, 8, t / 50, 0.015)}
          fill={shade}
        />
      ))}
      {lobes.map(([lx, ly, rx, ry], i) => (
        <path
          key={i}
          transform={`translate(${lx} ${ly})`}
          d={blobPath(rx, ry, seed + i + 10, 0.18, 8, t / 50, 0.015)}
          fill={color}
        />
      ))}
    </g>
  );
};

/** Pájaro que bate las alas. */
export const Bird: React.FC<{ x: number; y: number; s?: number; t: number; phase?: number; color?: string }> = ({
  x,
  y,
  s = 1,
  t,
  phase = 0,
  color = "#2a1d44",
}) => {
  const f = Math.sin(t * 0.55 + phase);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d={`M -17 ${-3 * f} Q -9 ${-14 * f - 2} 0 0 Q 9 ${-14 * f - 2} 17 ${-3 * f}`}
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        fill="none"
      />
      <path d="M -3 0 Q 0 4 4 0 Z" fill={color} />
    </g>
  );
};

export const Flock: React.FC<{ t: number; y: number; speed?: number; color?: string; count?: number; seed?: number }> = ({
  t,
  y,
  speed = 3,
  color,
  count = 5,
  seed = 0,
}) => (
  <>
    {Array.from({ length: count }).map((_, i) => {
      const x = mod(i * 90 + seed * 200 - t * speed, 1500) - 200;
      return (
        <Bird
          key={i}
          x={x}
          y={y + Math.sin(t / 25 + i) * 14 + (i % 3) * 36}
          s={0.9 + rnd(i + seed) * 0.8}
          t={t}
          phase={i * 1.3}
          color={color}
        />
      );
    })}
  </>
);

/** Árbol frondoso: tronco con ramas y follaje de formas orgánicas que respira con el viento. */
export const LeafyTree: React.FC<{
  x: number;
  y: number;
  s?: number;
  t: number;
  seed?: number;
  leaf?: string;
  leafLight?: string;
  leafDark?: string;
  trunk?: string;
}> = ({ x, y, s = 1, t, seed = 0, leaf = "#2a7a52", leafLight = "#4fa56b", leafDark = "#1c5a40", trunk = "#4a2f20" }) => {
  const sway = Math.sin(t / 22 + seed) * 2.2;
  const clusters: [number, number, number][] = [
    [0, -150, 62],
    [-46, -120, 46],
    [48, -124, 48],
    [-10, -190, 44],
    [30, -176, 36],
  ];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -9 0 Q -6 -60 -3 -110 L 4 -110 Q 8 -60 11 0 Z" fill={trunk} />
      <path d="M 0 -80 Q -22 -96 -34 -116" stroke={trunk} strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d="M 2 -90 Q 24 -104 36 -120" stroke={trunk} strokeWidth={5} fill="none" strokeLinecap="round" />
      <g transform={`rotate(${sway} 0 -100)`}>
        {clusters.map(([cx, cy, r], i) => (
          <path
            key={`d${i}`}
            transform={`translate(${cx + 5} ${cy + 8})`}
            d={blobPath(r, r * 0.88, seed + i, 0.28, 9, t / 30, 0.03)}
            fill={leafDark}
          />
        ))}
        {clusters.map(([cx, cy, r], i) => (
          <path
            key={i}
            transform={`translate(${cx} ${cy})`}
            d={blobPath(r, r * 0.88, seed + i + 7, 0.28, 9, t / 30 + 1, 0.03)}
            fill={leaf}
          />
        ))}
        {clusters.map(([cx, cy, r], i) => (
          <path
            key={`l${i}`}
            transform={`translate(${cx - r * 0.25} ${cy - r * 0.3})`}
            d={blobPath(r * 0.5, r * 0.36, seed + i + 21, 0.3, 7, t / 30 + 2, 0.04)}
            fill={leafLight}
            opacity={0.75}
          />
        ))}
      </g>
    </g>
  );
};

/** Pino con ramas en capas que se mecen. */
export const PineTree: React.FC<{
  x: number;
  y: number;
  s?: number;
  t: number;
  seed?: number;
  color?: string;
  light?: string;
}> = ({ x, y, s = 1, t, seed = 0, color = "#1f5a4a", light = "#2f7d62" }) => {
  const tiers = [0, 1, 2, 3];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-5} y={-28} width={10} height={32} fill="#3a2418" />
      {tiers.map((i) => {
        const w = 62 - i * 11;
        const top = -34 - i * 42;
        const sway = Math.sin(t / 18 + seed + i * 0.6) * (2 + i * 0.8);
        return (
          <g key={i}>
            <path
              d={`M ${-w} ${top + 44} Q ${-w * 0.45} ${top + 30} ${sway} ${top - 22} Q ${w * 0.45} ${top + 30} ${w} ${top + 44} Q 0 ${top + 52} ${-w} ${top + 44} Z`}
              fill={color}
            />
            <path
              d={`M ${sway} ${top - 22} Q ${w * 0.45} ${top + 30} ${w} ${top + 44} Q ${w * 0.3} ${top + 36} ${sway * 0.5} ${top + 8} Z`}
              fill={light}
              opacity={0.55}
            />
          </g>
        );
      })}
    </g>
  );
};

export const GrassTuft: React.FC<{ x: number; y: number; s?: number; t: number; seed?: number; color?: string }> = ({
  x,
  y,
  s = 1,
  t,
  seed = 0,
  color = "#3f9a5a",
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-12, -6, 0, 6, 12].map((bx, i) => {
      const h = 26 + rnd(seed + i) * 22;
      const b = Math.sin(t / 14 + seed + i) * 7 + (i - 2) * 3;
      return (
        <path
          key={i}
          d={`M ${bx - 3} 0 Q ${bx + b * 0.4} ${-h * 0.55} ${bx + b} ${-h} Q ${bx + b * 0.5 + 4} ${-h * 0.5} ${bx + 3} 0 Z`}
          fill={color}
        />
      );
    })}
  </g>
);

export const Sparkle: React.FC<{ x: number; y: number; s?: number; t: number; phase?: number; color?: string }> = ({
  x,
  y,
  s = 14,
  t,
  phase = 0,
  color = "#fff7c2",
}) => {
  const k = 0.35 + 0.65 * Math.abs(Math.sin(t / 10 + phase));
  const r = s * k;
  return (
    <path
      transform={`translate(${x} ${y}) rotate(${t * 0.8 + phase * 40})`}
      d={`M 0 ${-r} Q 0 0 ${r} 0 Q 0 0 0 ${r} Q 0 0 ${-r} 0 Q 0 0 0 ${-r} Z`}
      fill={color}
      opacity={0.5 + 0.5 * k}
    />
  );
};

export const LeafShape: React.FC<{ x: number; y: number; rot: number; s?: number; color: string }> = ({
  x,
  y,
  rot,
  s = 1,
  color,
}) => (
  <path
    transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}
    d="M 0 -12 Q 10 -4 0 12 Q -10 -4 0 -12 Z"
    fill={color}
  />
);

type Ridge = { pts: Pt[]; peaks: number[] };

const ridge = (x0: number, x1: number, base: number, amp: number, seed: number, step = 36, scroll = 0): Ridge => {
  const pts: Pt[] = [];
  for (let x = x0; x <= x1; x += step) {
    const u = x + scroll;
    const h =
      0.6 * (1 - Math.abs(Math.sin(u / 300 + seed))) +
      0.28 * (1 - Math.abs(Math.sin(u / 125 + seed * 2.3))) +
      0.12 * rnd(Math.round(u / step) + seed * 11);
    pts.push([x, base - amp * h]);
  }
  const peaks: number[] = [];
  for (let i = 2; i < pts.length - 2; i++) {
    if (pts[i][1] < pts[i - 1][1] && pts[i][1] <= pts[i + 1][1] && pts[i][1] < pts[i - 2][1] && pts[i][1] < pts[i + 2][1]) {
      peaks.push(i);
    }
  }
  return { pts, peaks };
};

/** Cordillera con aristas, caras en sombra y nieve en las cumbres. */
export const Mountains: React.FC<{
  base: number;
  amp: number;
  seed: number;
  fill: string;
  scroll?: number;
  snow?: boolean;
  shadow?: number;
  snowColor?: string;
}> = ({ base, amp, seed, fill, scroll = 0, snow = true, shadow = 0.22, snowColor = "#fff4f0" }) => {
  const { pts, peaks } = ridge(-120, 1200, base, amp, seed, 36, scroll);
  const line = pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L ");
  const full = `M -120 2200 L ${line} L 1200 2200 Z`;
  return (
    <g>
      <path d={full} fill={fill} />
      {peaks.map((i) => {
        const [px, py] = pts[i];
        let j = i;
        while (j < pts.length - 1 && pts[j + 1][1] >= pts[j][1]) j++;
        const [vx, vy] = pts[j];
        return (
          <path
            key={`sh${i}`}
            d={`M ${px} ${py} L ${vx} ${vy} L ${px - 4} ${vy + 40} Q ${px + 6} ${(py + vy) / 2} ${px} ${py} Z`}
            fill="#0a0630"
            opacity={shadow}
          />
        );
      })}
      {snow &&
        peaks.map((i) => {
          const [, py] = pts[i];
          const capH = 62;
          let l = i;
          while (l > 0 && pts[l - 1][1] <= py + capH) l--;
          let r = i;
          while (r < pts.length - 1 && pts[r + 1][1] <= py + capH) r++;
          const top = pts.slice(l, r + 1).map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L ");
          let bottom = "";
          for (let k = r; k >= l; k--) {
            const bx = pts[k][0];
            const by = Math.max(pts[k][1] + 14, py + capH * (0.55 + 0.6 * rnd(k + seed * 5)));
            bottom += ` L ${bx.toFixed(1)} ${by.toFixed(1)}`;
          }
          return <path key={`sn${i}`} d={`M ${top}${bottom} Z`} fill={snowColor} opacity={0.95} />;
        })}
    </g>
  );
};

/** Silueta de ciudad: azoteas variadas, antenas con luz y ventanas que parpadean. */
export const Skyline: React.FC<{
  base: number;
  scroll: number;
  seed: number;
  color: string;
  rim: string;
  windows?: string;
  t: number;
  hScale?: number;
}> = ({ base, scroll, seed, color, rim, windows, t, hScale = 1 }) => {
  const items = Array.from({ length: 16 }).map((_, i) => {
    const w = 80 + rnd(i + seed) * 70;
    const h = (130 + rnd(i + seed + 30) * 260) * hScale;
    const x = mod(i * 118 - scroll, 1900) - 200;
    const roof = Math.floor(rnd(i + seed + 60) * 4);
    return { i, w, h, x, roof };
  });
  return (
    <g>
      {items.map(({ i, w, h, x, roof }) => {
        const top = base - h;
        const roofPath =
          roof === 0
            ? `M ${x} ${base + 140} L ${x} ${top} L ${x + w} ${top} L ${x + w} ${base + 140} Z`
            : roof === 1
              ? `M ${x} ${base + 140} L ${x} ${top + 26} L ${x + w} ${top} L ${x + w} ${base + 140} Z`
              : roof === 2
                ? `M ${x} ${base + 140} L ${x} ${top + 16} L ${x + w * 0.2} ${top + 16} L ${x + w * 0.2} ${top} L ${x + w * 0.8} ${top} L ${x + w * 0.8} ${top + 16} L ${x + w} ${top + 16} L ${x + w} ${base + 140} Z`
                : `M ${x} ${base + 140} L ${x} ${top + 30} Q ${x + w / 2} ${top - 24} ${x + w} ${top + 30} L ${x + w} ${base + 140} Z`;
        const cols = Math.max(2, Math.floor(w / 26));
        const rows = Math.floor(h / 38);
        return (
          <g key={i}>
            <path d={roofPath} fill={color} />
            <rect x={x + w - 7} y={top + 14} width={7} height={h} fill={rim} opacity={0.55} />
            {roof === 2 && (
              <>
                <line x1={x + w * 0.5} y1={top} x2={x + w * 0.5} y2={top - 38} stroke={color} strokeWidth={4} />
                <path
                  d={`M ${x + w * 0.5 - 4} ${top - 38} q 4 -8 8 0 q -4 4 -8 0 Z`}
                  fill="#ff5a5a"
                  opacity={0.4 + 0.6 * Math.abs(Math.sin(t / 12 + i))}
                />
              </>
            )}
            {windows &&
              Array.from({ length: rows * cols }).map((_, k) => {
                const cx = k % cols;
                const cy = Math.floor(k / cols);
                const on = rnd(i * 97 + k + seed) > 0.45;
                if (!on) return null;
                const flick = rnd(i * 13 + k) > 0.9 ? 0.5 + 0.5 * Math.sin(t / 7 + k) : 1;
                return (
                  <path
                    key={k}
                    d={`M ${x + 12 + cx * 24} ${top + 36 + cy * 38} h 11 q 2 0 2 2 v 12 q 0 2 -2 2 h -11 q -2 0 -2 -2 v -12 q 0 -2 2 -2 Z`}
                    fill={windows}
                    opacity={0.65 * flick}
                  />
                );
              })}
          </g>
        );
      })}
    </g>
  );
};

/** Rayos de luz suaves que se mueven. */
export const LightShafts: React.FC<{ x: number; y: number; t: number; color?: string; count?: number; len?: number; op?: number }> = ({
  x,
  y,
  t,
  color = "#fff3b0",
  count = 7,
  len = 1500,
  op = 0.18,
}) => (
  <g transform={`translate(${x} ${y})`}>
    {Array.from({ length: count }).map((_, i) => {
      const a = -80 + i * (160 / (count - 1)) + Math.sin(t / 60 + i) * 4;
      const w = 40 + (i % 3) * 25;
      return (
        <path
          key={i}
          transform={`rotate(${a})`}
          d={`M -6 0 L ${-w} ${len} L ${w} ${len} L 6 0 Z`}
          fill={color}
          opacity={op * (0.6 + 0.4 * Math.sin(t / 25 + i * 1.7))}
        />
      );
    })}
  </g>
);
