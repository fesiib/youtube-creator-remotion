import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Stickman,
  RISING_DETERMINED,
  SWORD_HIGH_GUARD,
  AERIAL_SLASH_DOWN,
  SWORD_STANCE,
  RECOIL_POSE,
  interpolatePose,
} from "../components/Stickman";
import { Ground } from "../components/Ground";
import { Shot, Vignette } from "../components/Shot";
import { PALETTE } from "../constants/palette";

const SWORD_LEN = 62;

// Scene 4 — 공중 슬래시 1 (Enemy A) (frames 330-450 of EP2, 120f / 4s)
//
// Sub A (0-25):  Hero explodes upward off the ground — high vertical leap.
// Sub B (25-70): Hero arcs through the air toward Enemy A, sword raised.
// Sub C (70-120): Aerial slash down on Enemy A — slash trail, red burst,
//                  "斬" character, Enemy A blasted aside.
export const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const groundY = height / 2 + 220;
  const heroStartX = width * 0.5;
  const enemyAX = width * 0.78;
  const enemyBX = width * 0.32;

  // ─────────── Sub A: Explosive leap up ───────────
  if (frame < 25) {
    const t = frame / 25;
    const zoom = interpolate(t, [0, 1], [1.25, 1.1]);
    // Hero pose: RISING_DETERMINED → SWORD_HIGH_GUARD (sword goes up as he jumps)
    const heroPose = interpolatePose(t, RISING_DETERMINED, SWORD_HIGH_GUARD);

    // Hero position: starts on ground, arcs up
    const heroY = interpolate(t, [0, 1], [groundY, groundY - 280]);
    const heroX = heroStartX;

    // Vertical motion streaks from the ground (dust from the launch)
    const launchOpacity = interpolate(t, [0, 0.3, 0.7], [1, 0.7, 0]);

    return (
      <AbsoluteFill style={{ backgroundColor: PALETTE.background }}>
        <Shot
          zoom={zoom}
          focusX={heroStartX}
          focusY={groundY - 280}
          viewWidth={width}
          viewHeight={height}
          rotate={0}
        >
          <Ground y={groundY} shadowX={heroStartX} shadowWidth={interpolate(t, [0, 1], [340, 160])} />
          <Ground y={groundY} shadowX={enemyAX} shadowWidth={240} />
          <Ground y={groundY} shadowX={enemyBX} shadowWidth={240} />

          {/* Vertical dust streaks at launch point */}
          {[-40, 0, 40].map((dx, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: heroStartX + dx,
                top: groundY - 200,
                width: 4,
                height: 180,
                background:
                  "linear-gradient(to top, rgba(40,40,40,0.6) 0%, transparent 100%)",
                opacity: launchOpacity,
                filter: "blur(2px)",
              }}
            />
          ))}

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
            y={heroY}
            scale={3.2}
            facing="right"
            pose={heroPose}
            color={PALETTE.hero}
            strokeWidth={8}
            weapon={{ length: SWORD_LEN, color: PALETTE.hero }}
          />
        </Shot>
        <Vignette intensity={0.2} />
      </AbsoluteFill>
    );
  }

  // ─────────── Sub B: Arc toward Enemy A ───────────
  if (frame < 70) {
    const t = (frame - 25) / 45;
    const zoom = interpolate(t, [0, 1], [1.1, 1.2]);

    // Hero arcs from launch point to just above Enemy A
    const heroX = interpolate(t, [0, 1], [heroStartX, enemyAX - 130]);
    // Parabolic arc: peaks mid-flight, descends toward Enemy A
    const heroYSimple = interpolate(
      t,
      [0, 0.5, 1],
      [groundY - 320, groundY - 420, groundY - 260],
    );

    const heroRotate = interpolate(t, [0, 1], [0, 15]);

    return (
      <AbsoluteFill style={{ backgroundColor: PALETTE.background }}>
        <Shot
          zoom={zoom}
          focusX={(heroStartX + enemyAX) / 2}
          focusY={groundY - 320}
          viewWidth={width}
          viewHeight={height}
          rotate={-2}
        >
          <Ground y={groundY} shadowX={heroX} shadowWidth={120} />
          <Ground y={groundY} shadowX={enemyAX} shadowWidth={260} />
          <Ground y={groundY} shadowX={enemyBX} shadowWidth={240} />

          {/* Motion lines trailing the airborne hero */}
          <div
            style={{
              position: "absolute",
              left: heroX - 200,
              top: heroYSimple - 60,
              width: 220,
              height: 5,
              background:
                "linear-gradient(to right, transparent 0%, rgba(30,30,30,0.6) 100%)",
              opacity: 0.7,
              filter: "blur(2px)",
              transform: "rotate(-12deg)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: heroX - 180,
              top: heroYSimple + 20,
              width: 200,
              height: 4,
              background:
                "linear-gradient(to right, transparent 0%, rgba(30,30,30,0.5) 100%)",
              opacity: 0.6,
              filter: "blur(2px)",
              transform: "rotate(-10deg)",
            }}
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
            pose={SWORD_STANCE}
            color={PALETTE.enemy}
            strokeWidth={7}
            weapon={{ length: SWORD_LEN, color: PALETTE.enemy }}
          />

          <Stickman
            x={heroX}
            y={heroYSimple}
            scale={3.2}
            facing="right"
            pose={SWORD_HIGH_GUARD}
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

  // ─────────── Sub C: Slash lands on Enemy A ───────────
  const IMPACT_LOCAL = 6; // local frame within sub C when impact happens
  const frameLocal = frame - 70;

  // Hero descends onto Enemy A — pose: HIGH_GUARD → AERIAL_SLASH_DOWN
  const slashT = interpolate(frameLocal, [0, IMPACT_LOCAL, 30], [0, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const heroPose = interpolatePose(slashT, SWORD_HIGH_GUARD, AERIAL_SLASH_DOWN);

  // Hero finishes descent at Enemy A's position
  const heroX = interpolate(frameLocal, [0, IMPACT_LOCAL], [enemyAX - 130, enemyAX - 30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const heroY = interpolate(frameLocal, [0, IMPACT_LOCAL, 50], [groundY - 260, groundY - 80, groundY - 80], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Enemy A: stance → recoil flying away
  const enemyAPose = interpolatePose(
    interpolate(frameLocal, [IMPACT_LOCAL, IMPACT_LOCAL + 6], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
    SWORD_STANCE,
    RECOIL_POSE,
  );
  const enemyAXNow = interpolate(frameLocal, [IMPACT_LOCAL, 50], [enemyAX, width + 200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const enemyAYNow = groundY - interpolate(frameLocal, [IMPACT_LOCAL, 25, 50], [0, 200, 50], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const enemyARotate = interpolate(frameLocal, [IMPACT_LOCAL, 50], [0, 240], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Effects at impact
  const flashOpacity = interpolate(frame, [70 + IMPACT_LOCAL, 70 + IMPACT_LOCAL + 1, 70 + IMPACT_LOCAL + 5], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const burstScale = interpolate(frame, [70 + IMPACT_LOCAL, 70 + IMPACT_LOCAL + 12], [0.3, 1.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const burstOpacity = interpolate(frame, [70 + IMPACT_LOCAL, 70 + IMPACT_LOCAL + 2, 70 + IMPACT_LOCAL + 14], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Camera shake
  const shakeAmp = interpolate(frame, [70 + IMPACT_LOCAL, 70 + IMPACT_LOCAL + 3, 70 + IMPACT_LOCAL + 20], [0, 32, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shakeX = Math.sin(frame * 33) * shakeAmp;
  const shakeY = Math.cos(frame * 22) * shakeAmp;

  // "斬" text
  const zanScale = interpolate(frame, [70 + IMPACT_LOCAL, 70 + IMPACT_LOCAL + 5, 70 + IMPACT_LOCAL + 30], [0.4, 1.3, 1.1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const zanOpacity = interpolate(frame, [70 + IMPACT_LOCAL, 70 + IMPACT_LOCAL + 3, 70 + IMPACT_LOCAL + 30, 70 + IMPACT_LOCAL + 45], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Vertical slash trail at the impact (just before impact)
  const trailOpacity = interpolate(frame, [70, 70 + IMPACT_LOCAL, 70 + IMPACT_LOCAL + 8], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const impactX = enemyAX - 50;
  const impactY = groundY - 280;

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.background }}>
      <AbsoluteFill style={{ transform: `translate(${shakeX}px, ${shakeY}px)` }}>
        <Shot
          zoom={1.45}
          focusX={enemyAX - 50}
          focusY={groundY - 220}
          viewWidth={width}
          viewHeight={height}
          rotate={0}
        >
          <Ground y={groundY} shadowX={heroX} shadowWidth={interpolate(frameLocal, [0, IMPACT_LOCAL], [140, 280])} />
          <Ground y={groundY} shadowX={enemyBX} shadowWidth={240} />

          {/* Vertical slash trail — from above down to enemy */}
          <div
            style={{
              position: "absolute",
              left: impactX - 5,
              top: impactY - 280,
              width: 14,
              height: 360,
              background: `linear-gradient(to bottom, transparent 0%, ${PALETTE.accentRed} 50%, rgba(226,48,48,0.4) 100%)`,
              opacity: trailOpacity,
              borderRadius: 7,
              filter: "blur(2px) drop-shadow(0 0 12px rgba(226,48,48,0.7))",
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

          {/* Enemy A — flying away after slash */}
          {enemyAXNow < width + 150 && (
            <Stickman
              x={enemyAXNow}
              y={enemyAYNow}
              scale={3.0}
              facing="left"
              pose={enemyAPose}
              color={PALETTE.enemy}
              strokeWidth={7}
              weapon={{ length: SWORD_LEN, color: PALETTE.enemy }}
              rotate={enemyARotate}
            />
          )}

          <Stickman
            x={heroX}
            y={heroY}
            scale={3.2}
            facing="right"
            pose={heroPose}
            color={PALETTE.hero}
            strokeWidth={8}
            weapon={{ length: SWORD_LEN, color: PALETTE.hero }}
          />

          {/* Red burst at impact point */}
          <div
            style={{
              position: "absolute",
              left: impactX,
              top: impactY,
              width: 440,
              height: 440,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${PALETTE.accentRed} 0%, rgba(226,48,48,0.6) 35%, transparent 70%)`,
              transform: `translate(-50%, -50%) scale(${burstScale})`,
              opacity: burstOpacity,
              mixBlendMode: "multiply",
            }}
          />
        </Shot>

        {/* "斬" — kanji text */}
        <div
          style={{
            position: "absolute",
            left: width / 2,
            top: height / 2 - 100,
            transform: `translate(-50%, -50%) scale(${zanScale}) rotate(-4deg)`,
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

      {/* White flash on impact */}
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
