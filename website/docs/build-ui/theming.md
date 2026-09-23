# Styling

Every visual decision in kuba is a CSS custom property, and every property
defaults to a design token. You re-style a component by setting properties from
the outside — never by reaching into its shadow DOM, which you can't do anyway.

There are exactly two layers, and knowing which one to reach for is most of this
page.

## The two layers

**Design tokens** are global: `--color-primary`, `--spacing_inset-xs`,
`--font-size-md`. Change one and every component using it follows. They're your
theme.

**Component properties** are local: `--button-size-height`,
`--card-space-inset`, `--input-color-focus`. Each defaults to a token. Change
one and only that component changes.

```css
/* Layer 1 — the whole product gets a new accent */
:root {
  --color-primary: #0b7285;
}

/* Layer 2 — only checkout buttons get taller */
.checkout kb-button {
  --button-size-height: 56px;
}
```

Reach for the token when the change is a decision about the product. Reach for
the component property when it's a decision about one place.

## Why this works: inheritance crosses the shadow boundary

Custom properties inherit, and inheritance passes through shadow roots. That's
the mechanism the entire system rests on: a value set on `:root`, on an
ancestor, or on the element itself reaches the CSS **inside** the component,
even though your stylesheet can't select anything in there.

```css
kb-button { --button-color-accent: rebeccapurple; }
```

The component's internal rule reads `var(--button-color-accent, var(--color-primary))`,
finds your value, and uses it. No `::part`, no `!important`, no shadow piercing.

?> This also means an override on an ancestor cascades to every matching
descendant — `.panel-dark { --text-color: white }` restyles every `<kb-text>`
inside that panel at once.

## The token scale

Everything ships in `dist/kuba.css`. The values are the same ones the design
side uses; the names are the contract between them.

| Group | Steps |
|---|---|
| `--color-*` | `primary`, `master`, `success`, `warning`, `danger`, `info`, `complete`, `menu`, each with `-light` / `-lighter` / `-dark` / `-darker` variants, plus `pure-white` and `pure-black` |
| `--spacing-*` | `quarck` 4px → `giant` 200px — for gaps and margins between things |
| `--spacing_inset-*` | `quarck` 4px → `giant` 56px — for padding inside a surface |
| `--font-size-*` | `xxxs` 12px → `giant` 96px |
| `--font-weight-*` | `regular` 400, `medium` 500, `bold` 700 |
| `--line-height-*` | `default` 100% → `xxl` 200% |
| `--font-family-*` | `base` (Roboto), `highlight` (Roboto Condensed) |
| `--border-radius-*` | `none`, `sm` 8px, `md` 16px, `lg` 24px, `pill`, `circular` |
| `--border-width-*` | `none`, `hairline`, `thin`, `thick`, `heavy` |
| `--opacity-level-*` | `semitransparent` 0.08 → `semiopaque` 0.72 |

The two spacing scales are separate on purpose: `--spacing-*` measures the
distance *between* elements, `--spacing_inset-*` the padding *within* one. Using
the inset scale for a gap works, but it drifts from the rhythm the components
themselves keep.

## Naming of component properties

Component properties follow `--{component}-{group}-{name}`:

| Pattern | Examples |
|---|---|
| `--{c}-color-*` | `--button-color-accent`, `--input-color-focus` |
| `--{c}-size-*` | `--button-size-height`, `--main-size-max-width` |
| `--{c}-space-*` | `--card-space-inset`, `--stack-space-gap` |
| `--{c}-font-*` | `--text-font-size`, `--label-font-weight` |
| `--{c}-border-*` | `--card-border-radius`, `--input-border-radius` |

The suffix `_disabled` marks a state variant: `--input-color-background_disabled`.

Each component page lists its full table. The names are stable API — treat them
like any other public surface.

## Theming

A theme is a block of token overrides. Scope it to `:root` for the whole
product, or to a container for one region:

```css
:root {
  --color-primary: #0b7285;
  --color-primary-dark: #095c6b;
  --font-family-base: 'Inter', sans-serif;
  --border-radius-sm: 2px;
}
```

That last line is worth pausing on: changing `--border-radius-sm` squares off
buttons, inputs, cards' inner corners and cover images at once, because they all
default to it. That's the leverage tokens give you — and the reason to change
them deliberately rather than per component.

### A brand is a token sheet

Because every element consumes color, typography and spacing exclusively through
`var(--token-name)` — never a literal inside its `style.js` — **a brand is a set
of values, not a set of components.**

Creating one means replacing the sheet, not forking anything. In the repository
that's `packages/pixel/tokens/color.css` (and `fontFamily.css`, if the brand has
a different typographic voice) swapped for an equivalent file using the same
variable names with different values. As a consumer, it's a stylesheet loaded
after `kuba.css`:

```html
<link rel="stylesheet" href=".../kuba.css" />
<link rel="stylesheet" href="/brand/acme.css" />
```

No component knows the brand changed, because no component ever knew which brand
it was rendering.

### Several themes per brand

The same mechanism covers seasonal variations and per-tier looks. A Black Friday
campaign, or a silver/gold distinction, is a block of color overrides scoped to a
container — no duplicated Elements, no variant attribute:

```css
.tier-gold {
  --color-primary: #b8860b;
  --color-primary-dark: #8b6508;
}
```

Scope it as narrowly as the change deserves: `:root` for the product, a section
for a campaign, a single element for one exception.

### Dark mode

Every color token is already declared with CSS `light-dark()`, carrying both a
light and a dark value:

```css
--color-master-dark: light-dark(#2c2c2c, #c9c9c9);
```

Which one applies is decided by the page's `color-scheme`, not by kuba. Nothing
in the shipped stylesheet declares it, so a page defaults to light and the dark
values never surface. **You turn dark mode on by declaring the scheme:**

```css
:root {
  color-scheme: light dark; /* follow the OS preference */
}
```

That single line flips the whole palette — no token overrides, no second
stylesheet, no class to toggle. Force one mode with `color-scheme: dark` or
`color-scheme: light` instead.

Two components still assume a light surface, since their defaults name a fixed
color rather than a ramp step: `<kb-progress>`'s track is `--color-pure-white`,
and `<kb-card variant="outlined">` fills with white. Override those two per
surface until their defaults move onto the ramp.

## What you cannot style

- **Anything selected from outside the shadow root.** `kb-button button { … }`
  matches nothing. If a component doesn't expose a property for what you want to
  change, that's a gap in the component, not a technique you're missing — open
  an issue rather than working around it.
- **`::part()`** — no component exposes parts today.
- **Slotted content from within.** `::slotted()` rules live inside the
  component; you style slotted children from your own stylesheet, since they're
  in your DOM.

## Layout attributes vs CSS

Some things that look like styling are attributes, not properties — `width`,
`height`, `align`, `justify`, `direction`, `spacing`. They're applied directly to
the host, so setting the equivalent CSS property from outside fights with them.

```html
<!-- Do -->
<kb-stack direction="column" spacing="md" width="fill">

<!-- Don't: the attribute wins, and the intent is now in two places -->
<kb-stack style="flex-direction: column; gap: 32px">
```

The rule of thumb: if the component documents an attribute for it, use the
attribute. Custom properties are for what attributes don't cover — and for
values that must respond to a media query, which an attribute can't do.

## Next

- **[Components](/components/)** — each page's Styling section lists its full
  property table.
- **[Reference › Packages](/build-elements/)** — the complete token scale.
