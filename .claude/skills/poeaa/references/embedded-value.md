# Embedded Value

**Camada:** Object-Relational Structural
**Complexidade:** Simples
**Intenção:** Mapeia um objeto de valor para os campos de uma tabela do objeto que o contém, sem tabela própria.

---

## Quando Usar

- Value Object simples usado por uma única entidade (ex: `Money`, `Address`, `DateRange`)
- Quando criar uma tabela separada seria overengineering para um conceito sem identidade própria

## Quando NÃO Usar

- Quando o valor é compartilhado por várias entidades e precisa de normalização real
- Quando o valor tem coleção interna variável (nesse caso considerar Dependent Mapping)

## Estrutura Mínima (TypeScript)

```typescript
class Money {
  constructor(readonly amount: number, readonly currency: string) {
    Object.freeze(this)
  }
}

// Tabela: products (price_amount, price_currency)
class ProductMapper {
  toDomain(row: { price_amount: number; price_currency: string }): Money {
    return new Money(row.price_amount, row.price_currency)
  }
}
```

## Relacionado com

- [dependent-mapping.md](dependent-mapping.md): complementa — alternativa quando o valor precisa de tabela própria
- [regra 003 - Encapsulamento de Primitivos](../../../rules/003_encapsulamento-primitivos.md): reinforces — Embedded Value é a técnica de persistência natural de um Value Object
- [regra 029 - Imutabilidade de Objetos](../../../rules/029_imutabilidade-objetos-freeze.md): reforça — o valor embutido deve ser imutável

---

**Camada PoEAA:** Object-Relational Structural
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
