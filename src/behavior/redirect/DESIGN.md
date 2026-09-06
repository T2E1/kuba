# DESIGN — `kb-redirect`

**Pacote**: `src/behavior/redirect/`
**Tag**: `<kb-redirect>`
**Status**: documentação retroativa — a implementação precede este documento
**Data**: 2026-08-27

---

Este documento segue o framework LLD (5 passos) e descreve `kb-redirect` como ele existe
hoje. O pacote foi escrito antes de qualquer processo formal de design neste repositório e
nunca teve especificação própria. O objetivo é registrar a forma já implementada, sem
redesenhá-la, e apontar com evidência onde ela está descoberta ou incoerente com o resto do
repositório.

A partir desta versão vale a mesma regra dos outros: quando implementação e documento
divergirem, é a implementação que está errada. Mudança de comportamento passa primeiro por
uma revisão deste documento, depois pelo código.

## Visão Geral

`kb-redirect` é um **elemento de comando headless**: nunca renderiza, existe só para expor
um método, `go()`, que navega via `history.pushState` sem recarregar a página. Diferente de
`kb-on` e `kb-headers`, ele não é um child que muta o pai — ele **é** o alvo de um arco, e a
mutação (a navegação) é o próprio efeito que ele produz sobre `window.location`.

O elemento resolve o par de casos de uso do roteamento client-side: navegar para uma URL
literal, com placeholders interpolados a partir do payload de um evento (`href="/user/{id}"`
mais `go({ id: 42 })`), ou navegar para uma rota nomeada, resolvida pelo `@router`
(`route="user-profile"`). `redirect.test.js` prova os dois: um `href="/profile"` fixo e um
`href="/user/{}"` interpolado com o próprio payload do evento (`{}` referencia o valor
inteiro, não uma propriedade dele).

A escolha estruturante do pacote é que ele **é** `Echo`, não um filho que fala com um `Echo`.
`kb-redirect` entra na cadeia como `Echo(HTMLElement)` porque seu único modo de uso real é
como alvo de um arco vindo de outro elemento (`on="#to-profile/clicked:method/go"`) — sem
`Echo`, `go()` só seria alcançável por chamada JS direta, o que anularia o propósito
declarativo do elemento. Isso o coloca na mesma família de `kb-render`, não na de `kb-on`/
`kb-headers`.

---

## 1. Requisitos

| Pergunta (LLD passo 1) | Resposta |
|---|---|
| Quem consome, em que contexto | O autor de markup que precisa navegar (SPA, sem reload) em resposta a um evento de outro elemento — tipicamente um `<kb-button>` clicado |
| Somente leitura ou interativo | Comando: não lê nada do usuário, executa uma ação (navegação) quando acionado |
| Caso de uso mínimo (MVP) | `href` fixo, arco `on` chamando `go()` sem parâmetros |
| Participa de `<form>` | Não |
| Papel e nome acessível | Nenhum — ver seção 3 |
| Superfície de variação | `href`, `route`, `on` (herdado de `Echo`) |
| Sub-elemento interno | Nenhum. Sem `attachShadow`, sem template, sem estilo próprio |

**Requisitos funcionais**

1. Expõe `href` e `route` como propriedades string, sincronizadas a partir dos attributes
   homônimos via `@attributeChanged`, com defaults `'#'` e `''` respectivamente.
2. `go(params = {})`: se `route` estiver preenchido, navega para `urlFor(this.route,
   params)`; senão, navega para `interpolate(this.href, params)`. `route` tem precedência
   sobre `href` — não há como usar os dois ao mesmo tempo para o mesmo alvo.
3. Navegação é feita via `history.pushState({}, '', url)`, sem `location.assign` e sem
   recarregar a página.
4. `go()` retorna `this`, para encadeamento (rule 038 — é Comando, mas devolve a entidade,
   não um `boolean`).
5. Nunca renderiza: `Headless` aplica `display: none` inline no host, ao conectar.

**Não-requisitos (YAGNI, rule 023)**

- Disparar evento próprio após navegar (`navigated`, por exemplo). `go()` não chama
  `dispatchEvent` — busca em `redirect.ts` confirma zero ocorrências. Um consumidor que
  precise reagir à navegação depende de `popstate`/roteador, não deste elemento.
- Validar que `route` existe no `@router` antes de chamar `urlFor`. Se a rota não existe, o
  comportamento é o que `urlFor` decidir — não tratado neste pacote.
