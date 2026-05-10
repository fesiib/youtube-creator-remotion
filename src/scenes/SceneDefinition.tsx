import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Reveal } from "../components/Reveal";
import { COLORS, FONT_FAMILY } from "../theme";

type Pillar = {
  symbol: string;
  title: string;
  body: string;
  color: string;
};

const PILLARS: Pillar[] = [
  {
    symbol: "◆",
    title: "Build",
    body: "design a system that doesn't exist yet",
    color: COLORS.accent,
  },
  {
    symbol: "◎",
    title: "Study",
    body: "put it in front of people, watch what happens",
    color: COLORS.cyan,
  },
  {
    symbol: "✦",
    title: "Contribute",
    body: "report what's now possible — and why",
    color: COLORS.yellow,
  },
];

// Three-pillar definition. Headline appears, then pillars stagger in,
// then a one-liner sums it up.
export const SceneDefinition: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        fontFamily: FONT_FAMILY,
        padding: "120px 160px",
      }}
    >
      <Reveal from={0} duration={20} translateY={20}>
        <div
          style={{
            color: COLORS.accent,
            fontSize: 24,
            letterSpacing: 6,
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          the basic loop
        </div>
      </Reveal>

      <Reveal from={6} duration={28} translateY={28}>
        <div
          style={{
            color: COLORS.text,
            fontSize: 76,
            fontWeight: 800,
            letterSpacing: -1.6,
            lineHeight: 1.06,
            marginTop: 18,
            maxWidth: 1600,
          }}
        >
          <span style={{ color: COLORS.accent }}>Build tools.</span>{" "}
          Study how people use them.
        </div>
      </Reveal>

      <div
        style={{
          marginTop: 90,
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 40,
        }}
      >
        {PILLARS.map((p, i) => {
          const start = 60 + i * 18;
          return (
            <Reveal key={p.title} from={start} duration={26} translateY={28}>
              <div
                style={{
                  background: COLORS.surface,
                  border: `2px solid ${COLORS.border}`,
                  borderRadius: 22,
                  padding: "30px 32px 32px",
                  height: 280,
                }}
              >
                <div
                  style={{
                    color: p.color,
                    fontSize: 56,
                    lineHeight: 1,
                    marginBottom: 18,
                    fontWeight: 800,
                  }}
                >
                  {p.symbol}
                </div>
                <div
                  style={{
                    color: COLORS.text,
                    fontSize: 44,
                    fontWeight: 800,
                    letterSpacing: -1,
                  }}
                >
                  {p.title}
                </div>
                <div
                  style={{
                    color: COLORS.textMuted,
                    fontSize: 24,
                    fontWeight: 500,
                    marginTop: 14,
                    lineHeight: 1.35,
                  }}
                >
                  {p.body}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 56,
          color: COLORS.textMuted,
          fontSize: 30,
          fontWeight: 500,
          opacity: interpolate(frame, [150, 180], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        not just a product — a way of asking research questions through software.
      </div>
    </AbsoluteFill>
  );
};
