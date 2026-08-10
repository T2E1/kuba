# SAP — Stable Abstractions Principle

**Grupo:** Acoplamento
**Rule deMGoncalves:** [020 - Princípio de Abstrações Estáveis](../../../rules/020_principio-abstracoes-estaveis.md)
**Pergunta:** Um pacote estável (I baixo) é abstrato (A alto)? Um pacote instável (I alto) é concreto (A baixo)?

## O Que É

**Um pacote deve ser tão abstrato quanto for estável, e tão concreto quanto for instável.**

SAP vincula estabilidade (SDP) à abstração (DIP). A violação ocorre quando:
- Módulo altamente **estável** (difícil de mudar) é **concreto** → impede extensão
- Módulo altamente **instável** (fácil de mudar) é **abstrato** → atrasa implementação

## Métricas

### Abstração (A)
```
A = Total de Abstrações / Total de Classes
A ∈ [0, 1]

A = 0 → 100% concreto
A = 1 → 100% abstrato
```

### Distância da Main Sequence (D)
```
D = |A + I - 1|
D ∈ [0, 1]

D ≈ 0 → Na Main Sequence (ideal)
D ≈ 1 → Zona de Dor ou Zona de Inutilidade
```

### Zonas
- **Zona de Dor** (A=0, I=0): Pacote concreto e estável → difícil de mudar
- **Zona de Inutilidade** (A=1, I=1): Pacote abstrato e instável → sem valor
- **Sequência Principal** (A + I = 1): Equilíbrio ideal

## Quando está sendo violado

- Módulo de negócio estável (I < 0.2) mas 100% concreto (A = 0) → Zone of Pain
- Módulo abstrato (A > 0.8) mas instável (I > 0.8) → Zone of Uselessness
- Distância D > 0.2 da Main Sequence
- Pacote de alto nível tem < 60% de classes abstratas/interfaces

## ❌ Violação

```typescript
// domain/ (Módulo de negócio crítico)
// Fan-in = 10, Fan-out = 0 → I = 0.0 (Estável)
// 0 interfaces, 5 classes concretas → A = 0.0 (100% concreto)

export class OrderService {  // ❌ Classe concreta
  async createOrder(data: any) { /* ... */ }
  async updateOrder(id: string, data: any) { /* ... */ }
}

export class PaymentService {  // ❌ Classe concreta
  async processPayment(orderId: string) { /* ... */ }
}

// D = |0.0 + 0.0 - 1| = 1.0 ❌ Zone of Pain!
// Módulo estável mas 100% concreto — difícil de estender
```

## ✅ Correto

```typescript
// domain/ (Módulo de negócio crítico)
// Fan-in = 10, Fan-out = 0 → I = 0.0 (Estável)
// 3 interfaces, 2 classes concretas → A = 0.6 (60% abstrato)

// Abstrações (interfaces) ✅
export interface OrderRepository {
  save(order: Order): Promise<void>;
  findById(id: string): Promise<Order | null>;
}

export interface PaymentGateway {
  charge(amount: number): Promise<string>;
}

export interface NotificationService {
  notify(userId: string, message: string): Promise<void>;
}

// Implementações concretas ✅
export class Order {  // Value Object concreto
  constructor(
    public id: string,
    public total: number
  ) {}
}

export class OrderService {  // Orquestração
  constructor(
    private repo: OrderRepository,  // ✅ Depende de abstração
    private payment: PaymentGateway,  // ✅ Depende de abstração
    private notifier: NotificationService  // ✅ Depende de abstração
  ) {}
}

// D = |0.6 + 0.0 - 1| = 0.4 ✅ Ainda não ideal, mas melhor
// Meta: A = 1.0 (100% abstrato) para I = 0.0
// D = |1.0 + 0.0 - 1| = 0.0 ✅ Main Sequence!

// infra/ (Módulo de implementação)
// Fan-in = 0, Fan-out = 3 → I = 1.0 (Instável)
// 0 interfaces, 3 classes concretas → A = 0.0 (100% concreto)

export class MySQLOrderRepository implements OrderRepository {
  // ✅ Concreto + Instável = OK
}

export class StripePaymentGateway implements PaymentGateway {
  // ✅ Concreto + Instável = OK
}

// D = |0.0 + 1.0 - 1| = 0.0 ✅ Main Sequence!
```
