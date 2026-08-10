---
name: quality
model: opus
description: Modelo de Qualidade McCall — 12 fatores em três dimensões (Operação, Revisão, Transição) com sistema de pontuação de 1 a 5, usado para calibrar a severidade de uma violação e decidir se ela bloqueia ou não. Use ao revisar código e precisar decidir "isso bloqueia o merge?", ao definir critérios de aceitação de uma feature, ao priorizar cobertura de testes, ou ao justificar por que uma violação é crítica e outra é sugestão. Não use como substituto das rules — é a camada de calibração de severidade sobre elas.
---

# Software Quality (McCall)

## O que é

O modelo McCall organiza 12 fatores de qualidade em três dimensões: **Operação** (como
o software se comporta em uso), **Revisão** (quão fácil é modificá-lo) e **Transição**
(quão bem ele se move entre ambientes).

Aqui ele tem um papel específico: as 70 rules dizem *o que* está errado; McCall diz
*quanto isso importa*. É o que separa "refatorar depois" de "não passa".

## Quando usar

| Situação | Ação |
|---|---|
| Violação encontrada, severidade incerta | Identificar o fator impactado e calibrar |
| Definindo critérios de aceitação | Especificar a pontuação mínima esperada por fator |
| Priorizando testes | Cobrir primeiro Correctness, Reliability, Integrity, Testability |
| Decidindo se um PR entra | Rejeitar o que degrada fator crítico |
| Escolhendo o que refatorar | Atacar fatores com pontuação abaixo de 3 |

Não use para *encontrar* problemas — para isso são as rules e a skill `anti-pattern`.
McCall entra depois, para pesar o que já foi encontrado.

## Como aplicar

### 1. Identificar o fator impactado

| Sintoma no code review | Fator |
|---|---|
| Bug de lógica, caso extremo não tratado | Correctness |
| Promise sem `.catch()`, erro engolido | Reliability |
| Loop O(n²) desnecessário, N+1 | Efficiency |
| `eval`, segredo hardcoded, XSS | **Integrity** |
| Mensagem de erro genérica, sem feedback | Usability |
| Timeout hardcoded, texto sem i18n | Adaptability |
| Classe god, método longo, sem logs | Maintainability |
| `switch` que só cresce, `new Concreto()` em service | Flexibility |
| Dependência concreta interna, singleton | Testability |
| Path absoluto, comando de shell específico | Portability |
| Código duplicado, componente específico demais | Reusability |
| Formato proprietário, API sem versão | Interoperability |

### 2. Pontuar de 1 a 5

| Nota | Significado | Ação |
|---|---|---|
| 5 | Excelente | Manter |
| 4 | Bom | Melhoria opcional |
| 3 | Adequado | Considerar refatoração |
| 2 | Problemático | Refatoração recomendada |
| 1 | Crítico | Refatoração obrigatória |

```
Pontuação geral = Σ(12 fatores) / 12

≥ 4.0   🟢 alta qualidade
3.0–3.9 🟡 aceitável
2.0–2.9 🟠 baixa
< 2.0   🔴 crítica — refatoração urgente
```

### 3. Aplicar os bloqueios inegociáveis

- **Integrity** é sempre bloqueador. Não existe "corrigimos depois" para segurança.
- **Testability** abaixo de 2 impede o merge — código não testável não pode ser mantido.
- **Correctness** abaixo de 3 impede o merge — não faz o que deveria.
- **Reliability** abaixo de 3 impede o merge — erros não tratados.

### Os 12 fatores

