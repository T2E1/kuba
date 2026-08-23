# DESIGN — `kb-header`

**Pacote**: `src/component/header/`
**Tag**: `<kb-header>`
**Status**: documentação retroativa — a implementação precede este documento
**Data**: 2026-08-22

---

Este documento segue o framework LLD (5 passos) e descreve `kb-header` como ele existe hoje.
O pacote foi escrito antes de qualquer processo formal de design neste repositório e nunca
teve especificação própria. O objetivo é duplo — registrar a forma já implementada, sem
redesenhá-la, e apontar explicitamente onde ela diverge do irmão direto `kb-footer` ou do
padrão que `kb-button`, `kb-card` e `kb-cover` já consolidaram.

`kb-footer` passou por uma revalidação completa no ciclo anterior e registrou, ali, um
conjunto de achados adjacentes que apontavam para este lado. Cada um deles foi reconferido
contra o código atual de `header` e está confirmado ou refutado, com evidência de arquivo e
linha, na seção **Lacunas confirmadas** ao fim deste documento.

A partir desta versão vale a mesma regra dos outros: quando implementação e documento
divergirem, é a implementação que está errada. Mudança de comportamento passa primeiro por
uma revisão deste documento, depois pelo código.

## Visão Geral

`kb-header` é um **landmark de página**: uma barra de altura fixa que abre a página e empurra
dois grupos de conteúdo para as extremidades de uma linha centralizada e limitada por
`max-width` — `leading` no início, `trailing` no fim. O host declara o papel `banner` via
mixin `Identity`.

O que ele **não** é: um contêiner genérico nem uma toolbar. Não tem slot default — conteúdo
sem `slot="leading"` ou `slot="trailing"` é descartado. Não tem attribute de variação, não
despacha evento, não é focável, não participa de `<form>`, não tem `hidden`. Não é a barra
de título de um cartão ou de um diálogo: `banner` pertence à página, e um segundo
`kb-header` divide esse landmark.

A escolha estruturante do pacote é que o landmark vive no **host**, não em um `<header>`
dentro do shadow root. Um `<header>` ali mapearia para `banner` também, deixando dois
landmarks aninhados para o leitor de tela anunciar. Por isso as tags internas (`wrapper`,
`container`, `leading`, `trailing`) são deliberadamente não-semânticas — nomes customizados
sem mapeamento ARIA nenhum. É a mesma decisão, com a mesma justificativa e o mesmo
comentário no código (`header.ts:16-18`), que `kb-footer` toma para `contentinfo`.

---

## 1. Requisitos

| Pergunta (LLD passo 1) | Resposta |
|---|---|
| Quem consome, em que contexto | A raiz de uma página; a barra de abertura com identidade e navegação — marca, nav primária, menu de conta, entrada de busca |
| Somente leitura ou interativo | Somente leitura. Qualquer interação pertence ao conteúdo slotted (`<a>`, `kb-button`, `<nav>`), nunca ao cabeçalho |
| Caso de uso mínimo (MVP) | Renderizar uma barra de altura fixa com duas regiões nas extremidades de uma linha centralizada, e declarar o landmark `banner` |
| Participa de `<form>` | Não |
| Papel e nome acessível | Papel `banner` fixo, publicado no host via `Identity`; nome acessível opcional pelo `alt` do mesmo mixin |
| Superfície de variação | Nenhum attribute próprio. Toda variação é por custom properties `--header-*` e pelo conteúdo slotted |
| Sub-elemento interno | `wrapper` > `container` > `leading`/`trailing`, todos não-semânticos, sem `part` exportado |

**Requisitos funcionais**

1. Publica `role="banner"` no host, como semântica default (autor ainda pode sobrescrever
   com `role` no markup).
2. Não existe nenhum elemento no shadow root que mapeie para `banner` — o landmark é único.
3. Projeta conteúdo `slot="leading"` no início e `slot="trailing"` no fim de uma linha
   `display: flex` com `justify-content: space-between`.
4. Nenhum dos dois slots tem conteúdo de fallback: `leading` e `trailing` ficam vazios
   quando nada é slotted neles. **Isto é o que o código faz** — e é exatamente onde
   `types.d.ts` mente hoje; ver Lacuna 1.
5. Cada uma das duas regiões é ela mesma uma linha flex com `gap`, de forma que vários
   elementos slotted do mesmo lado ficam espaçados e centrados verticalmente sem wrapper
   extra (`style.js:24-36`).
