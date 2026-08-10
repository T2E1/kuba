# Regra 1 — Single Indentation Level

**Regra deMGoncalves:** ESTRUTURAL-001
**Questão:** Este método tem mais de um nível de indentação após o escopo inicial?

## O que é

Limita a complexidade de um método ou função ao impor um único nível de indentação para blocos de código (condicionais, loops ou try-catch), forçando a extração de lógica em métodos separados.

## Quando Aplicar

- Método tem `if` dentro de `for`
- Método tem `for` dentro de `if`
- Método tem callbacks aninhados
- Complexidade Ciclomática > 5

## ❌ Violação

```typescript
class OrderProcessor {
  processOrders(orders: Order[]): void {
    for (const order of orders) {
      if (order.isValid()) {
        if (order.isPaid()) {
          // Três níveis de indentação - VIOLA
          this.shipOrder(order);
        }
      }
    }
  }
}
```

## ✅ Correto

```typescript
class OrderProcessor {
  processOrders(orders: Order[]): void {
    for (const order of orders) {
      this.processOrder(order);  // Um nível de indentação
    }
  }

  private processOrder(order: Order): void {
    if (!order.isValid()) return;  // Guard clause
    if (!order.isPaid()) return;   // Guard clause
    this.shipOrder(order);
  }
}
```

## Exceções

- **Try/Catch/Finally**: Tratamento de erro que não pode ser delegado
- **Guard Clauses**: Retornos antecipados não contam como novo nível

## Regras Relacionadas

- [002 - Proibição da Cláusula ELSE](rule-02-no-else.md): reforça
- [007 - Classes Pequenas](rule-07-small-classes.md): complementa
- [022 - Simplicidade e Clareza](../../rules/022_priorizacao-simplicidade-clareza.md): reforça
