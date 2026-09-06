# DESIGN — `kb-label`

**Pacote**: `src/typography/label/`
**Tag**: `<kb-label>`
**Status**: documentação retroativa — a implementação precede este documento
**Data**: 2026-09-06

---

Este documento segue o framework LLD (5 passos) e registra o comportamento de `kb-label`
tal como implementado. Ele é a fonte da verdade: quando a implementação divergir dele, é a
implementação que está errada, não o inverso. Mudança de comportamento passa primeiro por
uma revisão deste documento, depois pelo código — nunca o contrário.

O pacote foi escrito antes de qualquer processo formal de design neste repositório e nunca
teve especificação própria.

## Visão Geral

`kb-label` é o **texto de rótulo** de um campo ou controle de formulário: um `<slot>`
estilizado pelos tokens de tipografia, com uma única responsabilidade de comportamento —
**colocar a si mesmo no slot `label`** do componente-pai ao conectar, para que o consumidor
não precise escrever `slot="label"` à mão.

O que ele **não** é: texto de corpo (`kb-text`, que tem os seis eixos de aparência como
attribute), texto auxiliar de campo (`kb-helper`, o irmão gêmeo que mira o slot `helper`),
nem um `<label for>` nativo — não associa `for`/`id`, não move foco ao ser clicado; a
associação acessível é responsabilidade do componente-pai que expõe o slot.

`kb-label` e `kb-helper` são o mesmo elemento com um nome de slot e três tokens diferentes.
A duplicação é deliberada e mínima (ver seção 3).

---

## 1. Requisitos

| Pergunta (LLD passo 1) | Resposta |
|---|---|
| Quem consome, em que contexto | Filho direto de um componente de formulário que expõe o slot `label` — `kb-input`, `kb-textarea`, `kb-fileupload` |
| Somente leitura ou interativo | Somente leitura — nenhum estado, nenhum evento, nenhum foco próprio |
| Caso de uso mínimo (MVP) | Renderizar o texto do rótulo na tipografia certa e assumir `slot="label"` sozinho |
| Participa de `<form>` | Não diretamente — é conteúdo do componente de campo, que participa |
| Papel e nome acessível | Nenhum próprio — sem `Identity`; a associação rótulo↔controle é do componente-pai |
| Superfície de variação | Nenhuma — não há attribute; aparência vem de custom properties `--label-*` |
| Sub-elemento interno | Nenhum. O shadow root é um único `<slot>` |

**Requisitos funcionais**

1. Renderiza um `<slot>` default (`component.js`).
2. No `@connected`, executa `[slottable]()`, que faz `this.setAttribute('slot', 'label')` e
   retorna `this` (`label.ts`).
3. O `:host` recebe cor, família, tamanho, peso e entrelinha por custom property, com
   fallback em token global (`style.js`).
4. `text-align: left` fixo no `:host` — o rótulo não é reconfigurável de alinhamento.

**Não-requisitos (YAGNI, rule 023)**

- Attributes de aparência (`color`, `size`) — `kb-text` tem esse papel; `kb-label` é o
  rótulo com um tamanho só, ajustável por CSS quando preciso.
- `for` / associação nativa — o componente de campo faz a associação por
  `ElementInternals`/`aria-labelledby`; duplicar aqui criaria duas fontes de verdade.
- Evento próprio, `Echo`, `on` — o rótulo não recebe nem emite; não há arco a ligar.
- `Identity` / papel — um rótulo dentro de um campo não tem papel ARIA próprio a publicar.
- `Hidden` — um rótulo condicional é omitido pelo consumidor.

---

## 2. Contrato Público

### Attributes / Properties

Nenhum. `kb-label` não tem attribute nem propriedade pública — o `types.d.ts` declara
`KUBALabelElement extends HTMLElement {}`, um corpo vazio, e é o correto.

### Events

Nenhum.

### Slots

Um `<slot>` default sem nome — o texto do rótulo e markup inline leve.

### Parts

Nenhum, e nenhum a ter.

### Custom properties de CSS (pontos de extensão)

| Custom property | Fallback | Controla |
|---|---|---|
| `--label-color` | `var(--color-master-dark)` | Cor do rótulo |
| `--label-font-family` | `var(--font-family-base)` | Família |
| `--label-font-size` | `var(--font-size-xxs)` | Tamanho |
| `--label-font-weight` | `var(--font-weight-medium)` | Peso — `medium`, mais forte que o default de `kb-helper` (`regular`) |
| `--label-line-height` | `var(--line-height-default)` | Entrelinha |

Todos os fallbacks são token global, sem literal — nenhum valor é interpolado a partir de
entrada, então **não há vetor de injeção de CSS** neste pacote.

