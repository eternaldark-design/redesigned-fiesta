import { Composition } from "remotion";
import { PovVideo } from "./pov/PovVideo";

export const FPS = 30;
/** 24 s: debe coincidir con la duración de la música (scripts/make_music.py). */
export const TOTAL_FRAMES = 720;

export const RemotionRoot: React.FC = () => (
  <Composition
    id="PovMotivacion"
    component={PovVideo}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
