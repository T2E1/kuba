# DESIGN — `kb-render`

**Pacote**: `src/behavior/render/`
**Tag**: `<kb-render>`
**Status**: documentação retroativa — a implementação precede este documento
**Data**: 2026-08-27
**Atualizado**: 2026-08-27 — pendências de `layout`, `textContent` e cobertura de `Hidden` resolvidas (ver seções 2, 3 e 5)

---

Este documento segue o framework LLD (5 passos) e descreve `kb-render` como ele existe hoje.
O pacote foi escrito antes de qualquer processo formal de design neste repositório e nunca
teve especificação própria. O objetivo é registrar a forma já implementada, sem redesenhá-la,
e apontar com evidência onde ela está descoberta ou incoerente com o resto do repositório.

A partir desta versão vale a mesma regra dos outros: quando implementação e documento
divergirem, é a implementação que está errada. Mudança de comportamento passa primeiro por
uma revisão deste documento, depois pelo código.

## Visão Geral

`kb-render` é o único pacote de `src/behavior/` que **renderiza** — tem shadow DOM, `style.js`
e `component.js`, ao contrário de `kb-on`, `kb-headers` e `kb-redirect`, que são headless.
Sua função é interpolar um `<template>` contra dados arbitrários (`render(data)`) e substituir
seu `textContent` pelo resultado, tipicamente acionado declarativamente por um arco `on`
vindo de outra fonte (um `<kb-fetch>` que termina, por exemplo).

O elemento resolve o caso de listas/registros vindos de fora do controle do autor de markup:
o número de itens não é conhecido em tempo de escrita da página, então não há como escrever N
elementos estáticos. `render(data)` aceita um valor único ou um array — internamente,
`[].concat(data)` normaliza os dois casos para o mesmo caminho de mapeamento — e concatena
uma interpolação de template por entrada. `clear()` é o comando inverso: esvazia sem perder o
template, tipicamente acionado por um evento de erro/vazio (ex.: `failed` de um `<kb-fetch>`).

A escolha estruturante do pacote é que o **template não é um attribute obrigatório**: se
`template` (attribute que referencia um `<template>` por id) estiver vazio, o elemento procura
um `<template>` filho direto (`this.querySelector('template')`). Isso permite o uso mais comum
— `<kb-render><template>...</template></kb-render>` — sem exigir um id só para linkar. O
`layout` (`'list'` | `'grid'`) governa apenas a disposição CSS do conteúdo slotted, via
`:host([layout="grid"])`; não afeta `render()` nem `clear()`.

---

## 1. Requisitos

| Pergunta (LLD passo 1) | Resposta |
|---|---|
| Quem consome, em que contexto | O autor de markup que precisa exibir uma lista ou registro cujo conteúdo só existe em runtime (resultado de fetch, filtro, dataset) |
| Somente leitura ou interativo | Somente leitura da perspectiva do usuário final; comando (`render`/`clear`) da perspectiva de quem escreve o arco `on` |
| Caso de uso mínimo (MVP) | `<template>` filho com um placeholder, `render(dado)` chamado uma vez |
| Participa de `<form>` | Não |
| Papel e nome acessível | `role: 'none'` — deliberado, ver seção 3 |
| Superfície de variação | `layout`, `template`, `on` (herdado de `Echo`) |
| Sub-elemento interno | Shadow root com `component.js`/`style.js`; conteúdo slotted é o `<template>` fonte, não renderizado diretamente por ele |

**Requisitos funcionais**

1. Expõe `layout` como attribute refletido em CSS (`'list'` default via seletor combinado,
   `'grid'` explícito), sem propriedade JS dedicada além do attribute — o CSS lê o attribute
   diretamente via seletor de atributo, não há `get layout()`/`set layout()` em `render.ts`.
2. Resolve o template de duas formas: por `template` (id, via `document.querySelector`,
   resolvido e cacheado uma vez) ou, na ausência dele, pelo `<template>` filho direto.
3. `render(data)`: normaliza `data` para array com `[].concat(data)`, mapeia cada entrada com
   `interpolate(super.template, entrada)`, concatena com `.join('')`, atribui a
   `#textContent`. Decorado com `@repaint`, então dispara nova pintura do shadow DOM.
