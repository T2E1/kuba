# Mediator

**Categoria:** Comportamental
**Intenção:** Definir um objeto que encapsula como um conjunto de objetos interage, promovendo acoplamento fraco ao impedir que os objetos se refiram explicitamente uns aos outros.

---

## Quando Usar

- Reduzir acoplamento entre componentes que se comunicam intensivamente
- Orquestrar interações complexas entre múltiplos objetos
- Implementar sistemas de chat, salas de eventos
- Coordenar componentes de UI com estado compartilhado

## Quando NÃO Usar

- Quando o Mediator acumula lógica de negócio — torna-se God Object (rule 025 — The Blob)
- Quando há apenas dois objetos interagindo — referência direta é mais simples
- Quando a comunicação entre componentes é simples e unidirecional

## Estrutura Mínima (TypeScript)

```typescript
interface ChatMediator {
  sendMessage(message: string, sender: ChatUser): void
}

class ChatRoom implements ChatMediator {
  private readonly users: ChatUser[] = []

  register(user: ChatUser): void { this.users.push(user) }

  sendMessage(message: string, sender: ChatUser): void {
    this.users
      .filter(user => user !== sender)
      .forEach(user => user.receive(message))
  }
}

class ChatUser {
  constructor(
    private readonly name: string,
    private readonly mediator: ChatMediator
  ) {}

  send(message: string): void { this.mediator.sendMessage(message, this) }
  receive(message: string): void { console.log(`${this.name} recebeu: ${message}`) }
}
```

## Exemplo de Uso Real

```typescript
const room = new ChatRoom()
const alice = new ChatUser('Alice', room)
room.register(alice)
```

## Relacionado a

- [observer.md](observer.md): complementa — Observer define dependência um-para-muitos; Mediator centraliza comunicação muitos-para-muitos
- [facade.md](facade.md): complementa — ambos simplificam relações; Facade simplifica interface para subsistema; Mediator coordena objetos que se conhecem mutuamente
- [rule 025 - Proibição do Anti-Pattern The Blob](../../../rules/025_proibicao-anti-pattern-the-blob.md): reforça — Mediator não deve acumular lógica de negócio, apenas coordenar
- [rule 070 - Proibição de Estado Mutável Compartilhado](../../../rules/070_proibicao-estado-mutavel-compartilhado.md): reforça — Mediator centraliza comunicação, não estado compartilhado

---

**Categoria GoF:** Comportamental
**Fonte:** Design Patterns — Gamma, Helm, Johnson, Vlissides (1994)
