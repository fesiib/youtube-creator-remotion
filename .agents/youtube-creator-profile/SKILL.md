---
name: youtube-creator-profile
description: Builds and maintains a project-agnostic editorial-taste profile (creator-profile.md) for a YouTube creator the agent assists. Use this skill when a creator is onboarding the agent for the first time and no profile exists yet, when the creator asks to update their profile, when the agent notices contradictions or persistent gaps in its understanding of the creator's taste, or when the agent observes a clear new preference pattern worth capturing for future sessions. Also trigger this whenever an editing collaboration starts fresh and the agent should look for an existing profile to load and review accumulated pending observations. The skill covers the initial interview, explicit and implicit update flows, and how to apply the profile to concrete project work without conflating cross-project taste with project-specific decisions.
---

# YouTube Creator Profile

Aligns the agent with a YouTube creator's editorial taste through a long-lived markdown profile (`creator-profile.md`) maintained alongside the creator's editing work.

## At the start of every session

1. **Load the profile** from the established location.
   - If no location is established (first contact or new environment), ask the creator. If no profile exists yet, suggest a writeable path the agent can read and write across sessions (e.g., `~/creator-profile.md` or alongside the creator's editing project files), confirm, then proceed to **Initial interview**.
   - When found, confirm: *"Loaded profile from \<location\>, last updated \<date\>."*

2. **Review accumulated pending observations.** Open `## Open questions / pending observations` in the profile. For any items that look ready to resolve or are relevant to today's work, surface them:
   > *"Last session I noted \<X\> as a pending observation — want to confirm or revise that as part of today's work?"*

   If nothing is ready or relevant, proceed silently.

## Mid-session updates

Updates happen inline through the four flows below. No re-invocation of this skill is needed mid-session; stay watchful for triggers continuously while applying the profile to editing decisions.

## The four flows

### 1. Initial interview — no profile yet

Run a structured interview producing a first version of `creator-profile.md`. Do a **core pass** (channel identity, voice, taboos, reference creators), then offer to go deeper section by section. Save to the agreed location and add an initial changelog entry.

Full protocol: **`references/interview-protocol.md`**.
Schema: **`references/profile-template.md`**.

### 2. Explicit update — creator-driven or agent-flagged

Triggered by:
- Creator says "update my profile" / "let's revisit \<section\>."
- Creator volunteers a clear preference unprompted.
- Agent hits a **contradiction** between current feedback and the profile.
- Agent encounters an **empty or insufficient section** during editing work and asks a direct question to fill it (can be as small as a single A/B/C choice — no need for a full re-interview).

In all of these, the creator is an *active participant* in the change — their answer is interview-quality data. Apply immediately to the relevant section, no threshold rule. Output the rewritten profile and add a changelog entry. **No inline notice required** — the creator already knows the change happened; the changelog is the audit trail.

Use elicitation techniques from `references/interview-protocol.md` when more than a single question is needed.

### 3. Implicit update — agent-driven, passive observation only

For **patterns the agent picks up from the creator's behavior, comments, or reactions during editing work** — *not* answers to questions the agent asked. (Active elicitation, including small gap-filling Q&A, is flow 2.)

**Apply immediately only if** at least one is true:
- The creator gave an **explicit correction** ("no, slower cuts here").
- The same preference appears in **≥2 instances** within the session.
- The observation **directly contradicts** the existing profile.

Otherwise, add the observation to `## Open questions / pending observations` and leave the main sections alone. It will be reviewed at the next start-of-session pass — and if still worth raising, surfaced to the creator then.

When applying:

1. Edit the relevant section of `creator-profile.md`.
2. Add a changelog entry marked `implicit`.
3. Surface a one-line inline notice — the creator wasn't part of this change and needs to see it to maintain audit:
   > *"📝 Updated profile → \<section\>: \<change\>. Say 'revert' if not right."*

If the creator pushes back, revert and move the observation to pending.

### 4. Applying the profile during editing

Treat the profile as default, not law. Project-specific direction overrides defaults; surface deviations rather than silently complying or resisting. Cite the profile when it's the basis for a recommendation. For empty sections, ask rather than fabricate.

Full guidance and the project-agnosticism rule: **`references/applying-the-profile.md`**.

## Changelog format

Every profile carries a `## Changelog` at the bottom — append-only, newest first:

```
- 2026-05-10 — Cuts & pacing — Added "leave 1–2 beats after punchlines." (implicit, ≥2 instances)
- 2026-04-22 — Voice & writing — Removed "uses 'literally' as intensifier." (explicit correction)
- 2026-04-15 — Initial population. (interview, sections 1–4)
```

Format: `date — section — what changed. (explicit | implicit | interview, brief evidence)`.
