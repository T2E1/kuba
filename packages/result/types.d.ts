interface ResultMatcher<TValues extends unknown[]> {
  match<TReturn = unknown>(
    handlers: Record<string, (...values: TValues) => TReturn> & {
      _?: (...values: TValues) => TReturn
    },
  ): TReturn | undefined
}

type ResultVariant = <TValues extends unknown[]>(
  ...values: TValues
) => ResultMatcher<TValues>

declare const Result: Record<string, ResultVariant>

export default Result
