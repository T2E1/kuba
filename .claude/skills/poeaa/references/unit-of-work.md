# Unit of Work

**Camada:** Object-Relational
**Complexidade:** Moderada
**Intenção:** Mantém uma lista de objetos afetados por uma transação de negócio e coordena a gravação de mudanças e a resolução de problemas de concorrência.

---

## Quando Usar

- Quando múltiplas operações de domínio devem ser persistidas atomicamente
- Para evitar múltiplas viagens ao banco em uma única transação
- Quando é necessário rastrear mudanças em objetos de domínio ao longo de uma requisição
- Em aplicações com Domain Model rico onde a persistência é separada do domínio

## Quando NÃO Usar

- Operações CRUD simples de entidade única (overengineering — regra 064)
- Com Active Record onde o objeto já gerencia sua própria persistência
- Quando o ORM já fornece Unit of Work automaticamente (ex: Hibernate, Entity Framework)

## Estrutura Mínima (TypeScript)

```typescript
type DirtyStatus = 'new' | 'dirty' | 'removed'

class UnitOfWork {
  private readonly newObjects: DomainObject[] = []
  private readonly dirtyObjects: DomainObject[] = []
  private readonly removedObjects: DomainObject[] = []

  registerNew(obj: DomainObject): void { this.newObjects.push(obj) }
  registerDirty(obj: DomainObject): void {
    if (!this.dirtyObjects.includes(obj)) this.dirtyObjects.push(obj)
  }
  registerRemoved(obj: DomainObject): void { this.removedObjects.push(obj) }

  async commit(): Promise<void> {
    // Executa tudo em uma única transação
    await db.transaction(async (tx) => {
      for (const obj of this.newObjects) await obj.insert(tx)
      for (const obj of this.dirtyObjects) await obj.update(tx)
      for (const obj of this.removedObjects) await obj.delete(tx)
    })
    this.clear()
  }

  rollback(): void { this.clear() }

  private clear(): void {
    this.newObjects.length = 0
    this.dirtyObjects.length = 0
    this.removedObjects.length = 0
  }
}

// Uso típico em um caso de uso
async function transferFunds(fromId: string, toId: string, amount: number): Promise<void> {
  const uow = new UnitOfWork()
  const from = await accountRepo.findById(fromId)
  const to = await accountRepo.findById(toId)

  from.debit(amount)
  to.credit(amount)

  uow.registerDirty(from)
  uow.registerDirty(to)

  await uow.commit()
}
```

## Relacionado com

- [repository.md](repository.md): complementa — repositórios registram objetos no Unit of Work em vez de persistir diretamente
- [identity-map.md](identity-map.md): complementa — Identity Map garante que o Unit of Work rastreie instâncias únicas por identidade
- [regra 021 - Proibição de Duplicação de Lógica](../../../rules/021_proibicao-duplicacao-logica.md): reforça — centraliza toda a lógica de persistência em um único ponto de commit

---

**Camada PoEAA:** Object-Relational
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
