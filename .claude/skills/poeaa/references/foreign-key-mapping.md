# Foreign Key Mapping

**Camada:** Object-Relational Structural
**Complexidade:** Moderada
**Intenção:** Mapeia uma associação entre objetos para uma chave estrangeira entre tabelas.

---

## Quando Usar

- Quando um objeto de domínio referencia outro (ex: `Order` referencia `Customer`) e a persistência é relacional

## Quando NÃO Usar

- Associações muitos-para-muitos (ver Association Table Mapping)
- Quando o objeto referenciado deveria ser um Embedded Value em vez de entidade própria

## Estrutura Mínima (TypeScript)

```typescript
class Order {
  constructor(readonly id: string, readonly customerId: string) {}
}

class OrderMapper {
  toDomain(row: { id: string; customer_id: string }): Order {
    return new Order(row.id, row.customer_id)
  }

  toRow(order: Order): { id: string; customer_id: string } {
    return { id: order.id, customer_id: order.customerId }
  }
}
```

## Relacionado com

- [identity-field.md](identity-field.md): depende de — a chave estrangeira aponta para o Identity Field do objeto referenciado
- [data-mapper.md](data-mapper.md): complementa — é o mapper quem resolve a chave estrangeira
- [lazy-load.md](lazy-load.md): complementa — a associação pode ser carregada tardiamente

---

**Camada PoEAA:** Object-Relational Structural
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
