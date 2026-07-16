declare global {
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

export type PolyfillGlobals = true
