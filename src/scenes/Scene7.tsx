import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Stickman,
  KO_FOLLOWTHROUGH_POSE,
  STANDING_POSE,
  interpolatePose,
} from "../components/Stickman";
import { Ground } from "../components/Ground";
import { Vignette } from "../components/Shot";
import { PALETTE } from "../constants/palette";

// Scene 7 — "엔딩" (frames 450-480 of master, 30 frames / 1s)
//
// The dust has settled. Hero stands alone, post-K.O. Minimal CTA at the
// bottom. Camera holds. The fight is over.
export const Scene7: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const groundY = height / 2 + 220;
  const heroX = width / 2;

  // Hero relaxes from follow-through into a simple standing pose
  const t = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Subtle breathing on top
  const breath = Math.sin(frame * 0.18) * 1.2;
  const heroPose = {
    ...interpolatePose(t, KO_FOLLOWTHROUGH_POSE, STANDING_POSE),
    torsoLean:
      interpolatePose(t, KO_FOLLOWTHROUGH_POSE, STANDING_POSE).torsoLean +
      breath,
  };

  // Subtle slow zoom in
  const zoom = interpolate(frame, [0, 30], [1.0, 1.04]);

  // CTA fades in
  const ctaOpacity = interpolate(frame, [8, 18, 30], [0, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Lingering faint dust lines fading away
  const dustOpacity = interpolate(frame, [0, 20], [0.4, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.background }}>
      <AbsoluteFill
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "center center",
        }}
      >
        <Ground y={groundY} shadowX={heroX} shadowWidth={320} />

        {/* Lingering dust streaks left over from the K.O. */}
        <div
          style={{
            position: "absolute",
            left: width * 0.6,
            top: groundY - 80,
            width: width * 0.35,
            height: 4,
            background:
              "linear-gradient(to right, rgba(60,60,60,0.5) 0%, transparent 100%)",
            opacity: dustOpacity,
            filter: "blur(2px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: width * 0.65,
            top: groundY - 200,
            width: width * 0.28,
            height: 3,
            background:
              "linear-gradient(to right, rgba(60,60,60,0.4) 0%, transparent 100%)",
            opacity: dustOpacity * 0.85,
            filter: "blur(2px)",
          }}
        />

        <Stickman
          x={heroX}
          y={groundY}
          scale={3.4}
          facing="right"
          pose={heroPose}
          color={PALETTE.hero}
          strokeWidth={8}
        />
      </AbsoluteFill>

      {/* CTA — minimal, just an indicator there's more */}
      <div
        style={{
          position: "absolute",
          bottom: 180,
          width: "100%",
          textAlign: "center",
          color: "#2a2a2a",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Pretendard', 'Noto Sans KR', sans-serif",
          fontSize: 56,
          fontWeight: 500,
          letterSpacing: "0.15em",
          opacity: ctaOpacity,
          zIndex: 5,
        }}
      >
        다음 편 →
      </div>

      <Vignette intensity={0.22} />
    </AbsoluteFill>
  );
};
