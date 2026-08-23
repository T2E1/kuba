# DESIGN — `kb-icon`

**Pacote**: `src/component/icon/`
**Tag**: `<kb-icon>`
**Status**: documentação retroativa — a implementação precede este documento
**Data**: 2026-08-22

---

Este documento segue o framework LLD (5 passos) e descreve `kb-icon` como ele existe hoje. O
pacote foi escrito antes de qualquer processo formal de design neste repositório e nunca teve
especificação própria. O objetivo é duplo — registrar a forma já implementada, sem
redesenhá-la, e apontar explicitamente onde ela diverge do padrão que `kb-button`, `kb-card`,
`kb-cover` e `kb-stack` já consolidaram.

Cinco pontos foram levantados pelo orquestrador e reconferidos contra o código atual. Cada um
está **confirmado** ou **refutado**, com evidência de arquivo e linha — e, no caso do
primeiro, com prova de execução real em navegador — na seção **Lacunas confirmadas** ao fim
deste documento. Nada foi corrigido aqui: este documento registra a forma existente.

A partir desta versão vale a mesma regra dos outros: quando implementação e documento
divergirem, é a implementação que está errada. Mudança de comportamento passa primeiro por uma
revisão deste documento, depois pelo código.

## Visão Geral

`kb-icon` é um **glifo**: um caractere da fonte Material Symbols Rounded, renderizado como o
próprio conteúdo de texto do elemento, sem wrapper nenhum no shadow root. `use="home"` vira a
ligadura `home`, que a fonte resolve para o desenho da casa. Não há SVG, não há sprite, não há
asset — a escolha estruturante do pacote é que **o ícone é texto**, e é dela que decorrem
`size` na escala tipográfica, `color` herdando `currentColor`, e o alinhamento de baseline
sem esforço.

O que ele **não** é: um controle. Não tem `click`, não é focável, não tem `tabindex`, não
participa de `<form>`, não tem `hidden`, não despacha evento próprio. Quando o glifo precisa
ser pressionável, ele vive dentro de `<kb-button variant="icon">`, que traz área de toque,
anel de foco e nome acessível. Também não é a marca do produto — isso é `<kb-logo>`, que
renderiza SVG real.

A segunda escolha estruturante é de acessibilidade, e é a mais interessante do pacote: **um
ícone sem nome esconde a si mesmo**. Como o glifo é literalmente texto, um leitor de tela sem
tratamento anunciaria a ligadura crua — `<kb-icon use="delete">` leria "delete". Por isso o
hook `[decorative]` escreve `internals.ariaHidden = 'true'` sempre que `alt` está vazio, e
`'false'` assim que um nome chega. O default é decorativo porque o caso comum é o ícone ao
lado de um rótulo que já carrega o significado.

---

## 1. Requisitos

| Pergunta (LLD passo 1) | Resposta |
|---|---|
| Quem consome, em que contexto | Qualquer contexto inline — dentro de `kb-button`, ao lado de um `kb-text`, numa linha de tabela densa, numa toolbar |
| Somente leitura ou interativo | Somente leitura. Toda interação pertence ao controle que o envolve |
| Caso de uso mínimo (MVP) | Renderizar uma ligadura nomeada como glifo, na escala e cor certas, e não poluir a árvore de acessibilidade |
| Participa de `<form>` | Não. `formAssociated` não é declarado |
| Papel e nome acessível | Papel `img` fixo no host via `Identity`; nome opcional por `alt`, do mesmo mixin. Sem nome, o host é `aria-hidden` |
| Superfície de variação | Três attributes próprios (`use`, `size`, `color`), mais `alt` do mixin e `on` do `Echo`; seis custom properties `--icon-*` |
| Sub-elemento interno | **Nenhum.** `component.js` retorna `icon.use` cru — o shadow root é uma string de texto, sem uma única tag |

**Requisitos funcionais**

1. Renderiza `use` verbatim como conteúdo de texto do shadow root, sem markup
   (`component.js:4-6`).
2. Publica `role="img"` no host, como semântica default (`icon.ts:24-26`).
3. Sem `alt`, publica `aria-hidden="true"` no host; com `alt`, `'false'`
   (`icon.ts:79-83`). Vale tanto no `@connected` quanto numa mudança de `alt` posterior ao
   mount — o `@around(decorative)` no setter cobre o segundo caso.
4. `alt` escreve `internals.ariaLabel`, pelo mixin `Identity`.
5. `size` resolve contra a escala tipográfica global, `var(--font-size-{size})`, default `md`
   (`icon.ts:50-52`, `style.js:11`).
