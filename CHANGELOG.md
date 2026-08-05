# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0-alpha.27] — 2026-08-05

### Added

- The remaining 15 visual elements now expose their visual decisions as overridable CSS custom properties, the same way `<kb-cover>` and `<kb-footer>` already did — `--header-*`, `--icon-*`, `--logo-*`, `--progress-*`, `--stack-*`, `--inset-*`, `--main-*`, `--helper-*`, `--label-*`, `--text-*`, `--input-*`, `--textarea-*`, `--fileupload-*`, `--validity-*` and `--form-*`. Each defaults to the value it replaced, so nothing changes visually; re-style an element by setting these on it or any ancestor, without reaching into its shadow DOM
- `<kb-icon>` exposes the four Material Symbols variation axes (`--icon-fill`, `--icon-weight`, `--icon-grade`, `--icon-optical-size`), so outlined or lighter glyphs no longer require a different font
- Storybook usage pages (`.mdx`) for those same 15 elements — when to use and when not to, composition rules, the per-attribute usage guidance, the custom property table, accessibility notes and do/don't pairs

### Changed

- `<kb-inset>`'s margin and border-radius maps are now derived from two constants instead of repeating `-16px`/`8px` across fourteen literal strings
- The 15 elements' Storybook pages now render from their `.mdx` instead of auto-generated docs; `tags: ['autodocs']` was removed from each story file, as the hand-written page replaces it

## [0.1.0-alpha.26] — 2026-08-05

### Changed

- **Breaking:** the four headless data elements moved to the `kb-` prefix — `<k-dataset>`, `<k-fetch>`, `<k-filter>` and `<k-find>` are now `<kb-dataset>`, `<kb-fetch>`, `<kb-filter>` and `<kb-find>`. Markup, `document.querySelector` calls and `HTMLElementTagNameMap` entries using the old tags must be updated; the old names are no longer registered
- Every Kuba custom element now shares a single `kb-` prefix. The Naming guideline no longer splits prefixes by visual presence — `<kb-headers>`, `<kb-on>` and `<kb-redirect>` were already headless elements on `kb-`, so the split had stopped describing the library
- Fixed the Echo arcs left pointing at `<kb-input>`'s old `change` event in the README example and in the `<kb-render>` story — both now wire `dog/changed:method/get`

## [0.1.0-alpha.25] — 2026-08-05

### Changed

- **Breaking:** `<kb-input>` now dispatches `changed` instead of `change` when its value changes. Listeners and Echo arcs pointing at `change` on an input (`on="...change:method/..."`) must be updated to `changed`. The other form controls (`<kb-textarea>`, `<kb-fileupload>`) and `<kb-dataset>` still dispatch `change`
- `<kb-validity>` now revalidates on both `change` and `changed`, so it keeps working nested in any form control regardless of which event that control dispatches

## [0.1.0-alpha.24] — 2026-08-05

### Changed

- Reverted the `Template` mixin changes released in `0.1.0-alpha.23`: template resolution is back to the `innerHTML` of the referenced `<template>`, falling back to the concatenated `outerHTML` of its children. The React interoperability those changes targeted will be addressed by a dedicated decorator that observes children/template mutations

## [0.1.0-alpha.23] — 2026-08-05

### Fixed

- Elements backed by the `Template` mixin (`<kb-form>`, `<kb-render>`) now read their `<template>` correctly when the markup is created by React. React appends template children to the element itself instead of to its `content` fragment, which left `innerHTML` empty and made the template resolve to nothing; the mixin now serializes whichever child list actually holds the content
- Templates authored in React no longer lose text nodes and whitespace between elements — the previous fallback only serialized element children, so loose text (`Hello {name}`) and spacing between tags were dropped
- Reading `template` on an element without a `<template>` child now returns an empty string instead of throwing a `TypeError`

## [0.1.0-alpha.22] — 2026-08-05

### Added

