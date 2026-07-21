/**
 * How `sink` is applied on {@link KUBARenderElement}, within its `on`
 * attribute.
 */
type KUBARenderOnAttributeSink = 'method' | 'attribute' | 'setter'

/**
 * Shape of the `on` attribute of {@link KUBARenderElement} — an arc string
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
type KUBARenderOnAttribute =
  `${string}/${string}:${KUBARenderOnAttributeSink}/${string}${'' | `|${string}`}`

/**
 * Custom element (`<kb-render>`) that renders its shadow DOM content by
 * interpolating a template against arbitrary data, supplied via
 * `render()`. Also an Echo host: its `on` attribute can wire `render()` to
 * another element's event (e.g. re-rendering whenever a data source
 * dispatches a `change` event), so updates happen declaratively without a
 * manual event listener.
 *
 * @example
 * ```html
 * <!-- Template as a direct child: no `template` attribute needed -->
 * <kb-render id="greeting" layout="grid">
 *   <template>Hello, {name}!</template>
 * </kb-render>
 * <script>
 *   document
 *     .getElementById('greeting')
 *     .render({ name: 'Ada' })
 * </script>
 * ```
 */
export default class KUBARenderElement extends HTMLElement {
  /**
   * Layout used for the host's slotted content: `'list'` stacks it in a
   * single flex column, `'grid'` arranges it in a two-column grid.
   * Reflects the `layout` attribute.
   * @default 'list'
   */
  layout: 'list' | 'grid'

  /**
   * Id reference to a `<template>` element elsewhere in the document,
   * resolved once (via `document.querySelector('#value')`) and cached.
   * Reflects the `template` attribute.
   *
   * When left unset, the element instead looks for its own `<template>`
   * child (`this.querySelector('template')`), so a `<template>` nested
   * directly inside `<kb-render>` works without this attribute at all.
   *
   * Either way, `render()` reads the resolved `<template>`'s `innerHTML`
   * verbatim, or — if it has no HTML text, only child elements — the
   * concatenated `outerHTML` of those children.
   *
   * @example
   * ```html
   * <!-- Referencing a template declared elsewhere by id -->
   * <template id="greeting-template">Hello, {name}!</template>
   * <kb-render template="greeting-template"></kb-render>
   * ```
   */
  template: string

  /**
   * Arc string wiring an event from another element to this host, in the
   * form `source/event:type/sink` (see {@link KUBARenderOnAttribute}).
   * Inherited from the `Echo` mixin. Reflects the `on` attribute.
   *
   * @example
   * ```ts
   * element.on = '#source/change:method/render' // ok
   * ```
   */
  on: KUBARenderOnAttribute | (string & {})

  /**
   * Interpolates the element's template against `data` and updates
   * `textContent` accordingly. A single value is treated as one entry;
   * an array renders one interpolation per entry, concatenated in order.
   *
   * @param data - Value(s) whose properties fill the template's
   *   `{path.to.value}` placeholders.
   * @returns This element, for chaining.
   */
  render(data: unknown | unknown[]): this
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-render': KUBARenderElement
  }
}
