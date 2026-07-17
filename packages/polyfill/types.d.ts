/**
 * Type declarations for the polyfills installed as side effects by
 * `@t2e1/kuba/polyfill`. Importing that module augments the global
 * environment with a synthetic `pushstate` window event and a
 * `setImmediate` global function.
 */
declare module '@t2e1/kuba/polyfill' {
  global {
    interface WindowEventMap {
      /**
       * Fired on `window` whenever `history.pushState()` is called.
       *
       * Browsers dispatch `popstate` for back/forward navigation but never
       * fire anything for programmatic navigation via `pushState()`. This
       * event fills that gap, carrying the same arguments passed to
       * `pushState()`.
       *
       * @example
       * ```ts
       * window.addEventListener('pushstate', (event) => {
       *   console.log(event.detail.url)
       * })
       * history.pushState({}, '', '/next-page')
       * ```
       */
      pushstate: CustomEvent<{
        state: unknown
        title: string
        url: string | URL | null
      }>
    }

    /**
     * Schedules a callback to run after the current event loop phase,
     * before timers and I/O events. Native in Node.js but not part of any
     * web/browser standard; this polyfill falls back to `setTimeout(fn, 0)`
     * when running in a browser.
     *
     * @param fn - The callback to invoke on the next tick.
     * @returns A handle compatible with `clearTimeout`, as returned by the
     * underlying `setTimeout` fallback.
     *
     * @example
     * ```ts
     * setImmediate(() => console.log('runs on next tick'))
     * ```
     */
    function setImmediate(
      fn: (...args: unknown[]) => void,
    ): ReturnType<typeof setTimeout>
  }
}
