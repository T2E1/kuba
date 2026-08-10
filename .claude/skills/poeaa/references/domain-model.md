# Domain Model

**Camada:** Domain Logic
**Complexidade:** Complexa
**Intenção:** Um modelo de objetos do domínio que incorpora tanto comportamento quanto dados, onde cada entidade de negócio encapsula sua própria lógica.

---

## Quando Usar

- Domínio rico com muitas regras de negócio interdependentes
- Entidades com comportamento próprio (não apenas dados)
- Regras de negócio que precisam ser testadas isoladamente
- Sistemas que devem evoluir com novos requisitos de negócio com frequência

## Quando NÃO Usar

- Domínios simples onde Transaction Script seria suficiente (overengineering — regra 064)
- Quando o time não está familiarizado com DDD e OOP avançado
- Quando o tempo de entrega é crítico e o domínio é genuinamente simples

## Estrutura Mínima (TypeScript)

```typescript
class Order {
  private readonly items: OrderItem[] = []
  private status: OrderStatus = OrderStatus.PENDING

  constructor(private readonly customerId: string) {}

  addItem(product: Product, quantity: number): void {
    if (this.status !== OrderStatus.PENDING) {
      throw new Error('Cannot add items to non-pending order')
    }
    this.items.push(new OrderItem(product, quantity))
  }

  confirm(): void {
    if (this.items.length === 0) throw new Error('Empty order')
    this.status = OrderStatus.CONFIRMED
  }

  calculateTotal(): Money {
    return this.items.reduce(
      (total, item) => total.add(item.calculateSubtotal()),
      Money.zero()
    )
  }

  isConfirmed(): boolean { return this.status === OrderStatus.CONFIRMED }
}
```

## Relacionado com

- [transaction-script.md](transaction-script.md): substitui quando o domínio é simples
- [data-mapper.md](data-mapper.md): depende — Domain Model precisa de Data Mapper para persistência sem acoplamento ao banco
- [repository.md](repository.md): depende — Repository abstrai o acesso às entidades de domínio
- [unit-of-work.md](unit-of-work.md): complementa — Unit of Work coordena a persistência de múltiplas entidades de domínio
- [regra 010 - Princípio da Responsabilidade Única](../../../rules/010_principio-responsabilidade-unica.md): reforça — cada entidade encapsula exatamente sua responsabilidade de negócio
- [regra 014 - Princípio de Inversão de Dependência](../../../rules/014_principio-inversao-dependencia.md): reforça — domínio não depende de infraestrutura

---

**Camada PoEAA:** Domain Logic
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
