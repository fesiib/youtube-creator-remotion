import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";

// 9:16 short, ~50s at 30fps.
// Composition is the orchestrator — individual beats live in src/scenes.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={1500}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
