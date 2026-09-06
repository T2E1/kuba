/**
 * Shape of the `on` attribute of {@link KUBAFindElement} — an arc string
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
type KUBAFindOnAttributeSink = 'method' | 'attribute' | 'setter'

type KUBAFindOnAttribute =
  `${string}/${string}:${KUBAFindOnAttributeSink}/${string}${'' | `|${string}`}`

/**
 * `<kb-find>` custom element. Finds the first record in the `value` collection exposed
 * by its parent element (e.g. `<kb-dataset>`) whose `key` field matches `value`, then
 * dispatches a `found` event on the parent with the matching record.
 *
 * @remarks
 * Only meaningful as a direct child of an element exposing a `value` array (e.g.
 * `<kb-dataset>`) — the search targets `parentElement`, so nesting it under a plain
 * HTML element, or standalone, has no effect. This is a usage contract, not something
 * TypeScript can enforce.
 *
 * @example
 * ```html
 * <kb-dataset upsert="id">
 *   <kb-find key="id" value="1"></kb-find>
 * </kb-dataset>
 * <script>
 *   const dataset = document.querySelector('kb-dataset')
 *   dataset.addEventListener('found', (event) => console.log(event.detail))
 * </script>
 * ```
 */
export default class KUBAFindElement extends HTMLElement {
  /**
   * Name of the record field to compare against `value`. Synced from the `key`
   * attribute. Writing it does not trigger a search — only `value` does.
   * @default undefined
   */
  key: string

  /**
   * Arc string wiring an event from another element to this element, in the
   * form `source/event:type/sink` (see {@link KUBAFindOnAttribute}).
   * Inherited from the `Echo` mixin. Reflects the `on` attribute.
   * @default undefined
   * @example
   * ```ts
   * element.on = '#card/clicked:setter/value' // ok
   * ```
   */
  on: KUBAFindOnAttribute | (string & {})

  /**
   * Value each record's `key` field is compared against. Synced from the `value`
   * attribute; writing it (directly, via attribute, or via an `Echo` arc) schedules
   * a search on the parent.
   * @default undefined
   */
  value: string
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-find': KUBAFindElement
  }
}
