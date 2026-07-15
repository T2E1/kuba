import { connected, define } from '@directive'
import attributeChanged, { booleanAttribute } from '@directive/attributeChanged'
import { paint, repaint } from '@dom'
import Echo from '@echo'
import on, { customEvent, formData, prevent, stop } from '@event'
import { Hidden, Template } from '@mixin'
import component from './component'
import { rendered, resetted, submitted } from './interfaces'
import interpolate from './interpolate'
import style from './style'

@define('m-form')
@paint(component, style)
class Form extends Echo(Hidden(Template(HTMLElement))) {
  #autorender
  #internals
  #textContent

  get autorender() {
    return (this.#autorender ??= false)
  }

  @attributeChanged('autorender', booleanAttribute)
  set autorender(value) {
    this.#autorender = value
  }

  get internals() {
    return (this.#internals ??= this.attachInternals())
  }

  get textContent() {
    return (this.#textContent ??= '')
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  @repaint
  render(data) {
    this.#textContent = interpolate(super.template, data)
    return this
  }

  @connected
  [rendered]() {
    if (this.autorender) this.render()
    return this
  }

  reset() {
    const form = this.shadowRoot.querySelector('form')
    form.dispatchEvent(new Event('reset', { bubbles: true, cancelable: true }))
    return this
  }

  @on.reset('form', stop)
  [resetted]() {
    this.dispatchEvent(customEvent('resetted', {}))
    return this
  }

  submit() {
    const form = this.shadowRoot.querySelector('form')
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    return this
  }

  @on.submit('form', prevent, stop, formData)
  [submitted](data) {
    this.dispatchEvent(customEvent('submitted', data))
    return this
  }
}

export default Form
