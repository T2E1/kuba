# DESIGN — `kb-card`

**Pacote**: `src/component/card/`
**Tag**: `<kb-card>`
**Status**: documentação retroativa — a implementação precede este documento
**Data**: 2026-08-20

---

Este documento segue o framework LLD (5 passos). Sua versão anterior (1.0–1.1) explorou o
`kb-card` como uma unidade clicável — absorvendo cliques do conteúdo slotted e emitindo um
`clicked` próprio — e chegou a especificar foco, papel `button`, teclado e affordance visual
para sustentar essa ideia. A decisão foi revertida: o cartão não tem ação. Este documento
descreve o pacote depois da reversão, e mantém o histórico da decisão descartada na seção 5,
porque o motivo de não fazer algo é tão parte da especificação quanto o motivo de fazer.

A partir desta versão a regra é a mesma de `kb-button`: quando implementação e documento
divergirem, é a implementação que está errada. Mudança de comportamento passa primeiro por
uma revisão deste documento.

## Visão Geral

`kb-card` é um **contêiner de layout puro**: agrupa conteúdo arbitrário em um flex container
estilizado por tokens `--card-*`, com direção, altura e largura controláveis. Nada mais.

O que ele **não** é: um controle, uma unidade clicável, algo com papel ou nome acessível
próprio. Não é form-associated, não tem `disabled`, não intercepta eventos de descendentes,
não é focável. É a mesma relação que um `<div>` com CSS tem com o conteúdo que agrupa — só
que com tokens do design system e os mixins de layout (`Height`, `Hidden`, `Width`) e de
integração declarativa (`Echo`) que todo componente do repositório compartilha.

O template é `<slot></slot>` e nada mais — não há sub-elemento interno.

---

## 1. Requisitos

| Pergunta (LLD passo 1) | Resposta |
|---|---|
| Quem consome, em que contexto | Páginas de listagem e de detalhe; agrupador visual de conteúdo — cartão de produto, item de feed, painel — sem ação própria |
| Somente leitura ou interativo | Somente leitura. Qualquer interação (clique, navegação) é do conteúdo slotted, nunca do cartão |
| Caso de uso mínimo (MVP) | Agrupar conteúdo slotted em um flex container tokenizado, com direção, largura e altura controláveis |
| Participa de `<form>` | Não |
| Papel e nome acessível | Nenhum papel próprio. O cartão publica `role="none"` em `internals.role` no connect, transparente para a árvore de acessibilidade — quem tem papel e nome é o conteúdo slotted |
| Superfície de variação | `direction`, `height`, `width` |
| Sub-elemento interno | Nenhum. O template é só `<slot></slot>` |

**Requisitos funcionais**

1. Renderiza um flex container que recebe conteúdo pelo slot default.
2. `direction` controla `flex-direction` do host, com `'column'` como default.
3. `height` e `width` normalizados pelo filtro `resizing`, vindos dos mixins.
4. Aparência extensível por custom properties `--card-*`, todas com fallback para token
   global.
5. Pode ser ligado a outro elemento por arco (`on`), sem listener escrito na página.
6. `hidden` esconde o cartão via `:state(hidden)`.

**Não-requisitos (YAGNI, rule 023)**

- Cabeçalho, mídia e rodapé como slots nomeados — a composição é do consumidor, não do
  cartão. Slots nomeados só entram quando houver estilo próprio a aplicar em cada região.
- Elevação/`box-shadow`, hover e estados de seleção — sem caso de uso concreto; se o cartão
  nunca é uma unidade de ação, essas affordances não têm o que sinalizar.
- `href` / navegação — fora de escopo. Navegar é do consumidor, tipicamente envolvendo um
  `<a>` ou `kb-button` dentro do slot.
- Ação de clique, evento `clicked`, papel ou nome acessível, foco, atalho de teclado — ver
  "Decisão descartada: cartão como unidade clicável", seção 5.
- `variant` — `style.js` chegou a referenciar `[variant="outlined"]` sem que o atributo
  existisse no contrato; o CSS morto foi removido, não adotado (rule 056, rule 064).
- Colapso, expansão ou qualquer estado próprio de conteúdo.

---

## 2. Contrato Público

### Attributes / Properties

