import React from "react";

export type StickmanPose = {
  // angles in degrees, 0 = pointing straight down from joint
  leftShoulder: number;
  leftElbow: number;
  rightShoulder: number;
  rightElbow: number;
  leftHip: number;
  leftKnee: number;
  rightHip: number;
  rightKnee: number;
  // torso lean angle in degrees (0 = upright, positive = lean right)
  torsoLean: number;
};

// Angle convention: 0° = straight down from joint.
//   positive angle → bends toward screen-right (before facing flip)
//   negative angle → bends toward screen-left (before facing flip)
// Arms hang from shoulders, legs hang from hips. A small outward V looks natural.
export const STANDING_POSE: StickmanPose = {
  leftShoulder: -10,
  leftElbow: 0,
  rightShoulder: 10,
  rightElbow: 0,
  leftHip: -7,
  leftKnee: 0,
  rightHip: 7,
  rightKnee: 0,
  torsoLean: 0,
};

// Boxing-style guard: clear forward lean, lead arm extended with fist raised
// to face level, rear arm tucked across body with fist at chin, legs in a
// staggered stance (front leg forward, back leg bent for weight).
// Body-relative: positive angles = forward when facing="right".
//
// Angle convention reminder: 0° = straight down from joint.
// For arms — shoulder angle is the upper-arm direction from the shoulder.
//   ~80° puts upper arm nearly horizontal forward.
//   Then elbow bend (positive) folds the forearm upward toward the face.
export const FIGHTING_STANCE: StickmanPose = {
  // Pronounced forward lean — head is clearly ahead of the feet, so the
  // facing direction is unambiguous.
  torsoLean: 18,

  // Lead arm: upper arm extended forward (~horizontal), forearm folded up
  // so the lead fist sits at face level. Reads as a classic jab guard.
  leftShoulder: 80,
  leftElbow: 80,

  // Rear arm: shorter reach, forearm folded across the body so the rear
  // fist tucks near the chin (cross-body Mexican guard).
  rightShoulder: 30,
  rightElbow: 130,

  // Back leg (the "left" leg in pose space): planted behind, knee bent.
  leftHip: -28,
  leftKnee: 22,
  // Front leg (the "right" leg): forward, slight bend.
  rightHip: 28,
  rightKnee: 10,
};

// Coiled — body leans slightly back, rear arm pulled way back to load a strike.
// Use as the moment-before-charging.
export const WIND_UP_POSE: StickmanPose = {
  torsoLean: -8,
  // Lead arm — held up as a guard
  leftShoulder: 70,
  leftElbow: 100,
  // Rear arm — pulled WAY back, ready to snap forward
  rightShoulder: -85,
  rightElbow: 40,
  // Back leg — deeply bent, loaded like a spring
  leftHip: -32,
  leftKnee: 45,
  // Front leg — planted, only slightly bent
  rightHip: 22,
  rightKnee: 8,
};

// Mid-charge — body committed forward, lead arm halfway through its punch
// trajectory, rear arm trailing.
export const CHARGE_POSE: StickmanPose = {
  torsoLean: 28,
  leftShoulder: 75,
  leftElbow: 40,
  rightShoulder: -45,
  rightElbow: 10,
  // Back leg pushing off (trailing behind)
  leftHip: -45,
  leftKnee: 18,
  // Front leg striding forward, mostly extended
  rightHip: 35,
  rightKnee: 0,
};

// Full extension — the punch has fully landed. Lead arm horizontal forward
// with the forearm straight, body leaning into the strike.
export const PUNCH_EXTENDED_POSE: StickmanPose = {
  torsoLean: 24,
  // LEAD ARM FULLY EXTENDED FORWARD
  leftShoulder: 90,
  leftElbow: 0,
  // Rear arm pulled back tight against the body
  rightShoulder: -30,
  rightElbow: 90,
  // Back leg trailing, mostly extended (pushed off)
  leftHip: -32,
  leftKnee: 14,
  // Front leg planted hard, fully extended for power
  rightHip: 25,
  rightKnee: 0,
};

// Recoil — body bent backward away from the impact, arms flailing, one
// leg lifted off the ground. Designed so that with facing="left" the head
// is whipped to the screen-right (away from a blow coming from the left).
export const RECOIL_POSE: StickmanPose = {
  torsoLean: -32,
  // Back-side arm thrown backward (away from the impact)
  leftShoulder: -100,
  leftElbow: 30,
  // Front-side arm thrown forward/up (flailing toward attacker)
  rightShoulder: 90,
  rightElbow: -20,
  // Back leg lifted (knee comes up forward, foot off the ground)
  leftHip: 30,
  leftKnee: -25,
  // Front leg planted, deeply bent (catching balance)
  rightHip: 8,
  rightKnee: 35,
};

