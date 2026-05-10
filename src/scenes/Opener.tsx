import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Background } from "../components/Background";
import { Caption } from "../components/Caption";
import { StickFigure } from "../components/StickFigure";
import { fontStack, theme } from "../theme";

type OpenerProps = {
  totalFrames: number;
};

// 0:00–0:03 — The signature opener. Stick figure waves, deadpan.
// Lab/office is sketched as a desk + monitor + window behind the figure
// so it doesn't read as floating-in-paper.
export const Opener: React.FC<OpenerProps> = ({ totalFrames }) => {
  const frame = useCurrentFrame();

  // Wave: the right arm in StickFigure is already "up" in `wave` pose.
  // We get the wobble by lightly tilting the whole figure 0.5° each cycle.
  const wobble = Math.sin(frame / 4) * 1.5;

  // Cursor blink on the monitor — pure character toggle, not opacity.
  const cursorOn = Math.floor(frame / 15) % 2 === 0;

  // Subtle slide-up on the office set so the scene "lands" rather than pops.
  const setY = interpolate(frame, [0, 18], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill>
      <Background />

      {/* Office set: desk + monitor + window — all crude on purpose. */}
      <svg
        width={1080}
        height={1920}
        viewBox="0 0 1080 1920"
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${setY}px)`,
        }}
      >
        {/* Window (top-left), crooked frame */}
        <g transform="translate(120 200) rotate(-1.5)">
          <rect
            x={0}
            y={0}
            width={300}
            height={220}
            fill={theme.paper}
            stroke={theme.ink}
            strokeWidth={6}
          />
          <line
            x1={150}
            y1={0}
            x2={150}
            y2={220}
            stroke={theme.ink}
            strokeWidth={4}
          />
          <line
            x1={0}
            y1={110}
            x2={300}
            y2={110}
            stroke={theme.ink}
            strokeWidth={4}
          />
          {/* Tiny cloud */}
          <ellipse cx={75} cy={55} rx={26} ry={12} fill={theme.paperShade} />
          <ellipse cx={95} cy={48} rx={20} ry={11} fill={theme.paperShade} />
        </g>

        {/* Monitor on desk */}
        <g transform="translate(620 720)">
          <rect
            x={0}
            y={0}
            width={340}
            height={220}
            fill={theme.paper}
            stroke={theme.ink}
            strokeWidth={6}
          />
          {/* Stand */}
          <rect
            x={140}
            y={220}
            width={60}
            height={30}
            fill={theme.paper}
            stroke={theme.ink}
            strokeWidth={6}
          />
          <rect
            x={90}
            y={250}
            width={160}
            height={12}
            fill={theme.paper}
            stroke={theme.ink}
            strokeWidth={6}
          />
          {/* Terminal text */}
          <text
            x={22}
            y={50}
            fontFamily="Courier, monospace"
            fontWeight={700}
            fontSize={26}
            fill={theme.ink}
          >
            ~$ phd --year 1
          </text>
          <text
            x={22}
            y={86}
            fontFamily="Courier, monospace"
            fontWeight={700}
            fontSize={26}
            fill={theme.ink}
          >
            running...{cursorOn ? "_" : " "}
          </text>
        </g>

        {/* Desk surface */}
        <line
          x1={0}
          y1={1000}
          x2={1080}
          y2={1000}
          stroke={theme.ink}
          strokeWidth={8}
        />
      </svg>

      {/* The figure */}
      <StickFigure
        x={420}
        y={900}
        scale={1.2}
        pose="wave"
        rotate={wobble}
      />

      {/* Subtle name tag floating near the figure */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 1100,
          fontFamily: fontStack,
          fontWeight: 900,
          fontSize: 38,
          color: theme.ink,
          transform: "rotate(-3deg)",
          backgroundColor: theme.paperShade,
          padding: "8px 16px",
          border: `4px solid ${theme.ink}`,
        }}
      >
        HELLO, my name is BEKZAT
      </div>

      <Caption
        totalFrames={totalFrames}
        lines={[
          [
            "Hi, folks! This is ",
            { text: "Bekzat", emphasize: true },
            ", ",
          ],
          [
            { text: "PhDing", emphasize: true },
            " in ",
            { text: "HCI", emphasize: true },
            ".",
          ],
        ]}
      />
    </AbsoluteFill>
  );
};
