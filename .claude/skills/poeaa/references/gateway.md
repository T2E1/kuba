# Gateway

**Camada:** Base Patterns
**Complexidade:** Simples
**Intenção:** Encapsula o acesso a um recurso ou sistema externo (banco, serviço de terceiro, fila) atrás de uma interface própria, minimizando o número de métodos e mantendo o acoplamento em um único ponto.

---

## Quando Usar

- Qualquer integração com sistema externo (pagamento, e-mail, API de terceiro)
- Para permitir substituir a implementação real por um Service Stub em testes

## Quando NÃO Usar

- Quando a "gateway" apenas repassa cada método do SDK externo sem simplificar nada (Middle Man, regra 061)

## Estrutura Mínima (TypeScript)

```typescript
interface PaymentGateway {
  charge(amount: Money, cardToken: string): Promise<ChargeResult>
}

class StripePaymentGateway implements PaymentGateway {
  async charge(amount: Money, cardToken: string): Promise<ChargeResult> {
    const response = await this.stripeClient.charges.create({ amount: amount.amount, source: cardToken })
    return { success: response.status === 'succeeded', transactionId: response.id }
  }
}
```

## Relacionado com

- [service-stub.md](service-stub.md): complementa — o Gateway é o que se troca por um Service Stub em teste
- [regra 014 - Inversão de Dependência](../../../rules/014_principio-inversao-dependencia.md): reforça — o domínio depende da interface do Gateway, não do SDK concreto
- [regra 061 - Proibição de Middle Man](../../../rules/061_proibicao-middle-man.md): reforça — o risco de virar repasse puro

---

**Camada PoEAA:** Base Patterns
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
