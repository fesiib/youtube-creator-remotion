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

const C = {
  coral:    "#FF6B6B",
  teal:     "#00B4D8",
  purple:   "#9B5DE5",
  orange:   "#FB8500",
  green:    "#06D6A0",
  blue:     "#4361EE",
  yellow:   "#FFC300",
  dark:     "#1A1A2E",
  mid:      "#4A4A6A",
  light:    "#9A9ABF",
  white:    "#FFFFFF",
  bgYellow: "#FFF9E0",
  bgBlue:   "#EAF6FF",
  bgPurple: "#F5EEFF",
  bgMint:   "#EAFAF7",
  bgPeach:  "#FFF4EC",
};

const easeIn = (frame: number, start: number, dur = 20) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

const fadeOutAt = (frame: number, total: number, dur = 12) =>
  interpolate(frame, [total - dur, total], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

const floatY = (frame: number, speed = 0.08, amp = 10, phase = 0) =>
  Math.sin(frame * speed + phase) * amp;

const pulse = (frame: number, speed = 0.1, amp = 0.04) =>
  1 + Math.sin(frame * speed) * amp;

const spin = (frame: number, speed = 2) => (frame * speed) % 360;

// ── Transitions ───────────────────────────────────────────────────────────────
const txSlideLeftExit = (frame: number, total: number, dur = 25): React.CSSProperties => {
  const p = interpolate(frame, [total - dur, total], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  return { opacity: 1 - p, transform: `translateX(${p * -1280}px)` };
};

const txSlideRightEntry = (frame: number, dur = 25): React.CSSProperties => {
  const p = easeIn(frame, 0, dur);
  return { opacity: p, transform: `translateX(${(1 - p) * 1280}px)` };
};

const txZoomInExit = (frame: number, total: number, dur = 22): React.CSSProperties => {
  const p = interpolate(frame, [total - dur, total], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  return { opacity: 1 - p, transform: `scale(${1 + p * 0.1})` };
};

const txZoomInEntry = (frame: number, dur = 22): React.CSSProperties => {
  const p = easeIn(frame, 0, dur);
  return { opacity: p, transform: `scale(${0.92 + p * 0.08})` };
};

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

const txDropEntry = (frame: number, dur = 25): React.CSSProperties => {
  const p = easeIn(frame, 0, dur);
  return { opacity: p, transform: `translateY(${(1 - p) * -70}px)` };
};

const txMerge = (entry: React.CSSProperties, exit: React.CSSProperties): React.CSSProperties => ({
  opacity: ((entry.opacity as number) ?? 1) * ((exit.opacity as number) ?? 1),
  transform: [entry.transform, exit.transform].filter(Boolean).join(" ") || undefined,
});

// ── Blob ──────────────────────────────────────────────────────────────────────
const Blob: React.FC<{
  x: number; y: number; size: number; color: string;
  frame: number; phase?: number; startFrame?: number;
}> = ({ x, y, size, color, frame, phase = 0, startFrame = 0 }) => {
  const f = frame + startFrame;
  const driftX = Math.sin(f * 0.007 + phase) * 210 + Math.sin(f * 0.015 + phase * 0.6) * 55;
  const driftY = Math.sin(f * 0.040 + phase * 1.9) * 26;
  return (
    <div style={{
      position: "absolute", left: x + driftX, top: y + driftY,
      width: size, height: size, borderRadius: "50%",
      background: color, opacity: 0.45, pointerEvents: "none",
    }} />
  );
};

// ── Sub ───────────────────────────────────────────────────────────────────────
interface SubLine { text: string; from: number }
const Sub: React.FC<{ lines: SubLine[]; frame: number; total: number }> = ({ lines, frame, total }) => {
  let cur: SubLine | null = null;
  for (const l of lines) { if (frame >= l.from) cur = l; }
  if (!cur) return null;
  const fadeIn = interpolate(frame, [cur.from, cur.from + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const endFade = fadeOutAt(frame, total, 18);
  return (
    <div style={{
      position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)",
      background: "rgba(15,15,25,0.80)", color: C.white,
      padding: "10px 32px", borderRadius: 10,
      fontSize: 22, fontWeight: 600, textAlign: "center",
      opacity: fadeIn * endFade, whiteSpace: "nowrap",
      pointerEvents: "none", letterSpacing: "0.2px",
    }}>{cur.text}</div>
  );
};

// ── Phonetic caption (font size = volume, baseline shift = pitch) ─────────────
const PhoneticCaption: React.FC<{ frame: number; startAt?: number; color?: string }> = ({
  frame, startAt = 0, color = C.purple,
}) => {
  const syllables = [
    { text: "tang", size: 20, dy: 0 },   { text: "-a-", size: 14, dy: -5 },
    { text: "dan",  size: 22, dy: 3 },   { text: " ding", size: 18, dy: -8 },
    { text: " ta",  size: 16, dy: -4 },  { text: "ra",   size: 24, dy: -10 },
    { text: "dan",  size: 28, dy: 2 },   { text: " tting", size: 32, dy: 0 },
    { text: " do",  size: 16, dy: -6 },  { text: "do",   size: 18, dy: -8 },
    { text: "dong", size: 24, dy: 2 },
  ];
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", flexWrap: "wrap" }}>
      {syllables.map(({ text, size, dy }, i) => (
        <span key={i} style={{
          fontSize: size, color, fontWeight: 800,
          fontFamily: "'Segoe UI', system-ui, sans-serif",
          opacity: easeIn(frame, startAt + i * 3, 8),
          transform: `translateY(${dy}px)`,
          display: "inline-block", lineHeight: 1,
        }}>{text}</span>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SCENES
// ─────────────────────────────────────────────────────────────────────────────

// Scene 1: Hook (0–150f · 5s)
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const tx = txZoomInExit(frame, durationInFrames, 22);
  const earP     = easeIn(frame, 8, 20);
  const xP       = easeIn(frame, 26, 18);
  const captionP = easeIn(frame, 44, 20);
  return (
    <AbsoluteFill style={{ background: C.bgYellow, ...tx }}>
      <Blob x={42}   y={52}  size={54} color={C.coral + "66"}  frame={frame} phase={0}   startFrame={0} />
      <Blob x={1160} y={50}  size={44} color={C.teal + "55"}   frame={frame} phase={1.5} startFrame={220} />
      <Blob x={42}   y={548} size={42} color={C.purple + "44"} frame={frame} phase={3}   startFrame={440} />
      <Blob x={1168} y={560} size={50} color={C.yellow + "88"} frame={frame} phase={2}   startFrame={660} />
      <div style={{ position: "absolute", left: 100, bottom: 90, fontSize: 50, opacity: 0.3,
        transform: `rotate(${spin(frame, 1.2)}deg)` }}>✦</div>
      <div style={{ position: "absolute", right: 88, top: 68, fontSize: 44, opacity: 0.25,
        transform: `rotate(${spin(frame, -1.5)}deg)` }}>⭐</div>

      <AbsoluteFill style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Segoe UI', system-ui, sans-serif", paddingBottom: 100, gap: 32,
      }}>
        <div style={{
          opacity: earP, transform: `translateX(${interpolate(earP, [0,1], [-40, 0])}px)`,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
        }}>
          <div style={{ fontSize: 88 }}>🎼</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.teal, letterSpacing: "1px" }}>ORCHESTRA</div>
        </div>

        <div style={{ opacity: xP, fontSize: 36, color: C.light }}>→</div>

        <div style={{ opacity: xP, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ position: "relative", fontSize: 80 }}>
            🦻
            <div style={{
              position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 56, color: C.coral, fontWeight: 900, lineHeight: 1,
            }}>✕</div>
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.mid }}>DHH viewer</div>
        </div>

        <div style={{ opacity: xP, fontSize: 36, color: C.light }}>→</div>

        <div style={{
          opacity: captionP, transform: `translateX(${interpolate(captionP, [0,1], [40, 0])}px)`,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
        }}>
          <div style={{
            background: "#2A2A3A", border: "2px solid #444", borderRadius: 8,
            padding: "10px 28px", fontSize: 24, color: "#BBB", fontFamily: "monospace", fontWeight: 700,
          }}>[ 🎵 Music ]</div>
          <div style={{ fontSize: 40 }}>😕</div>
        </div>
      </AbsoluteFill>

      <Sub lines={[
        { text: "Orchestra is playing. Caption reads: [Music]. That's it.", from: 5 },
        { text: "76% of DHH individuals are interested in music.",          from: 90 },
      ]} frame={frame} total={durationInFrames} />
    </AbsoluteFill>
  );
};

// Scene 2: Paper (150–330f · 6s)
const PaperScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const tx = txMerge(txZoomInEntry(frame, 22), txSlideLeftExit(frame, durationInFrames, 25));
  const cardP  = easeIn(frame, 8, 22);
  const badgeP = easeIn(frame, 28, 18);
  const titleP = easeIn(frame, 48, 20);
  const authP  = easeIn(frame, 80, 18);
  const s1 = floatY(frame, 0.09, 12, 0);
  const s2 = floatY(frame, 0.11, 10, 1.5);
  return (
    <AbsoluteFill style={{ background: "#FFFBF5", ...tx }}>
      <Blob x={55}   y={80}  size={46} color={C.teal + "55"}   frame={frame} phase={0} startFrame={150} />
      <Blob x={1160} y={450} size={38} color={C.purple + "55"} frame={frame} phase={2} startFrame={370} />
      <div style={{ position: "absolute", left: 60, top: 75 + s1,
        fontSize: 50, transform: `rotate(${spin(frame, 1.5)}deg)` }}>⭐</div>
      <div style={{ position: "absolute", right: 80, top: 100 + s2,
        fontSize: 38, transform: `rotate(${spin(frame, -2)}deg)` }}>✦</div>
      <div style={{ position: "absolute", right: 120, bottom: 90 + floatY(frame, 0.07, 14, 3), fontSize: 44 }}>🎵</div>

      <AbsoluteFill style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Segoe UI', system-ui, sans-serif", padding: "0 100px 90px",
      }}>
        <div style={{
          opacity: cardP, transform: `translateY(${interpolate(cardP, [0,1], [40, 0])}px)`,
          background: C.white, borderRadius: 28, padding: "44px 56px",
          maxWidth: 860, boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
          border: `3px solid ${C.teal}44`, textAlign: "center",
        }}>
          <div style={{
            opacity: badgeP, display: "inline-block",
            background: `linear-gradient(135deg, ${C.blue}, ${C.teal})`,
            borderRadius: 50, padding: "6px 26px",
            fontSize: 16, fontWeight: 800, color: C.white, letterSpacing: "2.5px", marginBottom: 24,
          }}>CHI 2026</div>
          <div style={{ opacity: titleP, fontSize: 42, fontWeight: 900, color: C.dark, marginBottom: 10 }}>𝜇Cap</div>
          <div style={{ opacity: titleP, fontSize: 19, fontWeight: 700, color: C.mid, marginBottom: 24, lineHeight: 1.5 }}>
            Instrumental Music Captions<br />for Deaf and Hard-of-Hearing Individuals
          </div>
          <div style={{ opacity: authP, fontSize: 15, color: C.mid, marginBottom: 8 }}>Ahn · Baek · Kim · Truong · Hong</div>
          <div style={{ opacity: authP, fontSize: 13, color: C.light }}>GIST &amp; University of Toronto</div>
        </div>
      </AbsoluteFill>

      <Sub lines={[
        { text: "μCap — an automatic system to caption instrumental music.", from: 5 },
        { text: "CHI 2026 paper from GIST & University of Toronto.",         from: 110 },
      ]} frame={frame} total={durationInFrames} />
    </AbsoluteFill>
  );
};

