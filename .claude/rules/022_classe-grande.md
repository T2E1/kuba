---
title: "Classe Grande (Large Class)"
category: "Code Smells"
type: reference
id: "STRUCTURAL-022"
severity: "🟠 High"
tags: [code-smells]
---

# Classe Grande (Large Class)

## Explanation

### O que é

Uma classe acumulou campos, métodos ou linhas de código demais tentando fazer trabalho demais sozinha. É a versão em nível de classe do [033 — Long Method](033_limite-maximo-linhas-metodo.md): em vez de um método fazer muita coisa, é a classe inteira que virou um repositório de responsabilidades. Estágio inicial de um [001 — The Blob](001_anti-pattern-the-blob.md).

### Por que importa

- Dificulta entender a classe inteira de uma vez; ninguém consegue guardar seu propósito na cabeça
- Concentra motivos de mudança diferentes no mesmo arquivo, aumentando o risco de regressão
- Torna testes unitários lentos e acoplados, pois cada teste carrega todo o estado da classe
- É o estágio inicial que, sem intervenção, evolui para o anti-pattern The Blob

## How-to

### Exemplo

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

```typescript
// FIXME: Large Class — User tem 87 linhas, mistura perfil + endereço + pagamento
// TODO: Extract Class — criar Address, PaymentMethod separados
```

## Reference

### Critérios Objetivos

- [ ] A classe não deve exceder o limite de linhas definido para arquivos de classe.
- [ ] O número de campos de instância não deve ultrapassar **10**.
- [ ] Uma classe não deve conter mais de 10 métodos públicos.
- [ ] Se a classe tem grupos de campos/métodos que nunca são usados juntos, é sinal de responsabilidades misturadas.

### Exceções Permitidas

- **Classes Geradas Automaticamente**: código gerado por ferramentas (ex: clientes de API, schemas) que não é editado manualmente.

### Como Detectar

#### Manual

- Ler a lista de métodos públicos: se não cabe uma frase para descrever o propósito único da classe, ela é grande demais
- Prefixos/sufixos em atributos para distinguir grupos (`userEmail`, `orderEmail`, `shippingEmail`) indicam responsabilidades misturadas
- Testes que precisam de mocks extensos para testar um único comportamento

#### Automático

- Biome: `complexity/noExcessiveCognitiveComplexity` combinado com contagem de linhas do arquivo

## Related to

- [Maximum Lines per Class File](../skills/calisthenics/references/limite-maximo-linhas-classe.md): reinforces
- [SRP - Single Responsibility Principle](../skills/solid/SKILL.md): reinforces
- [001 — The Blob (God Object)](001_anti-pattern-the-blob.md): precedes — Classe Grande não tratada tende a virar The Blob
- [036 — Divergent Change](036_mudanca-divergente.md): reinforces — múltiplas responsabilidades na mesma classe fazem-na mudar por vários motivos diferentes.
- [033 — Long Method](033_limite-maximo-linhas-metodo.md): reinforces — a mesma acumulação de responsabilidades que infla a classe costuma inflar seus métodos.
- [Facade](../skills/gof/references/facade.md): complements — extrair uma Facade pode reduzir a superfície pública de uma classe grande sem perder coesão interna.
- [023 — Lazy Class](023_classe-preguicosa.md): contrasts — Large Class faz responsabilidades demais, Lazy Class faz de menos para justificar sua existência.
