# JSDoc for public types (`types.d.ts` and exported API)

Audience: an external developer consuming this code — typically from a TypeScript project, since the source itself is plain JavaScript and untyped. They **don't** read the implementation — the `types.d.ts` file (plus its JSDoc) is the only contract that exists. Here the standard flips relative to `references/internal-code.md`: document everything a consumer would need to know without opening the source.

All comment text must be written in English.

Checklist per exported public member:
- What it is / what it does (one sentence).
- `@default` if there's an implicit value.
- `@example` when usage isn't obvious from the signature (mandatory for methods with more than one reasonable way to call them).
- `@throws` for every error condition the consumer might encounter (`.claude/rules/027_qualidade-tratamento-erros-dominio.md`).
- `@see` for related members.
- `@deprecated` with a migration path, never just "don't use this anymore."

## Public class

```ts
/**
 * A native form-participating button (submit/reset within an
 * `HTMLFormElement`) with a theme-driven color palette.
 *
 * @example
 * ```html
 * <my-button color="danger" variant="outline" type="submit">Delete</my-button>
 * ```
 */
export default class Button extends HTMLElement {
  // members documented individually below
}
```

## Property (reflecting an HTML attribute)

```ts
export default class Button extends HTMLElement {
  /**
   * Semantic color of the button, reflected on the `color` attribute and
   * resolved by the currently active theme.
   * @default 'primary'
   */
  color: string

  /**
   * Behavior of the button inside a `<form>`.
   * - `'submit'`: triggers `requestSubmit()` on the associated form.
   * - `'reset'`: triggers `reset()` on the associated form.
   * @default 'submit'
   */
  type: 'submit' | 'reset'
}
```

Don't document `variant: string` as "the button variant" without saying which values are accepted and what effect they have — that's an empty description. Public documentation this shallow is just as harmful as redundant documentation, because it fails to deliver the "what" the consumer actually needs.

```ts
/**
 * Visual style of the button.
 * - `'solid'`: background filled with the selected color.
 * - `'outline'`: border only, transparent background.
 * @default 'solid'
 */
variant: string
```

## Public method

```ts
export default class Button extends HTMLElement {
  /**
   * Simulates a click on the button, running the same `type`-driven logic
   * (`requestSubmit`/`reset` on the associated form) and firing the
   * `clicked` event.
   *
   * @returns The button's current value at the moment of the click.
   * @example
   * ```ts
   * const value = document.querySelector('my-button').click()
   * ```
   */
  click(): string
}
```

## Exported custom event

```ts
/**
 * Fired after `click()` runs the `type`-driven action (submit/reset).
 * @remarks Bubbles (`bubbles: true`) and is composed — crosses shadow DOM boundaries.
 */
export interface ClickedEvent extends CustomEvent<void> {}

declare global {
  interface HTMLElementEventMap {
    clicked: ClickedEvent
  }
}
```

## Public interface / type alias

```ts
/**
 * Configuration options for the width-tracking behavior.
 * @see {@link Width}
 */
export interface WidthOptions {
  /**
   * Initial width before the first attribute-change callback runs.
   * @default 'auto'
   */
  initial?: string
}
```

For exported union types, document each relevant member when the name isn't self-explanatory:

```ts
/**
 * Loading state of an async component.
 * - `'idle'`: hasn't started yet.
 * - `'pending'`: a request is in flight.
 * - `'settled'`: completed successfully.
 * - `'error'`: failed; see the `error` event for details.
 */
export type LoadState = 'idle' | 'pending' | 'settled' | 'error'
```

## Public utility function

```ts
/**
 * Creates a debounced resize observer for use in attribute-change handlers.
 *
 * @param callback Called at most once per frame after resizing settles.
 * @returns A disconnect function — call it when the observed element is removed.
 * @throws {TypeError} if `callback` is not a function.
 * @example
 * ```ts
 * const disconnect = onResize((entry) => console.log(entry.contentRect))
 * ```
 */
export function onResize(callback: (entry: ResizeObserverEntry) => void): () => void
```

## `declare global` / tag name maps

This doesn't need its own JSDoc — it's structural TypeScript boilerplate, and commenting each entry would be repetitive noise (`.claude/rules/062_proibicao-codigo-inteligente-clever-code.md`). The JSDoc was already written on the referenced class (`Button`).

```ts
declare global {
  interface HTMLElementTagNameMap {
    'my-button': Button
  }
}
```

## `@deprecated`

Always with a migration path — never leave the consumer without a way forward:

```ts
/**
 * @deprecated Use `variant` instead of `kind`. Will be removed in the next
 * major version. Migration: `kind="primary"` → `variant="solid" color="primary"`.
 */
kind?: string
```

## Module-level header

If a `types.d.ts` file aggregates declarations from several sub-modules, a short header comment orients the consumer — not mandatory, but helpful when the module exports many independent members:

```ts
/**
 * Type declarations for all exported components in this module.
 * Each component documents its own contract in its local types file.
 */
import './button/types'
import './card/types'
```
