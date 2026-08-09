# Pacotes

kuba é um pacote só, com exports por subcaminho. Importar `@t2e1/kuba` registra
todos os custom elements; importar um subcaminho entrega as primitivas sem
registrar nada.

| Import | Contém |
|---|---|
| `@t2e1/kuba` | Todos os custom elements, registrados na importação. |
| [`@t2e1/kuba/directive`](/pt-br/build-elements/directive) | Decorators de ciclo de vida: `define`, `connected`, `disconnected`, `adopted`, `attributeChanged`, `formAssociated`, `formDisabled`, `formReset`, `formStateRestore`, `execute`. |
| [`@t2e1/kuba/dom`](/pt-br/build-elements/dom) | Renderização: `paint`, `repaint`, `retouch`, `html`, `css`, e os símbolos do ciclo de paint. |
| [`@t2e1/kuba/mixin`](/pt-br/build-elements/mixin) | Mixins de atributo: `Headless`, `Height`, `Hidden`, `Identity`, `Template`, `Value`, `Width`. |
| [`@t2e1/kuba/echo`](/pt-br/build-elements/echo) | O mixin host `Echo` e o decorator `dispatchEvent`. |
| [`@t2e1/kuba/event`](/pt-br/build-elements/event) | O proxy de listener `on` e seus filtros: `value`, `files`, `formData`, `dataset`, `detail`, `prevent`, `stop`, `customEvent`. |
| `@t2e1/kuba/middleware` | `before`, `after`, `around` — veja [Decorators](/pt-br/build-elements/decorators). |
| [`@t2e1/kuba/spark`](/pt-br/build-elements/spark) | O registro de operadores usado pelos filtros de arco do Echo. |
| [`@t2e1/kuba/http`](/pt-br/build-elements/http) | Um wrapper de `fetch` que devolve um objeto de resultado em vez de lançar erro. |
| `@t2e1/kuba/result` | O tipo de resultado usado pelo `http`. |
| [`@t2e1/kuba/router`](/pt-br/build-elements/router) | Registro de rotas, `params`, `args`, `urlFor` e o evento `pushstate`. |
| `@t2e1/kuba/interpolate` | Interpolação de placeholders `{path}` para templates. |
| `@t2e1/kuba/cookie` | Helpers de leitura/escrita de cookie. |
| `@t2e1/kuba/renderer` | A entrada de renderização usada pelo `paint`. |
| `@t2e1/kuba/polyfill` | O shim de `setImmediate` que agrupa repaints. |

!> **`@t2e1/kuba/pixel` está declarado mas não é publicado.** O mapa de exports
aponta para `packages/pixel/index.css`, que a lista `files` do pacote exclui,
então a importação falha vindo do npm e de um CDN. Os mesmos tokens são
entregues em `dist/kuba.css` — use esse até o export ser corrigido.

## Design tokens

Todo valor padrão de componente resolve contra um token em `dist/kuba.css`.
Sobrescreva um token e todo componente que o usa acompanha. As páginas de
**[Design tokens](/pt-br/foundations/tokens/)** renderizam cada escala ao vivo,
uma página por grupo; o resumo está abaixo.

| Grupo | Escala |
|---|---|
| `--color-*` | `primary`, `master`, `success`, `warning`, `danger`, `info`, `complete`, `menu`, cada um com passos `-light`/`-lighter`/`-dark`/`-darker`, mais `pure-white` e `pure-black`. |
| `--spacing-*` | `quarck` (4px) → `giant` (200px). |
| `--spacing_inset-*` | `quarck` (4px) → `giant` (56px), para padding dentro de uma superfície. |
| `--font-size-*` | `xxxs` (12px) → `giant` (96px). |
| `--font-weight-*` | `regular` (400), `medium` (500), `bold` (700). |
| `--line-height-*` | `default` (100%) → `xxl` (200%). |
| `--border-radius-*` | `none`, `sm` (8px), `md` (16px), `lg` (24px), `pill`, `circular`. |
| `--border-width-*` | `none`, `hairline`, `thin`, `thick`, `heavy`. |
| `--font-family-*` | `base`, `highlight`. |
| `--opacity-*`, `--shadow-*` | Passos de elevação e transparência. |

## Declarações de tipo dos elementos

Os tipos são escritos à mão, um `types.d.ts` por elemento, entregues no pacote.
Cada um registra sua tag em `HTMLElementTagNameMap`, então o `querySelector`
devolve o tipo certo sem configuração extra:

```ts
const input = document.querySelector('kb-input') // KUBAInputElement
input.value = 'ada@example.com'
```
