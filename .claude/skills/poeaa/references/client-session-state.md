# Client Session State

**Camada:** Session State
**Complexidade:** Simples
**Intenção:** Guarda o estado da sessão no próprio cliente, sendo reenviado ao servidor em cada requisição.

---

## Quando Usar

- Estado pequeno e não sensível (ex: preferências de UI, carrinho de compras simples)
- Quando o servidor deve permanecer stateless para escalar horizontalmente sem afinidade de sessão

## Quando NÃO Usar

- Estado sensível ou grande demais para trafegar em cada requisição — usar Server ou Database Session State
- Dado que precisa de integridade garantida — o cliente pode adulterar o que envia

## Estrutura Mínima (exemplo genérico)

```
Requisição HTTP → cookie/token assinado carrega { cartId, itemCount } → servidor lê e nunca confia sem validar assinatura
```

## Relacionado com

- [server-session-state.md](server-session-state.md): complementa — trade-off oposto
- [regra 045 - Processos Stateless](../../../rules/045_processos-stateless.md): reforça — Client Session State é o que permite o servidor ser stateless
- [regra 030 - Proibição de Funções Inseguras](../../../rules/030_proibicao-funcoes-inseguras.md): reforça — o estado vindo do cliente é entrada não confiável e deve ser validado

---

**Camada PoEAA:** Session State
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