// Scene 3: Survey (330–690f · 12s)
const SurveyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const tx = txMerge(txSlideRightEntry(frame, 25), txSlideLeftExit(frame, durationInFrames, 25));
  const titleP = easeIn(frame, 5, 18);
  const cards = [
    { top: "76%",       sub: "of DHH participants\ninterested in instrumental music", icon: "🎵", color: C.teal,   bg: "#EAF6FF", delay: 28 },
    { top: "[ 🎵 Music ]", sub: "That's what most DHH viewers get\nwhen music plays", icon: "😕", color: C.orange, bg: "#FFF4EC", delay: 80, mono: true },
    { top: "9 / 21",    sub: "prefer captions over\nvibration or sign language",      icon: "📝", color: C.purple, bg: C.bgPurple, delay: 140 },
  ];
  return (
    <AbsoluteFill style={{ background: C.bgBlue, ...tx }}>
      <Blob x={36}   y={60}  size={50} color={C.teal + "44"} frame={frame} phase={0} startFrame={330} />
      <Blob x={1172} y={560} size={40} color={C.blue + "44"} frame={frame} phase={2} startFrame={550} />

      <AbsoluteFill style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        fontFamily: "'Segoe UI', system-ui, sans-serif", padding: "44px 80px 110px", gap: 28,
      }}>
        <div style={{
          opacity: titleP, transform: `translateY(${interpolate(titleP, [0,1], [-20, 0])}px)`,
          fontSize: 28, fontWeight: 900, color: C.dark,
        }}>📊 Preliminary survey: 21 DHH participants</div>

        <div style={{ display: "flex", gap: 24, width: "100%", maxWidth: 1020 }}>
          {cards.map(({ top, sub, icon, color, bg, delay, mono }) => {
            const p = easeIn(frame, delay, 22);
            return (
              <div key={top} style={{
                opacity: p, transform: `translateY(${interpolate(p, [0,1], [30, 0])}px)`,
                flex: 1, background: C.white, borderRadius: 20,
                border: `3px solid ${color}55`, borderTop: `6px solid ${color}`,
                padding: "28px 20px", textAlign: "center",
                boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
              }}>
                <div style={{
                  fontSize: mono ? 18 : 48, fontWeight: 900, color,
                  fontFamily: mono ? "monospace" : undefined, background: mono ? bg : undefined,
                  borderRadius: mono ? 6 : undefined, padding: mono ? "6px 14px" : undefined,
                }}>{top}</div>
                <div style={{ fontSize: 14, color: C.mid, lineHeight: 1.6, whiteSpace: "pre-line" }}>{sub}</div>
                <div style={{ fontSize: 36, marginTop: 4 }}>{icon}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      <Sub lines={[
        { text: "Survey: 21 DHH + 21 hearing participants.",         from: 5 },
        { text: "Most DHH people want to experience music.",          from: 120 },
        { text: "They prefer captions — but captions fail them.",     from: 240 },
      ]} frame={frame} total={durationInFrames} />
    </AbsoluteFill>
  );
};

// Scene 4: System pipeline (690–1110f · 14s)
const SystemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const tx = txMerge(txSlideRightEntry(frame, 25), txSlideLeftExit(frame, durationInFrames, 25));
  const titleP = easeIn(frame, 5, 18);
  const steps = [
    { icon: "🎵", label: "Audio\nInput",          color: C.teal,   bg: "#EAF6FF",  delay: 25 },
    { icon: "🔍", label: "Feature\nExtraction",   color: C.blue,   bg: C.bgBlue,   delay: 75 },
    { icon: "📚", label: "RAG\nDatabase",         color: C.purple, bg: C.bgPurple, delay: 125 },
    { icon: "🤖", label: "GPT-4o\nGeneration",    color: C.orange, bg: "#FFF4EC",  delay: 175 },
    { icon: "📝", label: "Phonetic\nCaption",     color: C.green,  bg: C.bgMint,   delay: 225 },
  ];
  const tagsP = easeIn(frame, 270, 22);
  return (
    <AbsoluteFill style={{ background: C.bgMint, ...tx }}>
      <Blob x={30}   y={70}  size={52} color={C.green + "44"} frame={frame} phase={0} startFrame={690} />
      <Blob x={1178} y={556} size={44} color={C.teal + "44"}  frame={frame} phase={2} startFrame={910} />
      <div style={{
        position: "absolute", right: 62, top: 55 + floatY(frame, 0.08, 14, 1),
        fontSize: 66, transform: `rotate(${Math.sin(frame * 0.07) * 8}deg)`,
      }}>🎼</div>

      <AbsoluteFill style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        fontFamily: "'Segoe UI', system-ui, sans-serif", padding: "44px 60px 110px", gap: 36,
      }}>
        <div style={{
          opacity: titleP, transform: `translateY(${interpolate(titleP, [0,1], [-20, 0])}px)`,
          fontSize: 28, fontWeight: 900, color: C.dark,
        }}>⚙️ How μCap works</div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", maxWidth: 1100 }}>
          {steps.map(({ icon, label, color, bg, delay }, i) => {
            const p = easeIn(frame, delay, 22);
            return (
              <React.Fragment key={label}>
                <div style={{
                  opacity: p, transform: `translateY(${interpolate(p, [0,1], [30, 0])}px)`,
                  flex: 1, background: bg, border: `3px solid ${color}44`,
                  borderTop: `5px solid ${color}`, borderRadius: 16,
                  padding: "20px 10px", textAlign: "center",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                }}>
                  <div style={{ fontSize: 42, marginBottom: 8 }}>{icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color, lineHeight: 1.4, whiteSpace: "pre-line" }}>{label}</div>
                </div>
                {i < steps.length - 1 && (
                  <div style={{ opacity: easeIn(frame, delay + 20, 12), fontSize: 22, color: C.light, flexShrink: 0 }}>→</div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div style={{ opacity: tagsP, display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          {["volume · pitch · onset · envelope", "3,060 annotated clips", "expert guidelines + RAG"].map(t => (
            <div key={t} style={{
              background: C.white, borderRadius: 50, padding: "6px 18px",
              border: `1.5px solid ${C.light}55`, fontSize: 13, fontWeight: 600, color: C.mid,
            }}>{t}</div>
          ))}
        </div>
      </AbsoluteFill>

      <Sub lines={[
        { text: "μCap extracts audio features: volume, pitch, onset.",  from: 5 },
        { text: "A RAG database of 3,060 annotated clips is searched.", from: 150 },
        { text: "GPT-4o generates phonetic-like captions.",             from: 290 },
      ]} frame={frame} total={durationInFrames} />
    </AbsoluteFill>
  );
};

// Scene 5: Caption demo (1110–1440f · 11s)
const CaptionDemoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const tx = txMerge(txSlideRightEntry(frame, 25), txFallExit(frame, durationInFrames, 30));
  const titleP  = easeIn(frame, 5, 18);
  const beforeP = easeIn(frame, 25, 22);
  const afterP  = easeIn(frame, 60, 22);
  const legendP = easeIn(frame, 205, 22);
  return (
    <AbsoluteFill style={{ background: C.bgPurple, ...tx }}>
      <Blob x={36}   y={60}  size={50} color={C.purple + "44"} frame={frame} phase={0}   startFrame={1110} />
      <Blob x={1172} y={550} size={42} color={C.teal + "44"}   frame={frame} phase={1.8} startFrame={1330} />

      <AbsoluteFill style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        fontFamily: "'Segoe UI', system-ui, sans-serif", padding: "44px 80px 110px", gap: 24,
      }}>
        <div style={{
          opacity: titleP, transform: `translateY(${interpolate(titleP, [0,1], [-20, 0])}px)`,
          fontSize: 28, fontWeight: 900, color: C.dark,
        }}>📺 Before vs. After</div>

        <div style={{ display: "flex", gap: 36, width: "100%", maxWidth: 980, alignItems: "stretch" }}>
          {/* BEFORE */}
          <div style={{
            opacity: beforeP, transform: `translateX(${interpolate(beforeP, [0,1], [-40, 0])}px)`,
            flex: 1, background: C.white, borderRadius: 20,
            border: `3px solid #CCC`, padding: "24px 20px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: C.light, textTransform: "uppercase", letterSpacing: "2px" }}>❌ Without μCap</div>
            <div style={{ width: "100%", height: 130, background: "#1A1A2E", borderRadius: 10, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>🎼</div>
              <div style={{ background: "#000", padding: "8px", display: "flex", justifyContent: "center" }}>
                <div style={{ background: "#333", borderRadius: 4, padding: "3px 14px", fontSize: 14, color: "#999", fontFamily: "monospace" }}>[ 🎵 Music ]</div>
              </div>
            </div>
            <div style={{ fontSize: 36 }}>😕</div>
            <div style={{ fontSize: 13, color: C.mid, textAlign: "center", lineHeight: 1.5 }}>No information about<br/>melody, rhythm, or feel</div>
          </div>

          <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: C.light }}>VS</div>
          </div>

          {/* AFTER */}
          <div style={{
            opacity: afterP, transform: `translateX(${interpolate(afterP, [0,1], [40, 0])}px)`,
            flex: 1, background: C.white, borderRadius: 20,
            border: `3px solid ${C.purple}55`, borderTop: `6px solid ${C.purple}`,
            padding: "24px 20px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
            boxShadow: `0 4px 16px ${C.purple}22`,
          }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: C.purple, textTransform: "uppercase", letterSpacing: "2px" }}>✨ With μCap</div>
            <div style={{ width: "100%", height: 130, background: "#1A1A2E", borderRadius: 10, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>🎼</div>
              <div style={{ background: "#000", padding: "8px 12px", display: "flex", justifyContent: "center" }}>
                <PhoneticCaption frame={frame} startAt={65} color="#D0B0FF" />
              </div>
            </div>
            <div style={{ fontSize: 36, transform: `scale(${pulse(frame, 0.12, 0.06)})` }}>🎉</div>
            <div style={{ fontSize: 13, color: C.mid, textAlign: "center", lineHeight: 1.5 }}>Sound-mimetic text with<br/>volume &amp; pitch encoded</div>
          </div>
        </div>

        <div style={{ opacity: legendP, display: "flex", gap: 28, fontSize: 14, fontWeight: 700 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.purple }}>
            <span style={{ fontSize: 20, fontWeight: 900 }}>Aa</span>→ font size = volume
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.teal }}>
            <span>a<sup style={{ fontSize: 9 }}>a</sup></span>→ baseline shift = pitch
          </div>
        </div>
      </AbsoluteFill>

      <Sub lines={[
        { text: "Before: [Music]. After: tang-a-dan ding taradan tting.", from: 5 },
        { text: "Font size = volume. Baseline shift = pitch.",            from: 185 },
      ]} frame={frame} total={durationInFrames} />
    </AbsoluteFill>
  );
};

// Scene 6: Instruments (1440–1680f · 8s)
const InstrumentsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const tx = txMerge(txDropEntry(frame, 25), txSlideLeftExit(frame, durationInFrames, 25));
  const titleP = easeIn(frame, 5, 18);
  const instruments = [
    { icon: "🥁", name: "Drums",                  phonetic: "tuk-tak-dung",    detail: "Transient → consonants\nResonance → vowels", color: C.orange, bg: "#FFF4EC", delay: 28 },
    { icon: "🎻", name: "Strings (Violin/Cello)", phonetic: "zza-za-zan ttu-ru-ru", detail: "High pitch → tense consonants\nLow pitch → 'du' 'ba'", color: C.purple, bg: C.bgPurple, delay: 80 },
    { icon: "🎷", name: "Clarinet",               phonetic: "du-du-wu~",        detail: "Breath-based → vowel-heavy\nSmooth, continuous flow", color: C.teal, bg: C.bgBlue, delay: 132 },
  ];
  return (
    <AbsoluteFill style={{ background: C.bgYellow, ...tx }}>
      <Blob x={38}   y={52}  size={48} color={C.orange + "55"} frame={frame} phase={0} startFrame={1440} />
      <Blob x={1170} y={548} size={44} color={C.teal + "44"}   frame={frame} phase={2} startFrame={1660} />

      <AbsoluteFill style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        fontFamily: "'Segoe UI', system-ui, sans-serif", padding: "44px 60px 110px", gap: 32,
      }}>
        <div style={{
          opacity: titleP, transform: `translateY(${interpolate(titleP, [0,1], [-20, 0])}px)`,
          fontSize: 28, fontWeight: 900, color: C.dark,
        }}>🎼 Each instrument sounds different in text</div>

        <div style={{ display: "flex", gap: 24, width: "100%", maxWidth: 1060 }}>
          {instruments.map(({ icon, name, phonetic, detail, color, bg, delay }) => {
            const p = easeIn(frame, delay, 22);
            return (
              <div key={name} style={{
                opacity: p, transform: `translateY(${interpolate(p, [0,1], [40, 0])}px)`,
                flex: 1, background: bg,
                border: `3px solid ${color}55`, borderTop: `6px solid ${color}`,
                borderRadius: 20, padding: "24px 16px", textAlign: "center",
                boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
              }}>
                <div style={{ fontSize: 52 }}>{icon}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color }}>{name}</div>
                <div style={{
                  background: C.white, borderRadius: 8, padding: "8px 12px",
                  fontFamily: "monospace", fontSize: 16, fontWeight: 700, color,
                  border: `1.5px solid ${color}33`,
                }}>{phonetic}</div>
                <div style={{ fontSize: 12, color: C.mid, lineHeight: 1.6, whiteSpace: "pre-line" }}>{detail}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      <Sub lines={[
        { text: "7 domain experts designed phonetic rules per instrument.",  from: 5 },
        { text: "Drums: attacks → consonants, resonance → vowels.",         from: 110 },
        { text: "Strings rely more on convention and intuition.",            from: 175 },
      ]} frame={frame} total={durationInFrames} />
    </AbsoluteFill>
  );
};

// Scene 7: Results (1680–2100f · 14s)
const ResultsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const tx = txMerge(txSlideRightEntry(frame, 25), txSlideLeftExit(frame, durationInFrames, 25));
  const titleP = easeIn(frame, 5, 18);
  const stat1P = easeIn(frame, 30, 22);
  const stat2P = easeIn(frame, 80, 22);
  const barsP  = easeIn(frame, 110, 20);
  const barManual = spring({ frame: frame - 125, fps, config: { damping: 50, mass: 0.8, stiffness: 150 }, durationInFrames: 40 });
  const barMuCap  = spring({ frame: frame - 155, fps, config: { damping: 50, mass: 0.8, stiffness: 150 }, durationInFrames: 40 });
  const barHeur   = spring({ frame: frame - 185, fps, config: { damping: 50, mass: 0.8, stiffness: 150 }, durationInFrames: 40 });
  return (
    <AbsoluteFill style={{ background: C.bgPurple, ...tx }}>
      <Blob x={48}   y={68}  size={46} color={C.purple + "44"} frame={frame} phase={0}   startFrame={1680} />
      <Blob x={1160} y={88}  size={38} color={C.coral + "44"}  frame={frame} phase={1.8} startFrame={1900} />
      <Blob x={1162} y={510} size={52} color={C.teal + "44"}   frame={frame} phase={3}   startFrame={2100} />

      <AbsoluteFill style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        fontFamily: "'Segoe UI', system-ui, sans-serif", padding: "44px 80px 110px", gap: 24,
      }}>
        <div style={{
          opacity: titleP, transform: `translateY(${interpolate(titleP, [0,1], [-20, 0])}px)`,
          fontSize: 28, fontWeight: 900, color: C.dark,
        }}>📊 User evaluation: 20 DHH participants</div>

        <div style={{ display: "flex", gap: 40, width: "100%", maxWidth: 1000, alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18, flex: 1 }}>
            <div style={{
              opacity: stat1P, transform: `translateY(${interpolate(stat1P, [0,1], [20, 0])}px)`,
              background: C.white, borderRadius: 20,
              border: `3px solid ${C.green}55`, borderTop: `6px solid ${C.green}`,
              padding: "24px 28px", textAlign: "center",
              boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            }}>
              <div style={{ fontSize: 54, fontWeight: 900, color: C.green }}>18 / 20</div>
              <div style={{ fontSize: 14, color: C.mid, lineHeight: 1.5, marginTop: 6 }}>
                DHH participants reported<br /><strong>enhanced music experience ✨</strong>
              </div>
            </div>
            <div style={{
              opacity: stat2P, transform: `translateY(${interpolate(stat2P, [0,1], [20, 0])}px)`,
              background: C.white, borderRadius: 20,
              border: `3px solid ${C.teal}55`, borderTop: `6px solid ${C.teal}`,
              padding: "20px 28px", textAlign: "center",
              boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            }}>
              <div style={{ fontSize: 40, fontWeight: 900, color: C.teal }}>15 / 20</div>
              <div style={{ fontSize: 14, color: C.mid, lineHeight: 1.5, marginTop: 6 }}>
                improved <strong>comprehension</strong> &amp; immersion
              </div>
            </div>
          </div>

          <div style={{
            opacity: barsP, flex: 1,
            background: C.white, borderRadius: 20,
            border: `3px solid ${C.light}33`, padding: "24px 20px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: C.mid, marginBottom: 16, textAlign: "center" }}>
              Caption ranking (1 = best, 5 = worst)
            </div>
            {([
              { label: "Manual",     prog: barManual, raw: 1.85, color: C.green },
              { label: "μCap ✦",    prog: barMuCap,  raw: 3.30, color: C.purple },
              { label: "Heuristic", prog: barHeur,   raw: 4.18, color: C.coral },
            ] as const).map(({ label, prog, raw, color }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 80, fontSize: 12, fontWeight: 700, color, textAlign: "right" }}>{label}</div>
                <div style={{ flex: 1, height: 24, background: "#F0F0F0", borderRadius: 8, overflow: "hidden" }}>
                  <div style={{
                    width: `${(prog * raw / 5) * 100}%`, height: "100%",
                    background: `linear-gradient(90deg, ${color}88, ${color})`, borderRadius: 8,
                  }} />
                </div>
                <div style={{ width: 30, fontSize: 13, fontWeight: 800, color }}>{raw}</div>
              </div>
            ))}
            <div style={{ fontSize: 11, color: C.light, textAlign: "center", marginTop: 4 }}>shorter bar = better rank</div>
          </div>
        </div>
      </AbsoluteFill>

      <Sub lines={[
        { text: "18 of 20 DHH participants: enhanced music listening.",     from: 5 },
        { text: "μCap significantly outperformed all automated baselines.", from: 175 },
        { text: "Manual annotation still leads — μCap closes the gap.",    from: 300 },
      ]} frame={frame} total={durationInFrames} />
    </AbsoluteFill>
  );
};

