import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Sequence,
  Easing,
} from "remotion";

// ── Palette ────────────────────────────────────────────────────────────────────
const C = {
  coral:  "#FF6B6B",
  teal:   "#00B4D8",
  purple: "#9B5DE5",
  orange: "#FB8500",
  green:  "#06D6A0",
  blue:   "#4361EE",
  yellow: "#FFC300",
  dark:   "#1A1A2E",
  mid:    "#4A4A6A",
  light:  "#9A9ABF",
  white:  "#FFFFFF",
  bgYellow: "#FFF9E0",
  bgBlue:   "#EAF6FF",
  bgPurple: "#F5EEFF",
  bgMint:   "#EAFAF7",
  bgPeach:  "#FFF4EC",
};

// ── Animation helpers ─────────────────────────────────────────────────────────

/** Smooth ease-out — no overshoot */
const easeIn = (frame: number, start: number, dur = 20) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const fadeOutAt = (frame: number, total: number, dur = 12) =>
  interpolate(frame, [total - dur, total], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/** Continuous floating up/down */
const floatY = (frame: number, speed = 0.08, amp = 10, phase = 0) =>
  Math.sin(frame * speed + phase) * amp;

/** Subtle scale pulse */
const pulse = (frame: number, speed = 0.1, amp = 0.04) =>
  1 + Math.sin(frame * speed) * amp;

const spin = (frame: number, speed = 2) => (frame * speed) % 360;

// ── Scene transition helpers ───────────────────────────────────────────────────

/** Slide-left exit: slides off to the left */
const txSlideLeftExit = (frame: number, total: number, dur = 25): React.CSSProperties => {
  const p = interpolate(frame, [total - dur, total], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  return { opacity: 1 - p, transform: `translateX(${p * -1280}px)` };
};

/** Slide-right entry: slides in from the right */
const txSlideRightEntry = (frame: number, dur = 25): React.CSSProperties => {
  const p = easeIn(frame, 0, dur);
  return { opacity: p, transform: `translateX(${(1 - p) * 1280}px)` };
};

/** Zoom-in exit: zooms forward and fades (diving into topic) */
const txZoomInExit = (frame: number, total: number, dur = 22): React.CSSProperties => {
  const p = interpolate(frame, [total - dur, total], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  return { opacity: 1 - p, transform: `scale(${1 + p * 0.1})` };
};

/** Zoom-in entry: arrives slightly small then settles in */
const txZoomInEntry = (frame: number, dur = 22): React.CSSProperties => {
  const p = easeIn(frame, 0, dur);
  return { opacity: p, transform: `scale(${0.92 + p * 0.08})` };
};

/** Zoom-out exit: shrinks away (stepping back) */
const txZoomOutExit = (frame: number, total: number, dur = 22): React.CSSProperties => {
  const p = interpolate(frame, [total - dur, total], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  return { opacity: 1 - p, transform: `scale(${1 - p * 0.12})` };
};

/** Zoom-out entry: arrives oversized then settles to normal */
const txZoomOutEntry = (frame: number, dur = 22): React.CSSProperties => {
  const p = easeIn(frame, 0, dur);
  return { opacity: p, transform: `scale(${1.10 - p * 0.10})` };
};

/** Fall exit: drops off with gravity (consequences!) */
const txFallExit = (frame: number, total: number, dur = 30): React.CSSProperties => {
  const p = interpolate(frame, [total - dur, total], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });
  return {
    opacity: interpolate(p, [0.55, 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    transform: `translateY(${p * p * 240}px) rotate(${p * 2}deg)`,
  };
};

/** Drop entry: falls in from above (results hit you) */
const txDropEntry = (frame: number, dur = 25): React.CSSProperties => {
  const p = easeIn(frame, 0, dur);
  return { opacity: p, transform: `translateY(${(1 - p) * -70}px)` };
};

/** Merge entry + exit (additive transforms, multiplicative opacity) */
const txMerge = (entry: React.CSSProperties, exit: React.CSSProperties): React.CSSProperties => ({
  opacity: ((entry.opacity as number) ?? 1) * ((exit.opacity as number) ?? 1),
  transform: [entry.transform, exit.transform].filter(Boolean).join(" ") || undefined,
});

// ── Floating background blob ───────────────────────────────────────────────────

const Blob: React.FC<{
  x: number; y: number; size: number; color: string;
  frame: number; phase?: number; startFrame?: number;
}> = ({ x, y, size, color, frame, phase = 0, startFrame = 0 }) => {
  // Use (frame + startFrame) so each blob picks up mid-cycle instead of always at t=0
  const f = frame + startFrame;
  const driftX = Math.sin(f * 0.007 + phase) * 210
               + Math.sin(f * 0.015 + phase * 0.6) * 55;
  const driftY = Math.sin(f * 0.040 + phase * 1.9) * 26;
  return (
    <div style={{
      position: "absolute",
      left: x + driftX,
      top: y + driftY,
      width: size, height: size,
      borderRadius: "50%",
      background: color,
      opacity: 0.45,
      pointerEvents: "none",
    }} />
  );
};

// ── Subtitle bar ───────────────────────────────────────────────────────────────

interface SubLine { text: string; from: number }

const Sub: React.FC<{ lines: SubLine[]; frame: number; total: number }> = ({ lines, frame, total }) => {
  let cur: SubLine | null = null;
  for (const l of lines) { if (frame >= l.from) cur = l; }
  if (!cur) return null;

  const fadeIn = interpolate(frame, [cur.from, cur.from + 10], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const endFade = fadeOutAt(frame, total, 18);

  return (
    <div style={{
      position: "absolute",
      bottom: 28,
      left: "50%",
      transform: "translateX(-50%)",
      background: "rgba(15,15,25,0.80)",
      color: C.white,
      padding: "10px 32px",
      borderRadius: 10,
      fontSize: 22,
      fontWeight: 600,
      textAlign: "center",
      opacity: fadeIn * endFade,
      whiteSpace: "nowrap",
      pointerEvents: "none",
      letterSpacing: "0.2px",
    }}>
      {cur.text}
    </div>
  );
};

// ── Abstract photo illustration ────────────────────────────────────────────────

const FakePhoto: React.FC<{
  w?: number; h?: number;
  sky: string; ground: string;
  borderColor: string;
  isEdited?: boolean;
  frame?: number;
  label?: string;
}> = ({ w = 260, h = 200, sky, ground, borderColor, isEdited, frame = 0, label }) => (
  <div style={{
    width: w, height: h,
    borderRadius: 18, overflow: "hidden",
    border: `4px solid ${borderColor}`,
    position: "relative",
    boxShadow: `0 8px 28px ${borderColor}44`,
    flexShrink: 0,
  }}>
    {/* Sky */}
    <div style={{ height: "55%", background: sky, position: "relative" }}>
      <div style={{ position: "absolute", top: 16, right: 26,
        width: 34, height: 34, borderRadius: "50%",
        background: "#FFD60A", boxShadow: "0 0 12px #FFD60A99" }} />
      <div style={{ position: "absolute", top: 22, left: 22,
        width: 50, height: 18, borderRadius: 50, background: "#FFFFFF88" }} />
    </div>
    {/* Ground */}
    <div style={{ height: "45%", background: ground, position: "relative" }}>
      <div style={{ position: "absolute", bottom: 28, left: "50%",
        transform: "translateX(-50%)", width: 16, height: 16,
        borderRadius: "50%", background: "#FFB347" }} />
      <div style={{ position: "absolute", bottom: 10, left: "50%",
        transform: "translateX(-50%)", width: 3, height: 20,
        background: C.dark, borderRadius: 2 }} />
    </div>
    {/* AI overlay */}
    {isEdited && (
      <>
        <div style={{ position: "absolute", inset: 0, background: "#9B5DE522", borderRadius: 14 }} />
        <div style={{ position: "absolute", top: 10, left: 12, fontSize: 20 }}>✨</div>
        <div style={{ position: "absolute", top: 44, right: 14, fontSize: 15 }}>✦</div>
        <div style={{ position: "absolute", bottom: 34, right: 18, fontSize: 16 }}>⭐</div>
        <div style={{
          position: "absolute", top: 10, right: 10,
          background: C.purple, borderRadius: 50,
          padding: "2px 8px", fontSize: 10, fontWeight: 800,
          color: C.white, letterSpacing: "1px",
        }}>AI</div>
      </>
    )}
    {label && (
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: `${borderColor}ee`, color: C.white,
        fontSize: 13, fontWeight: 700, textAlign: "center", padding: "5px 0",
      }}>{label}</div>
    )}
  </div>
);

// ── Brain illustration (two halves) ────────────────────────────────────────────

const BrainSplit: React.FC<{ frame: number; opacity: number }> = ({ frame, opacity }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6, opacity }}>
    {/* Left half — organized */}
    <div style={{
      width: 110, height: 110,
      borderRadius: "110px 0 0 110px",
      background: `linear-gradient(135deg, ${C.teal}44, ${C.bgBlue})`,
      border: `3px solid ${C.teal}`,
      borderRight: "none",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: 6, paddingLeft: 8,
      position: "relative", overflow: "hidden",
    }}>
      {/* organized dots */}
      {[0,1,2].map(r => (
        <div key={r} style={{ display: "flex", gap: 6 }}>
          {[0,1,2].map(c => (
            <div key={c} style={{ width: 8, height: 8, borderRadius: "50%",
              background: C.teal, opacity: 0.7,
              transform: `translateY(${floatY(frame, 0.06, 2, r + c)}px)` }} />
          ))}
        </div>
      ))}
    </div>
    {/* Center crack */}
    <div style={{ width: 3, height: 120, background: C.dark, borderRadius: 2, flexShrink: 0 }} />
    {/* Right half — distorted */}
    <div style={{
      width: 110, height: 110,
      borderRadius: "0 110px 110px 0",
      background: `linear-gradient(135deg, ${C.bgPurple}, ${C.purple}44)`,
      border: `3px solid ${C.purple}`,
      borderLeft: "none",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: 4, paddingRight: 8,
      position: "relative", overflow: "hidden",
    }}>
      {/* chaotic dots */}
      {[[8,22],[30,8],[16,38],[36,28],[6,48]].map(([dx, dy], i) => (
        <div key={i} style={{
          position: "absolute",
          left: dx + Math.sin(frame * 0.08 + i) * 3,
          top: dy + Math.cos(frame * 0.1 + i) * 3,
          width: 8, height: 8, borderRadius: "50%",
          background: C.purple, opacity: 0.7,
        }} />
      ))}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SCENES
// ─────────────────────────────────────────────────────────────────────────────

// ── Scene 1: Hook (0–150f · 5s) ───────────────────────────────────────────────

const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  // Exit: zoom-in → diving into the paper topic
  const tx = txZoomInExit(frame, durationInFrames, 22);

  const leftP  = easeIn(frame, 8, 22);
  const brainP = easeIn(frame, 22, 20);
  const rightP = easeIn(frame, 36, 22);

  return (
    <AbsoluteFill style={{ background: C.bgYellow, ...tx }}>
      <Blob x={38}  y={48}  size={52} color={C.coral + "66"}  frame={frame} phase={0}   startFrame={0} />
      <Blob x={1162} y={48} size={42} color={C.teal + "66"}   frame={frame} phase={1.5} startFrame={220} />
      <Blob x={38}  y={545} size={40} color={C.purple + "55"} frame={frame} phase={3}   startFrame={440} />
      <Blob x={1170} y={565} size={48} color={C.yellow + "88"} frame={frame} phase={2}  startFrame={660} />

      {/* Spinning deco */}
      <div style={{ position: "absolute", left: 96, bottom: 90,
        fontSize: 52, opacity: 0.3,
        transform: `rotate(${spin(frame, 1.2)}deg)` }}>✦</div>
      <div style={{ position: "absolute", right: 80, top: 70,
        fontSize: 44, opacity: 0.25,
        transform: `rotate(${spin(frame, -1.5)}deg)` }}>⭐</div>

      <AbsoluteFill style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        fontFamily: "'Segoe UI', system-ui, sans-serif", gap: 36,
        paddingBottom: 80,
      }}>
        {/* Two photo frames + brain in center */}
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          {/* Original */}
          <div style={{
            opacity: leftP,
            transform: `translateX(${interpolate(leftP, [0, 1], [-50, 0])}px)`,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.teal,
              textTransform: "uppercase", letterSpacing: "2px" }}>Original Memory</div>
            <FakePhoto sky="#87CEEB" ground="#90EE90" borderColor={C.teal} frame={frame} />
          </div>

          {/* Brain + arrow */}
          <div style={{ opacity: brainP, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <BrainSplit frame={frame} opacity={1} />
            <div style={{ fontSize: 26, color: C.mid,
              transform: `translateX(${Math.sin(frame * 0.15) * 3}px)` }}>→ ?</div>
          </div>

          {/* AI Edited */}
          <div style={{
            opacity: rightP,
            transform: `translateX(${interpolate(rightP, [0, 1], [50, 0])}px)`,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.purple,
              textTransform: "uppercase", letterSpacing: "2px" }}>AI-Edited Memory</div>
            <FakePhoto sky="#C8B8E8" ground="#B8E8D0" isEdited borderColor={C.purple} frame={frame} />
          </div>
        </div>
      </AbsoluteFill>

      <Sub lines={[
        { text: "Can AI rewrite your memories?",   from: 5 },
        { text: "New CHI '25 research says — yes.", from: 75 },
      ]} frame={frame} total={durationInFrames} />
    </AbsoluteFill>
  );
};

// ── Scene 2: Paper (150–330f · 6s) ────────────────────────────────────────────

const PaperScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  // Entry: zoom in (arriving from Hook's dive). Exit: slide left → turning the page
  const tx = txMerge(txZoomInEntry(frame, 22), txSlideLeftExit(frame, durationInFrames, 25));

  const cardP  = easeIn(frame, 8, 22);
  const badgeP = easeIn(frame, 28, 18);
  const titleP = easeIn(frame, 48, 20);
  const authP  = easeIn(frame, 80, 18);

  const s1 = floatY(frame, 0.09, 12, 0);
  const s2 = floatY(frame, 0.11, 10, 1.5);

  return (
    <AbsoluteFill style={{ background: "#FFFBF5", ...tx }}>
      <Blob x={55}   y={80}  size={46} color={C.coral + "55"}  frame={frame} phase={0} startFrame={150} />
      <Blob x={1160} y={450} size={38} color={C.purple + "55"} frame={frame} phase={2} startFrame={370} />

      <div style={{ position: "absolute", left: 60,  top: 75  + s1, fontSize: 50, transform: `rotate(${spin(frame, 1.5)}deg)` }}>⭐</div>
      <div style={{ position: "absolute", right: 80, top: 100 + s2, fontSize: 38, transform: `rotate(${spin(frame, -2)}deg)` }}>✦</div>
      <div style={{ position: "absolute", right: 120, bottom: 90 + floatY(frame, 0.07, 14, 3), fontSize: 44 }}>✨</div>

      <AbsoluteFill style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Segoe UI', system-ui, sans-serif", padding: "0 100px 80px",
      }}>
        <div style={{
          opacity: cardP,
          transform: `translateY(${interpolate(cardP, [0, 1], [40, 0])}px)`,
          background: C.white, borderRadius: 28, padding: "44px 56px",
          maxWidth: 860, boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
          border: `3px solid ${C.coral}44`, textAlign: "center",
        }}>
          <div style={{
            opacity: badgeP,
            display: "inline-block",
            background: `linear-gradient(135deg, ${C.coral}, ${C.orange})`,
            borderRadius: 50, padding: "6px 26px",
            fontSize: 16, fontWeight: 800, color: C.white,
            letterSpacing: "2.5px", marginBottom: 24,
          }}>CHI 2025</div>

          <div style={{ opacity: titleP, fontSize: 27, fontWeight: 800, color: C.dark, lineHeight: 1.45, marginBottom: 24 }}>
            "Synthetic Human Memories: AI-Edited Images and Videos Can Implant
            False Memories and Distort Recollection"
          </div>

          <div style={{ opacity: authP, fontSize: 16, color: C.mid, marginBottom: 8 }}>
            Pataranutaporn · Archiwaranguprok · Chan · Loftus · Maes
          </div>
          <div style={{ opacity: authP, fontSize: 13, color: C.light }}>
            MIT Media Lab &amp; UC Irvine
          </div>
        </div>
      </AbsoluteFill>

      <Sub lines={[
        { text: "Researchers at MIT tested this at CHI 2025.",                         from: 5 },
        { text: "Can AI-edited photos implant false memories?",                         from: 100 },
      ]} frame={frame} total={durationInFrames} />
    </AbsoluteFill>
  );
};

