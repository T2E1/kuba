# Data Mapper

**Camada:** Data Source
**Complexidade:** Complexa
**Intenção:** Uma camada de mapeadores que transfere dados entre objetos e o banco de dados, mantendo ambos independentes entre si e do próprio mapeador.

---

## Quando Usar

- Domínio complexo com Domain Model que deve ser isolado da infraestrutura
- Quando o schema do banco difere do modelo de domínio
- Quando é necessário testar o domínio sem banco de dados (testes unitários)
- Sistemas onde o banco pode mudar sem impactar o domínio

## Quando NÃO Usar

- Domínios simples onde Active Record seria suficiente (overengineering — regra 064)
- Quando a camada de mapeamento não agrega valor real

## Estrutura Mínima (TypeScript)

```typescript
// Domínio puro: não sabe nada sobre banco de dados
class User {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly email: string
  ) {}

  changeName(name: string): User {
    return new User(this.id, name, this.email)
  }
}

// Mapper: responsável pelo mapeamento entre domínio e banco
class UserMapper {
  async findById(id: string): Promise<User | null> {
    const row = await db.query('SELECT * FROM users WHERE id = ?', [id])
    if (!row[0]) return null
    return new User(row[0].id, row[0].name, row[0].email)
  }

  async save(user: User): Promise<void> {
    await db.execute(
      'INSERT INTO users (id, name, email) VALUES (?, ?, ?) ON CONFLICT UPDATE SET name=?, email=?',
      [user.id, user.name, user.email, user.name, user.email]
    )
  }
}
```

## Relacionado com

- [active-record.md](active-record.md): substitui quando o domínio é simples e o acoplamento ao banco é aceitável
- [repository.md](repository.md): complementa — Repository usa Data Mapper internamente para isolar o domínio
- [domain-model.md](domain-model.md): depende — Data Mapper é o padrão natural de persistência para Domain Model
- [regra 014 - Princípio de Inversão de Dependência](../../../rules/014_principio-inversao-dependencia.md): reforça — mantém o domínio desacoplado da infraestrutura de dados

---

**Camada PoEAA:** Data Source
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
