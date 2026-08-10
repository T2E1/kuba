# Iterator

**Categoria:** Comportamental
**Intenção:** Fornecer uma forma de acessar sequencialmente os elementos de um objeto agregado sem expor sua representação subjacente.

---

## Quando Usar

- Percorrer coleções sem expor a estrutura interna
- Suportar múltiplas formas de percorrer a mesma coleção
- Fornecer interface uniforme para percorrer estruturas diferentes
- Em JavaScript/TypeScript, implementar o protocolo `Symbol.iterator`

## Quando NÃO Usar

- Quando a coleção é simples e arrays nativos com `for...of` são suficientes
- Quando criar classe Iterator manualmente adiciona complexidade sem ganho — em JS/TS moderno, prefira o protocolo nativo `Symbol.iterator`
- Para percurso de estruturas que já expõem APIs de iteração adequadas

## Estrutura Mínima (TypeScript)

```typescript
class Range implements Iterable<number> {
  constructor(
    private readonly start: number,
    private readonly end: number,
    private readonly step = 1
  ) {}

  [Symbol.iterator](): Iterator<number> {
    let current = this.start
    const { end, step } = this

    return {
      next(): IteratorResult<number> {
        if (current <= end) {
          const value = current
          current += step
          return { value, done: false }
        }
        return { value: undefined as never, done: true }
      }
    }
  }
}
```

## Exemplo de Uso Real

```typescript
for (const n of new Range(1, 10, 2)) {
  console.log(n) // 1, 3, 5, 7, 9
}
```

## Relacionado a

- [composite.md](composite.md): complementa — Iterator frequentemente usado para percorrer estruturas Composite
- [visitor.md](visitor.md): complementa — Visitor pode usar Iterator para percorrer elementos de coleção
- [rule 004 - Coleções de Primeira Classe](../../../rules/004_colecoes-primeira-classe.md): complementa — Iterator implementa comportamento de percurso encapsulado na coleção
- [rule 008 - Proibição de Getters e Setters](../../../rules/008_proibicao-getters-setters.md): reforça — Iterator expõe comportamento de percurso, não o estado interno da coleção

---

**Categoria GoF:** Comportamental
**Fonte:** Design Patterns — Gamma, Helm, Johnson, Vlissides (1994)
