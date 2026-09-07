# DESIGN — `kb-input`

**Pacote**: `src/form/input/`
**Tag**: `<kb-input>`
**Status**: documentação retroativa — a implementação precede este documento
**Data**: 2026-09-07

---

Este documento segue o framework LLD (5 passos) e registra o comportamento de `kb-input`
tal como implementado. Ele é a fonte da verdade: quando a implementação divergir dele, é a
implementação que está errada, não o inverso. Mudança de comportamento passa primeiro por
uma revisão deste documento, depois pelo código — nunca o contrário.

O pacote foi escrito antes de qualquer processo formal de design neste repositório e nunca
teve especificação própria.

`kb-input` e `kb-textarea` são deliberadamente paralelos — mesma cadeia de mixins, mesmo
`element.js` (um `Proxy`), mesmos Symbols menos um. A semelhança **não** é duplicação a
corrigir: os dois foram pensados como o mesmo padrão aplicado a `<input>` e `<textarea>`.
`src/form/textarea/DESIGN.md` registra o outro lado.

## Visão Geral

`kb-input` é um **controle de texto form-associated** (`input/input.ts:202-204`,
`static formAssociated = true`) que embrulha um `<input>` nativo no shadow root
(`input/component.js:7-23`) e:

1. **Delega** quase todo attribute/propriedade nativa ao `<input>` interno através de um
   `Proxy` (`input/element.js`) que escreve no host antes do primeiro paint e no `<input>`
   depois — para que valores setados cedo não se percam.
2. **Espelha** a validade nativa do `<input>` para o `ElementInternals` do host
   (`input/input.ts:272-278`, `[reflectable]` decorado com `@didPaint`), de modo que o
   `<form>` dono trate `kb-input` como um controle único na constraint validation.
3. **Publica** `changed` a cada mudança de valor (`input/input.ts:228-231`) e reflete
   `:state(invalid)` / `:state(hidden)` para o CSS.

O que ele **não** é: um `<input>` de todos os tipos com UI custom (sem date-picker, sem
combobox — é o `<input>` nativo por baixo, com os tipos que ele suporta); um campo com
mensagem de erro embutida (a mensagem é slot — `kb-validity` no `slot="validity"`); nem um
grupo de campos (um `kb-input` = um valor nomeado).

---

## 1. Requisitos

| Pergunta (LLD passo 1) | Resposta |
|---|---|
| Quem consome, em que contexto | Autor de markup montando um formulário; filho de `<form>` ou de `<kb-form>`, com `<kb-label>` / `<kb-helper>` / `<kb-validity>` projetados nos slots |
| Somente leitura ou interativo | Interativo — recebe digitação, despacha `changed`, participa da validação do form |
| Caso de uso mínimo (MVP) | Renderizar `<label><slot name="label"></label>` + `<input>` + slots `helper`/`validity`; encaminhar `name`/`value`/`type` ao `<input>`; espelhar validade ao host |
| Participa de `<form>` | Sim — `static formAssociated = true` (`input.ts:202`); `[reportable]` registra um listener de `formdata` no form dono para injetar `name`→`value` (`input.ts:262-270`) |
| Papel e nome acessível | O `<input>` nativo interno carrega o papel `textbox`; o nome vem do `<label for>` renderizado no shadow (`input/component.js:4-6`). O host **não** entra com `Identity` — ver seção 3 e a ressalva de acessibilidade |
| Superfície de variação | 15 attributes encaminhados (`disabled`, `id`, `inputmode`, `max`, `maxlength`, `min`, `minlength`, `name`, `pattern`, `placeholder`, `readonly`, `required`, `step`, `type`, `value`), `hidden`/`width` de mixin, `on` de `Echo`, e as custom properties `--input-*` |
| Sub-elemento interno | `<label>` + `<input>` + três `<slot>` (`label`, `helper`, `validity`) no shadow root |

**Requisitos funcionais**

1. Renderiza `<label for="${input.id}"><slot name="label"></label>`, um `<input>` com os
   attributes presentes, e `<slot name="helper">` + `<slot name="validity">`
   (`input/component.js`).
2. Cada setter de attribute (`@attributeChanged(...)`) escreve no `Proxy` `element`
   (`input.ts:41-196`), que grava no host ou no `<input>` conforme `isPainted`
   (`input/element.js:11-35`).
3. `@on.input('input', value) [change](val)` seta `this.value = val` a cada tecla
   (`input.ts:211-215`).
