# Inset

Cancels a padded ancestor's padding on the sides you name, using a negative
margin, so its content bleeds to that ancestor's edges — the full-width image at
the top of a padded card. It's the escape hatch for one child, not a layout for
many: it flexes its content, clips the overflow, and rounds the corners that
stay inside.

```html preview
<kb-card>
  <kb-inset side="top">
    <kb-cover
      src="https://picsum.photos/id/1084/640/360"
      alt="A dog running on a beach"
    ></kb-cover>
  </kb-inset>
  <kb-text size="xs" weight="bold">Edge to edge</kb-text>
  <kb-text size="xxxs" color="master">The image touches the card's edges; this text doesn't.</kb-text>
</kb-card>
```

## Usage

```html
<kb-inset side="top">
  <img src="/banner.png" alt="" />
</kb-inset>
```

## When to use

- **A media band inside a padded surface** — a cover image or map that should
  touch the card's edges while the text around it stays inset.
- **A divider or tinted strip that spans the full surface** — a section break
  inside a `<kb-card>` that would otherwise stop short of both edges.
- **A bottom action bar inside a padded container** — `side="bottom"` keeps the
  top corners square against the content above and rounds the two meeting the
  container's edge.

## When not to use

- **Spacing siblings** — that's `<kb-stack>`. An inset removes space; it doesn't
  distribute it.
- **Centering page content** — `<kb-main>` already caps the width and centers
  the column.
- **When the parent has no padding.** The negative margin then pulls content
  *outside* the parent instead of to its edge. The bleed distance is fixed, not
  measured from the parent.
- **Rounding an image on its own** — a `border-radius` on the image is simpler.
  Reach for this only when the bleed is the point.

## Composition

- **Can contain**: anything — the shadow root is a single unnamed `<slot>`.
  Media is the common case, and `overflow: hidden` means an image larger than
  the box is clipped by the rounded corners rather than escaping them.
- **Can be a child of**: a padded container whose padding matches the bleed.
  `<kb-card>` is the intended parent; the default bleed (16px) is exactly the
  card's own inset, which is why the two line up without configuration.

The host is itself a flex container, so `direction` arranges multiple children
the way `<kb-stack>` would — but keep it to what belongs in the bleed.

## Which side

`side` picks which edges bleed. The value also drives the corner rounding, so
the corners meeting the parent's edge stay round and the ones meeting the
content go square.

```html preview
<kb-card>
  <kb-inset side="bottom">
    <kb-cover
      src="https://picsum.photos/id/1069/640/360"
      alt="Bleeding to the bottom edge"
    ></kb-cover>
  </kb-inset>
</kb-card>
```

| `side` | Bleeds | Rounds |
|---|---|---|
| `all` (default) | every edge | all four corners |
| `top` | top, left, right | the two top corners |
| `bottom` | bottom, left, right | the two bottom corners |
| `left` / `right` | that edge plus top and bottom | the two corners on that edge |
| `x` | left and right only | nothing — the band is open on both sides |
| `y` | top and bottom only | nothing |

An unrecognized value falls back to `all`, so a typo bleeds on every side rather
than failing visibly.

## Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `side` | `all` \| `top` \| `bottom` \| `left` \| `right` \| `x` \| `y` | `all` | Which edges receive the negative margin, and which corners stay rounded. |
| `direction` | `row` \| `column` | `column` | Flex direction of the slotted content. |
| `width` | `auto` \| `fill` \| length | `auto` | Host width. |
| `height` | `auto` \| length | `auto` | Host height. |
| `hidden` | `boolean` | `false` | Removes the element and its content from layout and the accessibility tree. |

This element dispatches no events.

## Styling

| Custom property | Default | Controls |
|---|---|---|
| `--inset-space-bleed` | `var(--spacing_inset-xs)` (16px) | How far the content pulls out on each named side. Applied as a negative margin. |
| `--inset-border-radius` | `var(--border-radius-sm)` (8px) | Rounding of the corners that stay at the parent's edge. |

Match the bleed to the parent's padding — that's the whole contract. A container
padded with `--spacing_inset-md` needs the same value here, or the content stops
short of the edge or spills past it:

```html preview
<div style="--card-space-inset: 32px;">
  <kb-card>
    <kb-inset side="top" style="--inset-space-bleed: 32px; --inset-border-radius: 16px;">
      <kb-cover
        src="https://picsum.photos/id/1025/640/360"
        alt="Bleed matched to a roomier card"
      ></kb-cover>
    </kb-inset>
    <kb-text size="xxs">Bleed and padding both at 32px.</kb-text>
  </kb-card>
</div>
```

!> The margin is declared `!important` so it survives a parent that sets margins
on its children. You can't override the bleed with a plain `margin` from outside
— change the custom property instead.

## States and accessibility

- `hidden` adds the `hidden` custom state and `display: none`, removing the
  element and its content from layout and the accessibility tree.
- The element renders no role and no landmark — it's a visual container. Content
  inside keeps its own semantics, and the negative margin doesn't change reading
  or focus order.
- `overflow: hidden` clips, it doesn't scroll. Content taller than a fixed
  `height` is silently cut, so leave the height automatic unless you intend the
  crop.

## Do's and don'ts

| Do | Don't |
|---|---|
| Match `--inset-space-bleed` to the parent's padding | Leave the default bleed inside a container padded differently |
| Use `side` to bleed only the edges that touch the parent | Use `all` and then fight the rounding on the inner edges |
| Put one media block or band inside it | Treat it as a general layout container — that's `<kb-stack>` |
| Let the height follow the content | Set a fixed height and rely on `overflow: hidden` to crop silently |
