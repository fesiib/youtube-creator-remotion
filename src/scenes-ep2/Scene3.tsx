import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Stickman,
  KNEEL_DEFEATED,
  RISING_DETERMINED,
  SWORD_STANCE,
  interpolatePose,
} from "../components/Stickman";
import { Ground } from "../components/Ground";
import { Shot, Vignette } from "../components/Shot";
import { PALETTE } from "../constants/palette";

const SWORD_LEN = 62;

// Scene 3 — 무릎 + 각성 (frames 180-330 of EP2, 150f / 5s)
//
// Sub A (0-50):  Hero collapses to a kneel, sword stuck in the ground in
//                 front of him as support. Both enemies stand over him.
// Sub B (50-110): Slow-mo close-up on hero — head slowly rises. Red
//                  gradient pulses, "끝나지 않았다" subtitle fades in.
// Sub C (110-150): Hero stands back up, sword raised. Red aura intensifies.
export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const groundY = height / 2 + 220;
  const heroX = width * 0.5;
  const enemyAX = width * 0.78;
  const enemyBX = width * 0.32;

  // ─────────── Sub A: Hero falls to a kneel ───────────
  if (frame < 50) {
    const t = frame / 50;
    const zoom = interpolate(t, [0, 1], [1.0, 1.2]);

    // Hero transitions from slumped stance → kneel
    const heroSlumpStart = {
      ...SWORD_STANCE,
      torsoLean: 32,
    };
    const heroPose = interpolatePose(t, heroSlumpStart, KNEEL_DEFEATED);

    return (
      <AbsoluteFill style={{ backgroundColor: PALETTE.background }}>
        <Shot
          zoom={zoom}
          focusX={heroX}
          focusY={groundY - 200}
          viewWidth={width}
          viewHeight={height}
          rotate={0}
        >
          <Ground y={groundY} shadowX={heroX} shadowWidth={340} />
          <Ground y={groundY} shadowX={enemyAX} shadowWidth={240} />
          <Ground y={groundY} shadowX={enemyBX} shadowWidth={240} />

          {/* Enemy A — standing over hero from the right */}
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
          {/* Enemy B — standing over hero from the left */}
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
          {/* Hero — collapsing onto his sword */}
          <Stickman
            x={heroX}
            y={groundY}
            scale={3.2}
            facing="right"
            pose={heroPose}
            color={PALETTE.hero}
            strokeWidth={8}
            weapon={{ length: SWORD_LEN, color: PALETTE.hero }}
          />
        </Shot>

        <Vignette intensity={0.25} />
      </AbsoluteFill>
    );
  }

  // ─────────── Sub B: Slow-mo close-up on hero ───────────
  if (frame < 110) {
    const t = (frame - 50) / 60;
    const zoom = interpolate(t, [0, 1], [1.7, 1.9]);

    // Red gradient pulse — heartbeat
    const pulse = Math.sin(frame * 0.18) * 0.5 + 0.5;
    const redIntensity = 0.12 + pulse * 0.10;

    // Hero pose stays in kneel; head subtly tilts up over time
    const headTiltT = interpolate(t, [0.3, 1], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const heroPose = {
      ...KNEEL_DEFEATED,
      // Reduce torso lean → head rises
      torsoLean: KNEEL_DEFEATED.torsoLean - headTiltT * 30,
    };

    // Subtitle fades in late
    const textOpacity = interpolate(frame, [70, 85, 105, 110], [0, 1, 1, 0.5], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    return (
      <AbsoluteFill style={{ backgroundColor: PALETTE.background }}>
        {/* Pulsing red gradient overlay */}
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse 90% 70% at ${heroX}px ${groundY - 180}px, rgba(226,48,48,${redIntensity * 1.5}) 0%, rgba(226,48,48,${redIntensity * 0.7}) 35%, transparent 75%)`,
            pointerEvents: "none",
          }}
        />

        <Shot
          zoom={zoom}
          focusX={heroX}
          focusY={groundY - 160}
          viewWidth={width}
          viewHeight={height}
          rotate={0}
        >
          <Ground y={groundY} shadowX={heroX} shadowWidth={340} />

          <Stickman
            x={heroX}
            y={groundY}
            scale={3.2}
            facing="right"
            pose={heroPose}
            color={PALETTE.hero}
            strokeWidth={8}
            weapon={{ length: SWORD_LEN, color: PALETTE.hero }}
          />
        </Shot>

        {/* "끝나지 않았다." subtitle */}
        <div
          style={{
            position: "absolute",
            bottom: 240,
            width: "100%",
            textAlign: "center",
            color: "#1a1a1a",
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Pretendard', 'Noto Sans KR', sans-serif",
            fontSize: 68,
            fontWeight: 700,
            letterSpacing: "0.1em",
            opacity: textOpacity,
            zIndex: 5,
            textShadow: "0 2px 12px rgba(255,255,255,0.8)",
          }}
        >
          끝나지 않았다.
        </div>

        <Vignette intensity={0.3} />
      </AbsoluteFill>
    );
  }

  // ─────────── Sub C: Hero rises with determination ───────────
  const t = (frame - 110) / 40;
  const zoom = interpolate(t, [0, 1], [1.4, 1.25]);

  // Hero pose: KNEEL_DEFEATED → RISING_DETERMINED
  const heroPose = interpolatePose(t, KNEEL_DEFEATED, RISING_DETERMINED);

  // Strong red gradient aura (intensifies as he rises)
  const auraIntensity = interpolate(t, [0, 1], [0.18, 0.32]);
  // Quick pulse
  const pulse = Math.sin(frame * 0.3) * 0.5 + 0.5;
  const finalRed = auraIntensity * (0.8 + pulse * 0.4);

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.background }}>
      {/* Aura — radial red from hero, more concentrated */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 60% at ${heroX}px ${groundY - 220}px, rgba(226,48,48,${finalRed * 1.8}) 0%, rgba(226,48,48,${finalRed * 0.8}) 30%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      <Shot
        zoom={zoom}
        focusX={heroX}
        focusY={groundY - 200}
        viewWidth={width}
        viewHeight={height}
        rotate={0}
      >
        <Ground y={groundY} shadowX={heroX} shadowWidth={300} />
        <Ground y={groundY} shadowX={enemyAX} shadowWidth={240} />
        <Ground y={groundY} shadowX={enemyBX} shadowWidth={240} />

        {/* Enemies — still flanking */}
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
        <Stickman
          x={heroX}
          y={groundY}
          scale={3.2}
          facing="right"
          pose={heroPose}
          color={PALETTE.hero}
          strokeWidth={8}
          weapon={{ length: SWORD_LEN, color: PALETTE.hero }}
        />
      </Shot>

      <Vignette intensity={0.25} />
    </AbsoluteFill>
  );
};
