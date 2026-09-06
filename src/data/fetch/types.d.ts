/** Outcome of a request made through {@link KUBAFetchElement}. */
interface FetchResult<T = unknown> {
  /** Parsed JSON response body, or `null` when the request failed. */
  data: T | null
  /** Error encountered while performing/parsing the request, if any. */
  error: unknown
}

/**
 * How `sink` is applied on {@link KUBAFetchElement}, within its `on`
 * attribute.
 */
type KUBAFetchOnAttributeSink = 'method' | 'attribute' | 'setter'

/**
 * Shape of the `on` attribute of {@link KUBAFetchElement} — an arc string
 * in the form `source/event:type/sink`, optionally followed by one or more
 * `|filter=value` pairs. Inherited from the `Echo` mixin.
 *
 * This only constrains the shape (the four `/`/`:`-separated segments and
 * the `type` segment); `source`, `event`, `sink`, and filter contents remain
 * free-form strings, since TypeScript cannot validate the full grammar (e.g.
 * arbitrary characters, filter repetition) through a template literal type.
 * The check only applies to string literals — a value assigned from a plain
 * `string` variable falls back to unchecked `string`.
 */
type KUBAFetchOnAttribute =
  `${string}/${string}:${KUBAFetchOnAttributeSink}/${string}${'' | `|${string}`}`

/**
 * `<kb-fetch>` custom element. Wraps HTTP requests to the URL in its `url` attribute,
 * interpolating the payload into the URL template, and dispatches `succeeded`/`failed` events
 * with the resulting data instead of throwing. Starting a new request aborts any
 * request already in flight.
 *
 * @example
 * ```html
 * <kb-fetch url="/api/users/{id}"></kb-fetch>
 * <script>
 *   const fetcher = document.querySelector('kb-fetch')
 *   fetcher.addEventListener('succeeded', (event) => console.log(event.detail))
 *   fetcher.get({ id: 1 })
 * </script>
 * ```
 */
export default class KUBAFetchElement extends HTMLElement {
  /** URL template for requests, interpolated with the payload. Reflects the `url` attribute. */
  url: string

  /**
   * Arc string wiring an event from another element to this fetcher, in the
   * form `source/event:type/sink` (see {@link KUBAFetchOnAttribute}).
   * Inherited from the `Echo` mixin. Reflects the `on` attribute.
   * @default undefined
   * @example
   * ```ts
   * // matches website/docs/components/fetch.mdx: an arc that triggers
   * // `get`/`post`/`put`/`delete` via `type=method`.
   * element.on = '#button/clicked:method/get'
   * ```
   */
  on: KUBAFetchOnAttribute | (string & {})

  /**
   * Sends a DELETE request to `url` (interpolated with `payload`), aborting any pending request.
   *
   * @param payload - Values used to interpolate the URL template.
   * @returns Promise resolving to the request result; rejections are captured into `error`.
   */
  delete<T = unknown>(payload?: unknown): Promise<FetchResult<T>>

  /**
   * Sends a GET request to `url` (interpolated with `payload`), aborting any pending request.
   *
   * @param payload - Values used to interpolate the URL template.
   * @returns Promise resolving to the request result; rejections are captured into `error`.
   */
  get<T = unknown>(payload?: unknown): Promise<FetchResult<T>>

  /**
   * Sends a POST request to `url` (interpolated with `payload`) using `payload` as the body,
   * aborting any pending request.
   *
   * @param payload - Values used to interpolate the URL template and sent as the request body.
   * @returns Promise resolving to the request result; rejections are captured into `error`.
   */
  post<T = unknown>(payload?: unknown): Promise<FetchResult<T>>

  /**
   * Sends a PUT request to `url` (interpolated with `payload`) using `payload` as the body,
   * aborting any pending request.
   *
   * @param payload - Values used to interpolate the URL template and sent as the request body.
   * @returns Promise resolving to the request result; rejections are captured into `error`.
   */
  put<T = unknown>(payload?: unknown): Promise<FetchResult<T>>
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-fetch': KUBAFetchElement
  }
}
