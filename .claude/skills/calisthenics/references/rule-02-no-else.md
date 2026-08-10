# Regra 2 — Proibição da Cláusula No ELSE

**Regra deMGoncalves:** COMPORTAMENTAL-002
**Questão:** Este método usa `else` ou `else if`?

## O que é

Restringe o uso das cláusulas `else` e `else if`, promovendo a substituição por guard clauses (retorno antecipado) ou padrões de polimorfismo para lidar com diferentes caminhos de execução.

## Quando Aplicar

- Método contém a palavra-chave `else`
- Método contém a palavra-chave `else if`
- Lógica de ramificação por tipo (if type === 'A')

## ❌ Violação

```typescript
class PaymentProcessor {
  processPayment(payment: Payment): void {
    if (payment.isValid()) {
      this.charge(payment);
    } else {
      this.logError(payment);  // ELSE - VIOLA
    }
  }
}
```

## ✅ Correto

```typescript
class PaymentProcessor {
  processPayment(payment: Payment): void {
    if (!payment.isValid()) {
      this.logError(payment);
      return;  // Retorno antecipado
    }
    this.charge(payment);
  }
}
```

## ✅ Correto (Polimorfismo)

```typescript
interface PaymentStrategy {
  process(): void;
}

class CreditCardPayment implements PaymentStrategy {
  process(): void { /* ... */ }
}

class PayPalPayment implements PaymentStrategy {
  process(): void { /* ... */ }
}
```

## Exceções

- **Estruturas switch**: Desde que cada `case` retorne ou encerre a execução

## Regras Relacionadas

- [001 - Single Indentation Level](rule-01-single-indentation.md): reforça
- [008 - Proibição de Getters/Setters](rule-08-no-getters-setters.md): reforça
- [011 - Princípio Aberto/Fechado](../../rules/011_principio-aberto-fechado.md): reforça
