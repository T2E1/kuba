---
name: jsdoc-standard
description: Writes and reviews JSDoc for classes, functions, variables, and type declaration (.d.ts) files in vanilla JavaScript codebases. Use when the user asks to "document", "add JSDoc", "document the types", "write doc comments" in JavaScript/TypeScript code, or when creating/editing classes, functions, getters/setters, constructors, static blocks, or types.d.ts files that don't have documentation yet.
---

# JSDoc Standard

Two audiences, two levels of detail. Before writing any comment, classify the file:

| File | Audience | Level of detail |
|---|---|---|
| Implementation code (`.js`, or `.ts` used only for decorator syntax — this codebase is vanilla JavaScript, not typed) | Another developer maintaining this codebase | Minimal — only what the code doesn't already say |
| `types.d.ts` / hand-written type declarations | An external developer consuming this code from a TypeScript project | Complete — full public contract, examples, defaults |

Load the matching guide before writing:

- **Internal code** (classes, constructors, getters/setters, private members, methods, static blocks, functions, `var`/`let`/`const`) → `references/internal-code.md`
- **Public types** (`types.d.ts`, exported interfaces, type aliases) → `references/public-types.md`
- **Tag cheatsheet** (`@param`, `@returns`, `@throws`, `@default`, `@example`, etc.) → `references/tags-cheatsheet.md`

All generated JSDoc content must be written in **English**, regardless of the language used elsewhere in the conversation.

## Why `.ts` files exist here without types

This codebase is written in plain JavaScript. Some source files use a `.ts` extension only because the toolchain needs it to parse decorator syntax — not because the code is typed. Never add type annotations to these files, and never treat them as if they were a typed TypeScript codebase. The actual public type contract for consumers lives in separate, hand-written `types.d.ts` files, because the authors don't type their own source — they type the surface others rely on.

## Golden rule (derives from `.claude/rules/026_qualidade-comentarios-porque.md`)

JSDoc is not exempt from "comment the why, not the what." The difference between the two levels isn't "more words," it's **who** needs the "why":

- In internal code, the "what" already lives in the name and the code itself. Document only a decision, an invariant, a side effect, or non-obvious decorator/mixin behavior that isn't visible by reading linearly.
- In public types, the consumer never sees the implementation — the "what" (what a property does, when to use it, what it returns) *is* the missing information. Document it as if it were the only source of truth, because for the person depending on the type declaration, it is.

**Never**: generate redundant JSDoc like `/** Gets the name */` above `get name()`. This violates `.claude/rules/026_qualidade-comentarios-porque.md` and `.claude/rules/062_proibicao-codigo-inteligente-clever-code.md` (noise/clever code) and will be flagged in review.

## Workflow

1. Identify the file type (table above) and open the matching guide.
2. For each construct (class, method, var, etc.), check the corresponding template in the guide.
3. Never document what a clear name already expresses (`.claude/rules/034_nomes-classes-metodos-consistentes.md`, `.claude/rules/035_proibicao-nomes-enganosos.md`) — if the name is already clear, a one-line `@remarks` is enough, or nothing at all.
4. Don't restate in prose what the code already makes visible (parameter names, obvious return values) — reserve JSDoc content for what isn't visible.
5. Self-review: if removing the comment loses no information a context-free reader would need, delete the comment.

## Quick example — the same class, two contexts

Implementation file — minimal, only the non-obvious:

```js
/**
 * The mixin order matters: the event-dispatching layer must wrap the
 * visibility layer so it captures the final `hidden` state at dispatch time.
 */
class Button extends WithEvents(WithVisibility(WithValue(HTMLElement))) {
  // ...
}
```

Public contract (`types.d.ts`) — complete:

```ts
export default class Button extends HTMLElement {
  /**
   * Semantic color of the button, reflected on the `color` attribute and
   * used by the active theme to resolve a palette.
   * @default 'primary'
   */
  color: string

  // ...
}
```

See both reference guides for every construct (class, constructor, getter/setter, private member, method, static block, function, arrow function, var/let/const, interface, type alias, enum).