// Front kick — support leg planted, kicking leg raised high forward.
// Body leans back slightly for balance.
export const FRONT_KICK_POSE: StickmanPose = {
  torsoLean: -10,
  // Lead arm: pulled in as a guard
  leftShoulder: 50,
  leftElbow: 100,
  // Rear arm: extended back/out for balance
  rightShoulder: -70,
  rightElbow: 40,
  // Support leg (back leg in fighting-stance terms): planted, bent
  leftHip: -10,
  leftKnee: 30,
  // Kicking leg (front leg): raised high forward, almost extended
  rightHip: 120,
  rightKnee: -30,
};

// Double-up block — both arms raised forward, fists at face level, forming
// a guard wall. Body upright, weight even on both legs.
export const BLOCK_POSE: StickmanPose = {
  torsoLean: 5,
  // Lead arm: forearm up, fist at face level (top of the wall)
  leftShoulder: 70,
  leftElbow: 90,
  // Rear arm: similar position but slightly lower (bottom of the wall)
  rightShoulder: 50,
  rightElbow: 100,
  // Wider stance for stability
  leftHip: -22,
  leftKnee: 18,
  rightHip: 18,
  rightKnee: 18,
};

// Airborne wind-up for the slow-mo decisive strike. Hero hangs in the air
// with one fist raised high over the head (overhand haymaker cock) and the
// lead arm extended forward like an aim. Legs slightly tucked for flight.
export const SLOWMO_AIRBORNE_POSE: StickmanPose = {
  torsoLean: 8,
  // Lead arm — extended forward (aiming at the target below)
  leftShoulder: 100,
  leftElbow: 0,
  // Rear arm — fist raised HIGH over the head, slightly cocked back
  rightShoulder: 175,
  rightElbow: 20,
  // Back leg trailing behind, slight bend (in flight)
  leftHip: -22,
  leftKnee: 30,
  // Front leg tucked up forward
  rightHip: 35,
  rightKnee: 45,
};

// Follow-through after the K.O. strike — arm fully extended down/forward
// in the direction of the strike, body settled. Hero's final stance.
export const KO_FOLLOWTHROUGH_POSE: StickmanPose = {
  torsoLean: 14,
  // Lead arm extended forward and slightly down (finishing the strike)
  leftShoulder: 105,
  leftElbow: -5,
  // Rear arm hanging at the side
  rightShoulder: -8,
  rightElbow: 5,
  // Legs in solid wide stance — both feet planted
  leftHip: -25,
  leftKnee: 12,
  rightHip: 22,
  rightKnee: 5,
};

// ============================ SWORD POSES (Episode 2) ============================
// All sword-wielding poses assume a `weapon` is attached to the lead hand,
// so the sword extends in the direction of the LEAD FOREARM. Design the
// forearm angle to point where the sword should go.

// Basic sword stance — sword held forward and slightly down (low guard).
export const SWORD_STANCE: StickmanPose = {
  torsoLean: 14,
  // Lead arm: forearm angle ~70 = forward-horizontal slightly down. Sword extends in that direction.
  leftShoulder: 60,
  leftElbow: 10,
  // Rear arm: hanging loose by the side for balance
  rightShoulder: -15,
  rightElbow: 10,
  // Solid stance
  leftHip: -26,
  leftKnee: 14,
  rightHip: 24,
  rightKnee: 6,
};

// Sword raised high overhead, ready to strike down. Forearm angle = 180 (straight up).
export const SWORD_HIGH_GUARD: StickmanPose = {
  torsoLean: 10,
  // Lead arm: shoulder 110 + elbow 70 = forearm at 180 (straight up). Sword extends straight up.
  leftShoulder: 110,
  leftElbow: 70,
  // Rear arm: extended forward for aim/balance
  rightShoulder: 70,
  rightElbow: 20,
  // Wide planted stance
  leftHip: -25,
  leftKnee: 12,
  rightHip: 25,
  rightKnee: 4,
};

// Mid-slash horizontal — sword swinging sideways at upper-body height.
// Forearm angle ~95 (horizontal forward, slightly down). Sword sweeps across.
export const SWORD_HORIZONTAL_SLASH: StickmanPose = {
  torsoLean: 18,
  leftShoulder: 85,
  leftElbow: 10,
  // Rear arm thrown back from the rotation force
  rightShoulder: -55,
  rightElbow: 30,
  leftHip: -28,
  leftKnee: 14,
  rightHip: 28,
  rightKnee: 4,
};

