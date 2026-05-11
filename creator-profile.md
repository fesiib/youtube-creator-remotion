# Creator Profile

> **What this is:** a project-agnostic record of Sehoon's editorial taste. Loaded at the start of every editing collaboration to align the agent. Updated through interview, explicit revisits, or implicit observations during work.
>
> **What this isn't:** a brief for any specific video, channel-management instructions, or technical setup notes. Those live elsewhere.

**Creator:** Sehoon Lim (@sehoon1106)
**Channel:** HCI / CS research explainer (YouTube)
**Profile version:** 1
**Last updated:** 2026-05-12

---

## 1. Channel identity

- **One-sentence description:** A channel that explains HCI and CS research papers through cute, energetic animations
- **Audience (who watches and why):** Students and researchers interested in HCI/CS, and general viewers who find it difficult to read papers directly
- **Value proposition (why this channel and not another):** Explanations are grounded in depth because the creator has personally replicated and implemented the research
- **Adjacent channels in the space:** _[TBD]_

## 2. Format & rhythm

- **Typical length range:** ~90 seconds (short-form explainer)
- **Standard structural template:** Hook → Paper intro → Study method → Conditions → Results → Implications → Creator's replication → CTA
- **Pacing philosophy:** 2–3 subtitle lines per scene; don't linger on a single scene too long
- **Recurring beats:** Intro hook, subtitle system, CTA (like/subscribe + 3 open questions)

## 3. Voice & writing

- **Register:** Friendly and conversational, not academic
- **Humor style:** Cute emojis and visual humor (visual gags over text gags)
- **Signature phrases or verbal tics:** _[TBD]_
- **Words / tones to avoid:** Listing dry academic jargon verbatim
- **Example of "very on-brand" line:** "Just seeing altered photos changed what they 'remembered.'"
- **Example of "off-brand, would never say" line:** "This study demonstrates a statistically significant correlation between..."

## 4. Hook strategy

- **Hook archetype(s):** Open with a shocking question or counterintuitive fact ("What if AI-edited photos could alter your memory?")
- **Hook archetypes to avoid:** Long self-introductions, starting with a subscribe prompt
- **Typical hook length:** ~5 seconds
- **Pattern interrupts:** A visual illustration appears to grab attention

## 5. Cuts & pacing

- **Jump-cut density:** _[TBD]_
- **When to let a moment land:** Slight pause on result figures or dramatic points
- **Breathing room rules:** Transitions provide rhythm between scene changes
- **Scene transition style:** Use contextually appropriate transitions (slide, zoom-in, free fall, etc.) — never repeat the same transition on every scene

## 6. B-roll philosophy

- **Approach:** Custom illustrations built with CSS/React (no live footage)
- **Style:** Simple abstract illustrations — FakePhoto, BrainSplit, BrowserMockup, etc.
- **Stock footage:** Not used

## 7. Visual treatment

- **Overall aesthetic:** **Cute, bright, and active** — modern or elegant styles are prohibited
- **Color palette:** Pastel and vivid combinations of coral, teal, purple, orange, green, blue, and yellow. Backgrounds in soft cream, mint, or purple tones
- **Screen content:** No text-heavy layouts. Prioritize illustrations, emojis, shapes, and animations
- **Subtitles:** Content delivered via dark pill-style subtitles fixed at the bottom of the screen
- **Text-on-screen:** Minimal — titles and labels only; main content goes in subtitles
- **Motion graphics:** Background blobs always drift slowly as if swimming. Explanatory figure emojis are mostly static; animate selectively only at emphasis points
- **Zoom / punch-in:** Used contextually for scene transitions

## 8. Music & sound design

- _[TBD]_

## 9. Captions & on-screen text

- **Always-on captions:** Custom subtitle system (fixed pill at bottom of screen)
- **Caption style:** Dark semi-transparent background, white text, fontSize 22, fontWeight 600
- **On-screen text density:** Low — subtitles carry the content; screen is dominated by visuals
- **Subtitle zone:** Always keep the bottom 80–120px clear as a dedicated subtitle space (no content overlap)

## 10. Thumbnails & titles

- _[TBD]_

## 11. Recurring bits & motifs

- Colored blobs floating in the background (always present, starting from different positions and directions each scene)
- Rotating ⭐ ✦ decorative elements
- Elements slide/fade in at scene start
- CTA scene's 3 open-question cards

## 12. Taboos

- **No bounce/overshoot animations:** Do not use spring effects where elements grow past their target size before settling. Use `Easing.out(Easing.cubic)` or high-damping springs (`damping ≥ 50`)
- **No repeating the same transition on every scene:** Using only dissolves is boring
- **Do not animate all explanatory emojis:** Looks chaotic. Only animate background objects and emphasis points
- **No layouts where subtitles overlap content:** All scenes must have bottom padding reserved
- **No text-heavy screens:** Fill the screen with visuals; deliver explanations through subtitles

## 13. Reference creators

- **Admires / learns from:** _[TBD]_
- **Adjacent but distinct from:** _[TBD]_
- **Specifically does not want to resemble:** Stiff, slide-presentation-style explainer videos

## 14. Open questions / pending observations

- Korean subtitles vs. English subtitles — direction undecided
- Channel name and URL — undecided
- Background music preferences — undecided
- Thumbnail formula — undecided
- Video length — whether 90-second short-form is right, or longer formats should be considered

---

## Changelog

- 2026-05-12 — All sections — Initial draft. Based on feedback collected during the first HCI explainer video (CHI '25 false memory paper). (implicit, observed 4+ times)
