# DESIGN — `kb-main`

**Pacote**: `src/layout/main/`
**Tag**: `<kb-main>`
**Status**: especificação — registrada após a implementação, como referência do contrato
**Data**: 2026-09-06

---

Este documento segue o framework LLD (5 passos) e registra o comportamento de `kb-main`
tal como implementado. Ele é a fonte da verdade: quando a implementação divergir dele, é a
implementação que está errada, não o inverso. Mudança de comportamento passa primeiro por
uma revisão deste documento, depois pelo código — nunca o contrário.

**Nota**: `types.d.ts` corrigido em 2026-09-06 (working tree) — publicava `internals` como
propriedade do contrato, divergindo do padrão de `button`/`icon`/`cover` (mesmo getter na
classe, não publicado no `types.d.ts`, porque é uso interno do mixin `Identity`, não
contrato do consumidor). O JSDoc de `alt` também foi enriquecido.

## Visão Geral

`kb-main` é o **corpo de uma página**: uma coluna centralizada, limitada a uma largura
legível, com padding, com um gap consistente entre os filhos diretos, e alta o suficiente
para empurrar o rodapé para o fim de páginas curtas. É a terceira peça do frame da página —
`<kb-header>` em cima, `kb-main` no meio, `<kb-footer>` embaixo.

O que ele **não** é: uma seção dentro da página (há só um `main` por página; um grupo de
seção é `kb-stack`/`kb-card`), um layout full-bleed (a coluna é limitada e centralizada por
desenho; conteúdo que precisa varrer a viewport sai dela ou usa `kb-inset`), nem um layout
de duas colunas (é uma única coluna flex; para lado a lado, aninha-se um
`<kb-stack direction="row">`).

A escolha estruturante é que a **altura mínima** é `calc(100svh - var(--main-size-offset,
144px))`, onde 144px = 72px do header + 72px do footer. Trocar qualquer uma das três
alturas obriga a trocar as três juntas.

---

## 1. Requisitos

| Pergunta (LLD passo 1) | Resposta |
|---|---|
| Quem consome, em que contexto | O root de uma página, tipicamente filho de `<body>`, uma vez por página, entre header e footer |
| Somente leitura ou interativo | Estrutural — não interage, não tem estado, não despacha evento |
| Caso de uso mínimo (MVP) | Um `<slot>` que centraliza a coluna, limita a largura, aplica padding e gap, e carrega o landmark `main` |
| Participa de `<form>` | Não |
| Papel e nome acessível | `role="main"` fixo (`[role]` do host, publicado por `Identity`); `alt` opcional para páginas com mais de uma região `main`-like |
| Superfície de variação | Nenhum attribute próprio — a variação inteira vive em custom properties `--main-*`; `alt` herdado de `Identity` |
| Sub-elemento interno | Nenhum. O shadow root é um único `<slot>` |

**Requisitos funcionais**

1. Renderiza um `<slot>` default; o `:host` vira `display: flex; flex-direction: column`
   com `margin: 0 auto` (`component.js`, `style.js`).
2. Limita a largura a `--main-size-max-width` (default `480px`) e ocupa `100%` até esse cap.
3. Aplica `gap` entre filhos diretos via `--main-space-gap` (default
   `var(--spacing_inset-md)`) e padding via `--main-space-inset` (default
   `var(--spacing_inset-xs)`).
4. `min-height: calc(100svh - var(--main-size-offset, 144px))` — mantém o rodapé no fim de
   páginas curtas.
5. Publica `role="main"` em `internals.role` no connect (`Identity` lê `[role]`), como
   semântica default — um `role` do autor ainda vence.
6. `alt` escreve `internals.ariaLabel` (mixin `Identity`).

**Não-requisitos (YAGNI, rule 023)**

- Attributes de layout (`max-width`, `gap` como attribute) — são decisão de estilo, não de
  comportamento; custom properties cobrem, inclusive respondendo a media query, o que um
  attribute não faz.
