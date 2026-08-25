# DESIGN — `kb-logo`

**Pacote**: `src/component/logo/`
**Tag**: `<kb-logo>`
**Status**: especificação — registrada após a implementação, como referência do contrato
**Data**: 2026-08-24
**Nota**: seção 2 (Requisito 2, tabela de Custom properties) revisada em 2026-08-24 quando o
`viewBox` do `<path>` mudou de 363×363 (quadrado) para 60×93 (retrato) — `--logo-size` deixou
de significar "lado de um quadrado" e passou a significar altura, com a largura derivada.
`types.d.ts` corrigido em 2026-08-25: publicava `internals` como propriedade do contrato,
divergindo do padrão de `button`/`icon`/`cover` (que têm o mesmo getter na classe, mas não o
publicam em `types.d.ts` — é uso interno dos mixins, não contrato do consumidor).

---

Este documento segue o framework LLD (5 passos) e registra o comportamento de `kb-logo`
tal como implementado. Ele é a fonte da verdade: quando a implementação divergir dele, é a
implementação que está errada, não o inverso. Mudança de comportamento passa primeiro por
uma revisão deste documento, depois pelo código — nunca o contrário.

## Visão Geral

`kb-logo` é a marca da `kuba` como `<svg>` inline no shadow root, um único `<path
fill="currentColor">` que herda a cor do host. Ele existe para dar ao design system um
ponto único da marca — um arquivo, um `viewBox`, uma cor — em vez de cada consumidor colar
o SVG à mão e divergir na primeira atualização de marca.

O que ele **não** é: um link, nem um ícone genérico. Não renderiza `<a>`, não aceita
`href`, não navega. Para um ícone qualquer do catálogo Material Symbols, `kb-icon` resolve
por nome; este componente renderiza um único traçado fixo.

---

## 1. Requisitos

| Pergunta (LLD passo 1) | Resposta |
|---|---|
| Quem consome, em que contexto | `kb-header` (região `leading`), telas de entrada (splash, sign-in), `kb-footer` junto da linha de copyright |
| Somente leitura ou interativo | Somente leitura — nenhum estado, nenhum evento, nenhum foco próprio |
| Caso de uso mínimo (MVP) | Renderizar a marca em `currentColor`, escalável por um único token de tamanho |
| Nome acessível | Opcional via `alt`; sem ele, a marca se esconde da árvore de acessibilidade |
| Superfície de variação | Nenhuma — cor e tamanho vêm de custom properties de CSS, não de attributes |
| Comportamento de link | Fora de escopo — o consumidor envolve o elemento num `<a>` quando a marca precisa navegar |

**Requisitos funcionais**

1. Renderiza um `<svg>` inline com um único `<path>` preenchido em `currentColor`.
2. Mantém a proporção retrato intrínseca do traçado (60:93, o `viewBox` de
   `component.js`) em qualquer tamanho — `--logo-size` governa a altura; a largura é
   derivada dela, não um segundo eixo independente.
3. Aceita `alt` como nome acessível publicado via `internals.ariaLabel`.
4. Sem `alt`, esconde-se da árvore de acessibilidade (`aria-hidden="true"`).
5. Expõe papel `img` no host quando nomeado.

**Não-requisitos (YAGNI, rule 023)**

- Variantes de marca (monocromática, colorida, invertida) — um único traçado cobre o caso
  de uso até que um segundo apareça.
- Comportamento de link ou navegação — é responsabilidade de quem envolve o elemento.
- Wordmark ou lockup com texto — composição com `kb-text` fica a cargo do consumidor.

---

## 2. Contrato Público

### Attributes / Properties

| Nome | Tipo | Default | Reflete | Especificação |
|---|---|---|---|---|
| `alt` | `string` | `''` | sim | Escreve `internals.ariaLabel` no host; controla também se a marca fica visível à árvore de acessibilidade |
| `internals` | `ElementInternals` (readonly) | — | não | Exposto só para o mixin `Identity`, que precisa de `internals.ariaLabel`/`internals.role`. **Não é publicado em `types.d.ts`** — é uso interno dos mixins, não contrato do consumidor (decisão do `architect`, 2026-08-25, aplicada aos oito pacotes) |

Nenhum attribute de aparência (`color`, `size`) — a superfície de variação inteira vive em
CSS (ver Custom properties), porque cor e tamanho são decisão de estilo, não de
comportamento.

### Events

Nenhum. O componente não interage, não muda de estado por ação do usuário.

### Slots

Nenhum. O shadow root declara um `<svg>` fixo; o elemento não aceita filhos de light DOM.

### Custom properties de CSS (pontos de extensão)

| Custom property | Default | Controla |
|---|---|---|
| `--logo-color` | `var(--color-primary)` | Cor de preenchimento — o `<path>` herda `currentColor` do host |
| `--logo-size` | `40px` | Altura da marca; a largura é derivada por `calc(var(--logo-size, 40px) * 60 / 93)`, a proporção do `viewBox` (60:93) do `<path>` em `component.js` |

**Rule 037 (flag arguments)**: nenhum attribute booleano no contrato — `alt` é `string`, não
uma flag de ramificação.

---

## 3. Composição

**Cadeia**: `Identity(HTMLElement)`

| Mixin | Traz | Por que entra na cadeia |
|---|---|---|
| `Identity` | `alt` ↔ `internals.ariaLabel`, publicação de `[role]` em `internals.role` no connect | A marca precisa de nome acessível opcional e papel `img` — exatamente o que `Identity` provê, sem reimplementar leitura/escrita de `internals` |

**Sobre não usar `Width`/`Height`**: o tamanho não é um attribute de comportamento, é
puramente visual — `--logo-size` já governa a altura em `style.js`, com a largura derivada
por `calc()` a partir da proporção do `viewBox`. Um mixin de dimensão trataria `width` e
`height` como eixos independentes, o que quebraria a garantia de proporção do requisito 2.

