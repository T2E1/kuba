# State

**Categoria:** Comportamental
**Intenção:** Permitir que um objeto altere seu comportamento quando seu estado interno muda, parecendo mudar de classe.

---

## Quando Usar

- Máquinas de estado com transições bem definidas
- Workflows com estados distintos (pendente, ativo, concluído, cancelado)
- Objetos cujo comportamento depende fortemente do estado atual
- Para eliminar grandes blocos de `if/switch` baseados em estado

## Quando NÃO Usar

- Quando há apenas 2-3 estados simples — `if/switch` pode ser mais claro (rule 022 — KISS)
- Quando as transições de estado são raras e a sobrecarga de classes não se justifica
- Quando Strategy é preferível — State é melhor para transições automáticas de estado; Strategy para troca manual de algoritmo

## Estrutura Mínima (TypeScript)

```typescript
interface OrderState {
  confirm(order: Order): void
  ship(order: Order): void
  cancel(order: Order): void
}

class PendingState implements OrderState {
  confirm(order: Order): void { order.setState(new ConfirmedState()) }
  ship(_: Order): void { throw new Error('Confirme antes de enviar') }
  cancel(order: Order): void { order.setState(new CancelledState()) }
}

class ConfirmedState implements OrderState {
  confirm(_: Order): void { throw new Error('Pedido já confirmado') }
  ship(order: Order): void { order.setState(new ShippedState()) }
  cancel(order: Order): void { order.setState(new CancelledState()) }
}

class Order {
  private state: OrderState = new PendingState()
  setState(state: OrderState): void { this.state = state }
  confirm(): void { this.state.confirm(this) }
  ship(): void { this.state.ship(this) }
  cancel(): void { this.state.cancel(this) }
}

class ShippedState implements OrderState {
  confirm(_: Order): void { throw new Error('Pedido já enviado') }
  ship(_: Order): void { throw new Error('Pedido já enviado') }
  cancel(_: Order): void { throw new Error('Não é possível cancelar pedido enviado') }
}

class CancelledState implements OrderState {
  confirm(_: Order): void { throw new Error('Pedido cancelado') }
  ship(_: Order): void { throw new Error('Pedido cancelado') }
  cancel(_: Order): void { throw new Error('Pedido já cancelado') }
}
```

## Exemplo de Uso Real

```typescript
const order = new Order()
order.confirm()
order.ship()
```

## Relacionado a

- [strategy.md](strategy.md): complementa — State realiza transições automaticamente entre comportamentos; Strategy permite troca manual de algoritmo
- [memento.md](memento.md): complementa — Memento pode salvar e restaurar estados de máquinas State
- [rule 002 - Proibição da Cláusula ELSE](../../../rules/002_proibicao-clausula-else.md): reforça — State elimina if/else baseados no estado atual
- [rule 011 - Princípio Aberto/Fechado](../../../rules/011_principio-aberto-fechado.md): reforça — adicione novo estado sem modificar a lógica existente
- [rule 022 - Priorização da Simplicidade e Clareza](../../../rules/022_priorizacao-simplicidade-clareza.md): reforça — não use State para 2-3 estados simples onde if é mais claro

---

**Categoria GoF:** Comportamental
**Fonte:** Design Patterns — Gamma, Helm, Johnson, Vlissides (1994)
