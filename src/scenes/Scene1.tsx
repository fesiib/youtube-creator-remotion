import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Stickman, STANDING_POSE } from "../components/Stickman";
import { Ground } from "../components/Ground";
import { Vignette } from "../components/Shot";
import { PALETTE } from "../constants/palette";

// Scene 1 — "정적" (frames 0-90, 3s)
// Stickman is already on screen at frame 0 (no dissolve). Slow zoom in.
// Caption "조용하다..." appears early and lingers so it's actually readable.
export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // No fade-in. Stickman and ground are fully visible from the first frame.
  const stickmanOpacity = 1;

  // Slow zoom over the whole 90 frames
  const zoom = interpolate(frame, [0, 90], [1.0, 1.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Caption: fade in quickly (5-15), hold long, soft fade out at the very end (80-90)
  const captionOpacity = interpolate(
    frame,
    [5, 15, 80, 90],
    [0, 1, 1, 0.2],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  // Subtle breathing motion: slow torso sway + faint arm sway
  const breath = Math.sin(frame / 10) * 1.2;
  const armSway = Math.sin(frame / 10 + 0.3) * 0.8;
  const pose = {
    ...STANDING_POSE,
    torsoLean: breath,
    leftShoulder: STANDING_POSE.leftShoulder - armSway,
    rightShoulder: STANDING_POSE.rightShoulder + armSway,
  };

  // Stickman's feet sit at this y; ground horizon aligns with it.
  const groundY = height / 2 + 220;

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.background }}>
      {/* Zoom layer */}
      <AbsoluteFill
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "center center",
        }}
      >
        <Ground
          y={groundY}
          opacity={stickmanOpacity}
          shadowX={width / 2}
        />

        <Stickman
          x={width / 2}
          y={groundY}
          scale={3.2}
          facing="right"
          pose={pose}
          opacity={stickmanOpacity}
          color={PALETTE.hero}
          strokeWidth={7}
        />
      </AbsoluteFill>

      <Vignette />

      {/* Caption */}
      <div
        style={{
          position: "absolute",
          bottom: 220,
          width: "100%",
          textAlign: "center",
          color: "#3a3a3a",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Pretendard', 'Noto Sans KR', sans-serif",
          fontSize: 64,
          fontWeight: 300,
          letterSpacing: "0.05em",
          opacity: captionOpacity,
          zIndex: 4,
        }}
      >
        조용하다...
      </div>
    </AbsoluteFill>
  );
};
