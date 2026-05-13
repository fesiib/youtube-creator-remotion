import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Stickman,
  SWORD_STANCE,
  SWORD_HIGH_GUARD,
  SWORD_HORIZONTAL_SLASH,
  interpolatePose,
} from "../components/Stickman";
import { Ground } from "../components/Ground";
import { Shot, Vignette } from "../components/Shot";
import { PALETTE } from "../constants/palette";

const SWORD_LEN = 62;

// Scene 2 — 첫 클래시 + 기습 (frames 60-180 of EP2, 120f / 4s)
//
// Sub A (0-40):  Hero and Enemy A meet swords — yellow clash spark.
// Sub B (40-80): Enemy B sneaks in fast from the left toward hero's back.
// Sub C (80-120): Enemy B's slash hits hero — red slash line on hero's body,
//                  hero begins to slump.
export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const groundY = height / 2 + 220;
  const heroX = width * 0.5;
  const enemyAX = width * 0.78;
  const enemyBStartX = width * 0.22;

  // ─────────── Sub A: Clash with Enemy A ───────────
  if (frame < 40) {
    const t = frame / 40;
    const zoom = interpolate(t, [0, 1], [1.15, 1.3]);

    // Both characters swing up into high guard, peak at frame ~22, recover by 40
    const swingT = interpolate(
      frame,
      [0, 22, 40],
      [0, 1, 0.3],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
    const heroPose = interpolatePose(swingT, SWORD_STANCE, SWORD_HIGH_GUARD);
    const enemyAPose = interpolatePose(swingT, SWORD_STANCE, SWORD_HIGH_GUARD);

    // Clash spark — peaks at frame 22 (when swords meet)
    const sparkOpacity = interpolate(frame, [18, 22, 36], [0, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const sparkScale = interpolate(frame, [18, 22, 36], [0.3, 1.3, 1.8], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    // Spark sits between the two sword tips — both swords held overhead.
    // The high-guard sword tips are roughly above and between the two bodies.
    const sparkX = (heroX + enemyAX) / 2;
    const sparkY = groundY - 540;

    return (
      <AbsoluteFill style={{ backgroundColor: PALETTE.background }}>
        <Shot
          zoom={zoom}
          focusX={(heroX + enemyAX) / 2}
          focusY={groundY - 320}
          viewWidth={width}
          viewHeight={height}
          rotate={-2}
        >
          <Ground y={groundY} shadowX={heroX} shadowWidth={280} />
          <Ground y={groundY} shadowX={enemyAX} shadowWidth={260} />

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
          <Stickman
            x={enemyAX}
            y={groundY}
            scale={3.0}
            facing="left"
            pose={enemyAPose}
            color={PALETTE.enemy}
            strokeWidth={7}
            weapon={{ length: SWORD_LEN, color: PALETTE.enemy }}
          />

          {/* Clash spark — yellow burst with radial spikes */}
          <div
            style={{
              position: "absolute",
              left: sparkX,
              top: sparkY,
              width: 4,
              height: 4,
              transform: `translate(-50%, -50%) scale(${sparkScale})`,
              opacity: sparkOpacity,
            }}
          >
            {/* Central glow */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 180,
                height: 180,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${PALETTE.accentYellow} 0%, rgba(245,208,48,0.5) 40%, transparent 70%)`,
                transform: "translate(-50%, -50%)",
                mixBlendMode: "multiply",
              }}
            />
            {/* Radial spikes */}
            {[0, 30, 60, 90, 120, 150].map((deg, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: 160,
                  height: 4,
                  background: PALETTE.accentYellow,
                  transformOrigin: "0 50%",
                  transform: `rotate(${deg}deg) translateY(-50%)`,
                  borderRadius: 2,
                }}
              />
            ))}
          </div>
        </Shot>

        <Vignette intensity={0.22} />
      </AbsoluteFill>
    );
  }

  // ─────────── Sub B: Enemy B sneaks in from behind ───────────
  if (frame < 80) {
    const t = (frame - 40) / 40;
    const zoom = interpolate(t, [0, 1], [1.05, 1.15]);

    // Hero still engaged with A (swords disengaging from clash)
    const heroPose = interpolatePose(
      interpolate(t, [0, 1], [0.3, 0]),
      SWORD_STANCE,
      SWORD_HIGH_GUARD,
    );

    // Enemy B rushes forward
    const enemyBX = interpolate(
      t,
      [0, 1],
      [enemyBStartX, heroX - 180],
    );
    // B raises sword as he approaches
    const enemyBPose = interpolatePose(t, SWORD_STANCE, SWORD_HIGH_GUARD);

    // Streak trailing Enemy B
    const streakOpacity = interpolate(t, [0, 0.5, 1], [0.7, 0.4, 0]);

    return (
      <AbsoluteFill style={{ backgroundColor: PALETTE.background }}>
        <Shot
          zoom={zoom}
          focusX={width * 0.42}
          focusY={groundY - 250}
          viewWidth={width}
          viewHeight={height}
        >
          <Ground y={groundY} shadowX={heroX} shadowWidth={300} />
          <Ground y={groundY} shadowX={enemyAX} shadowWidth={260} />
          <Ground y={groundY} shadowX={enemyBX} shadowWidth={260} />

          {/* Enemy B's approach streak */}
          <div
            style={{
              position: "absolute",
              left: enemyBStartX - 30,
              top: groundY - 230,
              width: Math.max(0, enemyBX - enemyBStartX + 60),
              height: 5,
              background:
                "linear-gradient(to right, transparent 0%, rgba(40,40,40,0.5) 50%, rgba(20,20,20,0.8) 100%)",
              opacity: streakOpacity,
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
            weapon={{ length: SWORD_LEN, color: PALETTE.hero }}
          />
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
            pose={enemyBPose}
            color={PALETTE.enemy}
            strokeWidth={7}
            weapon={{ length: SWORD_LEN, color: PALETTE.enemy }}
          />
        </Shot>

        <Vignette intensity={0.22} />
      </AbsoluteFill>
    );
  }

  // ─────────── Sub C: Enemy B's slash lands on the hero ───────────
  const t = (frame - 80) / 40;
  const zoom = interpolate(t, [0, 1], [1.5, 1.6]);

  // B swings down across hero — pose: SWORD_HIGH_GUARD → SWORD_HORIZONTAL_SLASH
  const bSwingT = interpolate(t, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });
  const enemyBPose = interpolatePose(
    bSwingT,
    SWORD_HIGH_GUARD,
    SWORD_HORIZONTAL_SLASH,
  );

  // Hero flinches (slight slump)
  const heroSlumpT = interpolate(t, [0.4, 1], [0, 0.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const heroFlinch = {
    ...SWORD_STANCE,
    torsoLean: 14 + heroSlumpT * 18,
  };

  // Red slash line across hero — appears at impact (~frame 95)
  const slashOpacity = interpolate(frame, [92, 96, 110], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Camera shake at impact
  const shakeAmp = interpolate(frame, [93, 96, 110], [0, 18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shakeX = Math.sin(frame * 32) * shakeAmp;
  const shakeY = Math.cos(frame * 22) * shakeAmp;

  // White flash at hit
  const flashOpacity = interpolate(frame, [94, 95, 100], [0, 0.8, 0], {
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
          focusX={heroX - 40}
          focusY={groundY - 280}
          viewWidth={width}
          viewHeight={height}
          rotate={2}
        >
          <Ground y={groundY} shadowX={heroX} shadowWidth={300} />
          <Ground y={groundY} shadowX={heroX - 180} shadowWidth={260} />

          <Stickman
            x={heroX}
            y={groundY}
            scale={3.2}
            facing="right"
            pose={heroFlinch}
            color={PALETTE.hero}
            strokeWidth={8}
            weapon={{ length: SWORD_LEN, color: PALETTE.hero }}
          />
          <Stickman
            x={heroX - 180}
            y={groundY}
            scale={3.0}
            facing="right"
            pose={enemyBPose}
            color={PALETTE.enemy}
            strokeWidth={7}
            weapon={{ length: SWORD_LEN, color: PALETTE.enemy }}
          />

          {/* Red slash line across hero's upper back — diagonal */}
          <div
            style={{
              position: "absolute",
              left: heroX - 120,
              top: groundY - 380,
              width: 240,
              height: 9,
              background: `linear-gradient(to right, transparent 0%, ${PALETTE.accentRed} 20%, ${PALETTE.accentRed} 80%, transparent 100%)`,
              opacity: slashOpacity,
              transform: "rotate(-22deg)",
              borderRadius: 4,
              filter: "drop-shadow(0 0 8px rgba(226,48,48,0.6))",
            }}
          />
        </Shot>

        {/* White flash on hit */}
        <AbsoluteFill
          style={{
            backgroundColor: "#ffffff",
            opacity: flashOpacity,
            pointerEvents: "none",
            zIndex: 10,
          }}
        />
      </AbsoluteFill>

      <Vignette intensity={0.22} />
    </AbsoluteFill>
  );
};
