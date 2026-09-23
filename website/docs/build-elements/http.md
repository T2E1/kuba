# http

```js
import http from '@t2e1/kuba/http'
```

A fluent `fetch` wrapper that **never throws**. Every request resolves to
`{ data, error }`, so calling code branches on a value instead of wrapping
everything in `try`/`catch`.

```js
const { data, error } = await http
  .post('/api/users')
  .body({ name: 'Ada' })
  .headers({ 'x-api-key': key })
  .json()

if (error) return showError()
render(data)
```

## Starting a request

`http.<verb>(url)` starts a builder. The verb is whatever property you access,
so `get`, `post`, `put`, `delete`, `patch` and any other method name work.

| Call | Sends |
|---|---|
| `http.get(url)` | GET |
| `http.post(url)` | POST |
| `http.put(url)` | PUT |
| `http.delete(url)` | DELETE |

## Configuring it

Each method returns the same builder, so they chain in any order. **Nothing is
sent until `json()` is called.**

| Method | Parameter | Description |
|---|---|---|
| `body(target)` | `unknown` | Serializes `target` as JSON into the request body. |
| `headers(target)` | `HeadersInit` | Anything the `Headers` constructor accepts. |
| `signal(target)` | `AbortSignal` | Cancels the in-flight request when aborted. |

## Sending it

`json()` sends the request and parses the response body as JSON.

```ts
json<T = unknown>(): Promise<HttpResult<T>>
```

```ts
interface HttpResult<T> {
  data: T | null
  error: unknown
}
```

Exactly one side is populated: a 2xx response yields `data` with `error: null`;
a non-2xx response, a network failure, or a JSON parse error yields
`data: null` with `error` set.

!> **The promise never rejects.** `await` alone won't surface a failure — you
have to check `error`. A `try`/`catch` around this will never fire, which is
easy to write and easy to be fooled by.

## Relationship to `<kb-fetch>`

[`<kb-fetch>`](/components/fetch) is this package plus URL interpolation, header
composition from `<kb-headers>` children, automatic aborting of the previous
request, and event dispatch. Use the element when the result drives the page
declaratively; use `http` directly when you want the promise, or when the
request isn't tied to an element at all.

One asymmetry worth knowing: the element's `failed` event carries `null` rather
than the error, so when you need to inspect a failure, `await` the element's
method — or call `http` yourself.

## Limitations

- **JSON only.** `json()` is the only send method; text, blob and streaming
  responses aren't supported.
- **No retry, no timeout, no interceptors.** Compose those yourself around the
  promise, or use `fetch` directly.
- **No base URL.** Pass the full path each time, or build it before calling.
