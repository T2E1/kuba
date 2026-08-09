# Icon

Renders one Material Symbols glyph by name. It's a glyph, not a control: no
click behavior, no focus, no label of its own — put it inside a `<kb-button
variant="icon">` when the mark is meant to be pressed.

```html preview
<kb-icon use="home"></kb-icon>
<kb-icon use="search" size="lg"></kb-icon>
<kb-icon use="favorite" color="danger"></kb-icon>
<kb-icon use="settings" size="xl" color="primary"></kb-icon>
```

## Usage

```html
<kb-icon use="home" size="md" color="primary"></kb-icon>
```

## When to use

- **Reinforcing a labelled action** — an icon next to text in a button or menu
  item, where the glyph speeds up recognition but the text carries the meaning.
- **Standing in for text where space is scarce** — a toolbar of icon-only
  buttons, a close affordance, a status marker in a dense row.
- **Marking status next to content** — a check, a warning, an error mark paired
  with a `<kb-text>`, taking its color from the same semantic token as the
  message.

## When not to use

- **As the clickable element itself.** There's no click event, no `tabindex` and
  no accessible name. Wrap it in `<kb-button variant="icon">`, which brings the
  hit area, focus ring and label.
- **For the brand mark** — use `<kb-logo>`, which renders the real logo as
  inline SVG rather than a font glyph.
- **For decorative illustration or a bitmap** — this only resolves ligature
  names in one font family.

## Composition

- **Can contain**: no meaningful children. The shadow root renders `use`
  verbatim as its text content, so light-DOM children are ignored. Set the glyph
  through the attribute, never by typing the ligature between the tags.
- **Can be a child of**: anything accepting inline content. It's `inline-flex`
  with `line-height: 1`, so it sits on the text baseline of a `<kb-text>`,
  inside a `<kb-button>` label, or in a `<kb-stack direction="row">` without
  extra alignment.

```html preview
<kb-button>
  <kb-icon use="download"></kb-icon>
  Download
</kb-button>
<kb-button variant="icon" alt="Search">
  <kb-icon use="search"></kb-icon>
</kb-button>
```

## Size

`size` selects a step of the shared type scale, so an icon sized like the text
beside it lines up with it — that's the point of reusing the scale instead of
pixel values.

```html preview
<kb-icon use="star" size="xxxs"></kb-icon>
<kb-icon use="star" size="xs"></kb-icon>
<kb-icon use="star" size="md"></kb-icon>
<kb-icon use="star" size="xl"></kb-icon>
<kb-icon use="star" size="xxxl"></kb-icon>
```

| `size` | Renders at | Use for |
|---|---|---|
| `xxxs`–`xs` | 12–16px | Inline marks inside body text, dense table rows. |
| `sm`–`md` | 20–24px | The default range: buttons, form affordances, list items. |
| `lg`–`xl` | 32–40px | Standalone actions in a toolbar, empty-state marks. |
| `xxl` and up | 48px+ | Feature illustrations, where the glyph is the focal point. |

## Color

Leave `color` unset in the common case: the icon resolves to `currentColor` and
inherits from surrounding text, so it stays correct on any background without
being re-specified. Set it only when the glyph carries meaning the text doesn't.

```html preview
<kb-icon use="check_circle" color="success"></kb-icon>
<kb-icon use="warning" color="warning"></kb-icon>
<kb-icon use="error" color="danger"></kb-icon>
<kb-icon use="info" color="info"></kb-icon>
```

| `color` | Meaning |
|---|---|
| `primary` | Brand emphasis — the icon of the main action in a group. |
| `success` / `complete` | A finished or valid state. |
| `warning` | A state that needs attention but isn't blocking. |
| `danger` | An error, or a destructive action's mark. |
| `master-*` | Neutral greys, for icons that should recede from the text. |

Any suffix of `--color-*` works — the value is interpolated into
`var(--color-{value})`, so an unknown name silently resolves to nothing rather
than failing loudly.

## Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `use` | `string` | `''` | Material Symbols ligature name, e.g. `home`, `search`. |
| `alt` | `string` | `''` | Accessible name. Unset, the icon is hidden from assistive technology. |
| `size` | token step | `md` | Glyph size, resolved against `--font-size-{value}`. |
| `color` | token suffix | `currentColor` | Glyph color, resolved against `--color-{value}`. |
| `on` | arc string | — | Echo wiring, `source/event:type/sink`. |

This element dispatches no events.

## Styling

Beyond the attributes, the glyph's rendering is exposed as `--icon-*` properties.
The four variation axes are the Material Symbols axes.

| Custom property | Default | Controls |
|---|---|---|
| `--icon-color` | the `color` attribute, or `currentColor` | Glyph color, overriding the attribute. |
| `--icon-size` | `var(--font-size-{size})` | Glyph size, overriding the attribute. |
| `--icon-fill` | `1` | `FILL` axis: `1` solid, `0` outlined. |
| `--icon-weight` | `400` | `wght` axis, `100`–`700` — match it to nearby text. |
| `--icon-grade` | `0` | `GRAD` axis; a small negative value thins glyphs on dark backgrounds. |
| `--icon-optical-size` | `24` | `opsz` axis; keep it near the rendered pixel size. |

```html preview
<div style="--icon-fill: 0; --icon-weight: 300;">
  <kb-icon use="home" size="xl"></kb-icon>
  <kb-icon use="settings" size="xl"></kb-icon>
  <kb-icon use="favorite" size="xl"></kb-icon>
</div>
```

## Why Material Symbols

The set was chosen over drawing one from scratch: it's free, maintained by
Google, covers most of a digital product's needs, and — the deciding factor —
ships as a **font**. A glyph is a ligature name, so adding an icon means writing
`use="bookmark"`, not importing an asset, registering a sprite, or growing the
bundle.

That choice is also what makes `size` and `color` work the way they do. Because
the glyph is text, it resolves against the type scale and inherits
`currentColor` — which is why an icon lines up with the text beside it, and why
swapping a brand's token sheet restyles every icon in the product with no new
attribute and no component variant.

If a glyph you need isn't in the set, evaluate a complementary icon library
before drawing a custom one.

!> The font isn't bundled with kuba. Load **Material Symbols Rounded** yourself —
without it, `use` renders as literal text instead of a glyph.

## States and accessibility

- `kb-icon` has no `hidden` attribute and no custom states.
- **An unnamed icon hides itself.** The glyph is text in a symbol font, so a
  screen reader would otherwise announce the raw ligature name ("home"). With no
  `alt`, the element sets `aria-hidden="true"` on itself — the right default
  whenever a visible label already carries the meaning.
- **Set `alt` when the icon is the meaning**, and it becomes a named `img`
  instead: `<kb-icon use="check" alt="Verified">`.
- When the icon is the only content of a control, name the control rather than
  the icon — `<kb-button variant="icon" alt="Search">`. Naming both makes the
  same thing announced twice.
- An unknown `use` value renders as literal text rather than a glyph; that's the
  fastest way to spot a typo in a ligature name.

## Do's and don'ts

| Do | Don't |
|---|---|
| Leave `color` unset so the glyph inherits from its text | Set a color on every icon "to be explicit" — it breaks on inverted surfaces |
| Wrap the glyph in `<kb-button variant="icon">` to make it pressable | Attach a click listener to `kb-icon` — it has no focus or hit area |
| Leave `alt` unset when a text label is present — the icon hides itself | Set `alt` to the same words as the label beside it, announcing them twice |
| Match `size` to the text beside it | Pick sizes by eye with `--icon-size` when a scale step fits |