- `<kb-footer>` now exposes its dimensions and spacing as overridable CSS custom properties (`--footer-size-height`, `--footer-size-max-width`, `--footer-space-inset`) — re-size a footer by setting these on the element or any ancestor, without reaching into its shadow DOM
- A `footer.mdx` Storybook usage page documents `<kb-footer>` — when to use it, the `leading`/`trailing` slots and their composition rules, the full set of `--footer-*` properties, and its `contentinfo` landmark

### Changed

- Hardcoded values in `<kb-footer>` are now token defaults instead of magic constants — no visual change
- `<kb-footer>`'s Storybook page now renders from `footer.mdx` instead of auto-generated docs; the catalog-only `Default` story was replaced by the interaction-tested `ProjectsSlottedContent` and `FallsBackToCopyright` stories, and both slots are now wired to controls

### Fixed

- `<kb-footer>` now fills the width of its container instead of the width of the viewport (`100%` instead of `100svw`). Nested in anything narrower than the window, it used to overflow its parent, producing a horizontal scrollbar and pushing the `trailing` content out of view; at the page root the rendering is unchanged

## [0.1.0-alpha.21] — 2026-08-01

### Added

- `<kb-cover>` now exposes its visual decisions as overridable CSS custom properties (`--cover-*`), each defaulting to a global `pixel` token (or a plain aspect-ratio value for `landscape`/`portrait`) — re-style a cover by setting these on the element or any ancestor, without reaching into its shadow DOM
- `<kb-cover>`'s public types (`types.d.ts`) and Storybook controls now surface the `on` attribute it inherits from the `Echo` mixin
- A `cover.mdx` Storybook usage page documents `<kb-cover>` — when to use it, composition, orientations, the full set of `--cover-*` properties, and accessibility guidance for `alt`

### Changed

- Hardcoded values in `<kb-cover>` are now token defaults instead of magic constants — no visual change
- `<kb-cover>`'s Storybook page now renders from `cover.mdx` instead of auto-generated docs; the catalog-only `Landscape`/`Portrait` stories were replaced by an interaction-tested `RendersImage` story

## [0.1.0-alpha.20] — 2026-07-30

### Added

- `<kb-card>` now exposes its visual decisions as overridable CSS custom properties (`--card-*`), each defaulting to a global `pixel` token — re-style a card by setting these on the element or any ancestor, without reaching into its shadow DOM. A `card.mdx` Storybook usage page documents the component, its variants, and the full set of properties
- `<kb-card>`'s public types (`types.d.ts`) and Storybook controls now surface the `height`, `width`, and `on` attributes it inherits from the `Height`, `Width`, and `Echo` mixins

### Changed

- Hardcoded values in `<kb-card>` are now token defaults instead of magic constants — no visual change
- The global CSS reset (`@pixel/reset`) is temporarily disabled: its `@import` in `pixel/index.css` is commented out, so consuming pages no longer receive the box-sizing/margin/padding, scrollbar, `:defined`, and body resets

## [0.1.0-alpha.19] — 2026-07-28

### Added

- `<kb-button>` and `<kb-render>` now expose their visual decisions as overridable CSS custom properties (`--button-*`, `--render-*`), each defaulting to a global `pixel` token — re-style a component by setting these on the element or any ancestor, without reaching into its shadow DOM. Each component's Storybook usage page documents the full set of properties and their defaults

### Changed

- Hardcoded values in `<kb-button>` (`40px` height/min-width, `0.38px` letter-spacing, `0.2s` transition) and `<kb-render>` (`2` grid columns) are now token defaults instead of magic constants — no visual change

## [0.1.0-alpha.18] — 2026-07-27

### Fixed

- `npm run dev` (Storybook) no longer crashes with `ReferenceError: __dirname is not defined`: `vite.config.js` now resolves its path aliases via `import.meta.dirname` instead of `__dirname`, so importing the config as ESM (as the Storybook `main.js` does) works

## [0.1.0-alpha.17] — 2026-07-27

### Added

- Importing `@t2e1/kuba` now also applies the `pixel` stylesheet (CSS reset + design tokens) and installs the browser polyfills automatically — the main entry pulls in `@pixel/index.css` and `@polyfill`, so consumers no longer need to import them separately

### Changed

