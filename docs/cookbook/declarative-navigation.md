# Declarative navigation

Navigating without writing `history.pushState` anywhere: a button publishes
`clicked`, and a `<kb-redirect>` subscribes to it. The button never learns where
it leads, which is what keeps it reusable.

```html
<kb-button id="to-profile">View profile</kb-button>
<kb-redirect href="/profile" on="#to-profile/clicked:method/go"></kb-redirect>
```

?> There's no live preview on this page. Every example would call `pushState`
and change the URL of the documentation site itself.

## Why the button doesn't know the destination

The alternative most codebases reach for puts navigation inside the control:

```html
<!-- Don't: the button now knows about routing -->
<kb-button onclick="location.href = '/profile'">View profile</kb-button>
```

That button can't be reused anywhere the destination differs, and it can't be
tested without a router. Splitting it in two keeps each element responsible for
one thing: the button reports that it was pressed, the redirect decides what
that means.

## Dynamic segments

A single redirect serves a whole list when the destination has a placeholder
filled from the event's payload:

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

Two things make this work:

- Each card's `value="{id}"` is interpolated per record, so every card publishes
  its own id as the `clicked` payload.
- The arc's source is the **tag name** `kb-card`, matching every card on the
  page rather than one by id — so cards rendered later are covered too.

`{}` in the `href` is the whole payload. For an object payload, name the path:
`href="/user/{id}/settings"`.

## Named routes

When the router owns the URL shapes, use `route` instead of `href` and let
`urlFor` resolve it:

```js
import router from '@t2e1/kuba/router'

router('/user/:id', function showUser() {
  // render the user page
})
```

```html
<kb-redirect route="showUser" on="kb-card/clicked:method/go"></kb-redirect>
```

The route is found by the **name of the page function** — `showUser` — so the
function can't be an anonymous arrow. Naming it is what makes it addressable.

!> Setting both `route` and `href` doesn't give you a fallback. When `route` is
set, `href` is never used.

## Reacting to the navigation

`go()` calls `history.pushState`, which emits a `pushstate` event on `window`.
The router listens for it and runs the matching route, so the page updates
without a reload:

```js
import router, { params } from '@t2e1/kuba/router'

router('/user/:id', function showUser() {
  document.querySelector('kb-fetch[name="user"]').get({ id: params.id })
})
```

The chain end to end: card clicked → redirect navigates → router matches → route
callback requests → fetch publishes `succeeded` → a renderer subscribes. Two of
those five steps are JavaScript, and both are about routing rather than wiring.

## When to use a real link instead

This pattern trades away things a plain `<a href>` gives for free:

- the destination on hover, and in the status bar
- open in a new tab, copy link address, bookmark
- announcement as a link by assistive technology
- working before JavaScript loads

**When the thing genuinely *is* a link, use an `<a>`.** Reach for
`<kb-redirect>` when navigation is the *consequence* of an action — a save that
returns to a list, a selection that opens a detail view — rather than the action
itself.

## Related

- [Redirect](/components/redirect) — `href` vs `route`, and `go()`.
- [router](/reference/router) — route registration, `params`, `urlFor`.
- [Events and Echo](/learn/events-and-echo) — matching sources by id, name or
  tag.
