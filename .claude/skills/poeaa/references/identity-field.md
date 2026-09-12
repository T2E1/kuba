# Identity Field

**Camada:** Object-Relational Structural
**Complexidade:** Simples
**Intenção:** Guarda a chave de banco de dados em um campo do objeto de domínio para manter a identidade entre o objeto em memória e a linha correspondente.

---

## Quando Usar

- Sempre que um objeto de domínio é mapeado de/para uma linha com chave primária
- Como base para Identity Map e para comparação de igualdade entre objetos de domínio

## Quando NÃO Usar

- Objetos de valor sem identidade própria (Value Object) — igualdade é por atributos, não por chave

## Estrutura Mínima (TypeScript)

```typescript
class Order {
  readonly id: string | null // null até persistir; atribuído pelo Data Mapper

  constructor(id: string | null, private items: OrderItem[]) {
    this.id = id
  }

  equals(other: Order): boolean {
    return this.id !== null && this.id === other.id
  }
}
```

## Relacionado com

- [data-mapper.md](data-mapper.md): complementa — o mapper preenche o Identity Field ao inserir
- [identity-map.md](identity-map.md): depende de — a chave é o que indexa o mapa
- [regra 003 - Encapsulamento de Primitivos](../../../rules/003_encapsulamento-primitivos.md): reforça — o id deve ser um tipo próprio, não uma string crua espalhada

---

**Camada PoEAA:** Object-Relational Structural
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
