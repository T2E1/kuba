export default class FileUpload extends HTMLElement {
  readonly controller: AbortController
  file: string
  readonly form: HTMLFormElement | null
  readonly internals: ElementInternals
  name: string
  required: boolean
  readonly validationMessage: string
  readonly validity: ValidityState
  readonly willValidate: boolean
  checkValidity(): boolean
  reportValidity(): boolean
  reset(): this
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-fileupload': FileUpload
  }
}
