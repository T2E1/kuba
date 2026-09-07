# DESIGN — `kb-form`

**Pacote**: `src/form/form/`
**Tag**: `<kb-form>`
**Status**: documentação retroativa — a implementação precede este documento
**Data**: 2026-09-07

---

Este documento segue o framework LLD (5 passos) e registra o comportamento de `kb-form`
tal como implementado. Ele é a fonte da verdade: quando a implementação divergir dele, é a
implementação que está errada, não o inverso. Mudança de comportamento passa primeiro por
uma revisão deste documento, depois pelo código — nunca o contrário.

O pacote foi escrito antes de qualquer processo formal de design neste repositório e nunca
teve especificação própria. `src/form/` é o único container de `src/` cujos componentes
ainda não tinham `DESIGN.md`.

## Visão Geral

`kb-form` é um **invólucro de `<form>` nativo no shadow root** (`form/component.js:5`) que
faz três coisas: re-despacha os eventos nativos `reset`/`submit` do form interno como
`CustomEvent` `resetted`/`submitted` carregando o `FormData` parseado (`form/form.ts:68-85`);
opcionalmente renderiza o conteúdo a partir de um `<template>` filho, interpolado com os
dados passados a `render(data)` (`form/form.ts:48-52`, mixin `Template`); e participa do
barramento de arcos por herdar `Echo` (`form/form.ts:20`).

O que ele **não** é: um controle de formulário (`kb-form` não é `formAssociated`, não tem
`value`, não entra no `FormData` de um form-pai); um substituto do `<form>` nativo para
validação (a validação de constraint continua sendo do `<form>` interno e dos campos —
`form.test.js:48` prova que um submit inválido é bloqueado nativamente); nem um motor de
template geral (o `<template>` é resolvido uma vez e cacheado — mixin `Template`).

A `render()` roteia o resultado da interpolação para `#textContent`, e o `@repaint`
(`form/form.ts:48`) redesenha o shadow com o novo HTML dentro do `<form>`
(`form/component.js:5`). O template só é lido quando `render()` é chamado — explicitamente
ou pelo hook de `autorender` no connect (`form/form.ts:54-59`).

---

## 1. Requisitos

| Pergunta (LLD passo 1) | Resposta |
|---|---|
| Quem consome, em que contexto | O autor de markup que quer ouvir `submitted`/`resetted` como eventos de alto nível com o `FormData` já parseado, em vez de lidar com `preventDefault` e `new FormData(form)` à mão; e quem quer o corpo do form vindo de um `<template>` interpolado |
| Somente leitura ou interativo | Interativo por delegação — a interação real acontece nos campos e no botão de submit dentro do slot; `kb-form` só intercepta os dois eventos de ciclo |
| Caso de uso mínimo (MVP) | Envolver um `<form>` no shadow, projetar os filhos, e re-despachar `submit`/`reset` como `submitted`/`resetted` |
| Participa de `<form>` | Não. Sem `static formAssociated`, sem `attachInternals` para associação — o getter `internals` (`form.ts:34-36`) só existe para o mixin `Hidden` (ver seção 3) |
| Papel e nome acessível | Nenhum próprio. O `<form>` interno carrega a semântica nativa de formulário; `kb-form` não entra com `Identity` nem publica `role` |
| Superfície de variação | `autorender` (boolean, `form.ts:29`), `template` (herdado de `Template`), `on` (herdado de `Echo`), e as custom properties `--form-*` |
| Sub-elemento interno | Um `<form>` no shadow root (`form/component.js:5`), sem `id`, sem `name`, sem action |

**Requisitos funcionais**

1. Renderiza `<form>${form.textContent}</form>` no shadow root (`form/component.js:5`);
   `textContent` é `''` até a primeira `render()` (`form/form.ts:39-41`).
2. `render(data)` interpola `super.template` (mixin `Template`) com `data` via `@interpolate`
   e guarda em `#textContent`; decorada com `@repaint` (`form/form.ts:48-52`).
3. `@connected [rendered]()` chama `render()` sem dados quando `autorender` está setado
   (`form/form.ts:54-59`, corpo `if (this.autorender) this.render()` em `:57`).
4. `reset()` despacha um `Event('reset')` no `<form>` interno (`form/form.ts:61-66`);
   `submit()` despacha um `Event('submit')` interno (`form/form.ts:74-79`).
5. `@on.reset('form', stop) [resetted]()` intercepta o `reset` interno, para a propagação, e
   despacha `customEvent('resetted', {})` no host (`form/form.ts:68-72`).
6. `@on.submit('form', prevent, stop, formData) [submitted](data)` intercepta o `submit`
   interno, previne o navegador, para a propagação, e despacha `customEvent('submitted', data)`
   com o `FormData` parseado como `detail` (`form/form.ts:81-85`).
