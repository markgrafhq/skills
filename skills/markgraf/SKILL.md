---
name: markgraf
description: Writes Markgraf films — animated diagrams where dots carry prose along the edges of a system and the camera dives into boxes. Use when asked to explain a system, protocol, algorithm, race condition or concept as a Markgraf animation, or when writing or editing a .markgraf file.
---

# Writing Markgraf films

A Markgraf file is a short film about a system. Boxes are the parts, edges the
connections, travelling dots the things that move, and the text they carry is
the narration. The viewer reads one sentence at a time while watching something
happen. Your job is a film that a smart outsider understands on first watch.

Before writing, read one film in `references/` that resembles your topic:

| Film | Shows |
|---|---|
| `idempotency-key.markgraf` | the failure first, then the fix on the same diagram; a decision diamond; a visible sink for a lost reply |
| `last-seat.markgraf` | two people racing for one thing; one dot text at a time |
| `cruise-control.markgraf` | a concept built up layer by layer; values flying into calculations; a dive into one box |
| `mvcc.markgraf` | state as tables on its owner; one box visited twice through a dive |

Check every draft with `markgraf --check file.markgraf` until it prints `OK`,
and fix what it reports instead of working around it.

## The story

- **Open with the question, established before specifics.** A narration card
  first: who, where, why it matters, then the problem. "You set cruise control
  to 100. The road starts to climb." Only then details like "seat 14".
- **The protagonist is "You"**: `+ you "You" {shape: user}`, second person in
  all text. Other people (a rival) get a name. Never a device standing in for
  the person. "You" is the person with the goal, even when a machine does the
  work afterwards.
- **Write like a magazine feature, not a spec.** Concrete nouns, numbers and
  consequences. No unexplained metaphors, no insider shorthand ("spins",
  "returns 200"). Say what the person sees or what physically happens.
- **One word per concept** across text, box titles and fields.
- **Show the failure first, then the fix on the same diagram.** The fix should
  be a visible change in the shape: a new box, a decision diamond, a rerouted
  edge (`~ a -> b => a -> c`).
- **Chapters.** Named scenes, separated by `still "one-line summary" {}` pauses.
- **Vary the shape.** Not every film is request → failure → fix. A concept can
  be built up layer by layer, each layer showing what the previous one could
  not do. A bug can be a detective story with false leads.
- **Never show something false.** If the text says a reply was lost, do not
  animate it arriving; send it to a visible sink box (e.g. `Nowhere`, cloud).
- **Introduce every unit and constant before you use it — once, in one short
  sentence:** "Present gives 2% gas for every km/h you are short." Nothing may
  appear in a calculation that the viewer has not been told about.
- **But don't overexplain.** Say only what the viewer needs to follow the next
  beat. If a sentence could be cut without the viewer getting lost, cut it.
- **The deciding fact comes first, and is shown.** If everything hinges on "the
  hill needs 20% gas", let the viewer see it before any calculation.
- **Show, don't tell.** At most one narration card in a row. If you need a
  second card to explain what happens, animate it instead.

## The diagram

- **The shape carries the logic.** A straight chain where only the text changes
  is a slideshow. Decisions are diamonds with labelled branches; remembered
  state is a field on a box.
- **State belongs to the box that owns it.** A box is something that acts or
  is acted on (a person, a service, a database). Rows, logs, versions, queues
  and counters are fields of their owner — usually a list or table — not boxes
  of their own. A rule a component applies (a check, a decision) is a
  mechanism inside that component: show it in a dive.
- **Boxes are parts of the system, never actions.** "Charge" or "Replay" are
  not boxes; they are branches and dot text. Results land in real parts (a
  throttle, a ledger), never in boxes called "Total" or "Result".
- **Box titles are short real names:** mostly one word, at most three.
  "Cruise Control", not "Cruise"; "Speedometer", not "Speedo".
- **Reveal progressively.** Add each box and edge right before the story first
  needs it.
- **At most six boxes on screen at once, per level.** The checker enforces it
  and names a group of boxes that share their inputs and outputs. Make such a
  group one box and reveal its parts in a dive with `inside`/`into`. Show first
  *that* the box works from the outside, then dive in to show *how*.
- **The whole level must fit a normal screen.** The checker measures it: if a
  level cannot fit 1280×720 at comfortable text size, dive, or combine values
  into fewer fields (a list or table instead of one field or box per item).
- **Edge discipline.** One edge per real relationship. Never add an edge only to
  carry a single dot; remove edges the story no longer needs (`- a -> b`).
- **Layout steering:** a box with nothing pointing into it sits in the top row.
  To put a box beside another at the top, write its edge from it, undirected if
  no arrow should point back: `+ nowhere -- orders`, dot `nowhere <~ orders`.
  An undirected return edge (`+ cruise -- car`, dot `cruise <~ car`) keeps a
  column straighter than a loop. External forces (a hill, the weather) are
  better narrated than drawn as boxes.

## Text

- **Dot text is a carousel.** Each line of a `|...|` label is one slide shown
  on its own while the dot travels. Every line must be a complete sentence that
  makes sense alone, at most 40 characters. One to four lines per hop.