- Medir as alturas reais de header/footer — o offset é um número que o consumidor mantém em
  sincronia; medir criaria acoplamento a dois elementos irmãos. Ver Edge case 3.
- `Hidden` — não faz sentido esconder o corpo inteiro da página.
- Evento próprio, `Echo`, `on` — `kb-main` não recebe nem emite arco; é o contêiner mais
  externo, sem par a quem se ligar.
- Múltiplas instâncias — há um `main` por página por definição.

---

## 2. Contrato Público

### Attributes / Properties

| Nome | Tipo | Default | Reflete | Especificação |
|---|---|---|---|---|
| `alt` | `string` | `''` | sim | Herdado de `Identity` → `internals.ariaLabel`. Só significativo numa página que carregue mais de uma região `main`-like; deixe indefinido nas demais |

O getter `internals` existe em runtime (`main.ts`, lazy via `??=`), consumido pelo mixin
`Identity`, mas **não é publicado em `types.d.ts`** — mesma convenção de
`button`/`icon`/`cover`.

Nenhum outro attribute — a cadeia é `Identity(HTMLElement)`, então só `alt` é contribuído.
Sem `hidden`, `width`, `height`, `on`.

### Events

Nenhum. O componente não interage.

### Slots

Um `<slot>` default sem nome — seções, cards e headings como filhos diretos, empilhados
verticalmente com o gap embutido.

### Parts

Nenhum, e nenhum a ter.

### Custom properties de CSS (pontos de extensão)

| Custom property | Default | Controla |
|---|---|---|
| `--main-size-max-width` | `480px` (literal) | Cap da coluna de conteúdo |
| `--main-space-inset` | `var(--spacing_inset-xs)` | Padding ao redor da coluna |
| `--main-space-gap` | `var(--spacing_inset-md)` | Gap vertical entre filhos diretos |
| `--main-size-offset` | `144px` (literal) | Altura subtraída da viewport para a altura mínima — o header mais o footer |

**Rule 037 (flag arguments)**: nenhum attribute booleano — `alt` é `string`.

---

## 3. Composição

**Cadeia**: `Identity(HTMLElement)`

| Mixin | Traz | Por que entra na cadeia |
|---|---|---|
| `Identity` | `alt` → `internals.ariaLabel`; publica `[role]` do host (`'main'`) em `internals.role` no connect | O shadow root é um `<slot>` puro, então nada dentro carrega o landmark — o host tem que ser ele. `Identity` provê papel + nome sem reimplementar leitura/escrita de `internals` |

**Sobre `alt` vir junto com `Identity`**: `Identity` contribui `[role]` (Symbol interno) e
`alt` (attribute público). `kb-main` quer o `role`, e `alt` vem junto — mas aqui ele **tem**
uso legítimo: a spec de ARIA permite mais de uma região `main`-like distinguidas por nome
acessível, e é o único caso em que definir `alt` num `kb-main` faz sentido. Diferente de
`kb-stack` (que trocou `Identity` por `Presentational` por não ter nome a publicar),
`kb-main` mantém `Identity` inteiro de propósito.

**Sobre não usar `Hidden`/`Width`/`Height`/`Echo`**: nenhum tem uso — ver
"Não-requisitos". Herdar seria herança recusada (rule 059).

**Sub-elemento**: nenhum. `<slot>` no shadow root, sem segunda tag pública (rule 064).

**Symbol privado**: nenhum próprio. `[role]` vem de
`packages/mixin/identity/interfaces.js` (`Symbol.for('role')`); `kb-main` **implementa**
`get [role]() { return 'main' }` e o mixin lê no connect.

**`attachInternals()`**: uma única chamada, lazy, no próprio elemento — usada por
`Identity`.

**Foco**: `attachShadow({ mode: 'open' })` no constructor, sem `delegatesFocus` — `kb-main`
não é focável; o conteúdo da página mantém o próprio comportamento de foco, e "skip to
content" leva ao landmark.

---

## 4. Gestão de Estado

