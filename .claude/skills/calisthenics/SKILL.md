---
name: calisthenics
model: opus
description: As 9 regras de Object Calisthenics (Jeff Bay) para design orientado a objetos em nível tático — indentação única, sem else, encapsular primitivos, coleções de primeira classe, um ponto por linha, sem abreviações, classes pequenas, sem getters/setters, tell don't ask. Use ao escrever ou refatorar classes e métodos, ao revisar código com aninhamento profundo, `else`, `string` representando conceito de domínio, `array` cru retornado de método de domínio, encadeamento `a.getB().getC()`, nomes abreviados, classe grande ou getter/setter trivial. Não use para design de interfaces e dependências entre classes — use a skill solid.
---

# Object Calisthenics

## O que é

Nove regras criadas por Jeff Bay para treinar design orientado a objetos. São exercícios:
restringem deliberadamente o que é permitido, forçando soluções melhores. São a base das
rules 001 a 009 deste repositório.

Diferença para SOLID: SOLID governa a relação **entre** classes; Calisthenics governa o
que acontece **dentro** de uma classe e de um método.

## Quando usar

| Situação | Ação |
|---|---|
| Escrevendo classe ou método novo | Aplicar as 9 durante a escrita |
| `if` dentro de `for` | Regra 1 — extrair método |
| `else` presente | Regra 2 — guard clause |
| `string`/`number` representando Email, CPF, Path | Regra 3 — Value Object |
| Método de domínio retornando `Array` | Regra 4 — First Class Collection |
| `a.getB().getC()` | Regra 5 — um ponto por linha |
| Classe passando de 50 linhas | Regra 7 — dividir |
| Método `getStatus()` / `setName()` | Regra 8 — método de intenção |

Não aplique mecanicamente: cada regra existe para resolver um problema. Se o problema
não está lá, a regra vira ruído. A regra 3 tem exceção explícita para primitivos
genéricos (`index`, `isValid`, delta temporal).

## Como aplicar

| # | Regra | Rule | Detalhe |
|---|---|---|---|
| 1 | Nível único de indentação | 001 | [rule-01-single-indentation.md](references/rule-01-single-indentation.md) |
| 2 | Proibição de `else` | 002 | [rule-02-no-else.md](references/rule-02-no-else.md) |
| 3 | Encapsulamento de primitivos | 003 | [rule-03-wrap-primitives.md](references/rule-03-wrap-primitives.md) |
| 4 | Coleções de primeira classe | 004 | [rule-04-first-class-collections.md](references/rule-04-first-class-collections.md) |
| 5 | Um ponto por linha | 005 | [rule-05-one-dot-per-line.md](references/rule-05-one-dot-per-line.md) |
| 6 | Proibição de abreviações | 006 | [rule-06-no-abbreviations.md](references/rule-06-no-abbreviations.md) |
| 7 | Classes pequenas | 007 | [rule-07-small-classes.md](references/rule-07-small-classes.md) |
| 8 | Proibição de getters/setters | 008 | [rule-08-no-getters-setters.md](references/rule-08-no-getters-setters.md) |
| 9 | Diga, não pergunte | 009 | [rule-09-tell-dont-ask.md](references/rule-09-tell-dont-ask.md) |

### Diagnóstico rápido

```
Método com if dentro de for?                  → 1: Indentação única
Método com else?                              → 2: Guard clause
string/number para Email ou CPF?              → 3: Value Object
Retorna Array[] de método de domínio?         → 4: First Class Collection
Chama a.getB().getC()?                        → 5: Um ponto por linha
Variável chamada "usr" ou "calc"?             → 6: Nome por extenso
Classe com mais de 50 linhas?                 → 7: Dividir
Método getStatus() ou setName()?              → 8: Método de intenção
Pergunta estado para decidir a ação?          → 9: Diga, não pergunte
```

### O que cada grupo compra