6. `color` **não** tem default de paleta: sem o attribute, resolve para `currentColor`, de
   modo que o glifo herda a cor do texto ao redor (`icon.ts:37-42`). Com o attribute, resolve
   `var(--color-{color})`.
7. Seis pontos de override em CSS: `--icon-color`, `--icon-size` e os quatro eixos de
   variação da fonte (`FILL`, `wght`, `GRAD`, `opsz`).

**Não-requisitos (YAGNI, rule 023)**

- Evento próprio — o ícone não é clicável, e um `clicked` aqui convidaria exatamente o uso
  que `docs/components/icon.md:32-34` desaconselha. `Echo` está na cadeia como *ouvinte* de
  arco, não como emissor; ver seção 3.
- `hidden` / mixin `Hidden` — um glifo condicional é removido pelo consumidor, ou escondido
  pelo container. Ver Edge case 8.
- `Height` / `Width` — a caixa do glifo é a do próprio caractere; `font-size` é a única
  dimensão que faz sentido, e ela já é `size`. Abrir largura e altura criaria segunda fonte
  de verdade para a mesma caixa.
- `Disabled` / `Value` — não é controle e não tem valor.
- Slot, de qualquer nome — o conteúdo do shadow root é `use` e nada mais; filhos no light DOM
  são ignorados por desenho, e `docs/components/icon.md:42-44` documenta isso.
- Fallback de glifo desconhecido — um `use` que a fonte não conhece renderiza como texto
  literal, o que é a forma mais rápida de ver o erro de digitação. É comportamento desejado,
  não lacuna.

---

## 2. Contrato Público

### Attributes / Properties

| Nome | Tipo | Default | Reflete | Especificação |
|---|---|---|---|---|
| `use` | `string` | `''` | não | Nome da ligadura Material Symbols. `@repaint` — muda o markup, então re-renderiza. `escaping` no `@attributeChanged` — o valor vira `innerHTML` real (ver seção 5) |
| `size` | `string` | `'md'` | não | Passo da escala tipográfica. `@retouch` — muda só o estilo. **Sem validação**; ver Lacuna 1 e 3 |
| `color` | `string` | `'currentColor'` (resolvido, não armazenado) | não | Sufixo de token de cor. `@retouch`. **Sem validação**; ver Lacuna 1 e 2 |
| `alt` | `string` | `''` | não | Vem do mixin `Identity`, mas é **redeclarado** em `icon.ts:28-35` para pendurar `@around(decorative)`; ver Lacuna 4 |
| `on` | `KUBAIconOnAttribute \| (string & {})` | — | não | Vem do mixin `Echo`. Fiação de arco, `source/event:type/sink`. Ficou de fora de `types.d.ts` até esta revisão — corrigido, mesmo formato de `card`/`button` |

Não há `hidden`, `height`, `width`, `value`, `disabled` nem `internals` — este último existe
em tempo de execução (`icon.ts:18-20`) e é usado pelos testes, mas **não é publicado em
`types.d.ts`**, o que está correto e é a convenção de `kb-button`, `kb-cover` e `kb-footer`.
Ver Lacuna 5 (refutada).

**Assimetria intencional no getter de `color`**: é o único getter do pacote cujo default não
é armazenado com `??=`. `size` e `use` guardam o default no campo privado na primeira leitura;
`color` calcula `this.#color ? var(--color-${this.#color}) : 'currentColor'` toda vez. É
deliberado e está comentado no código (`icon.ts:37-39`): um `color` não definido precisa
resolver para `currentColor`, e `currentColor` não é um valor que se possa guardar em `#color`
sem quebrar a interpolação `var(--color-...)` no ramo oposto. A consequência é que
`icon.color` **não devolve o que foi escrito no attribute** — devolve a expressão CSS já
montada. É um getter que transforma, não um getter puro, e a diferença importa para quem for
escrever teste contra ele.

### Events

Nenhum evento próprio. `kb-icon` não despacha nada. Está corretamente afirmado em
`docs/components/icon.md:116`.

### Slots

Nenhum. O shadow root não contém uma única tag — `component.js` retorna a string `icon.use`.
É o único componente do repositório com shadow root sem elemento algum.

### Parts

Nenhum, e nenhum a ter: não existe sub-elemento para exportar.

### Custom properties de CSS (pontos de extensão)

