# DESIGN — `kb-inset`

**Pacote**: `src/layout/inset/`
**Tag**: `<kb-inset>`
**Status**: especificação — registrada após a implementação, como referência do contrato
**Data**: 2026-09-06

---

Este documento segue o framework LLD (5 passos) e registra o comportamento de `kb-inset`
tal como implementado. Ele é a fonte da verdade: quando a implementação divergir dele, é a
implementação que está errada, não o inverso. Mudança de comportamento passa primeiro por
uma revisão deste documento, depois pelo código — nunca o contrário.

**Nota**: numa passagem de 2026-09-06 (working tree) `direction` e `side` ganharam
validação por conjunto fechado (`enumerated`, com os enums `direction.js`/`side.js`), o
fallback `margin[side] || margin.all` de `style.js` foi removido (o `side` sempre resolve
válido agora), e o `types.d.ts` foi corrigido: publicava `internals` como propriedade do
contrato e **não declarava** `alt` (`Identity`), `on` (`Echo`), `height` (`Height`),
`hidden` (`Hidden`) nem `width` (`Width`) — exatamente a divergência que
`.claude/skills/types/references/achatamento-mixins.md` citava por nome. Este documento
descreve o estado depois dessa passagem.

## Visão Geral

`kb-inset` é o **contraveneno de padding**: cancela o padding de um ancestral nos lados que
você nomear, via margem negativa, para que o conteúdo de um filho sangre até as bordas
daquele ancestral — a imagem full-width no topo de um card com padding. É escotilha de
escape para **um** filho, não um layout para muitos: flexiona o conteúdo, corta o overflow
(`overflow: hidden`), e arredonda os cantos que ficam por dentro.

O que ele **não** é: um distribuidor de espaço entre irmãos (isso é `kb-stack` — inset
*remove* espaço, não distribui), uma superfície visível (`kb-card`), nem um centralizador
de conteúdo de página (`kb-main`, que já limita largura e centraliza).

A escolha estruturante é que a distância da sangria é **fixa** (uma custom property, default
16px), não medida do pai — o contrato é "case o `--inset-space-bleed` com o padding do pai".
Dentro de um pai sem padding, a margem negativa puxa o conteúdo para *fora* do pai.

---

## 1. Requisitos

| Pergunta (LLD passo 1) | Resposta |
|---|---|
| Quem consome, em que contexto | Filho de uma superfície com padding — tipicamente `kb-card` — que precisa de uma faixa de mídia ou um divisor de ponta a ponta |
| Somente leitura ou interativo | Estrutural — não interage, só organiza e sangra o que está dentro; recebe via `on` |
| Caso de uso mínimo (MVP) | Um `<slot>` flex com margem negativa em todos os lados (`side="all"`) |
| Participa de `<form>` | Não |
| Papel e nome acessível | `role="none"` fixo (`[role]` do host, publicado por `Identity`); `alt` herdado mas raramente significativo |
| Superfície de variação | `direction`, `side` — conjunto fechado; `width`/`height`/`hidden` via mixins; `on` via `Echo` |
| Sub-elemento interno | Nenhum. O shadow root é um único `<slot>` |

**Requisitos funcionais**

1. Renderiza um `<slot>` default; o `:host` vira `display: flex` com `box-sizing:
   border-box` e `overflow: hidden` (`component.js`, `style.js`).
2. `side` seleciona quais bordas recebem a margem negativa e quais cantos permanecem
   arredondados — cada valor keya os mapas `margin` e `borderRadius` de `style.js`.
3. `direction` aplica `flex-direction`, interpolado **direto** (não roteado por custom
   property).
4. A sangria é uma margem negativa construída uma vez de `--inset-space-bleed` via
   `calc(... * -1)` — fonte única da distância para toda combinação de lados.
5. `side` e `direction` são validados contra um `Object.freeze` local
   (`side.js` / `direction.js`) via `enumerated(...)` no `@attributeChanged`: um valor fora
   do conjunto nunca chega ao setter, e a propriedade mantém o último valor válido
   (`'all'` / `'column'` até que um seja definido).