// Scene 8: CTA (2100–2760f · 22s)
const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const endFade = fadeOutAt(frame, durationInFrames, 30);
  const tx = txMerge(txZoomInEntry(frame, 22), { opacity: endFade });
  const titleP = easeIn(frame, 15, 20);
  const subOp  = easeIn(frame, 200, 22);
  const questions = [
    { text: "Can text ever truly replace the experience of sound?",             color: C.teal,   delay: 50 },
    { text: "How should AI handle accessibility for sensory content?",          color: C.coral,  delay: 90 },
    { text: "What would YOUR favorite song look like as μCap captions?",        color: C.purple, delay: 130 },
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
      <div style={{ position: "absolute", left: "48%", top: 38 + floatY(frame, 0.06, 8, 1.5),
        fontSize: 36, opacity: 0.3 }}>🎵</div>

      <AbsoluteFill style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        fontFamily: "'Segoe UI', system-ui, sans-serif", padding: "0 80px 90px",
      }}>
        <div style={{
          opacity: titleP, transform: `translateY(${interpolate(titleP, [0,1], [-24, 0])}px)`,
          fontSize: 48, fontWeight: 900, color: C.dark, textAlign: "center", marginBottom: 30,
        }}>💬 What do you think?</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%", maxWidth: 820 }}>
          {questions.map(({ text, color, delay }) => {
            const p = easeIn(frame, delay, 22);
            return (
              <div key={text} style={{
                opacity: p, transform: `translateX(${interpolate(p, [0,1], [50, 0])}px)`,
                background: C.white, border: `3px solid ${color}66`, borderLeft: `6px solid ${color}`,
                borderRadius: 16, padding: "14px 24px",
                fontSize: 16, fontWeight: 700, color: C.dark,
                boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
              }}>→ {text}</div>
            );
          })}
        </div>

        <div style={{
          opacity: subOp, marginTop: 28,
          background: C.coral, borderRadius: 50, padding: "12px 36px",
          fontSize: 18, fontWeight: 800, color: C.white,
          boxShadow: `0 6px 24px ${C.coral}55`,
          transform: `scale(${pulse(frame, 0.1, 0.04)})`,
        }}>❤️ Like &amp; Subscribe for more HCI breakdowns!</div>
      </AbsoluteFill>

      <Sub lines={[
        { text: "Can text truly replace the experience of sound?",   from: 45 },
        { text: "What would YOUR music look like as captions?",      from: 125 },
        { text: "Drop your thoughts in the comments! 💬",           from: 215 },
      ]} frame={frame} total={durationInFrames} />
    </AbsoluteFill>
  );
};

// ── Root ──────────────────────────────────────────────────────────────────────
export const MuCapExplainer: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bgYellow }}>
    <Sequence from={0}    durationInFrames={150}><HookScene /></Sequence>
    <Sequence from={150}  durationInFrames={180}><PaperScene /></Sequence>
    <Sequence from={330}  durationInFrames={360}><SurveyScene /></Sequence>
    <Sequence from={690}  durationInFrames={420}><SystemScene /></Sequence>
    <Sequence from={1110} durationInFrames={330}><CaptionDemoScene /></Sequence>
    <Sequence from={1440} durationInFrames={240}><InstrumentsScene /></Sequence>
    <Sequence from={1680} durationInFrames={420}><ResultsScene /></Sequence>
    <Sequence from={2100} durationInFrames={660}><CTAScene /></Sequence>
  </AbsoluteFill>
);
