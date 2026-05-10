import { theme } from "../theme";

type Pose = "stand" | "wave" | "wave-flipped" | "confused" | "walking-right";

type StickFigureProps = {
  x: number;
  y: number;
  scale?: number;
  pose?: Pose;
  // Override stroke color (e.g., for the off-brand "AI agent" stick figure
  // we tint to the accent so it reads as the antagonist of the bit).
  color?: string;
  // Optional thought-bubble label drawn above the head.
  thoughtBubble?: string;
  // Slight rotation for the deliberately-off-center, hand-drawn feel.
  rotate?: number;
};

// Deliberately-stiff stick figure. Drawn in absolute SVG coords inside its
// own <svg> so it can be positioned anywhere. No animated joints — the
// "stiffness" is the point. Pose is a finite set; movement happens at
// the scene level by translating the figure, not jointing it.
export const StickFigure: React.FC<StickFigureProps> = ({
  x,
  y,
  scale = 1,
  pose = "stand",
  color = theme.ink,
  thoughtBubble,
  rotate = 0,
}) => {
  // Base coordinate system: 200x320 box. Head at top.
  const stroke = 8;

  // Arm path depends on pose.
  let leftArm = "M 100 130 L 50 200";
  let rightArm = "M 100 130 L 150 200";
  if (pose === "wave") {
    // Right arm raised
    rightArm = "M 100 130 L 165 70";
  } else if (pose === "wave-flipped") {
    leftArm = "M 100 130 L 35 70";
  } else if (pose === "confused") {
    // Both arms slightly out, palms up
    leftArm = "M 100 130 L 40 110";
    rightArm = "M 100 130 L 160 110";
  } else if (pose === "walking-right") {
    leftArm = "M 100 130 L 60 170";
    rightArm = "M 100 130 L 140 190";
  }

  // Leg path — gives a slight stride for walking.
  let leftLeg = "M 100 230 L 70 310";
  let rightLeg = "M 100 230 L 130 310";
  if (pose === "walking-right") {
    leftLeg = "M 100 230 L 55 305";
    rightLeg = "M 100 230 L 145 295";
  }

  return (
    <svg
      width={200 * scale}
      height={320 * scale}
      viewBox="0 0 200 360"
      style={{
        position: "absolute",
        left: x - 100 * scale,
        top: y - 160 * scale,
        transform: `rotate(${rotate}deg)`,
        overflow: "visible",
      }}
    >
      {thoughtBubble && (
        <g>
          <ellipse
            cx={140}
            cy={-30}
            rx={70}
            ry={28}
            fill={theme.paper}
            stroke={color}
            strokeWidth={stroke - 2}
          />
          <circle
            cx={108}
            cy={4}
            r={6}
            fill={theme.paper}
            stroke={color}
            strokeWidth={stroke - 4}
          />
          <text
            x={140}
            y={-22}
            textAnchor="middle"
            fontFamily="Helvetica, Arial, sans-serif"
            fontWeight={700}
            fontSize={26}
            fill={color}
          >
            {thoughtBubble}
          </text>
        </g>
      )}
      {/* Head */}
      <circle
        cx={100}
        cy={70}
        r={50}
        fill={theme.paper}
        stroke={color}
        strokeWidth={stroke}
      />
      {/* Eyes — flat dashes (deadpan) */}
      <line
        x1={78}
        y1={68}
        x2={92}
        y2={68}
        stroke={color}
        strokeWidth={stroke - 2}
        strokeLinecap="round"
      />
      <line
        x1={108}
        y1={68}
        x2={122}
        y2={68}
        stroke={color}
        strokeWidth={stroke - 2}
        strokeLinecap="round"
      />
      {/* Mouth — a tiny flat line */}
      <line
        x1={88}
        y1={94}
        x2={112}
        y2={94}
        stroke={color}
        strokeWidth={stroke - 2}
        strokeLinecap="round"
      />
      {/* Body */}
      <line
        x1={100}
        y1={120}
        x2={100}
        y2={230}
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
      />
      {/* Arms */}
      <path
        d={leftArm}
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={rightArm}
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
      />
      {/* Legs */}
      <path
        d={leftLeg}
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={rightLeg}
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};
