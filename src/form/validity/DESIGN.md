# DESIGN — `kb-validity`

**Pacote**: `src/form/validity/`
**Tag**: `<kb-validity>`
**Status**: documentação retroativa — a implementação precede este documento
**Data**: 2026-09-07

---

Este documento segue o framework LLD (5 passos) e registra o comportamento de `kb-validity`
tal como implementado. Ele é a fonte da verdade: quando a implementação divergir dele, é a
implementação que está errada, não o inverso. Mudança de comportamento passa primeiro por
uma revisão deste documento, depois pelo código — nunca o contrário.

O pacote foi escrito antes de qualquer processo formal de design neste repositório e nunca
teve especificação própria.

## Visão Geral

`kb-validity` é uma **mensagem de erro condicional por chave de `ValidityState`**. Ele é
slotado em `slot="validity"` de um controle form-associated (`kb-input`, `kb-textarea`) —
que ele assume sozinho ao conectar (`validity/validity.ts:75-79`, `[slottable]`) — e fica
**invisível** (`:host { display: none }`, `validity/style.js:8`) até que a chave nomeada
pelo attribute `state` (ex.: `valueMissing`, `typeMismatch`, `tooShort`) seja `true` na
`validity` do `parentElement` (`validity.ts:82-87`, `[validatable]`). Aí passa a
`display: inline` (`validity/style.js:15-17`).

Ele lê `parentElement.validity[this.state]` **diretamente** (`validity.ts:83`) — por isso só
funciona como **filho direto** de um `kb-input`/`kb-textarea`. Não é um componente de uso
geral.

O que ele **não** é: um resumo de todos os erros do campo (é uma chave só, por instância —
usa-se várias); um `kb-helper` (o helper é texto neutro sempre visível; `kb-validity` só
aparece no erro específico e o `kb-input` esconde o helper quando inválido); nem um live
region que anuncia o erro — hoje ele **não** tem papel ARIA (ver seção 3, e a recomendação).

---

## 1. Requisitos

| Pergunta (LLD passo 1) | Resposta |
|---|---|
| Quem consome, em que contexto | Autor de markup, como filho direto de `<kb-input>`/`<kb-textarea>`, um `<kb-validity>` por chave de erro que quer mensagem própria |
| Somente leitura ou interativo | Somente leitura — não recebe foco, não recebe digitação; reage a eventos do pai |
| Caso de uso mínimo (MVP) | Ler `state`, assumir `slot="validity"`, ouvir `changed`/`invalid`/`reset` do pai, e alternar `:state(invalid)` conforme `parentElement.validity[state]` |
| Participa de `<form>` | Não — sem `formAssociated`, sem `value`. Tem `attachInternals()` só para `internals.states` (`:state(invalid)`) |
| Papel e nome acessível | **Nenhum hoje.** Sem `Identity`, sem `role`, sem `aria-live`. Recomendação de adicionar `role`/`aria-live` registrada na seção 3 como proposta, não como estado atual |
| Superfície de variação | `state` (attribute), `on` (herdado de `Echo`), custom properties `--validity-*` |
| Sub-elemento interno | Um `<slot>` default (`validity/component.js:3`) |

**Requisitos funcionais**

1. `<slot></slot>` no shadow root (`validity/component.js:3`).
2. `@attributeChanged('state') set state(value)` grava `#state` (`validity.ts:35-38`).
3. `@connected [slottable]()` faz `this.setAttribute('slot', 'validity')` (`validity.ts:75-79`).
4. `@connected async [reflectable]()` (`validity.ts:53-68`): aguarda
   `customElements.whenDefined(this.parentElement?.localName)`, depois registra, com o
   `signal` do `controller`, listeners no pai para `changed` e `invalid` (→ `[validatable]`)
   e para `reset` (→ `[resettable]`).
5. `[validatable]()` (`validity.ts:82-87`): se `parentElement.validity[this.state]` for
   truthy, `internals.states.add('invalid')`; senão `.delete('invalid')`.
6. `[resettable]()` (`validity.ts:70-73`): `internals.states.delete('invalid')`.
7. `@disconnected remove()` (`validity.ts:45-50`): `super.remove()` + `controller.abort()` —
   solta os listeners do pai.
