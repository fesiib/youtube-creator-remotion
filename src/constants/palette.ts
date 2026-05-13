// Project palette. Base is monochrome (white bg + dark ink), with a small set
// of reserved accent colors used ONLY at impact moments (technique flashes,
// explosions, K.O. hits) to create contrast against the b&w base.
export const PALETTE = {
  // Base
  background: "#ffffff",

  // Characters — distinct ink weights make the two readable at a glance
  hero: "#0a0a0a", // near-black: our protagonist
  heroDistant: "rgba(10,10,10,0.4)", // hero seen in the background of a close-up
  enemy: "#9c9c9c", // medium gray: the opponent
  enemyDistant: "rgba(156,156,156,0.55)",

  // Environment
  groundLine: "rgba(0,0,0,0.28)", // horizon line
  groundFloor: "rgba(0,0,0,0.04)", // subtle floor gradient
  characterShadow: "rgba(0,0,0,0.22)", // soft shadow under the character
  vignetteEdge: "rgba(0,0,0,0.16)", // faint vignette on a light bg

  // Reserved accents — use sparingly, only at impact beats
  accentRed: "#e23030", // K.O. / blood / final hit
  accentOrange: "#f08020", // explosion / fire
  accentYellow: "#f5d030", // energy / charge-up
} as const;
