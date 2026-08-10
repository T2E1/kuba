# Regra 4 — First Class Collections

**Regra deMGoncalves:** ESTRUTURAL-004
**Questão:** Esta coleção é retornada ou recebida como Array/Map/Set nativo?

## O que é

Determina que qualquer coleção (lista, array, mapa) com lógica de negócio ou comportamento associado deve ser encapsulada em uma classe dedicada (First Class Collection).

## Quando Aplicar

- Método público retorna `Array<T>`
- Método público recebe `Array<T>` como parâmetro
- Lógica de filtro/ordenação/soma aplicada em múltiplos locais
- Coleção com significado de domínio (ex.: ListaDePedidos, Funcionarios)

## ❌ Violação

```typescript
class OrderService {
  getActiveOrders(): Order[] {  // Retorna Array nativo - VIOLA
    return this.orders.filter(o => o.isActive());
  }

  getTotalValue(orders: Order[]): number {  // Recebe Array - VIOLA
    return orders.reduce((sum, o) => sum + o.value, 0);
  }
}
```

## ✅ Correto

```typescript
class OrderList {
  private readonly orders: Order[];

  constructor(orders: Order[]) {
    this.orders = [...orders];
    Object.freeze(this);
  }

  filterActive(): OrderList {
    return new OrderList(
      this.orders.filter(o => o.isActive())
    );
  }

  getTotalValue(): number {
    return this.orders.reduce((sum, o) => sum + o.value, 0);
  }

  count(): number {
    return this.orders.length;
  }
}

class OrderService {
  getActiveOrders(): OrderList {
    return this.orderList.filterActive();
  }
}
```

## Exceções

- **DTOs Puros**: Transferência de dados entre camadas sem lógica
- **APIs de Framework**: Props do React, queries de ORM que exigem arrays

## Regras Relacionadas

- [007 - Classes Pequenas](rule-07-small-classes.md): reforça
- [008 - Proibição de Getters/Setters](rule-08-no-getters-setters.md): reforça
- [010 - Princípio da Responsabilidade Única](../../rules/010_principio-responsabilidade-unica.md): reforça
