import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Background } from "../components/Background";
import { fontStack, theme } from "../theme";

type HCISlamProps = {
  totalFrames: number;
};

// 0:36–0:43 — The "this is HCI" punchline. The HCI label drops in from above,
// overshoots once, lands crooked. Two faint background labels ("not a model
// problem / a workflow problem") sit behind the stamp, getting overrun by it.
export const HCISlam: React.FC<HCISlamProps> = () => {
  const frame = useCurrentFrame();

  // Background text fades in early.
  const bgOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Strike-through on "model problem" appears after a beat.
  const strikeProgress = interpolate(frame, [40, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // HCI stamp drop with overshoot.
  const stampStart = 70;
  const stampDrop = interpolate(
    frame,
    [stampStart, stampStart + 18],
    [-800, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.34, 1.7, 0.64, 1),
    },
  );
  const stampOpacity = interpolate(frame, [stampStart, stampStart + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Brief impact shake on the whole frame.
  const impactFrame = stampStart + 18;
  const shake = interpolate(
    frame,
    [impactFrame, impactFrame + 4, impactFrame + 8, impactFrame + 12],
    [0, 14, -10, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ transform: `translateY(${shake}px)` }}>
      <Background />

      {/* Background statements */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 540,
          textAlign: "center",
          fontFamily: fontStack,
          fontWeight: 900,
          fontSize: 78,
          color: theme.ink,
          letterSpacing: -2,
          opacity: bgOpacity,
        }}
      >
        not a{" "}
        <span style={{ position: "relative", display: "inline-block" }}>
          model problem
          <span
            style={{
              position: "absolute",
              left: 0,
              top: "50%",
              height: 8,
              backgroundColor: theme.accent,
              width: `${strikeProgress * 100}%`,
            }}
          />
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 660,
          textAlign: "center",
          fontFamily: fontStack,
          fontWeight: 900,
          fontSize: 78,
          color: theme.ink,
          letterSpacing: -2,
          opacity: bgOpacity,
        }}
      >
        a{" "}
        <span style={{ color: theme.accent }}>workflow</span> problem
      </div>

      {/* HCI stamp */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 900,
          display: "flex",
          justifyContent: "center",
          opacity: stampOpacity,
          transform: `translateY(${stampDrop}px) rotate(-7deg)`,
        }}
      >
        <div
          style={{
            backgroundColor: theme.accent,
            color: "#FFFFFF",
            fontFamily: fontStack,
            fontWeight: 900,
            fontSize: 360,
            letterSpacing: -10,
            padding: "20px 60px 40px",
            border: `12px solid ${theme.ink}`,
            boxShadow: `12px 12px 0 ${theme.ink}`,
          }}
        >
          HCI
        </div>
      </div>

      {/* No bottom caption here — the background statements + the HCI
          stamp are already carrying the message; doubling it up would
          make the scene feel cluttered. */}
    </AbsoluteFill>
  );
};
