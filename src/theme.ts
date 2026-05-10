export const COLORS = {
  bg: "#0A0E1A",
  bgSoft: "#121826",
  surface: "#1B2336",
  surfaceHi: "#27314A",
  border: "#2C3550",
  text: "#F4F6FB",
  textMuted: "#9098AE",
  accent: "#FF6F61",
  accentSoft: "#FFD4CE",
  cyan: "#5CC8E0",
  green: "#7AD79B",
  yellow: "#FFC857",
} as const;

export const FONT_FAMILY =
  '-apple-system, BlinkMacSystemFont, "Inter", "Helvetica Neue", Helvetica, Arial, sans-serif';

// Frame ranges per scene. 60s @ 30fps = 1800 frames.
export const SCENES = {
  title: { from: 0, duration: 120 },
  definition: { from: 120, duration: 240 },
  exampleIntro: { from: 360, duration: 150 },
  system: { from: 510, duration: 720 },
  research: { from: 1230, duration: 390 },
  outro: { from: 1620, duration: 180 },
} as const;

export const TOTAL_FRAMES = 1800;
export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
