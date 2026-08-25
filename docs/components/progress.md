# Progress

Shows how far along a task is, as a filled fraction of a horizontal track. It's
determinate only: `value` is a percentage you set, so the bar can't express
"working, duration unknown" — it would just sit at whatever number it was given.

```html preview
<div style="width: 100%">
  <kb-progress value="60"></kb-progress>
</div>
```

## Usage

```html
<kb-progress value="60" alt="Uploading"></kb-progress>
```

## When to use

- **A task with a known fraction complete** — an upload, a multi-step form, a
  batch job reporting items processed.
- **A quantity against a ceiling** — storage used, quota consumed, password
  strength — where the bar reads as a gauge rather than a timer.

## When not to use

- **Work of unknown duration.** A spinner or skeleton is the honest signal; a
  bar frozen at one value reads as stalled.
- **A value the user can change.** This is output, not input — a bar the user
  drags is a slider (`<input type="range">`).
- **A step counter people navigate.** A labelled stepper communicates "step 2 of
  5" better, and stays operable.

## Composition

- **Can contain**: no meaningful children. The shadow root renders a single
  indicator `<div>` and declares no slot. A label belongs next to the bar, not
  inside it. The one exception is one or more `<kb-on>` children, for extra
  arcs beyond the single `on` attribute — they wire to the bar directly,
  without being slotted or rendered.
- **Can be a child of**: anything. The host is `display: block` at 100% width,
  so it takes the width of its container.

```html preview
<kb-stack direction="column" spacing="quarck" align="stretch" style="width: 100%">
  <kb-stack direction="row" justify="space-between">
    <kb-text size="xxxs">Uploading</kb-text>
    <kb-text size="xxxs" color="master">45%</kb-text>
  </kb-stack>
  <kb-progress value="45"></kb-progress>
</kb-stack>
```

## The value scale

`value` is a bare number interpolated straight into a CSS `%` width — no
clamping, no `min`/`max`. Three consequences worth knowing:

- **Pass `0`–`100`.** Above `100` the indicator is simply wider than the track;
  `overflow: hidden` keeps it from painting outside, so an overshoot looks
  identical to `100` and hides the bug.
- **A negative value** produces an invalid width and the indicator collapses
  to nothing — the same picture as `0`. **A non-numeric value is rejected**:
  `value` keeps its last valid setting instead of taking the raw string. A
  value with a numeric prefix followed by other text (`"50; } :host {…"`)
  keeps only the parsed number — never the trailing text, which is how this
  attribute stays safe against injection.
- **Compute the percentage before setting it**: `value="${(done / total) *
  100}"`. The element does no arithmetic of its own.

There is no transition on the width, so each update paints immediately — a bar
driven by frequent updates animates as a series of steps. That's deliberate: the
indicator lives in the shadow DOM with no `::part()` exposed, so an easing curve
can't be attached from outside. Update on a cadence that reads well rather than
on every byte.

## Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | `'0'` | Fill percentage, `0`–`100`. Applied directly as a CSS `%` width. |
| `alt` | `string` | `''` | Accessible name saying what is progressing. |
| `on` | arc string | — | Echo wiring, `source/event:type/sink`. |

This element dispatches no events.

## Styling

There is no `::part()` on this element, so these properties are the whole
extension surface.

| Custom property | Default | Controls |
|---|---|---|
| `--progress-color-track` | `var(--color-pure-white)` | Background of the unfilled portion. |
| `--progress-color-indicator` | `var(--color-primary)` | Fill color of the completed portion. |
| `--progress-size-height` | `6px` | Thickness of the bar. |
| `--progress-border-radius` | `var(--border-radius-pill)` | Corner rounding, track and indicator together. |

Use the indicator color semantically, not decoratively — `success` for a
finished job, `warning` for a quota nearing its limit, `danger` for one that's
over.

```html preview
<div
  style="width: 100%; --progress-color-indicator: var(--color-warning); --progress-color-track: var(--color-master-lighter); --progress-size-height: 12px; --progress-border-radius: 8px;"
>
  <kb-progress value="88"></kb-progress>
</div>
```

## States and accessibility

- `kb-progress` has no `hidden` attribute and no custom states — remove the
  element when there's nothing to report.
- **The host carries `role="progressbar"`**, published through
  `ElementInternals`, with `value` mirrored onto `aria-valuenow` on every
  change. The scale is fixed at `aria-valuemin="0"` / `aria-valuemax="100"`,
  because `value` is applied straight into CSS as a `%`.
- **Give it an `alt`.** The role and the number are announced, but nothing says
  *what* is progressing — `<kb-progress value="40" alt="Upload">` does.
- The track defaults to `--color-pure-white`, which disappears on a white
  surface. On a light page, set `--progress-color-track` to a neutral so the
  unfilled portion stays visible.
- Never rely on the fill alone to convey a state change — pair a `danger` or
  `warning` bar with text, since color is the only difference.

## Do's and don'ts

| Do | Don't |
|---|---|
| Clamp the percentage before setting `value` | Pass a raw ratio (`0.6`) or an unbounded count |
| Give it an `alt` saying what is progressing | Ship the bare element and assume the fill is announced |
| Give the track a visible color on light surfaces | Leave the white default on a white page |
| Use a spinner for unknown-duration work | Park the bar at an arbitrary value to signal "loading" |
