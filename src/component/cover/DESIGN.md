# DESIGN — `kb-cover`

**Pacote**: `src/component/cover/`
**Tag**: `<kb-cover>`
**Status**: documentação retroativa — a implementação precede este documento
**Data**: 2026-08-20

---

Este documento segue o framework LLD (5 passos) e descreve `kb-cover` como ele existe hoje:
o pacote foi escrito antes de qualquer processo formal de design neste repositório, e nunca
teve especificação própria. O objetivo aqui é duplo — registrar a forma já implementada e
apontar, explicitamente, onde ela está incompleta ou incoerente com o padrão que `kb-button`
e `kb-card` já consolidaram.

A partir desta versão vale a mesma regra dos outros dois: quando implementação e documento
divergirem, é a implementação que está errada. Mudança de comportamento passa primeiro por
uma revisão deste documento, depois pelo código.

## Visão Geral

`kb-cover` é uma **primitiva de exibição**: renderiza um único `<img>` nativo no próprio
shadow root, a partir de um par `src`/`alt`, e o recorta (`object-fit: cover`) numa
proporção fixa escolhida por `orientation`. Nada mais.

O que ele **não** é: um contêiner. Não tem `<slot>` — conteúdo colocado entre as tags é
ignorado. Não tem ação, não despacha evento próprio, não é focável, não participa de
`<form>`. Também não é um substituto do `<img>` nativo em cenários de art direction: não
aceita `srcset`, `sizes`, `loading` nem `<picture>`. Ele existe para dar ao design system um
ponto único de proporção e de tokens `--cover-*` sobre uma imagem recortada.

A escolha estruturante do pacote é ter um `<img>` **nativo real** no shadow root. Isso faz a
semântica de acessibilidade vir de graça da plataforma: `alt=""` marca a imagem como
decorativa, `alt="texto"` a anuncia. É por isso que `kb-cover` não usa `Identity` nem o
truque de `internals.ariaHidden` que `kb-icon` e `kb-logo` precisam usar — esses dois não têm
elemento nativo por trás e precisam simular o que aqui já é nativo.

---

## 1. Requisitos

| Pergunta (LLD passo 1) | Resposta |
|---|---|
| Quem consome, em que contexto | Páginas de listagem e de detalhe; banner, hero, thumbnail, e a área de imagem de um `kb-card` (tipicamente dentro de `kb-inset side="top"`) |
| Somente leitura ou interativo | Somente leitura. Nenhuma interação própria — clique e navegação são do consumidor, que envolve o elemento num `<a>` ou `kb-card` |
| Caso de uso mínimo (MVP) | Renderizar um `<img>` a partir de `src`/`alt`, recortado numa proporção fixa |
| Participa de `<form>` | Não |
| Papel e nome acessível | Do `<img>` interno, nativamente. O host não declara papel nem nome — não usa `Identity` |
| Superfície de variação | `orientation` (proporção) e as custom properties `--cover-*` |
| Sub-elemento interno | Um `<img>`, no shadow root, sem `part` exportado |

**Requisitos funcionais**

1. Renderiza um `<img>` nativo com `src` e `alt` projetados dos attributes homônimos.
2. Mudança de `src` ou `alt` reescreve o markup (`@repaint`), atualizando o `<img>`.
3. `orientation` controla a proporção do host (`aspect-ratio`), com `'landscape'` como
   default, re-renderizando só o estilo (`@retouch`).
4. A imagem preenche o host e é recortada por `object-fit: cover`, independentemente da
   proporção nativa do arquivo.
5. Aparência extensível por custom properties `--cover-*`, todas com fallback.
6. Pode ser ligado a outro elemento por arco (`on`), sem listener escrito na página — é o que
   permite trocar `src` a partir de um `clicked` de outro elemento.

**Não-requisitos (YAGNI, rule 023)**

- `srcset`, `sizes`, `loading`, `<picture>` — art direction e lazy loading nativo estão
  fora de escopo; quem precisa usa um `<img>` puro (já registrado em
  `docs/components/cover.md`).
- Slot de conteúdo, legenda, overlay de texto — composição é do consumidor, via `kb-card`.
- Placeholder de carregamento, skeleton, tratamento de `error` do `<img>` — sem consumidor
  concreto; hoje o fundo (`--cover-color-background`) é a única coisa visível enquanto a
  imagem carrega ou se ela falha.