4. O setter de `value` roda, via `@around`, `[reflectable]` → `[validatable]` →
   `[dispatch]` (`input.ts:190-196`): espelha validade, reflete `:state(invalid)`,
   despacha `changed`.
5. `[reflectable]` (`@didPaint`, `input.ts:272-278`) copia `element.validity` e
   `element.validationMessage` para `internals.setValidity(...)`.
6. `[validatable]` (`@on.invalid('*', prevent)`, `input.ts:254-260`) adiciona/remove
   `'invalid'` de `internals.states` conforme `this.validity.valid`.
7. `[disableable]` (`@around` no setter de `disabled`, `input.ts:221-226`)
   adiciona/remove `'disabled'` de `internals.states`.
8. `[reportable]` (`@formAssociated`, `input.ts:262-270`) adiciona um listener `formdata`
   no form que faz `event.formData.set(this.name, this.value)` quando não desabilitado.
9. `reset()` (`@formReset`, `input.ts:244-252`): limpa `element.value`, remove o attribute
   `value`, remove `'invalid'` de `internals.states`, despacha `Event('reset')`.
10. `remove()` (`@disconnected`, `input.ts:233-238`) aborta `this.controller`,
    desregistrando o listener de `formdata`.
11. Estados visuais: `:state(hidden) { display: none }`; `:state(invalid)` pinta a borda de
    `--input-color-invalid` e **esconde `slot[name='helper']`** (`input/style.js:65-77`).

**Não-requisitos (YAGNI, rule 023)**

- Tipos com UI própria (date, color, range com trilha custom) — é o `<input>` nativo; o que
  o navegador não faz, `kb-input` não faz.
- Mensagem de erro embutida — o texto de erro é `kb-validity` no slot; `kb-input` só
  esconde o helper quando inválido.
- Máscara de entrada, formatação de moeda — fora do escopo; `pattern` é o limite.
- `Identity` / `role` no host — o `<input>` interno já é o `textbox`; ver a ressalva.
- `Height` — a altura é `--input-size-height` (uma linha); um campo multi-linha é
  `kb-textarea`.

---

## 2. Contrato Público

### Attributes / Properties

Todos os setters abaixo são `@attributeChanged(...)` e gravam no `Proxy` `element`
(`input.ts:41-196`). Boolean via `booleanAttribute`.

| Nome | Tipo | Default | Especificação |
|---|---|---|---|
| `disabled` | `boolean` | `false` | `@around(disableable)` reflete `:state(disabled)` (`input.ts:41-45`, `:221-226`) |
| `id` | `string` | — | Encaminhado ao `<input>`; o getter cai em `this.name` se vazio (`input.ts:55-62`) |
| `inputmode` (prop `inputMode`) | `string` | — | `input.ts:64-71` |
| `max`, `maxlength` (`maxLength`), `min`, `minlength` (`minLength`) | `string` | — | Encaminhados (`input.ts:77-111`) |
| `name` | `string` | `''` (getter `?? ''`, `input.ts:113-115`) | Chave no `FormData` do form dono |
| `pattern` | `string` | — | `input.ts:122-129` |
| `placeholder` | `string` | — | `input.ts:131-138` |
| `readonly` | `boolean` | `false` | `input.ts:140-147` |
| `required` | `boolean` | `false` | `@around(validatable)` + `@around(reflectable)` (`input.ts:149-158`) |
| `step` | `string` | — | `input.ts:160-167` |
| `type` | `string` | — (o `<input>` assume `text`) | `input.ts:169-176` |
| `value` | `string` | — | `@around(reflectable, validatable, dispatch)` (`input.ts:186-196`) |
| `hidden` | `boolean` | `false` | Herdado de `Hidden` → `:state(hidden)`. Publicado em `types.d.ts` |
| `width` | size string | `'auto'` | Herdado de `Width` → o `:host` interpola `input.width` (`input/style.js:11`). Publicado em `types.d.ts` como `KUBAInputWidthAttribute \| (string & {})` (`${number}px`/`${number}%`/`hug`/`fill`/`auto`, normalizados pelo filtro `resizing`) |
| `on` | arc string | — | Herdado de `Echo`. Publicado em `types.d.ts` como `on: KUBAInputOnAttribute \| (string & {})` — template literal type da forma do arco, com fallback para `string` livre |

