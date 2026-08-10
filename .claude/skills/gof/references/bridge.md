# Bridge

**Categoria:** Estrutural
**Intenção:** Desacoplar uma abstração de sua implementação para que ambas possam variar independentemente.

---

## Quando Usar

- Abstração e implementação devem ser extensíveis por subclassificação
- Mudanças na implementação não devem impactar os clientes da abstração
- Quando houver explosão de classes devido à herança em dois eixos de variação independentes
- Para ocultar detalhes de implementação dos clientes

## Quando NÃO Usar

- Quando há apenas uma implementação possível (overengineering — rule 064)
- Quando abstração e implementação não variam independentemente
- Para problemas simples onde composição direta é suficiente

## Estrutura Mínima (TypeScript)

```typescript
// Implementação (pode variar)
interface Renderer {
  renderCircle(radius: number): string
}

class SVGRenderer implements Renderer {
  renderCircle(radius: number): string {
    return `<circle r="${radius}" />`
  }
}

class CanvasRenderer implements Renderer {
  renderCircle(radius: number): string {
    return `ctx.arc(0, 0, ${radius}, 0, 2 * Math.PI)`
  }
}

// Abstração (pode variar independentemente da implementação)
class Shape {
  constructor(protected readonly renderer: Renderer) {}
}

class Circle extends Shape {
  constructor(private readonly radius: number, renderer: Renderer) {
    super(renderer)
  }

  draw(): string {
    return this.renderer.renderCircle(this.radius)
  }
}
```

## Exemplo de Uso Real

```typescript
new Circle(50, new SVGRenderer()).draw()
```

## Relacionado a

- [adapter.md](adapter.md): complementa — Adapter reconcilia interfaces existentes; Bridge separa abstração de implementação desde o design
- [abstract-factory.md](abstract-factory.md): complementa — Abstract Factory pode criar objetos de implementação para o Bridge
- [strategy.md](strategy.md): complementa — Strategy substitui algoritmo em tempo de execução; Bridge separa hierarquias permanentemente
- [rule 014 - Princípio da Inversão de Dependência](../../../rules/014_principio-inversao-dependencia.md): reforça — abstração depende da interface Renderer, não das implementações concretas
- [rule 011 - Princípio Aberto/Fechado](../../../rules/011_principio-aberto-fechado.md): reforça — adicione novas formas ou renderizadores sem modificar código existente
- [rule 064 - Proibição de Overengineering](../../../rules/064_proibicao-overengineering.md): reforça — não use quando há apenas uma implementação

---

**Categoria GoF:** Estrutural
**Fonte:** Design Patterns — Gamma, Helm, Johnson, Vlissides (1994)