- Ação de clique, evento próprio, foco — o cartão que envolve a capa é quem tem ação.

---

## 2. Contrato Público

### Attributes / Properties

| Nome | Tipo | Default | Reflete | Especificação |
|---|---|---|---|---|
| `src` | `string` | `''` | sim | URL projetada no `src` do `<img>` interno. Dispara `@repaint` — o markup é reescrito |
| `alt` | `string` | `''` | sim | Texto alternativo projetado no `alt` do `<img>` interno. Dispara `@repaint`. Nunca é omitido do markup: o template sempre escreve o atributo, com `''` quando não há valor |
| `orientation` | `'landscape' \| 'portrait'` | `'landscape'` | sim | Escolhe a proporção do host. Dispara `@retouch` — só o estilo re-renderiza. Validado por `enumerating(ORIENTATIONS)`: valor fora do enum nunca chega ao setter, a property mantém o último válido |
| `hidden` | `boolean` | `false` | sim | Mixin `Hidden`, espelhado em `:state(hidden)` |
| `on` | arco `source/event:type/sink` | `undefined` | sim | Mixin `Echo` |

Não há `height`, `width` nem `value` — ver seção 3 e Edge case 7.

### Events

Nenhum evento próprio. `kb-cover` não despacha nada; `Echo` está na cadeia para o lado
**receptor** do arco (`on`), não para emissão.

### Slots

Nenhum. O template é um `<img>` e nada mais — conteúdo entre as tags é ignorado, e isso é
desenho, não omissão (seção 1, "Não-requisitos").

### Parts

Nenhum. O `<img>` interno **não** é exportado como `part`. Diferente de `kb-button`, que
exporta `part="button"` para abrir escape a `:focus-visible`/`:active`/`forced-colors`, aqui
não há estado de interação a estilizar de fora — as quatro custom properties cobrem toda a
superfície visual. Se um consumidor precisar de `object-position` ou `filter` sobre a
imagem, isso vira uma custom property nova, não um `part`.

### Custom properties de CSS (pontos de extensão)

| Custom property | Fallback | Controla |
|---|---|---|
| `--cover-aspect-ratio-landscape` | `16/9` | Proporção quando `orientation="landscape"` |
| `--cover-aspect-ratio-portrait` | `4/5` | Proporção quando `orientation="portrait"` |
| `--cover-color-background` | `var(--color-pure-white)` | Fundo visível enquanto a imagem carrega, ou se falha |
| `--cover-border-radius` | `var(--border-radius-md)` | Raio de canto do host e da imagem recortada |

**Incoerência de convenção (menor)**: as duas primeiras não seguem o padrão duplo
`var(--cover-<propriedade>, var(--<token-global>))` que `kb-button` e `kb-card` seguem em
todas as suas custom properties — o fallback é um literal (`16/9`, `4/5`), não um token
global. Isso é **correto aqui**: não existe escala global de proporção em
`packages/pixel/tokens/`, e inventar `--aspect-ratio-landscape` global sem segundo
consumidor seria funcionalidade especulativa (rule 023/064). As duas últimas seguem o padrão
duplo normalmente. Registrar que a assimetria é intencional, não uma omissão.

**Rule 037 (flag arguments)**: nenhum attribute booleano no contrato.

---

## 3. Composição

**Cadeia**: `Echo(Hidden(HTMLElement))`

| Mixin | Traz | Por que entra na cadeia |
|---|---|---|
| `Echo` | Sistema de eventos: `on`, arco declarativo | A capa pode ter `src` trocado por um arco vindo de outro elemento — é o segundo teste do pacote, e o caso de uso real da galeria |
| `Hidden` | Attribute `hidden`, estado `:state(hidden)` | Visibilidade é estado de plataforma, não exceção de `kb-cover` — uma capa dentro de um cartão condicional é o caso trivial (Edge case 6) |

É a cadeia mais rasa de todo o repositório, e isso é coerente com o que o componente é:
uma primitiva de exibição sem estado de plataforma, sem layout próprio e sem semântica a
declarar.

**Sobre não usar `Identity`**: `Identity` publica papel e nome acessível no **host**, via
`internals`. Aqui o host é invólucro e quem a árvore de acessibilidade lê é o `<img>` nativo
do shadow root, que já traz papel `img` e nome derivado de `alt` de graça. Herdar `Identity`
seria herança recusada (rule 059) — e pior, criaria dois nomes acessíveis concorrentes para
a mesma coisa. É exatamente a diferença entre este pacote e `kb-icon`/`kb-logo`, que **não**
têm elemento nativo por trás e por isso precisam simular a semântica via
`internals.ariaHidden`.

