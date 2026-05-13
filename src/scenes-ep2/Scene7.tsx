import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Stickman,
  SWORD_FINISHER,
  SWORD_STANCE,
  interpolatePose,
} from "../components/Stickman";
import { Ground } from "../components/Ground";
import { Vignette } from "../components/Shot";
import { PALETTE } from "../constants/palette";

const SWORD_LEN = 62;

// Scene 7 — 엔딩 (frames 620-660 of EP2, 40f / 1.33s)
//
// Hero alone at center, sword lowering. Two faint silhouettes of the
// defeated enemies on the far edges of the frame. Minimal CTA at the bottom.
export const Scene7: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const groundY = height / 2 + 220;
  const heroX = width / 2;

  // Hero pose: FINISHER → relaxed SWORD_STANCE (sword lowering)
  const t = interpolate(frame, [0, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const heroPose = interpolatePose(t, SWORD_FINISHER, SWORD_STANCE);

  // Slow zoom in
  const zoom = interpolate(frame, [0, 40], [1.0, 1.04]);

  // CTA fade in
  const ctaOpacity = interpolate(frame, [10, 22, 40], [0, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Lingering dust fading away
  const dustOpacity = interpolate(frame, [0, 30], [0.35, 0], {
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
        <Ground y={groundY} shadowX={heroX} shadowWidth={340} />

        {/* Faint silhouettes of the defeated enemies on each edge */}
        <div
          style={{
            position: "absolute",
            left: 30,
            top: groundY - 6,
            width: 100,
            height: 14,
            background: "rgba(156,156,156,0.55)",
            borderRadius: 7,
            transform: "rotate(-3deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 30,
            top: groundY - 6,
            width: 100,
            height: 14,
            background: "rgba(156,156,156,0.55)",
            borderRadius: 7,
            transform: "rotate(3deg)",
          }}
        />

        {/* Lingering dust streaks */}
        <div
          style={{
            position: "absolute",
            left: width * 0.15,
            top: groundY - 100,
            width: width * 0.25,
            height: 4,
            background:
              "linear-gradient(to right, transparent 0%, rgba(60,60,60,0.5) 50%, transparent 100%)",
            opacity: dustOpacity,
            filter: "blur(2px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: width * 0.6,
            top: groundY - 180,
            width: width * 0.28,
            height: 3,
            background:
              "linear-gradient(to right, transparent 0%, rgba(60,60,60,0.4) 50%, transparent 100%)",
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
          weapon={{ length: SWORD_LEN, color: PALETTE.hero }}
        />
      </AbsoluteFill>

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
