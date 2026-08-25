# DESIGN — `kb-stack`

**Pacote**: `src/component/stack/`
**Tag**: `<kb-stack>`
**Status**: especificação — registrada após a implementação, como referência do contrato
**Data**: 2026-08-25
**Nota**: auditoria completa em 2026-08-24 (é o componente de layout mais usado do design
system) encontrou e corrigiu injeção de CSS real nos três attributes `align`, `justify` e
`spacing`, confirmada por dois `reviewer`s independentes com payloads que derrubavam
`display: none` no host. Os três viraram conjunto fechado, no mesmo padrão que `direction`
já usava. Revisão final pré-`/ship` em 2026-08-25 (motivada pelo mesmo achado em
`kb-progress`) achou que a correção só guardava o caminho de attribute — atribuição direta
na propriedade (`stack.align = payload`) bypassava `enumerating` por inteiro e alcançava o
setter sem checagem nenhuma. Corrigido extraindo `isEnumerated`
(`packages/directive/attributeChanged/enumerating.js`) e aplicando-a **também dentro dos
quatro setters**, não só no filtro de attribute. Ver seções 2, 4 e 5. `types.d.ts` também
corrigido no mesmo dia: publicava `internals` como propriedade do contrato (divergindo de
`button`/`icon`/`cover`) e faltava declarar `hidden` (`Hidden`), `on` (`Echo`), `width` e
`height` (`Width`/`Height`).

Aquela mesma passagem chegou a declarar `alt`, também herdado — de `Identity`. Numa auditoria
seguinte a herança foi revista e o mixin saiu da cadeia (seção 3): `alt` não é, e nunca foi,
contrato de `kb-stack`. A superfície pública real são as oito propriedades listadas na seção
2.

---

Este documento segue o framework LLD (5 passos) e registra o comportamento de `kb-stack`
tal como implementado. Ele é a fonte da verdade: quando a implementação divergir dele, é a
implementação que está errada, não o inverso. Mudança de comportamento passa primeiro por
uma revisão deste documento, depois pelo código — nunca o contrário.

## Visão Geral

`kb-stack` é um contêiner flex com gap por token: arranja o que estiver dentro dele numa
única linha ou coluna, alinhado e espaçado por attribute. É um primitivo de layout sem
superfície própria — sem fundo, sem padding, sem borda — então nunca parece nada sozinho.
Existe para dar ao design system o caso comum de espaçar um grupo de irmãos sem uma regra
flex avulsa por grupo, com o mesmo rigor de validação que qualquer outro componente do
sistema.

O que ele **não** é: uma barra de página (`kb-header`/`kb-footer` são as versões landmark
da mesma ideia de linha centralizada, com altura fixa e largura máxima), uma superfície
visível (isso é `kb-card`), ou um grid bidimensional (é uma única linha flex; filhos nunca
quebram — para linhas *e* colunas, é CSS Grid).

---

## 1. Requisitos

| Pergunta (LLD passo 1) | Resposta |
|---|---|
| Quem consome, em que contexto | Quase toda página de `docs/components/` — grupos de botões, campos de formulário, toolbars, lockups mark+texto |
| Somente leitura ou interativo | Estrutural — não interage, só organiza o que está dentro |
| Caso de uso mínimo (MVP) | Um `<slot>` que vira flex container, com `direction`/`align`/`justify`/`spacing` por attribute |
| Nome acessível | Nenhum — é presentational (`role="none"`); semântica de grupo vem do que é colocado dentro |
| Superfície de variação | `direction`, `align`, `justify`, `spacing` — todos conjunto fechado; `height`/`width` via mixins |
| Injeção via CSS | Fechada nos quatro attributes que viram CSS (ver Edge Cases, correção de bug) |

**Requisitos funcionais**

1. Renderiza um `<slot>` default; o host vira `display: flex`.
2. `direction` aplica `flex-direction` (`row`/`column`).
3. `align` aplica `align-items`; `justify` aplica `justify-content`; ambos conjunto fechado
   dos keywords válidos de cada propriedade CSS.