7. `:host { display: flex; width: 100% }`; `:host(:state(hidden)) { display: none }`
   (`form/style.js:5-20`).

**Não-requisitos (YAGNI, rule 023)**

- `formAssociated` / `value` — `kb-form` agrupa campos, não é um campo. Um form dentro de
  form não é HTML válido; não há caso de `kb-form` submetido por outro form.
- `action` / `method` / submit HTTP — o pacote entrega o `FormData` por evento; a requisição
  é responsabilidade do consumidor (ou de um `<kb-fetch>` ligado por arco).
- `Identity` / `role` — o `<form>` nativo no shadow já é o landmark quando tem nome
  acessível; duplicar no host criaria dois.
- Validação própria — delegada ao `<form>` e aos campos nativos (`form.test.js:48`).
- `Width`/`Height` — o form ocupa `100%` da largura do container por desenho; não há eixo
  de dimensão configurável por attribute.

---

## 2. Contrato Público

### Attributes / Properties

| Nome | Tipo | Default | Reflete | Especificação |
|---|---|---|---|---|
| `autorender` | `boolean` | `false` (`form.ts:25-27`) | via `booleanAttribute` | `@attributeChanged('autorender', booleanAttribute)` (`form.ts:29`). Quando presente, `render()` roda no `@connected` sem dados (`form.ts:57`) |
| `hidden` | `boolean` | `false` | via `booleanAttribute` | Herdado de `Hidden` (`form.ts:20`); alterna `:host(:state(hidden))` (`style.js:18`) e remove o attribute quando `false`. Publicado em `types.d.ts` |
| `template` | `string` | — | não | Herdado de `Template` (`form.ts:20`). Id de um `<template>` no documento; ler `template` resolve o `<template>` filho do host e devolve seu `innerHTML` (`packages/mixin/template.ts:14-23`) |
| `on` | arc string | — | não | Herdado de `Echo` (`form.ts:20`), adicionado a `observedAttributes` (`packages/echo/echo.js:9`). Declarado em `types.d.ts` como `on: KUBAFormOnAttribute \| (string & {})` — um template literal type que restringe a forma do arco (`source/event:type/sink` mais pares `\|filtro=valor`), com fallback para `string` livre quando o valor não é literal |
| `textContent` | `string` (readonly) | `''` (`form.ts:39-41`) | — | HTML já interpolado da última `render()`. Sombreia a propriedade nativa `Node.prototype.textContent` — ver Edge case 6 |

**Métodos públicos** (rule 010 — limite 7; há 3 + o par getter de `autorender`/`textContent`):

| Método | Efeito | Retorno |
|---|---|---|
| `render(data?)` | Interpola o `<template>` com `data` e repinta (`form.ts:48-52`) | `this` |
| `reset()` | Dispara `reset` no `<form>` interno → cadeia `[resetted]` (`form.ts:61-66`) | `this` |
| `submit()` | Dispara `submit` no `<form>` interno → cadeia `[submitted]` (`form.ts:74-79`) | `this` |

**Rule 037 (flag arguments)**: `autorender` é boolean, mas é **attribute de configuração**, não
parâmetro de método — não seleciona caminho dentro de uma função pública. Nenhum método
recebe boolean.

### Events

| Evento | Dispara quando | `detail` |
|---|---|---|
| `submitted` | o `<form>` interno emite `submit` (por interação do usuário ou por `submit()`) | o `FormData` parseado pelo helper `formData` (`form.ts:81`) |
| `resetted` | o `<form>` interno emite `reset` (ou por `reset()`) | `{}` — objeto vazio (`form.ts:70`) |

Ambos são construídos por `customEvent` (`form.ts:70`, `:83`) → `bubbles: true`,
`cancelable: true` (`packages/event/customEvent.js`). Por estar em `Echo`, todo
`dispatchEvent` é também ecoado no barramento compartilhado com `id`, `name` e tag do host,
o que permite `<kb-form name="signup">` ser o `source` de um arco.

### Slots

Um `<slot>` implícito: os filhos do host (ou o conteúdo do `<template>` após `render()`)
são projetados dentro do `<form>` interno. Não há slots nomeados.

### Parts

Nenhum, e nenhum a ter — o `<form>` interno não é exposto por `::part`.

### Custom properties de CSS (pontos de extensão)

| Custom property | Fallback | Controla |
|---|---|---|
| `--form-align` | `start` (literal keyword) | `align-items` do `<form>` interno (`style.js:10`) |
| `--form-direction` | `column` (literal keyword) | `flex-direction` do `<form>` interno (`style.js:12`) |
| `--form-space-gap` | `var(--spacing_inset-xs)` | `gap` entre filhos diretos do form (`style.js:13`) |

`start` e `column` são **keywords estruturais de layout**, não valores temáticos — mesma
classe de exceção da rule 024 que `src/layout/main/DESIGN.md:116` aplica a `display: flex`.
`--form-space-gap` cai na escala global `--spacing_inset-*`, sem literal — correto.

