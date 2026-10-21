import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ACCENT, FONT } from "./utils";

export type CaptionData = {
  from: number;
  duration: number;
  lines: string[];
  /** Colorea la última línea con el acento. */
  accent?: boolean;
};

export const CAPTIONS: CaptionData[] = [
  { from: 0, duration: 120, lines: ["NADIE VENDRÁ", "A SALVARTE"] },
  { from: 120, duration: 120, lines: ["LEVÁNTATE", "ANTES QUE", "TUS EXCUSAS"], accent: true },
  { from: 240, duration: 180, lines: ["SÉ DISCIPLINADO", "AUNQUE NO", "TENGAS GANAS"] },
  { from: 420, duration: 120, lines: ["CADA PASO", "TE ACERCA", "A LA CIMA"], accent: true },
  { from: 540, duration: 90, lines: ["TU YO DEL FUTURO", "TE ESTÁ", "MIRANDO"], accent: true },
  { from: 630, duration: 90, lines: ["EMPIEZA", "HOY."], accent: true },
];

const CaptionCard: React.FC<{ data: CaptionData }> = ({ data }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 15, stiffness: 140 } });
  const out = interpolate(frame, [data.duration - 7, data.duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bar = interpolate(frame, [8, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start" }}>
      <div
        style={{
          marginTop: 270,
          width: 940,
          padding: "34px 30px 40px",
          borderRadius: 40,
          background: "rgba(14,10,38,0.78)",
          border: "3px solid rgba(255,255,255,0.14)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
          opacity: out * Math.min(1, enter * 1.4),
          transform: `translateY(${(1 - enter) * -60}px) scale(${0.92 + enter * 0.08})`,
          textAlign: "center",
        }}
      >
        {data.lines.map((line, i) => {
          const size = Math.min(112, Math.floor(820 / (line.length * 0.74)));
          const last = data.accent && i === data.lines.length - 1;
          const p = spring({
            frame: frame - 4 - i * 6,
            fps,
            config: { damping: 14, stiffness: 150 },
          });
          return (
            <div
              key={i}
              style={{
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: size,
                lineHeight: 1.12,
                letterSpacing: -1.5,
                color: last ? ACCENT : "#fff",
                opacity: Math.min(1, p * 1.5),
                transform: `translateY(${(1 - p) * 40}px)`,
              }}
            >
              {line}
            </div>
          );
        })}
        <div
          style={{
            margin: "18px auto 0",
            height: 10,
            width: 260 * bar,
            borderRadius: 5,
            background: ACCENT,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

const SeqWrap: React.FC<{ data: CaptionData }> = ({ data }) => (
  <Sequence from={data.from} durationInFrames={data.duration}>
    <CaptionCard data={data} />
  </Sequence>
);

export const Captions: React.FC = () => {
  return (
    <>
      {CAPTIONS.map((c, i) => (
        <SeqWrap key={i} data={c} />
      ))}
    </>
  );
};
