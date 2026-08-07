# Design tokens

Design tokens are the style variables that sit between design and code. Instead
of a loose value — `24px`, `#6d5cae` — scattered through the codebase, every
visual decision gets a semantic name and a single source of truth.

They live in `packages/pixel/tokens/`, one CSS file per group, all declared
under `:root` and shipped in `dist/kuba.css`. Components consume them through
`var(--token-name)` in each element's `style.js` — never a hardcoded value.

```css
/* Change the token, and every element using it follows */
:root {
  --color-primary: #0b7285;
}
```

## Groups

| Group | Defines |
|---|---|
| [Colors](/foundations/tokens/colors) | The semantic palette, with a light and a dark value per token. |
| [Typography](/foundations/tokens/typography) | Font size, line height, family and weight. |
| [Spacing](/foundations/tokens/spacing) | Composition spacing and inner spacing (`inset`). |
| [Border](/foundations/tokens/border) | Radius and width. |
| [Shadows](/foundations/tokens/shadows) | Elevation levels. |
| [Opacity](/foundations/tokens/opacity) | Opacity levels for states and overlays. |

Every page below renders the tokens live, reading them from the same stylesheet
your page would load — the samples change when the values do.

## The naming rule

Every token follows `--{group}-{scale}`:

```
--spacing-md
--color-primary-dark
--font-size-xxs
```

**The name describes *what* the token represents, never *where* it's used.**
That's what lets `--color-danger` stay correct whether it colors a button, a
border or a validation message — and what keeps the scale from growing a new
entry every time a screen is designed.

## Tokens vs component properties

Tokens are global. Each component also exposes its own `--{component}-*`
properties, which default to tokens — see [Styling](/learn/styling) for when to
reach for which.

```css
:root { --color-primary: #0b7285 }       /* every element follows */
.checkout kb-button { --button-size-height: 56px }  /* only these buttons */
```
