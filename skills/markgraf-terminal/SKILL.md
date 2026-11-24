---
name: markgraf-terminal
description: Validates, renders and opens Markgraf diagrams through the native CLI. Use when asked to check, preview, play, or export a .markgraf file as a still, frame, sequence diagram, or MP4 video.
---

# Markgraf CLI rendering

Use the native CLI, not an agent-specific renderer or a patched coding agent.

## Locate the CLI

- When this skill is installed as the Markgraf plugin, prefer its bundled executable at `native/Markgraf Editor.app/Contents/MacOS/markgraf` under the plugin root. Resolve the actual installed root; do not guess a cache path.
- With a standalone skill installation, use `markgraf` on `PATH`. Check availability with `command -v markgraf` and inspect `markgraf --help` when capabilities are uncertain.
- Quote executable and input paths. Keep the native executable beside its `ffmpeg` and `markgraf-editor` siblings; do not copy it out of the app.
- If no CLI is installed, report that prerequisite rather than inventing a renderer or installing software without permission.
- The distributed native app requires Apple Silicon macOS. Do not claim it runs on Windows or Linux.

The examples below assume the selected executable is available as `markgraf`.

## Validate

Validate the actual file before presenting a newly created or changed diagram:

```sh
markgraf "animation.markgraf" --check
```

- `--check` prints OK or the problem and exits with status 1 on a problem. Add `--color` for colored diagnostics in an interactive terminal.
- Fix every reported problem and check again before exporting or opening the film.
- Prefer file input. For deliberate stdin input, the CLI also accepts `markgraf - --check < "animation.markgraf"`.

## Export

```sh
markgraf "animation.markgraf" --still '' -o "still.svg"
markgraf "animation.markgraf" --frame 0 -o "frame.png"
markgraf "animation.markgraf" --frame 4.5 -o "frame.svg"
markgraf "sequence.markgraf" --sequence "sequence.png"
markgraf "animation.markgraf" -o "animation.mp4"
```

- `--still NAME` renders one named `still` or `title`; `''` selects the first one. `--frame SECONDS` renders the film at that time.
- The output extension selects the format: `.png`, `.svg`, or `.mp4` (H.264).
- PNG/SVG exports are transparent outside the diagram unless `--background` is requested; MP4 is opaque.
- Use `--theme NAME` (`light`, `dark`, `blueprint`, `whiteboard`, or `isometric`) when the desired look is known. Do not infer a palette from the OS theme.
- `--fps`, `--scale`, `--max-width`, `--max-height`, and `--min-text-px` tune exported output. Video defaults to 60 fps.
- Exports run headless and do not open a window.

## Open in the editor

```sh
markgraf "animation.markgraf" --play
```

- `--play` opens the film in the native Markgraf editor window, which owns playback, scrubbing, sizing, and the system light/dark theme. File input is watched, so later edits to the file appear in the editor.
- Rendering overrides (`--fps`, `--scale`, `--max-width`, `--max-height`, `--min-text-px`, `--theme`, `--background`) are rejected with `--play`; do not pass them.
- Open the editor only when the user asks to play or preview the film. Do not open it as a silent fallback for a failed export.

## Report

Report the generated paths and only the behavior actually observed. Do not substitute an export for playback without saying so, and do not describe an exported file as having been played.
