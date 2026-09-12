# Money

**Camada:** Base Patterns
**Complexidade:** Simples
**Intenção:** Representa um valor monetário como um Value Object que carrega quantia e moeda juntos, evitando erros de arredondamento e de mistura de moedas que `number` cru não previne.

---

## Quando Usar

- Qualquer quantia monetária no domínio (preço, total, desconto, saldo)
- Sempre que operações aritméticas com dinheiro precisam de arredondamento consistente

## Quando NÃO Usar

- Nunca — é o caso canônico de Primitive Obsession que este padrão resolve (regra 003); não há exceção legítima para representar dinheiro como `number` cru no domínio

## Estrutura Mínima (TypeScript)

```typescript
class Money {
  constructor(readonly cents: number, readonly currency: string) {
    Object.freeze(this)
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) throw new CurrencyMismatchError(this.currency, other.currency)
    return new Money(this.cents + other.cents, this.currency)
  }

  equals(other: Money): boolean {
    return this.cents === other.cents && this.currency === other.currency
  }
}
```

## Relacionado com

- [value-object.md](value-object.md): depende de — Money é uma especialização de Value Object
- [regra 003 - Encapsulamento de Primitivos](../../../rules/003_encapsulamento-primitivos.md): reforça — o exemplo canônico de valor de domínio que não pode ser um `number` cru
- [regra 024 - Proibição de Constantes Mágicas](../../../rules/024_proibicao-constantes-magicas.md): complementa — evita que o código de moeda apareça como string mágica solta

---

**Camada PoEAA:** Base Patterns
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