// ── Scene 3: Study Flow (330–870f · 18s) ──────────────────────────────────────

const StudyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  // Entry: slide in from right. Exit: slide left → continuing forward
  const tx = txMerge(txSlideRightEntry(frame, 25), txSlideLeftExit(frame, durationInFrames, 25));

  const titleP = easeIn(frame, 5, 18);

  const TRACK_X0 = 90;
  const TRACK_X1 = 1090;
  const TRACK_W  = TRACK_X1 - TRACK_X0;
  const TRACK_Y  = 300;

  const phases = [
    { icon: "📷", label: "Phase 1",       note: "15 original images\n60 s minimum",      color: C.teal,   x: TRACK_X0 },
    { icon: "🕹️", label: "Filler",        note: "Pac-Man\nclears working memory",          color: C.blue,   x: TRACK_X0 + TRACK_W * 0.33 },
    { icon: "🖼️", label: "Phase 2",       note: "Group A: originals\nGroup B: AI-edited", color: C.purple, x: TRACK_X0 + TRACK_W * 0.66 },
    { icon: "🧠", label: "Memory Test",   note: "Agree / Disagree\nConfidence 1–7",        color: C.coral,  x: TRACK_X1 },
  ];

  // Person travels along the track
  const personX = interpolate(frame, [20, durationInFrames - 40], [TRACK_X0, TRACK_X1], {
    easing: Easing.inOut(Easing.quad),
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const lineW = interpolate(frame, [20, durationInFrames - 40], [0, TRACK_W], {
    easing: Easing.inOut(Easing.quad),
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#FAFBFF", ...tx }}>
      <Blob x={36}   y={60}  size={50} color={C.teal + "44"}   frame={frame} phase={0} startFrame={330} />
      <Blob x={1172} y={560} size={40} color={C.purple + "44"} frame={frame} phase={2} startFrame={550} />

      <AbsoluteFill style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        paddingBottom: 80,
      }}>
        <div style={{
          opacity: titleP,
          transform: `translateY(${interpolate(titleP, [0, 1], [-20, 0])}px)`,
          fontSize: 28, fontWeight: 900, color: C.dark, marginBottom: 60,
        }}>🔬 Study procedure</div>

        {/* Timeline */}
        <div style={{ position: "relative", width: TRACK_W + 80, height: 260 }}>
          {/* Base track */}
          <div style={{
            position: "absolute", left: 0, top: TRACK_Y - TRACK_X0,
            width: TRACK_W, height: 5,
            background: "#E0E0E0", borderRadius: 3,
          }} />
          {/* Filled track */}
          <div style={{
            position: "absolute", left: 0, top: TRACK_Y - TRACK_X0,
            width: lineW, height: 5,
            background: `linear-gradient(90deg, ${C.teal}, ${C.purple})`,
            borderRadius: 3,
          }} />

          {/* Phase nodes */}
          {phases.map(({ icon, label, note, color, x }) => {
            const reached = personX >= x - 20;
            const nodeP = easeIn(frame, 15, 18);
            return (
              <div key={label} style={{
                position: "absolute",
                left: x - TRACK_X0 - 36, // center on x
                top: 155,
                display: "flex", flexDirection: "column", alignItems: "center",
                opacity: nodeP,
                transform: `translateY(${interpolate(nodeP, [0, 1], [20, 0])}px)`,
              }}>
                <div style={{
                  width: 72, height: 72, borderRadius: "50%",
                  background: reached ? color : "#EFEFEF",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 30,
                  border: `4px solid ${reached ? color : "#D0D0D0"}`,
                  boxShadow: reached ? `0 4px 18px ${color}55` : "none",
                  transition: "background 0.3s, border-color 0.3s",
                }}>{icon}</div>
                <div style={{
                  marginTop: 10, fontSize: 14, fontWeight: 800,
                  color: reached ? color : C.light,
                }}>{label}</div>
                <div style={{
                  marginTop: 5, fontSize: 11, color: C.light,
                  textAlign: "center", whiteSpace: "pre-line", lineHeight: 1.5,
                  opacity: reached ? 1 : 0.5,
                }}>{note}</div>
              </div>
            );
          })}

          {/* Walking person */}
          <div style={{
            position: "absolute",
            left: personX - TRACK_X0 - 18,
            top: 115,
            fontSize: 36,
            transform: `translateY(${floatY(frame, 0.14, 4)}px)`,
          }}>🧍</div>
        </div>
      </AbsoluteFill>

      <Sub lines={[
        { text: "Participants first saw 15 original photos.",              from: 5 },
        { text: "Then played Pac-Man to clear their working memory.",       from: 135 },
        { text: "Group A: same originals. Group B: AI-edited versions.",   from: 270 },
        { text: "Then everyone took a memory test.",                        from: 400 },
      ]} frame={frame} total={durationInFrames} />
    </AbsoluteFill>
  );
};

