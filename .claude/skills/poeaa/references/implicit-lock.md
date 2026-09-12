# Implicit Lock

**Camada:** Offline Concurrency
**Complexidade:** Simples
**Intenção:** Faz com que a infraestrutura adquira e libere locks (otimistas ou pessimistas) automaticamente, em vez de exigir que cada desenvolvedor lembre de chamá-los manualmente em cada ponto de acesso a dado.

---

## Quando Usar

- Sempre que Optimistic ou Pessimistic Offline Lock é adotado — para não depender de disciplina manual espalhada pelo código
- Em frameworks ou ORMs que já expõem esse comportamento por configuração

## Quando NÃO Usar

- Quando esconder o lock atrás de infraestrutura tornaria o comportamento de concorrência opaco demais para quem depura um conflito

## Estrutura Mínima (TypeScript)

```typescript
// O Unit of Work adquire o lock implicitamente no commit, sem que o Service Layer o chame
class UnitOfWork {
  async commit(): Promise<void> {
    for (const dirty of this.dirtyObjects) {
      await this.lockManager.acquire(dirty.id, this.currentUser) // implícito
      await this.repository.save(dirty)
    }
  }
}
```

## Relacionado com

- [optimistic-offline-lock.md](optimistic-offline-lock.md): depende de — o mecanismo que o Implicit Lock automatiza
- [unit-of-work.md](unit-of-work.md): complementa — local natural para centralizar a aquisição implícita
- [regra 021 - Proibição de Duplicação de Lógica](../../../rules/021_proibicao-duplicacao-logica.md): reforça — evita repetir a chamada de lock em cada ponto de acesso

---

**Camada PoEAA:** Offline Concurrency
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
