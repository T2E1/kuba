declare module '@t2e1/kuba/http' {
  interface HttpResult<T = unknown> {
    data: T | null
    error: unknown
  }

  interface HttpRequest {
    body(target: unknown): this
    headers(target: HeadersInit): this
    signal(target: AbortSignal): this
    json<T = unknown>(): Promise<HttpResult<T>>
  }

  type HttpMethod = (url: string) => HttpRequest

  const http: Record<string, HttpMethod>

  export default http
}
