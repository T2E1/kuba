# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.2.0-alpha.3] — 2026-08-23

### Added

- `enumerated` joins `booleanAttribute`, `enumerating` and `escaping` on the `attributeChanged` directive, re-exported from `@t2e1/kuba/directive`. Given a frozen enum object, it only propagates a value present among that enum's values — an unknown token never reaches the setter, so the property keeps whatever was last valid. It is the closed-set guard `<kb-icon>`'s `color` and `size` now use, and the piece to reach for when an attribute of your own feeds a stylesheet or a template
- `<kb-icon>`'s published type declaration names its accepted values instead of `string`. `color` is now the union of the eight semantic families, `size` the union of the eleven scale steps, and `on` the arc-string shape inherited from `Echo`. TypeScript code assigning `icon.size = 'huge'` stops compiling where it used to pass

### Changed

- **Breaking:** `<kb-icon>`'s `color` property reads back the token you set, not the CSS it resolves to. `icon.color` used to return `'var(--color-primary)'`, or `'currentColor'` when the attribute was unset; it now returns `'primary'`, and `undefined` when unset. Code that took the property and dropped it straight into a style declaration has to wrap it itself — `` `var(--color-${icon.color})` ``. Reading the property to find out which family is set now works, which is what an attribute reflection is supposed to do
- **Breaking:** `<kb-icon>`'s `color` accepts eight semantic families and nothing else — `master`, `primary`, `complete`, `success`, `warning`, `danger`, `info`, `menu`. Any suffix of `--color-*` used to be interpolated through, so shade variants like `color="master-dark"` rendered; they are now rejected and the icon keeps its previous color, or falls back to `currentColor` if none was valid yet. Same for `size`, which now accepts only the eleven documented steps from `xxxs` to `giant`
- **Breaking:** `<kb-header>`'s shadow wrapper is `100%` wide instead of `100svw`. It used to span the viewport regardless of what contained it, so a header nested in a narrower element overflowed that element; it now fills the width it is given. A layout that leaned on the overflow to break out of a constrained container loses that effect — put the header at page root, or set `width: 100vw` on it yourself. `<kb-footer>` was corrected the same way in `0.2.0-alpha.2`; this closes the pair
- `<kb-icon>`'s `use` is escaped before it becomes markup. A ligature name is written into the shadow root through `innerHTML`, so a value carrying `<` or a quote used to be parsed as real markup; it is now inserted as text. A `use` value that was somehow relying on being markup renders literally instead

### Fixed

- `<kb-icon>` no longer lets `color` or `size` inject CSS into its shadow root. Both values were interpolated into the adopted stylesheet unvalidated, so a payload closing the declaration early — `size="md)); } :host { … } trap { font-size: var(--a"` — appended arbitrary rules to the element's styles. Any value reaching the stylesheet is now one of the known tokens
- `<kb-icon>` no longer lets `use` inject markup. `use="<img src=x onerror=…>"` used to run the handler; the value is now escaped before it reaches the shadow root, matching what `<kb-button>` already did with `alt`

### Migration

`color` reflects the token now, not the resolved CSS:

```js
// before: the property already carried the var()
element.style.color = icon.color

// after: resolve it where you use it
element.style.color = icon.color ? `var(--color-${icon.color})` : 'currentColor'
```

Shade variants are no longer valid values. `<kb-icon color="master-dark">` renders in `currentColor`; pick the base family and adjust with the `--icon-color` custom property if you need a specific shade:

```html
<!-- before -->
<kb-icon use="info" color="master-dark"></kb-icon>

<!-- after -->
<kb-icon use="info" style="--icon-color: var(--color-master-dark)"></kb-icon>
```

## [0.2.0-alpha.2] — 2026-08-22

### Added

- `<kb-footer>` spaces the elements projected into a single region. `leading` and `trailing` are flex rows, so two links slotted into `trailing` no longer render flush against each other. The gap reads `--footer-space-gap`, falling back to `--spacing_inset-xs`; set it to `0` to get the old flush rendering back

### Changed

