# Data Transfer Object

**Camada:** Distribution
**Complexidade:** Simples
**Intenção:** Agrupa dados em um objeto simples de transporte para reduzir o número de chamadas em uma fronteira remota, sem comportamento de domínio.

---

## Quando Usar

- Ao atravessar uma fronteira de processo (API, RPC) onde entidades de domínio completas não devem trafegar
- Para desacoplar a forma exposta externamente da forma interna do domínio

## Quando NÃO Usar

- Dentro do mesmo processo, entre camadas que já compartilham o domínio — passar a entidade é mais direto
- Quando o DTO ganha lógica de negócio própria — nesse caso deixou de ser DTO (regra 010)

## Estrutura Mínima (TypeScript)

```typescript
interface OrderDto {
  readonly id: string
  readonly customerName: string
  readonly total: number
  readonly items: readonly { productName: string; quantity: number }[]
}

function toDto(order: Order): OrderDto {
  return {
    id: order.id,
    customerName: order.customer.name,
    total: order.total,
    items: order.lines.map(l => ({ productName: l.product.name, quantity: l.quantity })),
  }
}
```

## Relacionado com

- [remote-facade.md](remote-facade.md): complementa — o DTO é o que a fachada troca através da fronteira
- [regra 029 - Imutabilidade de Objetos](../../../rules/029_imutabilidade-objetos-freeze.md): reforça — DTO deve ser imutável, puro transporte
- [regra 010 - Responsabilidade Única](../../../rules/010_principio-responsabilidade-unica.md): reforça — proíbe o DTO ganhar comportamento de domínio

---

**Camada PoEAA:** Distribution
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
