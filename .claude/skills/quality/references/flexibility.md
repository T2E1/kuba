# Flexibility — Flexibilidade

**Dimensão:** Revisão
**Severidade Padrão:** 🟠 Importante
**Questão-Chave:** É fácil de alterar?

## O que é

O esforço necessário para modificar o software a fim de atender novos requisitos ou mudanças de negócio. Alta flexibilidade significa que novas funcionalidades podem ser adicionadas sem alterar o código existente (Princípio Aberto/Fechado).

## Indicadores de Problema

| Situação | Severidade |
|----------|-----------|
| Dependência circular entre módulos | 🔴 Blocker |
| Switch com > 5 cases em crescimento | 🟠 Importante |
| new Concreto() em classe de negócio | 🟠 Importante |
| Herança com > 3 níveis | 🟡 Sugestão |

## Exemplo de Violação

```javascript
// ❌ Não flexível - precisa de modificação para cada novo tipo
function calculateShipping(order) {
  switch (order.type) {
    case 'standard': return order.weight * 5;
    case 'express': return order.weight * 10;
    // Cada novo tipo exige modificar esta função
  }
}

// ✅ Flexível - extensível sem modificação
class ShippingCalculator {
  constructor(strategies) {
    this.strategies = strategies;
  }

  calculate(order) {
    const strategy = this.strategies.get(order.type);
    return strategy.calculate(order);
  }
}
```

## Codetags Sugeridas

```javascript
// OCP(011): Este switch viola o Aberto/Fechado - considerar Strategy
// DIP(014): Dependência concreta - injetar via construtor
```

## Calibração de Severidade

| Situação | Severidade |
|----------|-----------|
| Dependência circular entre módulos | 🔴 Blocker |
| Switch com > 5 cases em crescimento | 🟠 Importante |
| new Concreto() em classe de negócio | 🟠 Importante |
| Herança com > 3 níveis | 🟡 Sugestão |

## Regras Relacionadas

- 011 - Princípio Aberto/Fechado
- 014 - Princípio de Inversão de Dependência
- 018 - Princípio de Dependências Acíclicas