// Defeated kneel — hero on a low stance, sword stuck point-down in front of body
// as a support. Forearm angle ~0 (straight down) so the sword goes down.
export const KNEEL_DEFEATED: StickmanPose = {
  torsoLean: 32,
  // Lead arm: shoulder 50 + elbow -50 → forearm angle = 0 (straight down). Sword sticks down.
  leftShoulder: 50,
  leftElbow: -50,
  // Rear arm: hangs back, low
  rightShoulder: -20,
  rightElbow: 10,
  // Low forward stance: both legs deeply bent, body lowered
  leftHip: -38,
  leftKnee: 40,
  rightHip: 34,
  rightKnee: 30,
};

// Hero standing upright, looking up, sword by side. The moment of decision.
export const RISING_DETERMINED: StickmanPose = {
  // Slight back-lean — head tilted up
  torsoLean: -6,
  // Lead arm hangs down — sword at the side. Forearm angle = 0 (down).
  leftShoulder: 5,
  leftElbow: -5,
  // Rear arm relaxed
  rightShoulder: -10,
  rightElbow: 5,
  // Planted, slightly wide stance
  leftHip: -14,
  leftKnee: 4,
  rightHip: 14,
  rightKnee: 2,
};

// Aerial slash downward — body angled forward, lead arm + sword pointed down.
// Forearm angle ~10 (mostly straight down, slight forward).
export const AERIAL_SLASH_DOWN: StickmanPose = {
  torsoLean: 28,
  // Lead arm pointing down-forward: shoulder 70 + elbow -60 → forearm 10.
  leftShoulder: 70,
  leftElbow: -60,
  // Rear arm thrown back/up for momentum
  rightShoulder: -120,
  rightElbow: 40,
  // Back leg trailing way back, knee bent
  leftHip: -55,
  leftKnee: 25,
  // Front leg tucked forward
  rightHip: 25,
  rightKnee: 55,
};

// Aerial horizontal slash — body twisted in mid-pivot, sword sweeping across.
// Forearm angle ~95 (horizontal forward).
export const AERIAL_SLASH_HORIZONTAL: StickmanPose = {
  torsoLean: 5,
  // Lead arm: shoulder 90 + elbow 5 = forearm 95.
  leftShoulder: 90,
  leftElbow: 5,
  // Rear arm thrown back from twist
  rightShoulder: -85,
  rightElbow: 50,
  // Legs tucked / scissor-kicked from the pivot
  leftHip: -40,
  leftKnee: 60,
  rightHip: 50,
  rightKnee: 30,
};

// Finishing pose — hero just landed after the final slash, sword extended out.
// Forearm angle ~90 (horizontal forward); sword extends forward.
export const SWORD_FINISHER: StickmanPose = {
  torsoLean: 18,
  leftShoulder: 90,
  leftElbow: 0,
  // Rear arm settled back at the side
  rightShoulder: -25,
  rightElbow: 5,
  // Wide solid stance
  leftHip: -28,
  leftKnee: 10,
  rightHip: 26,
  rightKnee: 4,
};

// Matrix-style dodge — torso bends WAY backward at the waist, head pulled
// far back away from an incoming strike. Back leg deeply bent to absorb.
export const DODGE_BACK_POSE: StickmanPose = {
  torsoLean: -38,
  // Lead arm comes up to balance
  leftShoulder: 70,
  leftElbow: 50,
  // Rear arm thrown out for balance
  rightShoulder: -55,
  rightElbow: 50,
  // Front leg planted, slight bend
  leftHip: 15,
  leftKnee: 5,
  // Back leg deeply bent (absorbing the lean)
  rightHip: -20,
  rightKnee: 35,
};

// Linear-interpolate every angle in a pose. Used to animate between poses
// frame-by-frame (e.g., enemy going from FIGHTING_STANCE → RECOIL_POSE).
export const interpolatePose = (
  t: number,
  from: StickmanPose,
  to: StickmanPose,
): StickmanPose => {
  const lerp = (a: number, b: number) => a + (b - a) * t;
  return {
    torsoLean: lerp(from.torsoLean, to.torsoLean),
    leftShoulder: lerp(from.leftShoulder, to.leftShoulder),
    leftElbow: lerp(from.leftElbow, to.leftElbow),
    rightShoulder: lerp(from.rightShoulder, to.rightShoulder),
    rightElbow: lerp(from.rightElbow, to.rightElbow),
    leftHip: lerp(from.leftHip, to.leftHip),
    leftKnee: lerp(from.leftKnee, to.leftKnee),
    rightHip: lerp(from.rightHip, to.rightHip),
    rightKnee: lerp(from.rightKnee, to.rightKnee),
  };
};

