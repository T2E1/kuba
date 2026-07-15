# Regra do Escoteiro Aplicada à Refatoração Contínua

**ID**: BEHAVIORAL-039
**Severity**: 🟡 Medium
**Category**: Behavioral

---

## What it is

Obriga o desenvolvedor a **sempre deixar o código melhor do que o encontrou** (*Boy Scout Rule*). Mesmo que uma alteração seja pequena, o desenvolvedor deve aproveitar a oportunidade para corrigir pequenos *code smells* próximos ao local de trabalho.

## Why it matters

- Incentiva a refatoração contínua e emergente
- Previne a acumulação de débito técnico pequeno ao longo do tempo
- É chave para manter a manutenibilidade a longo prazo
- Reduz a incidência de anti-patterns como The Blob, que crescem por negligência acumulada

## Objective Criteria

- [ ] Pequenos *code smells* (ex: nomes de variáveis ruins, *guard clause* ausente) encontrados no escopo de alteração devem ser corrigidos.
- [ ] Arquivos que estão sendo modificados e violam `STRUCTURAL-022` (Complexidade Ciclomática > 5) devem ser refatorados para um nível menor.
- [ ] O *diff* do *Pull Request* deve mostrar melhorias de qualidade, mesmo que não solicitadas.

## Allowed Exceptions

- **Alterações de Emergência**: *Hotfixes* críticos em produção onde o risco de refatoração excede o ganho de qualidade imediato.

## How to Detect

### Manual

- Code review: verificar se o desenvolvedor apenas corrigiu o bug, ou se melhorou a qualidade do código circundante

### Automatic

- Análise de commits (`git log`): verificar se a refatoração está sendo feita em pequenas doses

## Related to

- [022 - Simplicity and Clarity (KISS)](022_priorizacao-simplicidade-clareza.md): reinforces
- [025 - Prohibition of The Blob Anti-Pattern](025_proibicao-anti-pattern-the-blob.md): complements

---

**Created on**: 2025-10-08
**Updated on**: 2026-07-15
**Version**: 1.1
