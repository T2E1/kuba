---
name: event
model: sonnet
description: Eventos DOM e customizados em custom elements — decorator `on.{tipo}` com seletor e modificadores (`prevent`, `stop`, `enter`, `value`, `formData`, `detail`), `CustomEvent` com `bubbles` e `composed` para atravessar o Shadow DOM, e nomes em verbo no passado. Use ao criar handler de interação, ao despachar evento customizado, ou ao fazer dois componentes se comunicarem sem referência direta. Não use para fluxo reativo entre componentes distantes — use a skill dataflow.
---

# Event

## O que é

A forma de comunicação entre componentes neste repositório: o DOM já sabe se comunicar,
então nenhum componente guarda referência a outro. Um dispara, os interessados escutam.

Dois pontos definem a convenção: handlers são declarados por decorator (nunca por
`addEventListener` no constructor), e todo `CustomEvent` precisa de `bubbles` e `composed`
para escapar do Shadow DOM.

## Quando usar

| Situação | Ação |
|---|---|
| Reagir a clique, submit, tecla | `on.{tipo}` no método |
| Comunicar mudança para fora do componente | `CustomEvent` com `dispatchEvent` |
| Dois componentes irmãos precisam conversar | Evento que borbulha; nenhum conhece o outro |
| Fluxo reativo entre componentes distantes | Não é aqui — skill `dataflow` |

## Como aplicar

### Decorator `on`

Ordem dos elementos: **tipo → seletor (opcional) → modificadores (opcionais)**.

| Modificador | Efeito |
|---|---|
| `prevent` | `preventDefault()` — evita submit ou navegação |
| `stop` | `stopPropagation()` |
| `enter` | Filtra apenas a tecla Enter |
| `value` | Passa ao handler o `value` do target |
| `formData` | Converte `FormData` em objeto |
| `detail` | Passa o `detail` do `CustomEvent` |

Modificadores são funções puras: transformam o evento antes do handler, sem efeito
colateral próprio.

**Limite: `on` escuta o `shadowRoot`, nunca o host.** O decorator registra o listener em
`this.shadowRoot`, delegando por seletor. Isso alcança qualquer evento que nasça *dentro* da
árvore de shadow — incluindo conteúdo slotted, que atravessa o `<slot>` a caminho de fora —
mas nunca um evento cujo `target` seja o próprio host (por exemplo, um `keydown` disparado
quando o host está focado por `tabIndex`, sem nenhum filho focável no slot). `shadowRoot` não
é ancestral do host na árvore composta; só recebe o que se origina dentro dele. Um elemento
que precisa reagir a evento disparado nele mesmo — teclado num host sem sub-elemento nativo
focável, por exemplo — não tem essa opção resolvida por `on` hoje. Ver Troubleshooting.

### `CustomEvent`

| Campo | Valor | Por quê |
|---|---|---|
| `bubbles` | `true` | Sem isso o evento morre no próprio elemento |
| `composed` | `true` | Sem isso ele não atravessa a fronteira do Shadow DOM |
| `cancelable` | `true` | Permite ao consumidor cancelar |
| `detail` | Os dados | O payload |

`composed: false` é a causa nº 1 de "meu evento não chega no listener": o evento borbulha
dentro do Shadow DOM e para na fronteira.

### Nomenclatura

Minúsculas, verbo no passado, descrevendo o que **aconteceu**: `clicked`, `submitted`,
`changed`. Não `onClick` (isso é handler, não evento) nem `doSubmit` (isso é comando).

Nomes de evento usados em mais de um lugar viram constante (skill `enum`), não string
solta (rule 024).

### Onde os listeners vivem

Nunca no constructor — o elemento ainda não está no documento. Handlers declarados por
decorator resolvem isso; `addEventListener` manual vai em `connectedCallback`, com
`removeEventListener` em `disconnectedCallback`.

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Handler por decorator e `CustomEvent` que atravessa o Shadow DOM | [custom-event.valid.js](examples/custom-event.valid.js) | [custom-event.invalid.js](examples/custom-event.invalid.js) |

## Checklist