6. A linha interna é centralizada (`margin: 0 auto`) e limitada por
   `--header-size-max-width`; a altura é fixa por `--header-size-height`, aplicada tanto no
   host quanto no `container`.
7. `alt` nomeia o landmark, para páginas que carreguem mais de um — vem do mixin `Identity`.

**Não-requisitos (YAGNI, rule 023)**

- Slot default — descartado por desenho: o cabeçalho é uma linha de duas extremidades, e um
  terceiro ponto de projeção sem regra de layout escrita só criaria conteúdo em posição
  indefinida.
- `hidden` / mixin `Hidden` — o cabeçalho de uma página não é condicional; quem não quer a
  barra remove o elemento. Ver Edge case 7.
- `Echo` / attribute `on` — não despacha nada e não há caso de uso de arco recebendo estado
  numa barra sem attribute de variação. Ver seção 3.
- `Height` / `Width` — a altura é fixa por token e a largura é imposta pelo `wrapper`; abrir
  os dois criaria segunda fonte de verdade para a mesma caixa.
- Barra fixa/`position: sticky`, sombra de separação, background próprio — o cabeçalho não
  pinta fundo, e o consumidor aplica `background-color` diretamente quando precisa (é o que
  `docs/components/header.md` demonstra).

---

## 2. Contrato Público

### Attributes / Properties

| Nome | Tipo | Default | Reflete | Especificação |
|---|---|---|---|---|
| `alt` | `string` | `''` | não | **Vem do mixin `Identity`, não é declarado em `header.ts`.** Escreve `internals.ariaLabel`, nomeando o landmark. O setter só roda numa mudança real de attribute (`identity.ts:28-34`), então um cabeçalho sem `alt` mantém o nome que o conteúdo lhe dá (`ariaLabel` permanece `null`) |

Não há `hidden`, `on`, `height`, `width` nem `value`. **Há**, hoje, `internals` publicado em
`types.d.ts:16` — e não deveria; ver Lacuna 3.

**Sobre `types.d.ts` documentar `alt`**: está **correto**, não é lacuna. `alt` é superfície
pública do elemento — o consumidor não sabe nem precisa saber que ela chega por mixin.
`header.ts` não redeclara `alt`, e não deveria: redeclarar sombrearia o accessor do mixin e
quebraria a única implementação (`identity.ts`, `set alt`). O mesmo vale para o hook
`@connected [identifiable]()`, que publica `this[role]`. O que falta é **profundidade** de
JSDoc, não a presença do membro; ver Lacuna 4.

### Events

Nenhum evento próprio. `kb-header` não despacha nada.

### Slots

| Slot | Espera | Fallback |
|---|---|---|
| `leading` | Conteúdo do início da linha — tipicamente `<kb-logo>`, opcionalmente seguido do nome do produto | **Nenhum** (`component.js:8-9`) |
| `trailing` | Conteúdo do fim da linha — `<nav>`, `kb-button variant="link"`, avatar | Nenhum (`component.js:12`) |

Não há slot default: conteúdo sem `slot` nomeado nunca é projetado.

### Parts

Nenhum. Nenhuma das quatro tags internas é exportada como `part` — não há estado de
interação a estilizar de fora, e as quatro custom properties cobrem a superfície visual.

### Custom properties de CSS (pontos de extensão)

| Custom property | Fallback | Controla |
|---|---|---|
| `--header-size-height` | `72px` | Altura da barra, no host e no `container` |
| `--header-size-max-width` | `1024px` | Teto da linha centralizada |
| `--header-space-gap` | `var(--spacing_inset-xs)` | Espaçamento entre elementos projetados na mesma região (`leading`/`trailing`) |
| `--header-space-inset` | `var(--spacing_inset-xs)` | Padding interno da linha centralizada |

**Assimetria de convenção, intencional**: as duas primeiras têm fallback literal, não o
padrão duplo `var(--header-<propriedade>, var(--<token-global>))` de `kb-button`/`kb-card`.
É correto aqui pela mesma razão registrada em `kb-cover` para `aspect-ratio` e repetida em
`kb-footer`: não existe escala global de tamanho em `packages/pixel/tokens/`. Inventar
`--size-height-bar` global sem segundo consumidor seria funcionalidade especulativa
(rule 023/064). As duas de espaçamento seguem o padrão duplo normalmente, porque a escala de
espaçamento existe. `kb-footer` faz exatamente o mesmo — a assimetria é consistente entre os
dois irmãos.

