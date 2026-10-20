# a11y-loop · launch film treatment

**Product:** a11y-loop 0.4.1. An Agent Skill plus a CLI that has a coding agent decide accessibility in the plan, write accessible UI, audit the rendered page in a real browser, fix what it finds, audit again, and say what it could not check.
**The one thing:** your agent's UI gets checked in a real browser, and the loop closes on its own: plan, write, audit, fix, report.
**Personality:** precise, energetic but controlled, accessible, technical, new. The audience is Linear/Vercel-literate developers, and the tone is a developer launch film that refuses to hype.
**Language:** cursor-demo (named by the user: simulated components, cursor, keyboard), on a hybrid route: a continuous UI spine with one montage burst (the five rendering passes) and a second burst (built for agents).
**Material:** a rebuilt agent window and terminal, plus **real screenshots of the repo's demo page** captured in each audit pass (`tools/capture-shots.mjs`). Every CLI string on screen is copied from a real run on 2026-10-20 (a11y-loop 0.4.1, axe-core 4.14.0).
**Narration:** none. On-screen English copy, music and effects.
**Delivery:** 1920×1080, 30 fps, about 62 s, sound-led but readable muted.

## Honesty (from the repo's red lines)
No "compliant", "fully accessible", "guarantees", no score. The count 159 always appears with "demo page · axe-core 4.14.0". The audit-gate hook is labelled as a Claude Code hook. "A clean audit is not a conformance claim" is said on screen.

## Palette
ink #0A0F1C 70% · panel #121A2B / #18223A 15% · text #E8EDF7 · dim #A9B5CC · brand blue #7DA2FF (from the logo's dark-mode stroke) · fail red #FF8A8A · fixed green #5EE0A0 · warn amber #FFC66B. Every text pair is at least 4.5:1, because the film is an accessibility product.
Type: Inter (UI, 400–800), Cascadia Mono (terminal, OFL).

## Rhythm sheet: 120 BPM, 1 bar = 2 s
| stretch | bars | time | energy | events/bar | what happens | music |
|---|---|---|---|---|---|---|
| hook | 1–2 | 0–4 | 6 | 4 | keys press, prompt types into the agent composer, the cursor clicks Send | marimba arpeggio + kick from beat 1, piano motif (e c A) |
| install | 3–5 | 4–10 | 6 | 3 | terminal: `npx skills add …` → Found 1 skill; `a11y-loop doctor` ok lines; agent chips pop | bass enters, snare on 2 and 4 |
| plan | 6–9 | 10–18 | 6→7 | 3 | plan shown; cursor clicks Approve → plan-check FINDING 0 of 7; the agent writes `### Accessibility`; plan-check ok 7 of 7 | half-time, pizz |
| build | 10–11 | 18–22 | 7 | 4 | code streams, the page assembles in the browser | strings enter, filter build |
| gate | 12 | 22–24 | 5 | 2 | "Done." → Stop hook: audit gate blocks | band drops to a held E chord (tension) |
| audit/burst | 13–16 | 24–32 | 8→9 | 6–8 | audit command; **5 passes + open dialog, one per beat**; violation rows pour in; counter → 159; half a bar of silence | full groove, hats in sixteenths, riser into the stop |
| fix (drop) | 17–19 | 32–38 | 10 | 6 | contrast fix #8fa0ab→#697983; rows flip to FIXED; counter 159→0; loop icon spins | !hit! full band, violins sing the motif in octaves |
| converged (hero) | 20–21 | 38–42 | 9 | 2 | `diff` → **Converged: all 159 violations fixed, none introduced**; fixed page | horns, lift to C major |
| honest | 22–24 | 42–48 | 4 | 2 | 0 failures · 44 to review · 15 manual checks; checklist items tick in | vibes + piano, kick only |
| agents/burst 2 | 25–27 | 48–54 | 8 | 4 | six cards slam on half-bars: MCP 6 tools, --json, exit codes, no TTY, GitHub Action, Agent Skills | groove back |
| end | 28–31 | 54–62 | 3 | 1 | logo loop draws, wordmark, tagline, install pill; hold | button chord, then the motif on piano, ringing |

Hook within 3 s: keys are already moving at frame 1. Burst at 26–30 s (42–48%). The hero lands on bar 20 after the drop.

## Four stills
hook 1.8 s · densest 27.2 s (the pass montage) · hero 39.5 s (Converged) · end 58 s.

## Continuity chain
keyboard → the same keystrokes land in the terminal → the cursor carries into the agent window → the gate card → code streams into the browser → the agent's "Done" is blocked → the same terminal runs the audit while the browser cycles passes → the same rows flip to FIXED → the diff line → the summary carries into the checklist → the cards → the loop icon (which spun during the fix) becomes the logo.
The stage tracker at the top (PLAN · WRITE · AUDIT · FIX · REPORT) runs from bar 6 to bar 27 and is the spine.
