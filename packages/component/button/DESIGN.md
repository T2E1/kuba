# DESIGN — `kb-button`

**Pacote**: `packages/component/button/`
**Tag**: `<kb-button>`
**Status**: especificação — documento fundacional, anterior à implementação
**Data**: 2026-08-11

---

Este documento segue o framework LLD (5 passos) e estipula o comportamento de
`kb-button` antes de qualquer código. Ele é a fonte da verdade: quando a implementação
divergir dele, é a implementação que está errada, não o inverso. Mudança de comportamento
passa primeiro por uma revisão deste documento, depois pelo código — nunca o contrário.

## Visão Geral

`kb-button` é um botão form-associated que renderiza um `<button>` nativo no próprio
shadow root e trata o host como um invólucro sem papel na árvore de acessibilidade. Ele
existe para dar ao design system um ponto único de estilo (tokens `--button-*`), um único
evento de saída (`clicked`) e a integração com `<form>` que um `<div role="button">` não
tem de graça.

O que ele **não** é: um controle de valor. Ele não escreve em `FormData`, não valida, não
governa foco além do que `delegatesFocus` já entrega. Todo comportamento de teclado vem do
`<button>` nativo interno — decisão deliberada, e é o que mantém o pacote pequeno.

---

## 1. Requisitos

| Pergunta (LLD passo 1) | Resposta |
|---|---|
| Quem consome, em que contexto | Páginas e formulários; ação primária/secundária, ícone isolado, link textual |
| Somente leitura ou interativo | Interativo — é o elemento de ação por definição |
| Caso de uso mínimo (MVP) | Renderizar um botão nativo estilizado que dispara `clicked` com `value` |
| Participa de `<form>` | Sim — `static formAssociated = true`; `type="submit"` pede `internals.form.requestSubmit()`, `type="reset"` pede `.reset()`, `type="button"` não interage com o form |
| Estado de `disabled` | Obrigatório — attribute, `:state(disabled)` e `formDisabledCallback` (para herdar de `<fieldset disabled>`) |
| Estado de `loading` | Fora do MVP — é `disabled` mais um indicador visual, sem caso de uso concreto (rule 023) |
| Superfície de variação | `variant`, `color`, `width`, `type` |
| Botão como *submitter* nomeado (`name`/`value` na submissão) | Não é escopo deste componente. `value` é o payload do evento `clicked`, não um valor de submissão — formulários com múltiplas ações se distinguem pelo `clicked`, não por `FormData`. Se um consumidor precisar de `name`/`value` na submissão, é um componente diferente. |

**Requisitos funcionais**

1. Renderiza um `<button>` nativo, recebendo conteúdo por slot default.
2. Ao ser clicado, para o clique interno e emite um único `clicked` com `detail = value`.
3. Com `type="submit"`, pede submissão do formulário dono; com `type="reset"`, reseta; com
   `type="button"`, só emite `clicked`.
4. Expõe a variação visual ao CSS como custom state, nunca como classe ou attribute.
5. Aceita `alt` como nome acessível escrito no controle interno, não no host.
6. Pode ser ligado a outro elemento por arco (`on`), sem listener escrito na página.
7. Quando `disabled`, não foca, não clica, não submete e não emite `clicked`.

**Não-requisitos (YAGNI, rule 023)**

- Menu suspenso, split button, grupo de botões — são outros componentes.
- Ícone embutido: entra por slot, é responsabilidade de `kb-icon`.
- Tooltip: não é do botão.

---

## 2. Contrato Público

### Attributes / Properties

