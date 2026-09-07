# DESIGN — `kb-textarea`

**Pacote**: `src/form/textarea/`
**Tag**: `<kb-textarea>`
**Status**: documentação retroativa — a implementação precede este documento
**Data**: 2026-09-07

---

Este documento segue o framework LLD (5 passos) e registra o comportamento de `kb-textarea`
tal como implementado. Ele é a fonte da verdade: quando a implementação divergir dele, é a
implementação que está errada, não o inverso. Mudança de comportamento passa primeiro por
uma revisão deste documento, depois pelo código — nunca o contrário.

O pacote foi escrito antes de qualquer processo formal de design neste repositório e nunca
teve especificação própria.

## `kb-textarea` é `kb-input` para multi-linha — de propósito

`textarea/textarea.ts` e `input/input.ts` compartilham cadeia de mixins
(`Echo(Hidden(Width(HTMLElement)))`, `textarea.ts:29` / `input.ts:28`), `element.js`
(um `Proxy` idêntico salvo o seletor `textarea`/`input`), e cinco dos seis Symbols
(`change`, `disableable`, `dispatch`, `reflectable`, `reportable`, `validatable` —
`textarea/interfaces.js` acrescenta `resize`). **Isso não é duplicação a corrigir.** Os dois
foram desenhados como o mesmo padrão — controle form-associated que embrulha um elemento
nativo e espelha validade — aplicado a `<input>` e a `<textarea>`. Este documento descreve
só o que `kb-textarea` faz **a mais** ou **diferente**; para o núcleo compartilhado,
`src/form/input/DESIGN.md` é a referência.

O que `kb-textarea` tem de próprio:

1. **Auto-resize.** `[resize]` (`@on.input('textarea')`, `textarea.ts:174-179`) zera a
   altura e a redefine para `scrollHeight` a cada digitação — o campo cresce com o conteúdo.
2. **Superfície de attributes menor.** Sem `type`, `inputmode`, `max`, `min`, `maxlength`,
   `minlength`, `pattern`, `step` — não fazem sentido para texto livre. Restam `disabled`,
   `id`, `name`, `placeholder`, `readonly`, `required`, `value` (`textarea.ts:38-125`).
3. **`min-height` em vez de `height` fixa** (`textarea/style.js:29`), com `resize: none` e
   `overflow: hidden` (`style.js:35`, `:30`) porque a altura é controlada pelo `[resize]`.

O que ele **não** é: um editor rico (é `<textarea>` nativo — sem markdown, sem toolbar); um
campo de altura fixa com scroll interno (a altura acompanha o conteúdo por desenho); nem um
`<input>` de uma linha (isso é `kb-input`).

---

## 1. Requisitos

| Pergunta (LLD passo 1) | Resposta |
|---|---|
| Quem consome, em que contexto | Autor de markup montando formulário com um campo de texto longo (bio, comentário, mensagem); filho de `<form>`/`<kb-form>` |
| Somente leitura ou interativo | Interativo — digitação, `changed`, validação do form, e auto-resize |
| Caso de uso mínimo (MVP) | `<label>` + `<textarea>` + slots `helper`/`validity`; encaminhar `name`/`value`/`placeholder`; espelhar validade; crescer com o conteúdo |
| Participa de `<form>` | Sim — `static formAssociated = true` (`textarea.ts:131`); `[reportable]` injeta `name`→`value` no `FormData` (`textarea.ts:199-207`) |
| Papel e nome acessível | O `<textarea>` nativo carrega o papel `textbox` (multiline); nome via `<label for>` no shadow (`textarea/component.js:4-6`). Host sem `Identity` — mesma análise de `src/form/input/DESIGN.md` seção 3 |
| Superfície de variação | 7 attributes (`disabled`, `id`, `name`, `placeholder`, `readonly`, `required`, `value`), `hidden`/`width` de mixin, `on` de `Echo`, custom properties `--textarea-*` |
| Sub-elemento interno | `<label>` + `<textarea>` + `<slot name="helper">` + `<slot name="validity">` |

**Requisitos funcionais** (os que diferem de `kb-input`)

1. Renderiza `<textarea ...>${textarea.value}</textarea>` — o valor entra **como conteúdo do
   nó**, não como attribute `value` (`textarea/component.js:14`), além do attribute quando
   truthy.
