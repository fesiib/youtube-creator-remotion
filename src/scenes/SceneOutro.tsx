import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT_FAMILY } from "../theme";

// Closing card: thesis line + channel CTA. Kept short and punchy.
export const SceneOutro: React.FC = () => {
  const frame = useCurrentFrame();

  const line1 = interpolate(frame, [0, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const line2 = interpolate(frame, [16, 44], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const cta = interpolate(frame, [60, 96], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const pulse = 1 + 0.04 * Math.sin(frame / 6);

  return (
    <AbsoluteFill
      style={{
        fontFamily: FONT_FAMILY,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <div
        style={{
          color: COLORS.text,
          fontSize: 130,
          fontWeight: 800,
          letterSpacing: -3,
          lineHeight: 1.02,
          opacity: line1,
          transform: `translateY(${(1 - line1) * 30}px)`,
        }}
      >
        Build for people.
      </div>
      <div
        style={{
          color: COLORS.accent,
          fontSize: 130,
          fontWeight: 800,
          letterSpacing: -3,
          lineHeight: 1.02,
          opacity: line2,
          transform: `translateY(${(1 - line2) * 30}px)`,
          marginTop: 8,
        }}
      >
        Study what changes.
      </div>

      <div
        style={{
          marginTop: 60,
          opacity: cta,
          transform: `scale(${pulse})`,
          padding: "18px 40px",
          background: COLORS.accent,
          color: COLORS.bg,
          fontSize: 32,
          fontWeight: 800,
          letterSpacing: 1,
          borderRadius: 999,
          textTransform: "uppercase",
        }}
      >
        ▶ subscribe for more HCI breakdowns
      </div>
    </AbsoluteFill>
  );
};
