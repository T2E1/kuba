# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0-alpha.10] — 2026-07-17

### Removed

- `JSX.IntrinsicElements` typings and the `KUBAIntrinsicElementProps`/`KUBAJSXIntrinsicProps` helpers added in `0.1.0-alpha.9` — a uniform prop shape doesn't fit every custom element (e.g. headless elements have no `children`/`style`), so this needs a per-element design instead of a blanket one

### Added

- `KUBARedirectHrefAttribute` template literal type constraining `<kb-redirect>`'s `href` to an absolute URL, absolute path, or `#`/`?` fragment, mirroring the `value` typing already done for `<kb-on>`

### Changed

- `<kb-redirect>`'s `types.d.ts` example now wires navigation declaratively from a `<kb-button>` click via the `on` attribute (Echo arc), instead of calling `go()` imperatively from a `<script>` block

## [0.1.0-alpha.9] — 2026-07-17

### Added

- `JSX.IntrinsicElements` typings for every custom element (`kb-*`/`k-*`), so they can be used as JSX tags (e.g. in `.tsx` files) with full prop checking, without any dependency on React or another JSX runtime
- `KUBAIntrinsicElementProps<E>` and `KUBAJSXIntrinsicProps` in the root `types.d.ts`, deriving each element's JSX props from its own class instead of duplicating the attribute list

## [0.1.0-alpha.8] — 2026-07-17

### Changed

- Renamed every custom-element class exported from a package's `types.d.ts` to the `KUBA<Name>Element` convention (e.g. `On` → `KUBAOnElement`, `Button` → `KUBAButtonElement`), matching the native `HTML<Name>Element` naming pattern
- Added complete JSDoc to every public `types.d.ts` across all packages (class purpose, property defaults/attribute reflection, method contracts, usage examples) for external TypeScript consumers
- Added minimal JSDoc to implementation files across all packages, documenting non-obvious behavior (decorator/mixin interactions, side effects, invariants) without restating what the code already says

## [0.1.0-alpha.7] — 2026-07-16

### Changed

- Simplified type distribution to a single root `types.d.ts` that self-registers each subpath via `declare module '@t2e1/kuba/<name>'`, so `package.json` `exports` no longer needs a `types` condition per subpath — only `.` does
- `mixin` types now declare `Hidden`/`Headless` inline instead of importing them, avoiding a TypeScript restriction where a file mixing a plain `import` with a `declare module` block fails resolution for consumers

### Removed

- `tsconfig.types.json` and the `typecheck:types` script (validated via the build + an external consumer check instead)
- `types/kuba.d.ts` and the `types/` directory, replaced by the root `types.d.ts`

## [0.1.0-alpha.6] — 2026-07-16

### Added

- Hand-authored `types.d.ts` for every package and custom element, linked per subpath in `package.json` `exports` so TypeScript consumers (including `strict: true`) get full type checking and `HTMLElementTagNameMap` autocomplete for all `kb-*`/`k-*` custom elements
- `tsconfig.types.json` and `npm run typecheck:types` to validate the declaration files

## [0.1.0-alpha.5] — 2026-07-16

### Added

- `typography` package grouping text-rendering components (`text`, `label`, `helper`) that previously lived in `component`, `form`, and `behavior`
- Project rules and Claude Code commands under `.claude/`

### Changed

- `load` moved from `behavior` to `data` group, then removed as unused

## [0.1.0-alpha.4] — 2026-07-15

### Added

- `packages/data/fetch/` — headless HTTP component with AbortController and ok/error events
- `packages/http/` — standalone fluent HTTP builder with subpath export `@t2e1/kuba/http`

### Changed

- `dataset` — rewritten with in-memory Storage (Map), push/delete/reset/upsert pattern
- `find` — rewritten to query `parentElement.value` (in-memory), dispatches `find` event
- `filter` — rewritten to query `parentElement.value` (in-memory), dispatches `filter` event
- All `new CustomEvent(...)` replaced with `customEvent` from `@event`
- Tags renamed to `k-` prefix (`k-dataset`, `k-find`, `k-filter`, `k-fetch`)

## [0.1.0-alpha.3] — 2026-07-15

### Fixed

- Enable terser compress and mangle for proper JS minification
- Minify CSS and HTML inside tagged template literals

## [0.1.0-alpha.2] — 2026-07-15

### Changed

- Drop CJS output, ESM only
- Remove IIFE output
- Simplify subpath exports in package.json

## [0.1.0-alpha.1] — 2026-07-15

### Added

- Initial release of `@t2e1/kuba`
- Custom element groups: `behavior`, `component`, `data`, `form`, `layout`
- Utility packages: `cookie`, `directive`, `dom`, `echo`, `event`, `middleware`, `mixin`, `pixel`, `polyfill`, `renderer`, `result`, `router`, `spark`, `storage`
- Subpath exports for all packages (`@t2e1/kuba/dom`, `@t2e1/kuba/router`, etc.)
- GitHub Actions workflow for automated npm publishing
- Biome, commitlint, husky, and lint-staged for code quality
