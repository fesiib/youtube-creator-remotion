import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Background } from "../components/Background";
import { Caption } from "../components/Caption";
import { fontStack, theme } from "../theme";

type EditingDefProps = {
  totalFrames: number;
};

// 0:10–0:18 — Editing isn't where the CUTS happen. It's where you decide
// what the video is ABOUT. Visualized as a crude brain with thought bubbles
// labeling the actual concerns of a video editor.
export const EditingDef: React.FC<EditingDefProps> = ({ totalFrames }) => {
  const frame = useCurrentFrame();

  const bubbles: { text: string; x: number; y: number; appearAt: number; rot: number }[] = [
    { text: "vibe", x: 180, y: 720, appearAt: 18, rot: -6 },
    { text: "pacing", x: 760, y: 700, appearAt: 30, rot: 5 },
    { text: "the joke", x: 220, y: 1060, appearAt: 42, rot: -3 },
    { text: "is this even worth posting", x: 540, y: 1240, appearAt: 60, rot: 2 },
    { text: "what's the POINT", x: 760, y: 1080, appearAt: 90, rot: 4 },
  ];

  return (
    <AbsoluteFill>
      <Background />

      {/* Title: "editing =" big, top of frame */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 180,
          textAlign: "center",
          fontFamily: fontStack,
          fontWeight: 900,
          fontSize: 96,
          color: theme.ink,
          letterSpacing: -3,
        }}
      >
        editing ={" "}
        <span
          style={{
            textDecoration: "line-through",
            textDecorationThickness: 6,
            color: theme.inkSoft,
          }}
        >
          cuts
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 320,
          textAlign: "center",
          fontFamily: fontStack,
          fontWeight: 900,
          fontSize: 110,
          color: theme.accent,
          letterSpacing: -3,
        }}
      >
        DECIDING
      </div>

      {/* Brain — crude lumpy outline + a stripe down the middle */}
      <svg
        width={1080}
        height={1920}
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", inset: 0 }}
      >
        <g transform="translate(540 980)">
          <path
            d="M -140 -90 C -180 -130, -180 -10, -150 30 C -170 80, -100 130, -50 100 C 0 140, 80 130, 100 90 C 160 80, 180 -10, 140 -60 C 170 -120, 80 -150, 30 -120 C -20 -150, -110 -140, -140 -90 Z"
            fill={theme.paperShade}
            stroke={theme.ink}
            strokeWidth={7}
          />
          {/* Mid stripe */}
          <line
            x1={-2}
            y1={-130}
            x2={-12}
            y2={120}
            stroke={theme.ink}
            strokeWidth={6}
          />
          {/* Random lobes */}
          <path
            d="M -100 -40 Q -70 -60 -50 -30"
            stroke={theme.ink}
            strokeWidth={5}
            fill="none"
          />
          <path
            d="M 40 -30 Q 70 -60 100 -20"
            stroke={theme.ink}
            strokeWidth={5}
            fill="none"
          />
          <path
            d="M -60 50 Q -30 70 0 40"
            stroke={theme.ink}
            strokeWidth={5}
            fill="none"
          />
        </g>

        {/* Thought-bubble lines pointing to the brain */}
        {bubbles.map((b) => {
          const appear = interpolate(
            frame,
            [b.appearAt, b.appearAt + 14],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            },
          );
          if (appear === 0) return null;
          return (
            <g key={b.text} opacity={appear}>
              <line
                x1={b.x}
                y1={b.y}
                x2={540}
                y2={980}
                stroke={theme.ink}
                strokeWidth={3}
                strokeDasharray="6 6"
              />
            </g>
          );
        })}
      </svg>

      {/* Thought bubbles as HTML for cleaner text */}
      {bubbles.map((b) => {
        const appear = interpolate(
          frame,
          [b.appearAt, b.appearAt + 14],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          },
        );
        const scale = interpolate(appear, [0, 1], [0.7, 1]);
        return (
          <div
            key={b.text}
            style={{
              position: "absolute",
              left: b.x,
              top: b.y,
              transform: `translate(-50%, -50%) rotate(${b.rot}deg) scale(${scale})`,
              opacity: appear,
              fontFamily: fontStack,
              fontWeight: 700,
              fontSize: 38,
              color: theme.ink,
              backgroundColor: theme.paper,
              border: `5px solid ${theme.ink}`,
              borderRadius: 60,
              padding: "10px 22px",
              whiteSpace: "nowrap",
            }}
          >
            "{b.text}"
          </div>
        );
      })}

      <Caption
        totalFrames={totalFrames}
        lines={[
          [
            "Editing isn't where the ",
            { text: "cuts", strike: true },
            " happen.",
          ],
          [
            "It's where you decide what the video",
          ],
          ["is ", { text: "ABOUT", emphasize: true }, "."],
        ]}
        bottom={120}
      />
    </AbsoluteFill>
  );
};
