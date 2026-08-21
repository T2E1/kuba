import { attributeChanged, define } from '@directive'
import { paint, retouch } from '@dom'
import Echo from '@echo'
import { around } from '@middleware'
import { Identity, role } from '@mixin'
import component from './component.js'
import { measurable } from './interfaces.js'
import style from './style.js'

@define('kb-progress')
@paint(component, style)
class Progress extends Identity(Echo(HTMLElement)) {
  #internals
  #value

  get internals() {
    return (this.#internals ??= this.attachInternals())
  }

  // The shadow root is a bare <div>, so nothing inside carries the semantics —
  // without this the bar is an anonymous box to assistive technology.
  get [role]() {
    return 'progressbar'
  }

  get value() {
    return (this.#value ??= '0')
  }

  @attributeChanged('value')
  @retouch
  @around(measurable)
  set value(value) {
    this.#value = value
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  // The fill percentage is a CSS width; `ariaValueNow` is what makes the same
  // number readable to a screen reader. The scale is fixed at 0-100 because
  // `value` is applied directly as a `%`.
  [measurable]() {
    this.internals.ariaValueNow = this.value
    this.internals.ariaValueMin = '0'
    this.internals.ariaValueMax = '100'
    return this
  }
}

export default Progress
