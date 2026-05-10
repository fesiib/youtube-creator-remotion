import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Background } from "../components/Background";
import { Caption } from "../components/Caption";
import { StickFigure } from "../components/StickFigure";
import { fontStack, theme } from "../theme";

type ConfusedTrioProps = {
  totalFrames: number;
};

// 0:18–0:27 — Three confused figures around a video timeline. None of them
// know what the video is "about." One of them is already thinking about a
// sandwich. This is the setup for the sandwich-exit beat that follows.
export const ConfusedTrio: React.FC<ConfusedTrioProps> = ({ totalFrames }) => {
  const frame = useCurrentFrame();

  // Labels appear in sequence: agent, you, collaborator.
  const labels = [
    { x: 220, y: 720, text: "the MODEL", appearAt: 0, color: theme.accent },
    { x: 540, y: 720, text: "YOU", appearAt: 36, color: theme.ink },
    {
      x: 860,
      y: 720,
      text: "your COLLAB",
      appearAt: 90,
      color: theme.ink,
    },
  ];

  // Thought bubbles: question marks for the first two, a sandwich for #3.
  return (
    <AbsoluteFill>
      <Background />

      {/* Timeline at the bottom-middle */}
      <svg
        width={1080}
        height={1920}
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", inset: 0 }}
      >
        <rect
          x={80}
          y={1280}
          width={920}
          height={120}
          fill={theme.paper}
          stroke={theme.ink}
          strokeWidth={6}
        />
        {/* Tick marks */}
        {Array.from({ length: 14 }).map((_, i) => (
          <line
            key={i}
            x1={80 + i * 66}
            y1={1280}
            x2={80 + i * 66}
            y2={1300}
            stroke={theme.ink}
            strokeWidth={4}
          />
        ))}
        {/* A few crude clips on the timeline */}
        <rect
          x={120}
          y={1310}
          width={160}
          height={60}
          fill={theme.accentInk}
          opacity={0.25}
          stroke={theme.ink}
          strokeWidth={4}
        />
        <rect
          x={320}
          y={1310}
          width={100}
          height={60}
          fill={theme.accentInk}
          opacity={0.25}
          stroke={theme.ink}
          strokeWidth={4}
        />
        <rect
          x={460}
          y={1310}
          width={220}
          height={60}
          fill={theme.accentInk}
          opacity={0.25}
          stroke={theme.ink}
          strokeWidth={4}
        />
        <rect
          x={720}
          y={1310}
          width={140}
          height={60}
          fill={theme.accentInk}
          opacity={0.25}
          stroke={theme.ink}
          strokeWidth={4}
        />
      </svg>

      {/* The three figures */}
      <StickFigure
        x={220}
        y={1000}
        scale={0.85}
        pose="confused"
        color={theme.accent}
        thoughtBubble="?"
      />
      <StickFigure
        x={540}
        y={1000}
        scale={0.85}
        pose="confused"
        thoughtBubble="??"
      />
      {/* The third one is already mentally elsewhere */}
      <SandwichThinker frame={frame} />

      {/* Role labels above each figure */}
      {labels.map((l) => {
        const appear = interpolate(
          frame,
          [l.appearAt, l.appearAt + 14],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          },
        );
        return (
          <div
            key={l.text}
            style={{
              position: "absolute",
              left: l.x,
              top: l.y,
              transform: `translate(-50%, -50%)`,
              opacity: appear,
              fontFamily: fontStack,
              fontWeight: 900,
              fontSize: 38,
              color: "#FFFFFF",
              backgroundColor: l.color,
              padding: "8px 16px",
              letterSpacing: -0.5,
              whiteSpace: "nowrap",
            }}
          >
            {l.text}
          </div>
        );
      })}

      <Caption
        totalFrames={totalFrames}
        lines={[
          ["The model doesn't know."],
          [{ text: "You", emphasize: true }, " don't always know."],
          [
            "And — hot take — neither does your ",
            { text: "collaborator", emphasize: true },
            ".",
          ],
        ]}
      />
    </AbsoluteFill>
  );
};

// Third figure with a sandwich thought bubble — drawn separately so we can
// inline a simple sandwich SVG instead of going through `thoughtBubble` text.
const SandwichThinker: React.FC<{ frame: number }> = ({ frame }) => {
  // Small bob to imply the daydream is ongoing.
  const bob = Math.sin(frame / 5) * 3;
  return (
    <>
      <StickFigure
        x={860}
        y={1000 + bob}
        scale={0.85}
        pose="stand"
      />
      {/* Sandwich thought bubble — bigger, drawn separately */}
      <svg
        width={260}
        height={200}
        viewBox="0 0 260 200"
        style={{
          position: "absolute",
          left: 770,
          top: 760 + bob,
          overflow: "visible",
        }}
      >
        <ellipse
          cx={130}
          cy={80}
          rx={120}
          ry={70}
          fill={theme.paper}
          stroke={theme.ink}
          strokeWidth={6}
        />
        <circle
          cx={70}
          cy={170}
          r={10}
          fill={theme.paper}
          stroke={theme.ink}
          strokeWidth={5}
        />
        <circle
          cx={60}
          cy={188}
          r={5}
          fill={theme.paper}
          stroke={theme.ink}
          strokeWidth={4}
        />
        {/* Sandwich glyph */}
        <g transform="translate(60 50)">
          {/* Top bun */}
          <path
            d="M 0 30 Q 70 -10 140 30 L 140 36 L 0 36 Z"
            fill="#E8B872"
            stroke={theme.ink}
            strokeWidth={5}
          />
          {/* Lettuce */}
          <path
            d="M 0 38 L 140 38 L 140 50 Q 70 65 0 50 Z"
            fill="#6FA84B"
            stroke={theme.ink}
            strokeWidth={5}
          />
          {/* Tomato */}
          <path
            d="M 4 52 L 136 52 L 136 64 L 4 64 Z"
            fill={theme.accent}
            stroke={theme.ink}
            strokeWidth={5}
          />
          {/* Bottom bun */}
          <path
            d="M 0 66 L 140 66 L 140 74 Q 70 90 0 74 Z"
            fill="#E8B872"
            stroke={theme.ink}
            strokeWidth={5}
          />
        </g>
      </svg>
    </>
  );
};
