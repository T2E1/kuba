# Complexidade Ciclomática — Regras de Contagem

## O que é CC

Complexidade Ciclomática (CC) = número de caminhos de execução independentes em um método.
Fórmula: CC = E - N + 2 (arestas - nós + 2) ou simplesmente: 1 + número de pontos de decisão.

## Pontos de Decisão (+1 por ocorrência)

| Estrutura | Pontos | Exemplo |
|-----------|--------|---------|
| `if` | +1 | `if (condition)` |
| `else if` | +1 | `else if (condition)` |
| `for` | +1 | `for (let i = 0; ...)` |
| `for...of` | +1 | `for (const item of list)` |
| `for...in` | +1 | `for (const key in obj)` |
| `while` | +1 | `while (condition)` |
| `do...while` | +1 | `do { ... } while (condition)` |
| `case` em switch | +1 | `case 'value':` |
| `catch` | +1 | `catch (error)` |
| Ternário `?:` | +1 | `a ? b : c` |
| `&&` em condição | +1 | `if (a && b)` |
| `\|\|` em condição | +1 | `if (a \|\| b)` |

## Interpretação dos Limites

| CC | Status | Ação |
|----|--------|------|
| 1–5 | ✅ Dentro do limite | OK |
| 6–7 | ⚠️ Aviso | Considerar refatoração |
| 8–10 | 🟠 Alta — refatorar | Obrigatório (rule 022) |
| > 10 | 🔴 Crítica | Refatoração urgente |

## Exemplo de Contagem

```typescript
function process(x: number, y: string): string {  // CC = 1 (base)
  if (x > 0) {          // +1 = CC 2
    if (y === 'a') {    // +1 = CC 3
      return 'ok'
    } else if (y === 'b') { // +1 = CC 4
      return 'good'
    }
  } else {              // sem pontos extras
    for (let i = 0; i < x; i++) {  // +1 = CC 5
      if (i % 2 === 0) {           // +1 = CC 6 ← ACIMA DO LIMITE
        console.log(i)
      }
    }
  }
  return 'default'
}
```
