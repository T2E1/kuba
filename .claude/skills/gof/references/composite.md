# Composite

**Categoria:** Estrutural
**Intenção:** Compor objetos em estruturas de árvore para representar hierarquias parte-todo, permitindo que clientes tratem objetos individuais e composições de forma uniforme.

---

## Quando Usar

- Estruturas hierárquicas como árvores de componentes UI, sistemas de arquivos, menus
- Quando clientes precisam ignorar a diferença entre composições e objetos individuais
- Para representar estruturas recursivas naturalmente
- Em parsers e ASTs (Árvores de Sintaxe Abstrata)

## Quando NÃO Usar

- Para estruturas que não são naturalmente hierárquicas (overengineering — rule 064)
- Quando a distinção entre folha e composição é importante para o cliente
- Quando as operações diferem significativamente entre folhas e nós compostos

## Estrutura Mínima (TypeScript)

```typescript
interface MenuComponent {
  render(): string
  getPrice(): number
}

class MenuItem implements MenuComponent {
  constructor(
    private readonly name: string,
    private readonly price: number
  ) {}

  render(): string { return `${this.name}: R$${this.price}` }
  getPrice(): number { return this.price }
}

class MenuCategory implements MenuComponent {
  private readonly items: MenuComponent[] = []

  constructor(private readonly name: string) {}

  add(item: MenuComponent): void { this.items.push(item) }

  render(): string {
    const children = this.items.map(item => item.render()).join('\n')
    return `${this.name}:\n${children}`
  }

  getPrice(): number {
    return this.items.reduce((sum, item) => sum + item.getPrice(), 0)
  }
}
```

## Exemplo de Uso Real

```typescript
const menu = new MenuCategory('Sanduíches')
menu.add(new MenuItem('Hambúrguer', 25))
```

## Relacionado a

- [decorator.md](decorator.md): complementa — Decorator adiciona responsabilidades a um único objeto; Composite agrega objetos em árvore
- [iterator.md](iterator.md): complementa — Iterator frequentemente usado para percorrer estruturas Composite
- [visitor.md](visitor.md): complementa — Visitor frequentemente aplicado sobre estruturas Composite para executar operações
- [rule 004 - Coleções de Primeira Classe](../../../rules/004_colecoes-primeira-classe.md): complementa — MenuCategory encapsula coleção com comportamento de domínio
- [rule 064 - Proibição de Overengineering](../../../rules/064_proibicao-overengineering.md): reforça — não use para estruturas não hierárquicas

---

**Categoria GoF:** Estrutural
**Fonte:** Design Patterns — Gamma, Helm, Johnson, Vlissides (1994)