// ── Scene 4: Two Conditions (870–1110f · 8s) ──────────────────────────────────

const ConditionsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  // Entry: slide in from right. Exit: FREE FALL → results hit you like gravity
  const tx = txMerge(txSlideRightEntry(frame, 25), txFallExit(frame, durationInFrames, 30));

  const leftP  = easeIn(frame, 8, 22);
  const vsP    = easeIn(frame, 18, 16);
  const rightP = easeIn(frame, 28, 22);

  return (
    <AbsoluteFill style={{ background: "#FAFBFF", ...tx }}>
      <Blob x={36}   y={60}  size={50} color={C.teal + "44"}   frame={frame} phase={0}   startFrame={870} />
      <Blob x={1172} y={550} size={42} color={C.purple + "44"} frame={frame} phase={1.8} startFrame={1090} />

      <AbsoluteFill style={{
        display: "flex", flexDirection: "row",
        alignItems: "center", justifyContent: "center",
        fontFamily: "'Segoe UI', system-ui, sans-serif", gap: 48,
        paddingBottom: 80,
      }}>
        {/* Group A */}
        <div style={{
          opacity: leftP,
          transform: `translateX(${interpolate(leftP, [0, 1], [-50, 0])}px)`,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
        }}>
          <div style={{ fontSize: 36 }}>👥</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.teal }}>Group A</div>
          <FakePhoto w={250} h={188} sky="#87CEEB" ground="#90EE90"
            borderColor={C.teal} label="Original photo" frame={frame} />
          <div style={{
            background: `${C.teal}22`, border: `2.5px solid ${C.teal}`,
            borderRadius: 50, padding: "8px 20px",
            fontSize: 14, fontWeight: 700, color: C.teal,
          }}>No changes ✓</div>
        </div>

        {/* VS divider */}
        <div style={{
          opacity: vsP,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          flexShrink: 0,
        }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: C.light }}>VS</div>
          <div style={{ width: 2, height: 60, background: "#E0E0E0" }} />
        </div>

        {/* Group B */}
        <div style={{
          opacity: rightP,
          transform: `translateX(${interpolate(rightP, [0, 1], [50, 0])}px)`,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
        }}>
          <div style={{ fontSize: 36 }}>👥</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.purple }}>Group B</div>
          <FakePhoto w={250} h={188} sky="#C8B8E8" ground="#B8E8D0"
            isEdited borderColor={C.purple} label="AI-edited photo" frame={frame} />
          <div style={{
            background: `${C.purple}22`, border: `2.5px solid ${C.purple}`,
            borderRadius: 50, padding: "8px 20px",
            fontSize: 14, fontWeight: 700, color: C.purple,
          }}>AI-edited ✨</div>
        </div>
      </AbsoluteFill>

      <Sub lines={[
        { text: "Group A saw the same original photos again.",           from: 5 },
        { text: "Group B saw AI-edited versions — subtly altered.",      from: 110 },
      ]} frame={frame} total={durationInFrames} />
    </AbsoluteFill>
  );
};

