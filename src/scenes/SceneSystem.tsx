import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { Reveal } from "../components/Reveal";
import { NodeBox } from "../components/NodeBox";
import { Arrow } from "../components/Arrow";
import { COLORS, FONT_FAMILY } from "../theme";

// Layout (1920x1080):
//   User Intent (left)  →  Planner (center top)  →  Tool agents (center, stacked)
//                                                         →  Timeline (right)
//   Feedback arrow loops Timeline → User along the bottom.
//
// The whole pipeline is built from frame-relative reveals, so the
// scene can sit anywhere on the master timeline.
const LAYOUT = {
  intent: { x: 90, y: 420, w: 380, h: 240 },
  planner: { x: 770, y: 240, w: 380, h: 150 },
  tool1: { x: 770, y: 440, w: 380, h: 90 },
  tool2: { x: 770, y: 550, w: 380, h: 90 },
  tool3: { x: 770, y: 660, w: 380, h: 90 },
  timeline: { x: 1450, y: 420, w: 380, h: 240 },
};

const TOOLS = [
  { label: "Transcriber", sub: "speech → tokens" },
  { label: "Editor", sub: "cuts, trims, jump cuts" },
  { label: "B-roll & music", sub: "fetch, place, level" },
];

export const SceneSystem: React.FC = () => {
  const frame = useCurrentFrame();
  const L = LAYOUT;

  // Center anchor helpers
  const rightMid = (b: { x: number; y: number; w: number; h: number }) => ({
    x: b.x + b.w,
    y: b.y + b.h / 2,
  });
  const leftMid = (b: { x: number; y: number; w: number; h: number }) => ({
    x: b.x,
    y: b.y + b.h / 2,
  });
  const bottomMid = (b: { x: number; y: number; w: number; h: number }) => ({
    x: b.x + b.w / 2,
    y: b.y + b.h,
  });

  // Arrow paths
  const intentToPlanner = (() => {
    const a = rightMid(L.intent);
    const b = leftMid(L.planner);
    const midX = (a.x + b.x) / 2;
    return `M ${a.x} ${a.y} C ${midX} ${a.y}, ${midX} ${b.y}, ${b.x - 14} ${b.y}`;
  })();

  const plannerToTool = (tool: typeof L.tool1) => {
    const a = bottomMid(L.planner);
    const b = leftMid(tool);
    const midY = (a.y + b.y) / 2;
    return `M ${a.x} ${a.y} C ${a.x} ${midY}, ${b.x - 80} ${midY}, ${b.x - 14} ${b.y}`;
  };

  const toolToTimeline = (tool: typeof L.tool1) => {
    const a = rightMid(tool);
    const b = leftMid(L.timeline);
    const midX = (a.x + b.x) / 2;
    return `M ${a.x} ${a.y} C ${midX} ${a.y}, ${midX} ${b.y}, ${b.x - 14} ${b.y}`;
  };

  const feedback = (() => {
    const a = bottomMid(L.timeline);
    const b = bottomMid(L.intent);
    const dipY = 940;
    return `M ${a.x} ${a.y} C ${a.x} ${dipY}, ${b.x} ${dipY}, ${b.x} ${b.y + 14}`;
  })();

  // Reveal schedule (frame offsets, scene-relative)
  const T = {
    title: 0,
    intent: 20,
    arrow1: 56,
    planner: 80,
    arrowsToTools: 120,
    tools: [140, 158, 176],
    arrowsToTimeline: 220,
    timeline: 260,
    feedback: 360,
    feedbackLabel: 400,
    closing: 560,
  };

  // Mini timeline animation inside the Timeline node
  const timelineProgress = interpolate(frame, [280, 400], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ fontFamily: FONT_FAMILY }}>
      {/* Header */}
      <div style={{ padding: "70px 100px 0" }}>
        <Reveal from={T.title} duration={20} translateY={16}>
          <div
            style={{
              color: COLORS.cyan,
              fontSize: 24,
              letterSpacing: 6,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            the system
          </div>
        </Reveal>
        <Reveal from={T.title + 6} duration={26} translateY={20}>
          <div
            style={{
              color: COLORS.text,
              fontSize: 64,
              fontWeight: 800,
              letterSpacing: -1.5,
              lineHeight: 1.05,
              marginTop: 12,
              maxWidth: 1500,
            }}
          >
            from <span style={{ color: COLORS.accent }}>intent</span> to a draft
            timeline — with you in the loop.
          </div>
        </Reveal>
      </div>

      {/* Nodes */}
      <NodeBox
        from={T.intent}
        x={L.intent.x}
        y={L.intent.y}
        width={L.intent.w}
        height={L.intent.h}
        label="User intent"
        sublabel={'"Cut my interview tight, add b-roll on the technical bits."'}
        accent={COLORS.accent}
        emphasize
      />

      <NodeBox
        from={T.planner}
        x={L.planner.x}
        y={L.planner.y}
        width={L.planner.w}
        height={L.planner.h}
        label="Planner agent"
        sublabel="decomposes the goal"
        accent={COLORS.cyan}
      />

      {[L.tool1, L.tool2, L.tool3].map((box, i) => (
        <NodeBox
          key={i}
          from={T.tools[i]}
          x={box.x}
          y={box.y}
          width={box.w}
          height={box.h}
          label={TOOLS[i].label}
          sublabel={TOOLS[i].sub}
          accent={COLORS.yellow}
        />
      ))}

      {/* Timeline node — custom inside */}
      <Sequence from={T.timeline} layout="none">
        <TimelineNode
          x={L.timeline.x}
          y={L.timeline.y}
          w={L.timeline.w}
          h={L.timeline.h}
          progress={timelineProgress}
        />
      </Sequence>

      {/* Arrows */}
      <Arrow from={T.arrow1} duration={20} d={intentToPlanner} color={COLORS.accent} />

      {[L.tool1, L.tool2, L.tool3].map((tool, i) => (
        <Arrow
          key={`p2t-${i}`}
          from={T.arrowsToTools + i * 6}
          duration={18}
          d={plannerToTool(tool)}
          color={COLORS.cyan}
          strokeWidth={3}
        />
      ))}

      {[L.tool1, L.tool2, L.tool3].map((tool, i) => (
        <Arrow
          key={`t2tl-${i}`}
          from={T.arrowsToTimeline + i * 6}
          duration={18}
          d={toolToTimeline(tool)}
          color={COLORS.yellow}
          strokeWidth={3}
        />
      ))}

      <Arrow
        from={T.feedback}
        duration={36}
        d={feedback}
        color={COLORS.accent}
        strokeWidth={4}
        dashed
      />

      {/* Feedback label */}
      <Sequence from={T.feedbackLabel} layout="none">
        <div
          style={{
            position: "absolute",
            left: 560,
            top: 970,
            width: 800,
            textAlign: "center",
            color: COLORS.accent,
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          <Reveal from={0} duration={20}>
            ↻ user steers · agents re-plan
          </Reveal>
        </div>
      </Sequence>

      {/* Closing caption */}
      <Sequence from={T.closing} layout="none">
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 90,
          }}
        >
          <Reveal from={0} duration={24}>
            <div
              style={{
                textAlign: "right",
                paddingRight: 100,
                color: COLORS.textMuted,
                fontSize: 26,
                fontWeight: 500,
              }}
            >
              every box is a research decision.
            </div>
          </Reveal>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};

// Timeline-node visual: three colored tracks with a playhead that grows.
const TimelineNode: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  progress: number;
}> = ({ x, y, w, h, progress }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(frame, [0, 18], [0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const trackPad = 22;
  const trackY = [120, 158, 196];
  const trackColors = [COLORS.accent, COLORS.cyan, COLORS.yellow];

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        background: `linear-gradient(180deg, ${COLORS.surfaceHi}, ${COLORS.surface})`,
        border: `2px solid ${COLORS.accent}`,
        borderRadius: 18,
        boxShadow: `0 0 0 6px ${COLORS.accent}22, 0 20px 40px rgba(0,0,0,0.35)`,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "center",
        fontFamily: FONT_FAMILY,
      }}
    >
      <div
        style={{
          color: COLORS.text,
          fontWeight: 700,
          fontSize: 28,
          letterSpacing: -0.3,
          textAlign: "center",
          paddingTop: 22,
        }}
      >
        Draft timeline
      </div>
      <div
        style={{
          color: COLORS.textMuted,
          fontSize: 17,
          textAlign: "center",
          marginTop: 4,
          fontWeight: 500,
        }}
      >
        editable, not final
      </div>

      {/* Tracks */}
      {trackY.map((ty, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: trackPad,
            top: ty,
            width: w - trackPad * 2,
            height: 22,
            background: COLORS.bg,
            borderRadius: 6,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress * (60 + i * 18)}%`,
              maxWidth: "100%",
              height: "100%",
              background: trackColors[i],
              opacity: 0.85,
            }}
          />
        </div>
      ))}
    </div>
  );
};
