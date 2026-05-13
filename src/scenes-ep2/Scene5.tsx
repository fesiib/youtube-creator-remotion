import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Stickman,
  AERIAL_SLASH_HORIZONTAL,
  SWORD_STANCE,
  RECOIL_POSE,
  interpolatePose,
} from "../components/Stickman";
import { Ground } from "../components/Ground";
import { Shot, Vignette } from "../components/Shot";
import { PALETTE } from "../constants/palette";

const SWORD_LEN = 62;

// Scene 5 — 공중 피벗 + Enemy B (frames 450-540 of EP2, 90f / 3s)
//
// Hero is still airborne after defeating Enemy A. He pivots in mid-air,
// reorients toward Enemy B on the left, and lands a horizontal slash.
//
// Sub A (0-35): Aerial pivot — hero rotates 180° in the air, facing flips
//                from right to left as he turns toward Enemy B.
// Sub B (35-90): Horizontal aerial slash on Enemy B — red burst, "斬" text,
//                 Enemy B flies off to the left.
export const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const groundY = height / 2 + 220;
  const enemyBX = width * 0.32;

  // ─────────── Sub A: Aerial pivot ───────────
  if (frame < 35) {
    const t = frame / 35;
    const zoom = interpolate(t, [0, 1], [1.25, 1.15]);

    // Hero arcs from the right (post-A defeat) toward the left, swinging
    // through the air. Start above Enemy A's position, end near Enemy B.
    const heroX = interpolate(t, [0, 1], [width * 0.7, enemyBX + 200]);
    // Stays airborne, slight arc up
    const heroY = interpolate(t, [0, 0.5, 1], [groundY - 280, groundY - 360, groundY - 320]);
    // 180° rotation during the pivot
    const heroRotate = interpolate(t, [0, 1], [20, -160]);
    // Facing flips mid-pivot
    const heroFacing: "left" | "right" = t < 0.5 ? "right" : "left";

    // Pivot trail — circular sweep behind the hero
    return (
      <AbsoluteFill style={{ backgroundColor: PALETTE.background }}>
        <Shot
          zoom={zoom}
          focusX={width * 0.5}
          focusY={groundY - 320}
          viewWidth={width}
          viewHeight={height}
          rotate={0}
        >
          <Ground y={groundY} shadowX={heroX} shadowWidth={120} />
          <Ground y={groundY} shadowX={enemyBX} shadowWidth={260} />

          {/* Curving motion trail behind hero */}
          <div
            style={{
              position: "absolute",
              left: heroX - 60,
              top: heroY - 40,
              width: 220,
              height: 6,
              background:
                "linear-gradient(to right, transparent 0%, rgba(30,30,30,0.6) 100%)",
              opacity: 0.7,
              filter: "blur(2px)",
              transform: `rotate(${interpolate(t, [0, 1], [-25, 25])}deg)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: heroX - 40,
              top: heroY + 40,
              width: 200,
              height: 4,
              background:
                "linear-gradient(to right, transparent 0%, rgba(30,30,30,0.5) 100%)",
              opacity: 0.6,
              filter: "blur(2px)",
              transform: `rotate(${interpolate(t, [0, 1], [-15, 15])}deg)`,
            }}
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
            y={heroY}
            scale={3.2}
            facing={heroFacing}
            pose={AERIAL_SLASH_HORIZONTAL}
            color={PALETTE.hero}
            strokeWidth={8}
            weapon={{ length: SWORD_LEN, color: PALETTE.hero }}
            rotate={heroRotate}
          />
        </Shot>
        <Vignette intensity={0.2} />
      </AbsoluteFill>
    );
  }

  // ─────────── Sub B: Horizontal slash on Enemy B ───────────
  const IMPACT_LOCAL = 8;
  const frameLocal = frame - 35;

  // Hero descends toward Enemy B from the right, now facing LEFT after pivot
  const heroX = interpolate(
    frameLocal,
    [0, IMPACT_LOCAL],
    [enemyBX + 200, enemyBX + 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const heroY = interpolate(
    frameLocal,
    [0, IMPACT_LOCAL, 55],
    [groundY - 320, groundY - 200, groundY - 200],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  // After the pivot in Sub A, hero faces left with upright body (rotation 0)
  const heroRotateFinal = interpolate(
    frameLocal,
    [0, IMPACT_LOCAL],
    [20, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Enemy B: stance → recoil flying left
  const enemyBPose = interpolatePose(
    interpolate(frameLocal, [IMPACT_LOCAL, IMPACT_LOCAL + 6], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
    SWORD_STANCE,
    RECOIL_POSE,
  );
  const enemyBXNow = interpolate(
    frameLocal,
    [IMPACT_LOCAL, 55],
    [enemyBX, -220],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const enemyBYNow =
    groundY -
    interpolate(
      frameLocal,
      [IMPACT_LOCAL, 28, 55],
      [0, 200, 50],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
  const enemyBRotate = interpolate(
    frameLocal,
    [IMPACT_LOCAL, 55],
    [0, -240],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Effects
  const flashOpacity = interpolate(
    frame,
    [35 + IMPACT_LOCAL, 35 + IMPACT_LOCAL + 1, 35 + IMPACT_LOCAL + 5],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const burstScale = interpolate(
    frame,
    [35 + IMPACT_LOCAL, 35 + IMPACT_LOCAL + 12],
    [0.3, 1.6],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const burstOpacity = interpolate(
    frame,
    [35 + IMPACT_LOCAL, 35 + IMPACT_LOCAL + 2, 35 + IMPACT_LOCAL + 14],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const shakeAmp = interpolate(
    frame,
    [35 + IMPACT_LOCAL, 35 + IMPACT_LOCAL + 3, 35 + IMPACT_LOCAL + 20],
    [0, 30, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const shakeX = Math.sin(frame * 33) * shakeAmp;
  const shakeY = Math.cos(frame * 22) * shakeAmp;

  const zanScale = interpolate(
    frame,
    [35 + IMPACT_LOCAL, 35 + IMPACT_LOCAL + 5, 35 + IMPACT_LOCAL + 30],
    [0.4, 1.3, 1.1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const zanOpacity = interpolate(
    frame,
    [
      35 + IMPACT_LOCAL,
      35 + IMPACT_LOCAL + 3,
      35 + IMPACT_LOCAL + 30,
      35 + IMPACT_LOCAL + 40,
    ],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Horizontal slash trail — sweeps right-to-left across enemy
  const trailOpacity = interpolate(
    frame,
    [35, 35 + IMPACT_LOCAL, 35 + IMPACT_LOCAL + 8],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const impactX = enemyBX + 30;
  const impactY = groundY - 300;

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.background }}>
      <AbsoluteFill style={{ transform: `translate(${shakeX}px, ${shakeY}px)` }}>
        <Shot
          zoom={1.45}
          focusX={enemyBX + 50}
          focusY={groundY - 240}
          viewWidth={width}
          viewHeight={height}
          rotate={0}
        >
          <Ground
            y={groundY}
            shadowX={heroX}
            shadowWidth={interpolate(
              frameLocal,
              [0, IMPACT_LOCAL],
              [140, 280],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            )}
          />

          {/* Horizontal slash trail — sweeps across enemy */}
          <div
            style={{
              position: "absolute",
              left: impactX - 200,
              top: impactY,
              width: 380,
              height: 14,
              background: `linear-gradient(to left, transparent 0%, ${PALETTE.accentRed} 50%, rgba(226,48,48,0.4) 100%)`,
              opacity: trailOpacity,
              borderRadius: 7,
              filter: "blur(2px) drop-shadow(0 0 12px rgba(226,48,48,0.7))",
              transform: "rotate(-3deg)",
            }}
          />

          {/* Enemy B — flying off left */}
          {enemyBXNow > -200 && (
            <Stickman
              x={enemyBXNow}
              y={enemyBYNow}
              scale={3.0}
              facing="right"
              pose={enemyBPose}
              color={PALETTE.enemy}
              strokeWidth={7}
              weapon={{ length: SWORD_LEN, color: PALETTE.enemy }}
              rotate={enemyBRotate}
            />
          )}

          <Stickman
            x={heroX}
            y={heroY}
            scale={3.2}
            facing="left"
            pose={AERIAL_SLASH_HORIZONTAL}
            color={PALETTE.hero}
            strokeWidth={8}
            weapon={{ length: SWORD_LEN, color: PALETTE.hero }}
            rotate={heroRotateFinal}
          />

          {/* Red burst */}
          <div
            style={{
              position: "absolute",
              left: impactX,
              top: impactY,
              width: 420,
              height: 420,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${PALETTE.accentRed} 0%, rgba(226,48,48,0.6) 35%, transparent 70%)`,
              transform: `translate(-50%, -50%) scale(${burstScale})`,
              opacity: burstOpacity,
              mixBlendMode: "multiply",
            }}
          />
        </Shot>

        {/* "斬" text */}
        <div
          style={{
            position: "absolute",
            left: width / 2,
            top: height / 2 - 100,
            transform: `translate(-50%, -50%) scale(${zanScale}) rotate(6deg)`,
            opacity: zanOpacity,
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Pretendard', serif",
            fontSize: 320,
            fontWeight: 900,
            color: PALETTE.accentRed,
            WebkitTextStroke: "10px #0a0a0a",
            zIndex: 6,
            textShadow: "10px 10px 0 rgba(10,10,10,0.2)",
            lineHeight: 1,
          }}
        >
          斬
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

      <Vignette intensity={0.2} />
    </AbsoluteFill>
  );
};

