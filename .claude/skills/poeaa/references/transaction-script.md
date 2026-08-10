# Transaction Script

**Camada:** Domain Logic
**Complexidade:** Simples
**Intenção:** Organiza a lógica de negócio como um único procedimento que trata cada requisição vinda da camada de apresentação.

---

## Quando Usar

- Domínio simples com poucas regras de negócio
- CRUDs diretos sem lógica complexa de validação ou cálculo
- Scripts de integração e sincronização de dados
- Aplicações pequenas onde a complexidade do Domain Model não se justifica
- Protótipos e MVPs que precisam de velocidade de desenvolvimento

## Quando NÃO Usar

- Quando múltiplos scripts compartilham lógica similar (cria duplicação — regra 021)
- Quando as regras de negócio estão espalhadas por vários scripts sem coesão
- Quando o domínio tem entidades com comportamento próprio (use Domain Model)
- Quando os scripts ultrapassam 50 linhas de lógica de negócio (regra 007)

## Estrutura Mínima (TypeScript)

```typescript
// Cada função é um script completo que trata uma transação
async function createOrder(
  customerId: string,
  items: Array<{ productId: string; quantity: number }>
): Promise<string> {
  // 1. Validação simples
  if (items.length === 0) throw new Error('Order must have at least one item')

  // 2. Cálculo direto
  const total = items.reduce((sum, item) => sum + item.quantity * 10, 0)

  // 3. Persistência direta
  const orderId = await db.insert('orders', { customerId, total, status: 'pending' })
  await db.insertMany('order_items', items.map(item => ({ orderId, ...item })))

  return orderId
}
```

## Relacionado com

- [domain-model.md](domain-model.md): substitui quando a complexidade do domínio cresce
- [row-data-gateway.md](row-data-gateway.md): complementa — Row Data Gateway é o padrão natural de dados para Transaction Script
- [active-record.md](active-record.md): complementa — Active Record é alternativa de acesso a dados para Transaction Script
- [regra 022 - Priorização da Simplicidade e Clareza](../../../rules/022_priorizacao-simplicidade-clareza.md): reforça — usar quando o domínio não justifica complexidade adicional

---

**Camada PoEAA:** Domain Logic
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
