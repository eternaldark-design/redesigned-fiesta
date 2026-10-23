import React from "react";
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/fonts";
import { Room, ROOM_FRAMES } from "./scenes/Room";
import { Run, RUN_FRAMES } from "./scenes/Run";
import { Climb, CLIMB_FRAMES } from "./scenes/Climb";
import { Summit, SUMMIT_FRAMES } from "./scenes/Summit";
import { Captions } from "./Caption";
import { Hud } from "./Hud";
import { ACCENT } from "./utils";

loadFont({
  family: "Montserrat",
  url: staticFile("fonts/Montserrat-Black.ttf"),
  weight: "900",
});

export const FPS = 30;
export const TOTAL_FRAMES = 720;
const WIPE = 14;

/** La escena entra deslizándose desde la derecha con un borde de color. */
const WipeIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, WIPE], [1080, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill style={{ transform: `translateX(${x}px)` }}>
      {children}
      <div
        style={{
          position: "absolute",
          left: -22,
          top: 0,
          width: 22,
          height: "100%",
          background: ACCENT,
        }}
      />
    </AbsoluteFill>
  );
};

export const MotivationVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Audio src={staticFile("music.wav")} />
      <Sequence from={0} durationInFrames={ROOM_FRAMES}>
        <Room />
      </Sequence>
      <Sequence from={240} durationInFrames={RUN_FRAMES}>
        <WipeIn>
          <Run />
        </WipeIn>
      </Sequence>
      <Sequence from={420} durationInFrames={CLIMB_FRAMES}>
        <WipeIn>
          <Climb />
        </WipeIn>
      </Sequence>
      <Sequence from={540} durationInFrames={SUMMIT_FRAMES}>
        <Summit />
      </Sequence>
      <Captions />
      <Hud />
    </AbsoluteFill>
  );
};
