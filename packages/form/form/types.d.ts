export default class Form extends HTMLElement {
  autorender: boolean
  readonly internals: ElementInternals
  readonly textContent: string
  render(data?: unknown): this
  reset(): this
  submit(): this
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-form': Form
  }
}
