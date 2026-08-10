---
name: alphabetical
model: haiku
description: Ordenação alfabética de propriedades em objetos, chaves JSON, exports nomeados, interfaces e objetos de configuração — aplicada recursivamente, com exceção explícita para sequências cujo significado depende da ordem. Use ao criar ou modificar objeto literal, arquivo JSON, lista de exports ou objeto de configuração, ou ao revisar coleção de propriedades em ordem arbitrária. Não use para ordenar membros dentro de uma classe — use a skill anatomy.
---

# Alphabetical

## O que é

Propriedades em ordem alfabética. A justificativa não é estética: qualquer outra ordem
exige que o leitor descubra **qual** é a ordem antes de procurar. Alfabética é a única
que não precisa ser explicada.

## Quando usar

| Contexto | Aplica |
|---|---|
| Literal de objeto | ✅ |
| Arquivo JSON de configuração | ✅ |
| Exports nomeados no index | ✅ |
| Propriedades de interface ou type | ✅ |
| Objeto de estilo / CSS-in-JS | ✅ |
| Membros de classe | ❌ — skill `anatomy` define os grupos |

### Exceções

Não ordene quando a ordem carrega significado:

| Situação | Exemplo |
|---|---|
| Sequência semântica | `x`, `y`, `z`; `top`, `right`, `bottom`, `left` |
| Ordem de execução | Etapas de um pipeline |
| Parâmetros de construtor | A ordem é o contrato |
| Contrato externo | Estrutura definida por API de terceiro |
| Agrupamento coeso | Bloco que muda junto (rule 016) — alfabética dentro do grupo |

A exceção é sobre **significado**, não sobre conveniência. "Fica melhor assim" não é
significado.

## Como aplicar

1. Ordenar de A a Z.
2. Aplicar recursivamente aos objetos aninhados.
3. Maiúsculas antes de minúsculas (`A` antes de `a`).
4. Havendo agrupamento coeso justificado, ordenar dentro de cada grupo.

O Biome (`bunx biome check`) cuida da formatação; a ordenação semântica é verificada em
revisão.

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Objeto de configuração e exports ordenados | [ordering.valid.js](examples/ordering.valid.js) | [ordering.invalid.js](examples/ordering.invalid.js) |

## Checklist

- [ ] Propriedades de A a Z
- [ ] Objetos aninhados também ordenados
- [ ] Exports nomeados em ordem alfabética
- [ ] Toda exceção justificada por significado, não por preferência
- [ ] Agrupamento coeso preservado, com alfabética dentro do grupo

## Troubleshooting

### A ordem alfabética separou propriedades relacionadas

**Causa:** esperado — a alfabética não agrupa por tema.
**Solução:** se o agrupamento é essencial, ele é um objeto aninhado com nome próprio.
Aí a alfabética se aplica dentro dele, e o agrupamento fica explícito em vez de implícito
na ordem.

### O diff ficou enorme depois de ordenar

**Causa:** reordenação misturada com mudança funcional.
**Solução:** commit separado só de ordenação. Misturar torna a revisão da mudança real
impossível.

### Duas pessoas discordam se a ordem tem significado

**Causa:** ausência de critério.
**Solução:** o teste é objetivo — trocar duas propriedades de lugar muda o comportamento?
Se não muda, não há significado, e a alfabética vale.

## Rules relacionadas

- [022 — Simplicidade e Clareza](../../rules/022_priorizacao-simplicidade-clareza.md): ordem previsível elimina o custo de descobrir a ordem.
- [016 — Fechamento Comum](../../rules/016_principio-fechamento-comum.md): o agrupamento coeso é a exceção legítima.
- [006 — Proibição de Nomes Abreviados](../../rules/006_proibicao-nomes-abreviados.md): nome completo é o que torna a busca alfabética útil.
- [024 — Constantes Mágicas](../../rules/024_proibicao-constantes-magicas.md): objetos de configuração ordenados tornam o valor faltante visível.

## Skills relacionadas

- [anatomy](../anatomy/SKILL.md): complements — a mesma disciplina dentro da classe, com grupos definidos.
- [revelation](../revelation/SKILL.md): reinforces — os exports nomeados do index ficam ordenados.
- [enum](../enum/SKILL.md): reinforces — chaves de enum em ordem alfabética.
- [token](../token/SKILL.md): complements — propriedades do bloco de estilo.

---

**Criado em**: 2026-04-01
**Atualizado em**: 2026-08-10
**Versão**: 2.0
