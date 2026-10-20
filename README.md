<div align="center">

# a11y-loop · launch film

**A 64-second launch film for [a11y-loop](https://github.com/ChanMeng666/a11y-loop), written as code.**

One HTML file is the whole film: a rebuilt agent window, terminal, keyboard and cursor walk through a11y-loop's full workflow, cut on the beat to a score played by sampled instruments.

</div>

https://github.com/user-attachments/assets/117274d5-ca7b-4d12-bd75-aea07845cc07

<div align="center">

**Watch on YouTube:** [youtu.be/Qg5QCE_V0Pg](https://youtu.be/Qg5QCE_V0Pg) · **Download:** [release v1.0.0](https://github.com/ChanMeng666/a11y-loop-promo-film/releases/tag/v1.0.0)

</div>

## What the film shows

The stage tracker at the top of the frame (PLAN · WRITE · AUDIT · FIX · REPORT) carries the viewer through one complete loop:

| Time | Scene | What happens on screen |
|---|---|---|
| 0:00 | Hook | Keys press on a simulated keyboard and a prompt types into an agent's composer. The cursor clicks Send. |
| 0:04 | Install | `npx skills add`, `npm i -g a11y-loop`, `a11y-loop install-browser` and `a11y-loop doctor` in a terminal, plus the agents the skill runs in. |
| 0:10 | Plan | The cursor clicks Approve. The plan gate answers "Plan items answered: 0 of 7". The agent writes an accessibility section and the same card turns green, 7 of 7. |
| 0:18 | Write | Markup streams into an editor while the page assembles in a browser. This is the repo's seeded demo page, labelled as such. |
| 0:22 | Audit gate | The agent says "Done". A Claude Code Stop hook asks for the audit first. |
| 0:24 | Audit | `a11y-loop audit` runs. The browser cycles the five rendering passes (default, dark, forced colors, reduced motion, 320 px reflow) and an open-dialog state, one per beat, while violations pour in to 159. Half a bar of silence follows. |
| 0:32 | Fix | On the drop: `a11y-loop contrast --fix` turns `#8fa0ab` (2.69:1) into `#697983` (4.50:1). The re-audit against `demo/after` flips every row to FIXED. |
| 0:38 | Converged | `a11y-loop diff` reports "Converged: all 159 violations fixed, none introduced." |
| 0:42 | Report | No automatically detectable failures, 44 to review, 15 manual checks, and the checklist of what automation cannot judge. "A clean audit is not a conformance claim." |
| 0:48 | Built for agents | MCP server with six tools, JSON and SARIF reports, exit codes as a contract, headless commands, the GitHub Action, an open Agent Skill. |
| 0:54 | End | The loop logo draws itself; the install command and repository follow. |

## How it was made

- **The film is code.** `index.html` is a [huashu-motion](https://github.com/alchaincyf/huashu-motion) composition: HTML, CSS and one paused GSAP timeline, rendered frame by frame in Chrome. Typing, keyboard presses, the cursor, the stage tracker and the violation counter are all computed from the timeline's time, so every frame renders the same way twice.
- **Real material only.** Every CLI string on screen was copied from real runs of a11y-loop 0.4.1 (axe-core 4.14.0) on 2026-10-20. The browser shots are the a11y-loop demo page, captured in each audit pass by `tools/capture-shots.mjs`. The 159 is always shown with its context: the repo's seeded demo page at axe-core 4.14.0.
- **Score first, picture on the grid.** `tools/score.mjs` writes the score in ABC notation into `index.html`: 120 BPM, A minor resolving to C major, 31 bars and nine voices. All of them are sampled instruments: grand piano, marimba, pizzicato and string sections, violins, horn, vibraphone, finger bass and a recorded drum kit. Each scene label sits on a bar line, so every cut lands on a beat, and more than 200 sound effects (keys, clicks, pops, hits) land on the frames they belong to.
- **Checked before release.** `om check` (layout, contrast, motion rules), `om qa` on each render (no single-frame pops, 12 hard cuts, all on the beat), loudness measured with ffmpeg, and a cold review by a separate agent whose three release blockers were fixed. The plan is in [`treatment.md`](treatment.md).

| | |
|---|---|
| Format | 1920 × 1080, 30 fps, H.264 + AAC |
| Length | 64 s |
| Loudness | −14.5 LUFS integrated, true peak −1.3 dBTP |
| Copy | English, on screen; no narration |

## Repository layout

```
index.html               the film (composition variables, scenes, timeline, om-score)
treatment.md             rhythm sheet, beat map, palette, continuity chain
assets/shots/            demo-page screenshots per audit pass
assets/fonts/            Inter and Cascadia Mono (SIL OFL 1.1)
vendor/                  GSAP and the huashu-motion runtime
tools/score.mjs          writes the ABC score into index.html and checks every bar's length
tools/capture-shots.mjs  recaptures the screenshots from an a11y-loop checkout
```

## Rebuild it

Requirements: Node 22+, Chrome or Edge, FFmpeg, and [huashu-motion](https://github.com/alchaincyf/huashu-motion).

```sh
npx huashu-motion samples build        # once per machine: the sampled-instrument pack (~50 MB)
node tools/score.mjs                   # only after editing the score
npx huashu-motion check .              # expect 0 errors
npx huashu-motion studio . --no-open   # live preview; press C on a frame to leave a comment
npx huashu-motion render .             # writes out/<name>-vN.mp4 and rebuilds assets/sound.wav
npx huashu-motion qa .
```

Without the sample pack the score still plays, on synthesized instruments.

**On Windows**, `samples build` calls `bsdtar`. Windows ships it as `C:\Windows\System32\tar.exe`; put a copy named `bsdtar.exe` on your `PATH`.

**Mastering for social platforms.** `om render` limits the soundtrack to −1.5 dBFS sample peak, but after AAC encoding the true peak measured −0.6 dBTP. The published file re-muxes the rendered video (stream copy) with the WAV master through a measured two-pass `loudnorm=I=-14.5:TP=-2:LRA=11:linear=true`, then AAC at 256 kb/s. Always start from `assets/sound.wav`: re-encoding the AAC track pushed the peak above 0 dBTP.

To recapture the screenshots, keep an a11y-loop checkout with its browser installed next to this folder (or point `A11Y_LOOP_DIR` at it), then run `node tools/capture-shots.mjs`.

## Credits and license

Code: MIT, © 2026 Chan Meng ([LICENSE](LICENSE)). The film, its score and soundtrack, and the screenshots: CC BY 4.0, credit "a11y-loop launch film by Chan Meng" ([LICENSE-MEDIA.md](LICENSE-MEDIA.md)). Third-party pieces keep their own licenses (GSAP, the huashu-motion runtime, the fonts, the instrument samples); see [`THIRD_PARTY.md`](THIRD_PARTY.md). The film was directed and built with Claude Code using the huashu-motion skill.

a11y-loop: [repository](https://github.com/ChanMeng666/a11y-loop) · [docs](https://ChanMeng666.github.io/a11y-loop/) · [npm](https://www.npmjs.com/package/a11y-loop)
