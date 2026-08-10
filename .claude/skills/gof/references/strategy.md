# Strategy

**Categoria:** Comportamental
**Intenção:** Definir uma família de algoritmos, encapsular cada um deles e torná-los intercambiáveis, permitindo que o algoritmo varie independentemente dos clientes que o utilizam.

---

## Quando Usar

- Trocar algoritmo em tempo de execução (ex.: diferentes estratégias de ordenação, compressão, cálculo)
- Eliminar `if/switch` que selecionam comportamento por tipo
- Quando existem múltiplas variantes de um algoritmo
- Para isolar lógica de negócio variável do código que a utiliza

## Quando NÃO Usar

- Quando há apenas um algoritmo fixo — use diretamente sem encapsular (overengineering — rule 064)
- Quando a variação do algoritmo é rara e `if` simples é mais legível
- Prefira Strategy em vez de Template Method quando quiser composição em vez de herança

## Estrutura Mínima (TypeScript)

```typescript
interface SortStrategy<T> {
  sort(data: T[]): T[]
}

class BubbleSortStrategy<T> implements SortStrategy<T> {
  sort(data: T[]): T[] {
    const arr = [...data]
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        }
      }
    }
    return arr
  }
}

class NativeSortStrategy<T> implements SortStrategy<T> {
  sort(data: T[]): T[] { return [...data].sort() }
}

class Sorter<T> {
  constructor(private strategy: SortStrategy<T>) {}

  setStrategy(strategy: SortStrategy<T>): void { this.strategy = strategy }
  sort(data: T[]): T[] { return this.strategy.sort(data) }
}
```

## Exemplo de Uso Real

```typescript
const sorter = new Sorter(new NativeSortStrategy())
sorter.sort([3, 1, 2])
```

## Relacionado a

- [state.md](state.md): complementa — Strategy troca algoritmo manualmente; State realiza transições de comportamento automaticamente baseado em estado
- [template-method.md](template-method.md): substitui — Strategy usa composição; Template Method usa herança; prefira Strategy quando quiser evitar herança
- [decorator.md](decorator.md): complementa — Decorator adiciona comportamento empilhando wrappers; Strategy substitui comportamento central
- [rule 011 - Princípio Aberto/Fechado](../../../rules/011_principio-aberto-fechado.md): reforça — adicione nova estratégia sem modificar o Sorter
- [rule 014 - Princípio da Inversão de Dependência](../../../rules/014_principio-inversao-dependencia.md): reforça — Sorter depende da interface SortStrategy, não das implementações concretas
- [rule 064 - Proibição de Overengineering](../../../rules/064_proibicao-overengineering.md): reforça — não use quando há apenas um algoritmo

---

**Categoria GoF:** Comportamental
**Fonte:** Design Patterns — Gamma, Helm, Johnson, Vlissides (1994)
