declare module '@t2e1/kuba/polyfill' {
  global {
    interface WindowEventMap {
      pushstate: CustomEvent<{
        state: unknown
        title: string
        url: string | URL | null
      }>
    }

    function setImmediate(
      fn: (...args: unknown[]) => void,
    ): ReturnType<typeof setTimeout>
  }
}