4. `clear()`: zera `#textContent` sem tocar no template resolvido. Também `@repaint`.
5. `get [role]()` retorna `'none'` — o container não carrega semântica própria; quem a
   carrega é o conteúdo interpolado dentro dele.
6. Nunca some do layout (ao contrário dos headless): tem shadow DOM real, `component.js`
   projeta `render.textContent` (a string já interpolada) dentro do `html` template.

**Não-requisitos (YAGNI, rule 023)**

- Renderização incremental/diffing (tipo virtual DOM). `render()` sempre substitui o
  `textContent` inteiro — simples, e suficiente para o caso de uso provado pelos testes.
- Sanitização de HTML do dado interpolado. `interpolate()` decide isso, não este pacote —
  fora do escopo do `DESIGN.md` de `kb-render`.
- Paginação, virtualização de lista longa. Nenhum indício no código ou nos testes de que
  isso é tratado; um dataset grande interpola tudo de uma vez.
- Papel ARIA diferente de `'none'`, `alt`, foco gerenciado. O comentário em `render.ts:19-20`
  já registra a intenção: "the rendered items carry the semantics, not the box holding
  them" — coerente com `render.test.js`, que prova exatamente essa ausência de papel.

---

## 2. Contrato Público

### Attributes / Properties

| Nome | Tipo | Default | Reflete | Especificação |
|---|---|---|---|---|
| `layout` | `'list' \| 'grid'` | `'list'` | via CSS (`:host([layout=...])`) | Não tem getter/setter em `render.ts` — é lido puramente pelo CSS via seletor de attribute. `types.d.ts` documenta como propriedade, mas a implementação não expõe `get`/`set layout` explícito; o comportamento de propriedade vem de qualquer mecanismo padrão de reflexão de attribute do repositório, não investigado neste documento além do que `render.ts` mostra |
| `template` | `string` (id) | `''` (implícito) | não | Id de um `<template>` externo, resolvido uma vez via `document.querySelector('#value')` e cacheado. Vazio → cai no `<template>` filho |
| `on` | string (arco) | — | não | Herdado de `Echo`. Tipicamente `.../changed:method/render` ou `.../failed:method/clear` |

**Rule 037 (flag arguments)**: nenhum attribute booleano no contrato. `layout` é enum de
duas opções, não uma flag — a distinção importa porque uma terceira opção de layout não
exigiria reescrever um `if`, só adicionar um valor e um seletor CSS (OCP, rule 011).

**Confirmado (2026-08-27)**: `layout` não tem `get`/`set` explícito em `render.ts`, e
nenhum mixin da cadeia (`Template`, `Hidden`, `Identity`, `Echo`) reflete um attribute
genérico — cada um cobre exatamente um attribute nomeado (`template`, `hidden`, `alt`,
`on`). `layout` só é lido via CSS, em `style.js:6,15` (`:host([layout="grid"])`). Era
imprecisão do `types.d.ts`, que declarava `layout` como propriedade JS legível/gravável; o
membro foi removido de `types.d.ts` e o attribute passou a ser documentado no JSDoc de
classe como puramente de estilo, sem propriedade JS correspondente — não foi adicionado
getter/setter novo, por não haver consumidor JS real (rule 023/064).

### Events

Nenhum despachado diretamente por `render.ts`. Como o host é `Echo`, qualquer evento
despachado seria ecoado — mas `render()`/`clear()` não chamam `dispatchEvent`.

### Slots e Parts

Não há `<slot>` explícito em `component.js` (`html\`${render.textContent}\``) — o conteúdo
projetado é a string já interpolada, atribuída via template literal, não via
`<slot></slot>` nativo. O `<template>` original (fonte da interpolação), quando filho direto,
fica no light DOM e não é ele mesmo exibido — é lido (`innerHTML`/`outerHTML`) e descartado
como fonte, não projetado.

### Symbols publicados

Nenhum declarado em `render.ts`/`interfaces` próprios — o pacote não tem `interfaces.js`
(confirmado: `ls src/behavior/render/` retorna `component.js`, `index.js`, `render.test.js`,
`render.ts`, `style.js`, `types.d.ts`, sem `interfaces.js`). Os Symbols usados (`paint`,
`role`) vêm de `@dom` e `@mixin`, importados, não declarados aqui.

