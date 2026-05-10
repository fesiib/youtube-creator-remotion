import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT_FAMILY } from "../theme";

// Tag + headline transition card. Sets up the worked example.
export const SceneExampleIntro: React.FC = () => {
  const frame = useCurrentFrame();

  const tag = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const line1 = interpolate(frame, [12, 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const line2 = interpolate(frame, [28, 56], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const sub = interpolate(frame, [60, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        fontFamily: FONT_FAMILY,
        justifyContent: "center",
        padding: "0 160px",
      }}
    >
      <div
        style={{
          color: COLORS.cyan,
          fontSize: 28,
          letterSpacing: 8,
          textTransform: "uppercase",
          fontWeight: 600,
          opacity: tag,
          transform: `translateY(${(1 - tag) * 16}px)`,
          marginBottom: 28,
        }}
      >
        a worked example
      </div>

      <div
        style={{
          color: COLORS.text,
          fontSize: 130,
          fontWeight: 800,
          letterSpacing: -3,
          lineHeight: 1.02,
          opacity: line1,
          transform: `translateY(${(1 - line1) * 28}px)`,
        }}
      >
        Agentic workflows
      </div>
      <div
        style={{
          color: COLORS.accent,
          fontSize: 130,
          fontWeight: 800,
          letterSpacing: -3,
          lineHeight: 1.02,
          opacity: line2,
          transform: `translateY(${(1 - line2) * 28}px)`,
        }}
      >
        for video editing.
      </div>

      <div
        style={{
          marginTop: 48,
          color: COLORS.textMuted,
          fontSize: 32,
          fontWeight: 500,
          maxWidth: 1300,
          lineHeight: 1.35,
          opacity: sub,
        }}
      >
        you describe what you want — a team of LLM agents drafts the cut,
        and you steer.
      </div>
    </AbsoluteFill>
  );
};