6. Cada mudança dispara `@retouch` — re-executa só `style`, sem re-renderizar markup.
7. `margin` é declarada `!important` (`style.js`), para sobreviver a um pai que aplique
   margens nos filhos.
8. Publica `role="none"` em `internals.role` no connect (`Identity` lê `[role]`).
9. `hidden` alterna `:host(:state(hidden)) { display: none }`.

**Não-requisitos (YAGNI, rule 023)**

- Medir o padding do pai em runtime para casar a sangria — a distância é fixa por contrato;
  medir criaria acoplamento frágil ao layout do pai. Ver Edge case 3.
- Ser um contêiner de layout geral — `direction` existe para arranjar o que pertence à
  sangria, não para substituir `kb-stack`.
- Evento próprio — `Echo` entra como receptor de arco, não emissor.
- `gap` / `spacing` como attribute — não é um distribuidor de espaço.

---

## 2. Contrato Público

### Attributes / Properties

| Nome | Tipo | Default | Reflete | Especificação |
|---|---|---|---|---|
| `direction` | `KUBAInsetDirectionAttribute` (`row` \| `column`) | `'column'` | não | `enumerated(DIRECTIONS)` no `@attributeChanged` + `@retouch`. Interpolado direto em `flex-direction` — o conjunto fechado é a barreira contra injeção de CSS |
| `side` | `KUBAInsetSideAttribute` (`all` \| `top` \| `bottom` \| `left` \| `right` \| `x` \| `y`) | `'all'` | não | `enumerated(SIDES)` + `@retouch`. Keya os mapas `margin`/`borderRadius` de `style.js` |
| `width` | `KUBAInsetSizeAttribute \| (string & {})` | `'auto'` | não | Herdado de `Width`. Normalizado por `resizing`/`toSizeString`: `{n}px`/`{n}%` passam, `hug`→`auto`, `fill`→`100%`, resto→`auto` |
| `height` | `KUBAInsetSizeAttribute \| (string & {})` | `'auto'` | não | Herdado de `Height`, mesma normalização |
| `hidden` | `boolean` | `false` | sim | Herdado de `Hidden`. Alterna `:state(hidden)` e `display: none` |
| `alt` | `string` | `''` | sim | Herdado de `Identity` → `internals.ariaLabel`. Raramente significativo — o host é presentational |
| `on` | `KUBAInsetOnAttribute \| (string & {})` | — | não | Herdado de `Echo`. Fiação de arco, `source/event:type/sink` |

O getter `internals` existe em runtime (`inset.ts`, lazy via `??=`), consumido pelos mixins
`Hidden` e `Identity`, mas **não é publicado em `types.d.ts`** — é uso interno dos mixins,
não contrato do consumidor (mesma convenção de `button`/`icon`/`cover`).

### Events

Nenhum. `kb-inset` não despacha nada; `on` apenas recebe.

### Slots

Um `<slot>` default sem nome — qualquer coisa, mas mídia é o caso comum; `overflow: hidden`
faz uma imagem maior que a caixa ser cortada pelos cantos arredondados.

### Parts

Nenhum, e nenhum a ter.

### Custom properties de CSS (pontos de extensão)

| Custom property | Default | Controla |
|---|---|---|
| `--inset-space-bleed` | `var(--spacing_inset-xs)` (16px) | Quanto o conteúdo sai para fora em cada lado nomeado. Aplicado como margem negativa via `calc(... * -1)` |
| `--inset-border-radius` | `var(--border-radius-sm)` (8px) | Arredondamento dos cantos que ficam na borda do pai |

`direction` é aplicado direto no host, sem custom property equivalente.

**Rule 037 (flag arguments)**: nenhum attribute booleano de comportamento — `hidden` é
estado de plataforma, não flag de ramificação.

---

## 3. Composição

