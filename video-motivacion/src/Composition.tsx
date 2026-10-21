import React from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/fonts";

loadFont({
  family: "Montserrat",
  url: staticFile("fonts/Montserrat-Black.ttf"),
  weight: "900",
});

const FONT = "Montserrat, sans-serif";

type Scene = {
  lines: string[];
  from: number;
  duration: number;
  accent?: boolean;
};

const FPS = 30;
const s = (sec: number) => Math.round(sec * FPS);

const SCENES: Scene[] = [
  { lines: ["NADIE VENDRÁ", "A SALVARTE"], from: s(0), duration: s(3) },
  { lines: ["TÚ ERES", "EL PLAN"], from: s(3), duration: s(3), accent: true },
  { lines: ["LEVÁNTATE", "ANTES QUE", "TUS EXCUSAS"], from: s(6), duration: s(3.5) },
  { lines: ["SÉ DISCIPLINADO", "AUNQUE NO", "TENGAS GANAS"], from: s(9.5), duration: s(3.5) },
  { lines: ["TU YO DEL FUTURO", "TE ESTÁ", "MIRANDO"], from: s(13), duration: s(3), accent: true },
  { lines: ["EMPIEZA", "HOY."], from: s(16), duration: s(4), accent: true },
];

export const TOTAL_FRAMES = s(20);

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const angle = 160 + Math.sin(frame / 60) * 20;
  const glow = 0.35 + Math.sin(frame / 25) * 0.1;
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${angle}deg, #0a0a14 0%, #1b0b3a 55%, #3a0b2e 100%)`,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 70%, rgba(255,140,0,${glow}) 0%, rgba(255,140,0,0) 55%)`,
        }}
      />
      {Array.from({ length: 14 }).map((_, i) => {
        const x = (i * 193) % 1080;
        const speed = 0.6 + (i % 5) * 0.3;
        const y = 1920 - ((frame * speed * 3 + i * 260) % 2100);
        const size = 6 + (i % 4) * 4;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: "rgba(255,180,60,0.55)",
              filter: "blur(1px)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const SceneView: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const outStart = scene.duration - 8;
  const fadeOut = interpolate(frame, [outStart, scene.duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: "0 70px",
        opacity: fadeOut,
      }}
    >
      {scene.lines.map((line, i) => {
        const delay = i * 8;
        const p = spring({
          frame: frame - delay,
          fps,
          config: { damping: 14, stiffness: 120 },
        });
        const y = interpolate(p, [0, 1], [90, 0]);
        const scale = interpolate(p, [0, 1], [0.85, 1]);
        const isLast = i === scene.lines.length - 1;
        const color = scene.accent && isLast ? "#ffb020" : "#ffffff";
        const size = line.length > 12 ? 92 : 130;
        return (
          <div
            key={i}
            style={{
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: size,
              lineHeight: 1.1,
              textAlign: "center",
              color,
              opacity: Math.min(1, p * 1.5),
              transform: `translateY(${y}px) scale(${scale})`,
              textShadow: "0 8px 40px rgba(0,0,0,0.6)",
              letterSpacing: -2,
            }}
          >
            {line}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const w = interpolate(frame, [0, TOTAL_FRAMES], [0, 100], {
    easing: Easing.linear,
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        bottom: 420,
        height: 10,
        borderRadius: 5,
        background: "rgba(255,255,255,0.15)",
      }}
    >
      <div
        style={{
          width: `${w}%`,
          height: "100%",
          borderRadius: 5,
          background: "#ffb020",
        }}
      />
    </div>
  );
};

export const MotivationVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />
      {SCENES.map((scene, i) => (
        <Sequence key={i} from={scene.from} durationInFrames={scene.duration}>
          <SceneView scene={scene} />
        </Sequence>
      ))}
      <ProgressBar />
    </AbsoluteFill>
  );
};
