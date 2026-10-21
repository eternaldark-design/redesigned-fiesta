import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ACCENT, FONT } from "./utils";

/** Límites de cada escena en cuadros, para la barra tipo "stories". */
export const SCENE_BOUNDS = [0, 240, 420, 540, 720];

export const Hud: React.FC = () => {
  const frame = useCurrentFrame();
  const total = SCENE_BOUNDS.length - 1;
  const gap = 10;
  const w = (960 - gap * (total - 1)) / total;

  return (
    <AbsoluteFill>
      {SCENE_BOUNDS.slice(0, -1).map((start, i) => {
        const fill = interpolate(frame, [start, SCENE_BOUNDS[i + 1]], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 60 + i * (w + gap),
              top: 150,
              width: w,
              height: 10,
              borderRadius: 5,
              background: "rgba(255,255,255,0.3)",
              overflow: "hidden",
            }}
          >
            <div style={{ width: `${fill * 100}%`, height: "100%", background: "#fff" }} />
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          top: 180,
          left: 60,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 22px",
          borderRadius: 30,
          background: "rgba(14,10,38,0.7)",
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 28,
          color: "#fff",
          letterSpacing: 2,
        }}
      >
        <span
          style={{
            width: 16,
            height: 16,
            borderRadius: 8,
            background: ACCENT,
            opacity: 0.6 + 0.4 * Math.sin(frame / 6),
          }}
        />
        MOTIVACIÓN DIARIA
      </div>
    </AbsoluteFill>
  );
};