---

## 3. Composição

**Cadeia**: `Identity(Echo(Hidden(Template(HTMLElement))))`

| Mixin | Traz | Avaliação |
|---|---|---|
| `Template` | Base de `attachShadow`/pintura via `@paint`, e a propriedade `template` resolvida (id externo ou filho) | **Necessário.** É o mecanismo central do pacote — sem ele não há como resolver `super.template` em `render()` |
| `Hidden` | Estado `:state(hidden)` via `internals.states`, refletido em CSS (`style.js:20-22`) | **Plausível** — permite ocultar o elemento programaticamente (ex.: escondido até o primeiro `render()`), mas nenhum teste exercita esse caminho hoje |
| `Echo` | Attribute `on`, `[connectArc]`/`[disconnectArc]`, eco de `dispatchEvent` | **Necessário.** É o mecanismo pelo qual `render`/`clear` são acionados declarativamente por outro elemento — o uso pretendido, documentado no exemplo de `types.d.ts` |
| `Identity` | Fornece a base para `get [role]()` e nome acessível | **Necessário, mas com papel deliberadamente neutro** (`'none'`) — ver abaixo |

Ordem: `Identity` por fora, `Echo` no meio, `Hidden(Template(...))` por dentro. Mesma
posição relativa de `Echo` (mais próximo de `HTMLElement`) usada em `kb-redirect`.

### `role: 'none'` — presença de `Identity` sem papel semântico

Diferente de `kb-on`/`kb-headers`/`kb-redirect`, que omitem `Identity` inteiramente por serem
headless, `kb-render` **entra** com `Identity` e declara `role: 'none'` explicitamente. A
razão, no próprio comentário do código (`render.ts:19-20`) e provada por
`render.test.js` ("stays out of the accessibility tree"): o elemento tem shadow DOM real e
ocupa espaço, então precisa de uma decisão de papel — a decisão é "nenhum", porque o
conteúdo interpolado é quem carrega semântica, não o container. Isso é distinto de
simplesmente não ter `Identity`: `role: 'none'` é uma afirmação ativa de neutralidade
semântica, testável e testada, não uma omissão por falta de necessidade.

### Uso de `Hidden` sem teste que o exercite

`Hidden` está na cadeia e `style.js` implementa o seletor `:host(:state(hidden))`, mas
nenhum teste em `render.test.js` chama o que quer que ative esse estado. Não é
necessariamente um problema — o mixin pode ser trazido por convenção de composição do
repositório para elementos com shadow DOM — mas fica registrado como lacuna de cobertura, não
como comportamento confirmado por prova.

---

## 4. Gestão de Estado

| Dado | Onde mora | Controlado? | Regra de sincronização |
|---|---|---|---|
| `#textContent` | Campo privado | Controlado — só `render()`/`clear()` escrevem | Default `''` via `??=`. Mudado por `render()` (concatenação de interpolações) ou `clear()` (reset) |
| `#internals` | Campo privado, `attachInternals()` lazy | Controlado | Criado sob demanda no primeiro acesso a `internals` |
| Template resolvido | Cacheado por `Template` (mixin, fora deste arquivo) | — | Resolvido uma vez: por `template` (id) ou por `<template>` filho |
| Shadow DOM | Gerido por `@paint` sobre `component`/`style` | — | Repintado a cada `@repaint` (toda chamada de `render()`/`clear()`) |

**Estado derivado**: o shadow DOM inteiro é derivado de `#textContent`. **Confirmado
(2026-08-27)**: `render.ts:15-17` declara `get textContent()` na classe `Render`, que
sombreia o accessor nativo `Node.prototype.textContent` — `component.js:4`
(`html\`${render.textContent}\``) lê portanto o campo privado `#textContent`, não o light
DOM. Não há bug: o componente projeta o resultado interpolado, como pretendido. Achado
adjacente registrado, fora do escopo das cinco pendências originais: o getter não tem
setter correspondente, então `element.textContent = 'x'` (ou um arco `.../…:setter/
textContent` via `Echo`) lançaria `TypeError` em strict mode — comportamento não coberto
por teste, não corrigido aqui, candidato a uma rodada própria. **Estado compartilhado**:
nenhum além do próprio host — `#textContent` não é passado por referência a lugar nenhum.

