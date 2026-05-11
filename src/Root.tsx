import "./index.css";
import { Composition } from "remotion";
import { HCIExplainer } from "./HCIExplainer";
import { MuCapExplainer } from "./MuCapExplainer";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HCIExplainer"
        component={HCIExplainer}
        durationInFrames={2760}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="MuCapExplainer"
        component={MuCapExplainer}
        durationInFrames={2760}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