- **Text belongs to the dot it rides on.** Never put someone else's message on
  a dot.
- **Narration card lines are at most 60 characters** (40 reads better).
- **Narration is not a dot.** If nothing actually flows from A to B, the
  sentence is a narration card, not a hop on an arbitrary edge:
  ```
  + note |The road climbs.
  The hill pulls the car back.| {shape: exposition}
  - note
  ```
  Put a card before or after a dive, not in the middle of the camera's move.

## Values and calculations

- **Field kinds** — pick the one that matches the thing:
  - number: `+ car.kmh = 90`
  - text (quoted): `+ server.role = "Follower"`
  - list: `+ log.entries = [1, 2, 3]`; change one cell with `~ log.entries[0] = 7`;
    highlight it with `attention log.entries[0]`
  - table: `+ store.rows = {}`; set a row with `~ store.rows key 3 = true`

  A sequence (a log, versions of a row, a queue) is a list or table, never a
  string like `"1:x 3:y"` and never one field per item.
- Fields live on plain rectangle boxes only, and are listed alphabetically
  inside a box whatever order you declare them in.
- **One change at a time.** Never change several values in one `par`.
- **Highlight before changing:** `attention car.kmh`, then the change.
  `attention` targets a field, a list cell or a slot, never a whole box.
  `attention clear` ends it.
- **Values fly from where they come from:** `copy gap.short -> present.adds: caption`.
  A caption is optional; keep it short.
- **Calculations happen visibly in a box's label:**
  ```
  ~ throttle |Throttle
  `{{p: ?}}` + `{{i: ?}}` = `{{r: ?}}`|
  attention present.adds
  copy present.adds -> throttle slot p: Present adds 3.
  attention past.adds
  copy past.adds -> throttle slot i: Past adds 2.
  ~ throttle.r = 5
  attention throttle.level
  copy throttle slot r -> throttle.level: 5 goes into level.
  ~ throttle |Throttle|
  ```
  Always end a calculation by collapsing the label back to its title, or the
  stale formula stays on screen. Slots that receive values must be in
  backticks (monospace, like fields). A copy needs no edge and may stay within
  one box. `~ box.r = 5` on a box with a slot `r` but no field `r` stores the
  result in the slot so it can fly on. Name fields by their meaning (`sum`,
  `last`, `adds`), never placeholders like "value".
- **Rewinding** ("same hill, now with the fix") is fine: reset the values one
  at a time with `~`, then replay. A narration card can say "Back to the foot
  of the hill."

### What values cannot do yet

Design around these; the checker rejects them:

- A table cannot be highlighted or copied from (`attention db.rows`,
  `copy db.rows[3] -> …`). Narrate the row, or keep the value you need to fly
  in a number field as well.
- A list cannot grow or be replaced (`~ log.entries = [1, 2, 3, 4]`). Declare
  it at its final length and fill cells with `~ log.entries[3] = 4`.
- A field cannot be removed or change kind (number ↔ text ↔ list).
- Values do not flow into a dive by themselves: copy what the inside needs into
  a field of an inner box at the start of the visit and say where it came from.

## Syntax reference

```
seed 1
still question { + intro |Narration card.| {shape: exposition} }   # opening card
scene "Chapter title" { - intro  ... }                             # animated chapter
still "Pause summary" {}                                           # pause between chapters

+ api "API"                       # box (title in quotes)
+ db "Ledger" {shape: cylinder}   # shapes: rectangle, cylinder, diamond, cloud, user, drum, ellipse, document
+ api -> db                       # directed edge;  + a -- b  undirected
+ seen -> bank: No                # edge label
~ a -> b => a -> c                # reroute an edge
- api -> db                       # remove an edge (remove a box's edges before the box)
- api                             # remove a box

api ~> db |One sentence per line.
Another sentence.|                # dot from api to db (needs an edge)
api <~ db |Reply.|                # dot from db back to api along the same edge

par { ... }                       # simultaneous beats
```

Dives: a box's inside is told in one or more `inside` blocks. Each `into box`
plays the next block, and the inside keeps its boxes and values between
visits, so you can alternate: outside (what happens) → inside (why) → outside
(the effect) → inside again. With a single block, every dive replays it.

```
+ cruise "Cruise Control"
...
into cruise          # first visit: plays the first inside block
out
...                  # outside: show the effect
into cruise          # second visit: plays the second inside block
out
inside cruise {
  scene "Inside: ..." {
    + gap "Gap"
    ...              # dots between inner boxes are written inside a block
  }
}
inside cruise {
  scene "Inside again: ..." {
    ...              # gap and everything else from the first visit is still here
  }
}
```

## Rules the checker enforces

- Every box and edge in an animated film must be visited by a dot (or be in a `still`).
- A dot needs an existing edge between its two boxes.
- Inside a `par`, only one dot may carry text; the others travel bare.
- Inside a `par`, no two dots on the same edge in the same direction.
- A copy may not move a value between monospace (fields, backticked slots) and proportional text.
- At most six boxes per level at once, and each level must fit a normal screen.
- Text lines are at most 60 characters.
