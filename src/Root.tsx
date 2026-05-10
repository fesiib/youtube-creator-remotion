import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