---

## 5. Edge Cases

| # | Caso | Comportamento requerido |
|---|---|---|
| 1 | `render(data)` chamado antes do shadow DOM existir | `render.test.js` sempre aguarda `vi.waitFor(() => expect(render.shadowRoot).toBeTruthy())` antes de chamar `render()` — sugere que a ordem importa na prática, embora `render()` em si só escreva `#textContent` e dispare `@repaint`, sem depender diretamente do shadow root já existir no momento da chamada |
| 2 | `data` é um array vazio (`[]`) | `[].concat([])` resulta em `[]`, `.map().join('')` resulta em `''` — `textContent` fica vazio, equivalente a `clear()` |
| 3 | `data` é `null`/`undefined` | `[].concat(null)` produz `[null]` — uma entrada seria interpolada contra `null`, comportamento delegado a `interpolate()`, não tratado por guarda neste pacote |
| 4 | Nem `template` nem `<template>` filho presentes | Comportamento delegado ao mixin `Template` — não investigado neste documento, que cobre `render.ts` isoladamente |
| 5 | `layout="grid"` sem a custom property `--render-grid-columns` definida | `style.js:17` usa `var(--render-grid-columns, 2)` — cai no default de 2 colunas |
| 6 | Múltiplas chamadas consecutivas de `render()` | Cada chamada substitui `#textContent` inteiro — não acumula, não faz diff. `render.test.js` ("clear() empties the output without losing the template") prova a sequência `render → clear → render` mantendo o template resolvido entre chamadas |
| 7 | Leitor de tela | Não anuncia o container (`role: 'none'`), mas anuncia o conteúdo interpolado dentro dele — coberto por `render.test.js`, teste "stays out of the accessibility tree" |

### Teste — cobre o contrato próprio, não a via de arco `on`

`render.test.js` tem uma nota explícita (linhas 4-7) justificando por que os testes chamam
`render()`/`clear()` diretamente em vez de via evento real: o Storybook anterior disparava
requisição real contra API pública de terceiro, o que tornava o teste dependente da
disponibilidade dela; a wiring via arco `on` já está coberta por `on.test.js`
(`src/behavior/on/on.test.js`), que usa `<kb-render>` como host de destino. A separação é
deliberada: `render.test.js` prova o contrato do elemento (interpolação, `clear()`,
ausência de papel), `on.test.js` prova a via declarativa de acioná-lo.

---

## Divisão de trabalho entre ofícios

| Área | Ofício responsável | Status |
|---|---|---|
| Contrato público, cadeia de mixins (Identity + Echo + Hidden + Template), `role: 'none'` | `architect` | Concluído |
| Teste do pacote — interpolação simples, array, `clear()`, ausência de papel | `tester` | Concluído — `render.test.js` |
| Teste da via declarativa (arco `on` acionando `render`) | `tester` | Concluído — coberto por `on.test.js`, não duplicado aqui, com nota explícita no próprio arquivo |
| Confirmar se `layout` tem `get`/`set` explícito em algum mixin, ou se `types.d.ts` documenta superfície que só existe via CSS | `architect` + `writer` | Concluído (2026-08-27) — confirmado que não há; `types.d.ts` corrigido |
| Confirmar a origem exata de `render.textContent` lido por `component.js` (nativo vs. sobrescrita) | `architect` | Concluído (2026-08-27) — sombreia o nativo; sem bug; achado adjacente do setter ausente registrado acima |
| Cobertura de `Hidden`/`:state(hidden)` — mixin presente, sem teste que o exercite | `tester` | Concluído (2026-08-27) — `render.test.js:56-63` |
| Comportamento de `interpolate()` sobre `data` `null`/`undefined` (Edge case 3) | fora do escopo deste pacote | **Não investigado** |
| Setter ausente para `textContent` — `element.textContent = 'x'` lançaria `TypeError` em strict mode | `architect` | **Não investigado** — achado adjacente à pendência 5, fora do escopo original |

---

**Criado em**: 2026-08-27
**Atualizado em**: 2026-08-27
**Versão**: 1.0
