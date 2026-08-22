# DESIGN — `kb-footer`

**Pacote**: `src/component/footer/`
**Tag**: `<kb-footer>`
**Status**: documentação retroativa — a implementação precede este documento
**Data**: 2026-08-21

---

Este documento segue o framework LLD (5 passos) e descreve `kb-footer` como ele existe hoje.
O pacote foi escrito antes de qualquer processo formal de design neste repositório e nunca
teve especificação própria. O objetivo é duplo — registrar a forma já implementada, sem
redesenhá-la, e apontar explicitamente onde ela diverge do irmão direto `kb-header` ou do
padrão que `kb-button`, `kb-card` e `kb-cover` já consolidaram.

A partir desta versão vale a mesma regra dos outros: quando implementação e documento
divergirem, é a implementação que está errada. Mudança de comportamento passa primeiro por
uma revisão deste documento, depois pelo código.

## Visão Geral

`kb-footer` é um **landmark de página**: uma barra de altura fixa que ocupa a largura que
recebe e empurra dois grupos de conteúdo para as extremidades de uma linha centralizada e
limitada por `max-width` — `leading` no início, `trailing` no fim. O host declara o papel
`contentinfo` via mixin `Identity`.

O que ele **não** é: um contêiner genérico. Não tem slot default — conteúdo sem
`slot="leading"` ou `slot="trailing"` é descartado. Não tem attribute de variação, não
despacha evento, não é focável, não participa de `<form>`, não tem `hidden`. Não é o rodapé
de um cartão ou de um diálogo: `contentinfo` pertence à página, e um segundo `kb-footer`
divide esse landmark.

A escolha estruturante do pacote é que o landmark vive no **host**, não em um `<footer>`
dentro do shadow root. Um `<footer>` ali mapearia para `contentinfo` também, deixando dois
landmarks aninhados para o leitor de tela anunciar. Por isso as tags internas (`wrapper`,
`container`, `leading`, `trailing`) são deliberadamente não-semânticas — nomes customizados
sem mapeamento ARIA nenhum. É a mesma decisão, com a mesma justificativa e o mesmo
comentário no código, que `kb-header` toma para `banner`.

---

## 1. Requisitos

| Pergunta (LLD passo 1) | Resposta |
|---|---|
| Quem consome, em que contexto | A raiz de uma página; a barra de fechamento com conteúdo legal ou secundário — copyright, links de privacidade e termos |
| Somente leitura ou interativo | Somente leitura. Qualquer interação pertence ao conteúdo slotted (`<a>`, `kb-button`), nunca ao rodapé |
| Caso de uso mínimo (MVP) | Renderizar uma barra de altura fixa com duas regiões nas extremidades de uma linha centralizada, e declarar o landmark `contentinfo` |
| Participa de `<form>` | Não |
| Papel e nome acessível | Papel `contentinfo` fixo, publicado no host via `Identity`; nome acessível opcional pelo `alt` do mesmo mixin |
| Superfície de variação | Nenhum attribute próprio. Toda variação é por custom properties `--footer-*` e pelo conteúdo slotted |
| Sub-elemento interno | `wrapper` > `container` > `leading`/`trailing`, todos não-semânticos, sem `part` exportado |

**Requisitos funcionais**

1. Publica `role="contentinfo"` no host, como semântica default (autor ainda pode
   sobrescrever com `role` no markup).
2. Não existe nenhum elemento no shadow root que mapeie para `contentinfo` — o landmark é
   único.
3. Projeta conteúdo `slot="leading"` no início e `slot="trailing"` no fim de uma linha
   `display: flex` com `justify-content: space-between`.
4. Nenhum dos dois slots tem conteúdo de fallback: `leading` e `trailing` ficam vazios
   quando nada é slotted neles.
5. A linha interna é centralizada (`margin: 0 auto`) e limitada por
   `--footer-size-max-width`; a barra em si ocupa 100% da largura concedida.
6. Altura fixa por `--footer-size-height`, aplicada tanto no host quanto no `container`.
7. `alt` nomeia o landmark, para páginas que carreguem mais de um — vem do mixin `Identity`.

