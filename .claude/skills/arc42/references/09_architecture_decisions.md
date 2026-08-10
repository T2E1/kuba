# §9 — Architecture Decisions

**Section:** 9 de 12
**Audience:** Técnico (tech lead, arquiteto, dev sênior)
**When to update:** Ao tomar qualquer decisão arquitetural significativa; ao revogar ou substituir uma decisão anterior.

---

## Purpose

Esta seção é o índice central de todos os ADRs (Architecture Decision Records) do projeto. Não contém o conteúdo das decisões — esse conteúdo vive nos arquivos individuais em `docs/adr/`. Esta seção organiza, categoriza e provê rastreabilidade entre decisões e as seções Arc42 que motivaram ou foram afetadas por elas.

## Template

```markdown
# §9 — Architecture Decisions

## Índice de ADRs

| ID | Título | Status | Data | Seção Arc42 Relacionada |
|----|--------|--------|------|-------------------------|
| [ADR-001](../../../docs/adr/ADR-001_[titulo].md) | [Título da decisão] | Aceito | YYYY-MM-DD | §4 Estratégia |
| [ADR-002](../../../docs/adr/ADR-002_[titulo].md) | [Título da decisão] | Aceito | YYYY-MM-DD | §2 Restrições |
| [ADR-003](../../../docs/adr/ADR-003_[titulo].md) | [Título da decisão] | Substituído por ADR-007 | YYYY-MM-DD | §7 Deployment |
| [ADR-004](../../../docs/adr/ADR-004_[titulo].md) | [Título da decisão] | Em revisão | YYYY-MM-DD | §8 Concepts |

## ADRs por Categoria

### Tecnologia e Plataforma

| ADR | Decisão | Status |
|-----|---------|--------|
| [ADR-001](../../../docs/adr/ADR-001.md) | [ex: Adoção de Cloudflare Workers como runtime] | Aceito |
| [ADR-002](../../../docs/adr/ADR-002.md) | [ex: Uso de D1 como banco de dados principal] | Aceito |

### Arquitetura e Estrutura

| ADR | Decisão | Status |
|-----|---------|--------|
| [ADR-003](../../../docs/adr/ADR-003.md) | [ex: Vertical Slice Architecture como padrão estrutural] | Aceito |
| [ADR-004](../../../docs/adr/ADR-004.md) | [ex: Repository pattern para acesso a dados] | Aceito |

### Qualidade e Processo

| ADR | Decisão | Status |
|-----|---------|--------|
| [ADR-005](../../../docs/adr/ADR-005.md) | [ex: Adoção de Biome para lint e format] | Aceito |
| [ADR-006](../../../docs/adr/ADR-006.md) | [ex: Cobertura mínima de 85% para domínio] | Aceito |

### Decisões Revogadas / Substituídas

| ADR | Decisão Original | Substituído Por | Motivo |
|-----|-----------------|-----------------|--------|
| [ADR-003](../../../docs/adr/ADR-003.md) | [Decisão original] | [ADR-NNN] | [Por que foi revogada] |

## Como Criar um Novo ADR

1. Copiar o template da skill ADR: `.claude/skills/adr/SKILL.md`
2. Criar arquivo em `docs/adr/ADR-NNN_titulo-kebab-case.md`
3. Preencher: Contexto, Decisão, Consequências, Alternativas consideradas
4. Adicionar linha na tabela acima com status "Em revisão"
5. Após revisão: mudar para "Aceito" ou "Rejeitado"
6. Referenciar o ADR na seção Arc42 afetada (§1 a §12)

## Status Possíveis de ADR

| Status | Significado |
|--------|-------------|
| **Proposto** | Em discussão, ainda não decidido |
| **Aceito** | Decisão tomada e em vigor |
| **Em revisão** | Sendo reavaliado por mudança de contexto |
| **Substituído** | Revogado — ver ADR substituto |
| **Rejeitado** | Avaliado e descartado |
| **Deprecado** | Válido mas não mais recomendado |
```

## Conventions

- Cada ADR tem ID sequencial: ADR-001, ADR-002...
- Título em kebab-case: `ADR-001_escolha-cloudflare-workers.md`
- Status sempre atualizado — ADR nunca é deletado, apenas marcado como substituído
- Todo ADR referencia pelo menos uma seção Arc42 que motivou a decisão

## Related to

- [docs/adr/](../../../docs/adr/): referencia — todos os ADRs individuais vivem neste diretório
- [04_solution_strategy.md](04_solution_strategy.md): complementa — cada decisão de §4 deve ter ADR correspondente
- [02_architecture_constraints.md](02_architecture_constraints.md): complementa — restrições de §2 motivam ADRs
- [11_technical_risks.md](11_technical_risks.md): complementa — riscos identificados podem gerar ADRs de mitigação

---

**Arc42 Section:** §9
**Source:** arc42.org — arc42 Template, adaptado para pt-BR