- All imports in the main entry (`index.js`) now use path aliases (`@behavior`, `@component`, …) instead of relative `./packages/*` paths
- CDN usage is documented as an ES module import (`import 'https://cdn.jsdelivr.net/npm/@t2e1/kuba/+esm'`) instead of a `<script type="module">` tag, in both the README and the "Try Kuba" guide

### Removed

- `vite.aliases.js` — the shared path-alias map now lives in `vite.config.js` as a named `aliases` export, consumed directly by the Storybook config

## [0.1.0-alpha.16] — 2026-07-24

### Added

- `<kb-headers>` (`packages/data/headers/`): a headless child element that sets one HTTP header key/value pair on its parent `<k-fetch>` once the parent has upgraded — nest one per header (e.g. `<kb-headers key="Authorization" value="Bearer abc123">`)
- `<k-fetch>` now accepts headers set via `<kb-headers>` children, forwarding them to every request (`get`/`post`/`put`/`delete`)
- `packages/http/http.js`: the HTTP request-builder Proxy, extracted out of `packages/http/index.js` (now a thin re-export) so it can be imported/tested independently

### Changed

- `<k-fetch>`'s abort-controller handling moved into a dedicated `Controller` class (`packages/data/fetch/controller.js`), replacing manual `AbortController` recreation on every abort

## [0.1.0-alpha.15] — 2026-07-24

### Added

- `<kb-render>` now has a `clear()` method, emptying its rendered `textContent` without touching its template — the natural counterpart to `render()`, commonly wired to an error/empty event (e.g. `<kb-on value="api/error:method/clear">` next to `<kb-on value="api/ok:method/render">`)
- `render.mdx` documents `clear()` alongside `render()` in the "Data and re-rendering" section

### Changed

- `render.stories.js` replaces the `List`/`Grid`/`WiredToADataset` stories with a single `WiredToAFetch` story, demonstrating `<kb-render>` wired to `<kb-input>` and `<k-fetch>` (search-as-you-type against a real API), with a `play` function that types into the input and asserts the rendered results
- `WiredToAFetch`'s markup is now also passed explicitly via `parameters.docs.source.code`, so the "Show code" panel shows it verbatim instead of the DOM-extraction-based auto-formatter mangling inline elements (`<strong>`, direct text) across multiple lines

## [0.1.0-alpha.14] — 2026-07-23

### Added

- `packages/component/button/button.mdx`: a hand-authored usage page for `<kb-button>` — when to use/not use it, composition (valid children: text, `<kb-icon>`, `<kb-on>`; valid parents: any), `variant` hierarchy, `color` semantics, `width` sizing guidance, content rules, states/accessibility notes, and a do's/don'ts table. Replaces the auto-generated autodocs page for this component, with the same live playground (`<Canvas>` + `<Controls>`) reproduced at the top
- `storybook-story-standard` skill: new Rule 5 and `references/usage-doc.md`, codifying the `<name>.mdx` usage-page pattern (piloted on `<kb-button>`) as an opt-in evolution of autodocs for components that need "when/how to use" guidance, not just an attribute catalog
- `.storybook/preview-head.html`: loads the Google Fonts stylesheets (`Material Symbols Rounded`, `Roboto`/`Roboto Condensed`) that `<kb-icon>` and `packages/pixel/tokens/fontFamily.css` already depended on, previously missing from the Storybook preview
- `button.stories.js`'s `argTypes` now set `table.defaultValue.summary` for every attribute with a documented `@default`, populating the "Default" column in the Controls panel (previously blank)

### Changed

- `.storybook/preview.js`'s `docs.source.transform` now pretty-prints the markup returned by a story's `render` (previously a single unindented line) before showing it in the "Show code" panel
- `.storybook/main.js` now indexes `packages/**/*.mdx`, enabling per-component usage pages colocated with their `.stories.js`

### Fixed

