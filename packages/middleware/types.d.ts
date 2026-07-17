declare module '@t2e1/kuba/middleware' {
  /**
   * Method decorator that pipes the decorated method's return value
   * through `context[method]` after the original call completes, and
   * returns that transformed value to the caller instead of the
   * original result.
   *
   * @param method - Name of the instance method to invoke with the
   *   original method's return value.
   * @returns A method decorator to apply to the target method.
   * @example
   * ```ts
   * class Greeter {
   *   @after('shout')
   *   greet(name: string) {
   *     return `hello, ${name}`
   *   }
   *
   *   shout(message: string) {
   *     return message.toUpperCase()
   *   }
   * }
   *
   * new Greeter().greet('ana') // => 'HELLO, ANA'
   * ```
   */
  export function after(method: string): MethodDecorator

  /**
   * Method decorator that schedules `context[method]` to run on a later
   * tick (via `setImmediate`) with the same arguments as the decorated
   * method, without waiting for it or using its result. The original
   * method still runs synchronously and its return value is what the
   * caller receives, unaffected by `method`.
   *
   * Use this for fire-and-forget side effects (e.g. logging, metrics)
   * that must not delay or alter the decorated method's outcome.
   *
   * @param method - Name of the instance method to invoke asynchronously
   *   with the original call's arguments.
   * @returns A method decorator to apply to the target method.
   * @example
   * ```ts
   * class OrderService {
   *   @around('logOrder')
   *   placeOrder(id: string) {
   *     return { id, status: 'placed' }
   *   }
   *
   *   logOrder(id: string) {
   *     console.log(`order placed: ${id}`)
   *   }
   * }
   *
   * new OrderService().placeOrder('123') // returns immediately;
   * // logOrder('123') runs asynchronously afterwards
   * ```
   */
  export function around(method: string): MethodDecorator

  /**
   * Method decorator that runs `context[method]` with the original
   * arguments before the decorated method, and passes its return value
   * as the sole argument to the original method.
   *
   * @param method - Name of the instance method to invoke first, whose
   *   return value becomes the original method's argument.
   * @returns A method decorator to apply to the target method.
   * @example
   * ```ts
   * class Parser {
   *   @before('normalize')
   *   parse(value: string) {
   *     return value.split(',')
   *   }
   *
   *   normalize(raw: string) {
   *     return raw.trim().toLowerCase()
   *   }
   * }
   *
   * new Parser().parse('  A,B,C  ') // normalize runs first, then parse
   * ```
   */
  export function before(method: string): MethodDecorator
}