2. `[resize](event)` (`@on.input('textarea')`, `textarea.ts:174-179`): `style height=auto`
   depois `style height=${scrollHeight}px` no `event.target`.
3. `min-height: var(--textarea-size-min-height, 128px)`; `height: auto`; `overflow: hidden`;
   `resize: none` (`textarea/style.js:27-35`).
4. Todo o resto — `[change]`, `[dispatch]`, `[reflectable]`, `[validatable]`,
   `[disableable]`, `[reportable]`, `reset()`, `remove()` — é idêntico a `kb-input`
   (`textarea.ts:140-215`).

**Não-requisitos (YAGNI, rule 023)**

- Attributes de `<input>` sem sentido para texto livre (`type`, `pattern`, `min`/`max`,
  `step`, `inputmode`, `maxlength`/`minlength`). Se um limite de caracteres virar requisito
  real, `maxlength` entra — não antes.
- `rows`/`cols` — a altura é o `[resize]`, a largura é o mixin `Width`. Expor `rows` seria
  um terceiro controle de altura conflitante.
- Handle de resize manual — `resize: none` é deliberado; o campo se dimensiona sozinho.
- `Identity`/`role` no host — o `<textarea>` interno já é o `textbox` e é o alvo do foco.

---

## 2. Contrato Público

### Attributes / Properties

Todos `@attributeChanged(...)` gravando no `Proxy` `element` (`textarea/element.js`).

| Nome | Tipo | Default | Especificação |
|---|---|---|---|
| `disabled` | `boolean` | `false` | `@around(disableable)` → `:state(disabled)` (`textarea.ts:42-46`) |
| `id` | `string` | — | Encaminhado; getter cai em `this.name` se vazio (`textarea.ts:56-63`) |
| `name` | `string` | `''` | Chave no `FormData` (`textarea.ts:69-76`) |
| `placeholder` | `string` | — | `textarea.ts:78-85` |
| `readonly` | `boolean` | `false` | `textarea.ts:87-94` |
| `required` | `boolean` | `false` | `@around(validatable)` + `@around(reflectable)` (`textarea.ts:96-105`) |
| `value` | `string` | — | `@around(reflectable, validatable, dispatch)` (`textarea.ts:119-125`) |
| `hidden` | `boolean` | `false` | Herdado de `Hidden` → `:state(hidden)`. Publicado em `types.d.ts` |
| `width` | size string | `'auto'` | Herdado de `Width` → interpolado no `:host` (`textarea/style.js:11`). Publicado em `types.d.ts` como `KUBATextareaWidthAttribute \| (string & {})` |
| `on` | arc string | — | Herdado de `Echo`. Publicado em `types.d.ts` como `on: KUBATextareaOnAttribute \| (string & {})` — template literal type da forma do arco, com fallback para `string` livre |

**Readonly no runtime**: `controller`, `form`, `internals`, `validationMessage`, `validity`,
`willValidate` (`textarea.ts:34-129`). **`types.d.ts` publica só `form`,
`validationMessage`, `validity`, `willValidate`** — `controller` e `internals` são getters
internos lazy, fora do contrato (padrão `button`/`main`).

**Métodos**: `checkValidity()` (`textarea.ts:146-148`), `reportValidity()`
(`textarea.ts:169-171`), `reset()` (`textarea.ts:181-189`), `remove()` → aborta o
`controller` e devolve `this` (`@disconnected`, `textarea.ts:162-167`), publicado em
`types.d.ts`.

**Rule 037**: `disabled`/`readonly`/`required` são estado do controle nativo, não flags de
método. Nenhum método recebe boolean.

### Events

| Evento | Dispara quando | `detail` |
|---|---|---|
| `changed` | o setter de `value` roda (`textarea.ts:157-159`) | `this.value` |
| `reset` | `reset()` (`textarea.ts:187`) | nenhum |

`changed` é `customEvent` (bubbles/cancelable), ecoado por `Echo`. `invalid` do
`<textarea>` interno é capturado por `[validatable]` com `@on.invalid('*', prevent)`
(`textarea.ts:191`) e **não** re-despachado.

### Slots