- **Breaking:** `<kb-footer>` no longer ships a default copyright line. Its `leading` slot used to fall back to `© 2025 Memoize. Todos os direitos reservados.` — a hardcoded year, a company that is not yours, in a language the rest of the library does not speak. A footer with nothing slotted into `leading` now renders that region empty. Write your own notice into the slot
- **Breaking:** `<kb-footer>`'s `leading` and `trailing` are `display: flex` instead of participating in the surrounding layout as plain boxes. Content projected into them is now laid out as a row, centred on the cross axis, with `leading` packed to the start and `trailing` to the end. A slotted element that relied on the previous flow — a block filling the region's width, or several inline nodes wrapping — will lay out differently
- **Breaking:** `internals` is gone from `<kb-footer>`'s published type declaration, following `<kb-button>`, `<kb-card>` and `<kb-cover>`. The property still exists at runtime, because the `Identity` mixin writes the landmark's role and name through it, but exposing `ElementInternals` on the host hands out write access to form state and the accessibility tree. TypeScript code reading `footer.internals` stops compiling; nothing in the documented API needed it

### Migration

The copyright line is now yours to write:

```html
<!-- before: the region filled itself in -->
<kb-footer>
  <kb-text slot="trailing" size="xxxs">Privacy Policy</kb-text>
</kb-footer>

<!-- after: say it yourself, in your language and your year -->
<kb-footer>
  <kb-text slot="leading" size="xxxs">© 2026 Your Company</kb-text>
  <kb-text slot="trailing" size="xxxs">Privacy Policy</kb-text>
</kb-footer>
```

Nothing replaces the fallback: a legal notice with a year baked into a published package goes stale the moment the year turns.

## [0.2.0-alpha.1] — 2026-08-21

### Added

- `<kb-cover>`, a cropped, aspect-ratio-constrained cover image. It takes `src` and `alt` for the underlying `<img>`, `orientation` to pick the ratio — `landscape` renders 16/9, `portrait` renders 4/5 — and `hidden`, which mirrors into `:state(hidden)` like every other element using the `Hidden` mixin. Use it wherever you were hand-rolling a wrapper with `aspect-ratio` and `object-fit: cover`

### Changed

- **Breaking:** `<kb-card>` is a layout container and nothing else. It loses `value`, `click()`, the `clicked` event and `variant="outlined"`. A card that was acting as a button no longer reacts to anything, and no longer dispatches — an Echo arc listening for `card/clicked:...` stops firing, and `card.click()` is now the inherited `HTMLElement.click()`, which does not carry a payload. What remains is `direction`, `height`, `width` and `on`
- **Breaking:** `<kb-cover>` is `display: block`. It was inline while it was undocumented, so a cover sitting between text nodes used to sit on the baseline and pick up line-height; it now takes the full width of its container and starts on its own line. If you relied on the old flow, set `display: inline-block` on the host
- **Breaking:** the `./polyfill` and `./interpolate` subpaths are gone from `exports`. `import '@t2e1/kuba/polyfill'` and `import ... from '@t2e1/kuba/interpolate'` now fail to resolve. Neither was ever needed: the polyfill installs itself as a side effect of the root import, and `interpolate` is an internal utility of the renderer with no stable signature. Delete the import — the root `import '@t2e1/kuba'` already does the work

### Fixed

- `<kb-stack>`'s `direction` and `<kb-cover>`'s `orientation` reject values outside the sets their documentation already listed. An unknown token is ignored and the property keeps its last valid value, instead of being interpolated into the shadow stylesheet as an invalid CSS declaration. `<kb-card>`'s `direction` validates the same way, against `row` and `column`
- `<kb-cover>`'s `alt` and `src` are escaped before they become attributes on the inner `<img>`. A quote or angle bracket in a caption or in a query-string URL no longer terminates the attribute early and corrupts the rendered markup

### Migration

Restoring a clickable card means putting the interactive element where it belongs, rather than on the container:

```html
<!-- before -->
<kb-card value="42" variant="outlined" on="#list/selected:setter/value">…</kb-card>

<!-- after: the card frames, the button acts -->
<kb-card>
  <kb-button value="42" on="#list/selected:setter/value">…</kb-button>
</kb-card>
```

`<kb-button>` carries `value`, `click()` and `clicked` with the same semantics the card had, plus the focus, keyboard activation and disabled handling the card never had. If the clickable region is a link or a single control inside the card, put the listener on that element directly — it is the one users actually reach with the keyboard. `variant="outlined"` has no replacement attribute; draw the border with the `--card-*` custom properties.

## [0.1.0-alpha.33] — 2026-08-20

### Added