| Nome | Tipo | Default | Reflete | Especificação |
|---|---|---|---|---|
| `alt` | `string` | `''` | sim | Escreve `aria-label` no `<button>` interno; só quando truthy |
| `color` | `KUBAButtonColorAttribute` | `'primary'` | sim | União fechada — o conjunto de tokens é finito (`packages/pixel/tokens/color.css`). CSS com fallback (`var(--color-${color}, var(--color-primary))`) para valor inválido em runtime |
| `variant` | `KUBAButtonVariantAttribute` | `'solid'` | sim | União fechada, refletida via `:state()`; extensão de aparência passa pelas custom properties `--button-*`, nunca por afrouxar o tipo |
| `width` | `KUBAButtonWidthAttribute \| \`${number}px\`` | `'auto'` | sim | União paramétrica — `(string & {})` se justifica aqui porque cobre o espaço real de valores |
| `type` | `'submit' \| 'reset' \| 'button'` | `'submit'` | sim | `'button'` existe para declarar ação pura sem submeter — sem ele, todo `kb-button` num `<form>` tenta submeter por default, reproduzindo a armadilha mais comum do `<button>` nativo |
| `value` | `string` | `''` | sim | Payload do evento `clicked`; nunca chega ao `FormData` (ver Requisitos) |
| `disabled` | `boolean` | `false` | sim | Escrito no `<button>` interno (que já bloqueia foco, clique e teclado de graça), espelhado em `:state(disabled)`, e sincronizado com `@formDisabled` para herdar `<fieldset disabled>` |
| `hidden` | `boolean` | `false` | sim | Mixin `Hidden` |
| `on` | arco `source/event:type/sink` | `undefined` | sim | Mixin `Echo` |
| `internals` | `ElementInternals` (readonly) | — | não | Exposto só para os mixins que precisam de `internals.states`; não é contrato para o consumidor |

`name` não entra no contrato — é o sinal de que a submissão nomeada está fora de escopo
(ver Requisitos, item "Botão como *submitter* nomeado").

### Events

| Nome | `detail` | Bubbles/Composed |
|---|---|---|
| `clicked` | `value` do botão | sim/sim — precisa atravessar o Shadow DOM |

Nome no passado (`clicked`, não `click` nem `clicking`) — fato consumado, não comando nem
progresso (skill `event`).

### Slots

| Slot | Espera |
|---|---|
| default | Texto e/ou `kb-icon`. `::slotted(*) { pointer-events: none }` garante que o clique nasça sempre no `<button>` interno, nunca num filho do slot |

### Parts

| Part | Especificação |
|---|---|
| `button` | O `<button>` interno é exportado como `part="button"`, abrindo um ponto de escape para `:focus-visible`, `:active` e `@media (forced-colors)` que as custom properties não cobrem |

### Custom properties de CSS (pontos de extensão)

`--button-color-accent`, `--button-color-text`, `--button-color-background-ghost`,
`--button-border-width`, `--button-border-radius`, `--button-font-family`,
`--button-font-size`, `--button-font-weight`, `--button-letter-spacing`,
`--button-line-height`, `--button-space-gap`, `--button-space-inline`,
`--button-size-height`, `--button-size-min-width`, `--button-transition`.

Todas com fallback para token global.

**Rule 037 (flag arguments)**: nenhum attribute booleano *de comportamento* no contrato.
`hidden` e `disabled` são estados da plataforma, não flags de ramificação — não violam a
rule.

---

## 3. Composição

**Cadeia**: `Echo(Disabled(Hidden(Value(Width(HTMLElement)))))`

| Mixin | Traz | Por que entra na cadeia |
|---|---|---|
| `Echo` | Sistema de eventos: `on`, arco declarativo | O botão se conecta a outros elementos sem listener escrito na página |
| `Disabled` | `disabled` + `:state(disabled)` + `@formDisabled` | Requisito funcional — ver Achado de Requisitos |
| `Hidden` | `hidden` + `:state(hidden)` | Visibilidade é estado de plataforma, não CSS solto |
| `Value` | `value` ↔ attribute `value` | É o payload do `clicked` |
| `Width` | `width` normalizado + re-render de estilo | Faz parte da superfície de variação |

**Sobre não usar `Identity`**: `Identity` publica papel e nome via `internals` no **host**.
Aqui o host é invólucro; quem a árvore de acessibilidade lê é o `<button>` do shadow root.
Herdar `Identity` seria herança recusada (rule 059) e nomearia um elemento que ninguém
foca. `alt` é implementado localmente em vez de vir do mixin porque o corpo do setter é
diferente: `Identity` escreveria `internals.ariaLabel`; aqui o setter dispara `@repaint`
para o template reescrever o atributo `aria-label` no `<button>` interno.

**Sub-elemento**: nenhum. O `<button>` vive no shadow root, sem segunda tag pública —
hierarquia rasa, sem overengineering (rule 064).

**`attachInternals()`**: uma única chamada no elemento, compartilhada pelos mixins que
precisam de `internals.states`.

---

## 4. Gestão de Estado

