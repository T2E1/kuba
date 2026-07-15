# Contributing to kuba

Thank you for your interest in contributing. kuba is a small, opinionated project — contributions that align with its design principles are welcome; contributions that add complexity without clear benefit are not.

Read the [README](./README.md) first. Understand the HDA model and why it matters before proposing changes.

---

## Development setup

**Requirements:** [Bun](https://bun.sh) and Node.js >= 20.

```sh
git clone https://github.com/T2E1/kuba.git
cd kuba
bun install
bun run build
```

---

## Project structure

```
packages/
├── behavior/    custom elements — behavioral (on, redirect, render…)
├── component/   custom elements — visual components
├── data/        custom elements — data binding
├── form/        custom elements — form controls
├── layout/      custom elements — layout primitives
│
├── dom/         utility — template helpers
├── echo/        utility — event primitives
├── router/      utility — client-side routing
├── spark/       utility — pure functions
└── ...
```

Each package is self-contained. Changes to one package should not require changes to another.

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
- Do not add dependencies unless strictly necessary
- Do not break subpath exports or change the public API without discussion

Open an issue first for anything beyond a small bug fix or typo.

---

## Code style

Formatting and linting are handled by [Biome](https://biomejs.dev). Running `bun run check` before committing is enough — the pre-commit hook does it automatically.

No manual style decisions are needed.

---

## Questions

Open a [GitHub Discussion](https://github.com/T2E1/kuba/discussions) for questions or ideas. Reserve issues for confirmed bugs and feature requests with a clear use case.
