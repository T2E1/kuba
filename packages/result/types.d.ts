declare module '@t2e1/kuba/result' {
  /**
   * A tagged result produced by calling a variant on {@link Result} (e.g. `Result.Ok(1)`).
   * Exposes a single `match` method used to branch on the tag it was created with.
   *
   * @template TValues - Tuple type of the values passed when the variant was invoked.
   */
  interface ResultMatcher<TValues extends unknown[]> {
    /**
     * Dispatches to the handler whose key matches the variant tag this result was created
     * with, falling back to the `_` handler when no exact match exists.
     *
     * @param handlers - A map of variant tag to handler function, plus an optional `_`
     *   catch-all handler invoked when no tag-specific handler is provided.
     * @returns The return value of the matched handler, or `undefined` if neither a
     *   tag-specific handler nor `_` is present.
     * @example
     * ```ts
     * const success = Result.Ok(42)
     * success.match({
     *   Ok: (value) => `got ${value}`,
     *   Err: (error) => `failed: ${error}`,
     * }) // => "got 42"
     *
     * const failure = Result.Err('not found')
     * failure.match({
     *   Ok: (value) => `got ${value}`,
     *   _: () => 'something else happened',
     * }) // => "something else happened"
     * ```
     */
    match<TReturn = unknown>(
      handlers: Record<string, (...values: TValues) => TReturn> & {
        _?: (...values: TValues) => TReturn
      },
    ): TReturn | undefined
  }

  /**
   * A callable variant constructor. Any property accessed on {@link Result} (e.g. `Ok`,
   * `Err`, or any custom tag name) resolves to a function of this shape, which captures its
   * arguments and returns a {@link ResultMatcher} tagged with that property name.
   *
   * @template TValues - Tuple type of the values captured when invoked.
   */
  type ResultVariant = <TValues extends unknown[]>(
    ...values: TValues
  ) => ResultMatcher<TValues>

  /**
   * Tagged-union helper for representing success/failure (or any other set of variants)
   * without a fixed enum of tags. There are no predefined variants: `Result.Ok(...)`,
   * `Result.Err(...)`, or any other property name all work identically, each producing a
   * {@link ResultMatcher} tagged with the accessed property name.
   *
   * @example
   * ```ts
   * import Result from '@t2e1/kuba/result'
   *
   * function parseNumber(input: string) {
   *   const value = Number(input)
   *   return Number.isNaN(value) ? Result.Err('invalid number') : Result.Ok(value)
   * }
   *
   * const message = parseNumber('42').match({
   *   Ok: (value) => `parsed: ${value}`,
   *   Err: (reason) => `error: ${reason}`,
   * })
   * ```
   */
  const Result: Record<string, ResultVariant>

  export default Result
}
