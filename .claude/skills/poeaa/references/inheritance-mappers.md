# Inheritance Mappers

**Camada:** Object-Relational Structural
**Complexidade:** Moderada
**Intenção:** Organiza os mappers de uma hierarquia de classes de forma que boa parte da lógica de carregamento e salvamento seja compartilhada entre eles, com um mapper abstrato centralizando o comportamento comum.

---

## Quando Usar

- Qualquer uma das três estratégias de herança (Single, Class ou Concrete Table) aplicada a uma hierarquia com mais de duas subclasses
- Quando a lógica de carregar/salvar campos comuns está duplicada entre mappers de subclasse

## Quando NÃO Usar

- Hierarquia com apenas uma subclasse, onde a abstração extra não paga o custo (regra 064)

## Estrutura Mínima (TypeScript)

```typescript
abstract class PaymentMapper {
  protected abstract mapSpecificFields(row: PaymentRow, payment: Payment): void

  toDomain(row: PaymentRow): Payment {
    const payment = this.createPayment(row)
    this.mapSpecificFields(row, payment)
    return payment
  }

  protected abstract createPayment(row: PaymentRow): Payment
}

class CheckPaymentMapper extends PaymentMapper {
  protected createPayment(row: PaymentRow): Payment {
    return new CheckPayment(row.id, row.amount)
  }
  protected mapSpecificFields(row: PaymentRow, payment: Payment): void {
    (payment as CheckPayment).checkNumber = row.check_number
  }
}
```

## Relacionado com

- [single-table-inheritance.md](single-table-inheritance.md): complementa — a estratégia de tabela que o mapper implementa
- [data-mapper.md](data-mapper.md): depende de — é uma organização interna do próprio Data Mapper
- [regra 021 - Proibição de Duplicação de Lógica](../../../rules/021_proibicao-duplicacao-logica.md): reforça — centraliza o carregamento comum entre subclasses

---

**Camada PoEAA:** Object-Relational Structural
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
