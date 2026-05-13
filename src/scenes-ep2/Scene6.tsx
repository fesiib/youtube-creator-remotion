import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Stickman,
  AERIAL_SLASH_DOWN,
  SWORD_FINISHER,
  interpolatePose,
} from "../components/Stickman";
import { Ground } from "../components/Ground";
import { Shot, Vignette } from "../components/Shot";
import { PALETTE } from "../constants/palette";

const SWORD_LEN = 62;

// Scene 6 — 결정타 슬로우모 + 착지 (frames 540-620 of EP2, 80f / 2.67s)
//
// Both enemies are gone. The fight ends with the hero suspended in the air
// for a beat — sword extended, red gradient at peak — then lands hard,
// concluding the duel with a final "斬" stamp on the screen.
//
// Sub A (0-40): Slow-mo of hero airborne, sword extended out — held pose
//                like a trailer freeze-frame. Red gradient max.
// Sub B (40-80): Landing — hero slams down, dust kicks up, large "斬"
//                 text dominates the screen.
export const Scene6: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const groundY = height / 2 + 220;
  const heroAirX = width * 0.5;

  // ─────────── Sub A: Slow-mo airborne hold ───────────
  if (frame < 40) {
    const t = frame / 40;
    const zoom = interpolate(t, [0, 1], [1.4, 1.55]);

    // Hero suspended high in the air, sword extended forward
    const driftX = Math.sin(frame * 0.1) * 4;
    const driftY = Math.sin(frame * 0.08 + 1) * 4;

    // Pulsing red gradient — slower, deeper
    const pulse = Math.sin(frame * 0.18) * 0.5 + 0.5;
    const redIntensity = 0.16 + pulse * 0.12;

    return (
      <AbsoluteFill style={{ backgroundColor: PALETTE.background }}>
        {/* Strong red radial gradient */}
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse 80% 60% at ${heroAirX}px ${groundY - 380}px, rgba(226,48,48,${redIntensity * 1.8}) 0%, rgba(226,48,48,${redIntensity * 0.8}) 35%, transparent 75%)`,
            pointerEvents: "none",
          }}
        />

        <Shot
          zoom={zoom}
          focusX={heroAirX}
          focusY={groundY - 380}
          viewWidth={width}
          viewHeight={height}
          rotate={0}
        >
          <Ground y={groundY} shadowX={heroAirX} shadowWidth={140} />

          {/* Floating dust particles */}
          {[
            { x: 0.32, y: 0.45, s: 5 },
            { x: 0.42, y: 0.32, s: 4 },
            { x: 0.58, y: 0.38, s: 5 },
            { x: 0.68, y: 0.5, s: 4 },
            { x: 0.3, y: 0.6, s: 5 },
            { x: 0.62, y: 0.62, s: 4 },
            { x: 0.5, y: 0.7, s: 6 },
          ].map((p, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: width * p.x + Math.sin((frame + i * 8) * 0.05) * 5,
                top: height * p.y + Math.sin((frame + i * 11) * 0.06) * 4,
                width: p.s,
                height: p.s,
                borderRadius: "50%",
                background: "rgba(60,60,60,0.45)",
                filter: "blur(1px)",
              }}
            />
          ))}

          <Stickman
            x={heroAirX + driftX}
            y={groundY - 400 + driftY}
            scale={3.2}
            facing="left"
            pose={AERIAL_SLASH_HORIZONTAL_FROZEN}
            color={PALETTE.hero}
            strokeWidth={8}
            weapon={{ length: SWORD_LEN, color: PALETTE.hero }}
          />
        </Shot>

        <Vignette intensity={0.3} />
      </AbsoluteFill>
    );
  }

  // ─────────── Sub B: Landing + final 斬 ───────────
  const frameLocal = frame - 40;
  const LAND_LOCAL = 8;

  const zoom = interpolate(frame, [40, 48, 80], [1.45, 1.7, 1.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Hero descends and lands
  const heroX = heroAirX;
  const heroY = interpolate(
    frameLocal,
    [0, LAND_LOCAL, 40],
    [groundY - 400, groundY, groundY],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const heroPose = interpolatePose(
    interpolate(frameLocal, [0, LAND_LOCAL], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
    AERIAL_SLASH_DOWN,
    SWORD_FINISHER,
  );
  const heroRotate = interpolate(
    frameLocal,
    [0, LAND_LOCAL],
    [10, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Landing impact effects
  const flashOpacity = interpolate(
    frame,
    [40 + LAND_LOCAL, 40 + LAND_LOCAL + 2, 40 + LAND_LOCAL + 6],
    [0, 0.85, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const shakeAmp = interpolate(
    frame,
    [40 + LAND_LOCAL, 40 + LAND_LOCAL + 3, 40 + LAND_LOCAL + 20],
    [0, 28, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const shakeX = Math.sin(frame * 31) * shakeAmp;
  const shakeY = Math.cos(frame * 21) * shakeAmp;

  // Dust kick on landing
  const dustOpacity = interpolate(
    frame,
    [40 + LAND_LOCAL, 40 + LAND_LOCAL + 4, 40 + LAND_LOCAL + 22],
    [0, 0.7, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const dustScale = interpolate(
    frame,
    [40 + LAND_LOCAL, 40 + LAND_LOCAL + 22],
    [0.3, 1.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Final "斬" — biggest one, holds longer
  const zanScale = interpolate(
    frame,
    [40 + LAND_LOCAL, 40 + LAND_LOCAL + 6, 80],
    [0.3, 1.4, 1.15],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const zanOpacity = interpolate(
    frame,
    [40 + LAND_LOCAL - 2, 40 + LAND_LOCAL + 2, 78, 80],
    [0, 1, 1, 0.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.background }}>
      <AbsoluteFill style={{ transform: `translate(${shakeX}px, ${shakeY}px)` }}>
        <Shot
          zoom={zoom}
          focusX={heroX}
          focusY={groundY - 200}
          viewWidth={width}
          viewHeight={height}
          rotate={0}
        >
          <Ground y={groundY} shadowX={heroX} shadowWidth={interpolate(frameLocal, [0, LAND_LOCAL], [140, 320])} />

          {/* Landing dust kick */}
          <div
            style={{
              position: "absolute",
              left: heroX,
              top: groundY,
              width: 420,
              height: 80,
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse at center, rgba(60,60,60,0.5) 0%, transparent 70%)",
              transform: `translate(-50%, -50%) scale(${dustScale})`,
              opacity: dustOpacity,
              filter: "blur(3px)",
            }}
          />

          <Stickman
            x={heroX}
            y={heroY}
            scale={3.3}
            facing="left"
            pose={heroPose}
            color={PALETTE.hero}
            strokeWidth={9}
            weapon={{ length: SWORD_LEN, color: PALETTE.hero }}
            rotate={heroRotate}
          />
        </Shot>

        {/* Final "斬" — large, dominates the upper portion */}
        <div
          style={{
            position: "absolute",
            left: width / 2,
            top: height / 2 - 120,
            transform: `translate(-50%, -50%) scale(${zanScale}) rotate(-3deg)`,
            opacity: zanOpacity,
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Pretendard', serif",
            fontSize: 420,
            fontWeight: 900,
            color: PALETTE.accentRed,
            WebkitTextStroke: "14px #0a0a0a",
            zIndex: 6,
            textShadow: "14px 14px 0 rgba(10,10,10,0.25)",
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

      <Vignette intensity={0.22} />
    </AbsoluteFill>
  );
};

// Frozen aerial pose for the slow-mo hold — same as AERIAL_SLASH_DOWN
// but with sword angle visually held mid-arc.
const AERIAL_SLASH_HORIZONTAL_FROZEN = AERIAL_SLASH_DOWN;
