import { attributeChanged, define } from '@directive'
import Echo from '@echo'
import { Headless } from '@mixin'
import { urlFor } from '@router'

@define('m-redirect')
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

  go(params) {
    this.route
      ? history.pushState({}, '', urlFor(this.route, params))
      : history.pushState({}, '', this.href)
    return this
  }
}

export default Redirect
