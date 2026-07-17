/**
 * `<k-filter>` custom element. Filters the `value` collection exposed by its parent
 * element (e.g. `<k-dataset>`) by comparing each record's `key` field against `value`,
 * then dispatches a `filter` event on the parent with the matching records.
 *
 * @example
 * ```html
 * <k-dataset upsert="id">
 *   <k-filter key="active" value="true"></k-filter>
 * </k-dataset>
 * <script>
 *   const dataset = document.querySelector('k-dataset')
 *   dataset.addEventListener('filter', (event) => console.log(event.detail))
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
    'k-filter': KUBAFilterElement
  }

  namespace JSX {
    interface IntrinsicElements {
      'k-filter': KUBAIntrinsicElementProps<KUBAFilterElement>
    }
  }
}
