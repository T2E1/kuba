import { attributeChanged, define } from '@directive'
import Echo from '@echo'
import interpolate from '@interpolate'
import { Headless } from '@mixin'
import { urlFor } from '@router'

@define('kb-redirect')
class Redirect extends Headless(Echo(HTMLElement)) {
  #href
  #route

  get href() {
    return (this.#href ??= '#')
  }

  @attributeChanged('href')
  set href(value) {
    this.#href = value
  }

  get route() {
    return (this.#route ??= '')
  }

  @attributeChanged('route')
  set route(value) {
    this.#route = value
  }

  /**
   * Navigates via `history.pushState`, without triggering a page reload.
   * `route` takes precedence over `href`: when set, the target URL is
   * resolved through `urlFor` (interpolating `params` into the named
   * route); otherwise `href` is interpolated against `params` directly
   * (e.g. `href="/user/{id}"`).
   */
  go(params = {}) {
    this.route
      ? history.pushState({}, '', urlFor(this.route, params))
      : history.pushState({}, '', interpolate(this.href, params))
    return this
  }
}

export default Redirect
