# Princípio de Abstrações Estáveis (SAP)

**ID**: STRUCTURAL-020
**Severity**: 🔴 Critical
**Category**: Structural

---

## What it is

Um pacote deve ser o mais abstrato possível (possuir interfaces) se for estável, e o mais concreto possível se for instável.

## Why it matters

- Liga a estabilidade do pacote (SDP) à sua abstração (DIP)
- Um módulo altamente estável mas concreto impede extensão sem modificação
- Um módulo instável mas abstrato atrasa a implementação sem ganho real
- Ajuda a decidir onde investir em interfaces versus onde manter implementação direta

## Objective Criteria

- [ ] A **Abstração** do pacote (A), calculada como (Total de Abstrações / Total de Classes), deve ser **alta** (próxima de 1) se a sua **Instabilidade (I)** for baixa (próxima de 0).
- [ ] A distância do pacote à *Main Sequence* (D) no plano A/I não deve ser maior que **0.1** (D = |A + I - 1|).
- [ ] Pacotes de alto nível (política) devem ter mais de **60%** de classes abstratas ou interfaces.

## Allowed Exceptions

- **Pacotes de Dados Puros**: Módulos que contêm apenas *Value Objects* ou DTOs e não são projetados para polimorfismo (A e I podem ser baixos).

## How to Detect

### Manual

- Identificar um módulo de negócio importante (estável) que é composto apenas por classes concretas

### Automatic

- Sem regra nativa de Biome para cálculo de abstração/distância de pacote — usar ferramenta dedicada de métricas de arquitetura

## Related to

- [014 - Dependency Inversion Principle (DIP)](014_principio-inversao-dependencia.md): reinforces
- [019 - Stable Dependencies Principle (SDP)](019_principio-dependencias-estaveis.md): complements
- [012 - Liskov Substitution Principle (LSP)](012_principio-substituicao-liskov.md): reinforces
- [011 - Open/Closed Principle (OCP)](011_principio-aberto-fechado.md): reinforces

---

**Created on**: 2025-10-04
**Updated on**: 2026-07-15
**Version**: 1.1