- [ ] Nenhum `addEventListener` no constructor
- [ ] Todo `CustomEvent` com `bubbles: true` e `composed: true`
- [ ] Nome do evento em minúsculas, verbo no passado
- [ ] Nome usado em mais de um lugar extraído para constante
- [ ] Todo listener manual removido em `disconnectedCallback`
- [ ] Nenhum componente guardando referência direta a outro
- [ ] Todo evento disparado documentado no `types.d.ts` com `@fires`
- [ ] Todo evento documentado tem teste de interação que o exercita

## Troubleshooting

### O evento não chega no listener de fora do componente

**Causa:** `composed: false` — o evento borbulha dentro do Shadow DOM e para na fronteira.
**Solução:** `composed: true`. `bubbles` sozinho não basta quando há Shadow DOM.

### O handler dispara duas vezes

**Causa:** listener registrado em `connectedCallback` sem remoção correspondente, e o
elemento foi movido no DOM — o que dispara `disconnected` e `connected` de novo.
**Solução:** `removeEventListener` em `disconnectedCallback`, sempre.

### O evento aparece no painel Actions mas nada acontece

**Causa:** a declaração em `actions.handles` mostra o evento; não prova que a lógica
funciona.
**Solução:** teste de interação (skill `preview`) fazendo `expect` do `detail`.

### `on.{tipo}` nunca dispara para um evento no próprio host

**Causa:** o listener vive em `shadowRoot`, que não é ancestral do host na árvore composta —
só evento nascido dentro do shadow tree (incluindo slotted) chega até ele. Um `keydown` (ou
qualquer evento) despachado com `target` igual ao próprio elemento — típico de um host
focável via `tabIndex`, sem sub-elemento nativo que herde o foco — nunca é observado por
`on`, mesmo com seletor `'*'`. Verificado empiricamente: um evento `bubbles: true, composed:
true` disparado no host não é visto por um listener em `host.shadowRoot`.
**Solução hoje:** `addEventListener` manual no próprio elemento (não no `shadowRoot`),
registrado no constructor ou em `connectedCallback` conforme o ciclo de vida exigir —
aceitando a exceção à convenção de "listener por decorator" desta skill, com comentário
explicando o motivo. Não existe workaround por seletor ou modificador: é um limite estrutural
de `listen.js` (`packages/event/listen.js`), não de configuração. Estender `on` para também
escutar no host é mudança de infraestrutura compartilhada — decisão do `architect`, fora do
escopo de um componente único.

## Rules relacionadas

- [009 — Diga, Não Pergunte](../../rules/009_diga-nao-pergunte.md): o evento notifica o que aconteceu; quem escuta decide o que fazer.
- [018 — Dependências Acíclicas](../../rules/018_principio-dependencias-aciclicas.md): comunicação por evento evita o ciclo que a referência direta criaria.
- [024 — Constantes Mágicas](../../rules/024_proibicao-constantes-magicas.md): nome de evento repetido vira constante.
- [034 — Nomes Consistentes](../../rules/034_nomes-classes-metodos-consistentes.md): verbo no passado para fato consumado.
- [036 — Efeitos Colaterais](../../rules/036_restricao-funcoes-efeitos-colaterais.md): modificadores são puros.
- [048 — Descartabilidade](../../rules/048_descartabilidade-processos.md): todo listener registrado é removido.

## Skills relacionadas

- [mixin](../mixin/SKILL.md): depends on — `Echo` é a base do sistema de eventos.
- [constructor](../constructor/SKILL.md): depends on — por que listener não vive no constructor.
- [dataflow](../dataflow/SKILL.md): complements — event bus para fluxo entre componentes distantes.
- [enum](../enum/SKILL.md): reinforces — nomes de evento como constantes.
- [preview](../preview/SKILL.md): complements — `actions.handles` e a story com `play`.
- [types](../types/SKILL.md): depends on — o evento disparado é parte do contrato público.
- [method](../method/SKILL.md): complements — a forma do método decorado.

---

**Criado em**: 2026-04-01
**Atualizado em**: 2026-08-20
**Versão**: 2.1
