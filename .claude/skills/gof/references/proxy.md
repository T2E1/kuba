# Proxy

**Categoria:** Estrutural
**Intenção:** Fornecer um substituto ou placeholder para outro objeto, a fim de controlar o acesso a ele.

---

## Quando Usar

- Lazy loading: carregar recurso pesado apenas quando necessário
- Cache: armazenar resultado de operações custosas
- Controle de acesso: verificar permissões antes de delegar
- Logging e monitoramento transparentes

## Quando NÃO Usar

- Quando não adiciona comportamento real — torna-se Middle Man inútil (rule 061)
- Para delegação simples sem controle, cache ou acesso — use o objeto diretamente
- Quando a latência do Proxy supera o benefício que ele fornece

## Estrutura Mínima (TypeScript)

```typescript
interface ImageLoader {
  display(): string
}

class RealImage implements ImageLoader {
  constructor(private readonly filename: string) {
    this.loadFromDisk() // operação custosa
  }

  private loadFromDisk(): void {
    console.log(`Carregando ${this.filename} do disco...`)
  }

  display(): string { return `Exibindo ${this.filename}` }
}

// Proxy com lazy loading e cache
class ImageProxy implements ImageLoader {
  private realImage: RealImage | null = null

  constructor(private readonly filename: string) {}

  display(): string {
    if (!this.realImage) {
      this.realImage = new RealImage(this.filename) // carrega apenas quando necessário
    }
    return this.realImage.display()
  }
}
```

## Exemplo de Uso Real

```typescript
const image: ImageLoader = new ImageProxy('photo.jpg')
image.display()
```

## Relacionado a

- [adapter.md](adapter.md): complementa — Adapter converte interface; Proxy mantém a mesma interface e controla acesso
- [decorator.md](decorator.md): complementa — estrutura similar; Decorator adiciona comportamento; Proxy controla acesso ao objeto real
- [rule 061 - Proibição de Middle Man](../../../rules/061_proibicao-middle-man.md): reforça — Proxy deve adicionar controle real (cache, acesso, lazy load), não apenas delegar
- [rule 036 - Restrição de Funções com Efeitos Colaterais](../../../rules/036_restricao-funcoes-efeitos-colaterais.md): complementa — efeitos colaterais do Proxy (cache, log) devem ser documentados e intencionais

---

**Categoria GoF:** Estrutural
**Fonte:** Design Patterns — Gamma, Helm, Johnson, Vlissides (1994)