| Slot | Conteúdo | Observação |
|---|---|---|
| `label` | `<kb-label>` / `<span slot="label">` | Dentro do `<label for>` do shadow |
| `helper` | `<kb-helper>` / texto | **Escondido em `:state(invalid)`** (`textarea/style.js:81-83`) |
| `validity` | `<kb-validity>` | Um por chave de `ValidityState` |

### Parts

Nenhum. Re-estilização só por custom property.

### Custom properties de CSS

| Custom property | Fallback | Controla |
|---|---|---|
| `--textarea-space-gap` | `var(--spacing-nano)` | `gap` label/textarea/slots (`style.js:10`) |
| `--textarea-color-background` | `var(--color-master-lightest)` | Fundo |
| `--textarea-color-border` | `var(--color-master-light)` | Borda (normal e disabled) |
| `--textarea-border-radius` | `var(--border-radius-sm)` | Raio |
| `--textarea-color-text` | **`var(--color-master-darkest)`** | Texto — diverge de `--input-color-text` (`--color-master-dark`); ver auditoria |
| `--textarea-font-family` | `var(--font-family-base)` | Família |
| `--textarea-font-size` | `var(--font-size-xxs)` | Tamanho (14px) |
| `--textarea-line-height` | `var(--line-height-lg)` | Entrelinha (150%) — **exposto**, ao contrário de `kb-input` |
| `--textarea-size-min-height` | **`128px`** (literal) | Altura mínima antes de o conteúdo crescer |
| `--textarea-space-inset` | `var(--spacing_inset-nano) var(--spacing_inset-xs)` | Padding interno |
| `--textarea-color-focus` | `var(--color-primary)` | Borda no `:focus` |
| `--textarea-color-background_disabled` | `var(--color-master-lighter)` | Fundo desabilitado/readonly |
| `--textarea-color-text_disabled` | `var(--color-master)` | Texto desabilitado |
| `--textarea-color-placeholder` | `var(--color-master)` | Placeholder |
| `--textarea-color-invalid` | `var(--color-danger)` | Borda em `:state(invalid)` |

**Não expostos**: `border-width-hairline` (`style.js:19`), `--font-weight-regular`
(`style.js:26`). `height`/`overflow`/`resize` são estruturais, não temáticos.

---

## 3. Composição

**Cadeia**: `Echo(Hidden(Width(HTMLElement)))` (`textarea/textarea.ts:29`) — **idêntica** a
`kb-input`. Os papéis de `Width`, `Hidden` e `Echo` são os mesmos de
`src/form/input/DESIGN.md` seção 3.

**`formAssociated`**: `static get formAssociated() { return true }` (`textarea.ts:131-133`).

**`attachInternals()`**: lazy via `??=` (`textarea.ts:65-67`). Consumido por `Hidden`,
`[disableable]`, `[validatable]`, `[reflectable]`, `form`, `validationMessage`, `validity`,
`willValidate`, `checkValidity`, `reportValidity`. **Não é publicado em `types.d.ts`** — o
consumidor interage pela superfície da Constraint Validation API, não pelo `internals` cru.
Padrão `button`/`main` (`src/layout/main/DESIGN.md:87-90`).

**Symbols privados** (`textarea/interfaces.js`): `change`, `disableable`, `dispatch`,
`reflectable`, `reportable`, `resize`, `validatable` — sete `Symbol('...')` **locais**
(`interfaces.js:1-7`). **`resize` é o único que `kb-input` não tem** (`input/interfaces.js`
tem seis). É a chave do método de auto-resize (`textarea.ts:175`), referenciado só dentro
de `textarea.ts` → `Symbol()`, não `Symbol.for()`.

**`element.js`**: `Proxy` sobre `{}` roteando para o host antes do paint e para
`shadowRoot.querySelector('textarea')` depois (`textarea/element.js:11-35`). `style`,
`value`, `validationMessage`, `validity` como propriedade; o resto como attribute.
Estrutura byte-a-byte igual a `input/element.js` trocando `input`→`textarea` — parte do
paralelismo deliberado.

**Foco**: `attachShadow({ mode: 'open', delegatesFocus: true })` (`textarea.ts:135-137`).
Necessário para o foco no host alcançar o `<textarea>` interno.

**`role`/`Identity`**: ausência pela mesma razão de `kb-input` — o `<textarea>` interno
carrega o papel e recebe o foco delegado. A ressalva de nome acessível (Edge case 3 de
`kb-input`) vale igual aqui.