- Suportar `location.assign`/reload como alternativa a `pushState`. O pacote é
  deliberadamente SPA-only; um link comum (`<a href>`) já cobre o caso de navegação com
  reload.
- Papel ARIA, `alt`, `Identity`. Comando invisível, sem conteúdo — nada para anunciar.

---

## 2. Contrato Público

### Attributes / Properties

| Nome | Tipo | Default | Reflete | Especificação |
|---|---|---|---|---|
| `href` | `string` | `'#'` | não | URL/caminho alvo quando `route` não está preenchido. Aceita placeholders `{path.to.value}`, interpolados por `interpolate()` contra `params` de `go()`. `types.d.ts` restringe o formato de string literal a `http(s)://`, `/...`, `#...` ou `?...` — um segmento relativo puro (`profile`) é rejeitado em tempo de compilação, para não ser confundido com nome de `route` |
| `route` | `string` | `''` | não | Nome de rota registrada no `@router`, resolvida via `urlFor(route, params)`. Tem precedência sobre `href` quando não vazia |
| `on` | string (arco) | — | não | Herdado de `Echo`. Arco no formato `source/event:type/sink`, tipicamente `.../clicked:method/go` |

**Rule 037 (flag arguments)**: nenhum attribute booleano no contrato. A escolha entre `href`
e `route` não é uma flag — é a presença/ausência de `route`, uma decisão de dado, não de
comportamento passado por parâmetro.

**Rule 033 (máximo de parâmetros)**: `go(params = {})` tem um único parâmetro, um objeto —
está dentro do limite, e evita a alternativa de expor `go(key, value)` ad-hoc.

### Events

Nenhum despachado diretamente por `redirect.ts`. Como o host é `Echo`, qualquer evento que
viesse a ser despachado seria ecoado no barramento — mas isso não acontece hoje, porque
`go()` não despacha nada.

### Slots e Parts

Nenhum dos dois, e nenhum shadow root. Conteúdo colocado entre as tags fica no light DOM de
um elemento com `display: none`, invisível e inerte.

### Symbols publicados

Nenhum. Diferente de `kb-on`/`kb-headers`, este pacote não declara nenhum `Symbol.for` nem
`Symbol()` — não há contrato pai/filho a resolver, porque `kb-redirect` não muta um pai, ele
mesmo é o alvo do arco (via os Symbols que `Echo` já declara em `packages/echo/interfaces.js`,
não redeclarados aqui).

---

## 3. Composição

**Cadeia**: `Headless(Echo(HTMLElement))`

| Mixin | Traz | Avaliação |
|---|---|---|
| `Echo` | Attribute observado `on`, `[connectArc]`/`[disconnectArc]`, eco de `dispatchEvent` no barramento | **Necessário.** É o mecanismo pelo qual um clique em outro elemento chama `go()` declarativamente — o caso de uso central do pacote, provado nos dois testes de `redirect.test.js` |
| `Headless` | Hook `@connected [hideable]()` que aplica `display: none` inline no host | **Necessário e suficiente.** O elemento não tem representação visual própria |

A ordem da composição — `Headless(Echo(HTMLElement))`, `Echo` por dentro — é a mesma usada em
`kb-render` (`Identity(Echo(Hidden(Template(HTMLElement))))`, também com `Echo` mais próximo
de `HTMLElement`). Ambos os pacotes de `src/behavior/` que **são** `Echo` (em vez de terem um
filho `<kb-on>` que fala com um `Echo`) seguem essa ordem — consistente.

### `role`/`Identity`: ausência correta

Mesma razão dos demais pacotes headless do repositório: `display: none` tira o elemento da
árvore de acessibilidade, e não há conteúdo a nomear. `kb-redirect` não entra com `Identity`,
e é o correto — nenhum leitor de tela precisa saber que um comando de navegação invisível
existe no DOM.

### Por que `go()` não é um Comando puro no sentido estrito da rule 038

`go()` muta estado global (`history`, e por consequência `location`) e retorna `this`. A rule
038 permite retorno de entidade em Comandos — `this` está dentro do espírito da regra, não é
um `boolean` de sucesso. A mutação em si é sobre `window.history`, não sobre um objeto
recebido por referência (rule 052/070): é o efeito pretendido do elemento, análogo a `save()`
persistir em um repositório.

