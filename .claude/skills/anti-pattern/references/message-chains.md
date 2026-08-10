# Message Chains (Train Wreck)

**Severidade:** 🟡 Média
**Regra Associada:** Regra 005/009

## O Que É

Sequência de chamadas encadeadas onde cada resultado serve como receptor para a próxima chamada: `a.getB().getC().getD().getValue()`. O cliente conhece a estrutura interna de toda a cadeia de objetos. Violação da Lei de Demeter.

## Sintomas

- Linhas com 3 ou mais chamadas encadeadas navegando objetos
- Código que quebra quando a estrutura interna de qualquer objeto da cadeia muda
- Difícil de mockar para testes: precisa de stubs profundos
- Segurança contra null problemática: falha difícil de diagnosticar no meio da cadeia

## ❌ Exemplo (violação)

```javascript
// ❌ Cadeia que expõe estrutura interna profunda (Train Wreck)
const city = order.getCustomer().getAddress().getCity().getName();

// ❌ Falha de null obscura: qual objeto é null?
const url = order.getUser().getProfile().getAvatar().getUrl();
```

## ✅ Refatoração

```javascript
// ✅ Cada objeto encapsula o acesso ao seu vizinho (Hide Delegate)
class Order {
  getCustomerCity() {
    return this.customer.getCity(); // encapsula a navegação
  }
}

const city = order.getCustomerCity();

// ✅ Ou usar optional chaining para segurança (se a estrutura for inevitável)
const url = order.getUser()?.getProfile()?.getAvatar()?.getUrl();
```

## Codetag Sugerido

```typescript
// FIXME: Message Chains — order.getCustomer().getAddress().getCity().getName()
// TODO: Hide Delegate — criar order.getCustomerCity()
```
