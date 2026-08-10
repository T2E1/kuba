# CCP — Common Closure Principle

**Grupo:** Coesão
**Rule deMGoncalves:** [016 - Princípio do Fechamento Comum](../../../rules/016_principio-fechamento-comum.md)
**Pergunta:** Classes que mudam juntas pelo mesmo motivo estão empacotadas juntas?

## O Que É

**Classes que mudam juntas pela mesma razão devem ser empacotadas juntas.**

CCP é o SRP (Single Responsibility Principle) aplicado no nível de pacote. Garante que modificações de software sejam localizadas — um requisito de mudança deve afetar apenas um pacote, não espalhar mudanças por múltiplos pacotes.

## Quando está sendo violado

- Um único *feature request* causa modificações em mais de 3 arquivos/classes espalhados por múltiplos pacotes não relacionados
- Classes relacionadas a uma única entidade de domínio estão em pacotes diferentes
- Histórico de commits mostra que múltiplos pacotes são sempre modificados juntos

## ❌ Violação

```typescript
// Classes relacionadas espalhadas ❌
src/
├── entities/
│   └── Order.ts
├── services/
│   └── OrderService.ts
├── repositories/
│   └── OrderRepository.ts
└── factories/
    └── OrderFactory.ts

// Problema: mudança em "Order" exige tocar 4 pacotes diferentes
// Commit: "Add status field to Order" modifica:
// - entities/Order.ts
// - services/OrderService.ts
// - repositories/OrderRepository.ts
// - factories/OrderFactory.ts
```

## ✅ Correto

```typescript
// Classes que mudam juntas empacotadas juntas ✅
src/
├── order/                    // Pacote coeso
│   ├── Order.ts
│   ├── OrderService.ts
│   ├── OrderRepository.ts
│   └── OrderFactory.ts
└── payment/                  // Outro pacote coeso
    ├── Payment.ts
    ├── PaymentService.ts
    └── PaymentGateway.ts

// Mudança em "Order" afeta apenas src/order/
// Commit: "Add status field to Order" modifica:
// - order/Order.ts
// - order/OrderService.ts
// - order/OrderRepository.ts
// Localizado em um único pacote ✅
```
