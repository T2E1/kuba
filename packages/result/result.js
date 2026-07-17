// Any property access (e.g. `Result.Ok`, `Result.Err`, `Result.Anything`) is accepted as a
// variant tag; there is no fixed set of variants. `match` looks up the handler keyed by the
// tag used to build the result, falling back to `_` when absent, and returns `undefined` if
// neither exists.
const Result = new Proxy(
  {},
  {
    get:
      (_, variant) =>
      (...values) => ({
        match: (handlers = {}) => {
          const target = Object.hasOwn(handlers, variant)
            ? handlers[variant]
            : handlers._
          return target?.(...values)
        },
      }),
  },
)

export default Result