8. `:host { display: none }` → `:host(:state(invalid)) { display: inline }`
   (`validity/style.js:5-17`).

**Não-requisitos (YAGNI, rule 023)**

- Resolver qual mensagem mostrar entre várias — cada `kb-validity` cuida de uma chave; o
  consumidor lista quantas quiser.
- Ler a `validity` de um controle que não seja o `parentElement` direto — o acoplamento a
  `parentElement` é o desenho; um seletor/`for` seria outra fonte de verdade.
- Texto de erro default — o conteúdo é sempre do slot; sem fallback (ver rule 071 — nada de
  copy embutido).
- `Identity` — hoje ausente; se entrar, é para `role`/live region, decisão do `designer`
  (seção 3), não YAGNI a barrar.
- `Hidden`/`Width` — a visibilidade é o `:state(invalid)`; largura acompanha o texto inline.

---

## 2. Contrato Público

### Attributes / Properties

| Nome | Tipo | Default | Reflete | Especificação |
|---|---|---|---|---|
| `state` | `string \| undefined` | `undefined` (`#state` sem `??=`, `validity.ts:31-33`) | via `@attributeChanged('state')` (attribute → prop apenas) | Nome de uma chave de `ValidityState` — `valueMissing`, `typeMismatch`, `patternMismatch`, `tooShort`, `tooLong`, `rangeUnderflow`, `rangeOverflow`, `stepMismatch`, `badInput`, `customError`. `types.d.ts` publica `state: string \| undefined` e a redação diz que o setter só guarda o valor e **nunca escreve de volta no attribute** — não há reflexão prop → attribute (`@attributeChanged` só sincroniza attribute → propriedade) |
| `on` | arc string | — | não | Herdado de `Echo` (`validity.ts:18`). Publicado em `types.d.ts` como `on: KUBAValidityOnAttribute \| (string & {})` — template literal type da forma do arco, com fallback para `string` livre |

**Propriedades readonly no runtime**: `controller` (`AbortController`, lazy,
`validity.ts:23-25`), `internals` (`ElementInternals`, lazy, `validity.ts:27-29`). **Nenhuma
das duas é publicada em `types.d.ts`** — são getters internos: `internals` só serve a
`internals.states` (`:state(invalid)`), `controller` só solta os listeners no `remove()`.
Padrão `button`/`main` (`src/layout/main/DESIGN.md:87-90`).

**Métodos públicos**: nenhum além do par getter/setter de `state`. `remove()` é override de
método nativo (`@disconnected`, `validity.ts:45-50`) que aborta o `controller` e devolve
`this` — publicado em `types.d.ts` como `remove(): this`.

**Rule 037 (flag arguments)**: `state` é `string` (um enum de chave), não boolean. Nenhuma
flag.

### Events

Nenhum despachado. `kb-validity` **consome** `changed`, `invalid` e `reset` do
`parentElement` (`validity.ts:57-66`), não emite nada próprio. Por estar em `Echo`, se
algum dia despachar, será ecoado — hoje não despacha.

### Slots

Um `<slot>` default (`validity/component.js:3`) — o texto da mensagem de erro. Sem slots
nomeados.

### Parts

Nenhum.

### Custom properties de CSS (pontos de extensão)

| Custom property | Fallback | Controla |
|---|---|---|
| `--validity-color` | `var(--color-danger)` | Cor do texto da mensagem (`style.js:7`) |
| `--validity-font-family` | `var(--font-family-base)` | Família (`style.js:9`) |
| `--validity-font-size` | `var(--font-size-xxxs)` | Tamanho — 12px (`style.js:10`) |
| `--validity-font-weight` | `var(--font-weight-regular)` | Peso — 400 (`style.js:11`) |
| `--validity-line-height` | `var(--line-height-lg)` | Entrelinha — 150% (`style.js:12`) |

Todos os fallbacks são token global, sem literal — este `style.js` **não viola a rule 024**.
Nenhum valor é interpolado a partir de entrada → sem vetor de injeção de CSS.

---

## 3. Composição

**Cadeia**: `Echo(HTMLElement)` (`validity/validity.ts:18`)

