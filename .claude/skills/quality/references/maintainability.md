# Maintainability — Manutenibilidade

**Dimensão:** Revisão
**Severidade Padrão:** 🟠 Importante
**Questão-Chave:** É fácil de corrigir?

## O que é

O esforço necessário para localizar e corrigir um defeito no software. Alta manutenibilidade significa que bugs podem ser encontrados rapidamente, as causas são óbvias e as correções podem ser feitas sem efeitos colaterais.

## Indicadores de Problema

| Situação | Severidade |
|----------|-----------|
| God class (> 500 linhas) | 🔴 Blocker |
| Método com CC > 10 | 🟠 Importante |
| Código duplicado significativo | 🟠 Importante |
| Logs insuficientes | 🟡 Sugestão |

## Exemplo de Violação

```javascript
// ❌ Não manutenível - classe faz tudo
class OrderManager {
  createOrder() { /* ... */ }
  validateOrder() { /* ... */ }
  calculateTax() { /* ... */ }
  sendEmail() { /* ... */ }
  // ... 500 linhas de código
}

// ✅ Manutenível - responsabilidades separadas
class OrderService {
  constructor(validator, calculator, notifier) {
    this.validator = validator;
    this.calculator = calculator;
    this.notifier = notifier;
  }

  async createOrder(data) {
    const order = this.validator.validate(data);
    order.total = this.calculator.calculate(order);
    await this.notifier.notify(order);
    return order;
  }
}
```

## Codetags Sugeridas

```javascript
// REFACTOR: Esta classe viola o SRP - separar em serviços menores
// REFACTOR: Método muito complexo - extrair submétodos
```

## Calibração de Severidade

| Situação | Severidade |
|----------|-----------|
| God class (> 500 linhas) | 🔴 Blocker |
| Método com CC > 10 | 🟠 Importante |
| Código duplicado significativo | 🟠 Importante |
| Logs insuficientes | 🟡 Sugestão |

## Regras Relacionadas

- 010 - Princípio da Responsabilidade Única
- 007 - Limite Máximo de Linhas por Classe
- 025 - Proibição do Anti-Pattern The Blob