**Propriedades readonly no runtime**: `controller` (`AbortController`), `form`
(`internals.form`), `internals` (`ElementInternals`), `validationMessage`, `validity`,
`willValidate` (`input.ts:33-53`, `:178-200`). Destes, **`types.d.ts` publica só `form`,
`validationMessage`, `validity`, `willValidate`** — a superfície da Constraint Validation
API. `controller` e `internals` são getters internos lazy (consumidos por `remove()`, pelos
mixins e pelo espelhamento de validade), fora do contrato — padrão `button`/`main`.

**Métodos públicos**: `checkValidity()` → `internals.checkValidity()` (`input.ts:217-219`);
`reportValidity()` → `internals.reportValidity()` (`input.ts:240-242`); `reset()` →
limpa e revalida (`input.ts:244-252`); `remove()` → aborta o `controller` e devolve `this`
(`@disconnected`, `input.ts:233-238`), publicado em `types.d.ts`.

**Rule 037 (flag arguments)**: `disabled`/`readonly`/`required` são attributes booleanos de
estado do controle nativo — não são flags de método. Nenhum método público recebe boolean.

### Events

| Evento | Dispara quando | `detail` |
|---|---|---|
| `changed` | o setter de `value` roda (por digitação via `[change]`, ou por atribuição JS) | `this.value` — a string atual (`input.ts:228-230`) |
| `reset` | `reset()` é chamado (por `@formReset` do form dono, ou manualmente) | nenhum — `new Event('reset')` (`input.ts:250`) |

`changed` é `customEvent` → `bubbles`/`cancelable`, e ecoado no barramento por `Echo`.
`reset` é um `Event` simples, não ecoado, sem `detail`.

**`invalid`**: o `<input>` interno emite `invalid` nativo; `[validatable]` o captura com
`@on.invalid('*', prevent)` (`input.ts:254`) — o `prevent` suprime a bolha de erro nativa
do navegador. O evento não é re-despachado no host.

### Slots

| Slot | Conteúdo esperado | Observação |
|---|---|---|
| `label` | `<kb-label>` ou `<span slot="label">` | Projetado dentro do `<label for>` do shadow (`input/component.js:4-6`) |
| `helper` | `<kb-helper>` ou texto auxiliar | **Escondido quando `:state(invalid)`** (`input/style.js:74-76`) |
| `validity` | um ou mais `<kb-validity>` | Cada um mostra-se para a chave de `ValidityState` que observa |

### Parts

Nenhum. O `<input>` interno não é exposto por `::part` — a re-estilização é só por custom
property.

### Custom properties de CSS (pontos de extensão)

| Custom property | Fallback | Controla |
|---|---|---|
| `--input-space-gap` | `var(--spacing-nano)` | `gap` entre label, input e slots (`style.js:10`) |
| `--input-color-background` | `var(--color-master-lightest)` | Fundo do `<input>` |
| `--input-color-border` | `var(--color-master-light)` | Cor da borda (normal e disabled) |
| `--input-border-radius` | `var(--border-radius-sm)` | Raio da borda |
| `--input-color-text` | `var(--color-master-dark)` | Cor do texto digitado |
| `--input-font-family` | `var(--font-family-base)` | Família |
| `--input-font-size` | `var(--font-size-xxs)` | Tamanho (14px) |
| `--input-size-height` | **`40px`** (literal) | Altura do `<input>` — ver auditoria |
| `--input-space-inset` | `var(--spacing_inset-nano) var(--spacing_inset-xs)` | Padding interno |
| `--input-color-focus` | `var(--color-primary)` | Cor da borda no `:focus` |
| `--input-color-background_disabled` | `var(--color-master-lighter)` | Fundo desabilitado/readonly |
| `--input-color-text_disabled` | `var(--color-master)` | Texto desabilitado |
| `--input-color-placeholder` | `var(--color-master)` | Cor do placeholder |
| `--input-color-invalid` | `var(--color-danger)` | Cor da borda em `:state(invalid)` |

**Não expostos (literais/tokens fixos, não re-estilizáveis)**: `border-width-hairline`
(borda), `--font-weight-regular` (peso do texto, `style.js:22`), `--line-height-default`
(entrelinha, `style.js:24`). Ver auditoria.

---

## 3. Composição

**Cadeia**: `Echo(Hidden(Width(HTMLElement)))` (`input/input.ts:28`)

