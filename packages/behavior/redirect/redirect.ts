import { attributeChanged, define } from '@directive'
import Echo from '@echo'
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
   * route); otherwise the raw `href` is used as-is and `params` is ignored.
   */
  go(params) {
    this.route
      ? history.pushState({}, '', urlFor(this.route, params))
      : history.pushState({}, '', this.href)
    return this
  }
}

export default Redirect
