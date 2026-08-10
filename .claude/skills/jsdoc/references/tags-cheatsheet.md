# JSDoc tag cheatsheet

Quick reference. Use alongside `references/internal-code.md` (minimal) or `references/public-types.md` (complete) to know *when* to apply each tag. All written comment content must be in English.

| Tag | Purpose | Internal code | Public types |
|---|---|---|---|
| `@param` | Describes a parameter | Only if the name/type don't convey intent | Yes, whenever the parameter isn't self-evident |
| `@returns` | Describes the return value | Only if not obvious from the method name | Yes, always |
| `@throws {Type}` | Error condition thrown | Yes, if the caller must handle it | Yes, always — it's part of the public contract |
| `@default` | Implicit default value (getters with `??=`, optional params) | Rarely (already visible in the code) | Yes, whenever a default exists |
| `@example` | Code block showing usage | Rare — only for non-obvious utilities | Yes, for any method/function with more than one reasonable way to call it |
| `@remarks` | Additional note, edge case, context | Occasional, for invariants | Occasional, for behavior not covered by `@param`/`@returns` |
| `@see {@link X}` | Cross-reference | Occasional | Recommended for related members |
| `@deprecated` | Marks obsolete API | Yes, if applicable | Yes, always with a migration path |
| `@template` | Documents a generic type parameter | If the generic isn't obvious | Yes, whenever the class/function is generic |
| `@internal` | Marks a technical export that isn't public API but must be exported (e.g. for tests) | — | Use in `.d.ts` to exclude from generated docs |
| `@override` | Marks an explicit override of an inherited method | Yes, reinforces `.claude/rules/012_principio-substituicao-liskov.md` | Yes |
| `@readonly` | Read-only property not expressed via `readonly` in the type | Rare | Use when the type doesn't already express it via `readonly` |

## Formatting rules

- Always use `/** ... */` blocks, never `//` for JSDoc — the type parser and editor tooling depend on the `/**` format.
- First line: a single sentence, no redundant trailing period before the tag block.
- One blank line between the description and the tag block (`@param`, `@returns`, etc.) when there are more than two tags.
- `@example` always uses a fenced code block (```` ```js ```` or ```` ```html ````, matching how the documented thing is actually used).
- Don't mix `@param {Type}` (plain-JSDoc style, for `.js` files with no type inference) with a TypeScript annotation already present in the signature — pick one. In `.ts` files, never use `{Type}` in curly braces; the type already comes from the signature. In plain `.js` files without a matching `.d.ts`, `@param {Type}` is the only source of type information and should be used.

## Common mistake to avoid

```js
// ❌ Redundant — the name already says the rest, and this file has no separate type declaration to justify repeating it.
/**
 * @returns {string} The color.
 */
get color() { return this.#color }

// ✅ Nothing to add — no JSDoc.
get color() { return this.#color }
```

```ts
// ❌ Too vague for a public type — doesn't help the consumer decide the value.
/** The button's color. */
color: string

// ✅ States the possible values and the effect.
/**
 * Semantic color of the button, resolved by the active theme.
 * @default 'primary'
 */
color: string
```
