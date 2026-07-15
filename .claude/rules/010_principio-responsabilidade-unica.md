# Aplicação do Princípio da Responsabilidade Única (SRP)

**ID**: BEHAVIORAL-010
**Severity**: 🔴 Critical
**Category**: Behavioral

---

## What it is

Exige que uma classe ou módulo tenha apenas uma razão para mudar, o que implica que deve ter uma única responsabilidade.

## Why it matters

- Baixa coesão e alto acoplamento tornam classes frágeis e difíceis de testar
- Aumenta o custo de manutenção, pois uma mudança em uma área de negócio pode quebrar outra
- Dificulta isolar testes unitários por responsabilidade
- Sinaliza que a classe tem mais de uma razão para mudar

## Objective Criteria

- [ ] Uma classe não deve conter lógica de negócio e lógica de persistência (ex: *Service* e *Repository* juntos).
- [ ] O número de métodos públicos de uma classe não deve exceder **7**.
- [ ] O **Lack of Cohesion in Methods (LCOM)** deve ser inferior a 0.75.

## Allowed Exceptions

- **Classes de Utilidade/Helpers**: Classes estáticas que agrupam funções puras sem estado para manipulação de dados genéricos (ex: formatadores de data).

## How to Detect

### Manual

- Perguntar: "Se houver uma mudança no requisito X e no requisito Y, esta classe precisa ser alterada em ambas as situações?" (SRP violado se a resposta for sim)

### Automatic

- Biome: `complexity/noExcessiveCognitiveComplexity` (proxy para complexidade acumulada por responsabilidades misturadas). LCOM/WMC não têm regra nativa no Biome — avaliar via revisão de arquitetura

## Related to

- [007 - Maximum Lines per Class File](007_limite-maximo-linhas-classe.md): reinforces
- [004 - First-Class Collections](004_colecoes-primeira-classe.md): reinforces
- [011 - Open/Closed Principle (OCP)](011_principio-aberto-fechado.md): complements
- [025 - Prohibition of The Blob Anti-Pattern](025_proibicao-anti-pattern-the-blob.md): complements
- [021 - Prohibition of Logic Duplication (DRY)](021_proibicao-duplicacao-logica.md): reinforces
- [022 - Simplicity and Clarity (KISS)](022_priorizacao-simplicidade-clareza.md): reinforces
- [015 - Release-Reuse Equivalence Principle (REP)](015_principio-equivalencia-lancamento-reuso.md): reinforces

---

**Created on**: 2025-10-04
**Updated on**: 2026-07-15
**Version**: 1.1
