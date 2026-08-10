# JSDoc for internal code (implementation)

Audience: another developer reading/maintaining this file. They already see the code and the names — don't repeat that. Document only what the code doesn't expose on its own: the reason behind a decision, an invariant that must hold, a side effect, or decorator/mixin behavior that only makes sense once you've read several layers.

Practical rule: if deleting the comment loses nothing for someone who already reads the code, delete the comment. This is `.claude/rules/026_qualidade-comentarios-porque.md` applied to JSDoc.

All comment text must be written in English.

---

## Class

Document the class **only** if it has a responsibility that isn't obvious from the name, or if it composes mixins/decorators whose order matters (`.claude/rules/011_principio-aberto-fechado.md`, `.claude/rules/068_proibicao-martelo-de-ouro.md`). Don't document what a clear noun name already solves (`.claude/rules/034_nomes-classes-metodos-consistentes.md`).

```js
/**
 * Mixin order matters here: the event-dispatching layer must wrap the
 * visibility layer so `dispatchEvent` captures the final `hidden` state.
 */
class Button extends WithEvents(WithVisibility(WithValue(HTMLElement))) {
```

If the class is trivial (a simple value object, for example), **don't document it** — the name and constructor already tell the story.

## Constructor

Document only preconditions, invariants established, or why something happens in a specific order (e.g. why one setup call must happen before another).

```js
constructor() {
  super()
  // attachInternals() requires the shadow root to already exist; don't reorder.
  this.attachShadow({ mode: 'open', delegatesFocus: true })
  this.#internals = this.attachInternals()
}
```

Don't write `/** Creates a Button instance */` — that's noise (`.claude/rules/062_proibicao-codigo-inteligente-clever-code.md`).

## Getter

"Pure" getters (return a private field with a fallback) **carry no JSDoc** — the name already says it all (`.claude/rules/008_proibicao-getters-setters.md` questions the existence of such getters at all, let alone commenting them).

```js
get width() {
  return (this.#width ??= 'auto')
}
```

Only document a getter when it derives something non-trivial from other state:

```js
/**
 * Derived from `#variant` and the element's current state set; there's no
 * dedicated field to avoid duplicating the source of truth.
 */
get activeState() {
  return [...this.#internals.states][0]
}
```

## Setter

Document the setter when it triggers a side effect that isn't obvious from the decorator chain, or when decorator order matters.

```js
/**
 * The value is already normalized (aliases resolved) by an upstream
 * decorator before it reaches here — don't re-validate.
 */
@attributeChanged('variant')
@before(normalizeVariant)
set variant(value) {
  this.#variant = value
}
```

If the setter just assigns the field, with no decorator carrying non-obvious effects, don't document it.

## Private members (`#field`)

Document a `#field` only when its purpose isn't evident from the name, or when there's an implicit relationship with another field/decorator (e.g. a buffer another method drains).

```js
class C {
  /** Layout cache; invalidated by the resize decorator. */
  #cachedRect
}
```

Fields like `#color`, `#type`, `#variant` that only back a same-named getter/setter don't need a comment — the getter/setter pair already documents the concept, if needed at all.

## Method

Apply `.claude/rules/055_limite-maximo-linhas-metodo.md` (short methods) before documenting — a well-sliced method rarely needs JSDoc beyond cases with:
- non-obvious asynchronous behavior,
- side effects on external objects (`.claude/rules/036_restricao-funcoes-efeitos-colaterais.md`),
- domain exceptions thrown (`.claude/rules/027_qualidade-tratamento-erros-dominio.md`) that the caller must handle.

```js
/**
 * @throws {InvalidStateError} when called before the element is
 *   form-associated (see the static `formAssociated` flag).
 */
click() {
  switch (this.type) {
    case 'submit':
      this.#internals.form?.requestSubmit()
      break
    case 'reset':
      this.#internals.form?.reset()
      break
  }
  return this.value
}
```

Don't narrate the `switch` line by line — the code is already the "what"; the comment is only for what the caller can't see (the throw).

## Static block / static property

```js
/**
 * Required so the browser treats this custom element as form-associated
 * and exposes internals via attachInternals().
 */
static get formAssociated() {
  return true
}
```

Static initialization blocks (`static { ... }`) only need a comment if they initialize state shared across instances — in that case, confirm the sharing is intentional (`.claude/rules/070_proibicao-estado-mutavel-compartilhado.md`) before documenting it as if it were normal.

## Function (not a class member)

Utility functions exported from an internal module follow the same rule: document a precondition, an error contract, or non-obvious behavior — not parameters that are already self-explanatory.

```js
/**
 * Assumes `node` is already connected to the DOM; calling this before that
 * silently returns `null` instead of throwing.
 */
function closestShadowRoot(node) {
  // ...
}
```

## Arrow function / inline callback

Rarely deserves its own JSDoc — if it needs documentation, that's a sign it should be extracted into a named function instead (`.claude/rules/063_proibicao-inferno-callbacks.md`, `.claude/rules/034_nomes-classes-metodos-consistentes.md`). Document the extracted named function, not the inline callback.

## `const` / `let` / `var`

- A module-level `const` with a self-explanatory value (`const MAX_RETRIES = 3`): **no JSDoc**, but follow `.claude/rules/024_proibicao-constantes-magicas.md` — the name should already replace the "magic number"; if the *why* behind the value isn't obvious, a one-line comment (not JSDoc) is enough:
  ```js
  // 3 attempts: matches the browser's default fetch retry timeout.
  const MAX_RETRIES = 3
  ```
- An exported `const`/`let` representing shared module configuration or state (a candidate for `.claude/rules/070_proibicao-estado-mutavel-compartilhado.md`) deserves JSDoc justifying why it's safe to share:
  ```js
  /** Frozen — never mutate; see `.claude/rules/029_imutabilidade-objetos-freeze.md`. */
  export const defaultTheme = Object.freeze({ color: 'primary' })
  ```
- Local `let`/`var` inside a function: never carry JSDoc — if they need explaining, extract into a named function.

## Custom decorators

When decorators are used heavily in a codebase, document the decorator's **definition** (where it's declared) with its full contract — that's public knowledge for the whole team:

```js
/**
 * Re-runs the render step whenever the decorated setter is called with a
 * value different from the current one. Does not re-run on an equal value
 * (`===` comparison).
 */
export function retouch(target, context) { /* ... */ }
```

At the decorator's **usage site** (`@retouch` on top of a specific setter), don't redocument the contract — that's duplication (`.claude/rules/021_proibicao-duplicacao-logica.md`).