| Mixin | Traz | Por que entra |
|---|---|---|
| `Width` | `width` (attribute + property), re-render só de estilo via `@retouch` (`packages/mixin/width.ts`) | `style.js:11` interpola `input.width` no `:host` — o campo precisa de largura configurável (colunas de formulário) |
| `Hidden` | `hidden` + `:state(hidden)` via `internals.states`, limpeza do attribute | Campo condicional é comum; `:host(:state(hidden)) { display: none }` (`style.js:65`) |
| `Echo` | `on`, `[connectArc]`/`[disconnectArc]`, eco de `dispatchEvent` no barramento | `changed` alcança outros elementos por arco; `<kb-on>` filho torna o campo acionável declarativamente |

**`formAssociated`**: `static get formAssociated() { return true }` (`input.ts:202-204`).
É o que habilita `@formReset` (`input.ts:244`), `@formAssociated` (`input.ts:262`) e o
`internals.form`.

**`attachInternals()`**: lazy via `??=` (`input.ts:73-75`). Usado por: `Hidden`
(`:state(hidden)`), `[disableable]`, `[validatable]`, `[reflectable]` (`setValidity`),
`form`, `validationMessage`, `validity`, `willValidate`, `checkValidity`,
`reportValidity`. **Não é publicado em `types.d.ts`** — o consumidor interage pela
superfície da Constraint Validation API (`checkValidity`, `reportValidity`, `validity`,
`willValidate`, `form`), não pelo `internals` cru. Padrão `button`/`main`
(`src/layout/main/DESIGN.md:87-90`).

**Symbols privados** (`input/interfaces.js`): `change`, `disableable`, `dispatch`,
`reflectable`, `reportable`, `validatable` — seis `Symbol('...')` **locais**
(`interfaces.js:1-6`). Chaves de métodos com decorator (`@on.*`, `@around`, `@didPaint`,
`@formAssociated`), referenciadas só dentro de `input.ts`. Nenhuma atravessa fronteira de
pacote → `Symbol()`, não `Symbol.for()`.

**`element.js` — o `Proxy`**: `Element.from(this)` devolve um `Proxy` sobre `{}` cujo
`get`/`set` roteia para `target[key]` antes do primeiro paint e para
`shadowRoot.querySelector('input')` depois (`input/element.js:11-35`). É o que permite
`el.type = 'email'` antes do connect sem perder o valor. `style`, `value`,
`validationMessage`, `validity` são lidos como **propriedade** do `<input>`; o resto como
**attribute** (`element.js:14-18`).

**Foco**: `attachShadow({ mode: 'open', delegatesFocus: true })` (`input.ts:206-208`).
`delegatesFocus` faz o foco no host cair no `<input>` interno, e `:focus`/`:focus-visible`
no host refletir o estado do `<input>`. É essencial: sem ele, Tab pousaria no host sem
alcançar o campo.

**`role`/`Identity`: ausência a examinar.** Hoje o host não entra com `Identity` e não
publica `role`. O `<input>` nativo interno já tem papel `textbox` e é o alvo do foco
(via `delegatesFocus`), então a árvore de acessibilidade **funciona pelo elemento interno**,
não pelo host — padrão aceitável para um wrapper com `delegatesFocus`. A ressalva real é o
**nome acessível** — ver seção 5, Edge case 3.

---

## 4. Gestão de Estado

| Dado | Onde mora | Controlado? | Sincronização |
|---|---|---|---|
| Cada attribute nativo (`type`, `name`, `value`, …) | Antes do paint: `target` do `Proxy`; depois: attribute/prop do `<input>` interno (`input/element.js`) | Controlado — DOM é a fonte da verdade | `@attributeChanged` → setter → `Proxy.set`. O `<input>` é reconstruído no paint com os valores acumulados (`input/component.js`) |
| `value` | `<input>.value` (prop, após paint) | Controlado, mas mutável pelo usuário | `[change]` reescreve a cada `input`; setter roda `reflectable`/`validatable`/`dispatch` |
| `:state(invalid)` | `internals.states` | Derivado | `[validatable]` conforme `this.validity.valid`, em `@on.invalid` e no `@around` de `value`/`required` |
| `:state(disabled)` | `internals.states` | Derivado | `[disableable]` no `@around` do setter de `disabled` |
| `:state(hidden)` | `internals.states` | Controlado | Mixin `Hidden` |
| `internals` validity/message | `internals.setValidity(...)` | Derivado do `<input>` interno | `[reflectable]` no `@didPaint` e no `@around` de `value`/`required` |
| `controller` | `#controller` (`AbortController`, lazy) | Interno | Abortado em `remove()` (`@disconnected`) para soltar o listener de `formdata` |