---

## 4. Gestão de Estado

| Dado | Onde mora | Controlado? | Sincronização |
|---|---|---|---|
| Attributes nativos (`name`, `value`, `placeholder`, …) | Antes do paint: `target` do `Proxy`; depois: `<textarea>` interno | Controlado — DOM é a fonte da verdade | `@attributeChanged` → setter → `Proxy.set` |
| `value` | `<textarea>.value` (prop, após paint) | Controlado, mutável pelo usuário | `[change]` reescreve a cada `input`; setter roda `reflectable`/`validatable`/`dispatch` |
| **altura** | `event.target.style` — `height` inline no `<textarea>` | Derivado do conteúdo | `[resize]` a cada `input`: `auto` → `scrollHeight`px. **Não é reavaliado no `reset()`** — ver Edge case 4 |
| `:state(invalid)` / `:state(disabled)` / `:state(hidden)` | `internals.states` | Derivado / controlado | `[validatable]` / `[disableable]` / mixin `Hidden` |
| `internals` validity/message | `internals.setValidity(...)` | Derivado do `<textarea>` interno | `[reflectable]` em `@didPaint` e nos `@around` |
| `controller` | `#controller` (`AbortController`, lazy) | Interno | Abortado em `remove()` |

**Estado observável** (`internals.states`): `hidden`, `invalid`, `disabled` — os mesmos de
`kb-input`. `resize` não produz estado observável; escreve `style` inline.

---

## 5. Edge Cases

