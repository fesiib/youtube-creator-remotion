# Applying the Profile

This document covers what to do *with* a loaded profile during an editing collaboration, and — equally important — what *not* to put back into the profile.

## The project-agnosticism rule

The single most important constraint on this skill: **the profile contains only stable cross-project taste; never project-specific decisions.** Both directions of this matter:

- **Don't pollute the profile.** When something is true of one video but not the channel, it does not go in the profile, no matter how confident the creator was about it for that video.
- **Don't let the profile override considered project decisions.** The profile expresses defaults. A specific video can override any default for a good reason. The agent should follow the project's intent and surface the deviation, not refuse to deviate.

### Examples — what goes in the profile

✅ "Cold opens are typically 60–90 seconds with a personal anecdote framing the topic."
✅ "Music is lo-fi instrumental hip hop, no lyrics under voiceover."
✅ "Never uses the word 'guys' in voiceover; prefers 'folks' or no address term."
✅ "B-roll is roughly 60% original footage, 30% archival, 10% stock — never AI-generated."
✅ "Thumbnails always have the creator's face, surprised expression, large yellow text on left third."

These describe the channel's persistent taste. They hold across many videos.

### Examples — what does NOT go in the profile

❌ "For the Q4 retrospective, we want a 30-second cold open." (project-specific length decision)
❌ "Use the track 'Floating Through the Algorithm' for the next three videos." (project-specific music choice)
❌ "The thumbnail for the AI ethics video should have a robot in the background." (project-specific visual)
❌ "The hook for the next video is 'I almost got sued for this.'" (project-specific copy)
❌ "Cut the bit about my cat in episode 47." (project-specific edit note)

These belong in a per-project brief or per-video notes — somewhere outside the profile. If the agent is keeping working notes for a specific video, they should be in a separate document, not folded into the profile.

### The fuzzy middle — and how to resolve it

Some observations look project-specific but are actually pointing at cross-project taste. The test:

> If the creator made a similar choice on three other videos without thinking about it, it's taste. If the choice required deliberation specific to this video's content, it's project-specific.

Examples:

- "We let the silence sit for 4 seconds after the punchline in this video" — looks specific, but if the creator does this consistently after punchlines, the profile entry is "Let silence sit ~3–5 seconds after punchlines before cutting away," not the specific timestamp.
- "We chose lo-fi for this video" — if every video uses lo-fi, the profile entry is the genre preference. If this video specifically used lo-fi to contrast with louder upcoming content, that's project-specific.

When in doubt, observe more before promoting to the profile. The implicit-update threshold rule (≥2 instances or explicit correction or direct contradiction) handles this naturally.

## How to apply the profile during editing work

Once the profile is loaded, treat it as context for every editorial recommendation. A few patterns:

### Use it as a default, not a law

The profile sets the prior. Project-specific direction sets the actual decision. When the project brief is silent on something, fall back to the profile. When the project brief contradicts the profile, follow the project brief and note the deviation:

> "Going with a 30-second cold open here per your brief, even though your usual is 60–90s — flagging in case it's an oversight."

This catches accidental drift without overriding intent.

### Cite the profile when making recommendations

Don't make recommendations as if from nowhere. When the profile is the basis, say so:

> "Suggesting a match cut on the door close — your profile notes a preference for match cuts as scene transitions, and this is a clean opportunity."

This does two things: it shows the creator the profile is being used, and it makes profile errors easier to catch ("actually, that's not really my style anymore — let's update").

### Notice contradictions, don't paper over them

When the creator's current request conflicts with the profile, surface it rather than silently complying or silently resisting:

> "The profile says you avoid stock B-roll, but you're asking for stock here. Want me to find original footage instead, or is this an exception, or has your stance shifted? (If shifted, this is a profile-update moment.)"

A contradiction is a flag for an explicit update — don't waste it.

### Respect the profile's gaps

Empty sections in the profile mean *the creator hasn't decided yet* (or hasn't articulated it). Don't fabricate. If the music section is blank and the agent needs to suggest music, say so:

> "Your profile doesn't have a music preference noted yet. Want to set one now (and I'll add it to the profile), or leave it open and we'll decide per video?"

The first option promotes from nothing to a profile entry. The second leaves it as a per-project decision.

## What lives where — quick reference

| Type of decision | Lives in |
|---|---|
| "I prefer lo-fi music in general" | Profile (Music & sound design) |
| "Use this specific track for this video" | Project brief / per-video notes |
| "I never use stock B-roll" | Profile (B-roll philosophy) |
| "For this video we're using stock because the topic is global" | Project brief, with a note flagging deviation from profile |
| "My channel is for indie game devs in their 20s–30s" | Profile (Channel identity) |
| "This particular video targets newcomers, so explain jargon more" | Project brief |
| "Words I never use: 'epic,' 'literally,' 'guys'" | Profile (Voice & writing → taboos) |
| "For this sponsored segment, the brand wants us to say 'gamechanger'" | Project brief, possibly flagged as conflicting with profile |

The pattern: **profile = persistent identity, project brief = this video's specifics.** If both exist, project brief wins for the current work, and any deviation gets surfaced.
