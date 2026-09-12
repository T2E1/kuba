# Optimistic Offline Lock

**Camada:** Offline Concurrency
**Complexidade:** Moderada
**Intenção:** Previne conflitos entre transações concorrentes de longa duração detectando, no commit, se outro processo modificou o dado desde que foi lido — usando um número de versão ou timestamp.

---

## Quando Usar

- Conflitos são raros na prática, e travar o registro por toda a duração da edição prejudicaria a concorrência
- Edições feitas por usuários em sessões longas (formulário aberto por minutos)

## Quando NÃO Usar

- Conflitos são frequentes e o retrabalho de detectar tarde é caro — considerar Pessimistic Offline Lock

## Estrutura Mínima (TypeScript)

```typescript
class Order {
  constructor(readonly id: string, readonly version: number, private total: number) {}
}

async function save(order: Order, db: Database): Promise<void> {
  const result = await db.query(
    'UPDATE orders SET total = $1, version = version + 1 WHERE id = $2 AND version = $3',
    [order.total, order.id, order.version],
  )
  if (result.rowCount === 0) throw new StaleObjectError(order.id)
}
```

## Relacionado com

- [pessimistic-offline-lock.md](pessimistic-offline-lock.md): complementa — trade-off oposto (bloqueia antecipadamente em vez de detectar tarde)
- [unit-of-work.md](unit-of-work.md): complementa — a verificação de versão normalmente acontece no commit da Unit of Work
- [regra 027 - Tratamento de Erros de Domínio](../../../rules/027_qualidade-tratamento-erros-dominio.md): reforça — o conflito deve virar uma exceção de domínio, nunca um `return false` silencioso

---

**Camada PoEAA:** Offline Concurrency
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
