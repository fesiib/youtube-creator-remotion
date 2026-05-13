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
  FRONT_KICK_POSE,
  BLOCK_POSE,
  PUNCH_EXTENDED_POSE,
  DODGE_BACK_POSE,
  RECOIL_POSE,
  interpolatePose,
} from "../components/Stickman";
import { Ground } from "../components/Ground";
import { Shot, Vignette } from "../components/Shot";
import { PALETTE } from "../constants/palette";

// Scene 4 — "콤보" (frames 210-300 of master, 90 frames / 3s)
//
// 6 quick cuts:
//   Sub 1 (0-15):  Hero front-kicks
//   Sub 2 (15-28): Enemy double-up block (tight)
//   Sub 3 (28-42): Enemy throws a counter punch
//   Sub 4 (42-57): Hero matrix-dodges backward (tight on hero)
//   Sub 5 (57-72): Hero springs up & launches a jumping punch (airborne)
//   Sub 6 (72-90): Punch lands — red burst + "퍽!" + camera shake + recoil
export const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const groundY = height / 2 + 220;
  // After Scene 3, hero advanced and enemy got knocked back. Start tighter.
  const heroX_base = width * 0.4;
  const enemyX_base = width * 0.66;

  // ─────────── Sub 1: Hero front kick ───────────
  if (frame < 15) {
    const t = frame / 15;
    const zoom = interpolate(t, [0, 1], [1.25, 1.4]);
    // Hero pose: ease from FIGHTING_STANCE into FRONT_KICK_POSE
    const kickInT = interpolate(t, [0, 0.6], [0, 1], { extrapolateRight: "clamp" });
    const heroPose = interpolatePose(kickInT, FIGHTING_STANCE, FRONT_KICK_POSE);

    return (
      <AbsoluteFill style={{ backgroundColor: PALETTE.background }}>
        <Shot
          zoom={zoom}
          focusX={width * 0.52}
          focusY={groundY - 180}
          viewWidth={width}
          viewHeight={height}
          rotate={3}
        >
          <Ground y={groundY} shadowX={heroX_base} shadowWidth={320} />
          <Ground y={groundY} shadowX={enemyX_base} shadowWidth={280} />

          <Stickman
            x={heroX_base}
            y={groundY}
            scale={3.4}
            facing="right"
            pose={heroPose}
            color={PALETTE.hero}
            strokeWidth={8}
          />
          <Stickman
            x={enemyX_base}
            y={groundY}
            scale={3.2}
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

  // ─────────── Sub 2: Enemy block (tight close-up on enemy) ───────────
  if (frame < 28) {
    const t = (frame - 15) / 13;
    const zoom = interpolate(t, [0, 1], [1.55, 1.7]);
    const blockInT = interpolate(t, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
    const enemyPose = interpolatePose(blockInT, FIGHTING_STANCE, BLOCK_POSE);
    // Hero pulls his kick back to stance
    const heroPullT = interpolate(t, [0, 0.7], [1, 0], { extrapolateRight: "clamp" });
    const heroPose = interpolatePose(heroPullT, FIGHTING_STANCE, FRONT_KICK_POSE);

    return (
      <AbsoluteFill style={{ backgroundColor: PALETTE.background }}>
        <Shot
          zoom={zoom}
          focusX={width * 0.62}
          focusY={groundY - 200}
          viewWidth={width}
          viewHeight={height}
          rotate={-3}
        >
          <Ground y={groundY} shadowX={heroX_base} shadowWidth={260} />
          <Ground y={groundY} shadowX={enemyX_base} shadowWidth={340} />

          <Stickman
            x={heroX_base}
            y={groundY}
            scale={3.0}
            facing="right"
            pose={heroPose}
            color={PALETTE.hero}
            strokeWidth={7}
          />
          <Stickman
            x={enemyX_base}
            y={groundY}
            scale={3.6}
            facing="left"
            pose={enemyPose}
            color={PALETTE.enemy}
            strokeWidth={8}
          />
        </Shot>
        <Vignette intensity={0.22} />
      </AbsoluteFill>
    );
  }

  // ─────────── Sub 3: Enemy counter punch ───────────
  if (frame < 42) {
    const t = (frame - 28) / 14;
    const zoom = interpolate(t, [0, 1], [1.3, 1.45]);
    const punchT = interpolate(t, [0, 0.7], [0, 1], { extrapolateRight: "clamp" });
    const enemyPose = interpolatePose(punchT, BLOCK_POSE, PUNCH_EXTENDED_POSE);

    // Streak trailing the enemy's incoming fist (right-to-left motion)
    const streakOpacity = interpolate(t, [0.3, 0.6, 1], [0, 0.65, 0]);

    return (
      <AbsoluteFill style={{ backgroundColor: PALETTE.background }}>
        <Shot
          zoom={zoom}
          focusX={width * 0.52}
          focusY={groundY - 200}
          viewWidth={width}
          viewHeight={height}
          rotate={0}
        >
          <Ground y={groundY} shadowX={heroX_base} shadowWidth={280} />
          <Ground y={groundY} shadowX={enemyX_base} shadowWidth={320} />

          {/* Streak trailing the enemy's punch (between hero and enemy) */}
          <div
            style={{
              position: "absolute",
              left: heroX_base + 40,
              top: groundY - 220,
              width: enemyX_base - heroX_base - 40,
              height: 5,
              background:
                "linear-gradient(to left, transparent 0%, rgba(40,40,40,0.45) 50%, rgba(20,20,20,0.75) 100%)",
              opacity: streakOpacity,
              filter: "blur(2px)",
            }}
          />

          <Stickman
            x={heroX_base}
            y={groundY}
            scale={3.2}
            facing="right"
            pose={FIGHTING_STANCE}
            color={PALETTE.hero}
            strokeWidth={7}
          />
          <Stickman
            x={enemyX_base}
            y={groundY}
            scale={3.2}
            facing="left"
            pose={enemyPose}
            color={PALETTE.enemy}
            strokeWidth={7}
          />
        </Shot>
        <Vignette intensity={0.2} />
      </AbsoluteFill>
    );
  }

  // ─────────── Sub 4: Hero matrix-dodges (tight close-up on hero) ───────────
  if (frame < 57) {
    const t = (frame - 42) / 15;
    const zoom = interpolate(t, [0, 1], [1.55, 1.7]);
    const dodgeT = interpolate(t, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
    const heroPose = interpolatePose(dodgeT, FIGHTING_STANCE, DODGE_BACK_POSE);
    // Hero slides slightly backward as he leans away
    const heroXNow = interpolate(t, [0, 1], [heroX_base, heroX_base - 30]);

    // Whoosh trail of the enemy's fist passing through (where hero's head was)
    const whooshOpacity = interpolate(t, [0, 0.3, 0.7], [0, 0.55, 0]);

    return (
      <AbsoluteFill style={{ backgroundColor: PALETTE.background }}>
        <Shot
          zoom={zoom}
          focusX={width * 0.42}
          focusY={groundY - 250}
          viewWidth={width}
          viewHeight={height}
          rotate={0}
        >
          <Ground y={groundY} shadowX={heroXNow} shadowWidth={300} />
          <Ground y={groundY} shadowX={enemyX_base} shadowWidth={260} />

          {/* Whoosh streak passing over the hero */}
          <div
            style={{
              position: "absolute",
              left: heroXNow - 40,
              top: groundY - 360,
              width: 280,
              height: 6,
              background:
                "linear-gradient(to right, rgba(20,20,20,0.7) 0%, rgba(40,40,40,0.3) 60%, transparent 100%)",
              opacity: whooshOpacity,
              filter: "blur(2.5px)",
            }}
          />

          <Stickman
            x={heroXNow}
            y={groundY}
            scale={3.4}
            facing="right"
            pose={heroPose}
            color={PALETTE.hero}
            strokeWidth={8}
          />
          <Stickman
            x={enemyX_base}
            y={groundY}
            scale={3.0}
            facing="left"
            pose={PUNCH_EXTENDED_POSE}
            color={PALETTE.enemy}
            strokeWidth={7}
          />
        </Shot>
        <Vignette intensity={0.22} />
      </AbsoluteFill>
    );
  }

  // ─────────── Sub 5: Hero jumping punch (airborne) ───────────
  if (frame < 72) {
    const t = (frame - 57) / 15;
    const zoom = interpolate(t, [0, 1], [1.2, 1.3]);
    // Hero arcs up and forward; lands at sub-6 start
    const heroXNow = interpolate(t, [0, 1], [heroX_base - 30, heroX_base + 60]);
    // Parabolic jump arc — peaks mid-way
    const jumpHeight = Math.sin(t * Math.PI) * 220;
    const heroYNow = groundY - jumpHeight;
    // Body tilts forward as he flies forward
    const heroRotate = interpolate(t, [0, 0.5, 1], [-15, 0, 25]);

    return (
      <AbsoluteFill style={{ backgroundColor: PALETTE.background }}>
        <Shot
          zoom={zoom}
          focusX={width * 0.5}
          focusY={groundY - 280}
          viewWidth={width}
          viewHeight={height}
          rotate={-4}
        >
          <Ground y={groundY} shadowX={enemyX_base} shadowWidth={300} />
          {/* Hero's shadow on the floor shrinks/widens with jump height */}
          <Ground
            y={groundY}
            shadowX={heroXNow}
            shadowWidth={Math.max(120, 280 - jumpHeight * 0.4)}
          />

          {/* Speed lines trailing the airborne hero */}
          <div
            style={{
              position: "absolute",
              left: heroXNow - 180,
              top: heroYNow - 220,
              width: 200,
              height: 4,
              background:
                "linear-gradient(to right, transparent 0%, rgba(30,30,30,0.6) 100%)",
              opacity: 0.7,
              filter: "blur(2px)",
              transform: "rotate(8deg)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: heroXNow - 200,
              top: heroYNow - 160,
              width: 220,
              height: 4,
              background:
                "linear-gradient(to right, transparent 0%, rgba(30,30,30,0.55) 100%)",
              opacity: 0.6,
              filter: "blur(2px)",
              transform: "rotate(10deg)",
            }}
          />

          <Stickman
            x={heroXNow}
            y={heroYNow}
            scale={3.2}
            facing="right"
            pose={PUNCH_EXTENDED_POSE}
            color={PALETTE.hero}
            strokeWidth={8}
            rotate={heroRotate}
          />
          <Stickman
            x={enemyX_base}
            y={groundY}
            scale={3.0}
            facing="left"
            pose={FIGHTING_STANCE}
            color={PALETTE.enemy}
            strokeWidth={7}
          />
        </Shot>
        <Vignette intensity={0.18} />
      </AbsoluteFill>
    );
  }

  // ─────────── Sub 6: Impact + land + aftermath ───────────
  // Hero is now in front of the enemy; punch connects, enemy recoils.
  const t = (frame - 72) / 18;
  const heroXNow = heroX_base + 60;
  const enemyXNow = interpolate(t, [0, 1], [enemyX_base, enemyX_base + 70]);

  const zoom = interpolate(frame, [72, 76, 90], [1.7, 1.9, 1.55], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tilt = interpolate(frame, [72, 74, 84], [0, -4, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Camera shake at impact
  const shakeAmp = interpolate(frame, [72, 74, 86], [0, 30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shakeX = Math.sin(frame * 33.1) * shakeAmp;
  const shakeY = Math.cos(frame * 21.7) * shakeAmp;

  // Enemy pose: FIGHTING_STANCE → RECOIL_POSE
  const recoilT = interpolate(frame, [72, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const enemyPose = interpolatePose(recoilT, FIGHTING_STANCE, RECOIL_POSE);

  // Impact effects
  const impactWorldX = heroXNow + 125;
  const impactWorldY = groundY - 290;

  const flashOpacity = interpolate(frame, [72, 73, 76], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const burstRadius = interpolate(frame, [72, 84], [40, 340], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const burstOpacity = interpolate(frame, [72, 74, 84], [0.9, 0.95, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const linesOpacity = interpolate(frame, [72, 74, 82], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const linesScale = interpolate(frame, [72, 82], [0.5, 1.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const punchScale = interpolate(frame, [72, 76, 90], [0.4, 1.15, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const punchOpacity = interpolate(frame, [72, 74, 86, 90], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.background }}>
      <AbsoluteFill
        style={{ transform: `translate(${shakeX}px, ${shakeY}px)` }}
      >
        <Shot
          zoom={zoom}
          focusX={impactWorldX - 20}
          focusY={groundY - 220}
          viewWidth={width}
          viewHeight={height}
          rotate={tilt}
        >
          <Ground y={groundY} shadowX={heroXNow} shadowWidth={300} />
          <Ground y={groundY} shadowX={enemyXNow} shadowWidth={300} />

          <Stickman
            x={heroXNow}
            y={groundY}
            scale={3.2}
            facing="right"
            pose={PUNCH_EXTENDED_POSE}
            color={PALETTE.hero}
            strokeWidth={8}
          />
          <Stickman
            x={enemyXNow}
            y={groundY}
            scale={3.0}
            facing="left"
            pose={enemyPose}
            color={PALETTE.enemy}
            strokeWidth={7}
          />

          {/* Red expanding burst */}
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

          {/* 8-point starburst impact lines */}
          <div
            style={{
              position: "absolute",
              left: impactWorldX,
              top: impactWorldY,
              width: 4,
              height: 4,
              transform: `translate(-50%, -50%) scale(${linesScale})`,
              opacity: linesOpacity,
            }}
          >
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: 260,
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

        {/* "퍽!" onomatopoeia */}
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
