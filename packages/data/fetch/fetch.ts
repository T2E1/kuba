import interpolate from '@behavior/render/interpolate'
import { attributeChanged, define } from '@directive'
import Echo from '@echo'
import { customEvent } from '@event'
import http from '@http'
import { after, before } from '@middleware'
import { Headless } from '@mixin'
import { abort, dispatch } from './interface'

@define('k-fetch')
class Fetch extends Echo(Headless(HTMLElement)) {
  #controller
  #url

  get controller() {
    return (this.#controller ??= new AbortController())
  }

  get url() {
    return (this.#url ??= '')
  }

  @attributeChanged('url')
  set url(value) {
    this.#url = value
  }

  [abort](payload) {
    this.controller.abort()
    this.#controller = new AbortController()
    return payload
  }

  [dispatch](response) {
    requestIdleCallback(async () => {
      const { data, error } = await response
      error
        ? this.dispatchEvent(customEvent('error', data))
        : this.dispatchEvent(customEvent('ok', data))
    })
    return this
  }

  @before(abort)
  @after(dispatch)
  delete(payload) {
    return http
      .delete(interpolate(this.url, payload))
      .signal(this.controller.signal)
      .json()
  }

  @before(abort)
  @after(dispatch)
  get(payload) {
    return http
      .get(interpolate(this.url, payload))
      .signal(this.controller.signal)
      .json()
  }

  @before(abort)
  @after(dispatch)
  post(payload) {
    return http
      .post(interpolate(this.url, payload))
      .body(payload)
      .signal(this.controller.signal)
      .json()
  }

  @before(abort)
  @after(dispatch)
  put(payload) {
    return http
      .put(interpolate(this.url, payload))
      .body(payload)
      .signal(this.controller.signal)
      .json()
  }
}

export default Fetch
