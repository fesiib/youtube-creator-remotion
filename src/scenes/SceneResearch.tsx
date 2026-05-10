import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Reveal } from "../components/Reveal";
import { COLORS, FONT_FAMILY } from "../theme";

type Item = {
  num: string;
  title: string;
  body: string;
  color: string;
};

const ITEMS: Item[] = [
  {
    num: "01",
    title: "Artifact",
    body: "a system someone could actually pick up — agents, UI, data flow",
    color: COLORS.accent,
  },
  {
    num: "02",
    title: "Study",
    body: "real editors using it, on real footage, with measured outcomes",
    color: COLORS.cyan,
  },
  {
    num: "03",
    title: "Insight",
    body: "what changes when agents get a draft cut started before you do?",
    color: COLORS.yellow,
  },
];

// Triptych explaining what the research output is. Big numbered tiles
// stagger in, each with a thin colored top edge.
export const SceneResearch: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ fontFamily: FONT_FAMILY, padding: "100px 120px" }}>
      <Reveal from={0} duration={20} translateY={16}>
        <div
          style={{
            color: COLORS.cyan,
            fontSize: 24,
            letterSpacing: 6,
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          what makes it research
        </div>
      </Reveal>

      <Reveal from={6} duration={28} translateY={24}>
        <div
          style={{
            color: COLORS.text,
            fontSize: 76,
            fontWeight: 800,
            letterSpacing: -1.8,
            lineHeight: 1.05,
            marginTop: 14,
            maxWidth: 1500,
          }}
        >
          the paper isn't the demo —
          <br />
          it's the <span style={{ color: COLORS.accent }}>artifact + study + insight</span>.
        </div>
      </Reveal>

      <div
        style={{
          marginTop: 80,
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 36,
        }}
      >
        {ITEMS.map((it, i) => {
          const start = 60 + i * 22;
          const slide = interpolate(frame, [start, start + 30], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          });
          return (
            <div
              key={it.num}
              style={{
                opacity: slide,
                transform: `translateY(${(1 - slide) * 32}px)`,
                background: COLORS.surface,
                border: `2px solid ${COLORS.border}`,
                borderRadius: 22,
                padding: "28px 32px 32px",
                height: 320,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* top accent bar */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: 6,
                  width: `${slide * 100}%`,
                  background: it.color,
                }}
              />
              <div
                style={{
                  color: it.color,
                  fontSize: 22,
                  fontWeight: 800,
                  letterSpacing: 4,
                }}
              >
                {it.num}
              </div>
              <div
                style={{
                  color: COLORS.text,
                  fontSize: 56,
                  fontWeight: 800,
                  letterSpacing: -1,
                  marginTop: 14,
                }}
              >
                {it.title}
              </div>
              <div
                style={{
                  color: COLORS.textMuted,
                  fontSize: 24,
                  fontWeight: 500,
                  marginTop: 18,
                  lineHeight: 1.35,
                }}
              >
                {it.body}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 50,
          color: COLORS.textMuted,
          fontSize: 30,
          fontWeight: 500,
          opacity: interpolate(frame, [220, 260], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          maxWidth: 1500,
          lineHeight: 1.35,
        }}
      >
        good HCI systems work generalizes — the lesson outlives the prototype.
      </div>
    </AbsoluteFill>
  );
};
