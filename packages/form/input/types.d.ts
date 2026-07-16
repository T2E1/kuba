export default class Input extends HTMLElement {
  readonly controller: AbortController
  disabled: boolean
  readonly form: HTMLFormElement | null
  id: string
  inputMode: string
  readonly internals: ElementInternals
  max: string
  maxLength: string
  min: string
  minLength: string
  name: string
  pattern: string
  placeholder: string
  readonly: boolean
  required: boolean
  step: string
  type: string
  readonly validationMessage: string
  readonly validity: ValidityState
  value: string
  readonly willValidate: boolean
  checkValidity(): boolean
  reportValidity(): boolean
  reset(): this
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-input': Input
  }
}