**Cadeia**: `Identity(Echo(Height(Hidden(Width(HTMLElement)))))`

| Mixin | Traz | Por que entra na cadeia |
|---|---|---|
| `Width` | `width` normalizado + `@retouch` | Faz parte da superfície de variação de layout do inset |
| `Hidden` | `hidden` + `:state(hidden)` | Visibilidade é estado de plataforma |
| `Height` | `height` normalizado + `@retouch` | Idem `Width` |
| `Echo` | Attribute `on`, roteamento do barramento de arcos, aceitação de `<kb-on>` filhos | A linha de base que todo elemento consumível compartilha — um consumidor pode dirigir `<kb-inset>` declarativamente. Entra como **receptor** |
| `Identity` | `alt` → `internals.ariaLabel`; publica `[role]` do host em `internals.role` no connect | O inset é uma caixa de layout sem significado próprio; sem `role="none"` o host vira um nó `generic` em volta do conteúdo |

**Sobre `alt` vir junto com `Identity`**: `Identity` é aplicado pelo `role`, mas contribui
**dois** membros — `[role]` (Symbol interno, fora do contrato) e `alt` (attribute público).
`kb-inset` herda `alt` e ele **é** contrato público, ainda que raramente útil: um inset é
presentational e o conteúdo dentro mantém a própria semântica. Não há decisão de removê-lo —
diferente de `kb-stack`, que trocou `Identity` por `Presentational` (a metade só-papel) por
essa razão. Se a auditoria seguinte concluir que `kb-inset` também não deveria aceitar
`alt`, o caminho é `Presentational` na cadeia, e é decisão do `architect`.

**Sub-elemento**: nenhum. `<slot>` no shadow root, sem segunda tag pública (rule 064).

**Symbol privado**: nenhum próprio. `[role]` vem de `packages/mixin/identity/interfaces.js`
(`Symbol.for('role')`, contrato entre mixin e host); `kb-inset` **implementa**
`get [role]() { return 'none' }` e o mixin lê no connect.

**`attachInternals()`**: uma única chamada, lazy, no próprio elemento — compartilhada por
`Hidden` e `Identity`.

**Foco**: `attachShadow({ mode: 'open' })` no constructor, sem `delegatesFocus` — o inset
não é focável e o conteúdo sangrado mantém o próprio comportamento de foco.

---

## 4. Gestão de Estado

| Dado | Onde mora | Controlado? | Regra de sincronização |
|---|---|---|---|
| `direction` | `#direction` + attribute | Controlado — DOM é a fonte da verdade | `@attributeChanged('direction', enumerated(DIRECTIONS))` filtra o caminho de attribute; `@retouch` reprocessa o estilo |
| `side` | `#side` + attribute | Controlado | `@attributeChanged('side', enumerated(SIDES))` + `@retouch` |
| `width` | `#width` (no mixin `Width`) + attribute | Controlado | `@attributeChanged('width', resizing)` no mixin + `toSizeString` inline no setter (guarda os dois caminhos); `@retouch` |
| `height` | `#height` (no mixin `Height`) + attribute | Controlado | Idem `Width` |
| `hidden` | mixin `Hidden` + attribute | Controlado | `@attributeChanged('hidden', booleanAttribute)`; espelha em `internals.states` |
| `alt` | mixin `Identity` + attribute | Controlado | `@attributeChanged('alt')` → `internals.ariaLabel` |
| papel (`none`) | `internals.role` | Derivado | Literal fixo, escrito uma vez no connect por `Identity` |

**Nenhum estado derivado** além do papel — `direction` e `side` são espelho direto do que o
consumidor escreve, filtrado pelo enum. Cada default resolve via `??=` no getter, a partir
da constante (`DIRECTIONS.COLUMN`, `SIDES.ALL`).

**Atributo vs. propriedade, após rejeição**: quando um valor de `direction`/`side` é
rejeitado, o *attribute* no DOM continua mostrando o valor escrito; só a *propriedade* cai
para o último válido, porque `enumerated` não chama o setter.

