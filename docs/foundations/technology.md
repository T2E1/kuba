# Technology

kuba is written in plain JavaScript with **zero runtime dependencies**. Check
`package.json`: the `dependencies` section is empty.

That wasn't for lack of options. It follows from the
[principles](/foundations/principles):

1. **Web Components are native.** They need no framework to exist or to register
   themselves.
2. **One fewer dependency is one fewer supply chain** to audit, update, and have
   break in production.
3. **A gentler learning curve.** Anyone who knows the DOM and `CustomEvent` can
   already read kuba's source.
4. **Every front-end developer knows JavaScript**, whichever framework they
   reach for day to day.

## The native APIs it stands on

None of these is an installable dependency. They're capabilities the browser
already ships, which kuba exposes through a declarative API instead of hiding
behind an abstraction of its own.

| API | Used for |
|---|---|
| **Custom Elements** | Every `<kb-*>` tag, registered through the `define` decorator. |
| **Shadow DOM** | Each element's markup and styles, isolated from the page. |
| **Constraint Validation API** | Native form validation in `<kb-input>`, `<kb-textarea>`, `<kb-fileupload>`. |
| **`ElementInternals`** | Form association and custom states (`:state(invalid)`, `:state(hidden)`) without reimplementing `<form>` semantics. |
| **`CustomEvent`** | The whole Echo bus. Elements communicate the way the DOM already does. |
| **Constructable stylesheets** | `adoptedStyleSheets`, so a stylesheet is parsed once and shared across instances. |
| **History API** | Client-side navigation in `router` and `<kb-redirect>`. |
| **CSS `light-dark()`** | Light and dark values in a single color token, resolved by the page's `color-scheme`. |
| **CSS custom properties** | The whole theming surface, inheriting through the shadow boundary. |

The one shim in the codebase is `setImmediate`, used to batch repaints — a few
lines, not a library.

## Styling

Styles are written per element in a `style.js` and returned as a
`CSSStyleSheet` through the `css` helper, not as a global stylesheet. Each
element adopts its own, isolated by the shadow DOM.

The single global file is `dist/kuba.css`, which carries the design tokens —
the values every element's defaults resolve against.

## Tooling

What lives in `devDependencies` isn't for consuming kuba; it's for building it.

| Tool | Role |
|---|---|
| `vite` | Bundles `dist/` on `bun run release`. |
| `typescript` | Compiles nothing — type-checks against the hand-written `types.d.ts` files that document each element's public surface. |
| `@biomejs/biome` | Lint and formatting (`bun run check`). |
| `husky` + `lint-staged` | Run Biome on staged files before a commit lands. |
| `commitlint` | Enforces Conventional Commits. |
| `docsify` | Renders this documentation. Loaded from a CDN at runtime — there is no docs build step. |

## Types without a build step

kuba ships types, but nothing is written in TypeScript. Each element's public
contract lives in a hand-written `types.d.ts` beside its implementation, and
registers the tag in `HTMLElementTagNameMap`:

```ts
const input = document.querySelector('kb-input') // KUBAInputElement
```

The trade is deliberate. The implementation stays plain JavaScript that runs in
a browser with no compilation, and the type surface stays small enough to be
written by hand — which also means it describes what's *public*, rather than
whatever the implementation happens to expose.

## How this documentation is built

This site is markdown rendered by docsify in the browser, and it loads kuba
**from the CDN at a pinned version** — the same two tags any consumer would
write.

That's not a detail: every live example on this site runs against the published
package. If a release breaks, the documentation breaks visibly, instead of
passing green against source code that only exists on a developer's machine.
