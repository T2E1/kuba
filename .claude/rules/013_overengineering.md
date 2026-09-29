---
title: "Overengineering"
category: "Anti-Patterns"
type: reference
id: "STRUCTURAL-013"
severity: "🟡 Medium"
tags: [anti-patterns]
---

# Overengineering

## Explanation

### O que é

Overengineering ocorre quando um desenvolvedor cria arquitetura ou código excessivamente complexos para requisitos simples. Padrões, abstrações, camadas e frameworks introduzidos "para o futuro" que complicam código sem trazer valor real. Abstração prematura em nome de "escalabilidade" ou "flexibilidade".

*(Engloba o anti-pattern [Speculative Generality](../skills/clean-code/references/funcionalidade-especulativa.md) quando complexidade especulativa é introduzida em nível de arquitetura.)*

### Por que importa

- Sobrecarga cognitiva: desenvolvedores gastam tempo entendendo arquitetura em vez de domínio
- Tempo de desenvolvimento: construir features complexas leva mais tempo que soluções simples
- Dificuldade de manutenção: mudanças na arquitetura quebram muitas partes do código em cascata
- Desbalanceamento Concreto vs Abstração: sem problemas reais para abstrair, abstrações se tornam inventadas
- Requisitos funcionais simples (API REST, CRUD) raramente justificam microserviços, arquitetura orientada a eventos, containers DI complexos

## How-to

### Como aplicar

- Adicionar abstração apenas quando houver múltiplos casos reais, não hipotéticos (YAGNI + KISS)
- Ir direto ao ponto; refatorar para abstração quando a necessidade se comprovar

### Exemplo

```javascript
// ❌ Sistema de plugins para salvar um usuário no banco
class UserRepository {
  constructor(storageStrategy) { this.strategy = storageStrategy; }
  save(user) { return this.strategy.persist(user); }
}

class DatabaseStorageStrategy {
  constructor(adapterFactory) { this.adapter = adapterFactory.create(); }
  persist(user) { return this.adapter.execute('INSERT', user); }
}

// Nunca houve outro storage. Nunca haverá.
```

```javascript
// ✅ Direto ao ponto — refatorar quando a necessidade for real (YAGNI + KISS)
async function saveUser(user) {
  return db.users.create(user);
}

// Adicionar abstração apenas quando houver MÚLTIPLOS storages REAIS
```

Codetag sugerido:

```typescript
// FIXME: Overengineering — 4 camadas de abstração para simples db.create()
// TODO: Simplificar: usar db.users.create() diretamente até existir 2º storage
```

## Reference

### Critérios Objetivos

- [ ] Introduzir padrão sem problema claro sendo resolvido (ex: padrão [Strategy](../skills/gof/references/strategy.md) sem variação de algoritmos)
- [ ] Criar interfaces/classes para "escalabilidade futura" sem requisitos de negócio documentados
- [ ] Múltiplas camadas de abstração quando camada única seria suficiente (ex: service chamando service chamando service)
- [ ] Uso de framework (DI, ORM, event bus) para operações CRUD triviais
- [ ] Excesso de generalidade: código genérico parametrizado em vez de código específico de domínio

### Exceções Permitidas

- **Código de Framework**: Generalidade exigida por natureza, para suportar múltiplos consumidores.
- **Bibliotecas de Flexibilidade**: Onde a flexibilidade é a preocupação primária — framework de UI, ORM.
- **Decisão Arquitetural Documentada**: Complexidade justificada por decisão de arquitetura registrada.
- **Crescimento Acelerado**: Onde o investimento antecipado em arquitetura já se paga pelo ritmo de crescimento.

### Como Detectar

#### Manual

- Code review: perguntar "que problema concreto isso resolve?" para cada abstração/framework introduzido
- Buscar funcionalidades "para o futuro" sem timeline ou requisitos definidos
- Identificar código onde adicionar campo simples requer mapear config, interfaces, DTOs, services, repositories

#### Automático

- Sem regra nativa de Biome para detectar abstrações com baixo uso — avaliar via revisão de arquitetura

## Related to

- [Speculative Functionality (YAGNI)](../skills/clean-code/references/funcionalidade-especulativa.md): reinforces
- [Simplicity and Clarity (KISS)](../skills/clean-code/references/priorizacao-simplicidade-clareza.md): reinforces
- [Single Responsibility Principle (SRP)](../skills/solid/SKILL.md): complements
- [Common Closure Principle (CCP)](../skills/package/SKILL.md): reinforces
- [012 — Premature Optimization](012_otimizacao-prematura.md): complements
- [Strategy](../skills/gof/references/strategy.md): contrasts — padrão GoF legítimo quando existe variação real de algoritmo, mal aplicado quando não existe
- [Flexibility — Flexibilidade](../skills/quality/references/flexibility.md): contrasts — a flexibilidade especulativa buscada aqui raramente se realiza na prática
- [010 — Golden Hammer](010_martelo-de-ouro.md): complements — overengineering costuma nascer da reaplicação do mesmo framework complexo a todo problema