**Sobre não usar `Disabled` ou `Value`**: nenhum uso — não há controle a desabilitar nem
payload de ação. Herança recusada (rule 059).

**Sobre não usar `Height` e `Width`**: ver seção 5, Edge case 7 — omissão intencional, não
lacuna. `Hidden` entrou na cadeia (Edge case 6, corrigido nesta versão).

**Sub-elemento**: um `<img>` no shadow root, sem segunda tag pública — hierarquia rasa, sem
overengineering (rule 064).

**`attachInternals()`**: uma única chamada, lazy, no próprio elemento (`get internals()`,
`??= this.attachInternals()`) — existe porque o mixin `Hidden` precisa de
`internals.states`, no mesmo formato de `card.ts`.

**Foco**: `attachShadow({ mode: 'open' })`, **sem** `delegatesFocus`. Correto: não há slot
com conteúdo arbitrário do consumidor (diferente de `kb-card`) e um `<img>` sem `tabindex`
não é focável. Nada a delegar.

---

## 4. Gestão de Estado

| Dado | Onde mora | Controlado? | Regra de sincronização |
|---|---|---|---|
| `src` | campo privado + attribute | Controlado — DOM é a fonte da verdade | `@repaint` reescreve o markup, projetando no `<img>` |
| `alt` | campo privado + attribute | Controlado | `@repaint`, idem |
| `orientation` | campo privado + attribute | Controlado | `@retouch` — só o estilo; o markup é constante quanto a ela. Filtrado por `enumerating(ORIENTATIONS)`: o campo guarda sempre o último valor válido |

**Estado derivado**: nenhum. Todo dado é espelho direto de um attribute — é o desenho a
manter.

**Assimetria de renderização**: `src`/`alt` disparam `@repaint` porque vivem no markup;
`orientation` dispara `@retouch` porque vive só no CSS. A separação está correta e deve ser
mantida — trocar `orientation` não deve fazer o navegador rebaixar e re-requisitar a imagem,
e é justamente o que o `@repaint` causaria.

---

## 5. Edge Cases

| # | Caso | Comportamento requerido |
|---|---|---|
| 1 | `orientation` com valor desconhecido em runtime | **Corrigido nesta versão.** `enumerating(ORIENTATIONS)` filtra no `attributeChanged`: um valor fora do enum nunca chega ao setter, e a property mantém o último valor válido — sem divergência entre a property e o CSS |
| 2 | `src` ausente ou `''` | O template ainda renderiza `<img src="">`, o que faz o navegador emitir uma requisição para a URL do próprio documento e falhar. Visualmente o resultado é a caixa de fundo (`--cover-color-background`) na proporção correta — aceitável, mas a requisição espúria é um efeito colateral não desejado. Não é escopo desta revisão; registrar como achado |
| 3 | `alt` ausente | O template escreve `alt=""`, tornando a imagem **decorativa por default**. Isso é uma escolha semântica implícita: o leitor de tela ignora a imagem em vez de anunciar a URL do arquivo (que é o que um `<img>` sem `alt` faz). É o comportamento mais seguro dos dois, e coerente com o que `docs/components/cover.md` orienta ("nunca omita `alt`") — mas o default silencioso significa que uma imagem informativa sem `alt` desaparece sem aviso. Fora do contrato de runtime: a validação de uso correto é de lint/review, não de código de produção (rule 023, rule 064) |
| 4 | Imagem com proporção nativa diferente de `orientation` | `object-fit: cover` recorta. Nunca deforma, nunca deixa faixa vazia. É o desenho |
| 5 | Imagem que falha ao carregar | Aparece o fundo e, dependendo do navegador, o ícone de imagem quebrada com o texto de `alt`. Nenhum tratamento próprio — ver "Não-requisitos" |
| 6 | Esconder a capa | **Corrigido nesta versão.** `kb-cover` agora usa `Hidden`: tem `hidden` (reflete o attribute) e `:state(hidden)` no CSS (`:host(:state(hidden)) { display: none }`). O getter lazy `internals` foi adicionado para o mixin. Falta atualizar `docs/components/cover.md`, que ainda registra a limitação antiga — escopo do `writer` |
| 7 | Controlar altura/largura da capa | **Omissão intencional — não é lacuna.** O tamanho vem inteiramente de `aspect-ratio` mais a largura que o container concede, e é isso que faz `orientation` significar alguma coisa. Adicionar `Height`/`Width` criaria duas fontes de verdade para a mesma caixa: um `height="200px"` junto de `orientation="portrait"` deixaria a proporção declarada e a caixa real em conflito, sem regra escrita para quem vence. Um consumidor que precisa de tamanho fixo controla o container (é o que `docs/components/cover.md` já demonstra, envolvendo a capa numa `<div>` com custom properties). Registrar aqui que a ausência é deliberada, para que a próxima revisão não a "corrija" |
| 8 | Leitor de tela | Papel `img` e nome vindos do `<img>` nativo, sem nenhuma intervenção do componente. É a razão de o pacote não usar `Identity` (seção 3) |
| 9 | Teclado | A capa nunca recebe foco. Sem `tabindex`, sem `delegatesFocus`, sem conteúdo slotted focável — não há o que tabular |
| 10 | Capa dentro de `kb-card` / `kb-inset` | Composição pura de layout; a capa não interfere e não é interferida. É o uso principal documentado |
| 11 | Alto contraste / `forced-colors` | Sem tratamento. Como toda a superfície visual é a própria imagem, o modo de cores forçadas não a altera — só o fundo e o raio, que são invisíveis sob a imagem carregada. Nenhuma ação necessária |
| 12 | Trocar `src` por arco (`on`) | Funciona; é o segundo teste do pacote. `@repaint` reescreve o markup e o navegador carrega a nova imagem |

