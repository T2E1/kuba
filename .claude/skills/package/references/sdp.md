# SDP — Stable Dependencies Principle

**Grupo:** Acoplamento
**Rule deMGoncalves:** [019 - Princípio de Dependências Estáveis](../../../rules/019_principio-dependencias-estaveis.md)
**Pergunta:** As dependências apontam na direção da estabilidade (módulos instáveis dependem de estáveis)?

## O Que É

**As dependências de um módulo devem apontar na direção da estabilidade. Módulos instáveis (que mudam com frequência) devem depender de módulos estáveis.**

Violações do SDP fazem com que módulos de alto nível (mais importantes para o negócio) dependam de módulos de baixo nível e voláteis, propagando mudanças e reduzindo a testabilidade.

## Métrica de Instabilidade (I)

```
I = Fan-out / (Fan-in + Fan-out)

Fan-out = Dependências de saída (quantos módulos este módulo depende)
Fan-in = Dependências de entrada (quantos módulos dependem deste módulo)

I ∈ [0, 1]
I = 0 → Máxima estabilidade
I = 1 → Máxima instabilidade
```

**Regra**: Instabilidade deve ser < 0.5 para módulos críticos de negócio.

## Quando está sendo violado

- Módulo de política de negócio (alto nível) tem I > 0.5
- Módulo estável (I baixo) depende de módulo instável (I alto)
- Camada de domínio importa classes concretas de camada de infraestrutura

## ❌ Violação

```typescript
// domain/OrderService.ts (Módulo crítico de negócio)
import { MySQLClient } from '../infra/MySQLClient';  // ❌ Concreto + volátil
import { SendGridEmailer } from '../infra/SendGridEmailer';  // ❌ Volátil

export class OrderService {
  db = new MySQLClient();  // ❌ Depende de infra instável
  emailer = new SendGridEmailer();

  async createOrder(data: any) {
    // Fan-out = 2 (depende de MySQL, SendGrid)
    // Fan-in = 0 (ninguém depende dele ainda)
    // I = 2 / (0 + 2) = 1.0 ❌ Máxima instabilidade!
  }
}

// Problema: OrderService (domínio) é instável e depende de infra
```

## ✅ Correto

```typescript
// domain/OrderService.ts (Módulo estável)
export interface Database {
  save(data: any): Promise<void>;
}

export interface Emailer {
  send(to: string, subject: string): Promise<void>;
}

export class OrderService {
  constructor(
    private db: Database,  // ✅ Depende de abstração
    private emailer: Emailer  // ✅ Depende de abstração
  ) {}

  async createOrder(data: any) {
    await this.db.save(data);
    await this.emailer.send(data.email, 'Order created');
  }
}

// Métricas após injeção de dependência:
// Fan-out = 0 (depende apenas de abstrações internas)
// Fan-in = 5 (5 módulos dependem de OrderService)
// I = 0 / (5 + 0) = 0.0 ✅ Máxima estabilidade!

// infra/MySQLClient.ts (Módulo instável pode mudar livremente)
import type { Database } from '../domain/OrderService';

export class MySQLClient implements Database {
  async save(data: any) { /* ... */ }
}
// Fan-out = 1 (depende de abstração de domain)
// Fan-in = 0
// I = 1 / (0 + 1) = 1.0 ✅ Pode ser instável (camada de infra)
```