**Rule 037 (flag arguments)**: nenhum attribute booleano no contrato.

---

## 3. Composição

**Cadeia**: `Identity(HTMLElement)`

| Mixin | Traz | Por que entra na cadeia |
|---|---|---|
| `Identity` | `alt` → `internals.ariaLabel`; hook `@connected [identifiable]()` que publica `this[role]` em `internals.role` | O cabeçalho **é** um landmark: sem papel publicado, o host é uma caixa anônima e "pular para o cabeçalho da página" deixa de funcionar. `alt` cobre a página com mais de um `banner` |

É a cadeia com menos mixins do repositório, empatada com `kb-footer` — um só, contra os dois
de `kb-cover` (`Echo(Hidden(HTMLElement))`) — e é coerente com o que o componente é: um
landmark de layout sem estado, sem variação e sem evento.

### Symbols do contrato

| Symbol | Origem | Forma | Papel |
|---|---|---|---|
| `role` | `packages/mixin/identity/interfaces.js` | `Symbol.for('role')` | O elemento **implementa** `get [role]()` retornando `'banner'` (`header.ts:19-21`); o mixin **lê** no `@connected`. É `Symbol.for` (registro global) porque quem declara e quem lê estão em pacotes diferentes e podem ser empacotados separadamente |
| `identifiable` | idem | `Symbol()` local | Chave do método do hook `@connected` dentro do próprio `identity.ts` — interno ao pacote do mixin, `kb-header` nunca o toca |

`kb-header` não publica Symbol nenhum: não tem `interfaces.js`, e não deve ter — não há
contrato que outro pacote precise invocar nele.

**Sobre não usar `Echo`**: o cabeçalho não despacha evento e não tem attribute que um arco
possa alimentar. Herdar seria herança recusada (rule 059).

**Sobre não usar `Hidden`, `Height`, `Width`, `Disabled`, `Value`**: nenhum tem uso — ver
"Não-requisitos" e Edge case 7. Herança recusada (rule 059).

**Sub-elemento**: quatro tags customizadas não-semânticas (`wrapper`, `container`, `leading`,
`trailing`), nenhuma exportada. `wrapper` existe para separar a faixa de largura total da
linha centralizada; `container` é a linha flex; `leading`/`trailing` são âncoras de projeção
que também são linhas flex com `gap`.

**`attachInternals()`**: uma única chamada, lazy, no próprio elemento
(`get internals() { return (this.#internals ??= this.attachInternals()) }`, `header.ts:12-14`)
— o mixin nunca chama, porque `attachInternals()` só pode rodar uma vez por elemento. Mesmo
formato de `footer.ts`, `card.ts` e `cover.ts`. Duas diferenças de forma em relação a
`footer.ts`, ambas cosméticas mas registradas porque são o gancho da Lacuna 3: `footer.ts`
tem, sobre esse getter, o comentário de três linhas que explica *por que* ele é público em
runtime e *que ele não é contrato publicado*; `header.ts` não tem comentário nenhum ali.