| Nome | Tipo | Default | Reflete | Especificação |
|---|---|---|---|---|
| `direction` | `'row' \| 'column'` | `'column'` | sim | Enum `DIRECTIONS` (`direction.js`), validado por `enumerating(DIRECTIONS)` no `attributeChanged` — mesmo padrão de `color`/`variant`/`type` em `kb-button`. Um valor desconhecido nunca chega ao setter; a property mantém o último valor válido. Dispara `@retouch` — só o estilo re-renderiza, o markup é constante |
| `height` | `KUBACardHeightAttribute \| \`${number}px\`` | `'auto'` | sim | Mixin `Height`, normalizado pelo filtro `resizing`: `'hug'`→`'auto'`, `'fill'`→`'100%'`, valor desconhecido→`'auto'` |
| `width` | `KUBACardWidthAttribute \| \`${number}px\`` | `'auto'` | sim | Mixin `Width`, mesma normalização |
| `hidden` | `boolean` | `false` | sim | Mixin `Hidden`, espelhado em `:state(hidden)` |
| `on` | arco `source/event:type/sink` | `undefined` | sim | Mixin `Echo` |
| `internals` | `ElementInternals` (readonly) | — | não | Lazy via `attachInternals()` na primeira leitura. Existe para os mixins que precisam de `internals` (`Hidden`, `Presentational`). **Não é publicado em `types.d.ts`** — é uso interno dos mixins, não contrato do consumidor (decisão do `architect`, 2026-08-25, aplicada aos oito pacotes) |

Não há `value`, `alt`, `click()` nem evento `clicked`. `value`, `click()` e `clicked` saíram
na reversão desta versão; `alt` nunca foi contrato, mas chegou ao elemento por herança —
`Identity` publica papel **e** nome, e o cartão só queria o papel. Corrigido saindo do mixin
(seção 3).

### Events

Nenhum evento próprio. O cartão não despacha nada — quem despacha é o conteúdo slotted.

### Slots

| Slot | Espera |
|---|---|
| default | Conteúdo arbitrário — `kb-text`, `kb-button`, imagens, outros cartões. Sem tratamento especial de `pointer-events`: o cartão não intercepta nada do que acontece dentro dele |

### Parts

Nenhum. Não há sub-elemento no shadow root a exportar.

### Custom properties de CSS (pontos de extensão)

`--card-color-background`, `--card-border-radius`, `--card-space-gap`,
`--card-space-inset`. Todas com fallback para token global.

**Rule 037 (flag arguments)**: nenhum attribute booleano de comportamento no contrato.
`hidden` é estado de plataforma, não flag de ramificação.

---

## 3. Composição

**Cadeia**: `Echo(Height(Hidden(Presentational(Width(HTMLElement)))))`

| Mixin | Traz | Por que entra na cadeia |
|---|---|---|
| `Echo` | Sistema de eventos: `on`, arco declarativo | O cartão pode ser ligado a outro elemento por arco, mesmo sem despachar nada próprio |
| `Height` | `height` normalizado + re-render de estilo | Cartão é caixa de layout; altura faz parte da superfície de variação |
| `Hidden` | `hidden` + `:state(hidden)` | Visibilidade é estado de plataforma, não CSS solto |
| `Presentational` | `role="none"` publicado em `internals.role` no connect | O cartão é caixa de layout sem significado próprio; sem isso o host vira um nó `generic` em volta do conteúdo. Não acrescenta nada à superfície pública |
| `Width` | `width` normalizado + re-render de estilo | Idem `Height` |

**Sobre não usar `Disabled` ou `Value`**: nenhum dos dois tem uso — o cartão não tem controle
a desabilitar, não carrega payload de ação. Herdar qualquer um seria herança recusada (rule
059). Ver "Decisão descartada" na seção 5 para o raciocínio completo de por que esses mixins
chegaram a ser cogitados e por que saíram.

**Sobre não usar `Identity`**: `Identity` empacota duas coisas — o papel (`[role]` publicado
em `internals.role` no connect) e o **nome acessível** (`alt` → `internals.ariaLabel`). O
cartão quer só a primeira: é presentational, e um host presentational não tem nome a
publicar. Herdar as duas metades para usar uma é herança recusada (rule 059), e o efeito
observável era pior que o smell: `card.alt = 'x'` funcionava de verdade, escrevendo
`aria-label` num contrato que `types.d.ts`, `docs/` e esta página diziam não existir. O papel
passou a vir do mixin `Presentational` (`packages/mixin/presentational/`), que é a metade
de papel de `Identity` isolada, sem `alt`.