**`@retouch` e não `@repaint`**: `direction` e `side` só afetam o `style` — o markup (um
`<slot>`) nunca muda. `@retouch` replica só o `cssCallback`. É a distinção certa, e
divergente de `kb-text`, que usa `@repaint` no caso equivalente.

---

## 5. Edge Cases

| # | Caso | Comportamento requerido |
|---|---|---|
| 1 | `<kb-inset>` sem attribute | `side` cai em `'all'`, `direction` em `'column'` via `??=`; sangra em todas as bordas, arredonda os quatro cantos |
| 2 | `side`/`direction` com keyword desconhecida | `enumerated` rejeita; a propriedade mantém o último válido. O attribute no DOM mostra o valor rejeitado. Coberto por teste (`inset.test.js`, "keeps the default direction when the attribute is not a known keyword") |
| 3 | Pai sem padding | A margem negativa puxa o conteúdo para **fora** do pai, não para a borda. A sangria é fixa, não medida — documentado em `inset.mdx` § "When not to use" |
| 4 | `--inset-space-bleed` não casa com o padding do pai | O conteúdo para antes da borda (bleed menor) ou passa dela (bleed maior). O contrato é casar os dois valores |
| 5 | `direction` com payload de injeção de CSS | `enumerated(DIRECTIONS)` rejeita a string inteira antes do setter — nenhuma regra injetada chega à folha adotada. Coberto por teste (`inset.test.js`, "rejects a CSS injection payload carried by the direction attribute") |
| 6 | Escrita direta de propriedade com payload (`inset.direction = payload`) | **Não filtrado** — decisão explícita, mesma de `button`/`card`/`stack`/`icon`/`text` |
| 7 | Conteúdo mais alto que um `height` fixo | `overflow: hidden` corta em silêncio. `inset.mdx` recomenda deixar `height` automático a menos que o corte seja intencional |
| 8 | `hidden` | `:state(hidden)` + `display: none` — remove o elemento e o conteúdo de layout e da árvore de acessibilidade |
| 9 | Pai aplica `margin` nos filhos | A `margin` do inset é `!important` e sobrevive; não é sobreponível de fora por `margin` simples — muda-se a custom property |
| 10 | Valor recebido via arco (`on="#toggle/changed:setter/hidden"`) | Chega ao setter `hidden`; `Echo` na cadeia é o que observa `on`. Coberto por teste (`inset.test.js`, "receives a keyword through an arc, as an Echo sink") |
| 11 | `<kb-on>` como filho | Aceito — `Echo` na cadeia. Adiciona arcos além do único attribute `on` |
| 12 | Leitor de tela | O host é `role="none"`; o conteúdo sangrado mantém a própria semântica, e a margem negativa não altera ordem de leitura nem de foco |

---

## Divisão de trabalho entre ofícios

| Área | Ofício responsável | Status |
|---|---|---|
| Contrato público, cadeia de mixins, decisão sobre `alt` herdado (manter vs. trocar por `Presentational`) | `architect` | **Pendente** — `alt` documentado como herdado, decisão de forma em aberto |
| Granularidade dos enums `direction`/`side`, mapa de cantos por lado | `designer` | **Pendente** — nunca houve revisão formal |
| Implementação de `enumerated` nos dois `@attributeChanged`, remoção do fallback de `style.js`, correção de `types.d.ts` | `developer` | Concluído (working tree) |
| Tokens `--inset-space-bleed` / `--inset-border-radius` e a relação de casamento com o padding do pai | `designer` | **Pendente** |
| Prova de cada requisito e edge case, incluindo o vetor de injeção em `direction` | `tester` | Concluído — `inset.test.js` |
| Páginas de `website/docs/components/inset.mdx` e traduções `es`/`pt-br` | `writer` | Concluído (working tree) |

---

**Criado em**: 2026-09-06
**Atualizado em**: 2026-09-06
**Versão**: 1.0
