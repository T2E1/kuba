/**
 * Shape of the `href` attribute of {@link KUBARedirectElement} — an
 * absolute URL, an absolute path, or a fragment/query starting with `#`
 * or `?`, since a bare relative segment (e.g. `profile`) is easy to
 * mistake for a `route` name. May contain `{path.to.value}` placeholders
 * (see `go()`), which are free-form text as far as this shape is concerned.
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
 * How `sink` is applied on {@link KUBARedirectElement}, within its `on`
 * attribute.
 */
type KUBARedirectOnAttributeSink = 'method' | 'attribute' | 'setter'

/**
 * Shape of the `on` attribute of {@link KUBARedirectElement} — an arc
 * string in the form `source/event:type/sink`, optionally followed by one
 * or more `|filter=value` pairs. Inherited from the `Echo` mixin.
 *
 * This only constrains the shape (the four `/`/`:`-separated segments and
 * the `type` segment); `source`, `event`, `sink`, and filter contents remain
 * free-form strings, since TypeScript cannot validate the full grammar (e.g.
 * arbitrary characters, filter repetition) through a template literal type.
 * The check only applies to string literals — a value assigned from a plain
 * `string` variable falls back to unchecked `string`.
 */
type KUBARedirectOnAttribute =
  `${string}/${string}:${KUBARedirectOnAttributeSink}/${string}${'' | `|${string}`}`

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
   * attribute. May contain `{path.to.value}` placeholders, resolved
   * against the `params` passed to `go()`.
   *
   * @default '#'
   *
   * @example
   * ```ts
   * element.href = '/profile'     // ok
   * element.href = '/user/{id}'   // ok — interpolated by go({ id: 42 })
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
   * Arc string wiring an event from another element to this host, in the
   * form `source/event:type/sink` (see {@link KUBARedirectOnAttribute}).
   * Inherited from the `Echo` mixin. Reflects the `on` attribute.
   *
   * @example
   * ```ts
   * element.on = '#to-profile/clicked:method/go' // ok
   * ```
   */
  on: KUBARedirectOnAttribute | (string & {})

  /**
   * Navigates to `route` (resolved with `params` via `urlFor`) if set,
   * otherwise to `href`, interpolating `{path.to.value}` placeholders in
   * `href` against `params` (e.g. `href="/user/{id}"`).
   *
   * @param params - Values to interpolate into the target URL, whether
   *   resolved from `route` or from placeholders in `href`.
   * @returns This element, for chaining.
   * @example
   * ```ts
   * element.href = '/user/{id}'
   * element.go({ id: 42 }) // navigates to '/user/42'
   * ```
   */
  go(params?: Record<string, string>): this
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-redirect': KUBARedirectElement
  }
}
