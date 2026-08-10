# Regra 8 — Proibição de No Getters/Setters

**Regra deMGoncalves:** COMPORTAMENTAL-008
**Questão:** Este método é um getter/setter puro sem lógica de negócio?

## O que é

Proíbe a criação de métodos puramente para acesso ou modificação direta do estado interno do objeto (como `getPropriedade()` e `setPropriedade()`), reforçando o encapsulamento e o princípio "Tell, Don't Ask".

## Quando Aplicar

- Método com nome `getXxx()` que apenas retorna atributo
- Método com nome `setXxx()` que apenas atribui valor
- Método que expõe estado interno sem transformação
- Cliente decidindo lógica baseado em getter

## ❌ Violação

```typescript
class Order {
  private status: string;
  private items: Item[];

  getStatus(): string {  // VIOLA: getter puro
    return this.status;
  }

  setStatus(status: string): void {  // VIOLA: setter puro
    this.status = status;
  }

  getItems(): Item[] {  // VIOLA: expõe coleção interna
    return this.items;
  }
}

// Cliente decidindo lógica - VIOLA Tell, Don't Ask
if (order.getStatus() === 'pending') {
  order.setStatus('processing');
}
```

## ✅ Correto

```typescript
class Order {
  private status: OrderStatus;
  private items: OrderItemList;

  startProcessing(): void {  // Método de intenção
    if (!this.status.isPending()) {
      throw new Error('Não é possível processar pedido não pendente');
    }
    this.status = OrderStatus.processing();
  }

  addItem(item: Item): void {  // Método de comportamento
    this.items.add(item);
  }

  getTotalValue(): number {  // Transformação/cálculo é OK
    return this.items.getTotalValue();
  }
}

// Cliente dizendo o que fazer - CORRETO
order.startProcessing();
```

## Exceções

- **DTOs**: Classes puras para transferência de dados
- **Frameworks de Serialização**: Bibliotecas que exigem getters/setters

## Regras Relacionadas

- [009 - Tell, Don't Ask](rule-09-tell-dont-ask.md): reforça
- [003 - Wrap Primitives](rule-03-wrap-primitives.md): complementa
- [004 - First Class Collections](rule-04-first-class-collections.md): reforça
