import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Stickman,
  SLOWMO_AIRBORNE_POSE,
  PUNCH_EXTENDED_POSE,
  KO_FOLLOWTHROUGH_POSE,
  FIGHTING_STANCE,
  RECOIL_POSE,
  interpolatePose,
} from "../components/Stickman";
import { Ground } from "../components/Ground";
import { Shot, Vignette } from "../components/Shot";
import { PALETTE } from "../constants/palette";

// Scene 6 — "결정타" (frames 360-450 of master, 90 frames / 3s)
//
// The climax. Hero descends from the airborne slow-mo windup and slams the
// decisive strike. White flash → red screen wash → multi-ring shockwaves →
// huge "K.O." text → enemy hurled off screen → hero settles in finishing
// pose. Strongest camera shake of the whole video.
//
// Sub-shots:
//   Sub 1 (0-12):  Descent — hero plummets toward enemy, motion lines
//   Sub 2 (12-22): IMPACT — full white→red flash, max burst, shake peaks
//   Sub 3 (22-90): Aftermath — shockwaves expand, K.O. text, enemy flies
//                  off, camera slowly pulls back, hero settles
export const Scene6: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const groundY = height / 2 + 220;
  const heroStartX = width * 0.52;
  const heroStartY = groundY - 460;
  const heroImpactX = width * 0.6;
  const enemyStartX = width * 0.76;

  // Impact moment is at frame 12 (when hero lands the strike)
  const IMPACT_FRAME = 12;

  // Hero position: descends from airborne to ground over 0-12 frames, then holds
  const heroX = interpolate(frame, [0, IMPACT_FRAME], [heroStartX, heroImpactX], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const heroY = interpolate(frame, [0, IMPACT_FRAME], [heroStartY, groundY], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Hero rotates from forward-tilted airborne to upright on landing
  const heroRotate = interpolate(frame, [0, IMPACT_FRAME], [25, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Hero pose: airborne windup → punch-extended at impact → follow-through after
  const heroPose =
    frame < IMPACT_FRAME
      ? interpolatePose(
          interpolate(frame, [0, IMPACT_FRAME], [0, 1]),
          SLOWMO_AIRBORNE_POSE,
          PUNCH_EXTENDED_POSE,
        )
      : interpolatePose(
          interpolate(frame, [IMPACT_FRAME, 40], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          PUNCH_EXTENDED_POSE,
          KO_FOLLOWTHROUGH_POSE,
        );

  // Enemy: stays put until impact, then gets BLASTED off screen with rotation
  const enemyX = interpolate(
    frame,
    [IMPACT_FRAME, 60],
    [enemyStartX, width + 280],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  // Enemy is knocked into the air on impact, peaks, then falls off-screen
  const enemyAirArc = interpolate(
    frame,
    [IMPACT_FRAME, 32, 60],
    [0, 220, -50],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const enemyY = groundY - enemyAirArc;
  // Enemy tumbles
  const enemyRotate = interpolate(
    frame,
    [IMPACT_FRAME, 60],
    [0, 280],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  // Enemy pose: FIGHTING_STANCE → RECOIL_POSE
  const enemyRecoilT = interpolate(frame, [IMPACT_FRAME, IMPACT_FRAME + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const enemyPose = interpolatePose(
    enemyRecoilT,
    FIGHTING_STANCE,
    RECOIL_POSE,
  );

  // ───── Camera ─────
  // Push in toward the impact through descent, peak zoom at impact, then
  // slowly pull back as the dust settles.
  const zoom = interpolate(
    frame,
    [0, IMPACT_FRAME, 30, 90],
    [1.35, 1.95, 1.5, 1.2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  // Slight whip-tilt at impact
  const tilt = interpolate(
    frame,
    [IMPACT_FRAME, IMPACT_FRAME + 3, IMPACT_FRAME + 14],
    [0, -6, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // ───── Camera shake — STRONGEST in the whole video ─────
  const shakeAmp = interpolate(
    frame,
    [IMPACT_FRAME, IMPACT_FRAME + 3, 36, 50],
    [0, 55, 18, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const shakeX = Math.sin(frame * 34.7) * shakeAmp;
  const shakeY = Math.cos(frame * 22.3) * shakeAmp;

  // ───── Impact effects ─────
  // White flash — heavy, holds longer than previous impacts
  const flashOpacity = interpolate(
    frame,
    [IMPACT_FRAME, IMPACT_FRAME + 1, IMPACT_FRAME + 4, IMPACT_FRAME + 8],
    [0, 1, 0.85, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  // Red wash — peaks just after the white, fades over many frames
  const redWashOpacity = interpolate(
    frame,
    [IMPACT_FRAME + 2, IMPACT_FRAME + 4, IMPACT_FRAME + 20, IMPACT_FRAME + 32],
    [0, 0.7, 0.3, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Impact point — where hero's fist meets enemy
  const impactWorldX = heroImpactX + 130;
  const impactWorldY = groundY - 290;

  // Three layered shockwave rings, each starting at staggered times
  const ringParams = [
    { startFrame: IMPACT_FRAME, duration: 38, maxR: 700, thickness: 14 },
    { startFrame: IMPACT_FRAME + 4, duration: 42, maxR: 880, thickness: 10 },
    { startFrame: IMPACT_FRAME + 8, duration: 48, maxR: 1100, thickness: 7 },
  ];

  // K.O. text — appears at impact, scales HUGE
  const koScale = interpolate(
    frame,
    [IMPACT_FRAME, IMPACT_FRAME + 4, IMPACT_FRAME + 10, 80],
    [0.2, 1.3, 1.0, 1.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const koOpacity = interpolate(
    frame,
    [IMPACT_FRAME, IMPACT_FRAME + 2, 78, 90],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  // K.O. text wobbles slightly for energy
  const koWobble = Math.sin(frame * 0.4) * 1.5;

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.background }}>
      <AbsoluteFill
        style={{ transform: `translate(${shakeX}px, ${shakeY}px)` }}
      >
        <Shot
          zoom={zoom}
          focusX={impactWorldX - 30}
          focusY={groundY - 240}
          viewWidth={width}
          viewHeight={height}
          rotate={tilt}
        >
          {/* Hero's shadow grows from tiny (airborne) to full (landed) */}
          <Ground
            y={groundY}
            shadowX={heroX}
            shadowWidth={interpolate(
              frame,
              [0, IMPACT_FRAME],
              [140, 320],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            )}
          />
          {/* Enemy shadow disappears once he's airborne */}
          {frame < IMPACT_FRAME + 4 && (
            <Ground y={groundY} shadowX={enemyStartX} shadowWidth={300} />
          )}

          {/* Descent motion lines (frames 0-12) */}
          {frame < IMPACT_FRAME && (
            <>
              <div
                style={{
                  position: "absolute",
                  left: heroX - 60,
                  top: heroY - 280,
                  width: 6,
                  height: 240,
                  background:
                    "linear-gradient(to bottom, transparent 0%, rgba(30,30,30,0.65) 100%)",
                  opacity: 0.85,
                  filter: "blur(2px)",
                  transform: `rotate(${heroRotate * 0.5}deg)`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: heroX + 30,
                  top: heroY - 250,
                  width: 5,
                  height: 200,
                  background:
                    "linear-gradient(to bottom, transparent 0%, rgba(30,30,30,0.55) 100%)",
                  opacity: 0.7,
                  filter: "blur(2px)",
                  transform: `rotate(${heroRotate * 0.5}deg)`,
                }}
              />
            </>
          )}

          <Stickman
            x={heroX}
            y={heroY}
            scale={3.3}
            facing="right"
            pose={heroPose}
            color={PALETTE.hero}
            strokeWidth={9}
            rotate={heroRotate}
          />

          {/* Enemy: render only while he's still in/near frame */}
          {enemyX < width + 200 && (
            <Stickman
              x={enemyX}
              y={enemyY}
              scale={3.0}
              facing="left"
              pose={enemyPose}
              color={PALETTE.enemy}
              strokeWidth={7}
              rotate={enemyRotate}
            />
          )}

          {/* Shockwave rings */}
          {ringParams.map((r, i) => {
            const t = interpolate(
              frame,
              [r.startFrame, r.startFrame + r.duration],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            if (t <= 0 || t >= 1) return null;
            const radius = r.maxR * t;
            const ringOpacity = interpolate(t, [0, 0.2, 1], [0.95, 0.85, 0]);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: impactWorldX,
                  top: impactWorldY,
                  width: radius * 2,
                  height: radius * 2,
                  borderRadius: "50%",
                  border: `${r.thickness}px solid ${PALETTE.accentRed}`,
                  transform: "translate(-50%, -50%)",
                  opacity: ringOpacity,
                }}
              />
            );
          })}

          {/* Massive radial burst at impact */}
          <div
            style={{
              position: "absolute",
              left: impactWorldX,
              top: impactWorldY,
              width: interpolate(
                frame,
                [IMPACT_FRAME, IMPACT_FRAME + 14],
                [60, 520],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              ),
              height: interpolate(
                frame,
                [IMPACT_FRAME, IMPACT_FRAME + 14],
                [60, 520],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              ),
              borderRadius: "50%",
              background: `radial-gradient(circle, ${PALETTE.accentRed} 0%, rgba(226,48,48,0.7) 30%, transparent 70%)`,
              transform: "translate(-50%, -50%)",
              opacity: interpolate(
                frame,
                [IMPACT_FRAME, IMPACT_FRAME + 2, IMPACT_FRAME + 16],
                [0.95, 1, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              ),
              mixBlendMode: "multiply",
            }}
          />

          {/* Long radial impact lines (12-point starburst) */}
          <div
            style={{
              position: "absolute",
              left: impactWorldX,
              top: impactWorldY,
              width: 4,
              height: 4,
              transform: `translate(-50%, -50%) scale(${interpolate(
                frame,
                [IMPACT_FRAME, IMPACT_FRAME + 12],
                [0.4, 1.8],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              )})`,
              opacity: interpolate(
                frame,
                [IMPACT_FRAME, IMPACT_FRAME + 2, IMPACT_FRAME + 14],
                [0, 1, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              ),
            }}
          >
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(
              (deg, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: 380,
                    height: 10,
                    background: PALETTE.accentRed,
                    transformOrigin: "0 50%",
                    transform: `rotate(${deg}deg)`,
                    borderRadius: 5,
                  }}
                />
              ),
            )}
          </div>
        </Shot>

        {/* "K.O." — massive screen-space text */}
        <div
          style={{
            position: "absolute",
            left: width / 2,
            top: height / 2,
            transform: `translate(-50%, -50%) scale(${koScale}) rotate(${-4 + koWobble}deg)`,
            opacity: koOpacity,
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Pretendard', 'Black Han Sans', 'Noto Sans KR', sans-serif",
            fontSize: 380,
            fontWeight: 900,
            color: PALETTE.accentRed,
            WebkitTextStroke: "12px #0a0a0a",
            letterSpacing: "0.04em",
            zIndex: 6,
            textShadow: "16px 16px 0 rgba(10,10,10,0.25)",
            whiteSpace: "nowrap",
          }}
        >
          K.O.
        </div>
      </AbsoluteFill>

      {/* Red wash overlay */}
      <AbsoluteFill
        style={{
          backgroundColor: PALETTE.accentRed,
          opacity: redWashOpacity,
          pointerEvents: "none",
          mixBlendMode: "multiply",
          zIndex: 9,
        }}
      />

      {/* White flash — sits on top of everything */}
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
