declare module '@t2e1/kuba/router' {
  interface Router {
    (path: string, page: () => void): Router
    router: Router
    fallback(page: () => void): void
    handle(): void
  }

  const router: Router

  export default router

  export function args(): void
  export function params(path?: string): void
  export function urlFor(name: string, params?: Record<string, string>): string
}
