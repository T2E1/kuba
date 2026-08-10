# CC_base — Complexidade Ciclomática

## Definição

CC_base mede **caminhos independentes de execução** via pontos de decisão no código.

## Fórmula

```
CC = (número de pontos de decisão) + 1
```

## Pontos de Decisão

| Estrutura | Incremento |
|---|---|
| `if`, `else if` | +1 |
| `for`, `while`, `do-while` | +1 |
| `case` em `switch` | +1 |
| `&&`, `||` em condições | +1 cada |
| `catch` em `try-catch` | +1 |
| `?` (operador ternário) | +1 |

## Conversão para ICP CC_base

| CC | ICP CC_base |
|----|-------------|
| ≤ 5 | 1 |
| 6–10 | 2 |
| 11–15 | 3 |
| 16–20 | 4 |
| > 20 | 5 |

## Exemplos

```javascript
// CC = 1 → ICP CC_base = 1
function add(a, b) {
  return a + b;
}

// CC = 4 → ICP CC_base = 1
function validateEmail(email) {
  if (!email) return false;           // +1
  if (!email.includes('@')) return false; // +1
  if (email.length < 5) return false; // +1
  return true;
}

// CC = 6 → ICP CC_base = 2
function getShippingCost(order) {
  if (!order.address) return null;    // +1
  if (order.total > 200) return 0;   // +1
  const base = order.isExpress       // +1
    ? 25
    : order.weight > 5               // +1
      ? 15
      : 10;
  return order.isInternational       // +1
    ? base * 2.5
    : base;
}
```

## Estratégias de Redução

1. **Extract Method** — mover condições para função nomeada
2. **Guard Clauses** — retornos antecipados linearizam fluxo
3. **Tabela de Dados** — substituir switch/if-else por lookup em objeto
