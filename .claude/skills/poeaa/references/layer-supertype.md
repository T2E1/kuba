# Layer Supertype

**Camada:** Base Patterns
**Complexidade:** Simples
**Intenção:** Define uma classe base para todos os tipos de uma camada, centralizando o comportamento comum daquela camada.

---

## Quando Usar

- Comportamento genuinamente comum a todas as entidades de uma camada (ex: `id`, `equals`, `createdAt` em toda entidade de domínio)

## Quando NÃO Usar

- Quando o "comum" é apenas superficial e a herança força subclasses a herdar métodos que não usam (Refused Bequest, regra 059)
- Como lugar para empilhar utilitários genéricos sem relação com a camada — vira The Blob (regra 025)

## Estrutura Mínima (TypeScript)

```typescript
abstract class Entity {
  protected constructor(readonly id: string) {}

  equals(other: Entity): boolean {
    return this.constructor === other.constructor && this.id === other.id
  }
}

class Order extends Entity {
  constructor(id: string, readonly total: number) {
    super(id)
  }
}
```

## Relacionado com

- [identity-field.md](identity-field.md): complementa — o Layer Supertype de domínio tipicamente carrega o Identity Field
- [regra 059 - Proibição de Herança Recusada](../../../rules/059_proibicao-heranca-refusao.md): reforça — o supertype não deve forçar métodos que a subclasse não usa

---

**Camada PoEAA:** Base Patterns
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
