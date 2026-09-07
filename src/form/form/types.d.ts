/**
 * How `sink` is applied on {@link KUBAFormElement}, within its `on`
 * attribute.
 */
type KUBAFormOnAttributeSink = 'method' | 'attribute' | 'setter'

/**
 * Shape of the `on` attribute of {@link KUBAFormElement} — an arc string
 * in the form `source/event:type/sink`, optionally followed by one or more
 * `|filter=value` pairs. Inherited from the `Echo` mixin.
 *
 * This only constrains the shape (the four `/`/`:`-separated segments and
 * the `type` segment); `source`, `event`, `sink`, and filter contents remain
 * free-form strings, since TypeScript cannot validate the full grammar (e.g.
 * arbitrary characters, filter repetition) through a template literal type.
 * The check only applies to string literals — a value assigned from a plain
 * `string` variable falls back to unchecked `string`.
 */
type KUBAFormOnAttribute =
  `${string}/${string}:${KUBAFormOnAttributeSink}/${string}${'' | `|${string}`}`

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
   * Whether the element renders its `<template>` content automatically on
   * connect, without waiting for an explicit `render()` call (reflects the
   * `autorender` attribute).
   * @default false
   */
  autorender: boolean

  /**
   * Whether the element is hidden (reflects the `hidden` attribute).
   * Inherited from the `Hidden` mixin. Setting it to `false` also removes
   * the attribute; a truthy value toggles the `:host(:state(hidden))`
   * custom element state.
   * @default false
   */
  hidden: boolean

  /**
   * Arc string wiring an event from another element to this form, in the
   * form `source/event:type/sink`, optionally followed by `|filter=value`
   * pairs. Inherited from the `Echo` mixin. Reflects the `on` attribute.
   * @default undefined
   */
  on: KUBAFormOnAttribute | (string & {})

  /**
   * Markup source for `render()` (reflects the `template` attribute).
   * Setting the attribute points it at a `<template>` elsewhere in the
   * document by id; reading resolves the host's own `<template>` child and
   * returns its `innerHTML`, or the concatenated `outerHTML` of its children
   * when it has no `innerHTML`. Inherited from the `Template` mixin.
   */
  template: string

  /**
   * HTML produced by the last `render()` call — the interpolated
   * `<template>` content, `''` until the first call. This getter shadows
   * the native `Node.prototype.textContent`; the consumer drives content
   * through `render()`, not by reading this.
   */
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
}