| Fator | Dimensão | Pergunta | Severidade padrão | Detalhe |
|---|---|---|---|---|
| Correctness | Operação | Faz o esperado? | 🔴 | [correctness.md](references/correctness.md) |
| Reliability | Operação | É preciso e resiliente? | 🔴 | [reliability.md](references/reliability.md) |
| Efficiency | Operação | É performático? | 🟠 | [efficiency.md](references/efficiency.md) |
| Integrity | Operação | É seguro? | 🔴 | [integrity.md](references/integrity.md) |
| Usability | Operação | É fácil de usar? | 🟡 | [usability.md](references/usability.md) |
| Adaptability | Operação | É configurável? | 🟠 | [adaptability.md](references/adaptability.md) |
| Maintainability | Revisão | É fácil de corrigir? | 🟠 | [maintainability.md](references/maintainability.md) |
| Flexibility | Revisão | É fácil de mudar? | 🟠 | [flexibility.md](references/flexibility.md) |
| Testability | Revisão | É testável? | 🔴 | [testability.md](references/testability.md) |
| Portability | Transição | É portável? | 🟡 | [portability.md](references/portability.md) |
| Reusability | Transição | É reutilizável? | 🟠 | [reusability.md](references/reusability.md) |
| Interoperability | Transição | Integra bem? | 🟠 | [interoperability.md](references/interoperability.md) |

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Integrity — segredo no ambiente vs. no código | [integrity.valid.js](examples/integrity.valid.js) | [integrity.invalid.js](examples/integrity.invalid.js) |
| Testability — dependência injetada vs. instanciada dentro | [testability.valid.js](examples/testability.valid.js) | [testability.invalid.js](examples/testability.invalid.js) |

Calibração na prática: um método de 25 linhas viola a rule 055. Se ele está num
utilitário estável e coberto por testes, o fator impactado é Maintainability (🟠) — vira
comentário de review. Se está no caminho de autenticação, o fator é Integrity (🔴) — vira
bloqueio. Mesma violação, severidades diferentes.

## Checklist

- [ ] Nenhum fator crítico (Correctness, Reliability, Integrity, Testability) abaixo de 3
- [ ] Integrity avaliado explicitamente, mesmo quando a mudança "não é de segurança"
- [ ] Pontuação geral ≥ 3.0
- [ ] A severidade atribuída à violação foi justificada pelo fator, não pelo gosto
- [ ] Fatores abaixo de 3 registrados com codetag rastreável

## Troubleshooting

### Tudo vira crítico e nada passa

**Causa:** severidade sendo atribuída pela rule violada, não pelo fator impactado no
contexto real.
**Solução:** a mesma violação tem pesos diferentes conforme onde está. Perguntar qual
dos 12 fatores degrada de fato, e quanto.

### A pontuação geral está boa mas o código é ruim

**Causa:** a média esconde um fator crítico em 1. A média não é o critério — os
bloqueios inegociáveis são.
**Solução:** verificar os quatro fatores críticos individualmente antes de olhar a média.

## Referências

- `references/*.md` — um arquivo por fator, com sintomas, métricas e o que melhora a nota.

Fontes: McCall, Richards & Walters, "Factors in Software Quality" (1977);
ISO/IEC 25010:2011 (SQuaRE).

## Rules relacionadas

- [032 — Cobertura Mínima de Teste e Qualidade](../../rules/032_cobertura-teste-minima-qualidade.md): Testability tem piso mensurável de 85%.
- [030 — Proibição de Funções Inseguras](../../rules/030_proibicao-funcoes-inseguras.md): o núcleo de Integrity.
- [027 — Qualidade no Tratamento de Erros](../../rules/027_qualidade-tratamento-erros-dominio.md) e [028 — Exceção Assíncrona](../../rules/028_tratamento-excecao-assincrona.md): sustentam Reliability.
- [014 — Inversão de Dependência](../../rules/014_principio-inversao-dependencia.md): é o que torna Testability e Flexibility possíveis.
- [022 — Simplicidade e Clareza](../../rules/022_priorizacao-simplicidade-clareza.md) e [007 — Máximo de Linhas por Classe](../../rules/007_limite-maximo-linhas-classe.md): sustentam Maintainability.
- [042 — Configurações via Ambiente](../../rules/042_configuracoes-via-ambiente.md): sustenta Adaptability e Portability.

## Skills relacionadas

- [codetags](../codetags/SKILL.md): depends on — a severidade McCall define qual tag registra a pendência (Integrity → FIXME, Efficiency → OPTIMIZE).
- [cdd](../cdd/SKILL.md): complements — quantifica Maintainability e Testability via carga cognitiva.
- [anti-pattern](../anti-pattern/SKILL.md): depends on — encontra o problema que esta skill pesa.
- [complexity](../complexity/SKILL.md): reinforces — CC é a métrica objetiva por trás de Maintainability.

---

**Criado em**: 2026-04-01
**Atualizado em**: 2026-08-09
**Versão**: 2.0
