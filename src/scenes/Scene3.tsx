import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Stickman,
  FIGHTING_STANCE,
  WIND_UP_POSE,
  CHARGE_POSE,
  PUNCH_EXTENDED_POSE,
  RECOIL_POSE,
  interpolatePose,
} from "../components/Stickman";
import { Ground } from "../components/Ground";
import { Shot, Vignette } from "../components/Shot";
import { PALETTE } from "../constants/palette";

// Scene 3 — "첫 공격" (frames 150-210 of master, 60 frames / 2s)
//
// Sub-shot A (0-12):  Wind-up close on the hero (slight back lean, rear arm cocked).
// Sub-shot B (12-26): Medium wide — hero dashes left→right with speed streaks.
// Sub-shot C (26-60): Tight on the impact — white flash, red burst, "퍽!" text,
//                      camera shake, enemy recoiling back.
export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const groundY = height / 2 + 220;
  const s1X_start = width * 0.32;
  const s2X = width * 0.68;

  // Hero's x position across the whole scene
  // 0-12: stays back (windup), 12-26: dashes forward, 26-60: holds at the impact point
  const heroX = interpolate(
    frame,
    [0, 12, 26, 60],
    [s1X_start, s1X_start - 24, s2X - 200, s2X - 200],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Enemy x position — static until impact, then stumbles back over the recoil
  const enemyX = interpolate(
    frame,
    [0, 26, 60],
    [s2X, s2X, s2X + 90],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Camera shake — only fires at impact, decays quickly
  const shakeAmp = interpolate(frame, [26, 28, 44], [0, 36, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shakeX = Math.sin(frame * 31.7) * shakeAmp;
  const shakeY = Math.cos(frame * 23.3) * shakeAmp;

  // ─────────── Sub-shot A: Wind-up close ───────────
  if (frame < 12) {
    const t = frame / 12;
    // Slight push-in during the windup beat
    const zoom = interpolate(t, [0, 1], [1.6, 1.75]);

    // Hero pose: ease from FIGHTING_STANCE into WIND_UP_POSE
    const heroPose = interpolatePose(t, FIGHTING_STANCE, WIND_UP_POSE);

    return (
      <AbsoluteFill style={{ backgroundColor: PALETTE.background }}>
        <Shot
          zoom={zoom}
          focusX={s1X_start + 40}
          focusY={groundY - 160}
          viewWidth={width}
          viewHeight={height}
          rotate={-3}
        >
          <Ground y={groundY} shadowX={heroX} shadowWidth={320} />
          <Ground y={groundY} shadowX={s2X} shadowWidth={240} />

          <Stickman
            x={heroX}
            y={groundY}
            scale={3.6}
            facing="right"
            pose={heroPose}
            color={PALETTE.hero}
            strokeWidth={8}
          />
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
  }

  // ─────────── Sub-shot B: Charge (medium-wide) ───────────
  if (frame < 26) {
    const localT = (frame - 12) / 14;
    const zoom = interpolate(localT, [0, 1], [1.15, 1.35]);
    // Camera pans slightly with the hero
    const focusX = interpolate(localT, [0, 1], [width * 0.42, width * 0.55]);

    // Hero pose: WIND_UP → CHARGE through the dash
    const heroPose = interpolatePose(localT, WIND_UP_POSE, CHARGE_POSE);

    // Trailing streak follows the hero
    const streakOpacity = interpolate(
      localT,
      [0, 0.2, 0.8, 1],
      [0, 0.7, 0.7, 0],
    );
    const streakStart = s1X_start - 24;
    const streakLength = heroX - streakStart + 60;

    return (
      <AbsoluteFill style={{ backgroundColor: PALETTE.background }}>
        <Shot
          zoom={zoom}
          focusX={focusX}
          focusY={groundY - 130}
          viewWidth={width}
          viewHeight={height}
        >
          <Ground y={groundY} shadowX={heroX} shadowWidth={300} />
          <Ground y={groundY} shadowX={s2X} shadowWidth={260} />

          {/* Multiple streaks trailing the hero for motion blur feel */}
          <div
            style={{
              position: "absolute",
              left: streakStart,
              top: groundY - 180,
              width: streakLength,
              height: 5,
              background:
                "linear-gradient(to right, transparent 0%, rgba(40,40,40,0.55) 40%, rgba(20,20,20,0.85) 100%)",
              opacity: streakOpacity,
              filter: "blur(2px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: streakStart,
              top: groundY - 260,
              width: streakLength * 0.8,
              height: 3,
              background:
                "linear-gradient(to right, transparent 0%, rgba(40,40,40,0.45) 50%, rgba(20,20,20,0.7) 100%)",
              opacity: streakOpacity * 0.85,
              filter: "blur(1.5px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: streakStart,
              top: groundY - 100,
              width: streakLength * 0.9,
              height: 4,
              background:
                "linear-gradient(to right, transparent 0%, rgba(40,40,40,0.5) 50%, rgba(20,20,20,0.75) 100%)",
              opacity: streakOpacity * 0.9,
              filter: "blur(2px)",
            }}
          />

          <Stickman
            x={heroX}
            y={groundY}
            scale={3.2}
            facing="right"
            pose={heroPose}
            color={PALETTE.hero}
            strokeWidth={8}
          />
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
        <Vignette intensity={0.2} />
      </AbsoluteFill>
    );
  }

  // ─────────── Sub-shot C: Impact + aftermath ───────────
  // Tight zoom at impact, then slowly pulls back
  const zoom = interpolate(
    frame,
    [26, 30, 60],
    [1.7, 1.9, 1.55],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  // Camera quick-tilts at impact then settles
  const tilt = interpolate(
    frame,
    [26, 28, 38],
    [0, 5, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Approximate impact point (where the hero's lead fist meets the enemy).
  // The Stickman SVG's center is roughly 30 body-units right of the pelvis
  // when in PUNCH_EXTENDED_POSE; at scale 3.2 the fist sits ~125px right of
  // the user-provided x. Combined with the hero at s2X-200, this lands close
  // to the enemy's body around s2X-75.
  const impactWorldX = heroX + 125;
  const impactWorldY = groundY - 290;

  // Enemy pose interpolates from stance to recoil over the first ~8 frames
  const recoilT = interpolate(frame, [26, 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const enemyPose = interpolatePose(recoilT, FIGHTING_STANCE, RECOIL_POSE);

  // White flash: peaks at impact, fades in 4 frames
  const flashOpacity = interpolate(frame, [26, 27, 30], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Red burst — expanding circle that fades
  const burstRadius = interpolate(frame, [26, 40], [40, 360], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const burstOpacity = interpolate(
    frame,
    [26, 28, 40],
    [0.9, 0.95, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Sharp red impact lines radiating out
  const impactLinesOpacity = interpolate(
    frame,
    [26, 28, 36],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const impactLinesScale = interpolate(frame, [26, 36], [0.5, 1.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "퍽!" text: pops in big, settles, then fades
  const punchScale = interpolate(frame, [26, 30, 50], [0.4, 1.15, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const punchOpacity = interpolate(frame, [26, 28, 48, 56], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.background }}>
      {/* The whole scene shakes on impact */}
      <AbsoluteFill
        style={{ transform: `translate(${shakeX}px, ${shakeY}px)` }}
      >
        <Shot
          zoom={zoom}
          focusX={impactWorldX - 20}
          focusY={groundY - 200}
          viewWidth={width}
          viewHeight={height}
          rotate={tilt}
        >
          <Ground y={groundY} shadowX={heroX} shadowWidth={300} />
          <Ground y={groundY} shadowX={enemyX} shadowWidth={300} />

          <Stickman
            x={heroX}
            y={groundY}
            scale={3.2}
            facing="right"
            pose={PUNCH_EXTENDED_POSE}
            color={PALETTE.hero}
            strokeWidth={8}
          />
          <Stickman
            x={enemyX}
            y={groundY}
            scale={3.0}
            facing="left"
            pose={enemyPose}
            color={PALETTE.enemy}
            strokeWidth={7}
          />

          {/* Red expanding burst at the impact point */}
          <div
            style={{
              position: "absolute",
              left: impactWorldX,
              top: impactWorldY,
              width: burstRadius * 2,
              height: burstRadius * 2,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${PALETTE.accentRed} 0%, rgba(226,48,48,0.7) 30%, transparent 70%)`,
              transform: "translate(-50%, -50%)",
              opacity: burstOpacity,
              mixBlendMode: "multiply",
            }}
          />

          {/* Sharp impact lines (8-point starburst) */}
          <div
            style={{
              position: "absolute",
              left: impactWorldX,
              top: impactWorldY,
              width: 4,
              height: 4,
              transform: `translate(-50%, -50%) scale(${impactLinesScale})`,
              opacity: impactLinesOpacity,
            }}
          >
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: 280,
                  height: 8,
                  background: PALETTE.accentRed,
                  transformOrigin: "0 50%",
                  transform: `rotate(${deg}deg)`,
                  borderRadius: 4,
                }}
              />
            ))}
          </div>
        </Shot>

        {/* "퍽!" — onomatopoeia text, screen-space so it pops regardless of camera */}
        <div
          style={{
            position: "absolute",
            left: width / 2,
            top: groundY - 480,
            transform: `translate(-50%, -50%) scale(${punchScale}) rotate(-6deg)`,
            opacity: punchOpacity,
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Pretendard', 'Black Han Sans', 'Noto Sans KR', sans-serif",
            fontSize: 220,
            fontWeight: 900,
            color: PALETTE.accentRed,
            WebkitTextStroke: "6px #0a0a0a",
            letterSpacing: "0.02em",
            zIndex: 5,
            textShadow: "8px 8px 0 rgba(10,10,10,0.18)",
          }}
        >
          퍽!
        </div>
      </AbsoluteFill>

      {/* White flash — full screen, sits ABOVE everything for the impact pulse */}
      <AbsoluteFill
        style={{
          backgroundColor: "#ffffff",
          opacity: flashOpacity,
          pointerEvents: "none",
          zIndex: 10,
        }}
      />

      <Vignette intensity={0.18} />
    </AbsoluteFill>
  );
};