**Decisão do `architect` (2026-08-25) — `Presentational` extraído como mixin.** A versão
anterior desta seção registrava o custo da saída como duplicação (`kb-card` e `kb-stack`
repetindo o mesmo hook `@connected [presentational]()`, o mesmo `interfaces.js` byte a byte
e as mesmas oito linhas de comentário explicando a recusa de `Identity`) e recomendava
quebrar `Identity` em papel + um mixin `Alt`. Essa recomendação foi **descartada**: mexer em
`Identity` é mexer num pacote estável (rule 019) consumido por `header`, `logo` e
`progress`, obrigaria os três a compor dois mixins onde hoje compõem um, e separaria papel
de nome — duas metades da mesma identidade acessível, que CRP (rule 017) diz para manter
juntas. O caminho adotado é aditivo: um mixin novo `Presentational`, na forma exata de
`Headless` (hook só de connect, `PresentationalInstance {}` vazio), que **não acrescenta
nada à superfície pública** do elemento — por isso o custo de reverter é o de apagar uma
pasta, não o de renegociar um contrato. Manter os dois hooks locais foi descartado por
motivo oposto: o que estava duplicado não era o corpo trivial de uma linha, era a
justificativa — o mesmo raciocínio sobre acessibilidade em dois arquivos, com duas chances
de divergir (rule 016). Um terceiro `role="none"` agora compõe o mixin em vez de copiar
comentário.

**Sub-elemento**: nenhum. Template é `<slot></slot>`.

**`attachInternals()`**: uma única chamada, lazy, no próprio elemento — existe só porque o
mixin `Hidden` precisa de `internals.states`.

**Foco**: `attachShadow` declara `delegatesFocus: true` — não porque o host se torna
focável (ele não recebe `tabIndex`), mas porque o `<slot>` aceita conteúdo arbitrário do
consumidor, que pode ser focável (skill `constructor`, seção `delegatesFocus`). Sem a flag,
`:host(:focus-visible)` nunca casaria quando um filho slotted recebesse foco. O cartão em si
continua fora da ordem de tabulação — `Tab` alcança o filho focável dentro do slot, não o
host.

---

## 4. Gestão de Estado

| Dado | Onde mora | Controlado? | Regra de sincronização |
|---|---|---|---|
| `direction` | campo privado + attribute | Controlado — DOM é a fonte da verdade | `@retouch` — só o estilo re-renderiza; o markup é constante |
| `height` | campo privado (mixin) + attribute | Controlado | Normalizado pelo filtro `resizing`; re-render só de estilo |
| `width` | campo privado (mixin) + attribute | Controlado | Idem |
| `hidden` | campo privado (mixin) + `:state(hidden)` | Controlado | |
| `internals` | campo privado, lazy | — | Instanciado na primeira leitura (`??=`) |

**Estado derivado**: nenhum. Todo dado é espelho direto de um attribute — é o desenho a
manter.

---

## 5. Edge Cases

| # | Caso | Comportamento requerido |
|---|---|---|
| 1 | `direction` com valor desconhecido em runtime | **Revisado**: `direction` agora é validado por `enumerating(DIRECTIONS)` no `attributeChanged` (enum `DIRECTIONS` em `direction.js`), o mesmo padrão de `color`/`variant`/`type` em `kb-button` — ver skill `enum`. Um valor fora de `'row'`/`'column'` nunca chega ao setter; a property mantém o último válido, e `style.js` nunca interpola algo inválido em `flex-direction`. A versão anterior deste edge case resolvia isso com um truque de dupla declaração CSS (`flex-direction: column;` seguido de `flex-direction: ${card.direction};`, contando com o parser descartar o valor inválido); o enum tornou esse truque desnecessário e foi removido do template — a fonte da verdade passou do CSS para o filtro do attribute, coerente com como `kb-button` já resolve o mesmo problema para `color`, `variant` e `type` |
| 2 | `height`/`width` com valor desconhecido | Filtro `resizing` normaliza para `'auto'` |
| 3 | Cartão vazio (sem conteúdo slotted) | Renderiza a caixa com `padding` e `background`; nada mais acontece |
| 4 | `kb-button` (ou qualquer elemento interativo) dentro do cartão | Funciona normalmente, sem interferência do cartão — clique, foco e teclado pertencem inteiramente ao filho |
| 5 | Cartão dentro de cartão | Aninhamento puro de layout, sem absorção de evento nenhuma |
| 6 | Leitor de tela | O cartão fixa `role="none"` no connect, o que impede o navegador de expor um nó `generic` ao redor do conteúdo — a árvore de acessibilidade vê exatamente o conteúdo slotted, como se o cartão não existisse |
| 7 | Teclado | O cartão nunca recebe foco por si só (sem `tabIndex`); `Tab` alcança diretamente o elemento focável dentro do slot, se houver — `delegatesFocus: true` só habilita `:host(:focus-visible)` a casar quando isso acontece |

### Decisão descartada: cartão como unidade clicável

