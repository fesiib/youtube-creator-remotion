import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Stickman, SWORD_STANCE } from "../components/Stickman";
import { Ground } from "../components/Ground";
import { Shot, Vignette } from "../components/Shot";
import { PALETTE } from "../constants/palette";

const SWORD_LEN = 62;

// Scene 1 — 입장 (frames 0-60 of EP2, 60f / 2s)
// Hero stands alone at center. Two enemies slide in from off-screen, one from
// each side, both already in sword stance. Triangle formation locks in.
export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const groundY = height / 2 + 220;
  const heroX = width * 0.5;
  const enemyAEndX = width * 0.78;
  const enemyBEndX = width * 0.22;

  // Enemies slide in over the first 25 frames, then settle
  const enemyAX = interpolate(
    frame,
    [0, 25],
    [width + 220, enemyAEndX],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const enemyBX = interpolate(
    frame,
    [0, 25],
    [-220, enemyBEndX],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Slight push-in over the whole scene
  const zoom = interpolate(frame, [0, 60], [1.0, 1.08]);

  // Entry streaks behind the sliding enemies
  const streakOpacity = interpolate(
    frame,
    [0, 5, 22, 25],
    [0, 0.65, 0.45, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.background }}>
      <Shot
        zoom={zoom}
        focusX={heroX}
        focusY={groundY - 200}
        viewWidth={width}
        viewHeight={height}
      >
        <Ground y={groundY} shadowX={heroX} shadowWidth={300} />
        <Ground y={groundY} shadowX={enemyAX} shadowWidth={260} />
        <Ground y={groundY} shadowX={enemyBX} shadowWidth={260} />

        {/* Enemy A entry streak — comes from right edge */}
        <div
          style={{
            position: "absolute",
            left: enemyAX,
            top: groundY - 220,
            width: Math.max(0, width + 220 - enemyAX),
            height: 5,
            background:
              "linear-gradient(to right, transparent 0%, rgba(40,40,40,0.55) 50%, rgba(20,20,20,0.85) 100%)",
            opacity: streakOpacity,
            filter: "blur(2px)",
          }}
        />
        {/* Enemy B entry streak — comes from left edge */}
        <div
          style={{
            position: "absolute",
            left: -220,
            top: groundY - 220,
            width: Math.max(0, enemyBX + 220),
            height: 5,
            background:
              "linear-gradient(to left, transparent 0%, rgba(40,40,40,0.55) 50%, rgba(20,20,20,0.85) 100%)",
            opacity: streakOpacity,
            filter: "blur(2px)",
          }}
        />

        {/* Hero — facing right toward Enemy A */}
        <Stickman
          x={heroX}
          y={groundY}
          scale={3.2}
          facing="right"
          pose={SWORD_STANCE}
          color={PALETTE.hero}
          strokeWidth={8}
          weapon={{ length: SWORD_LEN, color: PALETTE.hero }}
        />

        {/* Enemy A — right side, facing left */}
        <Stickman
          x={enemyAX}
          y={groundY}
          scale={3.0}
          facing="left"
          pose={SWORD_STANCE}
          color={PALETTE.enemy}
          strokeWidth={7}
          weapon={{ length: SWORD_LEN, color: PALETTE.enemy }}
        />

        {/* Enemy B — left side, facing right */}
        <Stickman
          x={enemyBX}
          y={groundY}
          scale={3.0}
          facing="right"
          pose={SWORD_STANCE}
          color={PALETTE.enemy}
          strokeWidth={7}
          weapon={{ length: SWORD_LEN, color: PALETTE.enemy }}
        />
      </Shot>

      <Vignette intensity={0.2} />
    </AbsoluteFill>
  );
};
