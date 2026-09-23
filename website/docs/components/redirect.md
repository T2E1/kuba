# Redirect

Navigates via `history.pushState` when its `go()` method runs, without a page
reload. It renders nothing and owns no interaction of its own — it's a headless
Echo subscriber, meant to be wired to another element's event, most commonly a
button's `clicked`.

```html
<kb-button id="open-profile" value="42">View profile</kb-button>
<kb-redirect href="/user/{}" on="#open-profile/clicked:method/go"></kb-redirect>
```

?> There's no live preview on this page on purpose — every example would change
the URL of the documentation site itself.

## Usage

```html
<kb-button id="save" value="42">Save</kb-button>
<kb-redirect href="/user/{id}" on="#save/clicked:method/go"></kb-redirect>
```

```js
document.querySelector('kb-redirect').go({ id: 42 }) // → /user/42
```

## When to use

- **The outcome of an interaction is a new location** — wire the triggering
  element's event to `go()` instead of writing `history.pushState` in page code.
- **Navigating to a named, router-registered route** via `route`, or to a path
  with dynamic segments via `href` placeholders interpolated from the event's
  payload.

## When not to use

- **The interaction's outcome isn't a navigation.** A button that submits a form
  shouldn't be wired to a redirect — putting navigation in the button would
  couple it to a destination it shouldn't know about.
- **A full-page navigation or an external URL.** This only ever calls
  `history.pushState`, which never leaves the current document. Use a plain
  `<a>`.

## Composition

- **Can contain**: nothing. No slot, no shadow DOM.
- **Can be a child of**: anything. It's commonly a sibling of the element whose
  event it subscribes to — right after the `<kb-button>` — not nested inside it.

## `href` vs `route`

| Attribute | Resolves to | Notes |
|---|---|---|
| `href` | a direct URL — absolute URL, absolute path, or a `#`/`?` fragment | May contain `{path.to.value}` placeholders interpolated from the `params` passed to `go()`. |
| `route` | a router-registered route name, resolved via `urlFor` | **Takes precedence over `href`** when both are set. |

!> Setting both and expecting `href` to act as a fallback doesn't work — when
`route` is set, only `route` is ever used.

Placeholders are what make a single redirect serve a list. The payload of the
triggering event fills them:

```html
<kb-render>
  <kb-on value="users/changed:method/render"></kb-on>
  <template>
    <kb-card value="{id}">
      <kb-text size="xxs">{name}</kb-text>
    </kb-card>
  </template>
</kb-render>
<kb-redirect href="/user/{}" on="kb-card/clicked:method/go"></kb-redirect>
```

Every card publishes `clicked` with its own `value`, and the same redirect
resolves a different URL for each.

## Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `href` | `string` | `'#'` | Destination URL, optionally with `{path}` placeholders. |
| `route` | `string` | `''` | Router-registered route name. Wins over `href` when set. |
| `on` | arc string | — | Echo wiring, `source/event:type/sink`. |

## Methods

| Method | Returns | Description |
|---|---|---|
| `go(params?)` | `this` | Navigates via `history.pushState`, interpolating `params` into `href`. |

This element dispatches no events. Navigation itself emits a `pushstate` event
on `window`, which the router package listens for.

## States and accessibility

- The element is headless and invisible — no rendered state, no accessibility
  surface of its own.
- **The accessible name and role belong to whatever triggers it.** A redirect
  wired to a `<kb-button>` inherits nothing from it; make sure the button reads
  as the action it performs.
- Because this is `pushState` and not a real link, the destination isn't
  exposed on hover, isn't openable in a new tab, and isn't announced as a link.
  When the interaction is genuinely "go to this page", a plain `<a>` serves
  users better; reach for `kb-redirect` when the navigation is the *consequence*
  of an action rather than the action itself.

## Do's and don'ts

| Do | Don't |
|---|---|
| Wire a triggering element's event to `go()` | Call `history.pushState` by hand when this covers it |
| Use `route` for router-registered destinations | Set both `href` and `route` expecting a fallback |
| Interpolate dynamic segments from the event payload | Hardcode an id into `href` |
| Use a plain `<a>` when the thing *is* a link | Replace every link with a button plus a redirect |