Versões anteriores deste documento (1.0–1.1) especificaram e chegaram a ver implementado um
`kb-card` que absorvia clique do conteúdo slotted (`@on.click('*', stop)` +
`@on.clicked('*', stop)`) e reemitia um único `clicked` com `value` como payload — o padrão
do cartão de produto/item de lista clicável como superfície inteira. Para sustentar isso com
acessibilidade real, chegou a ser especificado: `role="button"` fixo via mixin `Identity`,
`tabIndex = 0` no host, e um listener de teclado para `Enter`/`Espaço`.

A implementação do teclado expôs um limite real do sistema de eventos deste repositório:
`@on` (`packages/event/listen.js`) registra o listener em `shadowRoot`, e um evento
despachado com `target` igual ao próprio host **nunca alcança um listener em seu
`shadowRoot`** — `shadowRoot` não é ancestral do host na árvore composta, só recebe eventos
que nascem dentro da árvore de shadow (incluindo conteúdo slotted, que atravessa o `<slot>`
a caminho de fora). Verificado empiricamente: um `keydown` disparado no host com
`bubbles: true, composed: true` não é observado por um listener registrado em
`host.shadowRoot`. Isso significa que, no cenário que mais importava — um cartão de conteúdo
puramente textual, focado via `tabIndex`, sem nenhum filho interativo — a única forma de
capturar `Enter`/`Espaço` seria um `addEventListener` manual no próprio host, contornando
`@on` por completo.

Diante disso, a decisão foi reabrir a pergunta anterior — "o cartão deveria ter ação?" — em
vez de resolver o limite técnico. A resposta: não. Um cartão clicável como unidade inteira é
um padrão real (existe em outros design systems), mas nada no repositório o consome hoje, e
sustentá-lo custaria um mecanismo de teclado fora do sistema de eventos declarativo que todo
outro componente usa — o tipo de exceção que, se aceita, se torna precedente para a próxima.
Rule 023 (YAGNI) e rule 064 (overengineering) pesam contra manter uma capacidade sem
consumidor só porque já foi quase construída.

**Consequência**: `click()`, o evento `clicked`, o attribute `value`, o `role="button"`, o
`tabIndex`, o listener de teclado e os tokens de hover/`:focus-visible`/`forced-colors` foram
todos removidos. O cartão volta a ser only-layout. O `role="none"` voltou depois, isolado do
resto desta reversão (seção 3) — não é a retomada do `role="button"` descartado aqui.
Voltou a princípio via `Identity`, o que trouxe junto um `alt` que ninguém pediu; hoje o
papel vem do mixin `Presentational` (seção 3), que publica só `role="none"`, sem `alt`. Se o padrão de
cartão-como-ação for necessário no futuro, é uma decisão nova do `architect` — não uma
retomada automática desta, porque o limite de `@on` continua existindo e precisa ser
resolvido antes (estender `listen.js` para também escutar no host é o caminho mais provável,
mas é mudança de infraestrutura compartilhada, fora do escopo de um único componente).

### Nota para o `.claude/`

O limite de `@on` (shadowRoot-scoped, não alcança eventos com `target` igual ao host) foi
registrado na skill `event`, para que a próxima tentativa de usar `@on.keydown` num elemento
focável sem sub-elemento nativo encontre o aviso antes de implementar, não depois.

---

### Auditoria de tokens (designer)

O `kb-card` nunca passou por revisão formal do `designer` — o pacote foi implementado antes
do fluxo `/craft` existir neste repositório, e as revisões recentes (enum de `direction`,
reversão da ação de clique) mexeram em comportamento sem que ninguém revisasse o mapa de
tokens visuais em si. Esta seção fecha essa lacuna, seguindo o método "Decidir se um valor
vira token" do agent `designer`.

**1. `align-items: start` sem token — correto.** Não é cor, espaço, raio nem tamanho
temático (rule 024 não se aplica); é um valor estrutural de layout, no mesmo grupo de
`box-sizing: border-box` e `display: flex`, que o próprio `style.js` de `kb-button` também
fixa sem token. Não vira attribute `align` hoje: nenhum consumidor real pede alinhamento
cruzado diferente de `start` (rule 023, YAGNI), e inventar um enum de alinhamento sem uso
seria funcionalidade especulativa (rule 064). Se um consumidor concreto precisar de
`align-items: center` — por exemplo, um cartão de avatar centralizado numa única linha —
essa é uma decisão nova do `architect` para abrir um attribute, não uma correção deste
`style.js`. Registrar aqui que a ausência é intencional, não uma omissão.

**2. Os quatro tokens seguem o padrão duplo — confirmado, sem divergência.**

