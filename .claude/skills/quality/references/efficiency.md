# Efficiency — Eficiência

**Dimensão:** Operação
**Severidade Padrão:** 🟠 Importante
**Questão-Chave:** Tem boa performance?

## O que é

A quantidade de recursos computacionais e código necessários para que o software execute suas funções. Eficiência engloba tempo de execução (CPU), uso de memória, consumo de banda e otimização de I/O.

## Indicadores de Problema

| Situação | Severidade |
|----------|-----------|
| Performance crítica (< 100ms exigidos) | 🔴 Blocker |
| Lista com 10k+ itens | 🟠 Importante |
| Lista com < 100 itens | 🟡 Sugestão |
| Código raramente executado | 🟡 Sugestão |

## Exemplo de Violação

```javascript
// ❌ Ineficiente - O(n²) desnecessário
function findDuplicates(items) {
  const duplicates = [];
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      if (items[i] === items[j]) {
        duplicates.push(items[i]);
      }
    }
  }
  return duplicates;
}

// ✅ Eficiente - O(n) com Set
function findDuplicates(items) {
  const seen = new Set();
  const duplicates = new Set();

  for (const item of items) {
    if (seen.has(item)) duplicates.add(item);
    seen.add(item);
  }

  return [...duplicates];
}
```

## Codetags Sugeridas

```javascript
// OPTIMIZE: Este loop O(n²) pode ser O(n) com Set
// PERFORMANCE: Consultas N+1 - considerar batch loading
```

## Calibração de Severidade

| Situação | Severidade |
|----------|-----------|
| Performance crítica (< 100ms exigidos) | 🔴 Blocker |
| Lista com 10k+ itens | 🟠 Importante |
| Lista com < 100 itens | 🟡 Sugestão |
| Código raramente executado | 🟡 Sugestão |

## Regras Relacionadas

- 022 - Priorização da Simplicidade e Clareza
- 001 - Nível Único de Indentação
- 055 - Limite Máximo de Linhas por Método