type StickmanProps = {
  x: number;
  y: number;
  scale?: number;
  facing?: "left" | "right";
  pose?: StickmanPose;
  color?: string;
  strokeWidth?: number;
  opacity?: number;
  // Whole-body rotation in degrees, pivoting at the feet anchor.
  // Use for airborne / mid-flip poses.
  rotate?: number;
  // Optional weapon attached to the LEAD hand. Extends in the direction of
  // the lead forearm by `length` body units (gets scaled with the character).
  weapon?: { length: number; color?: string; thickness?: number };
};

// Joint lengths (in SVG units before scale)
const HEAD_RADIUS = 14;
const TORSO_LENGTH = 50;
const UPPER_ARM = 24;
const LOWER_ARM = 24;
const UPPER_LEG = 28;
const LOWER_LEG = 28;

const toRad = (deg: number) => (deg * Math.PI) / 180;

// Given a start point, an angle (deg, 0=down), and length, get end point.
const project = (
  x: number,
  y: number,
  angleDeg: number,
  length: number,
): [number, number] => {
  const a = toRad(angleDeg);
  return [x + Math.sin(a) * length, y + Math.cos(a) * length];
};

export const Stickman: React.FC<StickmanProps> = ({
  x,
  y,
  scale = 1,
  facing = "right",
  pose = STANDING_POSE,
  color = "#ffffff",
  strokeWidth = 6,
  opacity = 1,
  rotate = 0,
  weapon,
}) => {
  // Origin is at the stickman's feet center. Build skeleton upward.
  const flip = facing === "left" ? -1 : 1;

  // Pelvis position (above feet center by leg length)
  const pelvisX = 0;
  const pelvisY = -(UPPER_LEG + LOWER_LEG);

  // Torso lean is body-relative — flip with facing so "lean forward"
  // means screen-right when facing right, screen-left when facing left.
  const torsoLeanScreen = pose.torsoLean * flip;

  // Shoulder/neck position (top of torso)
  const torsoTopX =
    pelvisX + Math.sin(toRad(torsoLeanScreen)) * TORSO_LENGTH;
  const torsoTopY =
    pelvisY - Math.cos(toRad(torsoLeanScreen)) * TORSO_LENGTH;

  // Head center sits above torso top, continuing the lean
  const headX =
    torsoTopX + Math.sin(toRad(torsoLeanScreen)) * (HEAD_RADIUS + 4);
  const headY =
    torsoTopY - Math.cos(toRad(torsoLeanScreen)) * (HEAD_RADIUS + 4);

  // Arms hang DOWN from shoulders; angle 0 = straight down. Apply facing flip.
  const [lElbowX, lElbowY] = project(
    torsoTopX,
    torsoTopY,
    pose.leftShoulder * flip,
    UPPER_ARM,
  );
  const [lHandX, lHandY] = project(
    lElbowX,
    lElbowY,
    (pose.leftShoulder + pose.leftElbow) * flip,
    LOWER_ARM,
  );

  const [rElbowX, rElbowY] = project(
    torsoTopX,
    torsoTopY,
    pose.rightShoulder * flip,
    UPPER_ARM,
  );
  const [rHandX, rHandY] = project(
    rElbowX,
    rElbowY,
    (pose.rightShoulder + pose.rightElbow) * flip,
    LOWER_ARM,
  );

  // Legs (angles measured from pelvis pointing down)
  const [lKneeX, lKneeY] = project(
    pelvisX,
    pelvisY,
    pose.leftHip * flip,
    UPPER_LEG,
  );
  const [lFootX, lFootY] = project(
    lKneeX,
    lKneeY,
    (pose.leftHip + pose.leftKnee) * flip,
    LOWER_LEG,
  );

  const [rKneeX, rKneeY] = project(
    pelvisX,
    pelvisY,
    pose.rightHip * flip,
    UPPER_LEG,
  );
  const [rFootX, rFootY] = project(
    rKneeX,
    rKneeY,
    (pose.rightHip + pose.rightKnee) * flip,
    LOWER_LEG,
  );

  // Compute viewBox bounds. Top / left / right get a small padding for the
  // stroke caps; the BOTTOM aligns with the visual foot sole (joint endpoint
  // + stroke half-width), so the lowest foot always sits exactly at the
  // anchor y — no floating regardless of how the legs are bent.
  const allPoints = [
    [headX, headY - HEAD_RADIUS],
    [headX, headY + HEAD_RADIUS],
    [lHandX, lHandY],
    [rHandX, rHandY],
    [lFootX, lFootY],
    [rFootX, rFootY],
  ];
  const xs = allPoints.map((p) => p[0]);
  const ys = allPoints.map((p) => p[1]);
  const padding = 20;
  const minX = Math.min(...xs) - padding;
  const minY = Math.min(...ys) - padding;
  const maxX = Math.max(...xs) + padding;
  const maxY = Math.max(...ys) + strokeWidth / 2;
  const width = maxX - minX;
  const height = maxY - minY;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -100%) rotate(${rotate}deg) scale(${scale})`,
        transformOrigin: "center bottom",
        opacity,
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`${minX} ${minY} ${width} ${height}`}
        style={{ overflow: "visible" }}
      >
        <g
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          {/* Head */}
          <circle
            cx={headX}
            cy={headY}
            r={HEAD_RADIUS}
            fill={color}
            stroke={color}
          />
          {/* Torso */}
          <line
            x1={torsoTopX}
            y1={torsoTopY}
            x2={pelvisX}
            y2={pelvisY}
          />
          {/* Left arm */}
          <line
            x1={torsoTopX}
            y1={torsoTopY}
            x2={lElbowX}
            y2={lElbowY}
          />
          <line x1={lElbowX} y1={lElbowY} x2={lHandX} y2={lHandY} />
          {/* Right arm */}
          <line
            x1={torsoTopX}
            y1={torsoTopY}
            x2={rElbowX}
            y2={rElbowY}
          />
          <line x1={rElbowX} y1={rElbowY} x2={rHandX} y2={rHandY} />
          {/* Left leg */}
          <line x1={pelvisX} y1={pelvisY} x2={lKneeX} y2={lKneeY} />
          <line x1={lKneeX} y1={lKneeY} x2={lFootX} y2={lFootY} />
          {/* Right leg */}
          <line x1={pelvisX} y1={pelvisY} x2={rKneeX} y2={rKneeY} />
          <line x1={rKneeX} y1={rKneeY} x2={rFootX} y2={rFootY} />

          {/* Optional weapon — extends from the lead (left) hand in the
              direction of the lead forearm by `weapon.length` units. */}
          {weapon &&
            (() => {
              const forearmAngleDeg =
                (pose.leftShoulder + pose.leftElbow) * flip;
              const tipX =
                lHandX + Math.sin(toRad(forearmAngleDeg)) * weapon.length;
              const tipY =
                lHandY + Math.cos(toRad(forearmAngleDeg)) * weapon.length;
              return (
                <line
                  x1={lHandX}
                  y1={lHandY}
                  x2={tipX}
                  y2={tipY}
                  stroke={weapon.color || color}
                  strokeWidth={strokeWidth * (weapon.thickness ?? 0.85)}
                  strokeLinecap="round"
                />
              );
            })()}
        </g>
      </svg>
    </div>
  );
};

// Compute the screen-world position of the sword tip for a given Stickman
// configuration. Useful for placing slash trails and impact effects at the
// sword tip without duplicating the rendering math.
export const getSwordTip = (
  x: number,
  y: number,
  scale: number,
  facing: "left" | "right",
  pose: StickmanPose,
  weaponLength: number,
): { x: number; y: number } => {
  const flip = facing === "left" ? -1 : 1;
  const torsoLeanScreen = pose.torsoLean * flip;
  const pelvisY = -(UPPER_LEG + LOWER_LEG);
  const torsoTopX = Math.sin(toRad(torsoLeanScreen)) * TORSO_LENGTH;
  const torsoTopY =
    pelvisY - Math.cos(toRad(torsoLeanScreen)) * TORSO_LENGTH;
  // Lead elbow + hand
  const lEx = torsoTopX + Math.sin(toRad(pose.leftShoulder * flip)) * UPPER_ARM;
  const lEy = torsoTopY + Math.cos(toRad(pose.leftShoulder * flip)) * UPPER_ARM;
  const forearmAngleDeg = (pose.leftShoulder + pose.leftElbow) * flip;
  const lHx = lEx + Math.sin(toRad(forearmAngleDeg)) * LOWER_ARM;
  const lHy = lEy + Math.cos(toRad(forearmAngleDeg)) * LOWER_ARM;
  const tipBodyX = lHx + Math.sin(toRad(forearmAngleDeg)) * weaponLength;
  const tipBodyY = lHy + Math.cos(toRad(forearmAngleDeg)) * weaponLength;
  // Body coords → world: x is the body's horizontal anchor (center of bbox
  // assumption is a small approximation), y is the foot anchor.
  return { x: x + tipBodyX * scale, y: y + tipBodyY * scale };
};
