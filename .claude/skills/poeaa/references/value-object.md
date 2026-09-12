# Value Object

**Camada:** Base Patterns
**Complexidade:** Simples
**Intenção:** Representa um valor de domínio pequeno e imutável, cuja igualdade é definida pelos seus atributos, não por identidade.

---

## Quando Usar

- Conceito de domínio sem ciclo de vida próprio (data, dinheiro, coordenada, intervalo)
- Sempre que um primitivo (string, number) carrega significado de domínio que merece validação própria

## Quando NÃO Usar

- Quando o conceito precisa de identidade e ciclo de vida rastreável — nesse caso é uma Entity, não um Value Object

## Estrutura Mínima (TypeScript)

```typescript
class DateRange {
  constructor(readonly start: Date, readonly end: Date) {
    if (start > end) throw new InvalidDateRangeError(start, end)
    Object.freeze(this)
  }

  equals(other: DateRange): boolean {
    return this.start.getTime() === other.start.getTime() && this.end.getTime() === other.end.getTime()
  }

  includes(date: Date): boolean {
    return date >= this.start && date <= this.end
  }
}
```

## Relacionado com

- [embedded-value.md](embedded-value.md): depende de — Embedded Value é a técnica de persistir um Value Object
- [money.md](money.md): complementa — Money é o Value Object canônico do catálogo
- [regra 003 - Encapsulamento de Primitivos](../../../rules/003_encapsulamento-primitivos.md): é a mesma técnica descrita como rule deste repositório
- [regra 029 - Imutabilidade de Objetos](../../../rules/029_imutabilidade-objetos-freeze.md): reforça — todo Value Object deve ser congelado

---

**Camada PoEAA:** Base Patterns
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