**Estado observável** (`internals.states`): `hidden`, `invalid`, `disabled`.

**`reset()`** (`input.ts:244-252`) é o único ponto que mexe em múltiplos estados de uma vez:
zera `value`, remove o attribute `value`, tira `invalid` de `states`, dispara `reset`. É um
Comando explícito (nome verbo, rule 038) — não é consulta.

---

## 5. Edge Cases

| # | Caso | Comportamento requerido |
|---|---|---|
| 1 | `value` setado por JS antes do connect | O `Proxy` grava em `target` (`element.js:22-25`); no paint o `<input>` nasce com `value="..."` (`input/component.js:19`). Não se perde |
| 2 | `type` inválido (ex: `type="frobnicate"`) | Encaminhado cru ao `<input>`, que o normaliza para `text` — comportamento nativo, sem validação em `kb-input` |
| 3 | `<kb-input>` com `slot="label"` preenchido mas **sem `id` e sem `name`** | `input.id` devolve `'' \|\| '' = ''` (`input.ts:57`); `component.js:8` não renderiza `id` no `<input>`; o `<label for="">` não associa a nada. O texto do label aparece visualmente, mas o `<input>` fica **sem nome acessível**. Recomendação: gerar um id interno ou usar `internals.ariaLabelledby` — ver "Divisão de trabalho". Estado atual: associação depende de o consumidor pôr `name` ou `id` |
| 4 | `name` setado, `id` não | `input.id` cai em `this.name` (`input.ts:57`); `<input id="{name}">` e `<label for="{name}">` associam. Funciona — é o caminho comum |
| 5 | Campo `required` vazio | `[validatable]` adiciona `'invalid'` a `states` → borda vira `--input-color-invalid`, `slot[name='helper']` some, `kb-validity state="valueMissing"` aparece. `input.test.js:20` ("reports valueMissing while a required field is empty") |
| 6 | `reset()` / `@formReset` | `value` volta a `''`, attribute `value` removido, `invalid` limpo, `reset` despachado. `input.test.js:30` ("reset() clears the value") |
| 7 | Elemento removido do DOM com listener de `formdata` ativo | `remove()` (`@disconnected`) aborta `controller` → o listener é desregistrado via `signal` (`input.ts:267`) |
| 8 | `disabled` durante submit | O listener de `formdata` checa `!this.disabled` (`input.ts:266`) — o valor não entra no `FormData` |
| 9 | Contraste do placeholder | `--color-master` (#626262) sobre `--color-master-lightest` (#fafafa) ≈ 5.7:1 — passa AA para texto. A borda `--color-danger` (#f55753) sobre #fafafa ≈ 3.3:1 — passa o mínimo 3:1 para elemento de interface, com folga pequena; registrar para o `designer` |
| 10 | Alvo de toque | `--input-size-height` default **40px** < 44px recomendado (WCAG 2.5.5 AAA / 2.5.8 AA usa 24px). Abaixo do alvo confortável de 44px; ver auditoria |
| 11 | `prefers-reduced-motion` | A única `transition` em `style.js:54` é o truque anti-autofill (9999999999s) — não é movimento perceptível; nada a fazer |
| 12 | Leitor de tela ao ficar inválido | `internals.setValidity` marca o controle inválido na árvore; o `kb-validity` que aparece **não** tem `role="alert"` (ver `src/form/validity/DESIGN.md`) — a mudança não é anunciada ativamente. Lacuna a decidir no pacote `validity` |

Coberto por teste: `input/input.test.js` — "dispatches changed on every keystroke",
"reports valueMissing while a required field is empty", "reset() clears the value".

---

## Auditoria de tokens (designer)

`kb-input` nunca passou por revisão formal do `designer`. Achados, em ordem de severidade:

1. **`--input-size-height` default `40px` é literal (`input/style.js:23`), sem token global
   equivalente.** `packages/pixel/tokens/` **não tem escala de tamanho de controle** — só
   `spacing`, `fontSize`, `lineHeight`, `borderRadius`, `borderWidth`, `color`. Há
   coincidências numéricas (`--spacing-sm` = 40px, `--spacing_inset-lg` = 40px) mas usar um
   token de *espaçamento* para *altura de controle* seria nome enganoso (rule 035). A dívida:
   falta um `--size-control-*` (ou `--input-size-*`) na escala global. Enquanto não existe,
   o `40px` fica como fallback da custom property e a lacuna fica registrada aqui, não
   silenciada. **Decisão recomendada ao `designer`**: criar `--size-control-md: 40px` (ou
   `44px`, alinhando ao alvo de toque) em `packages/pixel/tokens/` e apontar
   `--input-size-height` e `--textarea-size-min-height` para essa escala.
2. **Dois padrões de nome de espaçamento no mesmo arquivo.** `input/style.js:10` usa
   `var(--spacing-nano)` para o `gap`; `input/style.js:25` usa `var(--spacing_inset-nano)`
   para o `padding`. Os dois valem 8px (`packages/pixel/tokens/spacing.css:3` e `:16`), mas
   são escalas distintas — `spacing-*` para separação entre elementos, `spacing_inset-*`
   para respiro interno. O `gap` separa label/input/slots, que **é** separação entre
   elementos, então `--spacing-nano` não está errado; mas o irmão `src/component/button/style.js:21`
   usa `--spacing_inset-nano` para o próprio `gap`. Inconsistência a uniformizar — o
   `designer` escolhe qual escala o `gap` de campo segue, e a mesma escolha vale para
   `textarea`.
3. **Cor de texto default diverge entre `input` e `textarea`.** `input/style.js:19` usa
   `--color-master-dark`; `src/form/textarea/style.js:23` usa `--color-master-darkest` para
   o mesmo papel (texto digitado). `src/typography/label/style.js:7` e
   `src/typography/helper/style.js:7` usam `--color-master-dark`. `kb-textarea` é o outlier;
   o alinhamento é para `--color-master-dark`. Registrar como divergência do par
   deliberadamente paralelo.
4. **Peso e entrelinha não são re-estilizáveis.** `--font-weight-regular` (`style.js:22`) e
   `--line-height-default` (`style.js:24`) estão fixos, sem `--input-font-weight` /
   `--input-line-height`, ao contrário de `--input-font-family` e `--input-font-size`. O
   `textarea` **expõe** `--textarea-line-height` (`textarea/style.js:28`) — mais uma
   divergência do par. O `designer` decide se os quatro eixos de tipografia (`family`,
   `size`, `weight`, `line-height`) viram custom property nos dois, para simetria.
5. **Escala de tipografia — confere.** `--font-size-xxs` = 14px
   (`packages/pixel/tokens/fontSize.css:3`) é o tamanho de corpo de campo, coerente com
   `--font-size-xxs` que `src/typography/label/style.js:10` usa para o rótulo. Pesos
   (`--font-weight-regular` = 400) e famílias (`--font-family-base`) batem com a escala de
   `src/typography/`. Nada a corrigir aqui.

---

## Divisão de trabalho entre ofícios

| Área | Ofício responsável | Status |
|---|---|---|
| Cadeia `Echo(Hidden(Width))`, `formAssociated`, `element.js` Proxy, Symbols locais, paralelismo com `textarea` | `architect` | Concluído — o paralelismo é decisão consciente |
| Escala de tamanho de controle para `--input-size-height` (`40px`) — criar token global ou derivar | `designer` | **Pendente** — lacuna na escala de `packages/pixel/tokens/` |
| `--spacing-nano` vs `--spacing_inset-nano` no `gap`; alinhar com `button` | `designer` | **Pendente** |
| Cor de texto `--color-master-dark` vs `--color-master-darkest` (input × textarea) | `designer` | **Pendente** — decidir e alinhar o par |
| Expor `--input-font-weight` / `--input-line-height` para simetria com `textarea` | `designer` → `developer` | **Pendente** |
| `<label for>` sem alvo quando `id`/`name` ausentes (Edge case 3) — nome acessível | `designer` → `developer` | **Aberto** — propor id interno gerado ou `internals.ariaLabelledby` |
| `on`/`width`/`hidden`/`remove()` no `types.d.ts`; remover `internals` e `controller` do contrato | `developer` | **Concluído (neste diff)** — `on` e `width` tipados, `internals`/`controller` fora do contrato (padrão `button`/`main`) |
| Prova de `changed`, `valueMissing`, `reset()` | `tester` | Concluído — `input.test.js` |
| Página de `website/docs/components/input.mdx` e traduções | `writer` | — |

---

**Criado em**: 2026-09-07
**Atualizado em**: 2026-09-07
**Versão**: 1.0
