# Builder

**Categoria:** Criacional
**Intenção:** Separar a construção de um objeto complexo de sua representação, permitindo construção passo a passo.

---

## Quando Usar

- Objeto tem muitos parâmetros opcionais no construtor (evita construtores telescópicos)
- A construção do objeto envolve múltiplas etapas ou configurações
- Diferentes representações de um objeto a partir do mesmo processo de construção
- Ao construir queries SQL, requisições HTTP ou objetos de configuração

## Quando NÃO Usar

- Quando o objeto é simples e tem poucos parâmetros — use construtor direto (overengineering — rule 064)
- Quando todos os parâmetros são obrigatórios e sempre presentes
- Quando não há variação na construção

## Estrutura Mínima (TypeScript)

```typescript
class QueryBuilder {
  private table = ''
  private conditions: string[] = []
  private limitValue: number | null = null

  from(table: string): QueryBuilder {
    this.table = table
    return this
  }

  where(condition: string): QueryBuilder {
    this.conditions.push(condition)
    return this
  }

  limit(value: number): QueryBuilder {
    this.limitValue = value
    return this
  }

  build(): string {
    const where = this.conditions.length
      ? `WHERE ${this.conditions.join(' AND ')}`
      : ''
    const limit = this.limitValue ? `LIMIT ${this.limitValue}` : ''
    return `SELECT * FROM ${this.table} ${where} ${limit}`.trim()
  }
}
```

## Exemplo de Uso Real

```typescript
new QueryBuilder().from('users').where('active = true').limit(10).build()
```

## Relacionado a

- [abstract-factory.md](abstract-factory.md): complementa — Abstract Factory cria famílias; Builder constrói um único produto complexo
- [prototype.md](prototype.md): complementa — Prototype pode ser usado quando o objeto final do Builder precisa ser clonado
- [rule 033 - Limite de Parâmetros por Função](../../../rules/033_limite-parametros-funcao.md): reforça — Builder elimina construtores com muitos parâmetros
- [rule 064 - Proibição de Overengineering](../../../rules/064_proibicao-overengineering.md): reforça — não use para objetos simples
- [rule 005 - Máximo Uma Chamada por Linha](../../../rules/005_maximo-uma-chamada-por-linha.md): complementa — a interface fluente do Builder é exceção permitida ao encadeamento

---

**Categoria GoF:** Criacional
**Fonte:** Design Patterns — Gamma, Helm, Johnson, Vlissides (1994)
