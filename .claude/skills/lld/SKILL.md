---
name: lld
model: opus
description: Framework de 5 passos para especificar um custom element do kuba antes de escrever código — requisitos, contrato público (attributes, properties, events, slots, parts), composição em mixins, gestão de estado (controlado vs não controlado, ElementInternals) e edge cases (teclado, leitor de tela, limites). Adapta o framework LLD de entrevistas de front-end ao paradigma de Web Components puro deste repositório, sem React, sem props, sem TSX. Use antes de implementar um componente novo, ao receber um pedido vago de feature ("adiciona um carrossel"), ou ao decidir se um attribute é controlado. Não use para a forma do types.d.ts — use a skill types; não use para nomear tokens — use a skill token.
---

# LLD — Low-Level Design de Componentes

## O que é

Um roteiro de cinco passos para pensar um custom element antes de escrever a primeira
linha de `packages/`: o que ele precisa fazer, que contrato ele expõe, como se compõe,
onde mora o estado, e o que pode dar errado. Adaptado do framework *LLD Problem
Strategies* (FrontScope) — originalmente pensado para entrevistas de front-end em React —
ao paradigma deste repositório: sem props, sem TSX, sem `useState`. Aqui o contrato é
`attribute`/`property`/`event`/`slot`/`part`, a composição é mixin, e o estado vive em
campo privado `#` ou em `ElementInternals`.

O valor do framework não é a lista de passos — é obrigar a decisão a acontecer **antes**
do código, registrada, em vez de emergir por acidente enquanto se escreve `component.js`.

## Quando usar

| Situação | Ação |
|---|---|
| Vai nascer um componente novo em `packages/` | Percorrer os 5 passos antes do primeiro arquivo |
| Pedido vago de feature ("adiciona um carrossel") | Passo 1 — extrair requisitos antes de estimar ou codificar |
| Dúvida se um attribute reflete no DOM ou só existe como property | Passo 4 — controlado vs não controlado |
| Revisão encontra componente sem plano de teclado ou leitor de tela | Passo 5 vira checklist de cobertura |
| Decidir se o componente precisa de sub-elemento ou resolve com Shadow DOM interno | Passo 3 |

Não use para desenhar a forma do `types.d.ts` — isso é a skill `types`. Não use para
nomear um token de design — isso é a skill `token`. Não use para implementar depois que a
forma já foi decidida — isso é o agent `developer`.

## Como aplicar

### Passo 1 — Clarificar requisitos

Antes de qualquer estimativa ou código, responder:

- Quem consome o componente e em que contexto (formulário, navegação, feedback)?
- É somente leitura ou interativo?
- Existe um caso de uso mínimo (MVP) distinto de variações "bônus"?
- Precisa participar de `<form>` (form-associated via `ElementInternals`)?
- Existe estado de `loading` ou `disabled` a cobrir?
- Qual a superfície de variação — `variant`, `size`, `color` — e ela é finita ou aberta?

A resposta muda o tamanho da implementação inteira: um rating somente leitura é trivial;
um rating interativo, compatível com formulário, com precisão de meia estrela e preview
no hover é outra ordem de grandeza. Pular este passo é o sinal de alerta mais citado pelo
framework original.

### Passo 2 — Desenhar o contrato público

Antes de tocar `component.js`, esboçar o que o elemento expõe — o que depois vira
`types.d.ts` (skill `types`):

- **Attributes** refletidos: quais, com que tipo primitivo, com que valor padrão.
- **Properties**: as que não fazem sentido como attribute (listas, objetos).
- **Events**: nome em verbo no passado (`changed`, `dismissed`), payload em `detail`.
- **Slots**: nomeados ou default, e o que cada um espera receber.
- **Parts**: o que o consumidor pode re-estilizar via `::part()`.
- **Custom properties de CSS**: o que é token e o que é ponto de extensão do consumidor.

Um contrato com atributo booleano de comportamento (`isCompact`, `shouldAnimate`) é o
sinal de que a rule 037 (Proibição de Argumentos Sinalizadores) foi violada antes mesmo
do código existir — resolver aqui, no papel, custa uma frase; resolver depois de
implementado custa uma migração.

### Passo 3 — Esboçar a composição

Decidir, sem código:

- Que mixins entram na cadeia (Echo é obrigatório para o sistema de eventos).
- Se o componente precisa de um sub-elemento (nova tag Custom Element) ou se resolve com
  Shadow DOM interno sem expor uma segunda tag pública.
