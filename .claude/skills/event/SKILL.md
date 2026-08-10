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
- [ ] Todo evento documentado tem story com `play` que o exercita

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
**Solução:** story com `play` (skill `story`, Regra 6) fazendo `expect` do `detail`.

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
- [story](../story/SKILL.md): complements — `actions.handles` e a story com `play`.
- [types](../types/SKILL.md): depends on — o evento disparado é parte do contrato público.
- [method](../method/SKILL.md): complements — a forma do método decorado.

---

**Criado em**: 2026-04-01
**Atualizado em**: 2026-08-10
**Versão**: 2.0
