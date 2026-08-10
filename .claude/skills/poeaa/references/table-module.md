# Table Module

**Camada:** Domain Logic
**Complexidade:** Moderada
**Intenção:** Uma única instância trata a lógica de negócio de todas as linhas de uma tabela ou view do banco de dados.

---

## Quando Usar

- Lógica de negócio moderada fortemente ligada à estrutura da tabela
- Aplicações com Record Set (DataSet) como abstração central de dados
- Sistemas legados ou de relatórios onde as operações são por conjunto de dados
- Quando a lógica trata mais de manipulação de conjuntos do que de objetos individuais

## Quando NÃO Usar

- Quando o domínio tem objetos com comportamento rico e identidade própria (use Domain Model)
- Quando a lógica vai além de operações simples de conjunto
- Em sistemas modernos sem infraestrutura de Record Set

## Estrutura Mínima (TypeScript)

```typescript
// Uma classe por tabela, opera em conjuntos de registros
class OrderTable {
  constructor(private readonly db: Database) {}

  async findPendingByCustomer(customerId: string): Promise<OrderRecord[]> {
    return this.db.query(
      'SELECT * FROM orders WHERE customer_id = ? AND status = ?',
      [customerId, 'pending']
    )
  }

  async calculateTotalRevenue(startDate: Date, endDate: Date): Promise<number> {
    const result = await this.db.query(
      'SELECT SUM(total) as revenue FROM orders WHERE created_at BETWEEN ? AND ?',
      [startDate, endDate]
    )
    return result[0]?.revenue ?? 0
  }

  async updateStatus(orderId: string, status: string): Promise<void> {
    await this.db.execute(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, orderId]
    )
  }
}
```

## Relacionado com

- [table-data-gateway.md](table-data-gateway.md): depende — Table Data Gateway é o padrão natural de acesso a dados para Table Module
- [domain-model.md](domain-model.md): substitui quando é necessário comportamento rico de objetos individuais
- [regra 022 - Priorização da Simplicidade e Clareza](../../../rules/022_priorizacao-simplicidade-clareza.md): complementa — adequado para domínios moderadamente complexos

---

**Camada PoEAA:** Domain Logic
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
