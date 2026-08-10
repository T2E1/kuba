# Large Class

**Severidade:** 🟠 Alta
**Regra Associada:** Regra 007

## O Que É

Classe com atributos e métodos em excesso, indicando que está tentando fazer coisas demais. Fowler: quando uma classe tem responsabilidades demais, code smells de duplicação e falta de coesão surgem naturalmente. Estágio inicial de um The Blob.

## Sintomas

- Arquivos de classe com mais de 50 linhas de código (excluindo linhas em branco e comentários)
- Classes que chegam a 40 linhas devem ser candidatas à refatoração
- Mais de 300–500 linhas
- Prefixos/sufixos em atributos para distinguir grupos (`userEmail`, `orderEmail`, `shippingEmail`)
- Subconjuntos de atributos usados apenas por subconjuntos de métodos
- Testes que precisam de mocks extensos para testar um único comportamento
- Uma classe não deve conter mais de 10 métodos públicos

## ❌ Exemplo (violação)

```javascript
// ❌ Classe misturando perfil, endereço e pagamento (> 50 linhas)
class User {
  constructor() {
    this.name = '';
    this.email = '';
    this.street = '';       // endereço
    this.city = '';         // endereço
    this.zipCode = '';      // endereço
    this.cardNumber = '';   // pagamento
    this.cardExpiry = '';   // pagamento
  }
  formatAddress() { ... }
  validateCard() { ... }
  sendEmail() { ... }
}
```

## ✅ Refatoração

```javascript
// ✅ Cada conceito em sua própria classe (Extract Class)
class User { constructor({ name, email }) { ... } }
class Address { constructor({ street, city, zipCode }) { ... } }
class PaymentMethod { constructor({ cardNumber, cardExpiry }) { ... } }

// Composição em vez de classe monolítica
class UserAccount {
  constructor(user, address, paymentMethod) {
    this.user = user;
    this.address = address;
    this.paymentMethod = paymentMethod;
  }
}
```

## Codetag Sugerido

```typescript
// FIXME: Large Class — User tem 87 linhas, mistura perfil + endereço + pagamento
// TODO: Extract Class — criar Address, PaymentMethod separados
```