**Sub-elemento**: nenhum. O `<svg>` vive no shadow root, sem segunda tag pública —
hierarquia rasa, sem overengineering (rule 064).

**`attachInternals()`**: uma única chamada, lazy (`this.#internals ??= this.attachInternals()`),
compartilhada pelo mixin `Identity` e pelo próprio elemento.

**Symbol privado**: `decorative` (`interfaces.js`) é o método bracket que decide se a marca
fica visível ou oculta à árvore de acessibilidade. Roda duas vezes por caminhos diferentes:
no `@connected`, com o `alt` que já estiver no DOM; e a cada escrita em `alt` depois disso,
via `@around(decorative)` no setter (`packages/middleware/around.js` agenda a chamada num
`setImmediate` após o setter original rodar). Não é um contrato que atravessa pacotes, por
isso é `Symbol()` local, não `Symbol.for()`.

**Sobre sobrescrever o setter de `Identity`**: o override existe só para pendurar
`@around(decorative)`; ele **não** deve repetir `@attributeChanged('alt')`. O registro do
decorator não mora no descriptor do accessor — `execute.js`
(`packages/directive/attributeChanged/execute.js:19-44`) faz duas coisas no protótipo em que
o decorator é aplicado: acrescenta `'alt'` a `constructor.observedAttributes` e embrulha
`attributeChangedCallback` num `Proxy`. Ambos são herdados por `Logo` da classe que
`Identity` produz (`packages/mixin/identity/identity.ts:30`), e o proxy termina em
`context[property] = value` (`execute.js:38`) — atribuição dinâmica na instância, que a
cadeia de protótipos resolve no setter *mais derivado*, o de `Logo`. Redeclarar o accessor
não sombreia nada.

Repetir o decorator na classe derivada, portanto, não reforça registro nenhum: cria um
**segundo** `Proxy` encadeado sobre o primeiro, ambos escutando `'alt'`. Uma única mudança
do attribute no DOM passava a executar o corpo do setter de `Identity`
(`identity.ts:33`, `this.internals.ariaLabel = value`) duas vezes, e a agendar
`[decorative]` duas vezes via `@around`. Comprovado empiricamente pelo `tester` com spy em
`internals.ariaLabel`; o `Set` em `execute.js:20` deduplica `observedAttributes`, mas o
encadeamento do `attributeChangedCallback` não tem dedupe algum — repetir o decorator nunca
é no-op.

O argumento de robustez foi considerado e descartado. Ordem de avaliação de módulos não
protege nada: `Identity(HTMLElement)` é invocado no próprio `extends`, sempre antes dos
decorators de `Logo` rodarem. E "defender contra `Identity` largar seu decorator no futuro"
paga hoje um bug real por uma mudança hipotética de contrato do mixin — especulação que as
rules 023 e 064 proíbem. Se `Identity` deixar de observar `alt`, isso é quebra de contrato
do mixin, e o lugar de consertar é `Identity`.

---

## 4. Gestão de Estado

| Dado | Onde mora | Controlado? | Regra de sincronização |
|---|---|---|---|
| `alt` | campo privado (mixin `Identity`) + attribute | Controlado — DOM é a fonte da verdade | `@attributeChanged('alt')` escreve `internals.ariaLabel`; o mesmo setter dispara `[decorative]()` via `@around` |
| papel (`img`) | `internals.role`, publicado por `Identity` | Derivado | `[role]` é getter fixo (`'img'`), lido uma vez no connect |
| `ariaHidden` | `internals.ariaHidden` | Derivado de `alt` | Recalculado no `@connected` e a cada escrita subsequente em `alt`, via `[decorative]` (ver Edge Cases) |

**Estado derivado**: `ariaHidden` é o único dado que não é espelho direto de um attribute —
depende de `alt` estar ou não vazio no momento do connect.

---

## 5. Edge Cases

| # | Caso | Comportamento requerido |
|---|---|---|
| 1 | Sem `alt` | `internals.ariaHidden = 'true'` — o SVG não tem `<title>`, então uma marca sem nome seria um gráfico não rotulado |
| 2 | Com `alt` | `internals.ariaHidden = 'false'` e `internals.ariaLabel` recebe o valor |
| 3 | `alt` mudando depois do connect | `internals.ariaLabel` acompanha (via `@attributeChanged`) e `internals.ariaHidden` acompanha junto — o mesmo setter que atualiza `ariaLabel` dispara `[decorative]()` via `@around`, então trocar `alt` de vazio para preenchido (ou o inverso) depois do connect reabre a decisão |
| 4 | `--logo-size` não definido | Cai no default `40px` (`style.js`) |
| 5 | `--logo-color` não definido | Cai no default `var(--color-primary)` |
| 6 | Elemento sem `<a>` envolvendo | Nenhum comportamento de navegação — fora de escopo (ver Requisitos) |
| 7 | Leitor de tela ao mudar `--logo-size`/`--logo-color` | Nada é anunciado — são propriedades visuais, sem correspondência semântica |

---

## Divisão de trabalho entre ofícios

| Área | Ofício responsável |
|---|---|
| Contrato público, cadeia de mixins, Symbol `decorative` | `architect` |
| Traçado do `<path>`, tokens `--logo-color`/`--logo-size` | `designer` |
| Implementação de `alt`, `Identity`, `[decorative]` | `developer` |
| Prova de cada requisito e edge case desta especificação | `tester` |
| Página de `docs/components/logo.md` | `writer` |

---

**Criado em**: 2026-08-24
**Atualizado em**: 2026-08-25
**Versão**: 1.2
