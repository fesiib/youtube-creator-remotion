import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Scene1 as Ep2Scene1 } from "./scenes-ep2/Scene1";
import { Scene2 as Ep2Scene2 } from "./scenes-ep2/Scene2";
import { Scene3 as Ep2Scene3 } from "./scenes-ep2/Scene3";
import { Scene4 as Ep2Scene4 } from "./scenes-ep2/Scene4";
import { Scene5 as Ep2Scene5 } from "./scenes-ep2/Scene5";
import { Scene6 as Ep2Scene6 } from "./scenes-ep2/Scene6";
import { Scene7 as Ep2Scene7 } from "./scenes-ep2/Scene7";
import { PALETTE } from "./constants/palette";

// Episode 2 — "검투 / 1대2 / 공중 역전극"
// Total: 660 frames (22s @ 30fps)
//
// Scene 1:   0-60   (입장)                     60f / 2.0s
// Scene 2:  60-180  (첫 클래시 + 기습)         120f / 4.0s
// Scene 3: 180-330  (무릎 + 각성)              150f / 5.0s
// Scene 4: 330-450  (공중 슬래시 1 — Enemy A)  120f / 4.0s
// Scene 5: 450-540  (공중 피벗 — Enemy B)       90f / 3.0s
// Scene 6: 540-620  (결정타 슬로우 + 착지)      80f / 2.67s
// Scene 7: 620-660  (엔딩)                      40f / 1.33s
export const StickmanFight2: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.background }}>
      <Sequence from={0} durationInFrames={60}>
        <Ep2Scene1 />
      </Sequence>
      <Sequence from={60} durationInFrames={120}>
        <Ep2Scene2 />
      </Sequence>
      <Sequence from={180} durationInFrames={150}>
        <Ep2Scene3 />
      </Sequence>
      <Sequence from={330} durationInFrames={120}>
        <Ep2Scene4 />
      </Sequence>
      <Sequence from={450} durationInFrames={90}>
        <Ep2Scene5 />
      </Sequence>
      <Sequence from={540} durationInFrames={80}>
        <Ep2Scene6 />
      </Sequence>
      <Sequence from={620} durationInFrames={40}>
        <Ep2Scene7 />
      </Sequence>
    </AbsoluteFill>
  );
};
