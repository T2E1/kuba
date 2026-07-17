import { define, disconnected, formAssociated, formReset } from '@directive'
import attributeChanged, { booleanAttribute } from '@directive/attributeChanged'
import { didPaint, paint } from '@dom'
import Echo from '@echo'
import on, { customEvent, prevent, value } from '@event'
import { around } from '@middleware'
import { Hidden, Width } from '@mixin'
import component from './component'
import Element from './element'
import {
  change,
  disableable,
  dispatch,
  reflectable,
  reportable,
  validatable,
} from './interfaces'
import style from './style'

/**
 * Form-associated text input element. Delegates most native input
 * attributes/properties to the shadow-rendered `<input>` (via `Element`)
 * and mirrors its validity into `ElementInternals` so the host participates
 * in the owning form's constraint validation as a single unit.
 */
@define('kb-input')
@paint(component, style)
class Input extends Echo(Hidden(Width(HTMLElement))) {
  #controller
  #element
  #internals

  get controller() {
    return (this.#controller ??= new AbortController())
  }

  get disabled() {
    return this.element.disabled
  }

  @attributeChanged('disabled', booleanAttribute)
  @around(disableable)
  set disabled(value) {
    this.element.disabled = value
  }

  get element() {
    return (this.#element ??= Element.from(this))
  }

  get form() {
    return this.internals.form
  }

  get id() {
    return this.element.id || this.name
  }

  @attributeChanged('id')
  set id(value) {
    this.element.id = value
  }

  get inputMode() {
    return this.element.inputmode
  }

  @attributeChanged('inputmode')
  set inputMode(value) {
    this.element.inputmode = value
  }

  get internals() {
    return (this.#internals ??= this.attachInternals())
  }

  get max() {
    return this.element.max
  }

  @attributeChanged('max')
  set max(value) {
    this.element.max = value
  }

  get maxLength() {
    return this.element.maxlength
  }

  @attributeChanged('maxlength')
  set maxLength(value) {
    this.element.maxlength = value
  }

  get min() {
    return this.element.min
  }

  @attributeChanged('min')
  set min(value) {
    this.element.min = value
  }

  get minLength() {
    return this.element.minlength
  }

  @attributeChanged('minlength')
  set minLength(value) {
    this.element.minlength = value
  }

  get name() {
    return this.element.name ?? ''
  }

  @attributeChanged('name')
  set name(value) {
    this.element.name = value
  }

  get pattern() {
    return this.element.pattern
  }

  @attributeChanged('pattern')
  set pattern(value) {
    this.element.pattern = value
  }

  get placeholder() {
    return this.element.placeholder
  }

  @attributeChanged('placeholder')
  set placeholder(value) {
    this.element.placeholder = value
  }

  get readonly() {
    return this.element.readonly
  }

  @attributeChanged('readonly', booleanAttribute)
  set readonly(value) {
    this.element.readonly = value
  }

  get required() {
    return this.element.required
  }

  @attributeChanged('required', booleanAttribute)
  @around(validatable)
  @around(reflectable)
  set required(value) {
    this.element.required = value
  }

  get step() {
    return this.element.step
  }

  @attributeChanged('step')
  set step(value) {
    this.element.step = value
  }

  get type() {
    return this.element.type
  }

  @attributeChanged('type')
  set type(value) {
    this.element.type = value
  }

  get validationMessage() {
    return this.internals.validationMessage
  }

  get validity() {
    return this.internals.validity
  }

  get value() {
    return this.element.value
  }

  @attributeChanged('value')
  @around(reflectable)
  @around(validatable)
  @around(dispatch)
  set value(value) {
    this.element.value = value
  }

  get willValidate() {
    return this.internals.willValidate
  }

  static get formAssociated() {
    return true
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open', delegatesFocus: true })
  }

  @on.input('input', value)
  [change](val) {
    this.value = val
    return this
  }

  checkValidity() {
    return this.internals.checkValidity()
  }

  [disableable]() {
    this.disabled
      ? this.internals.states.add('disabled')
      : this.internals.states.delete('disabled')
    return this
  }

  [dispatch]() {
    this.dispatchEvent(customEvent('change', this.value))
    return this
  }

  @disconnected
  remove() {
    super.remove()
    this.controller.abort()
    return this
  }

  reportValidity() {
    return this.internals.reportValidity()
  }

  @formReset
  @around(reflectable)
  reset() {
    this.element.value = ''
    this.removeAttribute('value')
    this.internals.states.delete('invalid')
    this.dispatchEvent(new Event('reset'))
    return this
  }

  @on.invalid('*', prevent)
  [validatable]() {
    this.validity.valid
      ? this.internals.states.delete('invalid')
      : this.internals.states.add('invalid')
    return this
  }

  @formAssociated
  [reportable](form) {
    const event = 'formdata'
    const listener = (event) =>
      !this.disabled && event.formData.set(this.name, this.value)
    const options = { signal: this.controller.signal }
    form?.addEventListener?.(event, listener, options)
    return this
  }

  /** Mirrors the native `<input>`'s own validity/message into `ElementInternals`, since the host itself has no validation logic of its own. */
  @didPaint
  [reflectable]() {
    const { validationMessage, validity } = this.element
    this.internals.setValidity(validity, validationMessage)
    return this
  }
}

export default Input
