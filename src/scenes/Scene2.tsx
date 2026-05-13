import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Stickman,
  STANDING_POSE,
  FIGHTING_STANCE,
} from "../components/Stickman";
import { Ground } from "../components/Ground";
import { Shot, Vignette } from "../components/Shot";
import { PALETTE } from "../constants/palette";

// Scene 2 — "조우" (frames 90-150 of master, 60 frames / 2s)
// Three sub-shots inside one scene to vary composition:
//   Shot A (0-22):  Wide — Stickman 2 slides in from the right.
//   Shot B (22-42): Mid close-up of Stickman 2 in fighting stance.
//   Shot C (42-60): Mid close-up of Stickman 1, mirrored stance.
export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const groundY = height / 2 + 220;
  const s1X = width * 0.32; // Stickman 1 — left
  const s2X = width * 0.68; // Stickman 2 — right

  // ───── Shot A: wide entry ─────
  if (frame < 22) {
    // Stickman 2 slides in from off-screen right over the first 14 frames,
    // then settles into the stance.
    const s2EnterX = interpolate(
      frame,
      [0, 14],
      [width + 220, s2X],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );

    // Tiny camera push-in across the shot
    const zoom = interpolate(frame, [0, 22], [1.0, 1.06], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    // Speed-streak intensity behind Stickman 2 while he's moving
    const streakOpacity = interpolate(frame, [0, 10, 14], [0.55, 0.3, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    return (
      <AbsoluteFill style={{ backgroundColor: PALETTE.background }}>
        <Shot
          zoom={zoom}
          focusX={width / 2}
          focusY={groundY - 200}
          viewWidth={width}
          viewHeight={height}
        >
          <Ground
            y={groundY}
            shadowX={s1X}
            shadowWidth={260}
          />
          {/* second shadow for the incoming enemy */}
          <Ground y={groundY} shadowX={s2EnterX} shadowWidth={260} />

          {/* Speed streak trailing Stickman 2 — dark on white */}
          <div
            style={{
              position: "absolute",
              left: s2EnterX,
              top: groundY - 240,
              width: width + 220 - s2EnterX + 100,
              height: 6,
              background:
                "linear-gradient(to right, transparent 0%, rgba(80,80,80,0.55) 60%, rgba(60,60,60,0.85) 100%)",
              opacity: streakOpacity,
              filter: "blur(2px)",
            }}
          />

          <Stickman
            x={s1X}
            y={groundY}
            scale={3.2}
            facing="right"
            pose={STANDING_POSE}
            color={PALETTE.hero}
            strokeWidth={7}
          />
          <Stickman
            x={s2EnterX}
            y={groundY}
            scale={3.2}
            facing="left"
            pose={STANDING_POSE}
            color={PALETTE.enemy}
            strokeWidth={7}
          />
        </Shot>

        <Vignette />
      </AbsoluteFill>
    );
  }

  // ───── Shot B: tight two-shot biased toward enemy ─────
  // Both characters stay at their world positions so the left/right
  // relationship from the wide shot is preserved. Camera biases right
  // and the enemy is rendered larger to read as "closer to camera".
  if (frame < 42) {
    const localFrame = frame - 22;
    const zoom = interpolate(localFrame, [0, 20], [1.4, 1.55], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    return (
      <AbsoluteFill style={{ backgroundColor: PALETTE.background }}>
        <Shot
          zoom={zoom}
          focusX={width * 0.575}
          focusY={groundY - 140}
          viewWidth={width}
          viewHeight={height}
          rotate={-2}
        >
          <Ground y={groundY} shadowX={s2X} shadowWidth={380} />
          <Ground y={groundY} shadowX={s1X} shadowWidth={240} />

          {/* Hero — background-ish on the left edge of frame */}
          <Stickman
            x={s1X}
            y={groundY}
            scale={3.0}
            facing="right"
            pose={FIGHTING_STANCE}
            color={PALETTE.hero}
            strokeWidth={7}
          />
          {/* Enemy — foreground, larger, on the right */}
          <Stickman
            x={s2X}
            y={groundY}
            scale={4.0}
            facing="left"
            pose={FIGHTING_STANCE}
            color={PALETTE.enemy}
            strokeWidth={8}
          />
        </Shot>

        <Vignette intensity={0.22} />
      </AbsoluteFill>
    );
  }

  // ───── Shot C: tight two-shot biased toward hero (mirror) ─────
  const localFrame = frame - 42;
  const zoom = interpolate(localFrame, [0, 18], [1.4, 1.55], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.background }}>
      <Shot
        zoom={zoom}
        focusX={width * 0.45}
        focusY={groundY - 140}
        viewWidth={width}
        viewHeight={height}
        rotate={2}
      >
        <Ground y={groundY} shadowX={s1X} shadowWidth={380} />
        <Ground y={groundY} shadowX={s2X} shadowWidth={240} />

        {/* Hero — foreground, larger, on the left */}
        <Stickman
          x={s1X}
          y={groundY}
          scale={4.0}
          facing="right"
          pose={FIGHTING_STANCE}
          color={PALETTE.hero}
          strokeWidth={8}
        />
        {/* Enemy — background-ish on the right edge of frame */}
        <Stickman
          x={s2X}
          y={groundY}
          scale={3.0}
          facing="left"
          pose={FIGHTING_STANCE}
          color={PALETTE.enemy}
          strokeWidth={7}
        />
      </Shot>

      <Vignette intensity={0.22} />
    </AbsoluteFill>
  );
};
