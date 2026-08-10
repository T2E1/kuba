# Table Data Gateway

**Camada:** Data Source
**Complexidade:** Simples
**Intenção:** Um objeto que age como gateway para uma tabela de banco de dados, com um objeto por tabela e todos os acessos passando por ele.

---

## Quando Usar

- Com Table Module como padrão de domínio
- Centralizar todas as queries de uma tabela em um único lugar
- Quando se quer abstração de SQL sem mapeamento complexo objeto-domínio
- Em sistemas orientados a dados em vez de orientados a objetos de domínio

## Quando NÃO Usar

- Com Domain Model complexo (use Data Mapper + Repository)
- Quando a lógica de negócio vai além de operações simples de tabela

## Estrutura Mínima (TypeScript)

```typescript
// Um gateway por tabela — todos os acessos passam por aqui
class PersonGateway {
  async findAll(): Promise<PersonRecord[]> {
    return this.db.query('SELECT * FROM person')
  }

  async findByLastName(lastName: string): Promise<PersonRecord[]> {
    return this.db.query('SELECT * FROM person WHERE last_name = ?', [lastName])
  }

  async insert(firstName: string, lastName: string, numberOfDependents: number): Promise<number> {
    const result = await this.db.execute(
      'INSERT INTO person (first_name, last_name, number_of_dependents) VALUES (?, ?, ?)',
      [firstName, lastName, numberOfDependents]
    )
    return result.insertId
  }

  async update(id: number, firstName: string, lastName: string, numberOfDependents: number): Promise<void> {
    await this.db.execute(
      'UPDATE person SET first_name=?, last_name=?, number_of_dependents=? WHERE id=?',
      [firstName, lastName, numberOfDependents, id]
    )
  }
}
```

## Relacionado com

- [row-data-gateway.md](row-data-gateway.md): complementa — Row Data Gateway opera por linha enquanto Table Data Gateway opera na tabela inteira
- [table-module.md](table-module.md): complementa — Table Module usa Table Data Gateway como sua camada de acesso a dados

---

**Camada PoEAA:** Data Source
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