| # | Caso | Comportamento requerido |
|---|---|---|
| 1 | `value` com quebras de linha | Renderizado como conteúdo do `<textarea>` (`textarea/component.js:14`); `[resize]` ajusta a altura para caber |
| 2 | Colar um bloco grande de texto | O evento `input` dispara `[resize]` uma vez → altura salta para o `scrollHeight` do conteúdo colado. Sem limite superior — o campo pode ficar muito alto; não há `max-height` em `style.js` |
| 3 | `<kb-textarea>` com label mas sem `id`/`name` | `textarea.id` = `''` (`textarea.ts:58`); `<label for="">` não associa; `<textarea>` fica sem nome acessível. Mesma lacuna de `src/form/input/DESIGN.md` Edge case 3 — a correção deve ser a mesma nos dois |
| 4 | `reset()` depois de o campo ter crescido | `value` volta a `''`, `invalid` limpo, `reset` despachado (`textarea.ts:181-189`), **mas a `height` inline setada por `[resize]` permanece** — o campo continua alto e vazio até a próxima digitação. Bug candidato: `reset()` deveria limpar `element.style.height`. Registrar para `tester` → `developer` |
| 5 | `min-height` maior que o conteúdo | `min-height: 128px` vence; o campo nunca encolhe abaixo disso mesmo com uma linha só |
| 6 | Campo `required` vazio | `[validatable]` adiciona `'invalid'` → borda `--textarea-color-invalid`, helper some, `kb-validity state="valueMissing"` aparece. `textarea.test.js:19` prova `willValidate` |
| 7 | `disabled` | `willValidate` vira `false` (`textarea.test.js:28`); o valor não entra no `FormData` (`textarea.ts:202`, `!this.disabled`) |
| 8 | Auto-resize sem `scrollHeight` confiável (campo `display:none` no momento do input) | `scrollHeight` pode ler `0`; a altura colapsa. Caso raro — input em elemento oculto — sem guarda |
| 9 | Alvo de toque | `min-height` 128px » 44px — folgado. O único risco de alvo pequeno é o `kb-input`, não este |
| 10 | Contraste | Texto `--color-master-darkest` (#0a0a0a) sobre `#fafafa` ≈ 19:1 — passa com folga. É mais escuro que o `--color-master-dark` de `kb-input`; ver auditoria |
| 11 | `prefers-reduced-motion` | Sem `transition` de movimento (só o truque anti-autofill em `style.js:67`); o auto-resize é instantâneo, não animado — nada a fazer |
| 12 | Leitor de tela ao crescer | A mudança de altura não é anunciada e não precisa ser. A mudança de validade tem a mesma lacuna de anúncio de `kb-input` (o `kb-validity` sem `role="alert"`) |

Coberto por teste: `textarea/textarea.test.js` — "dispatches changed with the typed value",
"willValidate reports that the field takes part in validation", "willValidate is false while
the field is disabled", "grows to fit its content".

---

## Auditoria de tokens (designer)

`kb-textarea` nunca passou por revisão formal do `designer`. Achados:

1. **`--textarea-size-min-height` default `128px` é literal (`textarea/style.js:29`), sem
   token global equivalente.** Mesma lacuna estrutural do `40px` de `kb-input`:
   `packages/pixel/tokens/` não tem escala de tamanho de controle. `128px` não deriva
   de nenhuma escala existente (o mais próximo é `--spacing-xxxl` = 120px, semântica
   errada). **Recomendação ao `designer`**: se for criado `--size-control-*`, o mínimo de
   textarea seria `--size-control-xl` ou similar (~4× o `--size-control-md` do input). Até
   lá, `128px` fica como fallback e a dívida fica aqui.
2. **`--textarea-color-text` (`--color-master-darkest`) diverge de `--input-color-text`
   (`--color-master-dark`).** Mesmo papel — cor do texto digitado — dois tokens diferentes
   (`textarea/style.js:23` vs `input/style.js:19`). `label`/`helper` usam
   `--color-master-dark`. `kb-textarea` é o outlier. O `designer` decide o token único e
   alinha o par deliberadamente paralelo.
3. **`--textarea-line-height` é exposto; `--input` não expõe entrelinha.** `textarea/style.js:28`
   tem `var(--textarea-line-height, var(--line-height-lg))`; `input/style.js:24` fixa
   `var(--line-height-default)` sem custom property. Além do valor divergir (150% vs 100%),
   a *superfície* diverge. Para o par ser de fato simétrico, ou os dois expõem
   `--*-line-height` ou nenhum. Recomendo expor nos dois.
4. **`--textarea-space-gap` → `--spacing-nano`** (`style.js:10`) — mesma inconsistência
   `spacing-*` vs `spacing_inset-*` de `kb-input` e a mesma divergência com
   `src/component/button/style.js:21` (`--spacing_inset-nano`). Uniformizar junto.
5. **Peso não re-estilizável** — `--font-weight-regular` fixo em `style.js:26`, sem
   `--textarea-font-weight`. Igual a `kb-input`.
6. **Escala de tipografia — confere.** `--font-size-xxs` (14px), `--font-weight-regular`
   (400), `--line-height-lg` (150%, `packages/pixel/tokens/lineHeight.css:8`),
   `--font-family-base` — todos existem e batem com `src/typography/`.

**Resumo do par input/textarea**: as divergências (2), (3), (4), (5) são todas do mesmo
tipo — o paralelismo é deliberado no *comportamento* mas não foi mantido nos *tokens*. O
`designer` deve tratar os dois `style.js` como um par e igualar: token de cor de texto,
superfície de custom properties de tipografia, e escala de `gap`.

---

## Divisão de trabalho entre ofícios

| Área | Ofício responsável | Status |
|---|---|---|
| Cadeia de mixins, `formAssociated`, `element.js`, Symbol `resize`, paralelismo com `input` | `architect` | Concluído — paralelismo consciente, não corrigir |
| Escala de tamanho de controle para `--textarea-size-min-height` (`128px`) | `designer` | **Pendente** — mesma lacuna do `40px` de `input` |
| Igualar tokens do par input/textarea: cor de texto, tipografia exposta, escala de `gap` | `designer` | **Pendente** |
| `reset()` não limpa a `height` inline do auto-resize (Edge case 4) | `tester` → `developer` | **Aberto** — provar com teste antes de mexer |
| `<label for>` sem alvo quando `id`/`name` ausentes (Edge case 3) — mesma correção de `input` | `designer` → `developer` | **Aberto** |
| `on`/`width`/`hidden`/`remove()` no `types.d.ts`; remover `internals` e `controller` do contrato | `developer` | **Concluído (neste diff)** |
| Prova de `changed`, `willValidate`, auto-resize | `tester` | Concluído — `textarea.test.js` |
| Página de `website/docs/components/textarea.mdx` e traduções | `writer` | — |

---

**Criado em**: 2026-09-07
**Atualizado em**: 2026-09-07
**Versão**: 1.0
