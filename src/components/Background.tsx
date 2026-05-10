import { AbsoluteFill } from "remotion";
import { theme } from "../theme";

// Solid cream "paper" backdrop with a faint grid of dots so the
// stick-figure scenes don't read as floating in a void. The dots
// are static, drawn once — no animation. Restrained on purpose.
export const Background: React.FC = () => {
  const cols = 10;
  const rows = 18;
  const gapX = 1080 / cols;
  const gapY = 1920 / rows;

  const dots: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Offset every other row so the dots feel slightly less grid-y.
      const x = c * gapX + gapX / 2 + (r % 2 === 0 ? 0 : gapX / 4);
      const y = r * gapY + gapY / 2;
      dots.push(
        <circle
          key={`${r}-${c}`}
          cx={x}
          cy={y}
          r={2.5}
          fill={theme.paperShade}
        />,
      );
    }
  }

  return (
    <AbsoluteFill style={{ backgroundColor: theme.paper }}>
      <svg
        width={1080}
        height={1920}
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", inset: 0 }}
      >
        {dots}
      </svg>
    </AbsoluteFill>
  );
};
