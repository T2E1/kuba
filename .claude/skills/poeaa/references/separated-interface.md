# Separated Interface

**Camada:** Base Patterns
**Complexidade:** Simples
**Intenção:** Define uma interface em um pacote separado da sua implementação, permitindo que clientes dependam apenas da abstração, independente do pacote concreto.

---

## Quando Usar

- Quando um módulo de alto nível (estável) não pode depender diretamente de um módulo de baixo nível (volátil)
- Para quebrar uma dependência circular entre pacotes

## Quando NÃO Usar

- Quando há apenas uma implementação e nenhuma perspectiva de trocar — a indireção extra é overengineering (regra 064)

## Estrutura Mínima (TypeScript)

```typescript
// pacote: domain/payment-gateway.ts (interface, pacote estável)
export interface PaymentGateway {
  charge(amount: Money): Promise<ChargeResult>
}

// pacote: infra/stripe-payment-gateway.ts (implementação, pacote volátil)
import type { PaymentGateway } from '@domain/payment-gateway'
export class StripePaymentGateway implements PaymentGateway { /* ... */ }
```

## Relacionado com

- [regra 014 - Inversão de Dependência](../../../rules/014_principio-inversao-dependencia.md): é a mesma técnica em nível de pacote
- [regra 019 - Dependências Estáveis](../../../rules/019_principio-dependencias-estaveis.md): reforça — a interface fica no pacote estável, a implementação no volátil
- [regra 018 - Dependências Acíclicas](../../../rules/018_principio-dependencias-aciclicas.md): reforça — a técnica clássica para quebrar um ciclo entre pacotes

---

**Camada PoEAA:** Base Patterns
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
