# Fetch

Wraps HTTP requests to the URL in its `url` attribute, interpolating the payload
into that URL, and publishes the outcome as `succeeded` or `failed`. It renders
nothing. Starting a request aborts whichever one is still in flight, so
out-of-order responses can't overwrite newer results.

```html preview
<kb-input name="breed" placeholder="Try 'akita'">
  <kb-label>Search dog breeds</kb-label>
</kb-input>

<kb-render>
  <kb-on value="dogs/succeeded:method/render"></kb-on>
  <kb-on value="dogs/failed:method/clear"></kb-on>
  <template>
    <kb-text size="xxs">{name}</kb-text>
  </template>
</kb-render>

<kb-fetch name="dogs" url="https://api.thedogapi.com/v1/breeds/search?q={}">
  <kb-headers key="x-api-key" value="DEMO-API-KEY"></kb-headers>
  <kb-on value="breed/changed:method/get"></kb-on>
</kb-fetch>
```

## Usage

```html
<kb-fetch name="users" url="/api/users/{id}"></kb-fetch>
```

```js
const fetcher = document.querySelector('kb-fetch')
fetcher.addEventListener('succeeded', (event) => render(event.detail))
fetcher.get({ id: 1 }) // → GET /api/users/1
```

## When to use

- **Any JSON request whose result drives the page** — a search, a detail view, a
  save — where you'd otherwise write `fetch`, parse, catch, and update.
- **Requests triggered by another element's event**, wired declaratively so the
  markup shows the data flow.

## When not to use

- **Non-JSON responses.** Every verb calls `.json()` internally; a text, blob or
  streaming response isn't supported.
- **Requests needing custom retry, progress or streaming** — use the `http`
  package directly, or plain `fetch`.
- **A request whose result nothing on the page consumes.** This element's whole
  purpose is publishing the outcome as an event.

## The URL template

`url` may contain `{path.to.value}` placeholders, resolved against the payload
by dot-path lookup. Missing or nullish segments become an empty string.

| `url` | `get(payload)` | Requests |
|---|---|---|
| `/api/users/{id}` | `{ id: 42 }` | `/api/users/42` |
| `/search?q={}` | `'akita'` | `/search?q=akita` |
| `/api/{group.name}/list` | `{ group: { name: 'admins' } }` | `/api/admins/list` |

`{}` — the empty placeholder — is the whole payload, which is what makes an arc
from a text field work without any transformation.

## Composition

- **Can contain**: one `<kb-headers>` per header name, and one or more
  `<kb-on>` for arcs. Nothing renders.
- **Can be a child of**: anything. It's commonly a sibling of the elements it
  feeds, near the end of the markup.

```html
<kb-fetch name="api" url="/api/users/{id}">
  <kb-headers key="x-api-key" value="PUBLIC-DEMO-KEY"></kb-headers>
  <kb-headers key="accept-language" value="pt-BR"></kb-headers>
  <kb-on value="row/clicked:method/get"></kb-on>
</kb-fetch>
```

`<kb-headers>` sets one key/value pair on its parent once the parent has
upgraded. It mutates the parent, not itself — placed under anything other than a
`<kb-fetch>`, it does nothing.

!> A key written in markup is visible to anyone who opens the page. Use this
only for public, rate-limited keys; anything real belongs behind your own
endpoint.

## Methods

Each verb aborts any pending request, interpolates the URL, and returns a
promise resolving to `{ data, error }` — it never throws.

| Method | Sends | Body |
|---|---|---|
| `get(payload)` | GET | — |
| `post(payload)` | POST | the payload |
| `put(payload)` | PUT | the payload |
| `delete(payload)` | DELETE | — |

For `post` and `put`, the payload is used **twice**: interpolated into the URL
*and* sent as the body. That's convenient when the id lives in both, and
surprising when it doesn't — `post({ id: 1, name: 'Ada' })` against
`url="/api/users/{id}"` sends `{ id: 1, name: 'Ada' }` to `/api/users/1`.

You can also await the result directly instead of listening:

```js
const { data, error } = await fetcher.get({ id: 1 })
```

## Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `url` | `string` | `''` | URL template, with optional `{path}` placeholders. |
| `name` | `string` | — | Identifies this element as the `source` of an arc. |
| `on` | arc string | — | Echo wiring, `source/event:type/sink`. |

## Events

| Event | Fires when | `detail` |
|---|---|---|
| `succeeded` | the request resolved without error | the parsed JSON body |
| `failed` | the request or its parsing failed | `null` |

!> **`failed` carries `null`, not the error.** Both branches dispatch the
result's `data`, which is `null` whenever `error` is set — so the reason for the
failure never reaches the listener. Wire `failed` to something that doesn't need
detail (`clear`, a message toggle), and `await` the method call when you need to
inspect the error. This looks like a bug rather than a design decision.

Dispatch is deferred with `requestIdleCallback`, so listeners run after the
response has been handled, not in the middle of it.

## Aborting

Each call aborts the previous one before starting. For a search-as-you-type
field this is exactly right: only the newest query can resolve, so a slow
earlier response can't land on top of a faster later one.

The flip side: two different consumers can't share one `<kb-fetch>`. If a detail
view and a list both request through the same element, whichever fires second
cancels the first. Use one element per concurrent request.

## States and accessibility

- The element is headless and renders nothing — it has no accessibility surface.
- **Nothing announces loading or failure.** Wire `succeeded`/`failed` to
  something visible: a `<kb-progress>`, a message, or a `<kb-render>` that
  clears. A silent failure is invisible to every user, and doubly so to screen
  reader users.

## Do's and don'ts

| Do | Don't |
|---|---|
| Use one element per concurrent request | Share one `<kb-fetch>` between two consumers — each call aborts the other |
| Wire `failed` to a visible reaction like `clear` | Rely on `failed`'s `detail` to explain what went wrong — it's `null` |
| `await` the method when you need the error | Assume a rejected promise; it resolves with `{ data, error }` |
| Keep API keys behind your own endpoint | Put a real credential in a `<kb-headers>` value |