| Custom property | Fallback global | Padrão duplo? |
|---|---|---|
| `--card-color-background` | `--color-master-lighter` | Sim |
| `--card-border-radius` | `--border-radius-md` | Sim |
| `--card-space-gap` | `--spacing_inset-xs` | Sim |
| `--card-space-inset` | `--spacing_inset-xs` | Sim |

Todos os quatro seguem exatamente `var(--card-<propriedade>, var(--<token-global>))`, o
mesmo formato de `kb-button`. Nenhuma correção necessária em `style.js` neste ponto.

**3. Nenhum token faltando por comparação com `kb-button` — a ausência de borda é
consistente, não é lacuna.** `kb-button` não declara `border` colorida no estado base (é
`solid transparent` — reserva o espaço da borda para não pular layout quando um estado a
preenche, mas não pinta nada). `kb-card` não declara `border` alguma. São desenhos
diferentes por razão válida: o botão *tem* estados (`naked`, `ghost`) que preenchem essa
borda reservada; o cartão não tem estados que trocam aparência — a decisão de descartar
`variant`/`outlined` (seção 5) já fechou essa porta por falta de consumidor real. Reabrir a
pergunta "cartão devia ter borda para se distinguir de uma `<div>`" seria reabrir a decisão
de `variant` por outro nome, o que o pedido desta auditoria explicitamente veda. Um cartão
sem cor de fundo customizada e sem borda ainda se distingue de um `<div>` nu porque
`--card-color-background` tem fallback para `--color-master-lighter` — o token já entrega
alguma affordance visual (fundo levemente diferente do canvas) sem exigir uma segunda
propriedade. Não há lacuna genuinamente distinta a apontar; nenhuma mudança em `style.js`.

**4. Contraste do fallback de fundo contra `kb-text` — não é problema de acessibilidade do
`kb-card`, e a combinação default é segura.** `kb-text` tem `color` default `'master-dark'`
(`--color-master-dark`), que **não** é o mesmo eixo de tom do fundo padrão do cartão
(`--color-master-lighter`), mas ambos vêm da mesma escala `--color-master-*`
(`packages/pixel/tokens/color.css`), desenhada para pares claro/escuro coerentes: em modo
claro, `master-dark` (`#2c2c2c`) sobre `master-lighter` (`#f0f0f0`) passa folgado de
4.5:1 (a diferença de luminância entre um cinza quase-preto e um cinza quase-branco é
grande); em modo escuro, `master-dark` (`#c9c9c9`) sobre `master-lighter` (`#3d3d3d`)
também passa. O par default é seguro **por construção da escala de token**, não por
verificação ad-hoc do `kb-card`. Dito isso, a responsabilidade de manter contraste é do
consumidor a partir do momento em que ele sobrescreve `--card-color-background` sem
considerar a cor de texto do conteúdo slotted — o `kb-card` não controla, e não deveria
controlar, a cor de `kb-text` dentro dele (isso violaria a autonomia do componente slotted
e criaria acoplamento entre pacotes que a rule 018/019 desaprovam). Nenhuma mudança em
`style.js`; registrar a responsabilidade do consumidor explicitamente nesta auditoria.

**5. Nenhum tamanho fixo faltando — confirmado.** `kb-button` fixa `--button-size-height:
40px` porque um botão tem uma altura mínima natural de alvo de toque (44×44px de área
clicável, regra de acessibilidade, aproximada por 40px de altura + padding). Um cartão não
tem essa natureza: não é alvo de interação (seção 1, "Somente leitura"), então não há piso
de tamanho a proteger. `height`/`width` vêm inteiramente dos mixins `Height`/`Width` com
default `'auto'`, e isso é o desenho correto — um valor de `40px` fixo aqui seria constante
sem justificativa de negócio (rule 024) e conflitaria com o próprio propósito do cartão de
se ajustar ao conteúdo. Nenhuma mudança em `style.js`.

**Conclusão da auditoria**: os quatro tokens existentes estão corretos e seguem a
convenção do repositório; nenhuma propriedade visual está fixada sem token além das
exceções estruturais já esperadas (`align-items`, `box-sizing`, `display`); não há lacuna
de token a preencher nem tamanho fixo a introduzir. **Nenhuma alteração em `style.js` é
necessária.**

---

## Divisão de trabalho entre ofícios

| Área | Ofício responsável |
|---|---|
| Contrato público, cadeia de mixins, decisão de reverter a ação de clique | `architect` |
| Página de `docs/components/card.md`, se e quando o pacote for documentado publicamente | `writer` |
| Prova de cada requisito e edge case desta especificação | `tester` |

---

**Criado em**: 2026-08-20
**Atualizado em**: 2026-08-20
**Versão**: 2.2
