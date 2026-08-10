# Factory Method

**Categoria:** Criacional
**Intenção:** Definir uma interface para criar objetos, mas deixar as subclasses decidirem qual classe instanciar.

---

## Quando Usar

- Quando o tipo exato de objeto a ser criado depende do contexto
- Quando subclasses devem ser capazes de especializar o processo de criação
- Para isolar a criação de objetos da lógica que os utiliza
- Ao integrar com múltiplos provedores ou adapters

## Quando NÃO Usar

- Quando há apenas um tipo concreto — um simples `new` é suficiente
- Quando o `switch/if` para decidir qual classe criar permanece na classe de alto nível (viola OCP — rule 011)
- Para objetos simples sem variações de criação (overengineering — rule 064)

## Estrutura Mínima (TypeScript)

```typescript
interface Notifier {
  send(message: string): Promise<void>
}

abstract class NotificationService {
  // Factory Method — subclasses implementam
  protected abstract createNotifier(): Notifier

  async notify(message: string): Promise<void> {
    const notifier = this.createNotifier()
    await notifier.send(message)
  }
}

class EmailNotificationService extends NotificationService {
  protected createNotifier(): Notifier {
    return new EmailNotifier(process.env.SMTP_HOST)
  }
}
```

## Exemplo de Uso Real

```typescript
new EmailNotificationService().notify('Pedido confirmado')
```

## Relacionado a

- [abstract-factory.md](abstract-factory.md): complementa — Abstract Factory usa Factory Methods internamente para criar famílias
- [template-method.md](template-method.md): complementa — ambos usam herança para delegar comportamento às subclasses
- [singleton.md](singleton.md): complementa — Factory Method pode controlar e retornar a instância Singleton
- [rule 011 - Princípio Aberto/Fechado](../../../rules/011_principio-aberto-fechado.md): reforça — adicione novos tipos sem modificar código existente
- [rule 014 - Princípio da Inversão de Dependência](../../../rules/014_principio-inversao-dependencia.md): reforça — depende de abstração, não de classe concreta

---

**Categoria GoF:** Criacional
**Fonte:** Design Patterns — Gamma, Helm, Johnson, Vlissides (1994)