4. `spacing` resolve `gap` contra a escala de inset (`--spacing_inset-{valor}`), oito passos
   fechados.
5. Publica `role="none"` em `internals.role` no connect, para não aparecer como nó genérico
   na árvore de acessibilidade.
6. Um valor fora do conjunto fechado, em qualquer um dos quatro attributes, é ignorado — a
   propriedade mantém o último valor válido, e a string hostil nunca alcança a interpolação
   CSS.

**Não-requisitos (YAGNI, rule 023)**

- Wrap de filhos — é uma única linha flex; grid é outro componente.
- Reversão visual da ordem (`row-reverse`) — quebraria a paridade entre ordem de leitura e
  ordem de teclado; não é exposto como attribute de propósito.
- Unificação do vocabulário `start`/`flex-start` entre `align` e `justify` além do que já é
  aceito — os dois aliases resolvem igual; forçar um único vocabulário agora não muda
  comportamento, só documentação (ver seção 2, nota sobre os dois enums).

---

## 2. Contrato Público

### Attributes / Properties

| Nome | Tipo | Default | Reflete | Especificação |
|---|---|---|---|---|
| `direction` | `'row' \| 'column'` | `'row'` | sim | Filtrado por `isEnumerated(DIRECTIONS, value)` em dois pontos — filtro `enumerating` do `@attributeChanged` e guard clause no próprio setter |
| `align` | `KUBAStackAlignAttribute` (10 keywords) | `'start'` | sim | Filtrado por `isEnumerated(ALIGNMENTS, value)` em dois pontos (attribute e setter); aplica `align-items` |
| `justify` | `KUBAStackJustifyAttribute` (12 keywords) | `'start'` | sim | Filtrado por `isEnumerated(JUSTIFICATIONS, value)` em dois pontos (attribute e setter); aplica `justify-content` |
| `spacing` | `KUBAStackSpacingAttribute` (8 passos) | `'xs'` | sim | Filtrado por `isEnumerated(SPACINGS, value)` em dois pontos (attribute e setter); resolve `--spacing_inset-{valor}` |
| `hidden` | `boolean` | `false` | sim | Mixin `Hidden` |
| `width` | `'auto' \| 'fill' \| length` | `'auto'` | sim | Mixin `Width` |
| `height` | `'auto' \| length` | `'auto'` | sim | Mixin `Height` |
| `internals` | `ElementInternals` (readonly) | — | não | Lazy via `attachInternals()` na primeira leitura; existe para os mixins que precisam de `internals` (`Hidden`, `Presentational`). **Não é publicado em `types.d.ts`** — é uso interno dos mixins, não contrato do consumidor (decisão do `architect`, 2026-08-25, aplicada aos oito pacotes) |
| `on` | arco `source/event:type/sink` | `undefined` | sim | Mixin `Echo` |

**`align` e `justify` são dois enums separados, não um só.** `space-between`/`space-around`/
`space-evenly` só fazem sentido no eixo principal; `baseline`/`self-start`/`self-end` só no
eixo cruzado. Um conjunto único aceitaria `align="space-between"` — sintaticamente válido,
semanticamente nulo. `start`/`end` são a grafia preferida nos dois; `flex-start`/`flex-end`
são aliases legados aceitos porque a documentação já os usava antes desta auditoria — os
dois resolvem igual em CSS, então mantê-los não custa nada. O default de `justify` era
`'flex-start'` e foi corrigido para `'start'` nesta auditoria: manter o alias como default
era gratuito antes de fechar o conjunto (mudar depois custaria uma major sem ganho
funcional), e como esta mudança já é breaking (ver Edge Cases), corrigir agora não soma
custo de compatibilidade novo.

**`spacing` duplica a escala de `packages/pixel/tokens/spacing.css`** (`quarck, nano, xs, sm,
md, lg, huge, giant`) em `spacing.js`, no mesmo padrão que `src/component/icon/size.js` já
usa — `packages/pixel` publica só CSS (`packages/pixel/index.js` é uma linha,
`import './index.css'`), sem superfície JS de onde importar um enum. `spacing.js` documenta
a duplicação e os cinco arquivos que um nono passo de inset exigiria tocar (o token CSS, o
enum local, a união em `types.d.ts`, e as duas tabelas de `docs/`).

