# Contributing to kuba

Thank you for your interest in contributing. kuba is a small, opinionated project — contributions that align with its design principles are welcome; contributions that add complexity without clear benefit are not.

Read the [README](./README.md) and the [documentation](https://t2e1.github.io/kuba/) first — especially the **Guidelines** section (design principles, naming, design tokens). Understand the HDA model and why it matters before proposing changes.

---

## Development setup

**Requirements:** [Bun](https://bun.sh) and Node.js >= 20.

```sh
git clone https://github.com/T2E1/kuba.git
cd kuba
bun install
bun run dev        # Storybook — the docs site, on http://localhost:6006
bun run check      # Biome lint + format (also runs on pre-commit)
bun run release    # builds dist/, the actual published package
```

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

A visual custom element lives in one `packages/<group>/<name>/` folder with, at minimum, an implementation, a hand-authored `types.d.ts` (its public contract), a `style.js`, and a `<name>.stories.js`. See the **Guidelines/Naming** page in the docs for how Elements, Blocks, and Design Tokens relate.

---

## Commits

This project follows [Conventional Commits](https://www.conventionalcommits.org/).

```
feat(dom): add css tagged template helper
fix(router): handle trailing slash in params
docs: update contributing guide
```

Commits are linted automatically via `commitlint` on every `git commit`.

---

## Pull requests

- One concern per PR
- Include a clear description of *why*, not just *what*
- Do not add runtime dependencies — kuba ships with zero, by design
- Do not break subpath exports or change the public API without discussion
- A new or changed custom element ships with its `types.d.ts` and story updated in the same PR

Open an issue first for anything beyond a small bug fix or typo.

---

## Code style

Formatting and linting are handled by [Biome](https://biomejs.dev). Running `bun run check` before committing is enough — the pre-commit hook does it automatically.

No manual style decisions are needed.

---

## Questions

Open a [GitHub Discussion](https://github.com/T2E1/kuba/discussions) for questions or ideas. Reserve issues for confirmed bugs and feature requests with a clear use case.
