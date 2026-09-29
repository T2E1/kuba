---
title: "Feature Envy"
category: "Code Smells"
type: reference
id: "BEHAVIORAL-029"
severity: "🟡 Medium"
tags: [code-smells]
---

# Feature Envy

## Explanation

### O que é

Feature Envy ocorre quando um método usa dados e comportamentos de outra classe mais do que da sua própria. Indica que o método está na classe errada — ele "inveja" a outra classe e deveria estar lá. O método parece mais interessado nos dados de outro objeto do que nos seus próprios.

### Por que importa

- Violação de encapsulamento: método precisa expor dados internos de outra classe (`getters`)
- Acoplamento desnecessário: dificulta mudar uma classe sem quebrar a outra
- Lógica fragmentada: para entender uma regra de negócio completa, precisa ler múltiplas classes
- Dificuldade de teste: testar o método requer construir objeto de outra classe com estado correto
- Violação de [Tell, Don't Ask](../skills/calisthenics/references/diga-nao-pergunte.md): perguntando por estado em vez de solicitar comportamento

## How-to

### Exemplo

```javascript
// ❌ calculateBill está em Reservation mas usa dados de Customer
class Reservation {
  calculateBill(customer) {
    const base = this.nights * this.room.rate;
    // usa 3 atributos de customer — está na classe errada
    if (customer.membershipYears > 2) return base * 0.9;
    if (customer.totalSpent > 5000) return base * 0.95;
    return base;
  }
}
```

```javascript
// ✅ Lógica de desconto pertence a Customer (Move Method)
class Customer {
  applyDiscount(base) {
    if (this.membershipYears > 2) return base * 0.9;
    if (this.totalSpent > 5000) return base * 0.95;
    return base;
  }
}

class Reservation {
  calculateBill(customer) {
    const base = this.nights * this.room.rate;
    return customer.applyDiscount(base); // Tell, Don't Ask
  }
}
```

```typescript
// FIXME: Feature Envy — calculateBill usa customer.membershipYears, customer.totalSpent
// TODO: Move Method — mover lógica de desconto para Customer.applyDiscount()
```

## Reference

### Critérios Objetivos

- [ ] Método chama getters de outro objeto 3 ou mais vezes
- [ ] Método acessa propriedades de outro objeto mais do que `this`
- [ ] Método parece estar trabalhando nos dados de outro objeto em vez dos seus próprios
- [ ] Para testar o método, precisa configurar estado complexo de objetos dependentes
- [ ] Método que não usa nenhum atributo ou método da própria classe, apenas dependências

### Exceções Permitidas

- **Orquestradores**: Controllers que coordenam fluxos entre múltiplos serviços.
- **Mappers e [DTOs](../skills/poeaa/references/data-transfer-object.md)**: Extraem dados de vários objetos para formatar ou serializar.
- **Event Handlers Agregadores**: Agregam dados de fontes diferentes para um processamento único.
- **Código Legado**: Quando a refatoração traria alto risco sem ganho claro.

### Como Detectar

#### Manual

- Ler métodos: identificar aqueles que repetidamente chamam `obj.getSomething()`
- Verificar métodos que não usam `this` internamente (ou usam minimamente)
- Analisar testes: se testar método requer setup complexo de dependências externas, pode ser feature envy

#### Automático

- Sem regra nativa de Biome para acoplamento por acesso a dados externos — detecção via revisão de código

## Related to

- [Tell, Don't Ask](../skills/calisthenics/references/diga-nao-pergunte.md): reinforces
- [Getters/Setters](../skills/calisthenics/references/getters-setters.md): reinforces
- [Acyclic Dependencies Principle (ADP)](../skills/package/SKILL.md): complements
- [035 — Middle Man](035_middle-man.md): complements
- [Primitive Domain Encapsulation](../skills/calisthenics/references/encapsulamento-primitivos.md): reinforces
- [021 — Data Class](021_classe-de-dados.md): reinforces — uma Data Class atrai Feature Envy porque não tem comportamento próprio para chamar.
- [032 — Intimidade Inadequada](032_intimidade-inadequada.md): complements — Feature Envy é o pródromo de um acoplamento que, sem correção, vira Inappropriate Intimacy.
