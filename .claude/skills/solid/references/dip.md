# D — Dependency Inversion Principle (DIP)

**Rule deMGoncalves:** COMPORTAMENTAL-014
**Pergunta:** Módulos de alto nível dependem de abstrações, não de classes concretas?

## O que é

Módulos de alto nível não devem depender de módulos de baixo nível. Ambos devem depender de abstrações (interfaces). Abstrações não devem depender de detalhes. Detalhes devem depender de abstrações.

## Quando Violar Indica Problema

- Classe de alto nível instancia classes concretas com `new`
- Service ou Controller cria instâncias de Repository/Database diretamente
- Imports de classes concretas em constructors (em vez de abstrações)
- Dificuldade de testar devido a dependências concretas
- Impossível trocar implementação sem modificar código cliente

## ❌ Violação

```typescript
// Classe de baixo nível (detalhe)
class MySQLDatabase {
  connect(): void { console.log('MySQL connected'); }
  query(sql: string): any { /* ... */ }
}

// Classe de alto nível depende de detalhe concreto - VIOLA DIP
class UserService {
  private database: MySQLDatabase;

  constructor() {
    this.database = new MySQLDatabase();  // VIOLA: instancia concreta
  }

  getUser(id: string): User {
    this.database.connect();
    return this.database.query(`SELECT * FROM users WHERE id = ${id}`);
  }
}

// Problemas:
// 1. Impossível testar UserService sem banco real
// 2. Impossível trocar MySQL por PostgreSQL sem modificar UserService
// 3. Alto acoplamento: UserService conhece detalhes de MySQLDatabase
```

## ✅ Correto (Inversão de Dependência)

```typescript
// Abstração (interface): alto nível define o que precisa
interface Database {
  connect(): void;
  query(sql: string): any;
}

// Detalhe concreto: implementa abstração
class MySQLDatabase implements Database {
  connect(): void { console.log('MySQL connected'); }
  query(sql: string): any { /* ... */ }
}

// Outro detalhe concreto: implementa mesma abstração
class PostgreSQLDatabase implements Database {
  connect(): void { console.log('PostgreSQL connected'); }
  query(sql: string): any { /* ... */ }
}

// Alto nível depende de abstração - DIP CORRETO
class UserService {
  constructor(private readonly database: Database) {}  // Abstração

  getUser(id: string): User {
    this.database.connect();
    return this.database.query(`SELECT * FROM users WHERE id = ${id}`);
  }
}

// Composição no Root Composer (único lugar que instancia concretas)
const mysqlDb = new MySQLDatabase();
const userService = new UserService(mysqlDb);

// Trocar implementação sem modificar UserService
const postgresDb = new PostgreSQLDatabase();
const userService2 = new UserService(postgresDb);
```

## ✅ Correto (Teste Unitário)

```typescript
// Mock para teste: implementa abstração
class MockDatabase implements Database {
  connect(): void { /* mock */ }
  query(sql: string): any {
    return { id: '1', name: 'Test User' };  // Dados fake
  }
}

// Teste: injeta mock
describe('UserService', () => {
  it('should get user by id', () => {
    const mockDb = new MockDatabase();
    const service = new UserService(mockDb);

    const user = service.getUser('1');

    expect(user.name).toBe('Test User');
  });
});
```

## ✅ Correto (Dependency Injection Container)

```typescript
// Container gerencia criação e injeção
class Container {
  private services = new Map<string, any>();

  register<T>(key: string, factory: () => T): void {
    this.services.set(key, factory);
  }

  resolve<T>(key: string): T {
    const factory = this.services.get(key);
    if (!factory) throw new Error(`Service ${key} not found`);
    return factory();
  }
}

// Registrar implementações
const container = new Container();
container.register('Database', () => new MySQLDatabase());
container.register('UserService', () => {
  const db = container.resolve<Database>('Database');
  return new UserService(db);
});

// Resolver dependências
const userService = container.resolve<UserService>('UserService');
```

## Exceções

- **Entidades e Value Objects**: Classes de dados puras que podem ser instanciadas livremente
- **Root Composer**: O módulo de inicialização do sistema onde a injeção de dependência é configurada

## Rules Relacionadas

- [011 - Princípio Aberto/Fechado](ocp.md): reforça
- [015 - Princípio de Lançamento e Reuso](../../rules/015_principio-equivalencia-lancamento-reuso.md): reforça
- [003 - Encapsulamento de Primitivos](../../rules/003_encapsulamento-primitivos.md): complementa
- [018 - Princípio de Dependências Acíclicas](../../rules/018_principio-dependencias-aciclicas.md): reforça
- [019 - Princípio de Dependências Estáveis](../../rules/019_principio-dependencias-estaveis.md): reforça
- [020 - Princípio de Abstrações Estáveis](../../rules/020_principio-abstracoes-estaveis.md): reforça
- [032 - Cobertura Mínima de Teste](../../rules/032_cobertura-teste-minima-qualidade.md): complementa
