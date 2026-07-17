declare module '@t2e1/kuba/http' {
  /**
   * Outcome of a request performed through {@link HttpRequest.json}.
   *
   * Exactly one of `data`/`error` is populated: a successful (2xx) response
   * yields `data` with `error: null`; a failed response or network/parsing
   * error yields `data: null` with `error` set. This shape never throws —
   * callers must check `error` instead of using try/catch.
   *
   * @typeParam T - Expected shape of the parsed JSON response body.
   */
  interface HttpResult<T = unknown> {
    data: T | null
    error: unknown
  }

  /**
   * Fluent builder for a single HTTP request. Each configuration method
   * returns the same builder instance, and the request is only sent once
   * {@link HttpRequest.json} is called.
   */
  interface HttpRequest {
    /**
     * Sets the request body, serializing `target` as JSON.
     *
     * @param target - Value to serialize into the request body.
     * @returns This builder, for chaining.
     */
    body(target: unknown): this

    /**
     * Sets the request headers.
     *
     * @param target - Header entries, in any form accepted by the `Headers` constructor.
     * @returns This builder, for chaining.
     */
    headers(target: HeadersInit): this

    /**
     * Attaches an `AbortSignal` used to cancel the request.
     *
     * @param target - Signal that aborts the in-flight request when triggered.
     * @returns This builder, for chaining.
     */
    signal(target: AbortSignal): this

    /**
     * Sends the request and parses the response body as JSON.
     *
     * Never rejects: network failures and non-2xx responses resolve to an
     * {@link HttpResult} with `error` populated instead of throwing.
     *
     * @typeParam T - Expected shape of the parsed JSON response body.
     * @returns A promise resolving to the request outcome.
     *
     * @example
     * ```ts
     * const { data, error } = await http.post('/api/users')
     *   .body({ name: 'Ada' })
     *   .json<User>()
     * ```
     */
    json<T = unknown>(): Promise<HttpResult<T>>
  }

  /**
   * Starts building a request for a given URL, using the HTTP method the
   * property was accessed with (e.g. `http.get(url)`, `http.post(url)`).
   *
   * @param url - Target URL for the request.
   * @returns A request builder for further configuration and dispatch.
   */
  type HttpMethod = (url: string) => HttpRequest

  /**
   * Entry point for making HTTP requests. Any property name is accepted as
   * an HTTP method (e.g. `http.get`, `http.post`, `http.delete`) — there is
   * no fixed set of supported verbs.
   *
   * @example
   * ```ts
   * import http from '@t2e1/kuba/http'
   *
   * const { data, error } = await http.get('/api/users').json<User[]>()
   * ```
   */
  const http: Record<string, HttpMethod>

  export default http
}
