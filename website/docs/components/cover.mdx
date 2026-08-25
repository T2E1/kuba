# Cover

A single cropped image constrained to a fixed aspect ratio, built from a
`src`/`alt` pair. A display primitive, not a container: it has no `<slot>`, so
nothing composes inside it, and it carries no click behavior of its own.

```html preview
<kb-cover
  src="https://picsum.photos/id/1025/640/360"
  alt="A pug wrapped in a blanket"
></kb-cover>
```

## Usage

```html
<kb-cover src="/banner.jpg" alt="Team at the 2026 offsite"></kb-cover>
```

## When to use

- **A cropped, fixed-aspect image** — a banner, a hero, a thumbnail — where the
  layout needs a predictable ratio regardless of the source image's own
  dimensions.
- **The image area of a card**, typically wrapped in `<kb-inset side="top">` for
  an edge-to-edge look.

## When not to use

- **Content that isn't purely an image.** There's no `<slot>`; use `<kb-card>`
  or plain markup for anything mixing an image with text or actions.
- **Responsive art direction** — multiple sources per viewport, native lazy
  loading. This accepts a single `src`; use a plain `<img>` or `<picture>` when
  you need `srcset`, `sizes` or `loading`.

## Composition

- **Can contain**: nothing rendered. The element renders one internal `<img>`
  from `src` and `alt`; anything placed between its tags is ignored, except
  one or more `<kb-on>` children — they wire to the cover directly, for
  extra arcs beyond the single `on` attribute, without being slotted.
- **Can be a child of**: anything. Commonly nested inside `<kb-inset>` inside a
  `<kb-card>`.

```html preview
<kb-card>
  <kb-inset side="top">
    <kb-cover
      src="https://picsum.photos/id/1062/640/360"
      alt="A golden retriever in a field"
    ></kb-cover>
  </kb-inset>
  <kb-text size="xs" weight="bold">Golden Retriever</kb-text>
  <kb-text size="xxxs" color="master">Intelligent, friendly, devoted</kb-text>
</kb-card>
```

## Orientation

`orientation` sets the aspect ratio the image is cropped to, via `object-fit:
cover` on the internal `<img>`. It doesn't touch `src`, so the same image works
at either ratio.

```html preview
<kb-cover
  src="https://picsum.photos/id/1025/640/360"
  alt="Landscape crop"
  orientation="landscape"
></kb-cover>
<kb-cover
  src="https://picsum.photos/id/1025/640/360"
  alt="Portrait crop of the same image"
  orientation="portrait"
></kb-cover>
```

| Orientation | Aspect ratio | Use for |
|---|---|---|
| `landscape` (default) | 16/9 | Wide banners, heroes, thumbnails in a horizontal layout. |
| `portrait` | 4/5 | Tall images — portrait photos, mobile-first cards, vertical thumbnails. |

An unrecognized value is ignored — the property keeps the last valid
`orientation` it had (or the default, if none was ever set).

## Content

`alt` should describe the image for anyone who can't see it. Leave it empty
(`alt=""`) only when the image is decorative and nearby text already conveys the
same information — never omit it, and never repeat a visible caption verbatim.

## Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `src` | `string` | `''` | Image URL, forwarded to the internal `<img>`. |
| `alt` | `string` | `''` | Alternative text, forwarded to the internal `<img>`. |
| `orientation` | `landscape` \| `portrait` | `landscape` | Aspect ratio the image is cropped to. An unrecognized value is ignored — the property keeps the last valid orientation it had. |
| `hidden` | `boolean` | `false` | Removes the cover from layout and the accessibility tree. |
| `on` | arc string | — | Echo wiring, `source/event:type/sink`. |

This element dispatches no events.

## Styling

| Custom property | Default | Controls |
|---|---|---|
| `--cover-aspect-ratio-landscape` | `16/9` | Ratio when `orientation="landscape"`. |
| `--cover-aspect-ratio-portrait` | `4/5` | Ratio when `orientation="portrait"`. |
| `--cover-color-background` | `var(--color-pure-white)` | Background visible while the image loads, or if it fails. |
| `--cover-border-radius` | `var(--border-radius-md)` | Corner radius of the host and its cropped image. |

```html preview
<div style="--cover-aspect-ratio-landscape: 1/1; --cover-border-radius: 8px;">
  <kb-cover
    src="https://picsum.photos/id/1074/400/400"
    alt="A near-square thumbnail"
  ></kb-cover>
</div>
```

## States and accessibility

- `hidden` removes the cover from layout and interaction. Prefer it over not
  rendering the element when the presence or absence should stay findable.
- The internal `<img>` keeps its native role. A missing or empty `alt` on a
  meaningful image makes it invisible to screen readers.
- The element has no click behavior. Wrap it in a `<kb-card>` or an `<a>` when
  the image must be actionable.

## Do's and don'ts

| Do | Don't |
|---|---|
| Write a real `alt` describing the image | Leave `alt` empty for an image that carries meaning |
| Pick `orientation` for the layout's ratio | Assume a given `src` matches it — `object-fit: cover` crops either way |
| Wrap it in `<kb-card>` or `<a>` when it must be clickable | Expect `kb-cover` to dispatch a click event |
| Override `--cover-*` tokens to re-skin | Reach into the shadow DOM to change background or radius |
