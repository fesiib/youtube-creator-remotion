import { Easing, interpolate, useCurrentFrame } from "remotion";
import { fontStack, theme } from "../theme";

type Segment =
  | string
  | { text: string; emphasize?: boolean; strike?: boolean };

type CaptionProps = {
  // Local frame at which the caption finishes fading in.
  fadeInDuration?: number;
  // Frames before end at which the caption begins fading out.
  fadeOutDuration?: number;
  // Local total frames the caption is on screen (parent's <Sequence> durationInFrames).
  totalFrames: number;
  // Lines of text. Each line can mix plain strings with emphasized segments.
  lines: Segment[][];
  // Override y position (in 1920-tall coords). Defaults to lower third.
  bottom?: number;
  // Override font size in px.
  fontSize?: number;
};

// On-screen caption card — white text on translucent black,
// emphasis-only color highlights in the accent. Fade in / fade out.
// Per profile §9 caption convention even though we don't have a profile
// entry yet — this is the candidate default to validate.
export const Caption: React.FC<CaptionProps> = ({
  fadeInDuration = 8,
  fadeOutDuration = 8,
  totalFrames,
  lines,
  bottom = 220,
  fontSize = 64,
}) => {
  const frame = useCurrentFrame();

  const opacityIn = interpolate(frame, [0, fadeInDuration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const opacityOut = interpolate(
    frame,
    [totalFrames - fadeOutDuration, totalFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.in(Easing.cubic),
    },
  );
  const opacity = Math.min(opacityIn, opacityOut);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        padding: "0 80px",
        opacity,
      }}
    >
      {lines.map((segments, lineIdx) => (
        <div
          key={lineIdx}
          style={{
            backgroundColor: "rgba(20,20,20,0.92)",
            color: "#FFFFFF",
            fontFamily: fontStack,
            fontWeight: 700,
            fontSize,
            lineHeight: 1.15,
            letterSpacing: -0.5,
            padding: "14px 26px",
            borderRadius: 6,
            textAlign: "center",
            maxWidth: 920,
          }}
        >
          {segments.map((seg, segIdx) => {
            if (typeof seg === "string") return <span key={segIdx}>{seg}</span>;
            return (
              <span
                key={segIdx}
                style={{
                  color: seg.emphasize ? theme.accent : "#FFFFFF",
                  textDecoration: seg.strike ? "line-through" : "none",
                  textDecorationThickness: seg.strike ? 4 : undefined,
                }}
              >
                {seg.text}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
