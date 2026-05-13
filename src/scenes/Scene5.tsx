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
  SLOWMO_AIRBORNE_POSE,
} from "../components/Stickman";
import { Ground } from "../components/Ground";
import { Shot, Vignette } from "../components/Shot";
import { PALETTE } from "../constants/palette";

// Scene 5 — "슬로우모션" (frames 300-360 of master, 60 frames / 2s)
//
// Time freezes. Hero is suspended in the air, fist cocked high overhead,
// ready to bring it down on the enemy. Background acquires a soft red
// gradient that pulses like a heartbeat. "끝낸다." subtitle fades in late.
//
// Two cuts to keep composition from going static:
//   Cut A (0-32): Wide — hero airborne high above, enemy on the ground.
//   Cut B (32-60): Tight push-in on hero with subtitle.
export const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const groundY = height / 2 + 220;
  const heroX = width * 0.52;
  const heroAirY = groundY - 460;
  const enemyX = width * 0.76;

  // Heartbeat-like pulse for the red gradient (0..1, period ~40 frames)
  const pulse = Math.sin(frame * 0.16) * 0.5 + 0.5;
  const redIntensity = 0.10 + pulse * 0.10;

  // Hero drifts almost imperceptibly (slow-mo float)
  const driftX = Math.sin(frame * 0.08) * 4;
  const driftY = Math.sin(frame * 0.08 + 1) * 3;

  // Hero tilts very slowly across the scene
  const heroRotate = interpolate(frame, [0, 60], [-6, 4]);

  // Enemy looks up at the descending threat — slight back-lean of torso
  const enemyPose = { ...FIGHTING_STANCE, torsoLean: -10 };

  // Subtitle fades in late and lingers
  const textOpacity = interpolate(frame, [32, 44, 60], [0, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const isCutA = frame < 32;

  // Camera differs per cut
  const cameraZoom = isCutA
    ? interpolate(frame, [0, 32], [1.15, 1.25])
    : interpolate(frame, [32, 60], [1.55, 1.7]);
  const cameraFocusX = isCutA ? width * 0.55 : heroX;
  const cameraFocusY = isCutA ? groundY - 250 : heroAirY + 60;
  const cameraRotate = isCutA ? 0 : -3;

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.background }}>
      {/* Red gradient overlay — emanates from the hero's position, pulses */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 80% 60% at ${heroX}px ${heroAirY + 60}px, rgba(226,48,48,${redIntensity * 1.6}) 0%, rgba(226,48,48,${redIntensity * 0.7}) 35%, transparent 75%)`,
          pointerEvents: "none",
        }}
      />

      <Shot
        zoom={cameraZoom}
        focusX={cameraFocusX}
        focusY={cameraFocusY}
        viewWidth={width}
        viewHeight={height}
        rotate={cameraRotate}
      >
        {/* Enemy's shadow only — hero is airborne but cast a small soft one */}
        <Ground y={groundY} shadowX={enemyX} shadowWidth={300} />
        {/* Hero's faint floor shadow, small because he's high up */}
        <Ground y={groundY} shadowX={heroX} shadowWidth={140} />

        {/* Suspended atmospheric particles — tiny dust dots that barely move */}
        {[
          { x: 0.35, y: 0.4, s: 6 },
          { x: 0.45, y: 0.28, s: 4 },
          { x: 0.62, y: 0.35, s: 5 },
          { x: 0.7, y: 0.22, s: 4 },
          { x: 0.28, y: 0.55, s: 5 },
          { x: 0.58, y: 0.5, s: 4 },
          { x: 0.75, y: 0.48, s: 6 },
          { x: 0.4, y: 0.65, s: 4 },
        ].map((p, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: width * p.x + Math.sin((frame + i * 9) * 0.04) * 6,
              top: height * p.y + Math.sin((frame + i * 13) * 0.05) * 4,
              width: p.s,
              height: p.s,
              borderRadius: "50%",
              background: "rgba(60,60,60,0.45)",
              filter: "blur(1px)",
            }}
          />
        ))}

        <Stickman
          x={heroX + driftX}
          y={heroAirY + driftY}
          scale={3.2}
          facing="right"
          pose={SLOWMO_AIRBORNE_POSE}
          color={PALETTE.hero}
          strokeWidth={8}
          rotate={heroRotate}
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
      </Shot>

      {/* "끝낸다." — cinematic subtitle, low and serious */}
      <div
        style={{
          position: "absolute",
          bottom: 240,
          width: "100%",
          textAlign: "center",
          color: "#1a1a1a",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Pretendard', 'Noto Sans KR', sans-serif",
          fontSize: 78,
          fontWeight: 700,
          letterSpacing: "0.1em",
          opacity: textOpacity,
          zIndex: 5,
          textShadow: "0 2px 12px rgba(255,255,255,0.8)",
        }}
      >
        끝낸다.
      </div>

      <Vignette intensity={0.28} />
    </AbsoluteFill>
  );
};
