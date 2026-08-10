# Correctness — Corretude

**Dimensão:** Operação
**Severidade Padrão:** 🔴 Crítica
**Questão-Chave:** Faz o que foi pedido?

## O que é

O grau em que o software atende às suas especificações e cumpre os objetivos do usuário. Um software correto produz os resultados esperados para todas as entradas válidas e trata adequadamente os casos extremos.

## Indicadores de Problema

| Situação | Severidade |
|----------|-----------|
| Bug afeta dados do usuário | 🔴 Blocker |
| Bug afeta cálculos críticos (financeiros) | 🔴 Blocker |
| Bug em caso extremo raro | 🟠 Importante |
| Bug cosmético de UI | 🟡 Sugestão |

## Exemplo de Violação

```javascript
// ❌ Incorreto - não considera casos extremos
function calculateDiscount(price, quantity) {
  return price * quantity * 0.1; // E se quantity for 0 ou negativo?
}

// ✅ Correto - trata casos extremos
function calculateDiscount(price, quantity) {
  if (quantity <= 0) return 0;
  if (price <= 0) return 0;
  return price * quantity * 0.1;
}
```

## Codetags Sugeridas

```javascript
// FIXME: Divisão por zero quando items está vazio
// BUG: Comparação incorreta entre tipos — usar ===
```

## Calibração de Severidade

| Situação | Severidade |
|----------|-----------|
| Bug afeta dados do usuário | 🔴 Blocker |
| Bug afeta cálculos críticos | 🔴 Blocker |
| Bug em caso extremo raro | 🟠 Importante |
| Bug cosmético | 🟡 Sugestão |

## Regras Relacionadas

- 027 - Qualidade no Tratamento de Erros de Domínio
- 028 - Tratamento de Exceção Assíncrona
- 002 - Proibição da Cláusula ELSE
