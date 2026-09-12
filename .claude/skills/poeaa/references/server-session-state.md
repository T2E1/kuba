# Server Session State

**Camada:** Session State
**Complexidade:** Simples
**Intenção:** Guarda o estado da sessão em memória no servidor (ou em cache distribuído), identificado por um token de sessão enviado pelo cliente.

---

## Quando Usar

- Estado grande demais ou sensível demais para trafegar no cliente
- Aplicações com poucos servidores, onde afinidade de sessão ou cache distribuído resolvem o problema

## Quando NÃO Usar

- Sistemas que precisam escalar horizontalmente sem afinidade de sessão — considerar Client ou Database Session State
- Estado que precisa sobreviver a reinício do processo do servidor sem cache externo

## Estrutura Mínima (exemplo genérico)

```
Cliente envia sessionId → servidor busca estado em cache (ex: Redis) por esse id → processa → atualiza cache
```

## Relacionado com

- [client-session-state.md](client-session-state.md): complementa — trade-off oposto
- [database-session-state.md](database-session-state.md): complementa — alternativa quando o estado precisa sobreviver ao servidor
- [regra 045 - Processos Stateless](../../../rules/045_processos-stateless.md): complementa — o cache externo mantém o processo em si stateless

---

**Camada PoEAA:** Session State
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