// ── Scene 5: Results (1110–1500f · 13s) ───────────────────────────────────────

const ResultsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  // Entry: DROP from above (results fall in). Exit: slide left → moving to implications
  const tx = txMerge(txDropEntry(frame, 25), txSlideLeftExit(frame, durationInFrames, 25));

  const titleP = easeIn(frame, 5, 18);
  void fps; // used by spring calls below

  // Bars animate up smoothly (spring with high damping → no overshoot)
  const bar1 = spring({ frame: frame - 25, fps,
    config: { damping: 50, mass: 0.8, stiffness: 150 }, durationInFrames: 40 });
  const bar2 = spring({ frame: frame - 55, fps,
    config: { damping: 50, mass: 0.8, stiffness: 150 }, durationInFrames: 40 });

  const emojiOp  = easeIn(frame, 95, 16);
  const insightP = easeIn(frame, 125, 20);

  const BAR_MAX = 190;
  const RATE_A  = 0.27;
  const RATE_B  = 0.56;

  const BarCol = ({ progress, rate, color, barBg, label, cond, emoji, animated = false }: {
    progress: number; rate: number; color: string; barBg: string;
    label: string; cond: string; emoji: string; animated?: boolean;
  }) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 160, gap: 10 }}>
      <div style={{ fontSize: 32, fontWeight: 900, color, minHeight: 44 }}>
        {Math.round(progress * rate * 100)}%
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", height: BAR_MAX }}>
        <div style={{
          width: 100, height: Math.max(4, progress * rate * BAR_MAX),
          background: `linear-gradient(180deg, ${barBg}, ${color})`,
          borderRadius: "12px 12px 0 0",
          boxShadow: `0 -4px 20px ${color}44`,
        }} />
      </div>
      <div style={{ width: 120, height: 3, background: "#E0E0E0", borderRadius: 2 }} />
      <div style={{ fontSize: 15, fontWeight: 700, color: C.dark }}>{label}</div>
      <div style={{ fontSize: 12, fontWeight: 600, color }}>{cond}</div>
      <div style={{
        fontSize: 38, opacity: emojiOp,
        transform: animated ? `translateY(${floatY(frame, 0.1, 5)}px)` : undefined,
      }}>{emoji}</div>
    </div>
  );

  return (
    <AbsoluteFill style={{ background: C.bgPurple, ...tx }}>
      <Blob x={48}   y={68}  size={46} color={C.purple + "44"} frame={frame} phase={0}   startFrame={1110} />
      <Blob x={1160} y={88}  size={38} color={C.coral + "44"}  frame={frame} phase={1.8} startFrame={1330} />
      <Blob x={1162} y={510} size={52} color={C.blue + "44"}   frame={frame} phase={3}   startFrame={1550} />

      <AbsoluteFill style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        fontFamily: "'Segoe UI', system-ui, sans-serif", padding: "48px 80px 116px",
      }}>
        <div style={{
          opacity: titleP,
          transform: `translateY(${interpolate(titleP, [0, 1], [-20, 0])}px)`,
          fontSize: 28, fontWeight: 900, color: C.dark, marginBottom: 28,
        }}>🧪 Memory test results</div>

        <div style={{ display: "flex", gap: 80, alignItems: "flex-end", marginBottom: 16 }}>
          <BarCol progress={bar1} rate={RATE_A} color={C.teal}  barBg="#C8F5EF"
            label="Group A" cond="Original images" emoji="😐" />
          <BarCol progress={bar2} rate={RATE_B} color={C.coral} barBg="#FFD0D0"
            label="Group B" cond="AI-edited images" emoji="😱" animated />
        </div>

        <div style={{ fontSize: 11, color: C.light, marginBottom: 16 }}>
          Illustrative rates · based on CHI '25 paper
        </div>

        <div style={{
          opacity: insightP,
          transform: `translateY(${interpolate(insightP, [0, 1], [20, 0])}px)`,
          background: C.coral, borderRadius: 20, padding: "14px 36px",
          fontSize: 20, fontWeight: 800, color: C.white,
          boxShadow: `0 8px 28px ${C.coral}55`, textAlign: "center",
        }}>
          🚨 AI-edited images significantly increased false memory rates!
        </div>
      </AbsoluteFill>

      <Sub lines={[
        { text: "The memory test revealed a striking difference.",                    from: 5 },
        { text: "Group B had far more false memory agreements.",                      from: 130 },
        { text: "Just seeing altered photos changed what they 'remembered.'",         from: 250 },
      ]} frame={frame} total={durationInFrames} />
    </AbsoluteFill>
  );
};

