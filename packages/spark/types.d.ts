declare module '@t2e1/kuba/spark' {
  /**
   * An operator function used by the spark registry. Receives a value (and an
   * optional second argument, e.g. the comparison operand) and returns a result —
   * a boolean for predicates, a transformed value for transforms.
   */
  export type SparkFilter = (value: unknown, argument?: unknown) => unknown

  /**
   * Runtime lookup table for named operators. Backs declarative expressions
   * (e.g. condition/filter definitions elsewhere in the codebase) that reference
   * operators by string name instead of importing them directly.
   */
  interface Spark {
    /**
     * Looks up an operator by name.
     * @param name - Registered operator name (e.g. `"gt"`, `"equals"`, `"prop"`).
     * @returns The matching operator function, or the identity function `(x) => x`
     * if no operator is registered under `name`.
     */
    get(name: string): SparkFilter

    /**
     * Registers or overrides an operator under the given name.
     * @param name - Operator name to register.
     * @param fn - Operator implementation to associate with `name`.
     * @returns The same `Spark` instance, for chaining further `set` calls.
     */
    set(name: string, fn: SparkFilter): Spark
  }

  /**
   * Default export: the shared operator registry accessor.
   * @example
   * ```ts
   * import spark from '@t2e1/kuba/spark'
   *
   * const isAdult = spark.get('gte')
   * isAdult(21, 18) // true
   *
   * spark.set('isEven', (x) => Number(x) % 2 === 0)
   * spark.get('isEven')(4) // true
   * ```
   */
  const spark: Spark

  export default spark

  /**
   * Adds two values, coercing both to `Number`.
   * @param x - First operand.
   * @param y - Second operand.
   * @returns The sum of `x` and `y`.
   */
  export function add(x: unknown, y: unknown): number

  /**
   * Ignores its first argument and returns the second unchanged. Useful as a
   * constant/passthrough operator in declarative expressions.
   * @param _token - Unused operator token.
   * @param value - Value to return as-is.
   * @returns `value`, unchanged.
   */
  export function always(_token: unknown, value: unknown): unknown

  /**
   * Decrements a value by one, coercing it to `Number`.
   * @param x - Value to decrement.
   * @returns `x` minus one.
   */
  export function dec(x: unknown): number

  /**
   * Compares two values for strict inequality (`!==`); no type coercion is applied.
   * @param x - First operand.
   * @param y - Second operand.
   * @returns `true` if `x` and `y` are not strictly equal.
   */
  export function different(x: unknown, y: unknown): boolean

  /**
   * Compares two values for strict equality (`===`); no type coercion is applied.
   * @param x - First operand.
   * @param y - Second operand.
   * @returns `true` if `x` and `y` are strictly equal.
   */
  export function equals(x: unknown, y: unknown): boolean

  /**
   * Checks whether `x` is greater than `y`, coercing both to `Number`.
   * @param x - Left-hand operand.
   * @param y - Right-hand operand.
   * @returns `true` if `x > y`.
   */
  export function gt(x: unknown, y: unknown): boolean

  /**
   * Checks whether `x` is greater than or equal to `y`, coercing both to `Number`.
   * @param x - Left-hand operand.
   * @param y - Right-hand operand.
   * @returns `true` if `x >= y`.
   */
  export function gte(x: unknown, y: unknown): boolean

  /**
   * Increments a value by one, coercing it to `Number`.
   * @param x - Value to increment.
   * @returns `x` plus one.
   */
  export function inc(x: unknown): number

  /**
   * Counts the own enumerable keys of an object.
   * @param x - Object to measure; `null`/`undefined` is treated as empty.
   * @returns The number of own enumerable keys, or `0` for `null`/`undefined`.
   */
  export function len(x: object | null | undefined): number

  /**
   * Checks whether `x` is less than `y`, coercing both to `Number`.
   * @param x - Left-hand operand.
   * @param y - Right-hand operand.
   * @returns `true` if `x < y`.
   */
  export function lt(x: unknown, y: unknown): boolean

  /**
   * Checks whether `x` is less than or equal to `y`, coercing both to `Number`.
   * @param x - Left-hand operand.
   * @param y - Right-hand operand.
   * @returns `true` if `x <= y`.
   */
  export function lte(x: unknown, y: unknown): boolean

  /**
   * Logical negation of a value's truthiness.
   * @param x - Value to negate.
   * @returns `true` if `x` is falsy, `false` otherwise.
   */
  export function not(x: unknown): boolean

  /**
   * Resolves a (possibly nested) property path against a target object. Supports
   * dot paths (`"a.b.c"`) and paths starting with bracket notation (`"[0].name"`).
   * @param target - Object to read the property from.
   * @param path - Dot and/or bracket-notation path to resolve.
   * @returns The resolved value, or `undefined` if the path cannot be resolved.
   * @example
   * ```ts
   * prop({ a: { b: 1 } }, 'a.b') // 1
   * prop([{ name: 'x' }], '[0].name') // 'x'
   * ```
   */
  export function prop(target: unknown, path: string): unknown

  /**
   * Subtracts `y` from `x`, coercing both to `Number`.
   * @param x - Minuend.
   * @param y - Subtrahend.
   * @returns `x` minus `y`.
   */
  export function subtract(x: unknown, y: unknown): number

  /**
   * Evaluates a loosely-typed value as a boolean flag. The strings `"no"`,
   * `"false"`, `"0"`, and `null` are treated as falsy; every other value
   * (including `0`, empty string, and `undefined`) is treated as truthy.
   * @param value - Value to evaluate.
   * @returns `true` unless `value` is one of the recognized falsy tokens.
   */
  export function truthy(value: unknown): boolean
}
