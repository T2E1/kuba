declare module '@t2e1/kuba/renderer' {
  /**
   * Renders HTML markup into the page's root `<app>` element.
   *
   * The DOM update is performed inside a View Transition (when supported by
   * the browser), so the outgoing and incoming content animate smoothly
   * instead of being swapped abruptly.
   *
   * @param content - HTML markup string to render as the app's content.
   * @returns Nothing; the DOM is updated as a side effect.
   * @example
   * ```ts
   * import renderer from '@t2e1/kuba/renderer'
   *
   * renderer('<h1>Hello, world!</h1>')
   * ```
   */
  function renderer(content: string): void

  export default renderer
}
