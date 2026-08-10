# Contributing

kuba is at `0.1.0-alpha` and under active development. Use it, give feedback,
and contribute to that evolution.

It's distributed under the **MIT** license — use it for any purpose, commercial
included; just keep the credits in
[`LICENSE`](https://github.com/T2E1/kuba/blob/main/LICENSE).

## Running it locally

```sh
git clone https://github.com/T2E1/kuba.git
cd kuba
bun install
```

The repository has no runtime dependencies, so `bun install` only fetches the
tooling. The scripts — running the docs, the test suite, the linter, the build —
are listed in
[`CONTRIBUTING.md`](https://github.com/T2E1/kuba/blob/main/CONTRIBUTING.md),
which is where the development setup is kept up to date.

## The shape of a change

Two gates run before a commit lands, both through husky: **`lint-staged`** runs
`biome check --write` on the staged files — formatting is not a review topic,
the tool decides — and **`commitlint`** rejects any message that isn't a
[Conventional Commit](https://www.conventionalcommits.org/) before it reaches
history.

```
feat(input): add a pattern attribute
fix(echo): tear down the arc on disconnect
docs(card): document the outlined variant
```

The prefix isn't decoration: it drives the version bump.

[`CONTRIBUTING.md`](https://github.com/T2E1/kuba/blob/main/CONTRIBUTING.md) in
the repository carries the rest — the project structure, what a new element
ships with, and what a pull request is expected to look like.

Before writing any of it, check [Naming](/foundations/naming) — the change may
be a Block (a composition of existing Elements) rather than a new Element, in
which case it needs markup, not a package.

## Documentation is part of the change

This site is markdown rendered by docsify in the browser, and it loads kuba
**from the CDN at a pinned version**, declared in `docs/index.html` — the same
two tags any consumer would write. Every live example here runs against the
published package, so a regression shows up as a dead example rather than
passing green against source that only exists on a developer's machine.

Two consequences for a contributor:

- **A release bumps the pin.** Shipping a version without updating
  `docs/index.html` leaves the documentation describing behavior the published
  package doesn't have. The Pages workflow fails the build when the pin points
  at an unpublished version, but it can't catch a pin that's merely stale.
- **A page is part of the element.** A new or changed element lands with its
  page under `docs/components/` in the same pull request.

## Reporting something

Open an [issue](https://github.com/T2E1/kuba/issues). Positive feedback is
welcome too — knowing what works helps as much as knowing what doesn't.

For a bug, the useful shape is: the markup, what you expected, what happened,
and which version. A live reproduction beats a description, and since kuba needs
no build step, a single HTML file with the two CDN tags is usually enough.

A security issue goes to
[`SECURITY.md`](https://github.com/T2E1/kuba/blob/main/SECURITY.md) instead —
privately, not through a public issue.

## Building your product on it

Starting your own product and want kuba as its foundation? Install it, or clone
the repository and use the package structure as a starting point. Adapt the
design tokens to your brand — see
[Theming a brand](/build-ui/theming) — and adjust the components as needed.

kuba is not a framework that dictates one way of working. It's a reference to be
studied, understood and adapted to the reality of each product; the guarantees
come from the [principles](/foundations/principles), not from an API that must
be obeyed to the letter.

Just remember to keep the license credits, as the MIT license requires.
