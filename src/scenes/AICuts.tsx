import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { Background } from "../components/Background";
import { Caption } from "../components/Caption";
import { StickFigure } from "../components/StickFigure";
import { fontStack, theme } from "../theme";

type AICutsProps = {
  totalFrames: number;
};

// 0:03–0:10 — The ML framing of the problem, played straight long enough
// to feel reasonable, then a small label slides in revealing it was the
// wrong framing all along.
//
// Internal timeline (local frames, 210 total):
//   0–120  : agent slams CUT, footage flies, caption A
//   120–210: frame holds, "narrator (HCI)" label slides in, caption B
export const AICuts: React.FC<AICutsProps> = ({ totalFrames }) => {
  const frame = useCurrentFrame();

  // CUT button press: scale pulse on slam at ~frame 20, then settle.
  const slamProgress = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });
  const buttonScale = 1 - slamProgress * 0.12;
  // Button shadow lifts as button presses.
  const buttonY = slamProgress * 12;

  // Flying clips: 5 little rectangles fly outward after slam.
  const clips = Array.from({ length: 5 }).map((_, i) => {
    const start = 18 + i * 4;
    const flyProgress = interpolate(frame, [start, start + 60], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
    const angle = -120 + i * 60; // -120, -60, 0, 60, 120 degrees
    const distance = 480;
    const rad = (angle * Math.PI) / 180;
    const cx = 540 + Math.cos(rad) * distance * flyProgress;
    const cy = 900 + Math.sin(rad) * distance * flyProgress;
    const rot = (i % 2 === 0 ? 1 : -1) * 360 * flyProgress;
    const opacity = interpolate(frame, [start, start + 8], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return { cx, cy, rot, opacity, i };
  });

  return (
    <AbsoluteFill>
      <Background />

      {/* Confident-AI label, top */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 200,
          textAlign: "center",
          fontFamily: fontStack,
          fontWeight: 900,
          fontSize: 56,
          color: theme.ink,
          letterSpacing: -1,
        }}
      >
        the SOLUTION
        <span style={{ color: theme.accent }}>™</span>
      </div>

      {/* CUT button + slamming agent */}
      <svg
        width={1080}
        height={1920}
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", inset: 0, overflow: "visible" }}
      >
        {/* Button shadow */}
        <rect
          x={340}
          y={820}
          width={400}
          height={140}
          rx={12}
          fill={theme.accentInk}
        />
        {/* Button face */}
        <g transform={`translate(540 890) translate(0 ${buttonY}) scale(${buttonScale}) translate(-540 -890)`}>
          <rect
            x={340}
            y={810}
            width={400}
            height={140}
            rx={12}
            fill={theme.accent}
            stroke={theme.ink}
            strokeWidth={6}
          />
          <text
            x={540}
            y={902}
            textAnchor="middle"
            fontFamily={fontStack}
            fontWeight={900}
            fontSize={90}
            fill="#FFFFFF"
            letterSpacing={6}
          >
            CUT
          </text>
        </g>

        {/* Flying video clips */}
        {clips.map((c) => (
          <g
            key={c.i}
            transform={`translate(${c.cx} ${c.cy}) rotate(${c.rot})`}
            opacity={c.opacity}
          >
            <rect
              x={-50}
              y={-30}
              width={100}
              height={60}
              fill={theme.paper}
              stroke={theme.ink}
              strokeWidth={5}
            />
            {/* Sprocket dots — comically only on one side */}
            <circle cx={-38} cy={-18} r={3} fill={theme.ink} />
            <circle cx={-38} cy={0} r={3} fill={theme.ink} />
            <circle cx={-38} cy={18} r={3} fill={theme.ink} />
          </g>
        ))}
      </svg>

      {/* The "agent" stick figure on the left, slamming the button */}
      <StickFigure
        x={250}
        y={820}
        scale={1.1}
        pose="wave"
        color={theme.accent}
      />

      {/* Single piece of confetti drifting down — comedic restraint */}
      <ConfettiPiece />

      {/* Caption A: 0–120 */}
      <Sequence durationInFrames={120} layout="none">
        <Caption
          totalFrames={120}
          lines={[
            [
              "You give an ",
              { text: "AI", emphasize: true },
              " access to your editor.",
            ],
            [
              "It cuts your footage. ",
              { text: "Beautiful.", emphasize: true },
            ],
          ]}
        />
      </Sequence>

      {/* Narrator (HCI) label slides in at frame 120 */}
      <Sequence from={120} durationInFrames={totalFrames - 120} layout="none">
        <NarratorLabel />
      </Sequence>

      {/* Caption B: 120–end */}
      <Sequence from={120} durationInFrames={totalFrames - 120} layout="none">
        <Caption
          totalFrames={totalFrames - 120}
          lines={[
            [
              "…is what an ",
              { text: "ML person", emphasize: true },
              " thinks",
            ],
            ["the problem is."],
          ]}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

// The "narrator (HCI)" label — slides in from the left, sits, doesn't bounce.
const NarratorLabel: React.FC = () => {
  const frame = useCurrentFrame();
  const slideIn = interpolate(frame, [0, 25], [-600, 60], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div
      style={{
        position: "absolute",
        left: slideIn,
        top: 1280,
        backgroundColor: theme.ink,
        color: "#FFFFFF",
        fontFamily: fontStack,
        fontWeight: 700,
        fontSize: 36,
        padding: "10px 20px",
        transform: "rotate(-1.5deg)",
      }}
    >
      — narrator (<span style={{ color: theme.accent }}>HCI</span>)
    </div>
  );
};

// Single piece of confetti, drifting down. The "Beautiful." beat
// gets exactly one piece of celebration.
const ConfettiPiece: React.FC = () => {
  const frame = useCurrentFrame();
  const y = interpolate(frame, [20, 110], [-80, 700], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });
  const x = 740 + Math.sin(frame / 8) * 20;
  const rot = frame * 4;
  return (
    <svg
      style={{
        position: "absolute",
        left: x,
        top: 400,
        transform: `translateY(${y}px) rotate(${rot}deg)`,
        overflow: "visible",
      }}
      width={30}
      height={30}
    >
      <rect x={0} y={0} width={20} height={10} fill={theme.accent} />
    </svg>
  );
};
