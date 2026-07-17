/**
 * Shape of the `href` attribute of {@link KUBARedirectElement} — an
 * absolute URL, an absolute path, or a fragment/query starting with `#`
 * or `?`, since a bare relative segment (e.g. `profile`) is easy to
 * mistake for a `route` name.
 *
 * This only constrains the shape TypeScript can express through a
 * template literal type; it does not validate that the host/path is
 * well-formed. The check only applies to string literals — a value
 * assigned from a plain `string` variable falls back to unchecked
 * `string`.
 */
type KUBARedirectHrefAttribute =
  | `${'http' | 'https'}://${string}`
  | `/${string}`
  | `#${string}`
  | `?${string}`

/**
 * Custom element (`<kb-redirect>`) that navigates the browser via
 * `history.pushState` when its `go()` method is invoked, without
 * triggering a page reload. Also an Echo host: its `on` attribute can
 * wire `go()` to another element's event (e.g. a button's `clicked`),
 * so navigation happens declaratively without a manual event listener.
 *
 * @example
 * ```html
 * <kb-button id="to-profile">Profile</kb-button>
 * <kb-redirect on="#to-profile/clicked:method/go" route="user-profile">
 * </kb-redirect>
 * ```
 */
export default class KUBARedirectElement extends HTMLElement {
  /**
   * Target URL used when `route` is not set. Reflects the `href`
   * attribute.
   *
   * @default '#'
   *
   * @example
   * ```ts
   * element.href = '/profile'     // ok
   * element.href = 'profile'      // type error: missing leading `/`, `#`, `?`, or scheme
   * ```
   */
  href: KUBARedirectHrefAttribute | (string & {})

  /**
   * Name of a router-registered route to resolve (via `urlFor`) into the
   * target URL, taking precedence over `href` when set. Reflects the
   * `route` attribute.
   *
   * @default ''
   */
  route: string

  /**
   * Navigates to `route` (resolved with `params`) if set, otherwise to
   * `href`. `params` is ignored when `route` is empty.
   *
   * @param params - Values to interpolate into the named route's URL.
   * @returns This element, for chaining.
   */
  go(params?: Record<string, string>): this
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-redirect': KUBARedirectElement
  }
}
