# Tools and workflows

How a kuba element declares its styles, what the repository tooling
does, and how types ship without a build step.

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
| `vitest` + `playwright` | Run the test suite in a real Chromium (`bun run test`). |
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
