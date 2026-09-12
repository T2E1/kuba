# Pessimistic Offline Lock

**Camada:** Offline Concurrency
**Complexidade:** Moderada
**Intenção:** Previne conflitos entre transações concorrentes de longa duração fazendo um processo travar o dado antes de editá-lo, impedindo outros processos de editar o mesmo dado até a liberação do lock.

---

## Quando Usar

- Conflitos são frequentes e o custo de perder trabalho no commit (Optimistic) é maior que o custo de bloquear cedo
- Operações onde um segundo editor concorrente não deveria sequer começar a editar

## Quando NÃO Usar

- Sessões de edição muito longas, onde o lock ficaria preso e bloquearia outros usuários indefinidamente
- Alta concorrência com baixa taxa real de conflito — o lock vira gargalo de performance sem necessidade

## Estrutura Mínima (TypeScript)

```typescript
class LockManager {
  async acquire(resourceId: string, owner: string): Promise<void> {
    const existing = await this.locks.findByResource(resourceId)
    if (existing && existing.owner !== owner) throw new ResourceLockedError(resourceId)
    await this.locks.save(new Lock(resourceId, owner))
  }

  async release(resourceId: string, owner: string): Promise<void> {
    await this.locks.deleteFor(resourceId, owner)
  }
}
```

## Relacionado com

- [optimistic-offline-lock.md](optimistic-offline-lock.md): complementa — trade-off oposto
- [coarse-grained-lock.md](coarse-grained-lock.md): complementa — trava um grupo de objetos relacionados com um único lock
- [regra 070 - Proibição de Estado Mutável Compartilhado](../../../rules/070_proibicao-estado-mutavel-compartilhado.md): reforça — o lock é a coordenação explícita que falta ao estado compartilhado descontrolado

---

**Camada PoEAA:** Offline Concurrency
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
