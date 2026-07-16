interface Router {
  (path: string, page: () => void): Router
  router: Router
  fallback(page: () => void): void
  handle(): void
}

declare const router: Router

export default router

export declare function args(): void
export declare function params(path?: string): void
export declare function urlFor(
  name: string,
  params?: Record<string, string>,
): string
