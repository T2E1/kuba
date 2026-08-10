# ADP — Acyclic Dependencies Principle

**Grupo:** Acoplamento
**Rule deMGoncalves:** [018 - Princípio de Dependências Acíclicas](../../../rules/018_principio-dependencias-aciclicas.md)
**Pergunta:** O grafo de dependências entre pacotes é acíclico (DAG)?

## O Que É

**O grafo de dependências entre pacotes deve ser acíclico, ou seja, não deve haver dependências circulares entre módulos.**

Dependências circulares criam um nó apertado onde as classes dos módulos envolvidos se tornam inseparáveis. Isso impede testes isolados, torna o deploy mais complexo e impossibilita a reutilização individual dos módulos.

## Quando está sendo violado

- Módulo A depende do Módulo B e Módulo B depende do Módulo A
- Grafo de dependências contém ciclos (não é DAG)
- Build falha com erro de "circular dependency detected"
- Não é possível testar módulo isoladamente sem carregar outro módulo do ciclo

## ❌ Violação

```typescript
// order/Order.ts
import { Payment } from '../payment/Payment';

export class Order {
  payment: Payment;

  calculateTotal() {
    return this.payment.getAmount();
  }
}

// payment/Payment.ts
import { Order } from '../order/Order';  // ❌ ciclo!

export class Payment {
  order: Order;

  process() {
    if (this.order.isValid()) {  // ❌ acoplamento circular
      // ...
    }
  }
}

// Grafo: Order → Payment → Order (ciclo) ❌
```

## ✅ Correto

```typescript
// Solução 1: Extrair interface (DIP) ✅
// order/Order.ts
export interface PaymentProcessor {
  getAmount(): number;
  process(): Promise<void>;
}

export class Order {
  payment: PaymentProcessor;  // ✅ depende de abstração

  calculateTotal() {
    return this.payment.getAmount();
  }
}

// payment/Payment.ts
import type { PaymentProcessor } from '../order/Order';

export class Payment implements PaymentProcessor {
  // ✅ Não importa Order concreta
  getAmount() { /* ... */ }
  async process() { /* ... */ }
}

// Grafo: Payment → Order (interface) — Acíclico ✅

// Solução 2: Extrair módulo intermediário ✅
// shared/PaymentContract.ts
export interface PaymentProcessor { /* ... */ }
export interface OrderValidator { /* ... */ }

// order/Order.ts
import { PaymentProcessor } from '../shared/PaymentContract';

// payment/Payment.ts
import { OrderValidator } from '../shared/PaymentContract';

// Grafo: Order → shared, Payment → shared — Acíclico ✅
```
