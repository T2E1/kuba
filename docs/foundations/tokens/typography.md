# Typography

Typography carries hierarchy. Every piece of text should use one of these
tokens according to its importance — never a free-form `font-size`.

Defined in `packages/pixel/tokens/fontSize.css`, `lineHeight.css`,
`fontFamily.css` and `fontWeight.css`.

## Font size

| Token | Value | Sample |
|---|---|---|
| `--font-size-xxxs` | 12px | <span style="font-size: var(--font-size-xxxs)">Ag</span> |
| `--font-size-xxs` | 14px | <span style="font-size: var(--font-size-xxs)">Ag</span> |
| `--font-size-xs` | 16px | <span style="font-size: var(--font-size-xs)">Ag</span> |
| `--font-size-sm` | 20px | <span style="font-size: var(--font-size-sm)">Ag</span> |
| `--font-size-md` | 24px | <span style="font-size: var(--font-size-md)">Ag</span> |
| `--font-size-lg` | 32px | <span style="font-size: var(--font-size-lg)">Ag</span> |
| `--font-size-xl` | 40px | <span style="font-size: var(--font-size-xl)">Ag</span> |
| `--font-size-xxl` | 48px | <span style="font-size: var(--font-size-xxl)">Ag</span> |
| `--font-size-xxxl` | 64px | <span style="font-size: var(--font-size-xxxl)">Ag</span> |
| `--font-size-display` | 80px | <span style="font-size: var(--font-size-display)">Ag</span> |
| `--font-size-giant` | 96px | <span style="font-size: var(--font-size-giant)">Ag</span> |

`<kb-text>`, `<kb-label>` and `<kb-icon>` resolve their `size` attribute against
this scale, which is why an icon sized like the text beside it lines up with it.

```html preview
<kb-stack direction="column" spacing="quarck" align="start">
  <kb-text size="xxxs">xxxs — captions and metadata</kb-text>
  <kb-text size="xxs">xxs — the default body size</kb-text>
  <kb-text size="xs">xs — comfortable body copy</kb-text>
  <kb-text size="md">md — a component title</kb-text>
</kb-stack>
```

## Line height

| Token | Value |
|---|---|
| `--line-height-default` | 100% |
| `--line-height-xs` | 115% |
| `--line-height-sm` | 120% |
| `--line-height-md` | 133% |
| `--line-height-lg` | 150% |
| `--line-height-xl` | 170% |
| `--line-height-xxl` | 200% |

Tighter values suit large display type, where 100% keeps a headline compact.
Body copy wants `lg` or `xl` — the larger the measure, the more leading it needs
to stay readable.

## Font family

| Token | Value |
|---|---|
| `--font-family-base` | `"Roboto", sans-serif` |
| `--font-family-highlight` | `"Roboto Condensed", sans-serif` |

`base` is the default body family; `highlight` is reserved for headings and
emphasis. Swapping these two tokens is enough to give a brand a different
typographic voice without touching a single component.

!> The families are named, not bundled. Neither font ships with the package —
load them yourself (Google Fonts, a self-hosted `@font-face`), or override the
tokens with families you already serve. Without that, the browser falls back to
`sans-serif`.

## Font weight

| Token | Value | Sample |
|---|---|---|
| `--font-weight-regular` | 400 | <span style="font-weight: var(--font-weight-regular)">The quick brown fox</span> |
| `--font-weight-medium` | 500 | <span style="font-weight: var(--font-weight-medium)">The quick brown fox</span> |
| `--font-weight-bold` | 700 | <span style="font-weight: var(--font-weight-bold)">The quick brown fox</span> |

Three steps, on purpose. `medium` is what separates a `<kb-label>` from a
`<kb-helper>` at the same size — enough contrast to read as a label, not enough
to read as a heading.
