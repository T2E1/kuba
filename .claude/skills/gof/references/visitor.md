# Visitor

**Categoria:** Comportamental
**Intenção:** Representar uma operação a ser executada nos elementos de uma estrutura de objetos, permitindo definir novas operações sem alterar as classes dos elementos.

---

## Quando Usar

- Executar operações em estruturas de objetos complexas (ASTs, árvores de documentos)
- Adicionar operações às classes sem modificá-las (respeita OCP)
- Quando há operações distintas sobre uma hierarquia estável de objetos
- Relatórios, validações e transformações sobre estruturas heterogêneas

## Quando NÃO Usar

- Quando a hierarquia de elementos muda com frequência — adicionar novo tipo exige alterar todos os Visitors
- Para estruturas simples onde polimorfismo direto é suficiente
- Quando há apenas uma operação a executar sobre a estrutura

## Estrutura Mínima (TypeScript)

```typescript
interface Visitor {
  visitText(element: TextElement): string
  visitImage(element: ImageElement): string
}

interface DocumentElement {
  accept(visitor: Visitor): string
}

class TextElement implements DocumentElement {
  constructor(readonly content: string) {}
  accept(visitor: Visitor): string { return visitor.visitText(this) }
}

class ImageElement implements DocumentElement {
  constructor(readonly src: string) {}
  accept(visitor: Visitor): string { return visitor.visitImage(this) }
}

class HtmlExporter implements Visitor {
  visitText(el: TextElement): string { return `<p>${el.content}</p>` }
  visitImage(el: ImageElement): string { return `<img src="${el.src}" />` }
}
```

## Exemplo de Uso Real

```typescript
const exporter = new HtmlExporter()
elements.map(el => el.accept(exporter)).join('')
```

## Relacionado a

- [composite.md](composite.md): complementa — Visitor frequentemente aplicado sobre estruturas Composite para executar operações distintas
- [iterator.md](iterator.md): complementa — Iterator percorre a estrutura; Visitor executa operação em cada elemento
- [interpreter.md](interpreter.md): complementa — Visitor pode percorrer a árvore de expressões do Interpreter
- [rule 011 - Princípio Aberto/Fechado](../../../rules/011_principio-aberto-fechado.md): reforça — adicione nova operação via novo Visitor sem alterar as classes de elemento
- [rule 010 - Princípio da Responsabilidade Única](../../../rules/010_principio-responsabilidade-unica.md): reforça — cada Visitor tem responsabilidade de uma única operação

---

**Categoria GoF:** Comportamental
**Fonte:** Design Patterns — Gamma, Helm, Johnson, Vlissides (1994)
