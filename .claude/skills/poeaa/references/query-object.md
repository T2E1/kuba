# Query Object

**Camada:** Object-Relational Metadata Mapping
**Complexidade:** Moderada
**Intenção:** Representa uma consulta de banco de dados como um objeto de domínio, montado por composição, que sabe se traduzir em SQL.

---

## Quando Usar

- Consultas com muitas combinações de filtros opcionais, onde concatenar SQL manualmente vira Spaghetti Code
- Quando o domínio precisa expressar critérios de busca sem conhecer SQL diretamente (regra 014)

## Quando NÃO Usar

- Consultas fixas e simples — um método nomeado no Repository já resolve (`findActiveSubscribers()`)

## Estrutura Mínima (TypeScript)

```typescript
class UserQuery {
  private readonly criteria: Criterion[] = []

  whereEmailContains(fragment: string): this {
    this.criteria.push({ field: 'email', op: 'LIKE', value: `%${fragment}%` })
    return this
  }

  toSql(): { sql: string; params: unknown[] } {
    const clauses = this.criteria.map((c, i) => `${c.field} ${c.op} $${i + 1}`)
    return { sql: `SELECT * FROM users WHERE ${clauses.join(' AND ')}`, params: this.criteria.map(c => c.value) }
  }
}
```

## Relacionado com

- [repository.md](repository.md): complementa — o Repository recebe um Query Object para consultas dinâmicas
- [regra 014 - Inversão de Dependência](../../../rules/014_principio-inversao-dependencia.md): reforça — o domínio monta o critério sem conhecer SQL
- [regra 030 - Proibição de Funções Inseguras](../../../rules/030_proibicao-funcoes-inseguras.md): reforça — parametriza a query em vez de concatenar entrada do usuário

---

**Camada PoEAA:** Object-Relational Metadata Mapping
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
