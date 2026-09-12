# Plugin

**Camada:** Base Patterns
**Complexidade:** Moderada
**Intenção:** Liga classes durante a configuração, em vez de em tempo de compilação, para que o comportamento possa variar de acordo com o ambiente de build ou deployment sem alterar o código-fonte.

---

## Quando Usar

- Comportamento que varia por ambiente (produção vs. teste) e deve ser trocado sem recompilar o consumidor
- Quando o Service Stub de um Gateway precisa ser injetado só em teste, via configuração

## Quando NÃO Usar

- Quando a variação pode ser resolvida com um simples parâmetro de construtor — o Plugin adiciona indireção que só se paga em variação por ambiente (regra 064)

## Estrutura Mínima (TypeScript)

```typescript
// A escolha de qual implementação carregar vem de configuração, não de código
function loadPaymentGateway(env: 'production' | 'test'): PaymentGateway {
  if (env === 'test') return new StubPaymentGateway()
  return new StripePaymentGateway()
}
```

## Relacionado com

- [separated-interface.md](separated-interface.md): depende de — o Plugin liga uma implementação a uma interface separada
- [service-stub.md](service-stub.md): complementa — o caso de uso mais comum do Plugin é trocar por um stub em teste
- [regra 014 - Inversão de Dependência](../../../rules/014_principio-inversao-dependencia.md): reforça — a ligação tardia depende do consumidor conhecer só a abstração

---

**Camada PoEAA:** Base Patterns
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