**Foco**: `attachShadow({ mode: 'open' })`, **sem** `delegatesFocus` (`header.ts:25`). Há
divergência com `kb-card`, que usa `delegatesFocus: true` justamente porque aceita conteúdo
slotted arbitrário e focável. `kb-header` também aceita conteúdo focável nos dois slots
(links, `kb-button`, `<nav>`), e mesmo assim não delega. Na prática nada quebra — o foco
chega ao filho slotted normalmente, `Tab` funciona, e o host nunca entra na ordem de
tabulação porque não tem `tabIndex`. A única consequência é que `:host(:focus-visible)` nunca
casa quando um link dentro do cabeçalho recebe foco. Como `style.js` não tem nenhuma regra de
`:focus-visible`, isso não tem efeito observável hoje. É a mesma escolha de `kb-footer`,
então **não é divergência entre os irmãos** — é divergência dos dois em relação a `kb-card`,
e fica registrada aqui para que a próxima revisão não a trate como bug nem a "corrija" sem um
estilo de foco a sustentar.

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
| 1 | Cabeçalho vazio, sem nada slotted | `leading` e `trailing` ficam vazios — nenhum dos dois tem fallback. A barra renderiza com altura e padding corretos. Sem teste hoje; o irmão tem (`footer.test.js:73`) |
| 2 | Conteúdo sem `slot` nomeado | Descartado. Não há slot default — é desenho (seção 1), e está documentado em `docs/components/header.md` |
| 3 | Dois ou mais elementos na mesma região | Ficam espaçados por `gap: var(--header-space-gap, var(--spacing_inset-xs))` — `leading`/`trailing` são `display: flex` (`style.js:24-36`). **Declarado no CSS, não provado por teste**; ver Lacuna 5 |
| 4 | Conteúdo que quebra linha | Transborda a barra em vez de aumentá-la: a altura é fixa (`--header-size-height` no host e no `container`), não um mínimo |
| 5 | Mais de um `kb-header` na página | Dois landmarks `banner`, o que torna "pular para o cabeçalho" ambíguo. Não há guarda em runtime — é uso incorreto, verificável por review/lint, não por código de produção (rule 023/064). `alt` existe justamente para desambiguar quando isso for intencional |
| 6 | `role` escrito no markup pelo autor | Vence. `internals.role` é semântica *default* — o mixin publica, o autor sobrescreve. Coberto por teste no pacote do mixin |
| 7 | Esconder o cabeçalho | Não há `hidden` nem `:state(hidden)` — o consumidor remove o elemento do DOM. Divergente de `kb-card`/`kb-cover`, que têm `Hidden`, e igual a `kb-footer`. **Omissão deliberada, não lacuna** |
| 8 | Leitor de tela | Anuncia um único `banner`, no host. O shadow root não contém `<header>` — asseverado por teste próprio (`header.test.js:13`) |
| 9 | Teclado | O cabeçalho nunca recebe foco por si só. Links e botões slotted mantêm a ordem nativa, `leading` antes de `trailing`, seguindo a ordem do markup do consumidor — o elemento não gerencia foco |
| 10 | Alto contraste / `forced-colors` | Sem tratamento, e nada a tratar: o cabeçalho não pinta fundo nem borda; toda a superfície visível é o conteúdo slotted, que responde por si |
| 11 | `kb-header` dentro de um container mais estreito que a viewport | Respeita o container. `wrapper` é `width: 100%` (`style.js:12`), a mesma caixa que o `:host` recebe, então a barra se adapta ao container em vez de transbordar. Ver Lacuna 2 |

### Paridade com `kb-footer`

Os dois são o mesmo desenho — mesma cadeia (`Identity(HTMLElement)`), mesmo `internals`
lazy, mesmo `get [role]()` com o mesmo comentário, mesma árvore
`wrapper > container > leading/trailing`, mesmo par de slots, mesmos quatro tokens com os
mesmos fallbacks. O que sobra de divergência real está inteiro na tabela de Lacunas abaixo,
e todos os cinco pontos caem do lado do `header`: o footer foi revalidado no ciclo anterior
e este pacote ficou de fora.

Nenhum dos pontos é corrigido aqui: este documento registra a forma existente, não a
redesenha.

---

## Lacunas confirmadas

Os cinco pontos herdados dos achados adjacentes do `kb-footer`, cada um reconferido contra o
código atual.

### 1. `types.d.ts:2-3` afirma um fallback que não existe — **CONFIRMADA**

`types.d.ts` abre com "a page header container with `leading` (defaulting to `<kb-logo>`) and
`trailing` slots". `component.js` inteiro tem 19 linhas e o slot é:

```
<slot name="leading">
</slot>
```

Um slot vazio, quebrado em duas linhas por formatação — nenhum conteúdo de fallback, nem
`<kb-logo>` nem outro. `component.js` sequer importa `kb-logo`. Um consumidor lendo o tipo
publicado espera que `<kb-header></kb-header>` renderize a marca; ele renderiza uma barra
vazia.

É a mesma classe de problema do fallback de copyright do footer, invertida: lá havia
comportamento não documentado, aqui há documentação sem comportamento. E é a pior das duas
direções — remover um fallback é mudança de comportamento negociável, corrigir uma afirmação
falsa no contrato público não é: o tipo mente hoje, para todo mundo.

