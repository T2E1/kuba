---
name: constructor
model: sonnet
description: Estrutura do constructor de um custom element — `super()` primeiro, Shadow DOM em seguida quando o componente é visual, `delegatesFocus` conforme a categoria, nada de atributo, DOM externo, listener ou chamada assíncrona. Use ao criar um Web Component novo, ao implementar ou revisar o constructor de um Custom Element, ou ao investigar por que um atributo lido na inicialização vem vazio. Não use para decidir a ordem dos demais membros da classe — use a skill anatomy.
---

# Constructor

## O que é

O constructor de um custom element roda antes de o elemento estar no documento e antes de
os atributos serem processados. Isso define tudo o que ele pode e não pode fazer: ele
monta a estrutura, e nada mais.

O erro que essa restrição previne é sempre o mesmo — ler um atributo no constructor e
receber `null`, porque o parser ainda não chegou lá.

## Quando usar

| Situação | Ação |
|---|---|
| Criando componente visual | `super()` + `attachShadow` |
| Criando componente comportamental | Omitir o constructor |
| Atributo lido na inicialização vem vazio | Mover para `attributeChangedCallback` |
| Precisa de listener | Mover para `connectedCallback` |

## Como aplicar

### Sequência

| Ordem | Ação | Obrigatória |
|---|---|---|
| 1 | `super()` | Sim, sempre a primeira linha |
| 2 | `attachShadow({ mode: 'open' })` | Se o componente é visual |
| 3 | Operação síncrona mínima | Opcional |

`mode` é sempre `open` — Shadow DOM fechado impede o teste e a inspeção sem trazer
segurança real.

### `delegatesFocus`

A decisão não é pela categoria do componente — é por **o que o shadow root contém**.
`delegatesFocus` muda duas coisas: `:host(:focus-visible)` só casa quando algo dentro do
shadow tree (incluindo conteúdo slotted, que é projetado ali) recebe foco; e `elemento.
focus()` chamado de fora passa a focar o primeiro descendente focável em vez de não fazer
nada. Sem ele, um container cujo filho slotted é focado não tem como se estilizar em
resposta — o anel de foco fica só no filho, nunca no `:host`.

| Situação | `delegatesFocus` |
|---|---|
| `component.js` renderiza `<slot>` que aceita conteúdo arbitrário do consumidor | `true` — o conteúdo slotted pode ser focável, mesmo que o componente não seja ele mesmo um controle |
| Sub-elemento nativo interativo no próprio shadow root (`<button>`, `<input>`) | `true` — é o padrão de `kb-button`, `kb-input`, `kb-textarea` |
| Nenhum `<slot>`, e nada focável no shadow root (`kb-icon`, `kb-cover`, `kb-logo`, `kb-progress`) | Omitir |
| Slot cujo conteúdo nunca é focável por contrato do próprio componente (raro) | Omitir, com comentário no `constructor` explicando a exceção — a ausência aqui é decisão, não esquecimento |

Isso vale **independente** de o componente ter foco, papel ou ação própria. Um container
puramente passivo — sem `tabIndex`, sem `role`, sem interceptar clique — ainda delega foco
se aceita `<slot>`: é o filho que pode ser focável, não o host.

### Categorias de componente

| Categoria | Shadow DOM | Sub-elemento nativo ou `<slot>` de conteúdo arbitrário | Comportamental |
|---|---|---|---|
| Interativo (com controle nativo) | Sim | Sim — `delegatesFocus: true` | Button, Input |
| Container (agrupa conteúdo do consumidor) | Sim | Sim — `delegatesFocus: true` | Card, Stack, Header |
| Visual (sem slot, sem foco possível) | Sim | Não | Icon, Cover |
| Comportamental | Não | — | On, Redirect |

Componente comportamental usa o mixin `Headless` e **não define constructor**.

### `internals` por getter lazy

Componentes que usam Element Internals (estado, associação de formulário) não chamam
`attachInternals()` no constructor — expõem por getter preguiçoso, para que o mixin que
depende dele encontre a mesma instância:

Ver [internals.valid.js](examples/internals.valid.js). Foi a ausência dessa exposição
pública que causou o bug do mixin `Hidden` com `<kb-button>`.

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Sequência de inicialização | [sequence.valid.js](examples/sequence.valid.js) | [sequence.invalid.js](examples/sequence.invalid.js) |
| `internals` exposto por getter lazy | [internals.valid.js](examples/internals.valid.js) | [internals.invalid.js](examples/internals.invalid.js) |

## Checklist

- [ ] `super()` é a primeira linha
- [ ] `mode: 'open'` no `attachShadow`
- [ ] `delegatesFocus` presente se `component.js` renderiza `<slot>` de conteúdo arbitrário ou um sub-elemento nativo focável; omitido só quando nada no shadow root pode ser focado
- [ ] Nenhum `getAttribute` no constructor
- [ ] Nenhum acesso a DOM externo
- [ ] Nenhum `addEventListener` — isso é `connectedCallback`
- [ ] Nenhuma chamada assíncrona ou de API
- [ ] Constructor abaixo de 15 linhas (rule 007)
- [ ] Componente comportamental sem constructor

## Troubleshooting

### O atributo vem `null` no constructor

**Causa:** o constructor roda antes de o parser processar os atributos. Não é um bug —
é a especificação.
**Solução:** ler em `attributeChangedCallback`, que é chamado para cada atributo
observado assim que ele é conhecido.

### O listener registrado no constructor não dispara

**Causa:** o elemento ainda não está conectado ao documento.
**Solução:** registrar em `connectedCallback` e remover em `disconnectedCallback`.

### Dois pontos do código chamaram `attachInternals()` e um deles falhou

**Causa:** `attachInternals()` só pode ser chamado uma vez por elemento.
**Solução:** getter lazy com `??=`, exposto publicamente para que os mixins usem a mesma
instância.

## Rules relacionadas

- [010 — Responsabilidade Única](../../rules/010_principio-responsabilidade-unica.md): o constructor inicializa estrutura; lógica de negócio é método.
- [022 — Simplicidade e Clareza](../../rules/022_priorizacao-simplicidade-clareza.md): constructor previsível, síncrono e sem ramificação.
- [007 — Máximo de Linhas por Classe](../../rules/007_limite-maximo-linhas-classe.md): limite de 15 linhas para o método.
- [036 — Restrição de Efeitos Colaterais](../../rules/036_restricao-funcoes-efeitos-colaterais.md): o constructor não toca DOM externo.
- [028 — Tratamento de Exceção Assíncrona](../../rules/028_tratamento-excecao-assincrona.md): nenhuma Promise nasce aqui, porque não há onde tratá-la.

## Skills relacionadas

- [anatomy](../anatomy/SKILL.md): depends on — define onde o constructor fica na classe.
- [mixin](../mixin/SKILL.md): complements — a cadeia de mixins é montada no `extends`, não no constructor.
- [render](../render/SKILL.md): depends on — a renderização acontece depois, não aqui.
- [state](../state/SKILL.md): depends on — `internals` é a porta para Element Internals.
- [event](../event/SKILL.md): complements — listeners pertencem ao `connectedCallback`.

---

**Criado em**: 2026-04-01
**Atualizado em**: 2026-08-20
**Versão**: 2.1
