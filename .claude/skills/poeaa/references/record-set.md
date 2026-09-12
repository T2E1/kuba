# Record Set

**Camada:** Base Patterns
**Complexidade:** Simples
**Intenção:** Representa o resultado tabular de uma consulta em uma estrutura em memória, no formato dos dados da própria consulta, para transportá-lo entre camadas sem envolver objetos de domínio.

---

## Quando Usar

- Relatórios e telas orientadas a dados que não têm comportamento de domínio, apenas exibem linhas e colunas
- Quando criar entidades de domínio completas para um resultado somente-leitura seria overengineering (regra 064)

## Quando NÃO Usar

- Quando o resultado alimenta lógica de negócio — nesse caso deve virar objeto de domínio, não permanecer tabular

## Estrutura Mínima (TypeScript)

```typescript
interface RecordSet {
  readonly columns: readonly string[]
  readonly rows: readonly Record<string, unknown>[]
}

async function loadSalesReport(db: Database): Promise<RecordSet> {
  const rows = await db.query('SELECT product, SUM(quantity) as total FROM sales GROUP BY product')
  return { columns: ['product', 'total'], rows }
}
```

## Relacionado com

- [transaction-script.md](transaction-script.md): complementa — combinação comum em relatórios simples sem Domain Model
- [regra 064 - Proibição de Overengineering](../../../rules/064_proibicao-overengineering.md): reforça — evita modelar domínio rico para dado puramente de exibição

---

**Camada PoEAA:** Base Patterns
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
