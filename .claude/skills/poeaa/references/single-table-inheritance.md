# Single Table Inheritance

**Camada:** Object-Relational Structural
**Complexidade:** Moderada
**Intenção:** Representa uma hierarquia de classes de herança como uma única tabela, com uma coluna discriminadora indicando o tipo de cada linha.

---

## Quando Usar

- Hierarquia pequena e estável, com poucos campos específicos por subclasse
- Quando queries que atravessam toda a hierarquia (ex: "todos os pagamentos") são comuns

## Quando NÃO Usar

- Hierarquia com muitos campos específicos por subclasse — a tabela fica cheia de colunas nulas (ver Class Table Inheritance)
- Hierarquia volátil, onde subclasses são adicionadas com frequência (ver Concrete Table Inheritance)

## Estrutura Mínima (SQL + TypeScript)

```sql
-- Tabela: payments (id, type, amount, check_number, card_last_digits)
```

```typescript
class PaymentMapper {
  toDomain(row: PaymentRow): Payment {
    if (row.type === 'check') return new CheckPayment(row.id, row.amount, row.check_number)
    if (row.type === 'card') return new CardPayment(row.id, row.amount, row.card_last_digits)
    throw new UnknownPaymentTypeError(row.type)
  }
}
```

## Relacionado com

- [class-table-inheritance.md](class-table-inheritance.md): complementa — alternativa para hierarquias com muitos campos específicos
- [concrete-table-inheritance.md](concrete-table-inheritance.md): complementa — alternativa para hierarquias voláteis
- [regra 011 - Aberto/Fechado](../../../rules/011_principio-aberto-fechado.md): reinforces — o discriminador não deve virar `switch` espalhado fora do mapper

---

**Camada PoEAA:** Object-Relational Structural
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