- **1 e 2** derrubam a complexidade ciclomática — são o caminho mais curto para CC ≤ 5.
- **3 e 4** movem validação e comportamento para dentro do objeto que os possui.
- **5, 8 e 9** aplicam a Lei de Demeter, cortando acoplamento transitivo.
- **6** faz o código ser pesquisável e lido sem decodificação.
- **7** força SRP a acontecer em vez de ser só uma intenção.

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Guard clause no lugar de `else`, sem encadeamento (regras 1, 2, 5, 9) | [guard-clause.valid.js](examples/guard-clause.valid.js) | [guard-clause.invalid.js](examples/guard-clause.invalid.js) |
| Value Object para primitivo de domínio (regra 3) | [value-object.valid.js](examples/value-object.valid.js) | [value-object.invalid.js](examples/value-object.invalid.js) |

## Checklist

- [ ] Nenhum método com mais de um nível de indentação de bloco
- [ ] Nenhum `else` ou `else if`
- [ ] Nenhum primitivo representando conceito de domínio em assinatura pública
- [ ] Nenhuma coleção nativa retornada de método de domínio
- [ ] No máximo um ponto por instrução
- [ ] Nenhuma abreviação fora de `i`/`j` e acrônimos ubíquos
- [ ] Nenhum arquivo de classe acima de 50 linhas
- [ ] Nenhum getter ou setter trivial
- [ ] Nenhum cliente perguntando estado para decidir a ação

## Troubleshooting

### Removi o `else` e apareceram cinco `return` espalhados

**Causa:** guard clauses viraram saídas antecipadas espalhadas pelo corpo, o que a rule
060 sinaliza como spaghetti.
**Solução:** guards ficam no topo, validando pré-condições. Se há saída no meio da lógica,
o método está fazendo mais de uma coisa — extraia.

### Encapsular o primitivo criou uma classe anêmica

**Causa:** o Value Object virou um invólucro com getter, sem comportamento.
**Solução:** mova para dentro dele a lógica que hoje mora nos clientes — formatação,
comparação, validação. Se não há nenhuma, o primitivo não era de domínio.

### A classe caiu abaixo de 50 linhas mas virou três classes que só se chamam

**Causa:** divisão por linha, não por responsabilidade — cria Middle Man e Poltergeists.
**Solução:** dividir por razão-para-mudar. Ver a skill `anti-pattern`.

## Referências

- `references/rule-01…rule-09` — cada regra com sintoma, refatoração e exemplo.

## Rules relacionadas

- [001 — Nível Único de Indentação](../../rules/001_nivel-unico-indentacao.md)
- [002 — Proibição da Cláusula ELSE](../../rules/002_proibicao-clausula-else.md)
- [003 — Encapsulamento de Primitivos](../../rules/003_encapsulamento-primitivos.md)
- [004 — Coleções de Primeira Classe](../../rules/004_colecoes-primeira-classe.md)
- [005 — Restrição de Encadeamento de Chamadas](../../rules/005_maximo-uma-chamada-por-linha.md)
- [006 — Proibição de Nomes Abreviados](../../rules/006_proibicao-nomes-abreviados.md)
- [007 — Limite Máximo de Linhas por Classe](../../rules/007_limite-maximo-linhas-classe.md)
- [008 — Proibição de Getters/Setters](../../rules/008_proibicao-getters-setters.md)
- [009 — Diga, Não Pergunte](../../rules/009_diga-nao-pergunte.md)

## Skills relacionadas

- [solid](../solid/SKILL.md): complements — SOLID governa entre classes; Calisthenics, dentro delas.
- [complexity](../complexity/SKILL.md): reinforces — as regras 1 e 2 são o caminho direto para CC ≤ 5.
- [clean-code](../clean-code/SKILL.md): reinforces — Calisthenics é um subconjunto disciplinado do Clean Code.
- [getter](../getter/SKILL.md): complements — quando um getter se justifica apesar da regra 8.
- [setter](../setter/SKILL.md): complements — quando um setter se justifica apesar da regra 8.
- [enum](../enum/SKILL.md): reinforces — forma concreta de encapsular primitivos de domínio.

---

**Criado em**: 2026-04-01
**Atualizado em**: 2026-08-09
**Versão**: 2.0
