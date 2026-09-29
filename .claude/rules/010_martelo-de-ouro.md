---
title: "Martelo de Ouro (Golden Hammer)"
category: "Anti-Patterns"
type: reference
id: "STRUCTURAL-010"
severity: "🟡 Medium"
tags: [anti-patterns]
---

# Martelo de Ouro (Golden Hammer)

## Explanation

### O que é

Golden Hammer ocorre quando um desenvolvedor ou time aplica a mesma ferramenta, padrão ou tecnologia para todos os problemas, independentemente da adequação. Como o ditado "para um homem com um martelo, tudo parece um prego" (Abraham Maslow), isso define o viés de usar a mesma solução universal em todos os contextos.

### Por que importa

- Soluções subótimas: usar ferramenta errada para problema específico, criando [013 — over-engineering](013_overengineering.md) ou under-engineering
- Dificuldade de evolução: quando problema muda, ainda usando mesmo "martelo de ouro" mesmo que inadequado
- Falta de inovação mental: time para de aprender novas ferramentas; se apega ao conteúdo conhecido
- Débito técnico acumula: soluções universais são frequentemente complexas quando aplicadas onde simples ajudaria
- Frustra time técnico: desenvolvedores experientes veem ferramentas erradas sendo usadas

## How-to

### Como aplicar

- Avaliar cada problema pela sua própria forma, não pela ferramenta que o time já domina
- Reservar a ferramenta familiar para os casos onde ela realmente é a mais adequada

### Exemplo

```javascript
// ❌ Usar Redis (cache distribuído) para armazenar config que muda uma vez por semana
const config = await redis.get('app:config');
// Solução superdimensionada: um arquivo JSON ou variável de ambiente resolveria

// ❌ Usar GraphQL para uma API com 2 endpoints simples
// porque "usamos GraphQL para tudo"
```

```javascript
// ✅ Solução proporcional ao problema (KISS + Ferramenta Certa para o Trabalho)
import config from './config.json'; // ou process.env.CONFIG

// ✅ REST simples para API simples
app.get('/users/:id', getUserHandler);
app.post('/users', createUserHandler);
```

Codetag sugerido:

```typescript
// FIXME: Golden Hammer — Redis para config estática (superdimensionado)
// TODO: Usar config.json ou variáveis de ambiente; reservar Redis para cache real
```

## Reference

### Critérios Objetivos

- [ ] Mesma ferramenta/padrão aplicado em 3+ contextos significativamente diferentes
- [ ] Rejeição de alternativas com "sempre usamos X" sem justificativa
- [ ] Uso de padrão de microserviço em sistemas onde monolito único seria suficiente
- [ ] Uso de banco de dados NoSQL em sistemas fortemente relacionais ou vice-versa
- [ ] Framework/biblioteca event-bus em sistemas com operação síncrona simples

### Exceções Permitidas

- **Imposição Regulatória**: Padrão imposto por compliance ou regulação.
- **Stack Corporativo**: Adotado em toda a empresa, onde a variação custaria mais manutenção.
- **Tecnologia Battle-Tested**: Solução consolidada onde o risco de trocar por novidade não se paga.

### Como Detectar

#### Manual

- Code review: questionar "esta é a melhor ferramenta para este problema?" para cada escolha tecnológica
- Buscar padrões repetidos em domínios diferentes: mesmo ORM usado para KV store, search engine, DB relacional
- Identificar arquiteturas onde cada feature mesmo pequena usa mesmo padrão complexo (event bus para tudo, microservice para tudo)

#### Automático

- Sem regra nativa de Biome para detectar aplicação repetida de padrão arquitetural — avaliar via revisão de arquitetura

## Related to

- [Dependency Inversion Principle (DIP)](../skills/solid/SKILL.md): reinforces
- [013 — Overengineering](013_overengineering.md): reinforces
- [Simplicity and Clarity (KISS)](../skills/clean-code/references/priorizacao-simplicidade-clareza.md): reinforces
- [Common Closure Principle (CCP)](../skills/package/SKILL.md): reinforces
- [Flexibility — Flexibilidade](../skills/quality/references/flexibility.md): contrasts — a ferramenta única aplicada fora de contexto reduz a flexibilidade real do sistema
- [Speculative Generality (YAGNI)](../skills/clean-code/references/funcionalidade-especulativa.md): complements — ambos introduzem solução desproporcional ao problema real
