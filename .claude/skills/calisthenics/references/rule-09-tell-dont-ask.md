# Regra 9 — Tell, Don't Ask

**Regra deMGoncalves:** COMPORTAMENTAL-009
**Questão:** Este código pergunta pelo estado para decidir uma ação?

## O que é

Exige que um método chame métodos ou acesse propriedades apenas de seus "vizinhos imediatos": o próprio objeto, objetos passados como argumento, objetos que ele cria ou objetos que são propriedades internas diretas.

**Princípio**: Diga ao objeto o que fazer, não pergunte pelo seu estado para tomar decisões.

## Quando Aplicar

- Código pergunta pelo estado: `if (obj.getStatus() === 'X')`
- Código decide ação baseado no estado de outro objeto
- Train wreck: `a.getB().getC().f()`
- Violação da Lei de Demeter

## ❌ Violação

```typescript
class OrderProcessor {
  process(order: Order): void {
    // PERGUNTA estado para decidir - VIOLA
    if (order.getStatus() === 'pending') {
      if (order.getPayment().isPaid()) {
        order.setStatus('processing');
        order.getCustomer().sendEmail('Pedido em processamento');
      }
    }
  }
}
```

## ✅ Correto

```typescript
class OrderProcessor {
  process(order: Order): void {
    // DIZ ao objeto o que fazer
    order.processIfReady();
  }
}

class Order {
  processIfReady(): void {
    if (!this.status.isPending()) return;
    if (!this.payment.isPaid()) return;

    this.status = OrderStatus.processing();
    this.customer.notifyProcessing();
  }
}
```

## ✅ Correto (Ainda Melhor)

```typescript
class Order {
  processIfReady(): void {
    // Cada objeto tem sua própria responsabilidade
    this.validateCanProcess();
    this.startProcessing();
    this.notifyCustomer();
  }

  private validateCanProcess(): void {
    if (!this.status.isPending()) {
      throw new InvalidStatusError();
    }
    if (!this.payment.isPaid()) {
      throw new UnpaidOrderError();
    }
  }

  private startProcessing(): void {
    this.status = OrderStatus.processing();
  }

  private notifyCustomer(): void {
    this.customer.notifyProcessing();
  }
}
```

## Exceções

- **Fluent Interfaces**: Builders onde o método retorna `this`
- **DTOs/Value Objects**: Acesso a dados de contêineres puramente de dados

## Regras Relacionadas

- [008 - Proibição de Getters/Setters](rule-08-no-getters-setters.md): reforça
- [005 - One Dot per Line](rule-05-one-dot-per-line.md): reforça
- [012 - Princípio de Substituição de Liskov](../../rules/012_principio-substituicao-liskov.md): reforça