`docs/components/header.md:78-79` acerta ("Both regions are empty until filled — there is no
fallback content on either slot"), assim como `types.d.ts` do footer. A correção é alinhar
`types.d.ts` do header à doc, não o contrário. **`ofício: developer`**.

### 2. `style.js:12` usava `100svw` no `wrapper` — **CORRIGIDA**

`header/style.js:12` declarava `width: 100svw` no `wrapper`, enquanto `footer/style.js:11`
sempre declarou `width: 100%`. `100svw` é a largura da viewport (menos a barra de rolagem, em
`svw`) e ignorava por completo o container pai. Efeito real: um `kb-header` dentro de
qualquer elemento mais estreito que a viewport — uma coluna de layout, um preview de
documentação, um painel — pintava uma faixa mais larga que o pai e transbordava
horizontalmente, o que em geral produzia barra de rolagem no documento inteiro. O `:host` já
era `width: 100%` (`style.js:8`), então o `wrapper` escapava desnecessariamente da caixa que
o host recebia.

A linha foi trocada para `width: 100%`, igualando o `wrapper` ao `:host` e ao `footer`. O
aviso que existia nos três idiomas de `docs/*/components/header.md` — descrevendo o `100svw`
como pendência conhecida — foi removido junto, já que a barra agora respeita o container como
sempre foi o comportamento do `footer`.

Correção de uma linha, mas de **comportamento visível**: quem contava com o header vazando de
um container estreito para virar full-bleed perde esse efeito. Passou pela mesma revisão de
geometria que o `footer` já teve.

### 3. `types.d.ts:16` publica `readonly internals` — **CONFIRMADA, com uma ressalva**

A premissa herdada era que `kb-button`, `kb-card`, `kb-cover` e `kb-footer` já tinham
removido o membro. O código atual só confirma três dos quatro:

| Pacote | `readonly internals` em `types.d.ts` |
|---|---|
| `button` | removido |
| `cover` | removido |
| `footer` | removido |
| `card` | **ainda presente** (`card/types.d.ts:66`) |
| `logo` | ainda presente (`logo/types.d.ts:19`) |
| `progress` | ainda presente (`progress/types.d.ts:20`) |
| `stack` | ainda presente (`stack/types.d.ts:31`) |
| `header` | ainda presente (`header/types.d.ts:16`) |

A conclusão para o `header` não muda: `internals` é detalhe de implementação exigido pelo
mixin (`identity.ts:17-18` — "Reads `internals` from the host class ... the element owns the
`attachInternals()` call"), existe em runtime e não é superfície que o consumidor deva
programar contra. `footer`, o irmão direto e o pacote de referência, já removeu. Header
deveria seguir.

A ressalva importa para o orquestrador: a limpeza está pela metade no repositório inteiro, e
`card` — citado como concluído — não está. Tratar isso como cinco pacotes pendentes
(`card`, `header`, `logo`, `progress`, `stack`) numa varredura só é mais barato e mais seguro
que corrigir um por vez. **`ofício: developer`**, escopo além deste pacote.

### 4. JSDoc de `alt` raso, sem `@default` — **CONFIRMADA**

`header/types.d.ts:14` é uma linha:

> `/** Accessible name for the landmark, for pages with more than one. Reflects the alt attribute. */`

Três problemas. Não tem `@default ''`. Não diz que a propriedade vem do mixin `Identity`. E
"Reflects the `alt` attribute" é impreciso no sentido que importa: o setter só roda numa
mudança real de attribute (`identity.ts:28-34`), de modo que um header sem `alt` **não** tem
`ariaLabel = ''` — tem `ariaLabel` intocado, e o nome acessível continua sendo o que o
conteúdo dá. O footer documenta exatamente esses três pontos em seis linhas
(`footer/types.d.ts:15-23`), e é o texto a espelhar aqui. `button` e `card` seguem o mesmo
padrão. **`ofício: developer`**.

### 5. Teste de geometria do gap ausente — **CONFIRMADA**

`header.test.js` tem 3 testes, nas linhas 4, 13 e 24: landmark `banner`, unicidade do
landmark no shadow root, e `alt` → `ariaLabel`. `footer.test.js` tem 6, e três deles não
existem do lado do header:

| Teste no footer | Existe no header? |
|---|---|
| `projects content into its leading and trailing regions` (`footer.test.js:24`) | Não |
| `spaces multiple elements projected into the same region` (`footer.test.js:52`) | **Não** |
| `leaves leading empty when nothing is slotted into it` (`footer.test.js:73`) | Não |

A ausência do teste de gap é a mais grave das três, e por uma ironia de sequência: o
`--header-space-gap` do header é que serviu de **modelo** para o `--footer-space-gap` que o
footer ganhou no ciclo anterior — e o footer saiu com o teste de geometria
(`getBoundingClientRect()`, medindo que `secondRect.left > firstRect.right`) enquanto o
original continua provando o gap apenas por leitura do CSS. Edge case 3 deste documento é,
hoje, uma afirmação sem teste.

Os outros dois valem pelo mesmo argumento que os justificou no footer: `kb-header` não tem
attribute nem evento para exercitar, então a projeção nos dois slots e o vazio sem fallback
*são* o comportamento observável do componente. O teste de vazio ganha peso extra por causa
da Lacuna 1 — ele é justamente o que travaria a reintrodução silenciosa de um fallback.
**`ofício: tester`**, três testes portados de `footer.test.js`.

---

### Achado adicional, fora dos cinco: `docs/components/header.md:40-42` — **CORRIGIDO**

A seção "When not to use" afirmava:

> **A header inside a card, dialog or section.** This renders a native `<header>` at page
> level; a title row inside a contained surface is a `<kb-stack ...>`.

Era falso, e era **literalmente o mesmo erro** que `docs/components/footer.md` tinha e que já
havia sido corrigido: o componente deliberadamente não renderiza `<header>` nenhum, e há um
teste dedicado a provar isso (`header.test.js:13`, `holds the only banner in its shadow
root`). A conclusão prática da frase (não usar como barra de título de cartão ou diálogo)
continuava correta pelo landmark; só a justificativa estava errada. O texto agora descreve o
mecanismo real — landmark `banner` publicado via `ElementInternals` no host, shadow root sem
`<header>` — nos três idiomas (`docs/components/header.md`, `docs/pt-br/components/header.md`,
`docs/es/components/header.md`).

Os outros dois pontos da mesma doc, desatualizados pela correção do gap no footer, também
foram ajustados — `header.md:37-39` dizia que o footer "leaves its slot regions unstyled
instead of laying them out as flex rows", e `header.md:56-58` abria com "Unlike `<kb-footer>`,
each region is itself a flex row with a gap". Desde `footer/style.js:23-35`, as duas
afirmações eram falsas: as regiões do footer são idênticas às do header. Corrigidas para
"Same as"/"Igual ao"/"Igual que" nos três idiomas.

---

### Auditoria de tokens (designer)

`kb-header` nunca passou por revisão formal do `designer`. Esta seção **não** substitui essa
revisão — registra apenas o que é verificável do lado da arquitetura, e a revisão do
`designer` permanece pendente na tabela abaixo.

- Os quatro tokens `--header-*` espelham exatamente os quatro `--footer-*`, com os mesmos
  valores de fallback. Os dois de espaçamento seguem o padrão duplo; os dois de tamanho usam
  literal por ausência de escala global (seção 2).
- `align-items`, `box-sizing`, `display`, `height`, `justify-content`, `margin: 0 auto`,
  `max-width` e `padding` são estruturais, sem token além dos quatro, corretos — mesmo grupo
  já validado nas auditorias de `kb-card`, `kb-cover` e `kb-footer`.
- `width: 100%` no `wrapper` (Lacuna 2, corrigida) agora tem par exato no `footer`: nenhum
  valor de layout diverge mais entre os dois irmãos.
- Nenhuma cor é declarada: o cabeçalho não pinta fundo nem texto, então não há par de
  contraste a verificar neste pacote. A cor do conteúdo é do que for slotted, e a do fundo é
  da página.

---

## Divisão de trabalho entre ofícios

| Área | Ofício responsável | Status |
|---|---|---|
| Contrato público, cadeia de mixins, Symbols, decisão sobre `Hidden`/`Echo`/`delegatesFocus` | `architect` | Concluído |
| `types.d.ts:2-3` — fallback `<kb-logo>` documentado e inexistente (Lacuna 1) | `developer` | **Pendente** |
| `style.js:12` — `100svw` no `wrapper` (Lacuna 2); mudança de comportamento visível | `designer` + `releaser` | Concluído |
| `types.d.ts:16` — remoção de `readonly internals` (Lacuna 3), junto com `card`, `logo`, `progress`, `stack` | `developer` | **Pendente** |
| `types.d.ts:14` — JSDoc de `alt` com `@default`, origem no mixin e semântica do setter (Lacuna 4) | `developer` | **Pendente** |
| Testes de gap, de projeção e de slot vazio, portados de `footer.test.js` (Lacuna 5) | `tester` | **Pendente** |
| `docs/*/components/header.md` — "renders a native `<header>`" e as duas frases sobre o footer desatualizadas | `writer` | Concluído |
| Revisão dos tokens `--header-*` — o pacote nunca passou por revisão formal | `designer` | **Pendente** |

---

**Criado em**: 2026-08-22
**Atualizado em**: 2026-08-22
**Versão**: 1.0
