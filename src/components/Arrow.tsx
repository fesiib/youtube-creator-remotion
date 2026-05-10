import { Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";

type ArrowProps = {
  from: number;
  duration?: number;
  d: string; // SVG path
  color?: string;
  strokeWidth?: number;
  pathLength?: number; // approximate; we draw with stroke-dasharray
  dashed?: boolean;
  arrowHead?: boolean;
};

// Animated SVG path that "draws" in. Pass an approximate `pathLength`
// (any large number works; we mask via dash arithmetic).
export const Arrow: React.FC<ArrowProps> = ({
  from,
  duration = 24,
  d,
  color = COLORS.accent,
  strokeWidth = 4,
  pathLength = 1000,
  dashed,
  arrowHead = true,
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [from, from + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });

  const headOpacity = interpolate(frame, [from + duration - 6, from + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const markerId = `arrow-${color.replace("#", "")}`;

  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      {arrowHead ? (
        <defs>
          <marker
            id={markerId}
            viewBox="0 0 12 12"
            refX="10"
            refY="6"
            markerWidth="8"
            markerHeight="8"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 12 6 L 0 12 z" fill={color} opacity={headOpacity} />
          </marker>
        </defs>
      ) : null}
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={dashed ? "10 12" : `${pathLength}`}
        strokeDashoffset={dashed ? 0 : pathLength * (1 - t)}
        opacity={dashed ? interpolate(frame, [from, from + duration], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }) : 1}
        markerEnd={arrowHead ? `url(#${markerId})` : undefined}
      />
    </svg>
  );
};
