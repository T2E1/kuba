declare global {
  /**
   * Framework-agnostic props every kuba custom element accepts in JSX
   * (React, Preact, Solid, or any other JSX runtime), beyond its own public
   * API — markup plumbing the JSX runtime itself attaches to elements.
   */
  interface KUBAJSXIntrinsicProps {
    children?: unknown
    key?: string | number
    ref?: unknown
    id?: string
    class?: string
    className?: string
    style?: string | Record<string, string | number>
  }

  /**
   * Derives the JSX `IntrinsicElements` props for a kuba custom element from
   * its own class: every public, non-method property becomes an optional JSX
   * attribute, combined with the props every kuba element accepts (see
   * {@link KUBAJSXIntrinsicProps}). Used by each element's `types.d.ts` to
   * keep its `JSX.IntrinsicElements` entry in sync with its public API,
   * instead of hand-listing props a second time.
   *
   * @example
   * ```ts
   * declare global {
   *   namespace JSX {
   *     interface IntrinsicElements {
   *       'kb-button': KUBAIntrinsicElementProps<KUBAButtonElement>
   *     }
   *   }
   * }
   * ```
   */
  type KUBAIntrinsicElementProps<E> = Partial<{
    [K in keyof E as E[K] extends (...args: never[]) => unknown
      ? never
      : K]: E[K]
  }> &
    KUBAJSXIntrinsicProps
}

/**
 * Aggregates the type declarations of every kuba package, so consumers get
 * full typings (custom elements, utility APIs) by importing this file once.
 * Each package documents its own contract in its local `types.d.ts`.
 */
import './packages/behavior/types'
import './packages/component/types'
import './packages/cookie/types'
import './packages/data/types'
import './packages/directive/types'
import './packages/dom/types'
import './packages/echo/types'
import './packages/event/types'
import './packages/form/types'
import './packages/http/types'
import './packages/layout/types'
import './packages/middleware/types'
import './packages/mixin/types'
import './packages/polyfill/types'
import './packages/renderer/types'
import './packages/result/types'
import './packages/router/types'
import './packages/spark/types'
import './packages/typography/types'
