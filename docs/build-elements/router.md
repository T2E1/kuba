# router

```js
import router, { args, params, urlFor } from '@t2e1/kuba/router'
```

A client-side router built on `history.pushState`: register paths against
callbacks, and the matching one runs when the URL changes.

```js
import router, { params } from '@t2e1/kuba/router'

router('/users/:id', function showUser() {
  render(params.id)
})('/about', function showAbout() {
  render('about')
})

router.fallback(function showNotFound() {
  render('404')
})
```

## `router(path, page)`

Registers a route and returns itself, so registrations chain.

| Parameter | Type | Description |
|---|---|---|
| `path` | `string` | A pattern, e.g. `/users/:id`. A `:name` segment matches one or more of `[a-z0-9-_]`, case-insensitive. |
| `page` | `() => void` | Runs when the pattern matches the current URL. |

!> **Name your page functions.** `urlFor` finds a route by the `.name` of its
page function, so an anonymous arrow (`() => {}`) can never be resolved back to
a URL.

## `router.fallback(page)`

Registers the callback to run when no route matches. Without one, an unmatched
URL runs nothing at all — no error, no output.

## `router.handle()`

Resolves the route matching the current URL and invokes its page. Meant to be
wired to `popstate` and `pushstate` rather than called directly.

## `params(path?)`

Extracts `:segment` values from the matched pattern against the current
pathname. `router.handle` calls it for you with the matched route's path.

```js
// URL: /users/42, registered as router('/users/:id', showUser)
params.id // '42'
```

Calling it with no argument clears previously extracted params.

?> `params` is a function whose own properties hold the values — read
`params.id`, not `params().id`. `args` works the same way. It's an unusual
shape: the module mutates itself so consumers can read fresh values without
re-importing.

## `args()`

Reads the current URL's query string onto itself, the same way.

```js
// URL: /search?query=cats
args()
args.query // 'cats'
```

Call it again after navigation to refresh — unlike `params`, nothing calls it
for you.

## `urlFor(name, params?)`

Builds a URL for the route whose page function's `.name` matches `name`,
substituting `:key` segments.

```js
urlFor('showUser', { id: 42 }) // '/users/42'
```

| Behavior | Result |
|---|---|
| A `:key` with no matching entry in `params` | left as `:key`, not an error — partial templates are allowed |
| No route with that page name | **throws `TypeError`** |

This is what `<kb-redirect>`'s `route` attribute resolves through.

## Navigation

Navigating with `history.pushState` emits a `pushstate` event on `window`, which
this package listens for alongside `popstate` — that's how a route change
triggers `handle()` without a reload.

[`<kb-redirect>`](/components/redirect) is the declarative front end of this:
wire an element's event to its `go()` method instead of calling `pushState`
yourself.
