# §10 — Quality Requirements

**Section:** 10 de 12
**Audience:** Todos (gestão para quality tree; técnico para métricas e cenários)
**When to update:** Ao revisar RNFs de §1, ao adicionar novo atributo de qualidade, ao mudar meta de cobertura ou SLA.

---

## Purpose

Esta seção detalha os requisitos de qualidade do sistema usando quality tree (árvore de qualidade) e cenários de qualidade mensuráveis. Enquanto §1 lista os RNFs em alto nível, §10 os detalha com critérios objetivos, métricas de medição e estratégias arquiteturais para atingi-los.

## Template

```markdown
# §10 — Quality Requirements

## Quality Tree (Árvore de Qualidade)

```
Qualidade do Sistema
├── Performance
│   ├── Tempo de resposta (p95 < 200ms)
│   └── Throughput (> 1000 req/s no edge)
├── Disponibilidade
│   ├── Uptime (> 99,9%)
│   └── MTTR (< 30 min)
├── Manutenibilidade
│   ├── Cobertura de testes (≥ 85% domínio)
│   ├── Complexidade ciclomática (≤ 5 por método)
│   └── Linhas por classe (≤ 50)
├── Segurança
│   ├── Autenticação (100% endpoints protegidos)
│   └── Vulnerabilidades (zero CVSS ≥ 7)
└── Observabilidade
    ├── Logs estruturados (100% requests logados)
    └── Alertas (< 5 min para detectar erro 5xx)
```

## Cenários de Qualidade

### Performance

| ID | Cenário | Estímulo | Resposta Esperada | Métrica | Como Medir |
|----|---------|----------|-------------------|---------|------------|
| Q-P01 | Requisição API em carga normal | 100 req/s simultâneas | Resposta < 200ms (p95) | p95 latência | k6 / Grafana |
| Q-P02 | Requisição API em pico | 1000 req/s simultâneas | Resposta < 500ms (p99) | p99 latência | k6 load test |
| Q-P03 | Cold start do worker | Primeiro request após inatividade | < 50ms de inicialização | Cold start time | CF Analytics |

### Disponibilidade

| ID | Cenário | Estímulo | Resposta Esperada | Métrica | Como Medir |
|----|---------|----------|-------------------|---------|------------|
| Q-D01 | Disponibilidade mensal | Monitoramento contínuo | > 99,9% uptime | Uptime % | Uptime Robot |
| Q-D02 | Recuperação de falha | Processo reinicia após crash | < 30 min de downtime | MTTR | Incident log |

### Manutenibilidade

| ID | Cenário | Meta | Ferramenta | Frequência |
|----|---------|------|------------|------------|
| Q-M01 | Cobertura de testes — domínio | ≥ 85% linha | Bun test --coverage | A cada PR |
| Q-M02 | Cobertura de testes — geral | ≥ 80% linha | Bun test --coverage | A cada PR |
| Q-M03 | Complexidade ciclomática | ≤ 5 por método | Biome / SonarQube | A cada PR |
| Q-M04 | Linhas por classe | ≤ 50 linhas | Biome / lint | A cada PR |
| Q-M05 | Parâmetros por função | ≤ 3 | Biome / lint | A cada PR |

### Segurança

| ID | Cenário | Meta | Ferramenta | Frequência |
|----|---------|------|------------|------------|
| Q-S01 | Scan de vulnerabilidades | Zero CVSS ≥ 7 | OWASP ZAP / Snyk | Semanal |
| Q-S02 | Cobertura de autenticação | 100% endpoints protegidos | Teste de integração | A cada PR |
| Q-S03 | Secrets no código | Zero ocorrências | git-secrets / trufflehog | A cada commit |

## Métricas de Qualidade em Dashboard

| Métrica | Meta | Atual | Tendência |
|---------|------|-------|-----------|
| Cobertura domínio | ≥ 85% | [N/A — preencher] | — |
| Uptime | > 99,9% | [N/A — preencher] | — |
| p95 latência | < 200ms | [N/A — preencher] | — |
| Issues críticos | 0 | [N/A — preencher] | — |
```

## Conventions

- Cada atributo de qualidade deve ter ao menos um cenário com métrica objetiva
- Métricas devem ser verificáveis em CI/CD — não apenas manual
- Quality tree deve refletir os RNFs de §1 (nada novo que não esteja em §1)
- Cenários de segurança são obrigatórios mesmo em projetos internos

## Related to

- [01_introduction_and_goals.md](01_introduction_and_goals.md): depende — quality tree deriva dos RNF de §1
- [11_technical_risks.md](11_technical_risks.md): complementa — falhas nos cenários de qualidade viram riscos em §11
- [rule 032 Cobertura de Testes](../../../rules/032_cobertura-teste-minima-qualidade.md): complementa — meta de 85% é regra obrigatória
- [rule 022 Simplicidade e Clareza](../../../rules/022_priorizacao-simplicidade-clareza.md): complementa — complexidade ciclomática ≤ 5

---

**Arc42 Section:** §10
**Source:** arc42.org — arc42 Template, adaptado para pt-BR