- A documentation site built with docsify, published to GitHub Pages: 62 pages covering foundations, design tokens, guides, every component, the package reference and a cookbook. It loads kuba from the CDN at a pinned version, so every live example runs against the published package — a broken release now breaks the docs visibly
- An interaction test suite running in a real Chromium through Vitest browser mode (`bun run test`): 28 tests across 12 files, colocated with each package. They cover event dispatch, form association and validation, Echo arc wiring, shadow DOM projection and the full add-and-delete dataset flow
- The documentation site is available in three languages — English (the default, at the root), Portuguese (Brazil) at `/pt-br/` and Spanish at `/es/`. Home, Foundations, Design tokens, Learn and the Cookbook are translated; Components, Reference and Contributing stay in English and are served by docsify's language fallback, so no navigation entry is ever a dead link
- A language switcher in the navbar preserves the page being read: switching from `/pt-br/learn/lifecycle` to English lands on `/learn/lifecycle`, not the home page. The sidebar logo likewise returns to the current language's home instead of always the English one
- `<kb-button>` accepts `disabled`, as attribute and property. It writes the native `disabled` onto the `<button>` in the shadow root — so the platform itself blocks focus, click and keyboard activation, rather than a JavaScript guard that a synthetic event could slip past — publishes `:state(disabled)` for styling, and is inherited from an enclosing `<fieldset disabled>` through `formDisabledCallback`. Backed by `Disabled`, a new mixin exported from `@t2e1/kuba/mixin`
- `<kb-button>` accepts `type="button"`, for a button that carries a payload through an Echo arc without submitting or resetting its owning form. Previously only `'submit'` and `'reset'` existed, so an inert button meant sitting outside a form
- `<kb-button>` exports `part="button"`, so its inner `<button>` can be reached with `kb-button::part(button)` for the rare rule the `--button-*` custom properties do not cover
- `<kb-button>` gains hover, active and focus-visible styling on every variant, and a forced-colors treatment that keeps `naked`, `ghost`, `link` and `icon` from losing their boundary under a high-contrast theme

### Changed

- **Breaking:** `<kb-button>`'s `click()` returns the element itself instead of its `value`, so it chains like every other command in the library. Code reading the return — `const payload = button.click()` — now receives the element. Read `button.value` before or after the call instead; the `clicked` event still carries the value as its `detail`
- **Breaking:** `<kb-button>` dispatches `clicked` on the tick after `click()` returns, rather than synchronously during it. A test or handler that called `click()` and asserted on the next line must now await a tick — the listener itself is unaffected, only the timing relative to a programmatic call
- **Breaking:** setting `hidden = false` on any element using the `Hidden` mixin removes the `hidden` attribute on the following tick instead of synchronously. Code that assigns `hidden` and immediately reads `getAttribute('hidden')` or measures layout will see the old value; the attribute settles before the next paint
- **Breaking:** `<kb-button>`'s `color`, `variant` and `type` reject values outside their known sets. An unknown token is ignored and the property keeps its last valid value, instead of being interpolated into the shadow stylesheet or added to `internals.states` as an invented state. `color="brand"` no longer resolves to `--color-brand` — define your palette by overriding `--button-color-accent`, which is honoured ahead of the token in every variant
- `<kb-button>`'s `alt` is escaped before it becomes `aria-label`, so an ampersand, quote or angle bracket in the text no longer terminates the attribute early and corrupts the rendered markup
- `cursor: not-allowed` now actually shows on a disabled `<kb-button>`. The inner `<button>` declared `cursor: pointer` unconditionally, which won regardless of state
- The `@dispatchEvent` decorator from `@t2e1/kuba/echo` is deprecated. Tying the dispatched detail to the decorated method's return value forces commands to give up returning the element, which is what broke `click()`'s chaining. It still works and is still exported; dispatch a `customEvent` by hand instead
- `bun run dev` now serves the documentation; `bun run test` runs the suite instead of exiting 0, so a failing test blocks publishing to npm
- Documentation for `<kb-icon>` now states that the Material Symbols font is not bundled and must be loaded by the consumer, and that an unknown `use` renders as literal text

### Removed

- Storybook, its three addons and `remark-gfm`, along with 22 `.stories.js`, 22 `.mdx` and the `stories/` directory. Everything they documented lives in the docs site; the interaction tests moved to Vitest. Neither stories nor MDX were ever part of the published package, so consumers are unaffected
- `internals` is gone from `<kb-button>`'s published type declaration. The property still exists — the mixins need it — but it exposes `ElementInternals` on the host, which was never meant to be consumer-facing and gives write access to form state and the accessibility tree. Nothing in the documented API required it

