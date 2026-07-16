import { define, disconnected, formAssociated, formReset } from '@directive'
import attributeChanged, { booleanAttribute } from '@directive/attributeChanged'
import { didPaint, paint, repaint } from '@dom'
import Echo from '@echo'
import on, { customEvent, files, prevent } from '@event'
import { around } from '@middleware'
import { Hidden, Width } from '@mixin'
import component from './component'
import {
  change,
  dispatch,
  reflectable,
  reportable,
  validatable,
} from './interfaces'
import style from './style'

@define('kb-fileupload')
@paint(component, style)
class FileUpload extends Echo(Hidden(Width(HTMLElement))) {
  #base64
  #controller
  #internals
  #name
  #required

  get controller() {
    return (this.#controller ??= new AbortController())
  }

  get file() {
    return (this.#base64 ??= '')
  }

  @attributeChanged('file')
  @around(reflectable)
  @around(validatable)
  @around(dispatch)
  @repaint
  set file(value) {
    this.#base64 = value
  }

  get form() {
    return this.internals.form
  }

  get internals() {
    return (this.#internals ??= this.attachInternals())
  }

  get name() {
    return this.#name ?? ''
  }

  @attributeChanged('name')
  set name(value) {
    this.#name = value
  }

  get required() {
    return this.#required ?? false
  }

  @attributeChanged('required', booleanAttribute)
  @around(validatable)
  @around(reflectable)
  set required(value) {
    this.#required = value
  }

  get validationMessage() {
    return this.internals.validationMessage
  }

  get validity() {
    return this.internals.validity
  }

  get willValidate() {
    return this.internals.willValidate
  }

  static get formAssociated() {
    return true
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  @on.change('input', files)
  async [change]([file]) {
    const reader = new FileReader()
    reader.onload = () => (this.file = reader.result)
    reader.readAsDataURL(file)
    return this
  }

  checkValidity() {
    return this.internals.checkValidity()
  }

  [dispatch]() {
    this.dispatchEvent(customEvent('change', this.file))
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

  @on.clicked('kb-button', prevent)
  @formReset
  @around(reflectable)
  @repaint
  reset() {
    this.#base64 = null
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
      this.file && event.formData.set(this.name, this.file)
    const options = { signal: this.controller.signal }
    form?.addEventListener?.(event, listener, options)
    return this
  }

  @didPaint
  [reflectable]() {
    const valid = !this.required || !!this.file
    const validity = { valueMissing: !valid, valid }
    const validationMessage = valid ? '' : 'Please select a file.'
    this.internals.setValidity(validity, validationMessage)
    return this
  }
}

export default FileUpload
