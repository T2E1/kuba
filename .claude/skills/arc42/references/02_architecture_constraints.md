# §2 — Restrições Arquiteturais

**Section:** 2 de 12
**Audience:** Técnico (tech lead, arquiteto, dev sênior)
**When to update:** Ao iniciar o projeto, ao adotar nova tecnologia obrigatória ou ao identificar restrição organizacional relevante.

---

## Purpose

Esta seção documenta as restrições que limitam as opções de design arquitetural. Restrições não são preferências — são limites impostos por fatores externos (tecnologia, organização, legislação, time) que o arquiteto deve respeitar. Documentá-las evita decisões que ignoram limitações reais.

## Template

```markdown
# §2 — Restrições Arquiteturais

## Restrições Técnicas

| ID | Restrição | Origem | Impacto Arquitetural |
|----|-----------|--------|----------------------|
| RT-01 | [ex: O runtime é o navegador do consumidor] | [Decisão de produto] | [Sem passo de build obrigatório, sem API de Node] |
| RT-02 | [ex: Zero dependência de runtime no pacote publicado] | [Custo transferido ao consumidor] | [Só APIs da plataforma; nada de framework] |
| RT-03 | [ex: JavaScript puro; tipos só em `types.d.ts`] | [Padrão da equipe] | [Contrato público tipado sem obrigar build no consumidor] |
| RT-04 | [ex: Testes num navegador real, não em DOM emulado] | [As APIs usadas exigem] | [Suíte mais lenta; prova o que diz provar] |

## Restrições Organizacionais

| ID | Restrição | Origem | Impacto |
|----|-----------|--------|---------|
| RO-01 | [ex: Time de 2 devs em part-time] | [Headcount] | [Soluções simples preferidas, sem overhead operacional] |
| RO-02 | [ex: Sem budget para infraestrutura paga] | [Orçamento] | [npm público e GitHub Pages; CDN gratuito para os exemplos] |
| RO-03 | [ex: Deploys via CI/CD obrigatório — sem deploy manual] | [Segurança / processo] | [Exige pipeline configurado antes de qualquer entrega] |

## Conventions Obrigatórias

| Convenção | Descrição | Referência |
|-----------|-----------|------------|
| Regras 001–070 | Todas as 70 regras arquiteturais do .claude/rules/ são obrigatórias | [rules/](../../../rules/) |
| Path Aliases | Imports relativos com `../` são proibidos | [rule 031](../../../rules/031_restricao-imports-relativos.md) |
| Cobertura ≥ 85% | Domínio deve ter cobertura mínima de linha | [rule 032](../../../rules/032_cobertura-teste-minima-qualidade.md) |
| Estrutura de pacote | `packages/<categoria>/<nome>/` — um elemento por pasta | [colocation](../../colocation/SKILL.md) |

## Restrições Legais / Regulatórias

| ID | Restrição | Legislação | Impacto |
|----|-----------|------------|---------|
| RL-01 | [ex: Dados de usuário brasileiros não podem sair do Brasil] | [LGPD] | [Região de deploy: São Paulo] |
| RL-02 | [ex: Logs de auditoria por 5 anos] | [Compliance interno] | [Storage de logs imutável] |
```

## Conventions

- Cada restrição deve ter ID rastreável (RT-NN, RO-NN, RL-NN)
- Sempre documentar a origem da restrição (quem impôs e por quê)
- Distinguir restrição de preferência: restrição não pode ser negociada
- Restrições técnicas devem aparecer como critérios nas decisões de §4 e §9

## Related to

- [01_introduction_and_goals.md](01_introduction_and_goals.md): depende — objetivos de §1 geram parte das restrições
- [04_solution_strategy.md](04_solution_strategy.md): reforça — estratégia deve respeitar todas as restrições aqui listadas
- [09_architecture_decisions.md](09_architecture_decisions.md): complementa — ADRs devem referenciar restrições que motivaram a decisão
- [rule 031 Imports Relativos](../../../rules/031_restricao-imports-relativos.md): complementa
- [rule 041 Dependências Explícitas](../../../rules/041_declaracao-explicita-dependencias.md): complementa

---

**Arc42 Section:** §2
**Source:** arc42.org — arc42 Template, adaptado para pt-BR
