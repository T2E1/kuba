import { connected, define } from '@directive'
import attributeChanged, {
  numeric,
  toNumericString,
} from '@directive/attributeChanged'
import { paint, retouch } from '@dom'
import Echo from '@echo'
import { around } from '@middleware'
import { Identity, role } from '@mixin'
import component from './component.js'
import { measurable } from './interfaces.js'
import { RANGE } from './range.js'
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

  // Not the `Value` mixin (packages/mixin/value.ts): its setter has no
  // default — this one falls back to RANGE.MIN — and it cannot carry the
  // `@retouch`/`@around(measurable)` stack this setter needs.
  get value() {
    return (this.#value ??= RANGE.MIN)
  }

  // `@attributeChanged('value', numeric)` only guards attribute writes —
  // `progress.value = untrusted` skips it entirely and reaches this setter
  // directly, which is the more common way a consumer drives a bar from
  // fetched data. So the setter re-applies the same guard with
  // `toNumericString` (numeric.js's primitive) itself: a value with no
  // numeric prefix is ignored (property keeps its last valid one), and a
  // numeric prefix followed by other text (CSS/markup injection included)
  // keeps only the parsed number, never the trailing text — the same
  // contract on both entry points, not just the attribute one.
  @attributeChanged('value', numeric)
  @retouch
  @around(measurable)
  set value(value) {
    const sanitized = toNumericString(value)
    sanitized !== undefined && (this.#value = sanitized)
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  // The fill percentage is a CSS width; `ariaValueNow` is what makes the same
  // number readable to a screen reader. The scale is fixed at 0-100 because
  // `value` is applied directly as a `%`. Runs on `@connected` too, so an
  // element mounted without a `value` attribute still publishes the
  // documented default range instead of leaving it unset.
  @connected
  [measurable]() {
    this.internals.ariaValueNow = this.value
    this.internals.ariaValueMin = RANGE.MIN
    this.internals.ariaValueMax = RANGE.MAX
    return this
  }
}

export default Progress
