---
name: anti-pattern
model: opus
description: Catálogo de 26 anti-patterns e code smells com sintoma, severidade e refatoração — The Blob, Spaghetti Code, Long Method, Feature Envy, Shotgun Surgery, Lava Flow, Middle Man, Poltergeists e os demais, cada um mapeado para a rule correspondente. Use ao revisar código e reconhecer que algo está errado sem saber nomear, ao responder "o que há de errado neste código?", ao escrever comentário de PR que precisa de diagnóstico preciso, ou ao decidir qual refatoração aplicar. Não use para calibrar se a violação bloqueia o merge — use a skill quality.
---

# Anti-Patterns

## O que é

Catálogo dos 26 padrões negativos que as rules 052 a 070 (mais 003, 005, 007, 021, 023,
025) codificam. Cada um tem nome, sintoma reconhecível e refatoração documentada.

Nomear importa mais do que parece: "isto é Middle Man" comunica diagnóstico e solução
numa expressão; "este código está confuso" não comunica nada e não é acionável.

## Quando usar

| Situação | Ação |
|---|---|
| O código incomoda mas você não sabe nomear | Percorrer o índice por sintoma |
| Escrevendo comentário de PR | Nomear o pattern e citar a rule |
| Decidindo qual refatoração aplicar | Abrir a referência do pattern |
| Priorizando dívida técnica | Atacar os 🔴 antes dos 🟡 |

Não use para decidir se a violação bloqueia o merge — isso é `quality`. Não use como
justificativa para reescrever código que funciona: a refatoração é incremental.

## Como aplicar

### 1. Identificar o sintoma

Percorra por categoria: **estruturais** (Long Method, Large Class, Data Clumps),
**comportamentais** (Feature Envy, Divergent Change, Shotgun Surgery) e **de manutenção**
(Lava Flow, Boat Anchor, Speculative Generality).

### 2. Nomear o pattern e citar a rule

Um comentário de review sem nome não é acionável — ver o par de exemplos abaixo.

### 3. Aplicar a refatoração documentada

Cada arquivo em `references/` traz o exemplo problemático, o refatorado e a técnica
(Extract Method, Extract Class, Replace Conditional with Polymorphism…).

### Índice — 🔴 Críticos

| Pattern | Rule | Sintoma | Detalhe |
|---|---|---|---|
| The Blob | 025 | Classe que faz tudo, todas as outras a orbitam | [the-blob.md](references/the-blob.md) |
| Spaghetti Code | 060 | Fluxo de controle impossível de seguir | [spaghetti-code.md](references/spaghetti-code.md) |
| Shared Mutable State | 070 | Múltiplos módulos mutam o mesmo objeto | [shared-mutable-state.md](references/shared-mutable-state.md) |
| Primitive Obsession | 003 | `string`/`number` no lugar de Value Object | [primitive-obsession.md](references/primitive-obsession.md) |

### Índice — 🟠 Alta

| Pattern | Rule | Sintoma | Detalhe |
|---|---|---|---|
| Long Method | 055 | Método acima de 20 linhas com várias responsabilidades | [long-method.md](references/long-method.md) |
| Large Class | 007 | Arquivo de classe acima de 50 linhas | [large-class.md](references/large-class.md) |
| Divergent Change | 054 | Uma classe muda por N razões diferentes | [divergent-change.md](references/divergent-change.md) |
| Shotgun Surgery | 058 | Uma mudança obriga a editar N arquivos | [shotgun-surgery.md](references/shotgun-surgery.md) |
| Lava Flow | 056 | Código morto que ninguém ousa remover | [lava-flow.md](references/lava-flow.md) |
| Accidental Mutation | 052 | Função muta o parâmetro sem dizer | [accidental-mutation.md](references/accidental-mutation.md) |
| Callback Hell | 063 | Callbacks assíncronos aninhados | [callback-hell.md](references/callback-hell.md) |
| Pyramid of Doom | 066 | `if`/`else`/loops aninhados em seta | [pyramid-of-doom.md](references/pyramid-of-doom.md) |
| Clever Code | 062 | Concisão ganhando da legibilidade | [clever-code.md](references/clever-code.md) |
| Overengineering | 064 | Arquitetura complexa para problema simples | [overengineering.md](references/overengineering.md) |
| Cut-and-Paste | 021 | Reuso por cópia, N fontes de verdade | [cut-and-paste-programming.md](references/cut-and-paste-programming.md) |
| Golden Hammer | 068 | A mesma ferramenta para todo problema | [golden-hammer.md](references/golden-hammer.md) |

### Índice — 🟡 Média

