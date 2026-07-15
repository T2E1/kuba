# Princípio de Dependências Estáveis (SDP)

**ID**: STRUCTURAL-019
**Severity**: 🟠 High
**Category**: Structural

---

## What it is

As dependências de um módulo devem apontar na direção da estabilidade. Módulos instáveis (que mudam muito) devem depender de módulos estáveis.

## Why it matters

- Módulos de alto nível (mais importantes para o negócio) acabam dependendo de módulos de baixo nível e voláteis
- Espalha mudanças de módulos voláteis para módulos que deveriam ser estáveis
- Reduz a testabilidade do módulo de alto nível
- Dificulta prever o impacto de uma mudança em módulos instáveis

## Objective Criteria

- [ ] A **instabilidade** do pacote (I), calculada como (Dependências de Saída / Total de Dependências), deve ser **menor** que 0.5.
- [ ] Módulos de política de negócio (alto nível) devem ter a Instabilidade mais baixa (próxima de 0).
- [ ] Pacotes mais utilizados (alto grau de estabilidade) não devem depender de pacotes com baixo grau de estabilidade (alto I).

## Allowed Exceptions

- **Boundary Elements**: Elementos na fronteira do sistema (ex: *Adapters*, *Controllers*) que, por natureza, são voláteis.

## How to Detect

### Manual

- Identificar a camada de alto nível (ex: *Domain*) importando classes concretas de camadas externas (ex: *Infrastructure*)

### Automatic

- Sem regra nativa de Biome para cálculo de instabilidade de pacote — usar ferramenta dedicada de métricas de arquitetura

## Related to

- [014 - Dependency Inversion Principle (DIP)](014_principio-inversao-dependencia.md): reinforces
- [018 - Acyclic Dependencies Principle (ADP)](018_principio-dependencias-aciclicas.md): complements
- [020 - Stable Abstractions Principle (SAP)](020_principio-abstracoes-estaveis.md): complements

---

**Created on**: 2025-10-04
**Updated on**: 2026-07-15
**Version**: 1.1
