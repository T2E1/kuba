# Remote Facade

**Camada:** Distribution
**Complexidade:** Moderada
**Intenção:** Oferece uma fachada de granularidade grossa sobre objetos de domínio de granularidade fina, para reduzir o número de chamadas remotas entre processos.

---

## Quando Usar

- Quando o domínio é acessado através de uma fronteira de processo cara (rede, RPC)
- Para agrupar várias operações finas em uma única chamada remota

## Quando NÃO Usar

- Chamadas dentro do mesmo processo — a fachada só se justifica onde a chamada remota tem custo real
- Como desculpa para introduzir uma camada de rede onde uma chamada local bastaria (regra 064)

## Estrutura Mínima (TypeScript)

```typescript
// Fachada remota agrupando o que seriam N chamadas finas em uma
class OrderFacade {
  async placeOrder(request: PlaceOrderRequest): Promise<PlaceOrderResponse> {
    const customer = await this.customers.findById(request.customerId)
    const order = customer.placeOrder(request.items)
    await this.orders.save(order)
    return { orderId: order.id, total: order.total }
  }
}
```

## Relacionado com

- [data-transfer-object.md](data-transfer-object.md): depende de — a fachada troca DTOs, não entidades de domínio, através da fronteira
- [regra 064 - Proibição de Overengineering](../../../rules/064_proibicao-overengineering.md): reforça — só introduzir fronteira remota quando ela existe de fato

---

**Camada PoEAA:** Distribution
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
