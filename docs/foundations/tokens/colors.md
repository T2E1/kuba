# Colors

The tokens swapped per brand and per theme, defined in
`packages/pixel/tokens/color.css`.

Every color is declared with CSS `light-dark()`, carrying a light and a dark
value in one token:

```css
--color-master-dark: light-dark(#2c2c2c, #c9c9c9);
```

Which one applies is decided by the page's `color-scheme` — see
[Dark mode](/learn/styling) for how to turn it on. The swatches below render
whichever value is active in your browser right now.

Each family has five tones (`lighter`, `light`, base, `dark`, `darker`), except
`master` with seven and `menu` with three.

## Master

The neutral scale — text, surfaces and borders. The foundation of any
composition, regardless of brand.

| | Token | Light | Dark |
|---|---|---|---|
| <span class="swatch" style="background: var(--color-master-lightest)"></span> | `--color-master-lightest` | `#fafafa` | `#1f1f1f` |
| <span class="swatch" style="background: var(--color-master-lighter)"></span> | `--color-master-lighter` | `#f0f0f0` | `#3d3d3d` |
| <span class="swatch" style="background: var(--color-master-light)"></span> | `--color-master-light` | `#e6e6e6` | `#5c5c5c` |
| <span class="swatch" style="background: var(--color-master)"></span> | `--color-master` | `#626262` | `#a3a3a3` |
| <span class="swatch" style="background: var(--color-master-dark)"></span> | `--color-master-dark` | `#2c2c2c` | `#c9c9c9` |
| <span class="swatch" style="background: var(--color-master-darker)"></span> | `--color-master-darker` | `#1a1a1a` | `#e1e1e1` |
| <span class="swatch" style="background: var(--color-master-darkest)"></span> | `--color-master-darkest` | `#0a0a0a` | `#f5f5f5` |

Note how the ramp **inverts** between modes: `master-lightest` is the lightest
surface in light mode and the darkest in dark mode. That's what makes a
component styled with ramp steps work in both without a single override.

## Primary

The brand's main tones — buttons and interactive elements.

| | Token |
|---|---|
| <span class="swatch" style="background: var(--color-primary-lighter)"></span> | `--color-primary-lighter` |
| <span class="swatch" style="background: var(--color-primary-light)"></span> | `--color-primary-light` |
| <span class="swatch" style="background: var(--color-primary)"></span> | `--color-primary` |
| <span class="swatch" style="background: var(--color-primary-dark)"></span> | `--color-primary-dark` |
| <span class="swatch" style="background: var(--color-primary-darker)"></span> | `--color-primary-darker` |

## Complete

Completion status, progress, informational success.

| | Token |
|---|---|
| <span class="swatch" style="background: var(--color-complete-lighter)"></span> | `--color-complete-lighter` |
| <span class="swatch" style="background: var(--color-complete-light)"></span> | `--color-complete-light` |
| <span class="swatch" style="background: var(--color-complete)"></span> | `--color-complete` |
| <span class="swatch" style="background: var(--color-complete-dark)"></span> | `--color-complete-dark` |
| <span class="swatch" style="background: var(--color-complete-darker)"></span> | `--color-complete-darker` |

## Success

Confirmations and positive outcomes.

| | Token |
|---|---|
| <span class="swatch" style="background: var(--color-success-lighter)"></span> | `--color-success-lighter` |
| <span class="swatch" style="background: var(--color-success-light)"></span> | `--color-success-light` |
| <span class="swatch" style="background: var(--color-success)"></span> | `--color-success` |
| <span class="swatch" style="background: var(--color-success-dark)"></span> | `--color-success-dark` |
| <span class="swatch" style="background: var(--color-success-darker)"></span> | `--color-success-darker` |

## Warning

Alerts that need attention but don't block the flow.

| | Token |
|---|---|
| <span class="swatch" style="background: var(--color-warning-lighter)"></span> | `--color-warning-lighter` |
| <span class="swatch" style="background: var(--color-warning-light)"></span> | `--color-warning-light` |
| <span class="swatch" style="background: var(--color-warning)"></span> | `--color-warning` |
| <span class="swatch" style="background: var(--color-warning-dark)"></span> | `--color-warning-dark` |
| <span class="swatch" style="background: var(--color-warning-darker)"></span> | `--color-warning-darker` |

## Danger

Errors and destructive actions.

| | Token |
|---|---|
| <span class="swatch" style="background: var(--color-danger-lighter)"></span> | `--color-danger-lighter` |
| <span class="swatch" style="background: var(--color-danger-light)"></span> | `--color-danger-light` |
| <span class="swatch" style="background: var(--color-danger)"></span> | `--color-danger` |
| <span class="swatch" style="background: var(--color-danger-dark)"></span> | `--color-danger-dark` |
| <span class="swatch" style="background: var(--color-danger-darker)"></span> | `--color-danger-darker` |

## Info

Informational tones — helper text, neutral notifications.

| | Token |
|---|---|
| <span class="swatch" style="background: var(--color-info-lighter)"></span> | `--color-info-lighter` |
| <span class="swatch" style="background: var(--color-info-light)"></span> | `--color-info-light` |
| <span class="swatch" style="background: var(--color-info)"></span> | `--color-info` |
| <span class="swatch" style="background: var(--color-info-dark)"></span> | `--color-info-dark` |
| <span class="swatch" style="background: var(--color-info-darker)"></span> | `--color-info-darker` |

## Menu

Navigation surfaces — sidebars, menus. Three tones instead of five, since menus
rarely need fine gradation.

| | Token |
|---|---|
| <span class="swatch" style="background: var(--color-menu-light)"></span> | `--color-menu-light` |
| <span class="swatch" style="background: var(--color-menu)"></span> | `--color-menu` |
| <span class="swatch" style="background: var(--color-menu-dark)"></span> | `--color-menu-dark` |

## Pure

| | Token | Value |
|---|---|---|
| <span class="swatch" style="background: var(--color-pure-white)"></span> | `--color-pure-white` | `#fff` |
| <span class="swatch" style="background: var(--color-pure-black)"></span> | `--color-pure-black` | `#000` |

The only two tokens with no `light-dark()` variation — they represent the
absolute ends of the scale, not a semantic color, so they don't shift with the
theme.

!> That also makes them the two to avoid in a theme-aware surface. A background
of `--color-pure-white` stays white in dark mode; use `--color-master-lightest`
when you mean "the lightest surface", not "white".

## Using color

Pick by meaning, not by appearance:

```html preview
<kb-stack direction="row" spacing="nano">
  <kb-button color="primary">Save</kb-button>
  <kb-button color="danger">Delete</kb-button>
  <kb-button color="success">Confirm</kb-button>
</kb-stack>
```

Any suffix of `--color-*` works in an element's `color` attribute — the value is
interpolated into `var(--color-{value})`, so an unknown name silently resolves
to nothing rather than failing loudly.