### `orientation`: enum e validação (corrigido nesta versão)

**O que existia antes.** `orientation` era declarado como `@attributeChanged('orientation')`
puro, sem filtro. A property aceitava e guardava qualquer string. A única barreira contra
valor inválido estava em `style.js`, comparando `cover.orientation === 'portrait'` duas vezes
na mesma linha — uma para o nome da custom property, outra para o literal de fallback.

**Correção aplicada** — o mesmo padrão que `src/component/card/direction.js` e
`src/component/card/card.ts` já aplicam para `direction`:

1. `src/component/cover/orientation.js` criado com o enum congelado
   `ORIENTATIONS = Object.freeze({ LANDSCAPE: 'landscape', PORTRAIT: 'portrait' })` —
   espelho exato de `card/direction.js`.
2. Em `cover.ts`, o decorator passou a ser
   `@attributeChanged('orientation', enumerating(ORIENTATIONS))`. Valor fora do enum nunca
   chega ao setter; a property mantém o último válido.
3. O default do getter passou a vir do enum: `(this.#orientation ??= ORIENTATIONS.LANDSCAPE)`.
4. `style.js` simplificado: a interpolação do nome da custom property agora é direta
   (`--cover-aspect-ratio-${cover.orientation}`), e o ternário restante só escolhe o literal
   de fallback — uma comparação em vez de duas, resolvendo a duplicação da rule 021.

Cobertura de teste (`orientation`) e de `hidden` fica a cargo do `tester`, fora do escopo
desta revisão de código.

### Auditoria de tokens (designer)

O `kb-cover` nunca passou por revisão formal do `designer` — registrado como pendente na
tabela de divisão de trabalho desde a v1.0. Esta seção fecha essa lacuna, seguindo o método
"Decidir se um valor vira token" do agent `designer` (skill `token`, `references/uso-em-css.md`).

**1. `--cover-color-background` e `--cover-border-radius` seguem o padrão duplo —
confirmado, sem divergência.**

| Custom property | Fallback global | Padrão duplo? |
|---|---|---|
| `--cover-color-background` | `--color-pure-white` | Sim |
| `--cover-border-radius` | `--border-radius-md` | Sim |

Ambos seguem exatamente `var(--cover-<propriedade>, var(--<token-global>))`, o mesmo formato
de `kb-button` e `kb-card`. Nenhuma correção necessária em `style.js` neste ponto. As duas
custom properties de proporção (`--cover-aspect-ratio-landscape`/`-portrait`) permanecem como
a exceção já registrada na seção 2 — fallback literal, não token, por ausência de escala de
proporção em `packages/pixel/tokens/` (confirmado: nenhum arquivo do diretório trata de
`aspect-ratio`). Reaberta a checagem nesta auditoria e mantida a mesma conclusão — inventar
`--aspect-ratio-*` global sem segundo consumidor seria funcionalidade especulativa (rule
023/064).

