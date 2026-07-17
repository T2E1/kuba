declare module '@t2e1/kuba/router' {
  /**
   * Callable route registrar returned by every `router(path, page)` call, so
   * registrations can be chained: `router('/a', pageA)('/b', pageB)`.
   */
  interface Router {
    /**
     * Registers a route.
     *
     * @param path - A path pattern, e.g. `/users/:id`. A `:name` segment
     * matches one or more of `[a-z0-9-_]` (case-insensitive) and is exposed
     * via {@link params} once matched.
     * @param page - Callback invoked when `path` matches the current URL.
     * @returns This same `Router`, for chaining further registrations.
     * @example
     * router('/users/:id', showUser)('/about', showAbout)
     */
    (path: string, page: () => void): Router

    /** Self-reference to the router function, exposed as a property. */
    router: Router

    /**
     * Registers the page to run when no route matches the current URL.
     *
     * @param page - Callback invoked as the fallback.
     * @example
     * router.fallback(showNotFound)
     */
    fallback(page: () => void): void

    /**
     * Resolves the route matching the current URL and invokes its page
     * callback (or the fallback's, if none match). Intended to be wired up
     * to `popstate`/`pushstate` listeners rather than called directly.
     */
    handle(): void
  }

  /**
   * Default export: register routes by calling it, or use its `fallback`/
   * `handle` properties.
   *
   * @example
   * import router from '@t2e1/kuba/router'
   *
   * router('/users/:id', function showUser() {})
   * router.fallback(function showNotFound() {})
   */
  const router: Router

  export default router

  /**
   * Reads the current URL's query string into a plain-object-like function
   * whose own enumerable properties are the query parameters. Call it again
   * after navigation to refresh the values.
   *
   * @example
   * // URL: /search?query=cats
   * import { args } from '@t2e1/kuba/router'
   *
   * args()
   * args.query // 'cats'
   */
  export function args(): void

  /**
   * Extracts named `:segment` values from `path` against the current URL
   * pathname into a plain-object-like function whose own enumerable
   * properties are the extracted params. Called internally by `router.handle`
   * with the path of the matched route; calling it with no `path` clears
   * previously extracted params.
   *
   * @param path - The matched route's path pattern, e.g. `/users/:id`.
   * @example
   * // URL: /users/42, route registered as router('/users/:id', ...)
   * import { params } from '@t2e1/kuba/router'
   *
   * params('/users/:id')
   * params.id // '42'
   */
  export function params(path?: string): void

  /**
   * Builds a URL for the route whose registered page function has a
   * matching `.name`, substituting `:key` segments from `params`.
   *
   * @param name - The `name` of the page function passed to `router()` when
   * the route was registered.
   * @param params - Values to substitute into the route's `:key` segments.
   * Segments without a matching entry are left as `:key` in the result.
   * @returns The resolved URL, or `'#'` if the matched route was registered
   * without a `path`.
   * @throws {TypeError} If no registered route has a page with a matching
   * `.name`.
   * @example
   * // Registered as: router('/users/:id', function showUser() {})
   * import { urlFor } from '@t2e1/kuba/router'
   *
   * urlFor('showUser', { id: '42' }) // '/users/42'
   */
  export function urlFor(name: string, params?: Record<string, string>): string
}
