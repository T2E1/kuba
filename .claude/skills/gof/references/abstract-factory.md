# Abstract Factory

**Categoria:** Criacional
**Intenção:** Fornecer uma interface para criar famílias de objetos relacionados sem especificar as classes concretas.

---

## Quando Usar

- O sistema precisa ser independente de como seus produtos são criados
- O sistema deve funcionar com múltiplas famílias de objetos
- Ao construir UI que precisa de temas (claro/escuro) ou plataformas diferentes
- Quando os produtos de uma família devem ser usados em conjunto

## Quando NÃO Usar

- Quando há apenas uma família de produtos — Factory Method é suficiente
- Quando adicionar novos tipos de produto exige mudar toda a interface (alto custo)
- Para objetos não relacionados (overengineering — rule 064)

## Estrutura Mínima (TypeScript)

```typescript
interface Button { render(): string }
interface Input { render(): string }

interface UIFactory {
  createButton(): Button
  createInput(): Input
}

class MaterialUIFactory implements UIFactory {
  createButton(): Button {
    return { render: () => '<button class="material">...</button>' }
  }
  createInput(): Input {
    return { render: () => '<input class="material" />' }
  }
}

class BootstrapUIFactory implements UIFactory {
  createButton(): Button {
    return { render: () => '<button class="btn">...</button>' }
  }
  createInput(): Input {
    return { render: () => '<input class="form-control" />' }
  }
}
```

## Exemplo de Uso Real

```typescript
const factory: UIFactory = new MaterialUIFactory()
factory.createButton().render()
```

## Relacionado a

- [factory-method.md](factory-method.md): depende — Abstract Factory é composto de Factory Methods
- [builder.md](builder.md): complementa — Builder constrói um produto complexo; Abstract Factory cria famílias
- [prototype.md](prototype.md): complementa — Prototype pode ser usado dentro do Abstract Factory para criar produtos por clonagem
- [rule 014 - Princípio da Inversão de Dependência](../../../rules/014_principio-inversao-dependencia.md): reforça — clientes dependem da interface UIFactory, não das classes concretas
- [rule 011 - Princípio Aberto/Fechado](../../../rules/011_principio-aberto-fechado.md): reforça — adicione nova família sem modificar clientes existentes

---

**Categoria GoF:** Criacional
**Fonte:** Design Patterns — Gamma, Helm, Johnson, Vlissides (1994)