### Events

Nenhum. É estrutural, não interage.

### Slots

Um `<slot>` default sem nome — qualquer coisa entra, renderizada em ordem de origem como
item flex.

### Custom properties de CSS (pontos de extensão)

| Custom property | Default | Controla |
|---|---|---|
| `--stack-space-gap` | `var(--spacing_inset-{spacing})` | Gap entre filhos, sobrescrevendo o attribute `spacing` — útil quando o espaçamento precisa responder a uma media query, que um attribute não consegue |

`align`, `direction`, `justify`, `height`, `width` são attributes aplicados direto no host —
não há custom property equivalente; a variação passa pelo attribute, não pelo CSS externo.

**Rule 037 (flag arguments)**: `hidden` é estado de plataforma, não flag de ramificação —
não viola a rule.

---

## 3. Composição

**Cadeia**: `Presentational(Hidden(Width(Height(Echo(HTMLElement)))))`

| Mixin | Traz | Por que entra na cadeia |
|---|---|---|
| `Hidden` | `hidden` + `:state(hidden)` | Visibilidade é estado de plataforma |
| `Width` | `width` normalizado + re-render de estilo | Faz parte da superfície de variação de layout |
| `Height` | `height` normalizado + re-render de estilo | Idem |
| `Echo` | Sistema de eventos: `on`, arco declarativo | O stack se conecta a outros elementos sem listener escrito na página |
| `Presentational` | `role="none"` publicado em `internals.role` no connect | O stack é caixa de layout sem significado próprio; sem isso o host vira um nó `generic` em volta do conteúdo. Não acrescenta nada à superfície pública |

**Sobre não usar `Identity`**: `Identity` empacota duas coisas — o papel (`[role]` publicado
em `internals.role` no connect) e o **nome acessível** (`alt` → `internals.ariaLabel`). O
stack quer só a primeira: é presentational, e um host presentational não tem nome a publicar.
Herdar as duas metades para usar uma é herança recusada (rule 059), e trazia um `alt`
funcional para a superfície pública de um elemento que não tem nome — cujo efeito real, sob
`role="none"` fixo, ninguém no repositório conseguiu afirmar (era a pergunta aberta do edge
case 8, agora dissolvida em vez de respondida: não há mais `alt` para ter ou não ter efeito).
O papel vem do mixin `Presentational` (`packages/mixin/presentational/`), que é a metade de
papel de `Identity` isolada, sem `alt`.

**Decisão do `architect` (2026-08-25) — `Presentational` extraído como mixin.** O que esta
seção registrava como custo (o mesmo hook, o mesmo `interfaces.js` byte a byte e o mesmo
comentário de oito linhas em `stack.ts` e `card.ts`) virou um pacote na forma exata de
`Headless`: hook só de connect, instância vazia, nada acrescentado à superfície pública do
elemento. A recomendação anterior — quebrar `Identity` em `Identity` + `Alt` — foi
descartada por mexer num pacote estável (rule 019) consumido por `header`, `logo` e
`progress`, e por separar papel de nome, duas metades da mesma identidade acessível que CRP
(rule 017) mantém juntas. Manter os dois hooks locais também foi descartado: o duplicado não
era o corpo de uma linha, era a justificativa, com duas chances de divergir (rule 016). Ver
`card/DESIGN.md`, seção 3, para o registro completo.

**Sub-elemento**: nenhum. O `<slot>` vive no shadow root, sem segunda tag pública.

**`attachInternals()`**: uma única chamada, lazy, no próprio elemento, compartilhada pelos
mixins `Hidden` e `Presentational`.

**Symbol privado**: nenhum próprio de `Stack`. O Symbol `presentational` que publica o papel
mora em `packages/mixin/presentational/interfaces.js`, do mixin — não é mais local ao
pacote. Fora do que os mixins trazem, `Stack` não tem ciclo de vida próprio nem
espelhamento de estado derivado que precise de método bracket.

