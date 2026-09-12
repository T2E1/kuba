# Concrete Table Inheritance

**Camada:** Object-Relational Structural
**Complexidade:** Moderada
**Intenção:** Representa cada classe concreta da hierarquia com sua própria tabela, repetindo os campos herdados da superclasse em cada uma.

---

## Quando Usar

- Cada subclasse é consultada isoladamente, quase nunca por toda a hierarquia junta
- Hierarquia estável na base, mas com subclasses adicionadas de forma independente

## Quando NÃO Usar

- Quando consultas frequentes precisam varrer toda a hierarquia (o Single/Class Table evita duplicar a query em N tabelas)
- Quando alterar um campo da superclasse exige migrar N tabelas — sinal de Shotgun Surgery (regra 058)

## Estrutura Mínima (SQL)

```sql
-- check_payments (id, amount, check_number)
-- card_payments (id, amount, card_last_digits)
```

## Relacionado com

- [single-table-inheritance.md](single-table-inheritance.md): complementa — trade-off oposto para hierarquias consultadas em conjunto
- [class-table-inheritance.md](class-table-inheritance.md): complementa — evita a duplicação de campos herdados que este padrão aceita
- [regra 058 - Proibição de Shotgun Surgery](../../../rules/058_proibicao-shotgun-surgery.md): reforça — mudança na superclasse não deve tocar N tabelas sem necessidade

---

**Camada PoEAA:** Object-Relational Structural
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
