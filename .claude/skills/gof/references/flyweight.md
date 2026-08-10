# Flyweight

**Categoria:** Estrutural
**Intenção:** Usar compartilhamento para suportar eficientemente grandes quantidades de objetos de granularidade fina.

---

## Quando Usar

- A aplicação precisa criar grande número de objetos similares consumindo muita memória
- O estado intrínseco (compartilhável) pode ser separado do estado extrínseco (único por contexto)
- Ex.: caracteres em editor de texto, partículas em simulações, sprites em jogos

## Quando NÃO Usar

- Sem evidência de problema de memória — não otimize prematuramente (rule 069)
- Quando a separação entre estado intrínseco e extrínseco é artificial ou confusa
- Quando o número de objetos é pequeno e a economia não é significativa

## Estrutura Mínima (TypeScript)

```typescript
// Estado intrínseco: compartilhado entre muitas instâncias
class CharacterGlyph {
  constructor(
    readonly symbol: string,
    readonly font: string,
    readonly size: number
  ) {}

  render(position: { x: number; y: number }): void {
    // renderiza o símbolo na posição informada (estado extrínseco)
    console.log(`${this.symbol} em ${position.x},${position.y}`)
  }
}

// Factory que gerencia o pool de Flyweights
class GlyphFactory {
  private readonly pool = new Map<string, CharacterGlyph>()

  getGlyph(symbol: string, font: string, size: number): CharacterGlyph {
    const key = `${symbol}-${font}-${size}`
    if (!this.pool.has(key)) {
      this.pool.set(key, new CharacterGlyph(symbol, font, size))
    }
    return this.pool.get(key)!
  }
}
```

## Exemplo de Uso Real

```typescript
const factory = new GlyphFactory()
factory.getGlyph('A', 'Arial', 12).render({ x: 0, y: 0 })
```

## Relacionado a

- [singleton.md](singleton.md): complementa — Singleton garante uma instância; Flyweight gerencia pool de instâncias compartilhadas
- [factory-method.md](factory-method.md): depende — GlyphFactory usa padrão factory para gerenciar o pool de Flyweights
- [rule 069 - Proibição de Otimização Prematura](../../../rules/069_proibicao-otimizacao-prematura.md): reforça — use apenas com evidência de problema de memória medido
- [rule 029 - Imutabilidade de Objetos](../../../rules/029_imutabilidade-objetos-freeze.md): reforça — Flyweights devem ser imutáveis pois são compartilhados entre contextos

---

**Categoria GoF:** Estrutural
**Fonte:** Design Patterns — Gamma, Helm, Johnson, Vlissides (1994)