---

## 4. Gestão de Estado

| Dado | Onde mora | Controlado? | Regra de sincronização |
|---|---|---|---|
| `direction` | campo privado + attribute | Controlado — DOM é a fonte da verdade | `@attributeChanged('direction', enumerating(DIRECTIONS))` filtra o caminho de attribute; o setter também chama `isEnumerated` com guard clause, filtrando atribuição direta; `@retouch` reprocessa o estilo |
| `align` | campo privado + attribute | Controlado | `@attributeChanged('align', enumerating(ALIGNMENTS))` + guard clause com `isEnumerated` no setter (mesmos dois caminhos); `@retouch` |
| `justify` | campo privado + attribute | Controlado | `@attributeChanged('justify', enumerating(JUSTIFICATIONS))` + guard clause com `isEnumerated` no setter (mesmos dois caminhos); `@retouch` |
| `spacing` | campo privado + attribute | Controlado | `@attributeChanged('spacing', enumerating(SPACINGS))` + guard clause com `isEnumerated` no setter (mesmos dois caminhos); `@retouch` |
| papel (`none`) | `internals.role` | Derivado | Literal fixo, escrito uma vez no connect pelo mixin `Presentational` |

**Nenhum estado derivado** além do papel — os quatro attributes de layout são espelho
direto do que o consumidor escreve, filtrado pelo enum correspondente.

**Atributo vs. propriedade, depois da rejeição**: quando um valor é rejeitado (por qualquer
um dos dois caminhos — o filtro `enumerating` do `@attributeChanged`, ou o guard clause
`isEnumerated` dentro do setter), o *attribute* no DOM continua mostrando o que foi escrito
(`getAttribute('align')` retorna o valor hostil) — só a *propriedade* (`stack.align`) cai
para o último valor válido, porque só o setter atualiza o campo privado, e ele simplesmente
não roda a atribuição quando o guard clause reprova. Ler `getAttribute()` para saber o que
está aplicado dá a resposta errada; a documentação pública (`docs/components/stack.md`)
registra isso explicitamente depois que uma auditoria encontrou a prosa afirmando o
contrário.

---

## 5. Edge Cases

| # | Caso | Comportamento requerido |
|---|---|---|
| 1 | `align`/`justify`/`spacing`/`direction` com valor fora do conjunto fechado | Propriedade mantém o último valor válido; attribute no DOM mostra o valor rejeitado (ver seção 4) |
| 2 | Payload de injeção CSS em `align`/`justify`/`spacing` via attribute (ex: fechando a declaração e abrindo `:host { display: none }`) | `enumerating` rejeita a string inteira antes do setter rodar — nenhuma regra injetada chega à stylesheet adotada do shadow root. Bug corrigido nesta auditoria (ver abaixo) |
| 2b | Mesmo payload via atribuição direta na propriedade (ex: `stack.align = payload`), sem passar pelo attribute | Comportamento idêntico ao caso 2 — o guard clause `isEnumerated` dentro do setter reprova antes de tocar o campo privado, então bypassar `@attributeChanged` não bypassa a defesa. Bug corrigido numa segunda passada (ver abaixo) |
| 3 | `spacing` com payload que quebra através do `var()` aninhado (`style.js:9`) | Mesma defesa dos casos 2/2b — o filtro roda antes da interpolação, não importa quantos níveis de aninhamento o payload tentaria atravessar, nem qual dos dois caminhos de entrada é usado |
| 4 | Nenhum attribute de layout definido | Todos os quatro caem no default via `??=` nos getters — não há gap equivalente ao que `kb-progress` teve (nenhum depende de `@connected`, todos resolvem no primeiro acesso à propriedade) |
| 5 | `direction` muda de `row` para `column` depois do mount | `align`/`justify` continuam significando a mesma coisa nomeada (cross/main axis), mas o eixo físico troca — documentado em `docs/components/stack.md` como "switching `direction` swaps which attribute does what" |
| 6 | Filho sem semântica de grupo (`<div>` solto) | `kb-stack` não fornece semântica de grupo — precisa vir de um `<nav>`, `<ul>`, fieldset dentro do slot |
| 7 | `hidden` | `display: none` via `:state(hidden)`, removendo o stack e os filhos de layout e da árvore de acessibilidade |
| 8 | Consumidor quer nomear o stack | Não há `alt`: `kb-stack` é presentational e não publica nome acessível (seção 3). Quem precisa de um grupo nomeado põe dentro do slot o elemento que carrega a semântica — `<nav aria-label="…">`, `<section>`, um fieldset — como no edge case 6 |
| 9 | `<kb-on>` como filho | Funciona sem depender do `<slot>` — a wiring de `on.ts` mira `parentElement` diretamente, então mesmo que `kb-stack` renderizasse um slot nomeado (não é o caso; é default), o `<kb-on>` não precisaria ser slotted para funcionar |

