# Identity Map

**Camada:** Object-Relational
**Complexidade:** Moderada
**Intenção:** Garante que cada objeto seja carregado apenas uma vez, mantendo um mapa de todos os objetos carregados e consultando esse mapa ao se referir a eles.

---

## Quando Usar

- Evitar que o mesmo registro seja carregado múltiplas vezes em uma requisição
- Garantir consistência de identidade — dois `findById('123')` devem retornar o mesmo objeto
- Em sistemas com Domain Model onde a identidade do objeto importa
- Para otimizar queries redundantes dentro de uma unidade de trabalho

## Quando NÃO Usar

- Aplicações simples onde carregamento duplicado não é um problema
- Quando o escopo da requisição é curto demais para justificar o overhead
- Em sistemas sem estado onde o mapa seria recriado a cada requisição de qualquer forma

## Estrutura Mínima (TypeScript)

```typescript
class IdentityMap {
  private readonly maps = new Map<string, Map<string, DomainObject>>()

  get<T extends DomainObject>(className: string, id: string): T | null {
    return (this.maps.get(className)?.get(id) as T) ?? null
  }

  set(className: string, id: string, obj: DomainObject): void {
    if (!this.maps.has(className)) {
      this.maps.set(className, new Map())
    }
    this.maps.get(className)!.set(id, obj)
  }
}

// Repository usando Identity Map
class UserRepository {
  constructor(
    private readonly db: Database,
    private readonly identityMap: IdentityMap
  ) {}

  async findById(id: string): Promise<User | null> {
    // Verifica primeiro o identity map
    const cached = this.identityMap.get<User>('User', id)
    if (cached) return cached

    // Carrega do banco apenas se não estiver no mapa
    const row = await this.db.query('SELECT * FROM users WHERE id = ?', [id])
    if (!row) return null

    const user = new User(row.id, row.name, row.email)
    this.identityMap.set('User', id, user)
    return user
  }
}
```

## Relacionado com

- [unit-of-work.md](unit-of-work.md): complementa — Unit of Work usa Identity Map para rastrear instâncias únicas ao longo da transação
- [repository.md](repository.md): complementa — repositórios consultam o Identity Map antes de ir ao banco

---

**Camada PoEAA:** Object-Relational
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
