# Dependent Mapping

**Camada:** Object-Relational Structural
**Complexidade:** Moderada
**Intenção:** Faz um mapper mãe responsável por salvar objetos dependentes, que não têm existência nem identidade fora do objeto que os contém.

---

## Quando Usar

- Objeto que só existe no contexto de outro (ex: `OrderLine` só faz sentido dentro de `Order`)
- Quando o dependente não precisa ser buscado isoladamente por um Repository próprio

## Quando NÃO Usar

- Quando o suposto dependente tem ciclo de vida e identidade próprios — nesse caso é uma entidade e merece seu próprio mapper

## Estrutura Mínima (TypeScript)

```typescript
class OrderMapper {
  async save(order: Order): Promise<void> {
    await this.saveOrderRow(order)
    await this.db.query('DELETE FROM order_lines WHERE order_id = $1', [order.id])
    for (const line of order.lines) {
      await this.db.query(
        'INSERT INTO order_lines (order_id, product_id, quantity) VALUES ($1, $2, $3)',
        [order.id, line.productId, line.quantity],
      )
    }
  }
}
```

## Relacionado com

- [foreign-key-mapping.md](foreign-key-mapping.md): complementa — o dependente carrega a chave estrangeira para a mãe
- [embedded-value.md](embedded-value.md): complementa — alternativa quando o dependente não precisa de tabela própria
- [regra 010 - Responsabilidade Única](../../../rules/010_principio-responsabilidade-unica.md): reforça — só a mãe decide o ciclo de vida do dependente

---

**Camada PoEAA:** Object-Relational Structural
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