**2. `display: block`, `height: 100%`, `object-fit: cover`, `width: 100%` no `img`, e
`box-sizing: border-box` no `:host` — estruturais, sem token, corretos.** Todos aparecem na
tabela "Propriedades sem token" da skill `token`: `display` aceita qualquer valor válido sem
token; `height`/`width` com `100%` é o valor de preenchimento de container, não um tamanho
temático da escala; `box-sizing: border-box` é o mesmo valor fixo que `kb-button` e `kb-card`
já usam sem token. `object-fit` não consta na tabela porque não é propriedade de
tema — é comportamento de recorte de mídia, tratado no ponto 5 abaixo, não aqui. Nenhuma
mudança em `style.js`.

**3. Nenhum token de espaçamento faltando — a ausência é coerente, não é lacuna.** `kb-card`
tem `--card-space-gap`/`--card-space-inset` porque organiza múltiplos filhos slotted com
distância entre eles e em relação à borda. `kb-cover` renderiza um único `<img>` que preenche
o host inteiro (`height: 100%`, `width: 100%`) — não há segundo elemento para espaçar, nem
borda interna a reservar. Adicionar `--cover-space-inset` sem um segundo filho ou legenda
seria funcionalidade especulativa (rule 023): o próprio DESIGN já descarta legenda e overlay
de texto como não-requisito (seção 1). Nenhuma mudança necessária.

**4. Contraste do fallback `--color-pure-white` — não aplicável, confirmado.** O componente
não renderiza texto: o único conteúdo é a imagem via `<img>`, e o fundo só fica visível
enquanto ela carrega ou se falha (Edge cases 2 e 5). Não há par cor-de-fundo/cor-de-texto a
verificar, ao contrário de `kb-card`, que tem conteúdo textual slotted sobre
`--card-color-background`. Se um consumidor sobrescrever `--cover-color-background` com uma
cor que colida com um `alt` visível via navegador (ícone de imagem quebrada), a legibilidade
desse texto é controlada pelo user agent, não pelo `kb-cover` — fora do alcance de qualquer
token deste pacote. Nenhuma ação necessária.

**5. `object-fit: cover` fixo — decisão de design correta, sem variação a introduzir
agora.** O nome do componente (`kb-cover`, "capa") já implica recorte para preencher a
proporção declarada, não contenção com faixas vazias — é o próprio Edge case 4 do documento:
"nunca deforma, nunca deixa faixa vazia. É o desenho". Uma variação (`contain`, `fill`)
mudaria a natureza do componente para algo mais próximo de um `<img>` genérico com
`aspect-ratio`, que já está fora de escopo (seção 1, não-requisitos: "quem precisa usa um
`<img>` puro"). Sem consumidor concreto pedindo `object-fit: contain` hoje, abrir essa
variação seria overengineering (rule 064) e funcionalidade especulativa (rule 023). Se um
consumidor real precisar de outro comportamento de encaixe, é decisão nova do `architect`
para avaliar se ainda é `kb-cover` ou um componente distinto — não uma correção deste
`style.js`. Registrar a decisão como definitiva para o escopo atual, não como lacuna.

**Conclusão da auditoria**: nenhuma mudança em `style.js` é necessária. O mapa de tokens
está correto e completo para o que o componente é hoje; a única assimetria (proporção sem
token global) já estava registrada e permanece justificada.

---

## Divisão de trabalho entre ofícios

| Área | Ofício responsável | Status |
|---|---|---|
| Contrato público, cadeia de mixins, decisão sobre `Hidden` e `Height`/`Width` | `architect` | Concluído |
| Enum `ORIENTATIONS`, `enumerating` no `attributeChanged`, simplificação de `style.js`, mixin `Hidden` na cadeia | `developer` | Concluído |
| Testes de `orientation` (default, troca, valor inválido) e de `hidden` | `tester` | Pendente |
| Revisão dos tokens `--cover-*` — o pacote nunca passou por revisão formal do `designer` | `designer` | Concluído |
| Atualização de `docs/components/cover.md` para `hidden` | `writer` | Pendente |

---

**Criado em**: 2026-08-20
**Atualizado em**: 2026-08-21
**Versão**: 1.2
