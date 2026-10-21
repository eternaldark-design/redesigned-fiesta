import { Composition } from "remotion";
import { MotivationVideo, TOTAL_FRAMES } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Motivacion"
      component={MotivationVideo}
      durationInFrames={TOTAL_FRAMES}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
