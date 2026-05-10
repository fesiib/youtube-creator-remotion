import { AbsoluteFill, Sequence } from "remotion";
import { Background } from "./components/Background";
import { SceneTitle } from "./scenes/SceneTitle";
import { SceneDefinition } from "./scenes/SceneDefinition";
import { SceneExampleIntro } from "./scenes/SceneExampleIntro";
import { SceneSystem } from "./scenes/SceneSystem";
import { SceneResearch } from "./scenes/SceneResearch";
import { SceneOutro } from "./scenes/SceneOutro";
import { SCENES } from "./theme";

// Master timeline. Each scene gets its own <Sequence>, so internal
// frame counters reset to zero and we can move scenes around freely.
export const MyComposition: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />

      <Sequence from={SCENES.title.from} durationInFrames={SCENES.title.duration} layout="none">
        <SceneTitle />
      </Sequence>

      <Sequence
        from={SCENES.definition.from}
        durationInFrames={SCENES.definition.duration}
        layout="none"
      >
        <SceneDefinition />
      </Sequence>

      <Sequence
        from={SCENES.exampleIntro.from}
        durationInFrames={SCENES.exampleIntro.duration}
        layout="none"
      >
        <SceneExampleIntro />
      </Sequence>

      <Sequence
        from={SCENES.system.from}
        durationInFrames={SCENES.system.duration}
        layout="none"
      >
        <SceneSystem />
      </Sequence>

      <Sequence
        from={SCENES.research.from}
        durationInFrames={SCENES.research.duration}
        layout="none"
      >
        <SceneResearch />
      </Sequence>

      <Sequence from={SCENES.outro.from} durationInFrames={SCENES.outro.duration} layout="none">
        <SceneOutro />
      </Sequence>
    </AbsoluteFill>
  );
};
