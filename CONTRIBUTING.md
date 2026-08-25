# Contributing to kuba

Thank you for your interest in contributing. kuba is a small, opinionated project — contributions that align with its design principles are welcome; contributions that add complexity without clear benefit are not.

Read the [documentation](https://t2e1.github.io/kuba/) first — especially [Principles](https://t2e1.github.io/kuba/foundations/principles) and [Naming](https://t2e1.github.io/kuba/foundations/naming). Understand the model and why it matters before proposing changes.

---

## Development setup

**Requirements:** [Bun](https://bun.sh) and Node.js >= 20.

```sh
git clone https://github.com/T2E1/kuba.git
cd kuba
bun install
```

| Command | Does |
|---|---|
| `bun run dev` | Serves the documentation site at `localhost:3000`. |
| `bun run test` | Runs the test suite in a real Chromium, via Vitest. |
| `bun run test:watch` | The same, in watch mode. |
| `bun run check` | Biome lint + format (also runs on pre-commit). |
| `bun run release` | Builds `dist/`, the actual published package. |

The repository has no runtime dependencies, so `bun install` only fetches the tooling.

---

## Project structure

```
packages/
├── behavior/    custom elements — behavioral (on, redirect, render)
├── component/   custom elements — visual components
├── typography/  custom elements — text (text, label, helper)
├── form/        custom elements — form controls
├── layout/      custom elements — layout primitives
├── data/        custom elements — headless data (k-* prefix)
│
├── dom/         utility — template helpers
├── echo/        utility — the dataflow bus (event primitives)
├── router/      utility — client-side routing
├── spark/       utility — pure functions (usable as `on` filters)
└── ...
```

Each package is self-contained. Changes to one package should not require changes to another.

---

## What a change to an element ships with

A visual custom element lives in one `packages/<group>/<name>/` folder and is only complete with all four:

1. **The implementation** — `<name>.ts`, plus its `component.js` and `style.js`.
2. **A hand-written `types.d.ts` beside it**, describing only the public surface and registering the tag in `HTMLElementTagNameMap`. An implementation with no `types.d.ts` isn't a public element.
3. **A `<name>.test.js` beside it**, running against the real browser API the element depends on.
4. **A page under `website/docs/components/`**, following the shape of the existing ones: live example, when to use and when not to, composition, attributes, events, styling, accessibility, do's and don'ts.

Every visual decision is a `--<name>-*` custom property defaulting to a design token — no literals in `style.js`.

Before writing any of it, check [Naming](https://t2e1.github.io/kuba/foundations/naming): the change may be a Block (a composition of existing Elements) rather than a new Element, in which case it needs markup, not a package.

---

## Commits

This project follows [Conventional Commits](https://www.conventionalcommits.org/), linted by `commitlint` on every `git commit`.

```
feat(dom): add css tagged template helper
fix(router): handle trailing slash in params
docs(card): document the outlined variant
```

The prefix isn't decoration — it drives the version bump. `feat` and `fix` bump the prerelease; `feat!` (or a `BREAKING CHANGE:` footer) marks a breaking change, which during alpha still bumps the prerelease but must be listed in the changelog with a migration note.

---

## Pull requests

- One concern per PR
- Include a clear description of *why*, not just *what*
- Do not add runtime dependencies — kuba ships with zero, by design
- Do not break subpath exports or change the public API without discussion
- A new or changed element ships with its `types.d.ts`, its test and its docs page in the same PR

Open an issue first for anything beyond a small bug fix or typo.

---

## Code style

Formatting and linting are handled by [Biome](https://biomejs.dev). Running `bun run check` before committing is enough — the pre-commit hook does it automatically. No manual style decisions are needed.

---

## Questions

Open an [issue](https://github.com/T2E1/kuba/issues) — questions and ideas are welcome there, alongside confirmed bugs and feature requests. For a bug, the useful shape is: the markup, what you expected, what happened, and which version.

For security issues, see [SECURITY.md](./SECURITY.md) — do not open a public issue.
