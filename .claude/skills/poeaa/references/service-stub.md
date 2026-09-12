# Service Stub

**Camada:** Base Patterns
**Complexidade:** Simples
**Intenção:** Substitui um serviço externo caro ou indisponível em teste por uma implementação leve que retorna respostas previsíveis, mantendo o mesmo contrato do serviço real.

---

## Quando Usar

- Testar código que depende de um serviço externo (pagamento, e-mail, API de terceiro) sem chamar o serviço de verdade
- Reproduzir cenários difíceis de forçar no serviço real (timeout, erro 500, resposta específica)

## Quando NÃO Usar

- Testes de integração que existem justamente para validar a integração real — nesse escopo o stub esconderia o que se quer provar

## Estrutura Mínima (TypeScript)

```typescript
class StubPaymentGateway implements PaymentGateway {
  constructor(private readonly result: ChargeResult = { success: true, transactionId: 'stub-1' }) {}

  async charge(): Promise<ChargeResult> {
    return this.result
  }
}
```

## Relacionado com

- [gateway.md](gateway.md): depende de — o Service Stub implementa a mesma interface do Gateway real
- [plugin.md](plugin.md): complementa — o Plugin é o mecanismo que troca o Gateway real pelo stub em teste
- [regra 032 - Cobertura Mínima de Testes](../../../rules/032_cobertura-teste-minima-qualidade.md): reforça — viabiliza testar o domínio sem depender de infraestrutura externa

---

**Camada PoEAA:** Base Patterns
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
