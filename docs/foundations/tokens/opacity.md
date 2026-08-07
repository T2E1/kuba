# Opacity

Opacity levels for states and overlays, defined in
`packages/pixel/tokens/opacity.css`.

| Token | Value | Sample |
|---|---|---|
| `--opacity-level-semiopaque` | 0.72 | <span class="box" style="background: var(--color-primary); opacity: var(--opacity-level-semiopaque)"></span> |
| `--opacity-level-intense` | 0.64 | <span class="box" style="background: var(--color-primary); opacity: var(--opacity-level-intense)"></span> |
| `--opacity-level-medium` | 0.32 | <span class="box" style="background: var(--color-primary); opacity: var(--opacity-level-medium)"></span> |
| `--opacity-level-light` | 0.16 | <span class="box" style="background: var(--color-primary); opacity: var(--opacity-level-light)"></span> |
| `--opacity-level-semitransparent` | 0.08 | <span class="box" style="background: var(--color-primary); opacity: var(--opacity-level-semitransparent)"></span> |

## What they're for

Overlay states: a backdrop behind a modal, a subtle hover over a surface, a
disabled control.

```css
.backdrop {
  background: var(--color-pure-black);
  opacity: var(--opacity-level-intense);
}
```

## What they're not for

**Never use opacity to dim legible text.** Fading text below full opacity
lowers its contrast against the background in a way that's invisible to a
contrast checker reading the declared color — the computed result can drop under
the 4.5:1 minimum while the CSS still says `--color-master-dark`.

When text should recede, pick a lighter step of the `master` ramp instead. The
token is honest about the resulting color, and it stays correct in dark mode,
where the ramp inverts and opacity does not.

?> **No kuba component uses these tokens today.** Disabled inputs, for one,
change their background and text color rather than fading — precisely to keep
the contrast readable. They're here for the product you build on top.
