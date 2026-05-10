import { AbsoluteFill, Sequence } from "remotion";
import { AICuts } from "./scenes/AICuts";
import { ConfusedTrio } from "./scenes/ConfusedTrio";
import { EditingDef } from "./scenes/EditingDef";
import { HCISlam } from "./scenes/HCISlam";
import { Opener } from "./scenes/Opener";
import { SandwichExit } from "./scenes/SandwichExit";
import { SignOff } from "./scenes/SignOff";

// 50-second 9:16 short. Timing in frames at 30fps:
//
//   Opener         0   – 90    ( 3.0s )  Hi folks, this is Bekzat, PhDing in HCI
//   AICuts         90  – 300   ( 7.0s )  ML framing + narrator(HCI) label
//   EditingDef     300 – 540   (15.0s )  editing = cuts → DECIDING
//   ConfusedTrio   540 – 810   (22.5s )  model/you/collaborator all confused
//   SandwichExit   810 – 1080  (27.0s )  one walks off, SLAM
//   HCISlam        1080 – 1290 (36.0s )  not model, workflow — HCI stamp
//   SignOff        1290 – 1500 (43.0s ) → 50s  wave, blackout, end card
//
// Each scene receives its own local duration via Sequence, then reads
// local frames from useCurrentFrame(). Hard cuts between scenes — no
// cross-fades, on purpose (matches the dry/stiff register).

const SCENES = [
  { id: "opener", Component: Opener, from: 0, duration: 90 },
  { id: "aicuts", Component: AICuts, from: 90, duration: 210 },
  { id: "editing-def", Component: EditingDef, from: 300, duration: 240 },
  { id: "confused-trio", Component: ConfusedTrio, from: 540, duration: 270 },
  { id: "sandwich-exit", Component: SandwichExit, from: 810, duration: 270 },
  { id: "hci-slam", Component: HCISlam, from: 1080, duration: 210 },
  { id: "sign-off", Component: SignOff, from: 1290, duration: 210 },
] as const;

export const MyComposition: React.FC = () => {
  return (
    <AbsoluteFill>
      {SCENES.map(({ id, Component, from, duration }) => (
        <Sequence key={id} from={from} durationInFrames={duration} layout="none">
          <Component totalFrames={duration} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
