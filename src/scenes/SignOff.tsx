import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Background } from "../components/Background";
import { Caption } from "../components/Caption";
import { StickFigure } from "../components/StickFigure";
import { fontStack, theme } from "../theme";

type SignOffProps = {
  totalFrames: number;
};

// 0:43–0:50 — Stick figure waves once, mid-wave, cuts to black. Last frames
// hold a black card with a tiny end-of-bit punchline.
export const SignOff: React.FC<SignOffProps> = ({ totalFrames }) => {
  const frame = useCurrentFrame();

  // Blackout occurs ~62% of the way through the scene so the figure has
  // time to wave, then ~38% of remaining frames hold the end card.
  const blackoutStart = Math.floor(totalFrames * 0.62);

  // Wave: small rotation oscillation until ~halfway, then the figure freezes
  // (the silence before the cut is doing work).
  const waveActive = frame < blackoutStart - 50;
  const waveAmp = waveActive ? Math.sin(frame / 4) * 6 : 0;
  const blackoutOpacity = interpolate(
    frame,
    [blackoutStart - 1, blackoutStart],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // The final card text appears two beats after blackout.
  const finalTextOpacity = interpolate(
    frame,
    [blackoutStart + 20, blackoutStart + 35],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill>
      <Background />

      <StickFigure
        x={540}
        y={1000}
        scale={1.4}
        pose="wave"
        rotate={waveAmp}
      />

      {/* Caption — only on screen while the figure waves */}
      {frame < blackoutStart && (
        <Caption
          totalFrames={blackoutStart}
          lines={[
            ["Anyway."],
            [
              "That's what I'm spending",
            ],
            [
              "my ",
              { text: "twenties", emphasize: true },
              " on.",
            ],
          ]}
        />
      )}

      {/* Hard cut to black */}
      <AbsoluteFill
        style={{
          backgroundColor: theme.ink,
          opacity: blackoutOpacity,
          pointerEvents: "none",
        }}
      />

      {/* End card */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          opacity: finalTextOpacity,
          fontFamily: fontStack,
          color: "#FFFFFF",
          textAlign: "center",
          padding: "0 80px",
        }}
      >
        <div style={{ fontWeight: 900, fontSize: 110, letterSpacing: -3 }}>
          PhDing in
        </div>
        <div
          style={{
            fontWeight: 900,
            fontSize: 220,
            letterSpacing: -8,
            color: theme.accent,
            marginTop: -20,
          }}
        >
          HCI
        </div>
        <div
          style={{
            fontWeight: 600,
            fontSize: 36,
            opacity: 0.7,
            marginTop: 40,
            letterSpacing: 1,
          }}
        >
          subscribe, or don't — whatever
        </div>
      </div>
    </AbsoluteFill>
  );
};