**Não-requisitos (YAGNI, rule 023)**

- Slot default — descartado por desenho: o rodapé é uma linha de duas extremidades, e um
  terceiro ponto de projeção sem regra de layout escrita só criaria conteúdo em posição
  indefinida.
- `hidden` / mixin `Hidden` — o rodapé de uma página não é condicional; quem não quer a
  barra remove o elemento. Ver Edge case 7.
- `Echo` / attribute `on` — não despacha nada e não há caso de uso de arco recebendo estado
  numa barra sem attribute de variação. Ver seção 3.
- `Height` / `Width` — a altura é fixa por token e a largura é 100% do container; abrir os
  dois criaria segunda fonte de verdade para a mesma caixa, o mesmo raciocínio do Edge case
  7 de `kb-cover`.
- Barra fixa/`position: sticky`, sombra de separação, background próprio — o rodapé não
  pinta fundo, e o consumidor aplica `background-color` diretamente quando precisa (é o que
  `docs/components/footer.md` demonstra).

---

## 2. Contrato Público

### Attributes / Properties

| Nome | Tipo | Default | Reflete | Especificação |
|---|---|---|---|---|
| `alt` | `string` | `''` | não | **Vem do mixin `Identity`, não é declarado em `footer.ts`.** Escreve `internals.ariaLabel`, nomeando o landmark. O setter só roda numa mudança real de attribute, então um rodapé sem `alt` mantém o nome que o conteúdo lhe dá (`ariaLabel` permanece `null`) |

Não há `hidden`, `on`, `height`, `width`, `value` nem `internals` — este último existe em
tempo de execução (ver seção 3, "`attachInternals()`"), mas não é publicado em `types.d.ts`,
mesma convenção de `kb-button`.

**Sobre `types.d.ts` documentar `alt`**: está **correto**, não é lacuna. `alt` é superfície
pública do elemento — o consumidor não sabe nem precisa saber que ela chega por mixin.
`footer.ts` não redeclara `alt`, e não deveria: redeclarar sombrearia o accessor do mixin e
quebraria a única implementação (`identity.ts`, `set alt`). O mesmo vale para o hook
`@connected [identifiable]()`, que publica `this[role]`.

### Events

Nenhum evento próprio. `kb-footer` não despacha nada.

### Slots

| Slot | Espera | Fallback |
|---|---|---|
| `leading` | Conteúdo do início da linha — tipicamente `<kb-text>` com a linha de copyright | Nenhum |
| `trailing` | Conteúdo do fim da linha — links secundários, `kb-button variant="link"`, `<a>` | Nenhum |

Não há slot default: conteúdo sem `slot` nomeado nunca é projetado.

### Parts

Nenhum. Nenhuma das quatro tags internas é exportada como `part` — não há estado de
interação a estilizar de fora, e as quatro custom properties cobrem a superfície visual.

### Custom properties de CSS (pontos de extensão)

| Custom property | Fallback | Controla |
|---|---|---|
| `--footer-size-height` | `72px` | Altura da barra, no host e no `container` |
| `--footer-size-max-width` | `1024px` | Teto da linha centralizada |
| `--footer-space-gap` | `var(--spacing_inset-xs)` | Espaçamento entre elementos projetados na mesma região (`leading`/`trailing`) — espelha `--header-space-gap` |
| `--footer-space-inset` | `var(--spacing_inset-xs)` | Padding interno da linha centralizada |

