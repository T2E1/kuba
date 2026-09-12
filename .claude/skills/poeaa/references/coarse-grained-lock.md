# Coarse-Grained Lock

**Camada:** Offline Concurrency
**Complexidade:** Moderada
**Intenção:** Trava um conjunto de objetos relacionados com um único lock, em vez de travar cada objeto individualmente.

---

## Quando Usar

- Agregado com múltiplos objetos dependentes que sempre são editados juntos (ex: `Order` e suas `OrderLine`)
- Quando travar cada dependente individualmente multiplicaria o overhead de lock sem ganho real

## Quando NÃO Usar

- Objetos que são editados de forma independente por processos diferentes — o lock grosso bloquearia edições legítimas não relacionadas

## Estrutura Mínima (TypeScript)

```typescript
class OrderLockManager {
  // Um único registro de lock/versão na raiz do agregado cobre a Order e todas as suas linhas
  async acquireForAggregate(orderId: string, owner: string): Promise<void> {
    await this.lockManager.acquire(`order-aggregate:${orderId}`, owner)
  }
}
```

## Relacionado com

- [pessimistic-offline-lock.md](pessimistic-offline-lock.md): depende de — Coarse-Grained Lock é um lock pessimista aplicado a um agregado
- [dependent-mapping.md](dependent-mapping.md): complementa — o mesmo agrupamento que justifica o Dependent Mapping justifica o lock único
- [regra 016 - Princípio do Fechamento Comum](../../../rules/016_principio-fechamento-comum.md): reforça — objetos que mudam juntos devem ser travados juntos

---

**Camada PoEAA:** Offline Concurrency
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
