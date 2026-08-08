# Paquetes

kuba es un solo paquete con exports por subruta. Importar `@t2e1/kuba` registra
todos los custom elements; importar una subruta entrega las primitivas sin
registrar nada.

| Import | Contiene |
|---|---|
| `@t2e1/kuba` | Todos los custom elements, registrados al importar. |
| [`@t2e1/kuba/directive`](/es/build-elements/directive) | Decorators de ciclo de vida: `define`, `connected`, `disconnected`, `adopted`, `attributeChanged`, `formAssociated`, `formDisabled`, `formReset`, `formStateRestore`, `execute`. |
| [`@t2e1/kuba/dom`](/es/build-elements/dom) | Renderizado: `paint`, `repaint`, `retouch`, `html`, `css`, y los símbolos del ciclo de paint. |
| [`@t2e1/kuba/mixin`](/es/build-elements/mixin) | Mixins de atributo: `Headless`, `Height`, `Hidden`, `Template`, `Value`, `Width`. |
| [`@t2e1/kuba/echo`](/es/build-elements/echo) | El mixin host `Echo` y el decorator `dispatchEvent`. |
| [`@t2e1/kuba/event`](/es/build-elements/event) | El proxy de listener `on` y sus filtros: `value`, `files`, `formData`, `dataset`, `detail`, `prevent`, `stop`, `customEvent`. |
| `@t2e1/kuba/middleware` | `before`, `after`, `around` — mira [Decorators](/es/build-elements/decorators). |
| [`@t2e1/kuba/spark`](/es/build-elements/spark) | El registro de operadores que usan los filtros de arco de Echo. |
| [`@t2e1/kuba/http`](/es/build-elements/http) | Un wrapper de `fetch` que devuelve un objeto de resultado en lugar de lanzar. |
| `@t2e1/kuba/result` | El tipo de resultado que usa `http`. |
| [`@t2e1/kuba/router`](/es/build-elements/router) | Registro de rutas, `params`, `args`, `urlFor` y el evento `pushstate`. |
| `@t2e1/kuba/interpolate` | Interpolación de placeholders `{path}` para plantillas. |
| `@t2e1/kuba/cookie` | Helpers de lectura/escritura de cookies. |
| `@t2e1/kuba/renderer` | La entrada de renderizado que usa `paint`. |
| `@t2e1/kuba/polyfill` | El shim de `setImmediate` que agrupa los repaints. |

!> **`@t2e1/kuba/pixel` está declarado pero no publicado.** El mapa de exports
apunta a `packages/pixel/index.css`, que la lista `files` del paquete excluye,
así que la importación falla desde npm y desde un CDN. Los mismos tokens se
entregan en `dist/kuba.css` — usa ese hasta que el export se corrija.

## Design tokens

Cada valor por defecto de un componente resuelve contra un token en
`dist/kuba.css`. Sobrescribe un token y todo componente que lo use sigue el
cambio. Las páginas de **[Design tokens](/es/foundations/tokens/)** renderizan
cada escala en vivo, una página por grupo; el resumen está abajo.

| Grupo | Escala |
|---|---|
| `--color-*` | `primary`, `master`, `success`, `warning`, `danger`, `info`, `complete`, `menu`, cada uno con pasos `-light`/`-lighter`/`-dark`/`-darker`, más `pure-white` y `pure-black`. |
| `--spacing-*` | `quarck` (4px) → `giant` (200px). |
| `--spacing_inset-*` | `quarck` (4px) → `giant` (56px), para el padding dentro de una superficie. |
| `--font-size-*` | `xxxs` (12px) → `giant` (96px). |
| `--font-weight-*` | `regular` (400), `medium` (500), `bold` (700). |
| `--line-height-*` | `default` (100%) → `xxl` (200%). |
| `--border-radius-*` | `none`, `sm` (8px), `md` (16px), `lg` (24px), `pill`, `circular`. |
| `--border-width-*` | `none`, `hairline`, `thin`, `thick`, `heavy`. |
| `--font-family-*` | `base`, `highlight`. |
| `--opacity-*`, `--shadow-*` | Pasos de elevación y transparencia. |

## Declaraciones de tipo de los elementos

Los tipos se escriben a mano, un `types.d.ts` por elemento, entregados en el
paquete. Cada uno registra su etiqueta en `HTMLElementTagNameMap`, así que
`querySelector` devuelve el tipo correcto sin configuración extra:

```ts
const input = document.querySelector('kb-input') // KUBAInputElement
input.value = 'ada@example.com'
```
