# Decorator

**Categoria:** Estrutural
**Intenção:** Anexar responsabilidades adicionais a um objeto dinamicamente, como alternativa à subclassificação para estender funcionalidades.

---

## Quando Usar

- Adicionar comportamentos a objetos individuais sem afetar outros objetos da mesma classe
- Quando a herança levaria à explosão de subclasses
- Para compor comportamentos flexivelmente em tempo de execução
- Preocupações transversais como logging, cache, validação, autenticação

## Quando NÃO Usar

- Quando empilhar muitos Decorators torna o debugging difícil (rule 060 — Spaghetti Code)
- Quando a ordem dos Decorators é crítica e difícil de controlar
- Para comportamentos que se aplicam à classe inteira, não a instâncias individuais

## Estrutura Mínima (TypeScript)

```typescript
interface DataSource {
  write(data: string): void
  read(): string
}

class FileDataSource implements DataSource {
  private content = ''
  write(data: string): void { this.content = data }
  read(): string { return this.content }
}

// Decorator base
class DataSourceDecorator implements DataSource {
  constructor(protected readonly wrapped: DataSource) {}
  write(data: string): void { this.wrapped.write(data) }
  read(): string { return this.wrapped.read() }
}

// Decorator concreto: adiciona compressão
class CompressionDecorator extends DataSourceDecorator {
  write(data: string): void {
    const compressed = Buffer.from(data).toString('base64') // simulação
    this.wrapped.write(compressed)
  }
}
```

## Exemplo de Uso Real

```typescript
const source = new CompressionDecorator(new FileDataSource())
source.write('data')
```

## Relacionado a

- [composite.md](composite.md): complementa — Composite agrega múltiplos objetos; Decorator envolve um único objeto com comportamento adicional
- [proxy.md](proxy.md): complementa — Proxy controla acesso; Decorator adiciona comportamento; estrutura similar, intenção diferente
- [strategy.md](strategy.md): complementa — Strategy substitui algoritmo por composição; Decorator adiciona comportamento empilhando wrappers
- [rule 011 - Princípio Aberto/Fechado](../../../rules/011_principio-aberto-fechado.md): reforça — adiciona comportamento sem modificar classes existentes
- [rule 060 - Proibição de Spaghetti Code](../../../rules/060_proibicao-codigo-spaghetti.md): reforça — empilhar muitos Decorators cria complexidade difícil de acompanhar

---

**Categoria GoF:** Estrutural
**Fonte:** Design Patterns — Gamma, Helm, Johnson, Vlissides (1994)
