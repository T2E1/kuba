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

| Command | Does |
|---|---|
| `bun run docs` | Serves this documentation at `localhost:3000`. |
| `bun run check` | Lint and formatting, via Biome. |
| `bun run release` | Builds `dist/` with Vite. |

The repository has no runtime dependencies, so `bun install` only fetches the
tooling.

## The shape of a change

Two gates run before a commit lands, both through husky:

- **`lint-staged`** runs `biome check --write` on the staged `.js`, `.ts` and
  `.json` files. Formatting is not a review topic — the tool decides.
- **`commitlint`** enforces
  [Conventional Commits](https://www.conventionalcommits.org/). A message that
  doesn't parse is rejected before it reaches history.

```
feat(input): add a pattern attribute
fix(echo): tear down the arc on disconnect
docs(card): document the outlined variant
```

The prefix isn't decoration — it drives the version bump. `feat` bumps the
prerelease, `fix` too, and `feat!` (or a `BREAKING CHANGE:` footer) marks a
breaking change, which during alpha still bumps the prerelease but must be
listed in the changelog with a migration note.

## What a new element needs

A component isn't done when it renders. At minimum:

1. **The implementation** — `packages/<category>/<name>/<name>.ts`, plus its
   `component.js` and `style.js`.
2. **A `types.d.ts` beside it**, hand-written, describing only the public
   surface and registering the tag in `HTMLElementTagNameMap`. An
   implementation with no `types.d.ts` isn't a public component.
3. **Every visual decision as a `--<name>-*` custom property**, defaulting to a
   design token. No literals in `style.js`.
4. **A page under `docs/components/`**, following the shape of the existing ones:
   live example, when to use and when not to, composition, attributes, events,
   styling, accessibility, do's and don'ts.

Before writing any of it, check [Naming](/foundations/naming) — the change may
be a Block (a composition of existing Elements) rather than a new Element, in
which case it needs markup, not a package.

## Documentation is part of the change

This site loads kuba **from the CDN at a pinned version**, declared in
`docs/index.html`. Two consequences for a contributor:

- **A release bumps the pin.** Shipping a version without updating
  `docs/index.html` leaves the documentation describing behavior the published
  package doesn't have. The Pages workflow fails the build when the pin points
  at an unpublished version, but it can't catch a pin that's merely stale.
- **A broken release breaks the docs visibly.** Every example here runs against
  the real package, so a regression shows up as a dead example rather than
  passing green against local source.

## Reporting something

Open an [issue](https://github.com/T2E1/kuba/issues). Positive feedback is
welcome too — knowing what works helps as much as knowing what doesn't.

For a bug, the useful shape is: the markup, what you expected, what happened,
and which version. A live reproduction beats a description, and since kuba needs
no build step, a single HTML file with the two CDN tags is usually enough.

## Building your product on it

Starting your own product and want kuba as its foundation? Install it, or clone
the repository and use the package structure as a starting point. Adapt the
design tokens to your brand — see
[Theming a brand](/learn/styling) — and adjust the components as needed.

kuba is not a framework that dictates one way of working. It's a reference to be
studied, understood and adapted to the reality of each product; the guarantees
come from the [principles](/foundations/principles), not from an API that must
be obeyed to the letter.

Just remember to keep the license credits, as the MIT license requires.
