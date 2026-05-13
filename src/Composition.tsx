import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Scene1 } from "./scenes/Scene1";
import { Scene2 } from "./scenes/Scene2";
import { Scene3 } from "./scenes/Scene3";
import { Scene4 } from "./scenes/Scene4";
import { Scene5 } from "./scenes/Scene5";
import { Scene6 } from "./scenes/Scene6";
import { Scene7 } from "./scenes/Scene7";
import { PALETTE } from "./constants/palette";

// Total: 480 frames (16s @ 30fps)
// Scene 1: 0-90   (정적)        90 frames / 3.0s
// Scene 2: 90-150 (조우)        60 frames / 2.0s
// Scene 3: 150-210 (첫 공격)    60 frames / 2.0s
// Scene 4: 210-300 (콤보)       90 frames / 3.0s
// Scene 5: 300-360 (슬로우모션) 60 frames / 2.0s
// Scene 6: 360-450 (결정타)     90 frames / 3.0s
// Scene 7: 450-480 (엔딩)       30 frames / 1.0s
export const StickmanFight: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.background }}>
      <Sequence from={0} durationInFrames={90}>
        <Scene1 />
      </Sequence>
      <Sequence from={90} durationInFrames={60}>
        <Scene2 />
      </Sequence>
      <Sequence from={150} durationInFrames={60}>
        <Scene3 />
      </Sequence>
      <Sequence from={210} durationInFrames={90}>
        <Scene4 />
      </Sequence>
      <Sequence from={300} durationInFrames={60}>
        <Scene5 />
      </Sequence>
      <Sequence from={360} durationInFrames={90}>
        <Scene6 />
      </Sequence>
      <Sequence from={450} durationInFrames={30}>
        <Scene7 />
      </Sequence>
    </AbsoluteFill>
  );
};
