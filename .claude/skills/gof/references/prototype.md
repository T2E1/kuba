# Prototype

**Categoria:** Criacional
**Intenção:** Especificar os tipos de objetos a criar usando uma instância prototípica e criar novos objetos copiando esse protótipo.

---

## Quando Usar

- A criação de objetos é custosa (ex.: inicialização pesada, parsing de configuração)
- Necessidade de criar variações de um objeto sem subclassificação
- O sistema deve ser independente de como seus produtos são criados e compostos
- Ao trabalhar com objetos que possuem estado inicial complexo

## Quando NÃO Usar

- Quando a criação direta é simples o suficiente (overengineering — rule 064)
- Quando o objeto contém referências circulares que são difíceis de clonar
- Quando cópia superficial (shallow copy) pode introduzir mutação acidental (rule 052)

## Estrutura Mínima (TypeScript)

```typescript
interface Cloneable<T> {
  clone(): T
}

class UserProfile implements Cloneable<UserProfile> {
  constructor(
    readonly name: string,
    readonly permissions: string[],
    readonly preferences: Record<string, unknown>
  ) {}

  // Cria cópia profunda do objeto
  clone(): UserProfile {
    return new UserProfile(
      this.name,
      [...this.permissions],
      { ...this.preferences }
    )
  }

  withName(name: string): UserProfile {
    const copy = this.clone()
    return new UserProfile(name, copy.permissions, copy.preferences)
  }
}
```

## Exemplo de Uso Real

```typescript
const adminProfile = baseProfile.clone()
const namedProfile = adminProfile.withName('admin')
```

## Relacionado a

- [abstract-factory.md](abstract-factory.md): complementa — Prototype pode ser usado dentro do Abstract Factory para criar produtos por clonagem
- [builder.md](builder.md): complementa — Prototype pode clonar o resultado final de um Builder
- [rule 052 - Proibição de Mutação Acidental](../../../rules/052_proibicao-mutacao-acidental.md): reforça — cópias superficiais em objetos com referências aninhadas causam mutação acidental
- [rule 029 - Imutabilidade de Objetos](../../../rules/029_imutabilidade-objetos-freeze.md): reforça — clonar e congelar garante a imutabilidade do protótipo
- [rule 064 - Proibição de Overengineering](../../../rules/064_proibicao-overengineering.md): reforça — não use quando a criação direta é suficiente

---

**Categoria GoF:** Criacional
**Fonte:** Design Patterns — Gamma, Helm, Johnson, Vlissides (1994)
