# §11 — Technical Risks

**Section:** 11 de 12
**Audience:** Técnico (tech lead, arquiteto) e Gestão (para visibilidade de riscos)
**When to update:** Ao identificar novo risco, ao mitigar risco existente, ao revisar impacto após incidente.

---

## Purpose

Esta seção documenta os riscos técnicos identificados: o que pode dar errado, qual o impacto potencial, qual a probabilidade, e quais são as estratégias de mitigação. Riscos documentados são gerenciáveis — riscos não documentados são surpresas.

## Template

```markdown
# §11 — Technical Risks

## Registro de Riscos

| ID | Risco | Probabilidade | Impacto | Score | Status | Mitigação |
|----|-------|---------------|---------|-------|--------|-----------|
| R-01 | [Descrição do risco] | Alta / Média / Baixa | Alto / Médio / Baixo | [P × I] | Aberto / Mitigado / Aceito | [Ação de mitigação] |

**Score** = Probabilidade × Impacto (3×3 = Alto × Alto = 9; 1×1 = Baixo × Baixo = 1)

## Detalhamento dos Riscos Críticos (Score ≥ 6)

### R-01 — [Nome do Risco]

**Descrição:** [Descrever o risco em detalhes: o que pode acontecer, em qual condição.]

**Probabilidade:** [Alta / Média / Baixa] — [Justificativa]

**Impacto:** [Alto / Médio / Baixo] — [O que seria afetado: usuários, dados, disponibilidade, segurança]

**Sintomas de que está acontecendo:**
- [Sintoma 1 — ex: latência aumentando consistentemente]
- [Sintoma 2 — ex: erros 5xx no log]

**Estratégia de Mitigação:**
- [Ação 1 — ex: circuit breaker para sistemas externos]
- [Ação 2 — ex: retry com backoff exponencial]
- [Ação 3 — ex: fallback para cache em caso de indisponibilidade]

**Plano de Contingência (se o risco se materializar):**
- [Passo 1 — ex: ativar modo degradado]
- [Passo 2 — ex: notificar stakeholders em < 15 min]
- [Passo 3 — ex: rollback para versão anterior]

**Owner:** [Quem é responsável por monitorar e mitigar]
**Revisão:** [Data da última revisão]

---

### R-02 — [Nome do Risco]

[Mesmo formato acima]

## Riscos por Categoria

### Riscos de Infraestrutura

| ID | Risco | Score | Mitigação Principal |
|----|-------|-------|---------------------|
| R-01 | [ex: Indisponibilidade do provedor cloud] | 6 | [ex: Multi-region failover] |
| R-02 | [ex: Limite de rate do banco de dados edge] | 4 | [ex: Cache em KV Store] |

### Riscos de Dependências Externas

| ID | Risco | Score | Mitigação Principal |
|----|-------|-------|---------------------|
| R-03 | [ex: API de terceiro com breaking change] | 6 | [ex: Adapter pattern + versão pinada] |
| R-04 | [ex: Serviço de email fora do ar] | 4 | [ex: Queue + retry + fallback SMTP] |

### Riscos de Segurança

| ID | Risco | Score | Mitigação Principal |
|----|-------|-------|---------------------|
| R-05 | [ex: Vazamento de secrets em repositório] | 9 | [ex: git-secrets hook + secret scanning CI] |
| R-06 | [ex: SQL injection via input não validado] | 8 | [ex: Zod validation + prepared statements] |

### Riscos de Qualidade / Manutenibilidade

| ID | Risco | Score | Mitigação Principal |
|----|-------|-------|---------------------|
| R-07 | [ex: Cobertura de testes abaixo de 85%] | 4 | [ex: Gate de cobertura no CI] |
| R-08 | [ex: Débito técnico acumulado] | 4 | [ex: Regra 039 — Boy Scout + code review] |
```

## Conventions

- Score = Probabilidade (1-3) × Impacto (1-3); score ≥ 6 exige plano de contingência detalhado
- Riscos aceitos devem ter justificativa explícita de por que não serão mitigados
- Revisão obrigatória a cada sprint/iteração para riscos com score ≥ 6
- Incidentes em produção devem gerar novo risco ou atualizar score de risco existente

## Related to

- [10_quality_requirements.md](10_quality_requirements.md): complementa — falhas nos cenários de qualidade geram riscos
- [09_architecture_decisions.md](09_architecture_decisions.md): complementa — ADRs de mitigação referenciam riscos aqui documentados
- [rule 027 Erros de Domínio](../../../rules/027_qualidade-tratamento-erros-dominio.md): complementa — tratamento correto de erros mitiga riscos de runtime
- [rule 032 Cobertura de Testes](../../../rules/032_cobertura-teste-minima-qualidade.md): complementa — cobertura insuficiente é risco de qualidade

---

**Arc42 Section:** §11
**Source:** arc42.org — arc42 Template, adaptado para pt-BR