| Pattern | Rule | Sintoma | Detalhe |
|---|---|---|---|
| Feature Envy | 057 | Método usa mais dados de outra classe que os próprios | [feature-envy.md](references/feature-envy.md) |
| Data Clumps | 053 | Dados que sempre viajam juntos sem objeto próprio | [data-clumps.md](references/data-clumps.md) |
| Message Chains | 005 | `a.getB().getC().getD()` | [message-chains.md](references/message-chains.md) |
| Middle Man | 061 | Classe que só delega, sem valor próprio | [middle-man.md](references/middle-man.md) |
| Refused Bequest | 059 | Subclasse recusa o que herdou | [refused-bequest.md](references/refused-bequest.md) |
| Speculative Generality | 023 | Abstração para caso hipotético | [speculative-generality.md](references/speculative-generality.md) |
| Poltergeists | 065 | Objeto criado, usado e descartado sem valor | [poltergeists.md](references/poltergeists.md) |
| Boat Anchor | 067 | Dependência instalada e nunca usada | [boat-anchor.md](references/boat-anchor.md) |
| Premature Optimization | 069 | Otimização sem medição | [premature-optimization.md](references/premature-optimization.md) |

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Comentário de review que nomeia o pattern e a rule | [review-comment.valid.md](examples/review-comment.valid.md) | [review-comment.invalid.md](examples/review-comment.invalid.md) |

## Checklist

- [ ] O problema foi nomeado, não apenas descrito como "confuso"
- [ ] A rule correspondente foi citada
- [ ] A refatoração sugerida veio da referência do pattern, não da intuição
- [ ] Os 🔴 foram tratados antes dos 🟡
- [ ] A refatoração é incremental — nenhuma reescrita de código funcional

## Troubleshooting

### Refatorei um anti-pattern e apareceu outro

**Causa:** normal e esperado. Quebrar The Blob costuma produzir Middle Man ou
Poltergeists se a divisão foi por tamanho e não por responsabilidade.
**Solução:** dividir por razão-para-mudar (rule 054), não por contagem de linhas.

### Todo código legado vira uma lista de 30 anti-patterns

**Causa:** o catálogo aplicado como auditoria exaustiva em vez de diagnóstico dirigido.
**Solução:** limitar ao escopo tocado, como pede a Regra do Escoteiro (rule 039). O resto
vira codetag rastreável.

### Dois patterns descrevem o mesmo código

**Causa:** vários são pares complementares — Divergent Change e Shotgun Surgery, Feature
Envy e Middle Man, Callback Hell e Pyramid of Doom.
**Solução:** escolher o que descreve a *direção* do problema. Uma classe muda por N
razões é Divergent Change; uma razão muda N classes é Shotgun Surgery.

## Referências

- `references/*.md` — um arquivo por anti-pattern, com sintomas, exemplo problemático,
  exemplo refatorado e a técnica de refatoração aplicável.

Origem: *AntiPatterns* (Brown, Malveau, McCormick, Mowbray, 1998); *Refactoring*
(Fowler, 1999/2018); *Clean Code* (Martin, 2008).

## Rules relacionadas

As rules 052 a 070 são este catálogo com critérios objetivos. As demais entradas mapeiam
para rules anteriores:

- [003 — Encapsulamento de Primitivos](../../rules/003_encapsulamento-primitivos.md) · [005 — Encadeamento de Chamadas](../../rules/005_maximo-uma-chamada-por-linha.md) · [007 — Máximo de Linhas por Classe](../../rules/007_limite-maximo-linhas-classe.md)
- [021 — Proibição de Duplicação](../../rules/021_proibicao-duplicacao-logica.md) · [023 — Funcionalidade Especulativa](../../rules/023_proibicao-funcionalidade-especulativa.md) · [025 — The Blob](../../rules/025_proibicao-anti-pattern-the-blob.md)
- [039 — Regra do Escoteiro](../../rules/039_regra-escoteiro-refatoracao-continua.md): define o escopo em que a refatoração acontece.

## Skills relacionadas

- [clean-code](../clean-code/SKILL.md): complements — anti-patterns são o negativo destas práticas.
- [quality](../quality/SKILL.md): complements — encontra aqui, pesa lá.
- [codetags](../codetags/SKILL.md): depends on — a violação que não será corrigida agora vira codetag.
- [solid](../solid/SKILL.md): complements — a maioria dos 🔴 é um princípio SOLID quebrado.
- [complexity](../complexity/SKILL.md): reinforces — Spaghetti Code e Pyramid of Doom têm CC como sintoma mensurável.

---

**Criado em**: 2026-04-01
**Atualizado em**: 2026-08-09
**Versão**: 2.0
