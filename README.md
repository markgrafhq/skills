# Markgraf skills

Skills that teach coding agents to write [Markgraf](https://markgrafhq.github.io/)
films: animated system diagrams where dots carry the story along the edges, one
sentence at a time, and the camera dives into boxes to show how they work.

## Install

A plugin updates itself. [skills.sh](https://skills.sh) copies editable files
into your project, and you update them by hand. Pick one per agent.

**Claude Code**

```sh
claude plugin marketplace add markgrafhq/skills
claude plugin install markgraf@markgraf
```

**Codex**

```sh
codex plugin marketplace add markgrafhq/skills
codex plugin add markgraf@markgraf
```

**Any agent, via skills.sh**

```sh
bunx skills add markgrafhq/skills
```

The plugins also bring the matching `markgraf` CLI for Apple-silicon Macs. A
skills.sh install uses `markgraf` on your `PATH`; get it with
`brew install --cask markgrafhq/tap/markgraf`.

## Skills

| Skill | What it does |
|---|---|
| `markgraf` | Writes films that explain a system, protocol or concept: the story, the diagram, the text on the dots, values and calculations. Ships with reference films and checks every draft with `markgraf --check`. |
| `markgraf-terminal` | Validates, renders and plays `.markgraf` files through the CLI, including high-frame-rate playback in Kitty and Ghostty. |
| `markgraf-only` | Opt-in mode that answers in Markgraf. Say "Markgraf-only mode", or "Markgraf above 320 characters" for long answers only; "normal answers" turns it off. |

Ask for a film the way you'd ask a colleague: "Explain how a hash map handles
collisions as a Markgraf film."

## Inline playback in omp

The installable package adds `/markgraf [--background] <path>` and the agent-callable
`markgraf_play` tool to [omp](https://omp.sh). It plays inside omp's normal
terminal layout, keeping the conversation above the player. It does not open
a split, window, or fullscreen terminal player.

Install the prebuilt package from the public
[`markgrafhq/skills`](https://github.com/markgrafhq/skills)
repository, then restart omp:

```sh
omp install github:markgrafhq/skills
```

The package includes its matching native renderer and complete app. No Markgraf
source checkout, PureScript/Rust toolchain, separate CLI installation, or `-e`
argument is required. Installation needs Bun on `PATH`. The default Git branch
is a development snapshot; pin the Git spec to a commit for reproducible installs.

Inside omp:

```text
/markgraf /path/to/animation.markgraf
```

Space pauses/resumes. Left/right arrows navigate keyframes; up/down arrows
move between named scenes; `[` and `]` step backward/forward one frame.
Navigation pauses playback and clamps at the beginning or end.
Home returns to the beginning; `q`, Escape, or
Ctrl-C closes the player and restores the editor. Playback loops and fits the
available terminal size.

Keyframe stops include generated states and land at completed structural
transitions. Scene stops are coarser: named `scene`, `still`, and `title`
sections, including nested diagrams, plus the beginning and end. Up from
within a scene returns to its start; at a boundary it goes to the preceding
scene.

Press `?` to ask about a moment. The player closes and inserts the diagram path,
exact sample time, frame number, and frame rate into your existing composer
draft. Type your question and send it normally; nothing is submitted
automatically. The timestamp comes from the last frame acknowledged by the
terminal, not a clock that keeps advancing while you type. Use the arrows to
find the scene, then `[` and `]` to select a particular frame.

This question shortcut is currently omp-only. OpenCode's published plugin API
does not expose owner-scoped composer editing, so it does not receive a shortcut
that could accidentally change another session's draft.

When opened, the player selects Markgraf's light or dark palette from omp's
active theme, including custom themes; it does not copy individual theme colors.
The diagram background is transparent by default. Use `/markgraf --background <path>`
or pass `"background": true` to the tool to paint theme paper instead.
The tool accepts `{ "path": "/path/to/animation.markgraf" }` and stays
active until the player closes; cancelling it also restores the editor.

The distributed package requires Apple Silicon macOS and a local Kitty-compatible
terminal with Unicode placeholders; verified with omp 18.8.7 in Ghostty.
The native CLI renders with Skia and Markgraf's bundled fonts, then transfers
raw RGBA through private POSIX shared memory. No SVG rasterization, PNG compression,
or base64 pixel transfer runs through omp. omp owns placement and controls,
not frame rendering.

Playback targets 120 fps independently of omp's ordinary text repaint cadence.
Absolute deadlines skip late frames instead of slowing the animation or building
a queue. Only one frame is outstanding; its mapping remains alive until Kitty
acknowledges it, including when playback is cancelled. Paused images survive
resize and screen restoration. Actual throughput depends on scene complexity,
native rendering, GPU readback, and the terminal; 120 fps is not guaranteed.
Remote/shared-memory-incompatible terminals fail explicitly rather than silently
falling back to PNG streaming. No FFmpeg process is used for inline playback.

Both agents install the same `@markgrafhq/markgraf-agents` package, but load their
own host entry points. Playback always uses the renderer inside the installed
package, never an unrelated `markgraf` on `PATH`. Updating the integration
therefore updates the matching renderer too.

## Inline playback in OpenCode

OpenCode **2.0.26** supports the same `/markgraf [--background] <path>` command
and `markgraf_play` tool. OpenCode 1.x does not expose the required plugin API;
installing this package does not upgrade your OpenCode executable.

Install with the OpenCode 2 installer, then restart OpenCode:

```sh
opencode plugin add github:markgrafhq/skills
```

Alternatively, merge this entry into `plugins` in your OpenCode 2
`~/.config/opencode/opencode.json`:

```json
{
  "plugins": ["github:markgrafhq/skills"]
}
```

OpenCode loads both the server tool and its terminal UI entry point. No `omp`
process is involved. Playback is docked immediately above the session composer
or in the home footer, not in a split, dialog, or scrolling transcript message.
Controls, transparent backgrounds, the `--background` opt-in, and the native
Metal/shared-memory rendering path are shared with the omp player. The light or
dark palette is selected from OpenCode's active theme when the player opens.

The tool runs on the active local TUI for the requesting session. Claims are
exclusive and scoped to that OpenCode location; closing the player completes
the tool, and cancellation or an expired connection lease releases playback.
An unclaimed request fails after five seconds rather than reporting a play
that never happened.

Verified with OpenCode 2.0.26 in Ghostty on macOS, including registered-tool
completion/cancellation, competing-client ownership, alternate project
locations, and cleanup while RPC is stalled. A sample delivered approximately
238 acknowledged frames per second; this is not a display-refresh guarantee.
The distributed package requires Apple Silicon macOS, local Kitty shared memory,
Unicode placeholders, and true color. SSH, terminal multiplexers, Windows,
and terminals without that graphics path are not supported.

Markgraf-specific adapters are distributed together under `markgrafhq`.
Reusable host bindings remain in
[`rowtype-yoga/purescript-opencode`](https://github.com/rowtype-yoga/purescript-opencode).

### Native licenses and source

The complete app's third-party notices are included under
`native/Markgraf Editor.app/Contents/Resources/licenses/`.
The bundled FFmpeg/x264 [corresponding source archive](https://github.com/i-am-the-slime/purescript-native-encoding/releases/download/v0.0.2/ffmpeg-corresponding-source-v0.0.2.tar.gz)
contains the matching sources, build recipe, and license notices.
