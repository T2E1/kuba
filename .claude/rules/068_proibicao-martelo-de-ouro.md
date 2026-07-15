# Proibição do Martelo de Ouro

**ID**: AP-06-068
**Severity**: 🟡 Medium
**Category**: Structural

---

## What it is

Golden Hammer ocorre quando um desenvolvedor ou time aplica a mesma ferramenta, padrão ou tecnologia para todos os problemas, independentemente da adequação. Como o ditado "para um homem com um martelo, tudo parece um prego", isso define o viés de usar a mesma solução universal (o martelo de ouro) em todos os contextos.

## Why it matters

- Soluções subótimas: usar ferramenta errada para problema específico, criando over-engineering ou under-engineering
- Dificuldade de evolução: quando problema muda, ainda usando mesmo "martelo de ouro" mesmo que inadequado
- Falta de inovação mental: time para de aprender novas ferramentas; se apega ao conteúdo conhecido
- Débito técnico acumula: soluções universais são frequentemente complexas quando aplicadas onde simples ajudaria
- Frustra time técnico: desenvolvedores experientes veem ferramentas erradas sendo usadas

## Objective Criteria

- [ ] Mesma ferramenta/padrão aplicado em 3+ contextos significativamente diferentes
- [ ] Rejeição de alternativas com "sempre usamos X" sem justificativa
- [ ] Uso de padrão de microserviço em sistemas onde monolito único seria suficiente
- [ ] Uso de banco de dados NoSQL em sistemas fortemente relacionais ou vice-versa
- [ ] Framework/biblioteca event-bus em sistemas com operação síncrona simples

## Allowed Exceptions

- Padrões padrão impostos por compliance/regulação (ex: frameworks de segurança)
- Stack tecnológico company-wide onde variância traria maior custo de manutenibilidade
- Bibliotecas/frameworks conhecidos e battle-tested onde investir em risco de nova tecnologia é alto

## How to Detect

### Manual

- Code review: questionar "esta é a melhor ferramenta para este problema?" para cada escolha tecnológica
- Buscar padrões repetidos em domínios diferentes: mesmo ORM usado para KV store, search engine, DB relacional
- Identificar arquiteturas onde cada feature mesmo pequena usa mesmo padrão complexo (event bus para tudo, microservice para tudo)

### Automatic

- Sem regra nativa de Biome para detectar aplicação repetida de padrão arquitetural — avaliar via revisão de arquitetura

## Related to

- [014 - Dependency Inversion Principle (DIP)](014_principio-inversao-dependencia.md): reinforces
- [064 - Prohibition of Overengineering](064_proibicao-overengineering.md): reinforces
- [022 - Simplicity and Clarity (KISS)](022_priorizacao-simplicidade-clareza.md): reinforces
- [016 - Common Closure Principle (CCP)](016_principio-fechamento-comum.md): reinforces

---

**Created on**: 2026-03-28
**Updated on**: 2026-07-15
**Version**: 1.1
