export default class Textarea extends HTMLElement {
  readonly controller: AbortController
  disabled: boolean
  readonly form: HTMLFormElement | null
  id: string
  readonly internals: ElementInternals
  name: string
  placeholder: string
  readonly: boolean
  required: boolean
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
    'kb-textarea': Textarea
  }
}
