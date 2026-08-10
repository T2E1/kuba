# Chain of Responsibility

**Categoria:** Comportamental
**Intenção:** Evitar o acoplamento do remetente de uma requisição ao seu receptor, dando a mais de um objeto a chance de tratar a requisição, encadeando os objetos receptores.

---

## Quando Usar

- Pipelines de processamento (middleware, filtros HTTP)
- Quando mais de um objeto pode tratar uma requisição e o handler não é conhecido a priori
- Para implementar sistemas hierárquicos de aprovação
- Tratamento de eventos com múltiplos listeners em cascata

## Quando NÃO Usar

- Quando criar cadeias muito longas sem necessidade real (overengineering — rule 064)
- Quando a requisição deve sempre ser processada por um handler específico e conhecido
- Quando a ordem dos handlers importa mas não é explícita — dificulta manutenção

## Estrutura Mínima (TypeScript)

```typescript
abstract class RequestHandler {
  private next: RequestHandler | null = null

  setNext(handler: RequestHandler): RequestHandler {
    this.next = handler
    return handler
  }

  handle(request: number): string | null {
    if (this.next) return this.next.handle(request)
    return null
  }
}

class AuthHandler extends RequestHandler {
  handle(request: number): string | null {
    if (request < 0) return 'Negado: requisição inválida'
    return super.handle(request)
  }
}

class RateLimitHandler extends RequestHandler {
  handle(request: number): string | null {
    if (request > 100) return 'Negado: limite de taxa excedido'
    return super.handle(request)
  }
}
```

## Exemplo de Uso Real

```typescript
const chain = new AuthHandler()
chain.setNext(new RateLimitHandler())
chain.handle(50)
```

## Relacionado a

- [command.md](command.md): complementa — Command encapsula a requisição; Chain of Responsibility define quem a processa
- [observer.md](observer.md): complementa — Observer notifica todos os assinantes; Chain para no primeiro handler que processa
- [rule 002 - Proibição da Cláusula ELSE](../../../rules/002_proibicao-clausula-else.md): reforça — cada handler usa guard clause para decidir se processa ou repassa adiante
- [rule 064 - Proibição de Overengineering](../../../rules/064_proibicao-overengineering.md): reforça — não crie cadeias longas sem justificativa

---

**Categoria GoF:** Comportamental
**Fonte:** Design Patterns — Gamma, Helm, Johnson, Vlissides (1994)
