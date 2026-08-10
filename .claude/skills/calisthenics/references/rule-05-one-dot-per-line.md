# Regra 5 — One Dot per Line

**Regra deMGoncalves:** ESTRUTURAL-005
**Questão:** Esta linha tem múltiplos acessos encadeados (pontos)?

## O que é

Limita o encadeamento de chamadas de métodos e o acesso a propriedades encadeadas (train wrecks), permitindo no máximo uma chamada de método ou acesso a propriedade por linha.

## Quando Aplicar

- Linha contém `a.b().c()`
- Linha contém `objeto.getA().getB()`
- Código viola a Lei de Demeter
- Train wreck: `user.getAddress().getCity().getName()`

## ❌ Violação

```typescript
class OrderProcessor {
  process(order: Order): void {
    // Três pontos na mesma linha - VIOLA
    const cityName = order.getCustomer().getAddress().getCity();

    // Viola a Lei de Demeter
    order.getPayment().getCard().charge();
  }
}
```

## ✅ Correto

```typescript
class OrderProcessor {
  process(order: Order): void {
    // Tell, Don't Ask: diga ao objeto o que fazer
    order.processPayment();

    // Ou quebrar em linhas separadas com intenção clara
    const customer = order.getCustomer();
    const cityName = customer.getCityName();
  }
}
```

## ✅ Correto (Melhor Abordagem)

```typescript
class Order {
  processPayment(): void {
    this.payment.charge();  // Encapsula acesso interno
  }

  getCustomerCityName(): string {
    return this.customer.getCityName();  // Delega responsabilidade
  }
}
```

## Exceções

- **Fluent Interfaces/Builders**: `new Query().where().limit()` onde cada método retorna `this`
- **Constantes Estáticas**: `Math.PI`, `Config.MAX_VALUE`

## Regras Relacionadas

- [009 - Tell, Don't Ask](rule-09-tell-dont-ask.md): reforça
- [008 - Proibição de Getters/Setters](rule-08-no-getters-setters.md): reforça
- [022 - Simplicidade e Clareza](../../rules/022_priorizacao-simplicidade-clareza.md): complementa
