import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";

// Subtle animated background: dotted grid that drifts very slowly,
// plus a soft radial vignette. Static look, not distracting.
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = (frame * 0.15) % 40;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${COLORS.border} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          backgroundPosition: `${drift}px ${drift}px`,
          opacity: 0.5,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 40%, transparent 0%, ${COLORS.bg} 75%)`,
        }}
      />
    </AbsoluteFill>
  );
};