| Mixin | Traz | Avaliação |
|---|---|---|
| `Echo` | `on` em `observedAttributes`, `[connectArc]`/`[disconnectArc]`, eco de `dispatchEvent` (`packages/echo/echo.js`) | **Uso questionável.** `kb-validity` não despacha nenhum evento (nada a ecoar, sentido de saída vazio) e não há exemplo de `<kb-on>` como filho de `<kb-validity>` (sentido de entrada não exercido). Comparar com `src/data/fetch/DESIGN.md:220-236`, onde `Echo` só se justifica se usado em ao menos um sentido. Candidato a herança recusada (rule 059) — decisão do `architect`, registrada aqui como achado |

**Symbols privados** (`validity/interfaces.js`): `reflectable`, `resettable`, `slottable`,
`validatable` — quatro `Symbol('...')` **locais** (`interfaces.js:1-4`). Chaves de métodos
com `@connected` / handlers de listener, referenciadas só dentro de `validity.ts` →
`Symbol()`, não `Symbol.for()`. Correto.

**`attachInternals()`**: lazy via `??=` (`validity.ts:27-29`). Único uso:
`internals.states` para `:state(invalid)` (`validity.ts:71`, `:84`, `:85`). Não há
form-association.

**`[slottable]` — auto-slot.** Igual ao padrão de `src/typography/label/DESIGN.md:104-117`:
o elemento assume `slot="validity"` no `@connected` (`validity.ts:76`) para o consumidor
não escrever à mão. Aqui **não** foi extraído para um mixin `Slottable(slotName)` pela mesma
razão que lá — o corpo é uma linha.

**`[reflectable]` é `async` e depende de `whenDefined`.** `validity.ts:54` aguarda
`customElements.whenDefined(this.parentElement?.localName)` porque `parentElement.validity`
não existe antes do pai fazer upgrade. Se `parentElement` for `null` ou um elemento sem
hífen no nome (ex.: `<div>`), `customElements.whenDefined` **rejeita com `SyntaxError`**; a
função `async` para nesse `await` e **nunca registra os listeners** — o `kb-validity`
simplesmente não reage. `validity/validity.test.js:89` prova esse negativo (o elemento não
adiciona `:state(invalid)` sob um `<div>`), suprimindo a `unhandledrejection`. Ver Edge
case 4.

**Foco**: `attachShadow({ mode: 'open' })` (`validity.ts:42`), **sem `delegatesFocus`** —
nada focável; é texto.

**`role`/`Identity`: ausência com consequência de acessibilidade.**

- **Estado atual**: nenhum papel, nenhum `aria-live`. Quando o campo fica inválido, o
  `kb-validity` correspondente transita de `display: none` para `display: inline`, mas
  **nada anuncia a mensagem** a um leitor de tela. O `kb-input`/`kb-textarea` marca o
  controle como inválido via `internals.setValidity` (isso o leitor percebe ao focar o
  campo), porém o *texto* da causa não é associado ao controle nem lido ativamente.
- **Proposta (decisão do `designer` + `architect`, não implementada)**: expor
  `role="alert"` ou `aria-live="polite"` no host — via `internals.role` (o `internals` já
  existe) ou attribute. `role="alert"` faz o leitor anunciar o texto assim que ele aparece;
  `aria-live="polite"` é menos intrusivo. Complemento: o `kb-input` deveria referenciar os
  `kb-validity` visíveis em `aria-describedby`/`aria-errormessage` do `<input>` interno,
  para o texto ser lido também ao focar o campo. **Este é um conflito entre o design atual
  (mensagem puramente visual) e a acessibilidade — a alternativa acessível acima é a
  proposta padrão, e a decisão volta ao orquestrador.**

---

## 4. Gestão de Estado

| Dado | Onde mora | Controlado? | Regra de sincronização |
|---|---|---|---|
| `state` | `#state` + attribute (`validity.ts:20`, `:35-38`) | Controlado — DOM é a fonte da verdade | `@attributeChanged('state')` grava o campo. **Sem `??=`** — ler antes de qualquer escrita devolve `undefined`, não `''` |
| `slot="validity"` | attribute no próprio elemento | Escrito uma vez pelo elemento | `[slottable]()` no `@connected`; não reposto se removido depois (mesma semântica de `src/typography/label/DESIGN.md:139`) |
| `:state(invalid)` | `internals.states` | Derivado do pai | `[validatable]()` lê `parentElement.validity[this.state]` a cada `changed`/`invalid` do pai; `[resettable]()` limpa em `reset` do pai |
| listeners no pai | registrados em `[reflectable]`, presos ao `controller.signal` | Interno | Registrados no `@connected` (após `whenDefined`); soltos em `remove()` (`@disconnected` → `controller.abort()`) |

