import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Background } from "../components/Background";
import { Caption } from "../components/Caption";
import { StickFigure } from "../components/StickFigure";
import { fontStack, theme } from "../theme";

type SandwichExitProps = {
  totalFrames: number;
};

// 0:27–0:36 — One of the figures gives up and physically walks out of frame.
// A comic-book SLAM appears as a visual stand-in for the door slam (silent
// version of the bit). The other two figures look on, deadpan.
export const SandwichExit: React.FC<SandwichExitProps> = ({ totalFrames }) => {
  const frame = useCurrentFrame();

  // The sandwich-thinker translates rightward and off-frame between f30-f140.
  const walkX = interpolate(frame, [30, 150], [860, 1400], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.6, 0, 0.7, 1),
  });
  // Tiny vertical bob to make the walk read as a walk and not a slide.
  const walkBob = Math.sin(frame / 3) * 4;

  // SLAM text appears at frame ~155 (after the figure is gone), holds.
  const slamScale = interpolate(frame, [155, 175], [0.2, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });
  const slamOpacity = interpolate(frame, [155, 168], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // SLAM tilts slightly.
  const slamRot = -8;

  // The remaining two figures shake their heads — implemented as tiny rotation oscillation.
  const headShake = Math.sin(frame / 6) * 2;

  return (
    <AbsoluteFill>
      <Background />

      {/* Existing timeline + remaining figures (mirroring previous scene) */}
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

      {/* The two remaining figures, lightly shaking heads */}
      <StickFigure
        x={220}
        y={1000}
        scale={0.85}
        pose="confused"
        color={theme.accent}
        rotate={headShake}
      />
      <StickFigure
        x={540}
        y={1000}
        scale={0.85}
        pose="confused"
        rotate={-headShake}
      />

      {/* The exiting figure */}
      <StickFigure
        x={walkX}
        y={1000 + walkBob}
        scale={0.85}
        pose="walking-right"
      />

      {/* Door on the right edge */}
      <svg
        width={120}
        height={300}
        viewBox="0 0 120 300"
        style={{ position: "absolute", left: 980, top: 870 }}
      >
        <rect
          x={0}
          y={0}
          width={120}
          height={280}
          fill={theme.paperShade}
          stroke={theme.ink}
          strokeWidth={6}
        />
        {/* Knob */}
        <circle cx={20} cy={150} r={8} fill={theme.ink} />
      </svg>

      {/* SLAM text */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 720,
          textAlign: "center",
          fontFamily: fontStack,
          fontWeight: 900,
          fontSize: 240,
          color: theme.accent,
          letterSpacing: -8,
          opacity: slamOpacity,
          transform: `scale(${slamScale}) rotate(${slamRot}deg)`,
          WebkitTextStroke: `8px ${theme.ink}`,
        }}
      >
        SLAM
      </div>

      <Caption
        totalFrames={totalFrames}
        lines={[
          ["So the real question is:"],
          [
            "how do you ",
            { text: "figure it out together", emphasize: true },
            " —",
          ],
          ["without anyone leaving"],
          [
            "to make a ",
            { text: "sandwich", emphasize: true },
            ".",
          ],
        ]}
      />
    </AbsoluteFill>
  );
};
