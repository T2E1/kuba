# O — Open/Closed Principle (OCP)

**Rule deMGoncalves:** COMPORTAMENTAL-011
**Pergunta:** Posso adicionar comportamento sem modificar código existente?

## O que é

Módulos, classes ou funções devem ser abertos para extensão e fechados para modificação, permitindo a adição de novos comportamentos sem alterar o código existente da unidade.

## Quando Violar Indica Problema

- Adicionar novo tipo exige modificar classe existente
- Método com mais de 3 cláusulas `if/else if/switch` que lidam com tipos
- Módulo de alto nível depende de mais de 2 classes concretas da mesma abstração
- Sempre que adicionar feature, precisa modificar classe base
- Código com múltiplos `if (type === 'X')` para ramificação

## ❌ Violação

```typescript
class PaymentProcessor {
  processPayment(payment: Payment): void {
    // Adicionar novo tipo exige modificar este método - VIOLA OCP
    if (payment.type === 'credit_card') {
      this.processCreditCard(payment);
    } else if (payment.type === 'paypal') {
      this.processPayPal(payment);
    } else if (payment.type === 'bitcoin') {
      this.processBitcoin(payment);
    }
    // Para adicionar 'pix', preciso modificar esta classe
  }

  private processCreditCard(payment: Payment): void { /* ... */ }
  private processPayPal(payment: Payment): void { /* ... */ }
  private processBitcoin(payment: Payment): void { /* ... */ }
}
```

## ✅ Correto (Strategy Pattern)

```typescript
// Abstração: aberta para extensão
interface PaymentStrategy {
  process(payment: Payment): void;
}

// Implementações concretas: extensões sem modificar código existente
class CreditCardPayment implements PaymentStrategy {
  process(payment: Payment): void {
    // Lógica específica de cartão de crédito
  }
}

class PayPalPayment implements PaymentStrategy {
  process(payment: Payment): void {
    // Lógica específica de PayPal
  }
}

class BitcoinPayment implements PaymentStrategy {
  process(payment: Payment): void {
    // Lógica específica de Bitcoin
  }
}

// NOVO: adicionar Pix SEM modificar PaymentProcessor
class PixPayment implements PaymentStrategy {
  process(payment: Payment): void {
    // Lógica específica de Pix
  }
}

// Fechado para modificação: não precisa mudar para adicionar novos tipos
class PaymentProcessor {
  constructor(private readonly strategy: PaymentStrategy) {}

  processPayment(payment: Payment): void {
    this.strategy.process(payment);
  }
}
```

## ✅ Correto (Factory para Instanciação)

```typescript
// Factory centraliza lógica de criação (única vez que switch é aceitável)
class PaymentStrategyFactory {
  create(type: string): PaymentStrategy {
    switch (type) {
      case 'credit_card': return new CreditCardPayment();
      case 'paypal': return new PayPalPayment();
      case 'bitcoin': return new BitcoinPayment();
      case 'pix': return new PixPayment();  // Adicionar aqui apenas
      default: throw new Error('Unknown payment type');
    }
  }
}
```

## Exceções

- **Classes de Orquestração**: Módulos que atuam como Factory para instanciar tipos, onde a lógica `switch` é centralizada

## Rules Relacionadas

- [002 - Proibição da Cláusula ELSE](../../rules/002_proibicao-clausula-else.md): reforça
- [012 - Princípio de Substituição de Liskov](lsp.md): depende
- [013 - Princípio de Segregação de Interface](isp.md): complementa
- [010 - Princípio da Responsabilidade Única](srp.md): complementa
- [014 - Princípio de Inversão de Dependência](dip.md): reforça