**Estado observável** (`internals.states`): `invalid` — o único. Note que este `invalid` é
**por chave** (`parentElement.validity[this.state]`), não o `validity.valid` geral do campo
(`validity.ts:81` comentário confirma: "not the parent's overall validity").

**Estado derivado**: `:state(invalid)`, função de `parentElement.validity[state]`. Nenhum
campo `#` de estado além de `#state`.

---

## 5. Edge Cases

| # | Caso | Comportamento requerido |
|---|---|---|
| 1 | `state` não definido | `this.state` é `undefined`; `parentElement.validity[undefined]` é `undefined` → `[validatable]` sempre remove `'invalid'` → o elemento nunca aparece. Sem aviso |
| 2 | `state` com chave inexistente de `ValidityState` (ex.: `state="typo"`) | `validity['typo']` é `undefined` → nunca aparece. Silencioso — não há validação da chave contra o conjunto de `ValidityState` |
| 3 | `<kb-validity>` sem `slot` explícito | `[slottable]()` põe `slot="validity"` no connect (`validity.ts:76`) — funciona sem o consumidor escrever nada |
| 4 | `<kb-validity>` **não** é filho direto de um custom element (está solto, ou dentro de `<div>`) | `[reflectable]` chama `customElements.whenDefined('div')` (ou, com `parentElement` `null`, `whenDefined(undefined)`), que **rejeita com `SyntaxError`**. A função `async` para no `await` e os listeners nunca são registrados: o elemento fica inerte, nunca mostra `:state(invalid)`. Não há guarda `if (!parentElement) return` — documentado, não corrigido (`validity/validity.test.js:89`) |
| 5 | `<kb-validity>` filho direto de `<kb-input>` que ainda não fez upgrade | `[reflectable]` aguarda `whenDefined` antes de ler `parentElement.validity` (`validity.ts:54`) — resolvido por desenho |
| 6 | Pai fica válido de novo | O próximo `changed`/`invalid` dispara `[validatable]` → `'invalid'` sai de `states` → `display` volta a `none`. O `kb-input` reexibe o `slot[name='helper']` |
| 7 | Form resetado | `reset` do pai → `[resettable]()` → `internals.states.delete('invalid')` → some, mesmo que a chave ainda fosse tecnicamente falha antes de o valor ter sido limpo |
| 8 | Vários `<kb-validity>` no mesmo campo, mais de uma chave falhando | Cada um decide sozinho pela sua chave — dois podem aparecer juntos (ex.: `tooShort` e `patternMismatch`). É o desenho; o consumidor ordena e agrupa no markup |
| 9 | `<kb-validity>` removido do DOM | `remove()` (`@disconnected`) aborta `controller` → listeners do pai soltos pelo `signal` (`validity.ts:47`) |
| 10 | Contraste | `--color-danger` (#f55753) sobre o fundo da página (tipicamente `--color-master-lightest` #fafafa) ≈ 3.3:1 — **abaixo de 4.5:1 para texto**. Como é texto pequeno (12px), é reprovação AA. Registrar para o `designer`: usar `--color-danger-dark` (#cd4945 ≈ 4.7:1) como fallback de `--validity-color` |
| 11 | `prefers-reduced-motion` | Nenhuma `transition`/`animation` em `validity/style.js` — a troca `none`↔`inline` é instantânea; nada a fazer |
| 12 | Leitor de tela | **Estado atual: a mensagem não é anunciada** ao aparecer, nem associada ao controle. Ver seção 3 — proposta de `role="alert"`/`aria-live` + `aria-errormessage` no `kb-input` |

Coberto por teste: `validity/validity.test.js` — "shows when its ValidityState key is true
on the parent", "stays invisible while the parent field is valid", "reacts only to its own
key, not to any other validity failure", "assumes slot=\"validity\" on connect without the
consumer writing it", "clears its invalid state when the parent field is reset", "never adds
:state(invalid) when the parent is not form-associated".

---

## Auditoria de tokens (designer)

`kb-validity` nunca passou por revisão formal do `designer`. Achados:

- **Sem literal.** `validity/style.js` usa só token global como fallback
  (`--color-danger`, `--font-family-base`, `--font-size-xxxs`, `--font-weight-regular`,
  `--line-height-lg`). Não viola a rule 024.
- **Contraste insuficiente no default de cor.** `--validity-color` cai em `--color-danger`
  (#f55753). Sobre `#fafafa` o rácio é ≈ 3.3:1 — reprova AA para texto (mínimo 4.5:1), e
  o texto é de 12px (`--font-size-xxxs`), o menor da escala. **Recomendação**: fallback
  para `--color-danger-dark` (#cd4945, `packages/pixel/tokens/color.css:35` — rácio ≈
  4.7:1). É uma correção de acessibilidade, não estética.
- **Nome `--validity-color` foge da taxonomia.** Os campos usam `--input-color-text` /
  `--textarea-color-text` (nível de propriedade explícito); aqui é só `--validity-color`.
  Para consistência de namespace seria `--validity-color-text`. Nit de nomenclatura, o
  `designer` decide se vale o churn de contrato.
- **Tipografia — confere e é coerente com o irmão.** `--font-size-xxxs` (12px),
  `--font-weight-regular` (400), `--line-height-lg` (150%) são idênticos aos de
  `src/typography/helper/style.js:10-12` — `kb-validity` e `kb-helper` compartilham a
  tipografia de texto auxiliar de campo, o que faz sentido (um substitui o outro na área do
  helper quando há erro). Nada a corrigir.
- **`--validity-*` expõe os quatro eixos de tipografia** (`family`, `size`, `weight`,
  `line-height`) — mais completo que `--input-*`, que só expõe `family` e `size`. Serve de
  modelo para o que o `designer` deveria padronizar nos campos (ver auditoria de
  `src/form/input/DESIGN.md` e `src/form/textarea/DESIGN.md`).

---

## Divisão de trabalho entre ofícios

| Área | Ofício responsável | Status |
|---|---|---|
| Cadeia `Echo(HTMLElement)` — reavaliar se `Echo` se justifica (sem despacho, sem arco de entrada) | `architect` | **Aberto** — candidato a herança recusada (rule 059) |
| Symbols locais, `[slottable]` sem mixin, acoplamento a `parentElement` | `architect` | Concluído |
| `role="alert"` / `aria-live` no host + `aria-errormessage` no `kb-input` — conflito design × acessibilidade | `designer` → `architect` | **Aberto** — proposta acessível registrada; decisão volta ao orquestrador |
| Fallback de `--validity-color` para `--color-danger-dark` (contraste AA) | `designer` → `developer` | **Aberto** — correção de acessibilidade |
| Namespace `--validity-color` → `--validity-color-text` | `designer` | **Pendente** — nit, avaliar churn |
| Guarda `if (!parentElement) return` em `[reflectable]` (Edge case 4 — hoje lança `SyntaxError`) | `developer` | **Aberto** |
| `types.d.ts`: redação de `state` (`string \| undefined`, sem reflexão prop → attribute); declarar `on`; remover `internals`/`controller` do contrato; publicar `remove()` | `developer` | **Concluído (neste diff)** |
| Validar `state` contra o conjunto de chaves de `ValidityState` (Edge case 2) | `architect` → `developer` | **Não decidido** — hoje chave inválida falha em silêncio |
| Teste do pacote | `tester` | **Concluído (neste diff)** — `src/form/validity/validity.test.js`, 6 testes: aparece quando a chave de `ValidityState` fica `true` no pai; fica invisível enquanto o pai é válido; reage só à própria chave e não a outra falha de validade; assume `slot="validity"` no connect; limpa `:state(invalid)` no `reset()` do pai; **nunca** adiciona `:state(invalid)` quando o pai não é form-associated (`<div>` sem `.validity`) — o negativo de Edge case 4 |
| Página de `website/docs/components/validity.mdx` e traduções | `writer` | — |

---

**Criado em**: 2026-09-07
**Atualizado em**: 2026-09-07
**Versão**: 1.0
