# Class Table Inheritance

**Camada:** Object-Relational Structural
**Complexidade:** Complexa
**Intenção:** Representa uma hierarquia de classes de herança com uma tabela por classe, onde a tabela da subclasse referencia a tabela da superclasse por chave estrangeira compartilhada.

---

## Quando Usar

- Hierarquia com muitos campos específicos por subclasse, que tornariam Single Table Inheritance cheia de colunas nulas
- Quando o modelo relacional deve espelhar de perto a hierarquia de domínio

## Quando NÃO Usar

- Hierarquia pequena e estável — o join extra por consulta não compensa (ver Single Table Inheritance)
- Consultas de alta performance sobre toda a hierarquia, onde o join custa caro

## Estrutura Mínima (SQL)

```sql
-- payments (id, amount)
-- check_payments (payment_id FK -> payments.id, check_number)
-- card_payments (payment_id FK -> payments.id, card_last_digits)
```

## Relacionado com

- [single-table-inheritance.md](single-table-inheritance.md): complementa — trade-off oposto (menos nulos, mais joins)
- [foreign-key-mapping.md](foreign-key-mapping.md): depende de — a ligação entre tabela mãe e filha é uma chave estrangeira compartilhada
- [regra 069 - Proibição de Otimização Prematura](../../../rules/069_proibicao-otimizacao-prematura.md): complementa — só trocar por Single Table após medir o custo real do join

---

**Camada PoEAA:** Object-Relational Structural
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
