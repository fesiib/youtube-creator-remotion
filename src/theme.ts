// Palette and type defaults for the deliberately-stiff explainer style.
// Two-color base + one warm accent. No gradients.

export const theme = {
  paper: "#F4ECDC", // off-cream
  paperShade: "#E9DDC4", // for tiny shadow / depth on the cream
  ink: "#141414",
  inkSoft: "#2A2A2A",
  accent: "#E94B2B", // warm red — used for emphasis labels and the HCI stamp
  accentInk: "#7A1E0B",
} as const;

export const fontStack =
  '"Helvetica Neue", Helvetica, "Arial Black", Arial, sans-serif';
