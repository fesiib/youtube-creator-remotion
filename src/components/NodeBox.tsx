import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY } from "../theme";

type NodeBoxProps = {
  from: number;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  sublabel?: string;
  accent?: string;
  emphasize?: boolean;
};

// A diagram node: spring-scales in, then keeps a faint glow. Used for
// every box in the system pipeline.
export const NodeBox: React.FC<NodeBoxProps> = ({
  from,
  x,
  y,
  width,
  height,
  label,
  sublabel,
  accent = COLORS.accent,
  emphasize,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    fps,
    frame: frame - from,
    config: { damping: 16, stiffness: 140, mass: 0.6 },
  });

  const opacity = interpolate(frame, [from, from + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        transform: `scale(${0.85 + 0.15 * scale})`,
        transformOrigin: "center",
        opacity,
        background: emphasize
          ? `linear-gradient(180deg, ${COLORS.surfaceHi}, ${COLORS.surface})`
          : COLORS.surface,
        border: `2px solid ${emphasize ? accent : COLORS.border}`,
        borderRadius: 18,
        boxShadow: emphasize
          ? `0 0 0 6px ${accent}22, 0 20px 40px rgba(0,0,0,0.35)`
          : `0 12px 24px rgba(0,0,0,0.25)`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 22px",
        fontFamily: FONT_FAMILY,
        textAlign: "center",
      }}
    >
      <div
        style={{
          color: COLORS.text,
          fontWeight: 700,
          fontSize: 30,
          letterSpacing: -0.3,
          lineHeight: 1.15,
        }}
      >
        {label}
      </div>
      {sublabel ? (
        <div
          style={{
            color: COLORS.textMuted,
            fontWeight: 500,
            fontSize: 19,
            marginTop: 8,
            lineHeight: 1.3,
          }}
        >
          {sublabel}
        </div>
      ) : null}
    </div>
  );
};
