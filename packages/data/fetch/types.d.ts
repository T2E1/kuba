interface FetchResult<T = unknown> {
  data: T | null
  error: unknown
}

export default class Fetch extends HTMLElement {
  readonly controller: AbortController
  url: string
  delete<T = unknown>(payload?: unknown): Promise<FetchResult<T>>
  get<T = unknown>(payload?: unknown): Promise<FetchResult<T>>
  post<T = unknown>(payload?: unknown): Promise<FetchResult<T>>
  put<T = unknown>(payload?: unknown): Promise<FetchResult<T>>
}

declare global {
  interface HTMLElementTagNameMap {
    'k-fetch': Fetch
  }
}
