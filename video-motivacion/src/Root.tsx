import { Composition } from "remotion";
import { FPS, MotivationVideo, TOTAL_FRAMES } from "./Composition";
import { Room, ROOM_FRAMES } from "./scenes/Room";
import { Run, RUN_FRAMES } from "./scenes/Run";
import { Climb, CLIMB_FRAMES } from "./scenes/Climb";
import { Summit, SUMMIT_FRAMES } from "./scenes/Summit";

const size = { fps: FPS, width: 1080, height: 1920 };

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="Motivacion" component={MotivationVideo} durationInFrames={TOTAL_FRAMES} {...size} />
      <Composition id="Escena1-Cuarto" component={Room} durationInFrames={ROOM_FRAMES} {...size} />
      <Composition id="Escena2-Carrera" component={Run} durationInFrames={RUN_FRAMES} {...size} />
      <Composition id="Escena3-Escaleras" component={Climb} durationInFrames={CLIMB_FRAMES} {...size} />
      <Composition id="Escena4-Cima" component={Summit} durationInFrames={SUMMIT_FRAMES} {...size} />
    </>
  );
};
