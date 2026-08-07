# Packages

kuba is one package with subpath exports. Importing `@t2e1/kuba` registers every
custom element; importing a subpath gives you the primitives without registering
anything.

| Import | Contains |
|---|---|
| `@t2e1/kuba` | Every custom element, registered on import. |
| [`@t2e1/kuba/directive`](/reference/directive) | Lifecycle decorators: `define`, `connected`, `disconnected`, `adopted`, `attributeChanged`, `formAssociated`, `formDisabled`, `formReset`, `formStateRestore`, `execute`. |
| [`@t2e1/kuba/dom`](/reference/dom) | Rendering: `paint`, `repaint`, `retouch`, `html`, `css`, and the paint lifecycle symbols. |
| [`@t2e1/kuba/mixin`](/reference/mixin) | Attribute mixins: `Headless`, `Height`, `Hidden`, `Template`, `Value`, `Width`. |
| [`@t2e1/kuba/echo`](/reference/echo) | The `Echo` host mixin and the `dispatchEvent` decorator. |
| [`@t2e1/kuba/event`](/reference/event) | The `on` listener proxy and its filters: `value`, `files`, `formData`, `dataset`, `detail`, `prevent`, `stop`, `customEvent`. |
| `@t2e1/kuba/middleware` | `before`, `after`, `around` — see [Decorators](/learn/decorators). |
| [`@t2e1/kuba/spark`](/reference/spark) | The operator registry used by Echo arc filters. |
| [`@t2e1/kuba/http`](/reference/http) | A `fetch` wrapper returning a result object instead of throwing. |
| `@t2e1/kuba/result` | The result type used by `http`. |
| [`@t2e1/kuba/router`](/reference/router) | Route registration, `params`, `args`, `urlFor` and the `pushstate` event. |
| `@t2e1/kuba/interpolate` | `{path}` placeholder interpolation for templates. |
| `@t2e1/kuba/cookie` | Cookie read/write helpers. |
| `@t2e1/kuba/renderer` | The rendering entry used by `paint`. |
| `@t2e1/kuba/polyfill` | The `setImmediate` shim that batches repaints. |

!> **`@t2e1/kuba/pixel` is declared but not published.** The export map points at
`packages/pixel/index.css`, which the package's `files` list excludes, so the
import fails from npm and from a CDN. The same tokens ship in `dist/kuba.css` —
use that until the export is fixed.

## Design tokens

Every component default resolves against a token in `dist/kuba.css`. Override a
token and every component that uses it follows. The
**[Design tokens](/foundations/tokens/)** pages render each scale live, one page
per group; the summary is below.

| Group | Scale |
|---|---|
| `--color-*` | `primary`, `master`, `success`, `warning`, `danger`, `info`, `complete`, `menu`, each with `-light`/`-lighter`/`-dark`/`-darker` steps, plus `pure-white` and `pure-black`. |
| `--spacing-*` | `quarck` (4px) → `giant` (200px). |
| `--spacing_inset-*` | `quarck` (4px) → `giant` (56px), for padding inside a surface. |
| `--font-size-*` | `xxxs` (12px) → `giant` (96px). |
| `--font-weight-*` | `regular` (400), `medium` (500), `bold` (700). |
| `--line-height-*` | `default` (100%) → `xxl` (200%). |
| `--border-radius-*` | `none`, `sm` (8px), `md` (16px), `lg` (24px), `pill`, `circular`. |
| `--border-width-*` | `none`, `hairline`, `thin`, `thick`, `heavy`. |
| `--font-family-*` | `base`, `highlight`. |
| `--opacity-*`, `--shadow-*` | Elevation and transparency steps. |

## Element type declarations

Types are hand-written, one `types.d.ts` per element, shipped in the package.
Each registers its tag in `HTMLElementTagNameMap`, so `querySelector` returns the
right type with no extra configuration:

```ts
const input = document.querySelector('kb-input') // KUBAInputElement
input.value = 'ada@example.com'
```