**Bug corrigido nesta auditoria**: `align`, `justify` e `spacing` interpolavam direto em CSS
(`style.js:6,9,11` — `align-items: ${stack.align}`, `gap: var(--stack-space-gap,
var(--spacing_inset-${stack.spacing}))`, `justify-content: ${stack.justify}`) sem filtro
algum, diferente de `direction` (que já usava `enumerating`). Dois `reviewer`s confirmaram
empiricamente, com payloads reais, que uma string maliciosa nos três attributes conseguia
fechar a declaração CSS e injetar uma regra nova — incluindo `:host { display: none }`, que
torna o elemento invisível enquanto continua clicável (primitivo de UI redress/clickjacking)
num componente que aparece em quase toda página do sistema. Corrigido criando `align.js`
(`ALIGNMENTS`), `justify.js` (`JUSTIFICATIONS`) e `spacing.js` (`SPACINGS`) e aplicando
`enumerating(...)` nos três `@attributeChanged`, no mesmo padrão que `direction` já
demonstrava.

Um teste de injeção pré-existente (`align` contra o payload que termina em `align-items:
red`) dava falsa segurança — passava porque `red` não é um valor válido de `align-items` e o
parser CSS descartava a declaração sozinho, não porque a regra `:host { display: none }`
injetada tivesse sido bloqueada. Foi substituído por testes que provam o valor voltando ao
default (a string inteira rejeitada, não só a declaração final) e um que confirma via
`getComputedStyle` que a regra injetada nunca chega a ser adotada.

**Segundo bug corrigido, numa revisão final pré-`/ship`**: a correção acima só filtrava o
caminho de attribute. `enumerating(...)` embrulha `@attributeChanged` — o wiring que reage a
`attributeChangedCallback` — mas os quatro setters continuavam atribuindo direto
(`this.#align = value`) sem checagem própria. Um consumidor que fizesse `stack.align =
payload` (atribuição direta na propriedade, sem tocar o attribute) alcançava o setter sem
sanitização nenhuma — o mesmo bug que uma revisão equivalente achou em `kb-progress` no
mesmo dia. Corrigido extraindo `isEnumerated(values, value)`
(`packages/directive/attributeChanged/enumerating.js`) — a checagem pura que `enumerating`
já fazia internamente — e aplicando-a também como guard clause dentro dos quatro setters, não
só no filtro de attribute. Os dois caminhos de entrada convergem na mesma guarda agora.

---

## Divisão de trabalho entre ofícios

| Área | Ofício responsável |
|---|---|
| Contrato público, cadeia de mixins, granularidade dos enums (`align`/`justify` separados) | `architect` |
| Conjunto de valores de cada enum, vocabulário `start`/`flex-start` | `designer` (auditoria conduzida pelo `architect` nesta rodada, por ser correção de segurança) |
| Implementação de `direction`/`align`/`justify`/`spacing`, mixins compostos | `developer` |
| Prova de cada requisito e edge case desta especificação, incluindo os vetores de injeção | `tester` |
| Página de `docs/components/stack.md` (e traduções `es`/`pt-br`) | `writer` |

---

**Criado em**: 2026-08-24
**Atualizado em**: 2026-08-25
**Versão**: 1.2
