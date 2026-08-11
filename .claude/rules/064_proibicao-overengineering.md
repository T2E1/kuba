# Proibição de Overengineering

**ID**: STRUCTURAL-064
**Severity**: 🟡 Medium
**Category**: Structural

---

## What it is

Overengineering ocorre quando um desenvolvedor cria arquitetura ou código excessivamente complexos para requisitos simples. Padrões, abstrações, camadas e frameworks introduzidos "para o futuro" que complicam código sem trazer valor real. Abstração prematura em nome de "escalabilidade" ou "flexibilidade".

*(Engloba o anti-pattern Speculative Generality quando complexidade especulativa é introduzida em nível de arquitetura.)*

## Why it matters

- Sobrecarga cognitiva: desenvolvedores gastam tempo entendendo arquitetura em vez de domínio
- Tempo de desenvolvimento: construir features complexas leva mais tempo que soluções simples
- Dificuldade de manutenção: mudanças na arquitetura quebram muitas partes do código em cascata
- Desbalanceamento Concreto vs Abstração: sem problemas reais para abstrair, abstrações se tornam inventadas
- Requisitos funcionais simples (API REST, CRUD) raramente justificam microserviços, arquitetura orientada a eventos, containers DI complexos

## Objective Criteria

- [ ] Introduzir padrão sem problema claro sendo resolvido (ex: padrão Strategy sem variação de algoritmos)
- [ ] Criar interfaces/classes para "escalabilidade futura" sem requisitos de negócio documentados
- [ ] Múltiplas camadas de abstração quando camada única seria suficiente (ex: service chamando service chamando service)
- [ ] Uso de framework (DI, ORM, event bus) para operações CRUD triviais
- [ ] Excesso de generalidade: código genérico parametrizado em vez de código específico de domínio

## Allowed Exceptions

- **Código de Framework**: Generalidade exigida por natureza, para suportar múltiplos consumidores.
- **Bibliotecas de Flexibilidade**: Onde a flexibilidade é a preocupação primária — framework de UI, ORM.
- **Decisão Arquitetural Documentada**: Complexidade justificada por decisão de arquitetura registrada.
- **Crescimento Acelerado**: Onde o investimento antecipado em arquitetura já se paga pelo ritmo de crescimento.

## How to Detect

### Manual

- Code review: perguntar "que problema concreto isso resolve?" para cada abstração/framework introduzido
- Buscar funcionalidades "para o futuro" sem timeline ou requisitos definidos
- Identificar código onde adicionar campo simples requer mapear config, interfaces, DTOs, services, repositories

### Automatic

- Sem regra nativa de Biome para detectar abstrações com baixo uso — avaliar via revisão de arquitetura

## Related to

- [023 - Prohibition of Speculative Functionality (YAGNI)](023_proibicao-funcionalidade-especulativa.md): reinforces
- [022 - Simplicity and Clarity (KISS)](022_priorizacao-simplicidade-clareza.md): reinforces
- [010 - Single Responsibility Principle (SRP)](010_principio-responsabilidade-unica.md): complements
- [016 - Common Closure Principle (CCP)](016_principio-fechamento-comum.md): reinforces
- [069 - Prohibition of Premature Optimization](069_proibicao-otimizacao-prematura.md): complements

---

**Created on**: 2026-03-28
**Updated on**: 2026-08-10
**Version**: 1.3