**Rule 037 (flag arguments)**: nenhum attribute — nenhuma flag.

---

## 3. Composição

**Cadeia**: `HTMLElement` — sem mixin.

`kb-label` não compõe nenhum mixin. Não precisa de `Echo` (não há arco), de `Identity` (não
há papel), de `Hidden`/`Width`/`Height` (não há eixo de layout). A única lógica é o hook
`@connected`.

**Sub-elemento**: nenhum. `<slot>` no shadow root, sem segunda tag pública.

**Symbol privado**: `slottable` (`interfaces.js`) — `Symbol('slottable')` **local**. Chave
do método que roda no connect para assumir `slot="label"`. Não atravessa fronteira de
pacote (declarante e único consumidor são `label.ts`), por isso `Symbol()` e não
`Symbol.for()`. O `interfaces.js` existe aqui exatamente porque há um Symbol a declarar.

**`attachInternals()`**: não é chamado — sem mixin que precise de `internals`, e o elemento
não publica semântica.

**Foco**: `attachShadow({ mode: 'open' })`, sem `delegatesFocus` — nada focável dentro.

**Duplicação com `kb-helper`**: os dois pacotes são byte a byte iguais em `label.ts` /
`helper.ts` (trocando `label`→`helper` e o nome da classe), `component.js` e
`interfaces.js`; divergem só no nome do slot e em três tokens do `style.js`
(`font-size`, `font-weight`, `line-height`). A duplicação foi mantida — não extraída para um
mixin `Slottable(slotName)` — porque o corpo real duplicado é uma linha (`setAttribute`), e
um mixin parametrizado por string introduziria uma indireção maior que o código que
economiza (rule 064). Se um terceiro elemento-slot aparecer, a conta muda e o mixin passa a
valer.

---

## 4. Gestão de Estado

| Dado | Onde mora | Controlado? | Regra de sincronização |
|---|---|---|---|
| `slot="label"` | attribute no próprio elemento | Escrito uma vez pelo elemento | `[slottable]()` no `@connected` — `setAttribute('slot', 'label')`. Não é reavaliado; se o consumidor remover o attribute depois, o elemento não o repõe |

**Nenhum estado privado, nenhum campo `#`, nenhum estado derivado.** O elemento é
inteiramente sem estado além do attribute `slot` que ele mesmo escreve no connect.

---

## 5. Edge Cases

| # | Caso | Comportamento requerido |
|---|---|---|
| 1 | `<kb-label>` fora de um componente com slot `label` | Assume `slot="label"` mesmo assim; sem um pai que exponha esse slot, o elemento renderiza no light DOM normalmente. Sem erro |
| 2 | Consumidor já definiu `slot="label"` à mão | `setAttribute` reescreve com o mesmo valor — idempotente, sem efeito colateral |
| 3 | Consumidor definiu `slot="algo-diferente"` | `[slottable]()` sobrescreve para `label` no connect — o elemento impõe seu slot. É comportamento deliberado (o propósito do pacote), não uma surpresa a corrigir |
| 4 | `slot` removido depois do connect | Não é reposto — `[slottable]()` só roda no `@connected`. O consumidor que remove assume a consequência |
| 5 | Reconexão (mover o elemento no DOM) | `@connected` roda de novo a cada `connectedCallback` — o slot é reafirmado |
| 6 | Tokens `--label-*` não definidos | Cada um cai no fallback de token global (`style.js`) |
| 7 | Leitor de tela | Anuncia o conteúdo do slot como parte do rótulo do campo, via a associação que o componente-pai estabelece — `kb-label` não acrescenta papel |
| 8 | Conteúdo vazio (`<kb-label></kb-label>`) | Caixa `inline-flex` vazia; o campo fica sem rótulo visível. Não há aviso — é responsabilidade do consumidor |

Coberto por teste: `label.test.js` — "assigns itself to the label slot on connect".

---

## Divisão de trabalho entre ofícios

| Área | Ofício responsável | Status |
|---|---|---|
| Decisão de não usar mixin, Symbol `slottable` local, duplicação vs. mixin `Slottable` | `architect` | Concluído |
| Tokens `--label-*` (os três que divergem de `kb-helper`) | `designer` | **Pendente** — nunca houve revisão formal |
| Implementação de `[slottable]()` e `@connected` | `developer` | Concluído |
| Prova do requisito de auto-slot | `tester` | Concluído — `label.test.js` |
| Página de `website/docs/components/label.mdx` e traduções | `writer` | — |

---

**Criado em**: 2026-09-06
**Atualizado em**: 2026-09-06
**Versão**: 1.0