---

## 4. Gestão de Estado

| Dado | Onde mora | Controlado? | Regra de sincronização |
|---|---|---|---|
| `href` | `#href` privado + attribute `href` | Controlado — DOM é a fonte da verdade | `@attributeChanged('href')` grava no campo. Não reflete de volta |
| `route` | `#route` privado + attribute `route` | Idem | Idem |
| URL efetivamente navegada | `window.history`/`window.location` | Global do navegador | Escrita a cada chamada de `go()`, não cacheada |

**Estado derivado**: nenhum. **Estado compartilhado**: `history`/`location` são globais do
navegador, mutados por `pushState` a cada chamada de `go()` — é o desenho pretendido de um
elemento de navegação, não uma violação da rule 070 (o compartilhamento é o próprio propósito
do elemento, documentado, não acidental).

O elemento em si não tem estado observável derivado de `href`/`route` além do que `go()`
consome no momento da chamada. Não há `internals`, não há `@repaint`/`@retouch`, não há
template.

---

## 5. Edge Cases

| # | Caso | Comportamento requerido |
|---|---|---|
| 1 | `route` e `href` preenchidos ao mesmo tempo | `route` vence — `this.route ? urlFor(...) : interpolate(this.href, ...)`. `href` fica sem efeito, silenciosamente. Não há aviso |
| 2 | Nem `route` nem `href` preenchidos | `route` é `''` (falsy) → cai no ramo `href`, que é `'#'` por default → navega para `interpolate('#', params)`, ou seja, para o fragmento vazio da URL atual |
| 3 | `href` com placeholder sem a chave correspondente em `params` | Comportamento delegado a `interpolate()` — não investigado neste pacote |
| 4 | `route` referenciando uma rota inexistente no `@router` | Comportamento delegado a `urlFor()` — não investigado neste pacote |
| 5 | `go()` chamado sem estar conectado ao DOM | Funciona igual: `go()` não depende de `connectedCallback`, só de `href`/`route`, que têm defaults válidos |
| 6 | `go()` chamado diretamente por JS, sem arco `on` | Funciona — o elemento não exige `Echo` para operar, `Echo` só é o que permite acioná-lo declarativamente. Um teste que chamasse `element.go({...})` direto provaria o mesmo caminho de código que os testes via clique provam hoje, sem cobertura adicional real |
| 7 | Múltiplos `<kb-redirect>` navegando em sequência rápida | Cada `pushState` empilha uma entrada de histórico — comportamento nativo do navegador, sem coordenação nem debouncing no pacote |
| 8 | Testes que chamam `go()` e não restauram a URL | `redirect.test.js` já cobre isso com `afterEach(() => history.pushState({}, '', initial))`, comentado como necessário porque `pushState` "outlives the test" |

### Teste — cobertura do caminho central, sem cobertura do `go()` direto

`redirect.test.js` tem dois testes, ambos passando pelo arco `on` (clique → `go()`). O
caminho de chamada direta de `go()` (Edge case 6) não tem teste próprio, mas exercita a mesma
função — a diferença é só a origem da chamada (arco vs. JS), não o comportamento de `go()`
em si. Não é lacuna real: o `on` é o modo de uso pretendido e documentado no exemplo do
`types.d.ts`.

---

## Divisão de trabalho entre ofícios

| Área | Ofício responsável | Status |
|---|---|---|
| Contrato público, cadeia de mixins (Echo + Headless), forma de `go()` | `architect` | Concluído |
| Confirmação de que `Identity`/`role` não se aplica | `architect` | Concluído — ausência correta |
| Teste do pacote — cobre o caminho central via arco `on`, nos dois modos (`href` fixo e interpolado) | `tester` | Concluído — `redirect.test.js` |
| Comportamento de `interpolate()`/`urlFor()` sobre entrada malformada (Edge cases 3 e 4) | fora do escopo deste pacote | **Não investigado** — pertence a `@interpolate`/`@router`, se vierem a ter `DESIGN.md` próprio |
| Precedência silenciosa de `route` sobre `href` quando os dois estão preenchidos | `writer` | Concluído (2026-08-27) — JSDoc de `route`/`href` em `types.d.ts` agora afirma a precedência explicitamente |

---

**Criado em**: 2026-08-27
**Atualizado em**: 2026-08-27
**Versão**: 1.0
