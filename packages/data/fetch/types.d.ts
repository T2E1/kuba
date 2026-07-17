/** Outcome of a request made through {@link KUBAFetchElement}. */
interface FetchResult<T = unknown> {
  /** Parsed JSON response body, or `null` when the request failed. */
  data: T | null
  /** Error encountered while performing/parsing the request, if any. */
  error: unknown
}

/**
 * `<k-fetch>` custom element. Wraps HTTP requests to the URL in its `url` attribute,
 * interpolating the payload into the URL template, and dispatches `ok`/`error` events
 * with the resulting data instead of throwing. Starting a new request aborts any
 * request already in flight.
 *
 * @example
 * ```html
 * <k-fetch url="/api/users/{id}"></k-fetch>
 * <script>
 *   const fetcher = document.querySelector('k-fetch')
 *   fetcher.addEventListener('ok', (event) => console.log(event.detail))
 *   fetcher.get({ id: 1 })
 * </script>
 * ```
 */
export default class KUBAFetchElement extends HTMLElement {
  /** AbortController backing the current/most recent request. */
  readonly controller: AbortController

  /** URL template for requests, interpolated with the payload. Reflects the `url` attribute. */
  url: string

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
    'k-fetch': KUBAFetchElement
  }
}
