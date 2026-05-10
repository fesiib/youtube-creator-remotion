import { Easing, interpolate, useCurrentFrame } from "remotion";

type RevealProps = {
  from?: number;
  duration?: number;
  translateY?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

// Fade + small upward translate. The default building block for any
// text/box that should "appear" rather than just exist.
export const Reveal: React.FC<RevealProps> = ({
  from = 0,
  duration = 24,
  translateY = 24,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [from, from + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div
      style={{
        opacity: t,
        transform: `translateY(${(1 - t) * translateY}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
