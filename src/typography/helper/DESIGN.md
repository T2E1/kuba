# DESIGN — `kb-helper`

**Pacote**: `src/typography/helper/`
**Tag**: `<kb-helper>`
**Status**: documentação retroativa — a implementação precede este documento
**Data**: 2026-09-06

---

Este documento segue o framework LLD (5 passos) e registra o comportamento de `kb-helper`
tal como implementado. Ele é a fonte da verdade: quando a implementação divergir dele, é a
implementação que está errada, não o inverso. Mudança de comportamento passa primeiro por
uma revisão deste documento, depois pelo código — nunca o contrário.

O pacote foi escrito antes de qualquer processo formal de design neste repositório e nunca
teve especificação própria.

## Visão Geral

`kb-helper` é o **texto auxiliar** de um campo de formulário — dica, instrução ou mensagem
de erro — estilizado pelos tokens de tipografia, com uma única responsabilidade de
comportamento: **colocar a si mesmo no slot `helper`** do componente-pai ao conectar, para
que o consumidor não precise escrever `slot="helper"` à mão.

É o irmão gêmeo de `kb-label`: o mesmo elemento, com o nome de slot `helper` em vez de
`label` e três tokens de tipografia menores (texto auxiliar recua em relação ao rótulo).
Ver `label/DESIGN.md` seção 3 para a justificativa de manter os dois pacotes separados em
vez de um mixin `Slottable`.

O que ele **não** é: texto de corpo (`kb-text`), rótulo de campo (`kb-label`), nem o
mecanismo de validação — `kb-helper` renderiza a mensagem de erro que o componente de campo
decide mostrar; ele não avalia validade nem alterna estado.

---

## 1. Requisitos

| Pergunta (LLD passo 1) | Resposta |
|---|---|
| Quem consome, em que contexto | Filho direto de um componente de formulário que expõe o slot `helper` — `kb-input`, `kb-textarea`, `kb-fileupload` |
| Somente leitura ou interativo | Somente leitura — nenhum estado, nenhum evento, nenhum foco próprio |
| Caso de uso mínimo (MVP) | Renderizar o texto auxiliar na tipografia certa e assumir `slot="helper"` sozinho |
| Participa de `<form>` | Não diretamente — é conteúdo do componente de campo |
| Papel e nome acessível | Nenhum próprio — sem `Identity`; a associação texto-auxiliar↔controle (`aria-describedby`) é do componente-pai |
| Superfície de variação | Nenhuma — não há attribute; aparência vem de custom properties `--helper-*` |
| Sub-elemento interno | Nenhum. O shadow root é um único `<slot>` |

**Requisitos funcionais**

1. Renderiza um `<slot>` default (`component.js`).
2. No `@connected`, executa `[slottable]()`, que faz `this.setAttribute('slot', 'helper')` e
   retorna `this` (`helper.ts`).
3. O `:host` recebe cor, família, tamanho, peso e entrelinha por custom property, com
   fallback em token global (`style.js`).
4. `text-align: left` fixo no `:host`.

**Não-requisitos (YAGNI, rule 023)**

- Attributes de aparência — `kb-text` tem esse papel.
- Avaliar validade / alternar entre "dica" e "erro" — o componente de campo decide o que
  colocar no slot; `kb-helper` só o estiliza.
- `aria-describedby` / associação nativa — feita pelo componente-pai.
- Evento próprio, `Echo`, `on` — não recebe nem emite.
- `Identity` / papel, `Hidden` — mesma razão de `kb-label`.

---

## 2. Contrato Público

### Attributes / Properties

Nenhum. `types.d.ts` declara `KUBAHelperElement extends HTMLElement {}`, corpo vazio, e é o
correto.

### Events

Nenhum.

### Slots

Um `<slot>` default sem nome — o texto auxiliar e markup inline leve.

### Parts

Nenhum, e nenhum a ter.

### Custom properties de CSS (pontos de extensão)