**Assimetria de convenção, intencional**: as duas primeiras têm fallback literal, não o
padrão duplo `var(--footer-<propriedade>, var(--<token-global>))` de `kb-button`/`kb-card`.
É correto aqui pela mesma razão registrada em `kb-cover` para `aspect-ratio`: não existe
escala global de tamanho em `packages/pixel/tokens/` (os arquivos ali são `borderRadius`,
`borderWidth`, `color`, `fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, `opacity`,
`shadow`, `spacing` — nenhum de `size`). Inventar `--size-height-bar` global sem segundo
consumidor seria funcionalidade especulativa (rule 023/064). `--footer-space-inset` segue o
padrão duplo normalmente, porque a escala de espaçamento existe. `kb-header` faz
exatamente o mesmo com `--header-size-height`/`--header-size-max-width` — a assimetria é
consistente entre os dois irmãos.

**Rule 037 (flag arguments)**: nenhum attribute booleano no contrato.

---

## 3. Composição

**Cadeia**: `Identity(HTMLElement)`

| Mixin | Traz | Por que entra na cadeia |
|---|---|---|
| `Identity` | `alt` → `internals.ariaLabel`; hook `@connected [identifiable]()` que publica `this[role]` em `internals.role` | O rodapé **é** um landmark: sem papel publicado, o host é uma caixa anônima e "pular para o rodapé da página" deixa de funcionar. `alt` cobre a página com mais de um `contentinfo` |

É a cadeia com menos mixins do repositório — um só, contra os dois de `kb-cover`
(`Echo(Hidden(HTMLElement))`) — e é
coerente com o que o componente é: um landmark de layout sem estado, sem variação e sem
evento.

### Symbols do contrato

| Symbol | Origem | Forma | Papel |
|---|---|---|---|
| `role` | `packages/mixin/identity/interfaces.js` | `Symbol.for('role')` | O elemento **implementa** `get [role]()` retornando `'contentinfo'`; o mixin **lê** no `@connected`. É `Symbol.for` (registro global) porque quem declara e quem lê estão em pacotes diferentes e podem ser empacotados separadamente |
| `identifiable` | idem | `Symbol()` local | Chave do método do hook `@connected` dentro do próprio `identity.ts` — interno ao pacote do mixin, `kb-footer` nunca o toca |

`kb-footer` não publica Symbol nenhum: não tem `interfaces.js`, e não deve ter — não há
contrato que outro pacote precise invocar nele.

**Sobre não usar `Echo`**: o rodapé não despacha evento e não tem attribute que um arco
possa alimentar. Herdar seria herança recusada (rule 059).

**Sobre não usar `Hidden`, `Height`, `Width`, `Disabled`, `Value`**: nenhum tem uso — ver
"Não-requisitos" e Edge case 7. Herança recusada (rule 059).

**Sub-elemento**: quatro tags customizadas não-semânticas (`wrapper`, `container`,
`leading`, `trailing`), nenhuma exportada. `wrapper` existe para separar a faixa de largura
total da linha centralizada; `container` é a linha flex; `leading`/`trailing` são âncoras de
projeção. Ver a nota de paridade abaixo sobre `leading`/`trailing`.

**`attachInternals()`**: uma única chamada, lazy, no próprio elemento
(`get internals() { return (this.#internals ??= this.attachInternals()) }`) — o mixin nunca
chama, porque `attachInternals()` só pode rodar uma vez por elemento. Mesmo formato de
`header.ts`, `card.ts` e `cover.ts`.

**Foco**: `attachShadow({ mode: 'open' })`, **sem** `delegatesFocus`. Aqui há divergência
com `kb-card`, que usa `delegatesFocus: true` justamente porque aceita conteúdo slotted
arbitrário e focável. `kb-footer` também aceita conteúdo focável nos dois slots (links,
`kb-button`), e mesmo assim não delega. Na prática nada quebra — o foco chega ao filho
slotted normalmente, `Tab` funciona, e o host nunca entra na ordem de tabulação porque não
tem `tabIndex`. A única consequência é que `:host(:focus-visible)` nunca casa quando um
link dentro do rodapé recebe foco. Como `style.js` não tem nenhuma regra de
`:focus-visible`, isso não tem efeito observável hoje. É a mesma escolha de `kb-header`,
então **não é divergência entre os irmãos** — é divergência dos dois em relação a
`kb-card`, e fica registrada aqui para que a próxima revisão não a trate como bug nem a
"corrija" sem um estilo de foco a sustentar.

---

## 4. Gestão de Estado

| Dado | Onde mora | Controlado? | Regra de sincronização |
|---|---|---|---|
| `alt` | campo privado `#alt` no mixin + attribute | Controlado — DOM é a fonte da verdade | `@attributeChanged('alt')` escreve `internals.ariaLabel` no setter. Não reflete de volta para o attribute |
| `role` | nenhum campo — getter constante | Não é estado | Publicado uma vez em `internals.role`, no `@connected` do mixin |
| `internals` | campo privado, lazy | — | Instanciado na primeira leitura (`??=`) |

**Estado derivado**: nenhum. O elemento não tem estado próprio nenhum além do que `Identity`
carrega — o markup e o estilo são constantes, e não há `@repaint`/`@retouch` disparado por
nada. É o desenho a manter.

---

## 5. Edge Cases

| # | Caso | Comportamento requerido |
|---|---|---|
| 1 | Rodapé vazio, sem nada slotted | `leading` e `trailing` ficam vazios — nenhum dos dois tem fallback. A barra renderiza com altura e padding corretos |
| 2 | Conteúdo sem `slot` nomeado | Descartado. Não há slot default — é desenho (seção 1), e está documentado em `docs/components/footer.md` |
| 3 | Dois ou mais elementos na mesma região | Ficam espaçados por `gap: var(--footer-space-gap, var(--spacing_inset-xs))` — `leading`/`trailing` são `display: flex`, paridade com `kb-header`. Comportamento provado por teste de geometria real (`getBoundingClientRect()`), não só pela declaração CSS |
| 4 | Conteúdo que quebra linha | Transborda a barra em vez de aumentá-la: a altura é fixa (`--footer-size-height` no host e no `container`), não um mínimo |
| 5 | Mais de um `kb-footer` na página | Dois landmarks `contentinfo`, o que torna "pular para o rodapé" ambíguo. Não há guarda em runtime — é uso incorreto, verificável por review/lint, não por código de produção (rule 023/064). `alt` existe justamente para desambiguar quando isso for intencional |
| 6 | `role` escrito no markup pelo autor | Vence. `internals.role` é semântica *default* — o mixin publica, o autor sobrescreve. Coberto por teste no pacote do mixin |
| 7 | Esconder o rodapé | Não há `hidden` nem `:state(hidden)` — o consumidor remove o elemento do DOM. Divergente de `kb-card`/`kb-cover`, que têm `Hidden`, e igual a `kb-header`. **Omissão deliberada, não lacuna**: a barra de fechamento de uma página não é condicional do jeito que um cartão numa listagem é |
| 8 | Leitor de tela | Anuncia um único `contentinfo`, no host. O shadow root não contém `<footer>` — asseverado por teste próprio |
| 9 | Teclado | O rodapé nunca recebe foco por si só. Links e botões slotted mantêm a ordem nativa, `leading` antes de `trailing`, seguindo a ordem do markup do consumidor — o elemento não gerencia foco |
| 10 | Alto contraste / `forced-colors` | Sem tratamento, e nada a tratar: o rodapé não pinta fundo nem borda; toda a superfície visível é o conteúdo slotted, que responde por si |

### Paridade com `kb-header`: `leading`/`trailing` alinhados

`kb-header` e `kb-footer` são o mesmo desenho — mesma cadeia (`Identity(HTMLElement)`),
mesmo `internals` lazy, mesmo `get [role]()` com o mesmo comentário, mesma árvore
`wrapper > container > leading/trailing`, mesmo par de slots. Uma divergência real
permanece; a outra, que existia quando este documento foi escrito pela primeira vez, foi
fechada no mesmo ciclo:

1. **`leading` e `trailing` agora têm a mesma regra de CSS nos dois componentes.**
   `style.js` do footer ganhou `align-items: center`, `display: flex`, `gap:
   var(--footer-space-gap, var(--spacing_inset-xs))` e `justify-content: start`/`end` —
   mesma forma que `header/style.js` já tinha. Antes desta correção, as tags do footer não
   tinham nenhuma regra própria e o Edge case 3 exigia envolver o conteúdo num
   `<kb-stack direction="row">`; isso não é mais necessário. `--footer-space-gap` agora
   existe, espelhando `--header-space-gap`.
2. **`wrapper`**: o header usa `box-sizing: border-box; width: 100svw`; o footer usa
   `width: 100%`. `100svw` é a largura da viewport e ignora o container; `100%` segue o
   container. O comportamento do footer é o que `docs/components/footer.md` promete ("fills
   100% of whatever width it's given ... adapts to a narrower container instead of
   overflowing it"). Não é o footer que diverge por engano aqui — é mais provável que
   `100svw` no header seja que cause overflow dentro de um container estreito. Registrar
   como achado do lado do header, fora do escopo deste documento.

Nenhum dos dois pontos é corrigido aqui: este documento registra a decisão existente, não a
redesenha.

### Correção histórica em `docs/components/footer.md`

`docs/components/footer.md` chegou a afirmar, na seção "When not to use", que o componente
"renders a native `<footer>` and exposes a `contentinfo` landmark". Era falso — o componente
deliberadamente **não** renderiza `<footer>` nenhum, e há um teste dedicado a provar isso
(`holds the only contentinfo in its shadow root`). A conclusão prática da frase (não usar
como rodapé de cartão ou diálogo) sempre esteve correta pelo landmark; só a justificativa
estava errada. Já corrigido pelo `writer`, nos três idiomas.

### Remoção do fallback de `leading`

O pacote chegou a ter um fallback embutido em `leading` —
`© 2025 Memoize. Todos os direitos reservados.` — um ano fixo, um nome de empresa e a única
string em português de todo o componente. Não era uma decisão de design do `kuba`: era
resíduo do projeto de origem de onde o componente foi extraído, carregado sem revisão. O
fallback foi removido de `component.js`, e o teste correspondente
(`falls back to its built-in copyright line`) foi substituído por
`leaves leading empty when nothing is slotted into it`, que prova que o slot fica vazio.
`leading` e `trailing` agora têm o mesmo comportamento: sem conteúdo, sem fallback.

---

### Auditoria de tokens (designer)

`kb-footer` nunca passou por revisão formal do `designer`. Esta seção **não** substitui essa
revisão — registra apenas o que é verificável do lado da arquitetura, e a revisão do
`designer` permanece pendente na tabela abaixo.

- Os quatro tokens `--footer-*` espelham exatamente os quatro `--header-*`, com os mesmos
  valores de fallback. `--footer-space-inset` e `--footer-space-gap` seguem o padrão duplo;
  os dois de tamanho usam literal por ausência de escala global (seção 2).
- `align-items`, `box-sizing`, `display`, `justify-content`, `margin: 0 auto` e `width: 100%`
  são estruturais, sem token, corretos — mesmo grupo já validado nas auditorias de `kb-card`
  e `kb-cover`.
- Nenhuma cor é declarada: o rodapé não pinta fundo nem texto, então não há par de contraste
  a verificar neste pacote. A cor do conteúdo é do `kb-text` slotted, e a do fundo é da
  página.

---

## Divisão de trabalho entre ofícios

| Área | Ofício responsável | Status |
|---|---|---|
| Contrato público, cadeia de mixins, Symbols, decisão sobre `Hidden`/`Echo`/`delegatesFocus` | `architect` | Concluído |
| Teste de `alt` → `internals.ariaLabel` no `kb-footer` — existia em `kb-header`, faltava aqui | `tester` | Concluído |
| Decisão sobre `leading`/`trailing` sem `display: flex`/`gap`, e sobre `--footer-space-gap` | `architect` + `designer` | Concluído |
| Correção de `docs/components/footer.md` — a frase "renders a native `<footer>`" contradizia a implementação | `writer` | Concluído |
| Atualização de `docs/components/footer.md` — a seção Content/Styling ensinava o contorno via `kb-stack` e não listava `--footer-space-gap`, desatualizada pela correção do gap | `writer` | Concluído |
| Revisão dos tokens `--footer-*` — o pacote nunca passou por revisão formal | `designer` | **Pendente** |
| Fallback de copyright (ano fixo, nome de empresa, idioma) | `developer` + `writer` | Concluído — removido por ser resíduo do projeto de origem |

---

**Criado em**: 2026-08-21
**Atualizado em**: 2026-08-21
**Versão**: 1.0