| Dado | Onde mora | Controlado? | Regra de sincronização |
|---|---|---|---|
| `alt` | `#alt` (no mixin `Identity`) + attribute | Controlado — DOM é a fonte da verdade | `@attributeChanged('alt')` escreve `internals.ariaLabel` |
| papel (`main`) | `internals.role` | Derivado | `[role]` é getter fixo (`'main'`), lido uma vez no connect por `Identity` |
| `internals` | campo privado, lazy | — | Instanciado na primeira leitura (`??=`) |

**Nenhum estado derivado** além do papel, e **nenhum campo `#` próprio** — `kb-main` não
tem lógica de estado. Toda a variação é CSS via custom property, avaliada pelo navegador,
não pelo componente.

---

## 5. Edge Cases

| # | Caso | Comportamento requerido |
|---|---|---|
| 1 | `<kb-main>` sem `alt` | Nenhum `ariaLabel`; o landmark `main` é anunciado sem nome — o caso comum e correto para a única região `main` da página |
| 2 | `alt` definido | `internals.ariaLabel` recebe o valor — para páginas que carregam mais de uma região `main`-like |
| 3 | Header/footer com altura diferente de 72px e `--main-size-offset` não ajustado | A página rola por exatamente a diferença. O contrato é trocar as três alturas juntas — `main.mdx` § "The page frame" documenta o cálculo |
| 4 | Página sem header nem footer | O offset deve ser reduzido para `0px`, não mantido em 144px — senão sobra um vão no fim da viewport |
| 5 | Conteúdo mais largo que `--main-size-max-width` (tabela, imagem larga) | A coluna não expande; o conteúdo transborda ou rola dentro do próprio contêiner de overflow. Full-bleed sai do `kb-main` ou usa `kb-inset` |
| 6 | Duas instâncias de `kb-main` na mesma página | Dois landmarks `main` — a região fica ambígua para o leitor de tela, do mesmo jeito que dois `<kb-header>`. Não há guarda em runtime; é uso incorreto verificável por review (rule 023/064) |
| 7 | `role="main"` escrito à mão pelo consumidor no host | O `role` do autor vence a semântica default publicada por `Identity` — comportamento pretendido de `ElementInternals` |
| 8 | `--main-*` não definidos | Cada um cai no default (`480px`, `var(--spacing_inset-xs)`, `var(--spacing_inset-md)`, `144px`) |
| 9 | Leitor de tela / "skip to content" | Pula direto para o landmark `main`, sem markup do consumidor |

Coberto por teste: `main.test.js` — "is the main landmark".

---

## Auditoria de tokens (designer)

`kb-main` nunca passou por revisão formal do `designer`. Verificável do lado da
arquitetura:

- `--main-space-inset` e `--main-space-gap` caem na escala global `--spacing_inset-*`, sem
  literal — correto.
- `--main-size-max-width` default `480px` e `--main-size-offset` default `144px` são
  **literais**. `480px` é uma medida de coluna mobile-first (documentada em `main.mdx`);
  `144px` é a soma de duas alturas de barra (`72px + 72px`). Nenhum dos dois tem token
  global equivalente hoje. Se a altura de barra virar token (`--header-size-height`), o
  `144px` deveria derivar dele, não repetir o número — ponto para o `designer`.

---

## Divisão de trabalho entre ofícios

| Área | Ofício responsável | Status |
|---|---|---|
| Contrato público, cadeia de mixins, decisão de manter `Identity` inteiro (papel + `alt`) | `architect` | Concluído |
| Correção de `types.d.ts` (remover `internals`, enriquecer JSDoc de `alt`) | `developer` | Concluído (working tree) |
| Tokens `--main-*`, os dois literais (`480px`, `144px`) e a relação do offset com as alturas de barra | `designer` | **Pendente** — nunca houve revisão formal |
| Prova do requisito de landmark | `tester` | Concluído — `main.test.js` |
| Páginas de `website/docs/components/main.mdx` e traduções `es`/`pt-br` | `writer` | Concluído (já existente) |

---

**Criado em**: 2026-09-06
**Atualizado em**: 2026-09-06
**Versão**: 1.0
