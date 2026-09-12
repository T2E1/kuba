# Service Layer

**Camada:** Domain Logic
**Complexidade:** Moderada
**Intenção:** Define uma fronteira de aplicação com um conjunto de operações disponíveis e coordena a resposta em cada operação, orquestrando a lógica de domínio sem contê-la.

---

## Quando Usar

- Quando múltiplos tipos de cliente (UI web, API, CLI) precisam da mesma lógica de coordenação
- Para definir transações e controle de acesso num único ponto de entrada
- Quando o Domain Model é rico o bastante para merecer uma fachada de orquestração

## Quando NÃO Usar

- Aplicação com um único tipo de cliente e domínio simples (overengineering — regra 064)
- Quando o Service Layer apenas repassa chamada por chamada ao domínio sem coordenar nada (Middle Man, regra 061)

## Estrutura Mínima (TypeScript)

```typescript
class SubscriptionService {
  constructor(
    private readonly subscribers: SubscriberRepository,
    private readonly billing: BillingGateway,
  ) {}

  async cancelSubscription(subscriberId: string): Promise<void> {
    const subscriber = await this.subscribers.findById(subscriberId)
    if (!subscriber) throw new SubscriberNotFoundError(subscriberId)
    subscriber.cancel()
    await this.billing.stopCharging(subscriber.billingId)
    await this.subscribers.save(subscriber)
  }
}
```

## Relacionado com

- [domain-model.md](domain-model.md): depende de — Service Layer orquestra o domínio, não substitui suas regras
- [repository.md](repository.md): complementa — Service Layer consome repositórios para orquestrar persistência
- [regra 010 - Responsabilidade Única](../../../rules/010_principio-responsabilidade-unica.md): reforça — coordena, não contém regra de negócio
- [regra 061 - Proibição de Middle Man](../../../rules/061_proibicao-middle-man.md): reforça — o risco de virar repasse puro ao domínio

---

**Camada PoEAA:** Domain Logic
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
