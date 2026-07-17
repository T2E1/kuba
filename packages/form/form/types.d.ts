/**
 * Custom form container element (`<kb-form>`).
 *
 * Wraps a native `<form>` inside its shadow root and re-dispatches its
 * `submit` and `reset` events as cancellable `submitted`/`resetted` custom
 * events. `submitted` carries the form's parsed data. Content can be
 * rendered from a `<template>` child, optionally interpolated with data
 * passed to `render()`.
 *
 * @example
 * ```html
 * <kb-form>
 *   <template>
 *     <input name="email" type="email" required />
 *     <button type="submit">Send</button>
 *   </template>
 * </kb-form>
 * <script>
 *   document.querySelector('kb-form')
 *     .addEventListener('submitted', (event) => console.log(event.detail))
 * </script>
 * ```
 */
export default class KUBAFormElement extends HTMLElement {
  /**
   * Whether the element should render its `<template>` content
   * automatically as soon as it connects to the DOM, without waiting for
   * an explicit `render()` call.
   * @default false
   * Reflects the `autorender` attribute.
   */
  autorender: boolean
  /** The `ElementInternals` instance backing this element. */
  readonly internals: ElementInternals
  /** The current rendered HTML content of the form, produced by `render()`. */
  readonly textContent: string
  /**
   * Renders the element's `<template>` content, replacing any `{path}`
   * placeholders with values read from `data`.
   * @param data - Values to interpolate into the template; a placeholder
   * `{}` is replaced with `data` itself, `{path.to.value}` with a nested
   * property lookup.
   */
  render(data?: unknown): this
  /** Dispatches a `reset` event on the inner native form, triggering the `resetted` event. */
  reset(): this
  /** Dispatches a `submit` event on the inner native form, triggering the `submitted` event with its `FormData`. */
  submit(): this
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-form': KUBAFormElement
  }

  namespace JSX {
    interface IntrinsicElements {
      'kb-form': KUBAIntrinsicElementProps<KUBAFormElement>
    }
  }
}