| Custom property | Fallback | Controla |
|---|---|---|
| `--icon-color` | `${icon.color}` — o attribute, ou `currentColor` | Cor do glifo, sobrepondo o attribute |
| `--icon-size` | `var(--font-size-${icon.size})` | Tamanho do glifo, sobrepondo o attribute |
| `--icon-fill` | `1` | Eixo `FILL` da fonte: `1` sólido, `0` contornado |
| `--icon-weight` | `400` | Eixo `wght`, `100`–`700` |
| `--icon-grade` | `0` | Eixo `GRAD` |
| `--icon-optical-size` | `24` | Eixo `opsz` |

Os dois primeiros seguem o padrão duplo `var(--icon-<propriedade>, <valor derivado do
attribute>)` — mas com uma diferença em relação a `kb-button`: ali o segundo nível ainda cai
num token global com terceiro fallback (`var(--color-${button.color}, var(--color-primary))`,
`button/style.js:11`), aqui não há terceiro nível. Um `color` inválido em `kb-icon` resolve
para nada e a declaração é descartada; em `kb-button` ela cai em `--color-primary`. Isso é
consistente com o que a doc promete (`icon.md:102-104`, "an unknown name silently resolves to
nothing rather than failing loudly"), mas é a metade benigna do problema descrito na Lacuna 1
— a metade maligna é o valor que não resolve para nada porque **fecha a regra**.

Os quatro eixos de variação usam fallback literal, sem token global, e corretamente: são
números de um eixo de fonte variável, não medidas do sistema de design. Não existe — nem
deveria existir — uma escala global de `FILL`.

**Rule 037 (flag arguments)**: nenhum attribute booleano no contrato.

---

## 3. Composição

**Cadeia**: `Identity(Echo(HTMLElement))`

| Mixin | Traz | Por que entra na cadeia |
|---|---|---|
| `Echo` | Attribute `on`, fiação declarativa de arcos entre elementos | O ícone é um alvo natural de arco: um `kb-icon` que troca de glifo ou de cor conforme o estado de outro elemento é o caso de uso — trocar o mark de status conforme um `kb-input` valida. Entra como **receptor**, não como emissor |
| `Identity` | `alt` → `internals.ariaLabel`; hook `@connected [identifiable]()` que publica `this[role]` | O glifo é conteúdo visual sem texto legível próprio. Sem papel publicado ele é uma caixa anônima com uma ligadura dentro, e sem `alt` não há como nomeá-lo quando ele **é** o significado |

A ordem importa e está correta: `Identity` é o mais externo, então `set alt` do `Identity`
está mais perto do topo da cadeia e o `super.alt` de `Icon` o alcança. Ver Lacuna 4.

**Sobre não usar `Hidden`, `Height`, `Width`, `Disabled`, `Value`**: nenhum tem uso — ver
"Não-requisitos". Herdar seria herança recusada (rule 059).

### Symbols do contrato

| Symbol | Origem | Forma | Papel |
|---|---|---|---|
| `role` | `packages/mixin/identity/interfaces.js` | `Symbol.for('role')` | `kb-icon` **implementa** `get [role]()` retornando `'img'`; o mixin **lê** no `@connected`. `Symbol.for` porque quem declara e quem lê estão em pacotes diferentes |
| `decorative` | `src/component/icon/interfaces.js:2` | `Symbol()` **local** | Chave do método que decide `ariaHidden`. Invocado de dois lugares dentro do próprio `icon.ts` — o `@connected` e o `@around` no setter de `alt`. Nenhum outro pacote o toca |

`decorative` como `Symbol()` local, e não `Symbol.for()`, está **correto** e é a decisão a
manter: a regra deste repositório é `Symbol.for()` só quando o contrato atravessa fronteira de
pacote. `decorative` não atravessa nada — declarante e consumidor são o mesmo arquivo. O
`interfaces.js` existe aqui, e não em `header`/`footer`, exatamente porque há um Symbol a
declarar; naqueles dois não há.

**Sub-elemento**: nenhum. Ver seção 2.

**`attachInternals()`**: uma única chamada, lazy, no próprio elemento (`icon.ts:18-20`) — o
mixin nunca chama, porque `attachInternals()` só pode rodar uma vez por elemento. Mesmo
formato de `button.ts`, `card.ts`, `cover.ts`, `header.ts` e `footer.ts`. **Divergência de
forma**: `button.ts:57-60` e `footer.ts` comentam esse getter explicando por que ele é público
em runtime e que não é contrato publicado; `icon.ts` não tem comentário nenhum ali. Cosmético,
mas é o mesmo ponto que virou Lacuna 3 no `kb-header`.

**Foco**: `attachShadow({ mode: 'open' })`, sem `delegatesFocus` (`icon.ts:72`), e aqui é
inquestionável — não há nada focável dentro de um shadow root que é uma string de texto.
Diferente de `header`/`footer`, onde a ausência era discutível, esta não é.

---

## 4. Gestão de Estado

| Dado | Onde mora | Controlado? | Regra de sincronização |
|---|---|---|---|
| `use` | `#use` + attribute | Controlado — DOM é a fonte da verdade | `@attributeChanged('use', escaping)` + `@repaint`: muda o texto renderizado, escapado antes de virar `innerHTML` |
| `size` | `#size` + attribute | Controlado | `@attributeChanged('size')` + `@retouch`: só re-executa o `cssCallback`, sem re-renderizar markup |
| `color` | `#color` + attribute | Controlado | `@attributeChanged('color')` + `@retouch` |
| `alt` | `#alt` **no mixin** + attribute | Controlado | `@attributeChanged('alt')` declarado no mixin; a atribuição resolve pela cadeia de protótipos até o setter de `Icon`, que chama `super.alt` e agenda `[decorative]` |
| `ariaHidden` | `internals` | **Derivado de `alt`** | Recalculado no `@connected` e a cada `set alt`, via `@around(decorative)` |
| `role` | nenhum campo — getter constante | Não é estado | Publicado uma vez em `internals.role`, no `@connected` do mixin |
| `internals` | campo privado, lazy | — | Instanciado na primeira leitura (`??=`) |

**Estado derivado**: um só, `ariaHidden`, e é o coração do pacote. Note que ele é derivado por
**agendamento**, não por cálculo síncrono: `@around` roda via `setImmediate`
(`packages/middleware/around.js`), de modo que `ariaHidden` só está correto no tick seguinte à
escrita de `alt`. É por isso que os cinco testes usam `vi.waitFor` em vez de asserção direta —
e é a razão pela qual essa espera é obrigatória, não defensiva.

`@retouch` em `size` e `color` contra `@repaint` em `use` é a distinção certa e está aplicada
corretamente: os dois primeiros só afetam CSS (`retouch.js` replica apenas o `cssCallback`),
o terceiro muda o conteúdo de texto e precisa de re-render.

---

## 5. Edge Cases

| # | Caso | Comportamento requerido |
|---|---|---|
| 1 | `<kb-icon>` sem `use` | Renderiza string vazia — `use` tem default `''`. Caixa `inline-flex` de largura zero, invisível e `aria-hidden` |
| 2 | `use` com ligadura desconhecida | Renderiza o texto literal em vez de um glifo. **Desejado**: é a forma mais rápida de ver o erro de digitação (`icon.md:172-173`) |
| 3 | Fonte Material Symbols não carregada | Todo `use` renderiza como texto literal. A fonte **não é empacotada com o kuba**; o consumidor a carrega. Documentado em `icon.md:157-158` |
| 4 | Ícone sem `alt` | `aria-hidden="true"` no host. É o default e o caso comum. Coberto por teste (`icon.test.js:4`) |
| 5 | `alt` chega depois do mount | `aria-hidden` vira `'false'` no tick seguinte. Coberto por teste (`icon.test.js:38`) — é o teste que prova que o override de `alt` não quebrou o `@attributeChanged` do mixin |
| 6 | `alt` removido depois de definido | `set alt` recebe `null`; `this.alt` cai no `??= ''` do mixin, e `[decorative]` volta a `'true'`. **Sem teste hoje**; ver Lacuna 6 |
| 7 | Ícone dentro de `kb-button variant="icon"` | O ícone fica decorativo (sem `alt`) e o **botão** carrega o nome. Nomear os dois anuncia a mesma coisa duas vezes (`icon.md:169-171`). Não há guarda em runtime — é uso incorreto, verificável por review, não por código de produção (rule 023/064) |
| 8 | Esconder o ícone | Não há `hidden` nem `:state(hidden)` — o consumidor remove o elemento ou esconde o container. Divergente de `kb-card`/`kb-cover`, igual a `kb-header`/`kb-footer`. **Omissão deliberada** |
| 9 | `size` ou `color` com valor desconhecido mas inofensivo (ex.: `size="enorme"`) | `var(--font-size-enorme)` não resolve, a declaração `font-size` é descartada e o glifo herda o tamanho do contexto. Degradação silenciosa, documentada |
| 10 | `size` ou `color` com valor **hostil** | **Quebra o CSS do shadow root e injeta regras arbitrárias nele.** Não é degradação silenciosa. Ver Lacuna 1 — confirmada com prova de execução |
| 11 | `color` não definido, sobre fundo invertido | Herda `currentColor`, que é o comportamento correto e a razão de o default não ser um token de paleta |
| 12 | Filhos no light DOM (`<kb-icon>texto</kb-icon>`) | Ignorados. Não há slot; o shadow root substitui integralmente o conteúdo renderizado |
| 13 | Leitor de tela, ícone nomeado | Anuncia como `img` com o nome de `alt`, não a ligadura. Coberto por dois testes (`icon.test.js:22` e `:30`) |
| 14 | Alto contraste / `forced-colors` | Sem tratamento. O glifo é texto e segue a cor de texto forçada pelo sistema, o que é o comportamento aceitável por default — mas `--icon-color` explícito é ignorado nesse modo, e nada no pacote reconhece isso |
| 15 | `direction: rtl` na página | `:host` força `direction: ltr` (`style.js:8`), obrigatório para a resolução de ligaduras da fonte |

---

## Lacunas confirmadas

Os cinco pontos levantados pelo orquestrador, mais um sexto encontrado no caminho.

### 1. `size` e `color` interpolam valor não validado direto no CSS — **CONFIRMADA, com prova de execução**

Esta é a lacuna real do pacote, e é da mesma classe do achado já corrigido em `kb-button`,
`kb-card` e `kb-stack` nesta sessão.

**A cadeia, arquivo por arquivo:**

1. `icon.ts:54-58` — `@attributeChanged('size')` sem filtro nenhum. `execute.js` atribui o
   valor cru do attribute a `context['size']`, e o setter guarda em `#size` sem inspecionar
   nada.
2. `icon.ts:44-48` — o mesmo para `color`, e o getter (`icon.ts:40-42`) devolve o valor cru
   já embrulhado em `var(--color-${this.#color})`.
3. `style.js:11` e `style.js:7` — os dois são interpolados numa template tag `css`.
4. `packages/dom/css.js:4-9` — `css` é `String.raw` seguido de `replaceSync`. **Não escapa
   nada.** O comentário no próprio arquivo diz o que ele faz e não promete escape.

**A prova.** Não bastou ler: rodei um teste no navegador real da suíte (Chromium, via
`vitest`), montando um `kb-icon` e escrevendo um payload no attribute. Resultado, lido de
`shadowRoot.adoptedStyleSheets[*].cssRules`:

Payload em `size`:

```
md)); } :host { outline: 9px solid red; } trap { font-size: var(--a
```

Folha de estilo resultante no shadow root — **duas regras onde deveria haver uma**:

```
:host { box-sizing: border-box; color: var(--icon-color, currentColor); direction: ltr;
        display: inline-flex; font-family: "Material Symbols Rounded";
        font-size: var(--icon-size, var(--font-size-md)); }
:host { outline: red solid 9px; }
```

O mesmo com `color`, com o payload `primary)); } :host { outline: 7px solid lime; } trap {
color: var(--z`. Os dois testes passaram, isto é: a injeção funciona pelos dois attributes.

Duas consequências, e a segunda é a que costuma passar despercebida:

- **Injeção**: uma regra `:host` inteira e arbitrária foi anexada ao shadow root. Qualquer
  propriedade CSS — `display: none`, `background-image: url(...)`, `content` — entra por aí.
- **Destruição**: repare no que sumiu da primeira regra. `font-variation-settings`,
  `font-weight`, `letter-spacing`, `line-height`, `white-space` e o resto do bloco original
  foram engolidos pela recuperação de erro do parser. Um payload que nem se preocupe em
  balancear parênteses — testei um antes — não injeta nada, mas **trunca a folha em
  `:host { box-sizing: border-box; }`**, deixando o ícone sem fonte, sem tamanho e sem cor.
  Ou seja: mesmo o atacante desastrado consegue o estrago.

**Isto é lacuna, não característica.** `button.ts:47-51` resolve exatamente este problema para
`color` com `enumerating(COLORS)`, e o comentário lá enuncia o motivo com todas as letras: "an
unknown one never reaches the setter, so an unvalidated attribute never reaches the CSS
interpolation in style.js". `card.ts:20-28` repete a fórmula para `direction` com o mesmo
comentário. `kb-icon` é o mesmo desenho, com a mesma superfície, sem a mesma defesa.

Sobre a gravidade real de `size`/`color`: o vetor exige que o valor de um attribute venha de
fonte não confiável — montado a partir de entrada de usuário, de query string ou de resposta
de API. Não é XSS: `replaceSync` não executa JavaScript, e o alcance é o shadow root do
próprio ícone. É defacement e quebra de layout dentro do escopo do elemento. Mas é exatamente
o mesmo alcance que já foi considerado suficiente para corrigir `button`, `card` e `stack`, e
o argumento que valeu lá vale aqui inteiro.

**Correção aplicada, ambos os caminhos**: `enumerated(COLORS)`/`enumerated(SIZES)` — filtros
de `@attributeChanged` no mesmo formato de `enumerating` (`packages/directive/attributeChanged/
enumerated.js`) — fecham `color` e `size`. A validação vive só no caminho de attribute, por
decisão explícita: escrita direta de propriedade (`icon.color = payload`) é um caminho
confiável, não uma fronteira de segurança, mesma posição já adotada para `button`/`card`/
`stack`/`cover`.

**`use` é categoria à parte, e a frase acima ("não é XSS") não se aplica a ele.**
`component.js` devolve `icon.use` cru, e `packages/dom/paint/render.js:24-25` escreve o
retorno via `(context.shadowRoot ?? context).innerHTML = ...` — isto **é** o caminho de
`innerHTML`, que interpreta a string como markup real. Um `use` com
`<img src=x onerror="...">` vira um `<img>` de verdade no shadow root, e o handler executa —
XSS legítimo, não defacement de CSS. Corrigido com `@attributeChanged('use', escaping)`,
mesmo filtro que `button.ts` usa para `alt` — provado em execução (payload de `<img onerror>`
vira texto literal `&lt;img src=x onerror=...`, sem elemento e sem execução).

**`ofício: architect` para desenhar os dois enums (ver Lacunas 2 e 3), depois `developer`.**

### 2. `color` sem lista fechada — **CONFIRMADA, mas `COLORS` do `button` é a resposta errada**

O ponto está certo; a solução sugerida não. `button/color.js` congela oito nomes-base:
`master`, `primary`, `complete`, `success`, `warning`, `danger`, `info`, `menu`. Adotar esse
enum em `kb-icon` seria **estreitar** o contrato publicado, não apenas endurecê-lo:

- `packages/pixel/tokens/color.css` define **quarenta e dois** tokens `--color-*`, não oito.
  Cada família tem degraus (`--color-primary-darker`, `-dark`, `-light`, `-lighter`), `master`
  tem sete, e ainda existem `--color-pure-white` e `--color-pure-black`.
- `docs/components/icon.md:100` documenta explicitamente `master-*` como valor de `color` —
  "Neutral greys, for icons that should recede from the text". `<kb-icon color="master-lighter">`
  é uso documentado e funciona hoje. `enumerating(COLORS)` o rejeitaria em silêncio.
- `button/style.js:11,32,36` mostra por que os oito bastam **lá**: o botão compõe os degraus
  sozinho, concatenando `-dark` e `-darker` no próprio CSS para hover e active. O enum de oito
  é o conjunto de *famílias*, e o botão deriva o resto. `kb-icon` não deriva nada — ele pinta
  uma cor só, e por isso precisa nomear o degrau.

Então a resposta à pergunta "o icon precisa aceitar qualquer token `--color-*` por natureza?"
é **não** — mas o conjunto fechado dele é a lista completa de tokens, não a lista de famílias.
São coisas diferentes, e confundi-las quebraria a doc.

Há um segundo consumidor pronto para o mesmo conjunto, o que remove qualquer objeção de
generalidade especulativa (rule 064): `src/typography/text/text.ts:31-38` tem `color` com
`@attributeChanged('color')` **sem filtro**, default `'master-dark'` — um degrau, não uma
família — e `src/typography/text/style.js:6` interpola em `var(--color-${text.color})`.
`kb-text` tem o mesmo vetor da Lacuna 1 e precisa do mesmo enum. O comentário no topo de
`button/color.js:1-3` já antecipa isso: "the same set `kb-icon` and `kb-text` also resolve
their `color` attribute against, even without validating it today".

A decisão de onde esse enum mora — pacote compartilhado com os 42 tokens, ao lado de
`packages/pixel/tokens/color.css` — é projeto novo e passa pelo `architect`, não por este
documento. **`ofício: architect`, escopo `kb-icon` + `kb-text`.**

### 3. `size` sem lista fechada — **CONFIRMADA, e aqui o enum é direto**

`types.d.ts:30` declara `size: string`, sem união de literais. A escala fechada existe e é
inequívoca: `packages/pixel/tokens/fontSize.css` define onze passos —
`xxxs`, `xxs`, `xs`, `sm`, `md`, `lg`, `xl`, `xxl`, `xxxl`, `display`, `giant`.

`docs/components/icon.md:74-79` já publica esses passos como uma tabela de valores válidos,
com faixa de pixels e caso de uso para cada grupo. A doc já trata `size` como enum; só o
código não trata. É a mesma forma que `kb-card` deu a `direction` — um `size.js` com
`Object.freeze`, `enumerating(SIZES)` no decorator, e a união de literais em `types.d.ts`.

Diferente do `color`, aqui não há ambiguidade sobre qual é o conjunto nem sobre onde ele mora:
onze constantes, um arquivo no pacote, e o mesmo padrão `enumerating` já aplicado três vezes
nesta sessão. **`ofício: developer`**, se o `architect` decidir que a escala é local ao ícone,
ou compartilhada com `kb-text` — que tem um `size` com o mesmo problema.

### 4. Override de `alt` sobre o mixin `Identity` — **REFUTADA: é override legítimo e seguro**

`icon.ts:28-35` redeclara `get alt()`/`set alt()` só para pendurar `@around(decorative)`,
delegando a `super.alt` nos dois lados. Reconferi o mecanismo em `identity.ts` e é seguro, por
três razões independentes:

1. **O `@attributeChanged` do mixin não é sombreado, porque não vive no accessor.**
   `identity.ts:30` aplica o decorator ao protótipo de `C`, e `execute.js` faz duas coisas
   ali: registra `'alt'` em `C.constructor.observedAttributes` e embrulha
   `attributeChangedCallback` num `Proxy`. Nenhuma das duas mora no descriptor de `alt`.
   Redeclarar o accessor em `Icon` não toca nem no `observedAttributes` estático (que `Icon`
   herda) nem no `attributeChangedCallback` do protótipo (que `Icon` também herda).
2. **A atribuição do proxy encontra o setter mais derivado, que é o certo.**
   `execute.js` termina em `context[property] = value` — atribuição dinâmica em `this`. A
   resolução pela cadeia de protótipos acha primeiro o setter de `Icon`, que agenda
   `[decorative]` e repassa a `super.alt`, que é o setter do mixin, que escreve
   `#alt` e `internals.ariaLabel`. Nada é pulado, e a ordem é a desejada.
3. **Há teste provando exatamente isso.** `icon.test.js:38-46`, `stops hiding when a name
   arrives after mount`: monta sem `alt`, espera `ariaHidden === 'true'`, faz
   `setAttribute('alt', 'Delete')` e espera `'false'`. Esse teste só passa se as duas pontas
   sobreviveram ao override — o `attributeChangedCallback` do mixin disparando, e o
   `@around` do `Icon` recalculando. Passa.

Um hook separado seria pior, não melhor: exigiria um segundo `@attributeChanged('alt')` em
`Icon`, e aí sim haveria duas inscrições no mesmo attribute, cada uma com sua cadeia de
filtros, disparando em ordem não declarada. O override é a forma mais simples que funciona.

O que **falta** é comentário. `button.ts:31-36` explica em seis linhas por que ele não usa o
`Identity`; `icon.ts:28-35` não explica por que redeclara `alt` — o comentário mais próximo
está no `[decorative]` lá embaixo (`icon.ts:75-78`) e fala do *default* de acessibilidade, não
do mecanismo de override. Um leitor futuro tem chance real de "limpar" o accessor
aparentemente redundante e derrubar o Edge case 5 sem entender o que quebrou.
**`ofício: developer`**, comentário de três linhas.

### 5. `internals` publicado em `types.d.ts` — **REFUTADA: não está lá**

Conferido. `src/component/icon/types.d.ts` declara `alt`, `color`, `on`, `size`, `use` —
e nenhum `internals`. `grep` sobre todos os `types.d.ts` de `src/` confirma que `icon`
não está na lista dos que publicam o membro, que hoje é: `card`, `header`, `logo`, `progress`,
`stack`, `form`, `fileupload`, `textarea`, `input`, `validity`, `inset`, `main`.

`kb-icon` já está do lado certo, junto de `button`, `cover` e `footer`. **Não é achado.**

### 6. `alt` removido depois de definido não tem teste — **CONFIRMADA (achado adicional)**

`icon.test.js` tem cinco testes e cobre bem a direção "ganha nome": monta sem `alt` e esconde,
monta com `alt` e mostra, nomeia, publica `img`, e ganha `alt` depois do mount. Falta a
direção inversa — `removeAttribute('alt')` num ícone nomeado deve voltar a `aria-hidden="true"`.

Não é hipotético: é o caminho por onde um ícone de status muda de significativo para
decorativo, e é exatamente o cenário que `Echo` habilita (o arco removendo o attribute). O
comportamento hoje depende de um detalhe fino — `execute.js` propaga `null` quando o attribute
é removido, o mixin guarda `null` em `#alt`, e o getter `??= ''` o converte, de modo que
`this.alt ? ... ` no `[decorative]` cai no ramo falso. Funciona por composição de três
defaults, e nada trava se um deles mudar. **`ofício: tester`**, um teste.

---

### Auditoria de tokens (designer)

`kb-icon` nunca passou por revisão formal do `designer`. Esta seção **não** substitui essa
revisão — registra apenas o que é verificável do lado da arquitetura, e a revisão do `designer`
permanece pendente na tabela abaixo.

- `--icon-size` cai na escala global `--font-size-*`, e `--icon-color` na paleta global
  `--color-*`. Os dois usam token global de verdade, sem literal — melhor que
  `header`/`footer`, que precisam de literal por ausência de escala de tamanho.
- Os quatro eixos de fonte (`--icon-fill`, `--icon-weight`, `--icon-grade`,
  `--icon-optical-size`) usam literal, e corretamente: são parâmetros de uma fonte variável
  específica, não medidas do sistema de design.
- `box-sizing`, `direction`, `display`, `font-family`, `font-style`, `font-weight`,
  `letter-spacing`, `line-height`, `text-rendering`, `text-transform`, `white-space`,
  `word-wrap` e os dois prefixados são estruturais, sem token, corretos — o bloco inteiro é o
  boilerplate canônico de Material Symbols.
- **Ponto para o `designer` olhar**: `--icon-weight` default `400` contra `font-weight: normal`
  declarado logo abaixo (`style.js:18`). Não há conflito real — `wght` é eixo de variação e
  `font-weight` é a propriedade CSS —, mas as duas linhas dizem coisas parecidas com números
  diferentes e vão confundir quem for ajustar peso de glifo.
- Nenhum par de contraste a verificar: sem `color` explícito o glifo herda `currentColor`, e o
  contraste é o do texto ao redor. Com `color` explícito, o par depende do fundo do consumidor
  e o componente não tem como garanti-lo — o que é justamente o argumento de
  `icon.md:179` para deixar `color` não definido no caso comum.

---

## Divisão de trabalho entre ofícios

| Área | Ofício responsável | Status |
|---|---|---|
| Contrato público, cadeia de mixins, Symbols, decisão sobre `Hidden`/`Height`/`Width`/`delegatesFocus` | `architect` | Concluído |
| Injeção de CSS por `size` e `color` (Lacuna 1) — confirmada com prova de execução | `architect` → `developer` | **Pendente** |
| Enum fechado de `color`: os 42 tokens de `color.css`, não os 8 de `button/color.js`; onde mora, e se `kb-text` entra junto (Lacuna 2) | `architect` | **Pendente** |
| Enum fechado de `size` sobre os 11 passos de `fontSize.css` (Lacuna 3) | `architect` → `developer` | **Pendente** |
| Comentário explicando por que `alt` é redeclarado em `icon.ts:28-35` (Lacuna 4) | `developer` | **Pendente** |
| Comentário no getter `internals`, espelhando `button.ts:57-60` | `developer` | **Pendente** |
| Teste de `alt` removido depois de definido (Lacuna 6) | `tester` | **Pendente** |
| `docs/*/components/icon.md:102-104` — "Any suffix of `--color-*` works" deixa de valer se o enum entrar; o mesmo para a doc de `size` | `writer` | **Pendente**, depois da decisão do `architect` |
| Mesmo vetor de injeção em `kb-text` (`text.ts:35-38`, `text/style.js:6`), fora deste pacote | `architect` | **Pendente**, relatado |
| Revisão dos tokens `--icon-*`, incluindo `--icon-weight` × `font-weight` | `designer` | **Pendente** |

---

**Criado em**: 2026-08-22
**Atualizado em**: 2026-08-22
**Versão**: 1.0