---

## 3. Composição

**Cadeia**: `Echo(Hidden(Template(HTMLElement)))` (`form/form.ts:20`)

| Mixin | Traz | Por que entra na cadeia |
|---|---|---|
| `Template` | `template` (attribute + getter que resolve o `<template>` filho e devolve `innerHTML`) (`packages/mixin/template.ts:10-31`) | `render()` precisa de uma fonte de markup; `Template` é a que lê o `<template>` filho uma vez e cacheia |
| `Hidden` | `hidden` (attribute + property, publicado em `types.d.ts`), reflexo em `internals.states` (`:state(hidden)`), limpeza do attribute quando `false` (`packages/mixin/hidden/hidden.ts`) | Um formulário condicional é comum; `:host(:state(hidden)) { display: none }` (`style.js:18`) depende do Symbol `hideable` que o mixin implementa. **É o único consumidor de `this.internals`** neste pacote |
| `Echo` | `on` em `observedAttributes`, `[connectArc]`/`[disconnectArc]`, eco de todo `dispatchEvent` no barramento (`packages/echo/echo.js`) | `submitted`/`resetted` só alcançam outros elementos da página por arco se forem ecoados; e `<kb-on>` como filho torna o form acionável declarativamente (`submit`/`reset` por arco) |

**Symbols privados** (`form/interfaces.js`): `resetted`, `submitted`, `rendered` — três
`Symbol('...')` **locais** (`interfaces.js:1-3`). São chaves de métodos com `@on.*` /
`@connected` referenciadas só dentro de `form.ts`; não atravessam fronteira de pacote, por
isso `Symbol()` e não `Symbol.for()` — mesma regra que `src/data/fetch/DESIGN.md:178`
aplica a `abort`/`dispatch`.

**`attachInternals()`**: uma única chamada, lazy via `??=` (`form/form.ts:34-36`). O getter
`internals` existe em runtime, consumido apenas pelo mixin `Hidden`
(`packages/mixin/hidden/hidden.ts` lê `this.internals.states`), e **não é publicado em
`types.d.ts`** — mesma convenção de `button`/`icon`/`cover`/`main`, onde o mesmo getter
existe na classe e não vira contrato do consumidor (`src/layout/main/DESIGN.md:87-90`).

**Foco**: `attachShadow({ mode: 'open' })` no constructor (`form/form.ts:45`), **sem
`delegatesFocus`**. O foco vai naturalmente para o primeiro campo focável dentro do
`<form>` projetado; `kb-form` não é focável e não intercepta Tab.

**Sub-elemento**: o `<form>` no shadow root. Não tem `id`/`name`/`action` e não é exposto —
é detalhe de implementação para capturar `submit`/`reset` nativos.

---

## 4. Gestão de Estado

| Dado | Onde mora | Controlado? | Regra de sincronização |
|---|---|---|---|
| `autorender` | `#autorender` + attribute (`form.ts:21`, `:29-32`) | Controlado — DOM é a fonte da verdade | `@attributeChanged('autorender', booleanAttribute)` grava o campo; getter default `false` via `??=` (`form.ts:25-27`) |
| `template` | `#template` (no mixin `Template`) | Resolvido do DOM | Lazy `??= this.querySelector('template')` na primeira leitura (`packages/mixin/template.ts:15`); o setter do attribute troca por `document.querySelector('#'+value)` |
| `#textContent` | Campo privado (`form.ts:23`, `:39-41`) | Derivado | Escrito só por `render()` (`form.ts:50`); default `''` via `??=`. Não é reavaliado sozinho — só na próxima `render()` |
| `hidden` / `:state(hidden)` | `#hidden` (mixin `Hidden`) + `internals.states` | Controlado | `@around(hideable)` reflete em `internals.states` num tick posterior; `@around(cleanup)` remove o attribute quando `false` |
| Arcos | `#controllers` dentro de `Echo` | Escrito pelo attribute `on` e por filhos `<kb-on>` | Um `AbortController` por arco; todos abortados no `disconnectedCallback` |

**Estado observável** (`internals.states`): `hidden` — o único, e vem do mixin. `kb-form`
**não** publica `invalid` nem nenhum estado próprio; a validade vive nos campos e no
`<form>` nativo.

**Estado derivado**: `textContent`, produto de `template` × `data`. Nenhum outro.

---

## 5. Edge Cases