- Se a árvore de composição pode ficar mais rasa.

Manter a hierarquia o mais rasa possível. Fragmentar um componente simples em três
elementos "para o caso de precisar" é overengineering (rule 064) travestido de
arquitetura — a mesma armadilha que o framework original descreve como "over-splitting a
simple component into 5 sub-components".

### Passo 4 — Projetar o estado

Para cada dado que muda:

- É estado visual, exposto ao CSS via `:state()` (skill `state`, `ElementInternals`), ou
  é dado puro, guardado em campo privado `#`?
- O attribute correspondente é **controlado** (a fonte de verdade é o DOM — o consumidor
  seta o attribute e o componente reage) ou **não controlado** (o componente inicializa a
  partir de um valor default e passa a governar sozinho, emitindo evento na mudança)?
- Qual estado é derivado (ex: valor de preview durante hover) e não deveria virar campo
  próprio, apenas um cálculo na leitura?

Decidir isso por escrito evita a ambiguidade mais comum encontrada em revisão: um
attribute que às vezes reflete o DOM e às vezes não, dependendo de qual método foi
chamado por último.

### Passo 5 — Enumerar edge cases

Percorrer sistematicamente, e registrar mesmo o que não será implementado agora
(codetag, conforme a skill `codetags`):

- O que renderiza no valor vazio, zero, ou não definido?
- O que acontece quando o valor ultrapassa o limite (`max`, `min`)?
- Qual o comportamento de teclado (setas, `Home`/`End`, `Enter`/`Espaço`)?
- O que um leitor de tela anuncia quando o valor muda?
- Qual a aparência e o comportamento em `disabled` e em `loading`?

Mencionar acessibilidade sem que alguém pergunte é, segundo o framework original, o sinal
mais forte de senioridade em uma revisão — e aqui vira registro objetivo antes da
implementação, não comentário de code review depois dela.

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| LLD de um `kb-rating` percorrendo os 5 passos antes do código | [kb-rating.valid.md](examples/kb-rating.valid.md) | [kb-rating.invalid.md](examples/kb-rating.invalid.md) |

## Checklist

- [ ] Requisitos (passo 1) respondidos e registrados antes do primeiro arquivo em `packages/`
- [ ] Contrato público (passo 2) esboçado — attributes, properties, events, slots, parts
- [ ] Nenhum attribute booleano de comportamento no contrato (rule 037)
- [ ] Composição (passo 3) decidida, com a hierarquia o mais rasa possível (rule 064)
- [ ] Para cada attribute com estado, controlado vs não controlado (passo 4) está explícito
- [ ] Edge cases de valor, teclado, leitor de tela e estado disabled (passo 5) enumerados
- [ ] Acessibilidade mencionada no plano, não descoberta em revisão

## Rules relacionadas

- [037 — Proibição de Argumentos Sinalizadores](../../rules/037_proibicao-argumentos-sinalizadores.md):
  o passo 2 barra attribute booleano de comportamento antes de ele nascer.
- [064 — Proibição de Overengineering](../../rules/064_proibicao-overengineering.md):
  o passo 3 mantém a composição rasa em vez de fragmentar preventivamente.
- [023 — Proibição de Funcionalidade Especulativa (YAGNI)](../../rules/023_proibicao-funcionalidade-especulativa.md):
  o passo 1 corta variação hipotética antes de ela virar código morto.
- [010 — Princípio da Responsabilidade Única](../../rules/010_principio-responsabilidade-unica.md):
  o passo 3 usa o mesmo critério — um sub-elemento só nasce quando tem razão própria de mudar.

## Skills relacionadas

- [types](../types/SKILL.md): complements — esta skill decide o quê o contrato expõe, `types` decide a forma exata do `types.d.ts`.
- [state](../state/SKILL.md): complements — o passo 4 usa `ElementInternals` como definido lá.
- [mixin](../mixin/SKILL.md): complements — o passo 3 escolhe a cadeia que `mixin` sabe compor.
- [preview](../preview/SKILL.md): complements — depois do plano pronto, `preview` decide o que demonstrar.
- [calisthenics](../calisthenics/SKILL.md): reinforces — hierarquia rasa e sem flag argument são regras de Object Calisthenics aplicadas na fase de design.

---

**Criado em**: 2026-08-11
**Atualizado em**: 2026-08-11
**Versão**: 1.0