| Custom property | Fallback | Controla |
|---|---|---|
| `--helper-color` | `var(--color-master-dark)` | Cor do texto auxiliar |
| `--helper-font-family` | `var(--font-family-base)` | Família |
| `--helper-font-size` | `var(--font-size-xxxs)` | Tamanho — `xxxs`, um passo abaixo do `xxs` de `kb-label` |
| `--helper-font-weight` | `var(--font-weight-regular)` | Peso — `regular`, mais leve que o `medium` de `kb-label` |
| `--helper-line-height` | `var(--line-height-lg)` | Entrelinha — `lg`, mais folgada que o `default` de `kb-label` |

Todos os fallbacks são token global, sem literal — nenhum valor é interpolado a partir de
entrada, então **não há vetor de injeção de CSS** neste pacote.

**Rule 037 (flag arguments)**: nenhum attribute — nenhuma flag.

---

## 3. Composição

**Cadeia**: `HTMLElement` — sem mixin.

Idêntica a `kb-label`: nenhum mixin, só o hook `@connected`.

**Sub-elemento**: nenhum.

**Symbol privado**: `slottable` (`interfaces.js`) — `Symbol('slottable')` **local**, chave
do método que assume `slot="helper"` no connect. `Symbol()` e não `Symbol.for()` porque não
atravessa fronteira de pacote.

**`attachInternals()`**: não é chamado.

**Foco**: `attachShadow({ mode: 'open' })`, sem `delegatesFocus`.

**Duplicação com `kb-label`**: ver `label/DESIGN.md` seção 3. A decisão de manter dois
pacotes em vez de um mixin `Slottable(slotName)` vale para os dois lados igualmente; se um
terceiro elemento-slot aparecer, a extração passa a compensar.

---

## 4. Gestão de Estado

| Dado | Onde mora | Controlado? | Regra de sincronização |
|---|---|---|---|
| `slot="helper"` | attribute no próprio elemento | Escrito uma vez pelo elemento | `[slottable]()` no `@connected` — `setAttribute('slot', 'helper')`. Não é reavaliado depois do connect |

**Nenhum estado privado, nenhum campo `#`, nenhum estado derivado.**

---

## 5. Edge Cases

| # | Caso | Comportamento requerido |
|---|---|---|
| 1 | `<kb-helper>` fora de um componente com slot `helper` | Assume `slot="helper"` mesmo assim; sem pai que exponha o slot, renderiza no light DOM. Sem erro |
| 2 | Consumidor já definiu `slot="helper"` à mão | `setAttribute` reescreve com o mesmo valor — idempotente |
| 3 | Consumidor definiu `slot="algo-diferente"` | `[slottable]()` sobrescreve para `helper` no connect — comportamento deliberado |
| 4 | `slot` removido depois do connect | Não é reposto — `[slottable]()` só roda no `@connected` |
| 5 | Reconexão (mover o elemento no DOM) | `@connected` roda de novo — o slot é reafirmado |
| 6 | Tokens `--helper-*` não definidos | Cada um cai no fallback de token global |
| 7 | Mensagem de erro trocada dinamicamente pelo componente-pai | `kb-helper` não participa — o pai troca o conteúdo do slot; `kb-helper` só estiliza o que estiver lá |
| 8 | Leitor de tela | Anuncia o conteúdo via `aria-describedby` que o componente-pai estabelece — `kb-helper` não acrescenta papel |
| 9 | Conteúdo vazio | Caixa `inline-flex` vazia, sem aviso |

Coberto por teste: `helper.test.js` — "assigns itself to the helper slot on connect".

---

## Divisão de trabalho entre ofícios

| Área | Ofício responsável | Status |
|---|---|---|
| Decisão de não usar mixin, Symbol `slottable` local, duplicação vs. mixin `Slottable` | `architect` | Concluído |
| Tokens `--helper-*` (os três que divergem de `kb-label`: `xxxs`/`regular`/`lg`) e a relação de recuo com o rótulo | `designer` | **Pendente** — nunca houve revisão formal |
| Implementação de `[slottable]()` e `@connected` | `developer` | Concluído |
| Prova do requisito de auto-slot | `tester` | Concluído — `helper.test.js` |
| Página de `website/docs/components/helper.mdx` e traduções | `writer` | — |

---

**Criado em**: 2026-09-06
**Atualizado em**: 2026-09-06
**Versão**: 1.0