| Dado | Onde mora | Controlado? | Regra de sincronização |
|---|---|---|---|
| `alt` | campo privado + attribute | Controlado — DOM é a fonte da verdade | `@repaint` re-renderiza o markup, escrevendo `aria-label` no `<button>` interno |
| `color` | campo privado + attribute | Controlado | `@retouch` — só o estilo re-renderiza |
| `variant` | campo privado + attribute + `internals.states` | Controlado | Um método de contrato troca o estado ativo antes da atribuição, garantindo um único `:state()` por vez |
| `width` | campo privado (mixin) + attribute | Controlado | Normalizado por filtro dedicado |
| `disabled` | campo privado (mixin) + attribute + `:state(disabled)` | Controlado | Sincronizado com `@formDisabled` para herdar `<fieldset disabled>` |
| `hidden` | campo privado (mixin) + `:state(hidden)` | Controlado | |
| `value` | campo privado (mixin) + attribute | Controlado | Default `''`, nunca `undefined` |
| `type` | campo privado + attribute | Controlado | Não dispara `@repaint`/`@retouch` — não afeta markup nem estilo |
| foco | `delegatesFocus: true` | Delegado à plataforma | Nenhum estado próprio |

**Estado derivado**: nenhum. Todo dado do componente é espelho direto de um attribute —
é o desenho a manter.

**Regra sobre `variant`**: o estado `:state(solid)` só existe depois que `variant` é
escrito explicitamente — `solid` é o default sem regra CSS própria, então um botão que
nunca recebe `variant` não precisa de nenhum estado ativo. A assimetria é intencional e
deve ser coberta por teste.

---

## 5. Edge Cases

| # | Caso | Comportamento requerido |
|---|---|---|
| 1 | `value` ausente | `clicked.detail` é `''` (default do mixin `Value`, não `undefined`) |
| 2 | Sem conteúdo no slot e sem `alt` | Botão sem nome acessível — aceito, é responsabilidade do consumidor preencher um dos dois |
| 3 | `variant="icon"` sem `alt` | Botão sem nome acessível. Fora do contrato de comportamento: nenhum aviso em runtime — a validação de uso correto é responsabilidade de lint/review, não de código de produção (rule 023, rule 064) |
| 4 | `alt` presente com texto visível no slot | `aria-label` sobrescreve o nome acessível derivado do texto |
| 5 | `alt` muda após mount | `aria-label` acompanha a mudança |
| 6 | Teclado `Enter` / `Espaço` | `<button>` nativo dispara `click`; o componente intercepta e re-emite `clicked` uma única vez |
| 7 | `Tab` até o componente | `delegatesFocus` leva o foco ao `<button>` interno |
| 8 | Anel de foco visível | Precisa de `:focus-visible` definido — decisão do agent `designer`, ainda pendente de token |
| 9 | `type="submit"` fora de `<form>` | `internals.form` é `null`; interação com o form é ignorada (`?.`); `clicked` ainda é emitido |
| 10 | `type="reset"` em form | Reseta os campos do form |
| 11 | Formulário inválido no submit | `requestSubmit()` dispara a validação nativa e bloqueia a submissão |
| 12 | Botão `disabled` | Não foca, não clica, não submete, não emite `clicked` |
| 13 | `<fieldset disabled>` envolvendo o botão | Herda o estado desabilitado via `@formDisabled` |
| 14 | Estado `loading` | Fora do MVP — ver Requisitos |
| 15 | Múltiplos cliques rápidos | Um `clicked` por clique; nenhuma proteção contra duplo submit é responsabilidade deste componente |
| 16 | `color` com valor desconhecido em runtime | CSS cai no fallback (`var(--color-${color}, var(--color-primary))`) em vez de ficar com a cor do UA |
| 17 | Leitor de tela ao mudar `value` | Nada é anunciado — `value` é payload, não conteúdo |
| 18 | Alto contraste / `forced-colors` | Precisa de tratamento — decisão do agent `designer`, ainda pendente |

---

## Divisão de trabalho entre ofícios

| Área | Ofício responsável |
|---|---|
| Contrato público, cadeia de mixins, Symbols | `architect` |
| Tokens, `:hover`/`:active`/`:focus-visible`, `forced-colors` (edge cases 8 e 18) | `designer` |
| Implementação de attributes, events, mixins | `developer` |
| Prova de cada requisito e edge case desta especificação | `tester` |
| Página de `docs/components/button.md` | `writer` |

---

**Criado em**: 2026-08-11
**Atualizado em**: 2026-08-20
**Versão**: 2.0
