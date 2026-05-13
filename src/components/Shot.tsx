import React from "react";
import { AbsoluteFill } from "remotion";

type ShotProps = {
  // Camera zoom factor (1 = normal, >1 = punched in)
  zoom: number;
  // World-space coordinates of the point the camera focuses on
  focusX: number;
  focusY: number;
  // Viewport size (canvas width/height) — used to center the focus point
  viewWidth: number;
  viewHeight: number;
  // Optional roll (camera tilt) in degrees
  rotate?: number;
  children: React.ReactNode;
};

// Simulates a virtual camera by transforming the entire scene world:
// the focus point is brought to the viewport center, then everything
// is scaled by `zoom`. Use one <Shot/> per cut to change framing.
export const Shot: React.FC<ShotProps> = ({
  zoom,
  focusX,
  focusY,
  viewWidth,
  viewHeight,
  rotate = 0,
  children,
}) => {
  const tx = viewWidth / 2 - focusX;
  const ty = viewHeight / 2 - focusY;
  return (
    <AbsoluteFill
      style={{
        transform: `rotate(${rotate}deg) scale(${zoom}) translate(${tx}px, ${ty}px)`,
        transformOrigin: "center center",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// A reusable vignette layer — sits above the scene contents but below text.
// Tuned for a LIGHT background: subtle dark edge falloff that adds focus
// without competing with the action.
export const Vignette: React.FC<{ intensity?: number }> = ({
  intensity = 0.16,
}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,${intensity}) 100%)`,
      pointerEvents: "none",
      zIndex: 3,
    }}
  />
);
