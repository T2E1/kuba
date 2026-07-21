declare module '@t2e1/kuba/interpolate' {
  /**
   * Replaces `{path.to.value}` placeholders in `text` with values read from
   * `data` via a dot-path lookup. An empty placeholder (`{}`) is replaced
   * with `data` itself, stringified. A path that resolves to `null` or
   * `undefined` (including a missing intermediate segment) is replaced with
   * an empty string rather than the literal `"undefined"`.
   *
   * @param text - Template string containing zero or more `{...}` placeholders.
   * @param data - Value(s) whose properties fill the placeholders.
   * @returns `text` with every placeholder replaced.
   * @example
   * ```ts
   * interpolate('/user/{id}', { id: 42 }) // '/user/42'
   * interpolate('Hello, {}!', 'Ada')      // 'Hello, Ada!'
   * interpolate('{missing.path}', {})     // ''
   * ```
   */
  function interpolate(text: string, data: unknown): string

  export default interpolate
}