- `<kb-button>`'s `hidden` attribute had no visual effect: the `Hidden` mixin reads `this.internals.states` (a public property), but `Button` only exposed a private `#internals` field — `this.internals` was `undefined`, so the mixin's deferred state toggle silently threw and never added the `hidden` custom state. Added a public `get internals()` getter (matching `<kb-card>`'s existing pattern) and documented it in `types.d.ts`

## [0.1.0-alpha.13] — 2026-07-23

### Added

- `<kb-button>`'s `types.d.ts` now documents its full attribute surface: `on` (Echo wiring, `KUBAButtonOnAttribute`), `hidden` (`Hidden` mixin, with the boolean-attribute coercion rules), `value` (`Value` mixin), and `width` (`Width` mixin, `KUBAButtonWidthAttribute` matching the `resizing` filter's normalization) — previously only `color`, `type`, and `variant` were typed
- `color` and `variant` on `<kb-button>` are now typed as closed unions (`KUBAButtonColorAttribute` matching the tokens in `packages/pixel/tokens/color.css`, `KUBAButtonVariantAttribute` matching the states in `style.js`) instead of plain `string`
- `button.stories.js` now exposes controls for `on`, `hidden`, `value`, and `width`, with `color`/`variant` as `select` controls backed by the same closed unions, and declares `parameters.actions.handles: ['clicked']`

### Changed

- `.storybook/preview.js`'s `docs.source` now derives the "Show code" panel by calling each story's own `render` with its current args (via a `transform`), instead of showing the raw source text of the story export — which, for stories relying on the meta-level `render`, was just `{}`

### Fixed

- `<kb-button>`'s `width` attribute had no visible effect: `:host` in `style.js` didn't set `display`, so it fell back to the default `inline`, on which CSS `width` has no effect — added `display: inline-flex`
- `button.stories.js`'s `Outline` story passed `variant: 'outline'`, which was never a valid value (the actual states in `style.js` are `naked`/`ghost`/`link`/`icon`) — replaced with a `Naked` story using a real variant

## [0.1.0-alpha.12] — 2026-07-21

### Added

- `@t2e1/kuba/interpolate` package: a single `interpolate(text, data)` utility replacing the `{path.to.value}` placeholder logic that was previously duplicated between `<kb-render>` and `<kb-form>` (and reached into cross-package by `<k-fetch>`). No longer uses `new Function` internally — path lookups are resolved with a plain `reduce`, and a missing value now resolves to `''` instead of the literal `"undefined"`
- `<kb-redirect>`'s `href` now supports `{path.to.value}` placeholders, interpolated against the `params` passed to `go()` when `route` isn't set (e.g. `href="/user/{id}"` with `go({ id: 42 })` navigates to `/user/42`)
- `<kb-render>`'s `types.d.ts` now documents its `on` (Echo wiring), `layout` (`'list' | 'grid'`), and `template` (id-reference to an external `<template>`, or its own `<template>` child when unset) attributes
- `:host(:state(hidden))` style rule on `<kb-render>`, so the `hidden` custom state toggled by the `Hidden` mixin actually hides the element

### Changed

- `<k-fetch>`, `<kb-render>`, and `<kb-form>` now import `interpolate` from `@interpolate` instead of a local/cross-package file

### Fixed

- `<kb-render>`'s documented example, which incorrectly showed the `template` attribute holding template text directly (`template="Hello, {name}!"`) instead of an id reference — replaced with the correct `<template>`-as-child usage

## [0.1.0-alpha.11] — 2026-07-20

### Added

- `on` property on `<kb-redirect>`'s `types.d.ts`, typed with a component-local `KUBARedirectOnAttribute`/`KUBARedirectOnAttributeSink` arc-string shape, documenting the Echo wiring already supported by the element
- `types-standard` skill (`.claude/skills/types-standard/`), codifying how `types.d.ts` files are structured and named for KUBA custom elements: per-package isolation (no cross-package type imports), flattening of mixin-contributed members onto the component's class, and the `KUBA<Name>...` naming taxonomy

### Changed

- `/annotate` command now runs in two ordered phases: first structures any missing `types.d.ts` using the `types-standard` skill, then documents everything with `jsdoc-standard` — so JSDoc is never written against a type contract that's still being shaped

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
