import { attributeChanged, define } from '@directive'
import Echo from '@echo'
import { customEvent } from '@event'
import http from '@http'
import interpolate from '@interpolate'
import { after, before } from '@middleware'
import { Headless } from '@mixin'
import Controller from './controller'
import { abort, dispatch, setHeader } from './interfaces'

// `url` may contain `{path.to.value}` placeholders resolved against `payload` by
// @interpolate (dot-path lookup, missing/nullish segments become an empty string).
@define('kb-fetch')
class Fetch extends Echo(Headless(HTMLElement)) {
  #controller = new Controller()
  #headers = {}
  #url

  get url() {
    return (this.#url ??= '')
  }

  @attributeChanged('url')
  set url(value) {
    this.#url = value
  }

  // Called by a `<kb-headers>` child once upgraded — sets one entry in the
  // plain object handed to `http.<verb>(...).headers(...)`, which forwards
  // it to the native `Headers` constructor.
  [setHeader](key, value) {
    this.#headers[key] = value
    return this
  }

  // Cancels any in-flight request before a new one starts. The controller renews itself
  // lazily on the next read of `signal` (see controller.js) — not here.
  [abort](payload) {
    this.#controller.abort()
    return payload
  }

  // Deferred via requestIdleCallback so event dispatch doesn't block the response handling.
  async [dispatch](response) {
    const { data, error } = await response
    requestIdleCallback(() => {
      error
        ? this.dispatchEvent(customEvent('failed', error))
        : this.dispatchEvent(customEvent('succeeded', data))
    })
    return { data, error }
  }

  @before(abort)
  @after(dispatch)
  delete(payload) {
    return http
      .delete(interpolate(this.url, payload))
      .headers(this.#headers)
      .signal(this.#controller.signal)
      .json()
  }

  @before(abort)
  @after(dispatch)
  get(payload) {
    return http
      .get(interpolate(this.url, payload))
      .headers(this.#headers)
      .signal(this.#controller.signal)
      .json()
  }

  @before(abort)
  @after(dispatch)
  post(payload) {
    return http
      .post(interpolate(this.url, payload))
      .body(payload)
      .headers(this.#headers)
      .signal(this.#controller.signal)
      .json()
  }

  @before(abort)
  @after(dispatch)
  put(payload) {
    return http
      .put(interpolate(this.url, payload))
      .body(payload)
      .headers(this.#headers)
      .signal(this.#controller.signal)
      .json()
  }
}

export default Fetch
