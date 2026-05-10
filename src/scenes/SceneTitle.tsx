import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT_FAMILY } from "../theme";

const WORDS = ["HCI", "Systems", "Research"];

// Word-by-word reveal of the title. Each word does a vertical lift +
// fade, with a coral underline that swipes in across all three.
export const SceneTitle: React.FC = () => {
  const frame = useCurrentFrame();

  const subOpacity = interpolate(frame, [60, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const underlineW = interpolate(frame, [70, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: FONT_FAMILY,
      }}
    >
      <div
        style={{
          fontSize: 28,
          letterSpacing: 8,
          color: COLORS.accent,
          fontWeight: 600,
          textTransform: "uppercase",
          opacity: interpolate(frame, [0, 18], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          transform: `translateY(${interpolate(frame, [0, 24], [16, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}px)`,
          marginBottom: 24,
        }}
      >
        an explainer · 60 seconds
      </div>

      <div style={{ display: "flex", gap: 28 }}>
        {WORDS.map((word, i) => {
          const start = 12 + i * 14;
          const t = interpolate(frame, [start, start + 26], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          });
          return (
            <span
              key={word}
              style={{
                color: COLORS.text,
                fontSize: 140,
                fontWeight: 800,
                letterSpacing: -3,
                lineHeight: 1,
                opacity: t,
                transform: `translateY(${(1 - t) * 36}px)`,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 14,
          height: 6,
          width: 720,
          background: COLORS.border,
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${underlineW * 100}%`,
            background: COLORS.accent,
            borderRadius: 4,
          }}
        />
      </div>

      <div
        style={{
          marginTop: 36,
          color: COLORS.textMuted,
          fontSize: 32,
          fontWeight: 500,
          opacity: subOpacity,
        }}
      >
        what is it, and why should you care?
      </div>
    </AbsoluteFill>
  );
};
