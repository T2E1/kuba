---
title: "Otimização Prematura (Premature Optimization)"
category: "Anti-Patterns"
type: reference
id: "BEHAVIORAL-012"
severity: "🟡 Medium"
tags: [anti-patterns]
---

# Otimização Prematura (Premature Optimization)

## Explanation

### O que é

Otimização Prematura ocorre quando o desenvolvedor otimiza código baseado em suspeita de lentidão, sem medir o problema real. Código legível e correto é sacrificado por ganho de performance hipotético. Donald Knuth: *"A otimização prematura é a raiz de todo mal."*

### Por que importa

- Complexidade acidental: código mais difícil de ler sem ganho mensurável
- Tempo desperdiçado: otimizações em código que não é gargalo não entregam valor
- Bugs introduzidos: código otimizado é mais frágil e difícil de corrigir
- Manutenção cara: otimizações prematuras são difíceis de desfazer depois

## How-to

### Como aplicar

- Seguir a sequência: fazer funcionar → fazer certo → fazer rápido
- Só otimizar depois de medir (profiling, benchmark, métricas de produção) que o trecho é de fato o gargalo

### Exemplo

```javascript
// ❌ Cache manual por "suspeita" de que seria lento
const _userCache = new Map();
function getUser(id) {
  if (_userCache.has(id)) return _userCache.get(id);
  const user = db.find(id);       // o banco já tem connection pool e cache de queries
  _userCache.set(id, user);        // cache sem invalidação, sem TTL, sem limite
  return user;
}

// ❌ Evitar Array.map porque "é mais lento que for loop"
// em um array de 20 elementos que roda uma vez por segundo
```

```javascript
// ✅ Fazer funcionar → Fazer certo → Fazer rápido
function getUser(id) {
  return db.find(id);
}

// Após medir e confirmar que é o gargalo:
// const getUser = memoize(db.find.bind(db), { ttl: 60_000, max: 500 });
```

Codetag sugerido:

```typescript
// FIXME: Premature Optimization — cache manual sem evidência de necessidade
// TODO: Remover cache; adicionar apenas se profiling mostrar gargalo real
```

## Reference

### Critérios Objetivos

- [ ] Otimização implementada sem medição prévia (profiling, benchmark, métricas de produção)
- [ ] Algoritmo complexo onde [O(n²)](../skills/big-o/SKILL.md) seria imperceptível no volume real de dados
- [ ] Cache manual em camadas que já possuem caching nativo (ORM, banco de dados, HTTP)
- [ ] Micro-otimizações de linguagem (`for` vs `map`, `++i` vs `i++`) em código não-crítico
- [ ] Comentário justificando ilegibilidade com "é mais rápido" sem evidência

### Exceções Permitidas

- **Hotspots Comprovados**: Otimizações em código cuja lentidão foi identificada por profiling com dados reais de produção.
- **Algoritmos Canônicos**: Uso de algoritmos conhecidos (quicksort, busca binária) onde a escolha é padrão da indústria, não especulativa.

### Como Detectar

#### Manual

- Perguntar: "há uma medição provando que isso é um gargalo?" — se a resposta é não, é otimização prematura

#### Automático

- Sem regra nativa de Biome para detectar otimização prematura — identificar via code review (caches manuais, estruturas de dados incomuns sem profiling referenciado)

## Related to

- [Simplicity and Clarity (KISS)](../skills/clean-code/references/priorizacao-simplicidade-clareza.md): reinforces
- [Speculative Functionality (YAGNI)](../skills/clean-code/references/funcionalidade-especulativa.md): complements
- [025 — Clever Code](025_codigo-inteligente-clever-code.md): reinforces
- [013 — Overengineering](013_overengineering.md): complements
- [008 — Shared Mutable State](008_estado-mutavel-compartilhado.md): complements
- [Efficiency — Eficiência](../skills/quality/references/efficiency.md): contrasts — a otimização deve ser guiada por esta qualidade McCall medida, não por suspeita
- [PERF](../skills/codetags/references/PERF.md): complements — a codetag correta para marcar um ponto a otimizar somente após profiling
- [Big-O (Notação de Complexidade Algorítmica)](../skills/big-o/SKILL.md): reinforces — ferramenta para avaliar objetivamente se a otimização é necessária