// ── Scene 6: Implications (1500–1860f · 12s) ──────────────────────────────────

const ImplicationsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  // Entry: slide in from right. Exit: zoom-out → stepping back to shift perspective
  const tx = txMerge(txSlideRightEntry(frame, 25), txZoomOutExit(frame, durationInFrames, 22));

  const titleP = easeIn(frame, 5, 18);

  const panels = [
    { icon: "📱", label: "Social Media",    desc: "AI filters & deepfakes change\nhow we recall shared moments",       color: C.teal,   bg: "#EAF6FF", delay: 20 },
    { icon: "⚖️", label: "Legal Evidence",  desc: "Tampered photos could distort\neyewitness accounts in court",         color: C.orange, bg: "#FFF4EC", delay: 55 },
    { icon: "👨‍👩‍👧", label: "Personal History", desc: "AI-edited family albums may\nreshape autobiographical memory",    color: C.purple, bg: "#F5EEFF", delay: 90 },
  ];

  return (
    <AbsoluteFill style={{ background: "#FEFFFE", ...tx }}>
      <Blob x={28}   y={98}  size={54} color={C.teal + "44"}   frame={frame} phase={0} startFrame={1500} />
      <Blob x={1178} y={78}  size={42} color={C.orange + "44"} frame={frame} phase={2} startFrame={1720} />
      <Blob x={1158} y={548} size={46} color={C.purple + "44"} frame={frame} phase={1} startFrame={1940} />

      <AbsoluteFill style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        fontFamily: "'Segoe UI', system-ui, sans-serif", padding: "0 80px 80px",
      }}>
        <div style={{
          opacity: titleP,
          transform: `translateY(${interpolate(titleP, [0, 1], [-20, 0])}px)`,
          fontSize: 32, fontWeight: 900, color: C.dark, marginBottom: 44,
        }}>🌍 Why this matters</div>

        {/* Three illustrated panels side by side */}
        <div style={{ display: "flex", gap: 24, width: "100%", maxWidth: 1060 }}>
          {panels.map(({ icon, label, desc, color, bg, delay }) => {
            const p = easeIn(frame, delay, 22);
            return (
              <div key={label} style={{
                opacity: p,
                transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px)`,
                flex: 1,
                background: bg,
                border: `3px solid ${color}55`,
                borderTop: `6px solid ${color}`,
                borderRadius: 20,
                padding: "28px 20px",
                textAlign: "center",
                boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
              }}>
                <div style={{ fontSize: 56 }}>{icon}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color }}>{label}</div>
                <div style={{ fontSize: 14, color: C.mid, lineHeight: 1.6, whiteSpace: "pre-line" }}>{desc}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      <Sub lines={[
        { text: "This isn't just a lab experiment.",                                    from: 5 },
        { text: "AI-edited photos could distort legal eyewitness testimony.",           from: 100 },
        { text: "And reshape how we remember our own personal history.",                from: 210 },
      ]} frame={frame} total={durationInFrames} />
    </AbsoluteFill>
  );
};

// ── Scene 7: Replication (1860–2280f · 14s) ───────────────────────────────────

const BrowserMockup: React.FC<{ frame: number }> = ({ frame }) => {
  const progressW = interpolate(frame, [10, 200], [0, 58], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <div style={{
      width: 620, height: 430,
      background: C.white, borderRadius: 18, overflow: "hidden",
      boxShadow: "0 20px 60px rgba(0,0,0,0.14)",
      border: "1px solid #DDE0EA",
    }}>
      {/* Browser chrome */}
      <div style={{ background: "#F2F2F2", height: 44, display: "flex",
        alignItems: "center", padding: "0 14px", gap: 8,
        borderBottom: "1px solid #E0E0E0" }}>
        {[["#FF5F57"], ["#FFBD2E"], ["#28C840"]].map(([c], i) => (
          <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
        ))}
        <div style={{ flex: 1, background: "#E6E6E6", borderRadius: 6, height: 24,
          marginLeft: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 11, color: "#888", fontFamily: "monospace" }}>
            memory-study.vercel.app
          </span>
        </div>
      </div>

      {/* App UI */}
      <div style={{ padding: "22px 28px", fontFamily: "'Segoe UI', system-ui" }}>
        {/* Progress */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11, color: "#999", marginBottom: 5 }}>Progress</div>
          <div style={{ height: 6, background: "#EEE", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progressW}%`,
              background: `linear-gradient(90deg, ${C.teal}, ${C.blue})`, borderRadius: 3 }} />
          </div>
        </div>
        {/* Phase title */}
        <div style={{ fontSize: 17, fontWeight: 700, color: C.dark, marginBottom: 14 }}>
          Phase 2 — Study Images
        </div>
        {/* Image area */}
        <div style={{
          height: 180, borderRadius: 12,
          background: `linear-gradient(135deg, ${C.bgBlue}, ${C.bgPurple})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 18, position: "relative",
        }}>
          <div style={{ fontSize: 52 }}>🖼️</div>
          <div style={{
            position: "absolute", top: 10, right: 14,
            background: `${C.purple}dd`, color: C.white,
            fontSize: 10, fontWeight: 700, padding: "3px 10px",
            borderRadius: 50, letterSpacing: "1px",
          }}>AI</div>
        </div>
        {/* Buttons */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <div style={{ padding: "10px 22px", background: "#F0F0F0", borderRadius: 8,
            fontSize: 14, fontWeight: 600, color: C.mid }}>← Prev</div>
          <div style={{ padding: "10px 22px",
            background: C.teal, borderRadius: 8,
            fontSize: 14, fontWeight: 600, color: C.white,
            boxShadow: `0 4px 14px ${C.teal}55`,
            transform: `scale(${pulse(frame, 0.1, 0.04)})`,
          }}>Next →</div>
        </div>
      </div>
    </div>
  );
};

const ReplicationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  // Entry: zoom-out (arrives big, settles in — new energy). Exit: zoom-in → CTA momentum
  const tx = txMerge(txZoomOutEntry(frame, 22), txZoomInExit(frame, durationInFrames, 22));

  const titleP  = easeIn(frame, 5, 18);
  const browserP = easeIn(frame, 22, 24);

  const chips = [
    { icon: "⚙️", text: "React + TypeScript + Vite", color: C.blue,   bg: "#EAF1FF", delay: 45 },
    { icon: "🗄️", text: "Supabase for data",          color: C.teal,   bg: "#EAF6FF", delay: 65 },
    { icon: "🎮", text: "Pac-Man filler task",          color: C.purple, bg: "#F5EEFF", delay: 85 },
    { icon: "🔄", text: "JSON-configurable",            color: C.orange, bg: "#FFF4EC", delay: 105 },
    { icon: "📊", text: "Event log + tracking",         color: C.coral,  bg: "#FFF0ED", delay: 125 },
  ];

  return (
    <AbsoluteFill style={{ background: C.bgMint, ...tx }}>
      <Blob x={28}   y={78}  size={52} color={C.green + "55"} frame={frame} phase={0} startFrame={1860} />
      <Blob x={1178} y={548} size={40} color={C.teal + "55"}  frame={frame} phase={2} startFrame={2080} />
      <div style={{
        position: "absolute", right: 62, top: 55 + floatY(frame, 0.08, 14, 1),
        fontSize: 66, transform: `rotate(${Math.sin(frame * 0.07) * 8}deg)`,
      }}>🚀</div>

      <AbsoluteFill style={{
        display: "flex", flexDirection: "row",
        alignItems: "center",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        padding: "0 72px 80px", gap: 52,
      }}>
        {/* Left: title + chips */}
        <div style={{ flex: 1 }}>
          <div style={{
            opacity: titleP,
            transform: `translateY(${interpolate(titleP, [0, 1], [-20, 0])}px)`,
            fontSize: 34, fontWeight: 900, color: C.dark, marginBottom: 10,
          }}>🛠️ I replicated this study!</div>
          <div style={{ opacity: easeIn(frame, 25, 18), fontSize: 15, color: C.mid, lineHeight: 1.65, marginBottom: 24 }}>
            Open-source web app — swap images, surveys,
            or timing via JSON config only.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
            {chips.map(({ icon, text, color, bg, delay }) => {
              const p = easeIn(frame, delay, 20);
              return (
                <div key={text} style={{
                  opacity: p,
                  transform: `translateX(${interpolate(p, [0, 1], [-28, 0])}px)`,
                  display: "flex", alignItems: "center", gap: 10,
                  background: bg, border: `2px solid ${color}55`,
                  borderRadius: 50, padding: "8px 18px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}>
                  <span style={{ fontSize: 18 }}>{icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color }}>{text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: browser mockup */}
        <div style={{ opacity: browserP, transform: `translateX(${interpolate(browserP, [0, 1], [40, 0])}px)` }}>
          <BrowserMockup frame={frame} />
        </div>
      </AbsoluteFill>

      <Sub lines={[
        { text: "I built an open-source version of this study.",              from: 5 },
        { text: "React + Supabase — fully configurable via JSON.",            from: 150 },
        { text: "You can run your own memory study with no code changes.",    from: 290 },
      ]} frame={frame} total={durationInFrames} />
    </AbsoluteFill>
  );
};

// ── Scene 8: CTA (2280–2760f · 16s) ──────────────────────────────────────────

const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const titleP = easeIn(frame, 15, 20);
  const endFade = fadeOutAt(frame, durationInFrames, 30);
  // Entry: zoom-in (energy from Replication's dive). Exit: fade only (video end)
  const tx = txMerge(txZoomInEntry(frame, 22), { opacity: endFade });
  const subOp  = easeIn(frame, 170, 22);

  const questions = [
    { text: "Should AI tools warn before editing personal photos?",   color: C.teal,   bg: "#EAF6FF", delay: 50 },
    { text: "Can we trust our memories in the age of generative AI?", color: C.coral,  bg: "#FFF0ED", delay: 88 },
    { text: "How should HCI study memory in AI-mediated systems?",    color: C.purple, bg: "#F5EEFF", delay: 126 },
  ];

  return (
    <AbsoluteFill style={{ background: C.bgYellow, ...tx }}>
      <Blob x={48}   y={52}  size={48} color={C.coral + "66"}  frame={frame} phase={0}   startFrame={2280} />
      <Blob x={1170} y={72}  size={40} color={C.teal + "66"}   frame={frame} phase={1.5} startFrame={2500} />
      <Blob x={52}   y={548} size={54} color={C.purple + "55"} frame={frame} phase={3}   startFrame={2720} />
      <Blob x={1148} y={525} size={44} color={C.orange + "55"} frame={frame} phase={2}   startFrame={2940} />

      <div style={{ position: "absolute", left: 80, top: 58 + floatY(frame, 0.09, 14),
        fontSize: 58, opacity: 0.45, transform: `rotate(${spin(frame, 1.5)}deg)` }}>⭐</div>
      <div style={{ position: "absolute", right: 80, bottom: 68 + floatY(frame, 0.07, 12, 2),
        fontSize: 50, opacity: 0.4, transform: `rotate(${spin(frame, -2)}deg)` }}>✦</div>

      <AbsoluteFill style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        fontFamily: "'Segoe UI', system-ui, sans-serif", padding: "0 80px 80px",
      }}>
        <div style={{
          opacity: titleP,
          transform: `translateY(${interpolate(titleP, [0, 1], [-24, 0])}px)`,
          fontSize: 54, fontWeight: 900, color: C.dark,
          textAlign: "center", marginBottom: 30,
        }}>💬 What do you think?</div>

        {/* Chat-bubble style question cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%", maxWidth: 820 }}>
          {questions.map(({ text, color, bg, delay }) => {
            const p = easeIn(frame, delay, 22);
            return (
              <div key={text} style={{
                opacity: p,
                transform: `translateX(${interpolate(p, [0, 1], [50, 0])}px)`,
                background: C.white,
                border: `3px solid ${color}66`,
                borderLeft: `6px solid ${color}`,
                borderRadius: 16, padding: "14px 24px",
                fontSize: 17, fontWeight: 700, color: C.dark,
                boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
              }}>→ {text}</div>
            );
          })}
        </div>

        <div style={{
          opacity: subOp,
          marginTop: 30,
          background: C.coral, borderRadius: 50, padding: "12px 36px",
          fontSize: 18, fontWeight: 800, color: C.white,
          boxShadow: `0 6px 24px ${C.coral}55`,
          transform: `scale(${pulse(frame, 0.1, 0.04)})`,
        }}>
          ❤️ Like &amp; Subscribe for more HCI breakdowns!
        </div>
      </AbsoluteFill>

      <Sub lines={[
        { text: "Should AI warn us before editing personal photos?",     from: 45 },
        { text: "Can we trust our memories in the age of generative AI?", from: 108 },
        { text: "Drop your thoughts in the comments below! 💬",          from: 186 },
      ]} frame={frame} total={durationInFrames} />
    </AbsoluteFill>
  );
};

// ── Root ───────────────────────────────────────────────────────────────────────

export const HCIExplainer: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bgYellow }}>
    <Sequence from={0}    durationInFrames={150}><HookScene /></Sequence>
    <Sequence from={150}  durationInFrames={180}><PaperScene /></Sequence>
    <Sequence from={330}  durationInFrames={540}><StudyScene /></Sequence>
    <Sequence from={870}  durationInFrames={240}><ConditionsScene /></Sequence>
    <Sequence from={1110} durationInFrames={390}><ResultsScene /></Sequence>
    <Sequence from={1500} durationInFrames={360}><ImplicationsScene /></Sequence>
    <Sequence from={1860} durationInFrames={420}><ReplicationScene /></Sequence>
    <Sequence from={2280} durationInFrames={480}><CTAScene /></Sequence>
  </AbsoluteFill>
);
