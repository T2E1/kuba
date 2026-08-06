/**
 * `<kb-filter>` custom element. Filters the `value` collection exposed by its parent
 * element (e.g. `<kb-dataset>`) by comparing each record's `key` field against `value`,
 * then dispatches a `filtered` event on the parent with the matching records.
 *
 * @example
 * ```html
 * <kb-dataset upsert="id">
 *   <kb-filter key="active" value="true"></kb-filter>
 * </kb-dataset>
 * <script>
 *   const dataset = document.querySelector('kb-dataset')
 *   dataset.addEventListener('filtered', (event) => console.log(event.detail))
 * </script>
 * ```
 */
export default class KUBAFilterElement extends HTMLElement {
  /** Name of the record field to compare against `value`. Reflects the `key` attribute. */
  key: string

  /**
   * Value each record's `key` field is compared against (triggers filtering on set).
   * Reflects the `value` attribute.
   */
  value: string
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-filter': KUBAFilterElement
  }
}
