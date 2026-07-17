/**
 * Custom element (`<kb-redirect>`) that navigates the browser via
 * `history.pushState` when its `go()` method is invoked, without
 * triggering a page reload.
 *
 * @example
 * ```html
 * <kb-redirect id="to-profile" route="user-profile"></kb-redirect>
 * <script>
 *   document
 *     .getElementById('to-profile')
 *     .go({ id: '42' })
 * </script>
 * ```
 */
export default class KUBARedirectElement extends HTMLElement {
  /**
   * Target URL used when `route` is not set. Reflects the `href`
   * attribute.
   *
   * @default '#'
   */
  href: string

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

  namespace JSX {
    interface IntrinsicElements {
      'kb-redirect': KUBAIntrinsicElementProps<KUBARedirectElement>
    }
  }
}
