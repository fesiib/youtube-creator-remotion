import "./index.css";
import { Composition } from "remotion";
import { StickmanFight } from "./Composition";
import { StickmanFight2 } from "./Composition2";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="StickmanFight"
        component={StickmanFight}
        durationInFrames={480}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="StickmanFight2"
        component={StickmanFight2}
        durationInFrames={660}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