| # | Caso | Comportamento requerido |
|---|---|---|
| 1 | `<kb-form>` sem `<template>` filho e `render()` chamado | `this.#template` resolve `null`; `packages/mixin/template.ts:15` desestrutura `{ innerHTML, children }` de `null` → **lança `TypeError`**. Não há guarda. Só chame `render()` quando houver `<template>`, ou não use `autorender` sem template |
| 2 | `autorender` presente mas sem `<template>` | Mesma falha do caso 1, agora no `@connected` (`form.ts:57`) — o elemento lança ao conectar |
| 3 | `render(data)` com placeholder `{path}` ausente em `data` | Vira string vazia, nunca a literal `"undefined"` — comportamento de `@interpolate` (`packages/interpolate/interpolate.js`) |
| 4 | `submit()` com um campo inválido dentro do form | O `submit` nativo é bloqueado pela constraint validation do `<form>` interno antes de `[submitted]` rodar — `form.test.js:48` ("native validation blocks a submit with an invalid field") |
| 5 | `reset()` chamado | `[resetted]` despacha `resetted` com `detail: {}` — `form.test.js:35` ("publishes resetted with an empty detail"). Os campos nativos dentro do form voltam ao valor default; `kb-input`/`kb-textarea` reagem pelo próprio `@formReset` |
| 6 | Consumidor lê `element.textContent` esperando o texto do nó | Recebe o HTML interpolado da última `render()` (`''` se nunca chamada), **não** o `textContent` do DOM. É sombreamento deliberado da propriedade nativa; documentado aqui como surpresa conhecida |
| 7 | `submitted` cancelado por um listener (`event.preventDefault()`) | `customEvent` é `cancelable`, mas nada em `kb-form` observa o retorno — o cancelamento não tem efeito interno (o submit nativo já foi prevenido em `form.ts:81`). Serve só para listeners a jusante |
| 8 | Dois `<kb-form>` com o mesmo `name` na página | Ambos ecoam no barramento com o mesmo `source`; um arco que aponte para esse nome dispara nos dois. Uso incorreto verificável por review (rule 023) |
| 9 | Leitor de tela | Anuncia o `<form>` interno e seus campos normalmente; `kb-form` não acrescenta nem remove semântica. Sem nome acessível no `<form>` interno, é uma região de formulário sem rótulo — responsabilidade do consumidor pôr um `aria-label`/heading |
| 10 | `prefers-reduced-motion` | Nenhuma transição ou animação em `form/style.js` — nada a respeitar |

Coberto por teste: `form/form.test.js` — "publishes submitted with the parsed form data",
"publishes resetted with an empty detail", "native validation blocks a submit with an
invalid field".

---

## Auditoria de tokens (designer)

`kb-form` nunca passou por revisão formal do `designer`. Achados:

- **Sem literal de dimensão.** `form/style.js` só tem `--form-space-gap` →
  `var(--spacing_inset-xs)` (escala global, correto) e dois keywords estruturais
  (`start`, `column`) que não são valor temático — não violam a rule 024.
- **`--form-space-gap` diverge do irmão.** `src/component/button/style.js:21` e
  `src/form/input`/`textarea` usam `--spacing_inset-nano` (8px) para `gap`; `kb-form` usa
  `--spacing_inset-xs` (16px) — coerente com `src/layout/main/DESIGN.md:113` (`--main-space-gap`
  → `--spacing_inset-md`), já que aqui o gap separa campos inteiros, não elementos internos.
  Não é bug; é escolha de escala a confirmar com o `designer`.
- **`--form-align` / `--form-direction` como custom property de keyword.** Expor
  `flex-direction`/`align-items` por custom property é incomum no repositório (`kb-main`
  não faz). Não é violação, mas é superfície pública que, uma vez documentada, não pode ser
  removida (rule 011). O `designer` deve decidir se `row` é um caso real ou YAGNI.
- **Sem token de tipografia** — `kb-form` não estiliza texto; o texto vem dos campos e
  labels projetados. Nada a auditar aí.

---

## Divisão de trabalho entre ofícios

| Área | Ofício responsável | Status |
|---|---|---|
| Contrato público, cadeia `Echo(Hidden(Template))`, Symbols locais | `architect` | Concluído |
| Remover `internals` do `types.d.ts` (não é contrato — só o mixin `Hidden` usa), declarar `on` e `hidden` | `developer` | **Concluído (neste diff)** — `internals` fora do contrato, `on` tipado como `KUBAFormOnAttribute \| (string & {})`, `hidden` publicado |
| Guarda em `render()`/`[rendered]` para `<template>` ausente (Edge cases 1–2) | `architect` → `developer` | **Aberto** — hoje lança `TypeError` sem mensagem de domínio (rule 027) |
| Tokens `--form-*`: escala de `gap`, e se `--form-align`/`--form-direction` devem existir | `designer` | **Pendente** — nunca houve revisão formal |
| Prova de `submitted`/`resetted`/validação nativa | `tester` | Concluído — `form.test.js` |
| Página de `website/docs/components/form.mdx` e traduções | `writer` | — |

---

**Criado em**: 2026-09-07
**Atualizado em**: 2026-09-07
**Versão**: 1.0
