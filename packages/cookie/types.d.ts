declare module '@t2e1/kuba/cookie' {
  /**
   * Proxy-based object for reading, writing, and deleting browser cookies
   * via plain property access, backed directly by `document.cookie`.
   *
   * - Getting a property returns the raw cookie value, or `undefined` if no
   *   cookie with that name exists.
   * - Setting a property writes a cookie with `path=/` and a 1-year
   *   `max-age` (31536000 seconds), overwriting any existing cookie of the
   *   same name.
   * - Deleting a property expires the cookie immediately by writing it with
   *   `max-age=0`.
   *
   * There is no caching: every access reads from and every mutation writes
   * to `document.cookie` directly.
   *
   * @example
   * ```ts
   * import cookie from '@t2e1/kuba/cookie'
   *
   * cookie.theme = 'dark'      // sets a cookie named "theme"
   * cookie.theme               // 'dark'
   * delete cookie.theme        // expires the cookie
   * cookie.theme               // undefined
   * ```
   */
  const cookie: Record<string, string | undefined>

  export default cookie
}
