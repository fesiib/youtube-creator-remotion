import React from "react";
import { PALETTE } from "../constants/palette";

type GroundProps = {
  // Y coordinate of the horizon line in pixels
  y: number;
  // 0..1, overall opacity
  opacity?: number;
  // If provided, draw a soft floor shadow under the character at this X
  shadowX?: number;
  // Width of the shadow ellipse (defaults to a reasonable character width)
  shadowWidth?: number;
};

// Atmospheric ground for a LIGHT background: subtle dark horizon line + faint
// floor shading + soft elliptical drop shadow under the subject. Designed to
// sit underneath subjects without competing with them visually.
export const Ground: React.FC<GroundProps> = ({
  y,
  opacity = 1,
  shadowX,
  shadowWidth = 360,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        opacity,
        pointerEvents: "none",
      }}
    >
      {/* Soft character shadow on the floor */}
      {shadowX !== undefined && (
        <div
          style={{
            position: "absolute",
            left: shadowX - shadowWidth / 2,
            top: y - 18,
            width: shadowWidth,
            height: 80,
            background: `radial-gradient(ellipse at center, ${PALETTE.characterShadow} 0%, rgba(0,0,0,0.08) 40%, transparent 75%)`,
            filter: "blur(4px)",
          }}
        />
      )}

      {/* Horizon line — fades at the edges */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: y,
          height: 2,
          background: `linear-gradient(to right, transparent 0%, ${PALETTE.groundLine} 25%, ${PALETTE.groundLine} 75%, transparent 100%)`,
        }}
      />

      {/* Floor — a very subtle shading beneath the horizon line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: y + 2,
          height: 700,
          background: `linear-gradient(to bottom, ${PALETTE.groundFloor} 0%, transparent 100%)`,
        }}
      />
    </div>
  );
};