## [0.1.0-alpha.32] — 2026-08-10

### Changed

- The file declaring a package's Symbol contracts is now named `interfaces.js` in every package. Six packages spelled it `interface.js` — `<kb-fetch>`, `<kb-dataset>`, `<kb-helper>`, `<kb-label>` and the `Hidden` and `Identity` mixins. The file is internal and never exported, so nothing consumers import changes
- The private style function of `<kb-button>`, `<kb-icon>`, `<kb-stack>` and `<kb-text>` is named after the element it styles instead of the generic `self`

## [0.1.0-alpha.31] — 2026-08-09

### Added

- `<kb-icon>` and `<kb-logo>` accept `alt`. Without it they now hide themselves from assistive technology, which is what you want whenever a visible label already carries the meaning — previously an icon was announced by its Material Symbols ligature name, so `use="cloud_upload"` was read aloud as "cloud_upload", and the logo was an unlabelled graphic. Given an `alt`, both become a named image
- `<kb-stack>`, `<kb-inset>` and `<kb-render>` declare themselves presentational, so they no longer add a node of their own to the accessibility tree. Their content keeps its semantics untouched

### Changed

- `<kb-icon>`'s documented workarounds are gone: adding `aria-hidden="true"` by hand, and naming an icon button through `aria-label`. The element hides itself, and `<kb-button>` takes `alt`

## [0.1.0-alpha.30] — 2026-08-09

### Added

- `Identity`, a mixin that gives an element its identity in the accessibility tree: the role it plays, declared through the `[role]` contract, and an accessible name backed by a new `alt` attribute. Both are published as default semantics on `ElementInternals`, so a `role` or `aria-label` written in the markup still wins. Exported from `@t2e1/kuba/mixin` alongside the `role` symbol
- `<kb-main>` now carries the `main` landmark, `<kb-header>` the `banner` landmark and `<kb-footer>` the `contentinfo` landmark. Previously `<kb-main>` exposed no landmark at all, and the docs told you to add `role="main"` by hand — that is no longer needed
- `<kb-progress>` now exposes `role="progressbar"`, with `value` mirrored onto `aria-valuenow` on every change and the scale fixed at `aria-valuemin="0"` / `aria-valuemax="100"`. It also accepts `alt`, to say what is progressing
- `<kb-button>` accepts `alt`, written as `aria-label` onto the `<button>` in its shadow root. Required for `variant="icon"`, which previously announced the Material Symbols ligature name — an icon button using `cloud_upload` was read as "cloud_upload"

### Changed

- The shadow roots of `<kb-header>` and `<kb-footer>` no longer render native `<header>`/`<footer>` elements. Those map to `banner`/`contentinfo` on their own, which would have nested two landmarks once the host carried the role. The wrapper is internal, so no consumer markup changes

## [0.1.0-alpha.29] — 2026-08-08

### Fixed

- `<kb-textarea>` now reports `willValidate` correctly. The getter read a property that does not exist on `ElementInternals`, so it always returned `undefined` — code branching on it treated the field as if it never took part in constraint validation. It now returns the boolean its type declaration always promised, matching `<kb-input>` and `<kb-fileupload>`

## [0.1.0-alpha.28] — 2026-08-06

### Changed

- **Breaking:** every custom event a kuba element dispatches is now named in the past tense, describing what happened rather than what to do. Listeners and Echo arcs targeting the old names stop firing and must be updated:

  | Element | Old event | New event |
  |---|---|---|
  | `<kb-textarea>` | `change` | `changed` |
  | `<kb-fileupload>` | `change` | `changed` |
  | `<kb-dataset>` | `change` | `changed` |
  | `<kb-filter>` | `filter` | `filtered` |
  | `<kb-find>` | `find` | `found` |
  | `<kb-fetch>` | `ok` / `error` | `succeeded` / `failed` |

  `<kb-button>` and `<kb-card>` (`clicked`), `<kb-input>` (`changed`) and `<kb-form>` (`submitted`/`resetted`) already followed the convention and are unchanged. `<kb-fetch>`'s pair describes the outcome of the operation, so it reads correctly for `get`, `post`, `put` and `delete` alike
- All three form controls now publish the same `changed` event, so an Echo arc written for one field works for any of them — `<kb-input>` is no longer the odd one out
- `<kb-validity>` listens for `changed` instead of both `change` and `changed`; the second name became dead code once every control converged

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
