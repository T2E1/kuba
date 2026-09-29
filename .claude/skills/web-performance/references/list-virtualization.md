# List Virtualization

**Categoria:** Carregamento
**Intenção:** Renderizar apenas os itens visíveis de uma lista longa, mantendo a barra de
rolagem coerente com o total.

---

## Quando Usar

- Lista com centenas ou milhares de itens em que a rolagem trava ou a montagem inicial
  demora.
- Quando o custo está medido: número de itens, tempo de montagem, taxa de quadros durante
  a rolagem.

## Quando NÃO Usar

- Listas curtas. Abaixo de algumas dezenas de itens, o custo do cálculo de posição supera
  o da renderização direta ([rule 012](../../../rules/012_otimizacao-prematura.md)).
- Quando a busca do navegador na página precisa encontrar qualquer item: o que não está
  renderizado não é encontrado, e isso costuma ser descoberto tarde.
- Quando os itens têm altura muito variável e desconhecida — o cálculo passa a exigir
  medição por item, e a rolagem fica instável.

## Estrutura Mínima

Um contêiner com altura definida, um espaçador que reserva a altura total, e a janela de
itens visíveis posicionada dentro dele. A janela inclui uma margem acima e abaixo, para
que a rolagem rápida não mostre espaço vazio.

## O que custa

- **Acessibilidade e busca na página degradam por construção:** tecnologia assistiva e
  a busca do navegador só alcançam o que existe na árvore. O total precisa ser anunciado
  por outro meio.
- Âncoras internas e restauração de posição deixam de funcionar sozinhas.
- Altura variável exige medição, e medição errada produz saltos na rolagem.

## Relacionado a

- [import-on-visibility.md](import-on-visibility.md): complementa — a mesma ideia aplicada a código, não a itens
- [flyweight.md](../../gof/references/flyweight.md): substitui — para lista longa, não renderizar vence compartilhar estado
- [big-o](../../big-o/SKILL.md): depende — o ganho é de complexidade, e ela sabe medi-lo
- [rule 012 — Proibição de Otimização Prematura](../../../rules/012_otimizacao-prematura.md): reforça

---

**Fonte:** patterns.dev — /vanilla/virtual-lists
