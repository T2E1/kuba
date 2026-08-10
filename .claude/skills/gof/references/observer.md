# Observer

**Categoria:** Comportamental
**Intenção:** Definir dependência um-para-muitos entre objetos para que quando um objeto muda de estado, todos os seus dependentes sejam notificados e atualizados automaticamente.

---

## Quando Usar

- Eventos e pub/sub entre componentes desacoplados
- Programação reativa e data binding
- Notificações de mudança de estado para múltiplos consumidores
- Implementar listeners e callbacks de forma estruturada

## Quando NÃO Usar

- Quando esquecer de fazer `unsubscribe` causa memory leaks (rule 070 — Shared Mutable State)
- Quando a ordem de notificação dos observers importa mas não é garantida
- Para comunicação síncrona simples onde chamada direta é mais clara

## Estrutura Mínima (TypeScript)

```typescript
interface Observer<T> {
  update(data: T): void
}

class EventEmitter<T> {
  private readonly observers: Set<Observer<T>> = new Set()

  subscribe(observer: Observer<T>): void { this.observers.add(observer) }
  unsubscribe(observer: Observer<T>): void { this.observers.delete(observer) }

  notify(data: T): void {
    this.observers.forEach(observer => observer.update(data))
  }
}

class StockPrice extends EventEmitter<number> {
  private price = 0

  setPrice(price: number): void {
    this.price = price
    this.notify(price)
  }
}
```

## Exemplo de Uso Real

```typescript
const stock = new StockPrice()
stock.subscribe({ update: p => console.log('Preço:', p) })
stock.setPrice(100)
```

## Relacionado a

- [mediator.md](mediator.md): complementa — Observer define dependência um-para-muitos; Mediator centraliza comunicação muitos-para-muitos
- [chain-of-responsibility.md](chain-of-responsibility.md): complementa — Observer notifica todos; Chain para no primeiro handler que processa
- [rule 070 - Proibição de Estado Mutável Compartilhado](../../../rules/070_proibicao-estado-mutavel-compartilhado.md): reforça — não esqueça de fazer `unsubscribe` para evitar memory leaks e referências obsoletas
- [rule 036 - Restrição de Funções com Efeitos Colaterais](../../../rules/036_restricao-funcoes-efeitos-colaterais.md): complementa — `notify()` tem efeito colateral intencional e documentado

---

**Categoria GoF:** Comportamental
**Fonte:** Design Patterns — Gamma, Helm, Johnson, Vlissides (1994)
