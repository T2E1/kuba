# Database Session State

**Camada:** Session State
**Complexidade:** Simples
**Intenção:** Guarda o estado da sessão em uma tabela de banco de dados, identificado por um token de sessão, sobrevivendo a reinícios de servidor.

---

## Quando Usar

- Estado que precisa sobreviver ao reinício ou à troca do servidor que atende a requisição
- Sistemas já apoiados em transações de banco, onde persistir a sessão junto é natural

## Quando NÃO Usar

- Estado pequeno e de curta duração, onde o custo de uma escrita em banco por requisição é desnecessário — Server Session State em cache resolve mais barato

## Estrutura Mínima (SQL + TypeScript)

```sql
-- sessions (id, user_id, data, expires_at)
```

```typescript
class DatabaseSessionStore {
  async load(sessionId: string): Promise<SessionData | null> {
    const row = await this.db.query('SELECT data FROM sessions WHERE id = $1 AND expires_at > now()', [sessionId])
    return row ? JSON.parse(row.data) : null
  }
}
```

## Relacionado com

- [server-session-state.md](server-session-state.md): complementa — trade-off oposto (durabilidade vs. latência)
- [regra 045 - Processos Stateless](../../../rules/045_processos-stateless.md): complementa — o banco assume a durabilidade que o processo não precisa carregar

---

**Camada PoEAA:** Session State
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
