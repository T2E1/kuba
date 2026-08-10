# Regra 7 — Small Classes (Classes Pequenas)

**Regra deMGoncalves:** ESTRUTURAL-007
**Questão:** Esta classe tem mais de 50 linhas ou 7 métodos públicos?

## O que é

Impõe um limite máximo no número de linhas de código em um arquivo de classe (entidade, service, controlador), forçando a extração de responsabilidades para outras classes.

## Quando Aplicar

- Classe com mais de 50 linhas de código
- Classe com mais de 7 métodos públicos
- Classe com mais de 15 linhas por método
- Classe candidata a violação do SRP

## ❌ Violação

```typescript
class UserService {  // 150 linhas - VIOLA
  createUser(data: UserData): User { /* 20 linhas */ }
  updateUser(id: string, data: UserData): User { /* 25 linhas */ }
  deleteUser(id: string): void { /* 15 linhas */ }
  findUserById(id: string): User { /* 10 linhas */ }
  findUserByEmail(email: string): User { /* 10 linhas */ }
  listUsers(filters: Filters): User[] { /* 30 linhas */ }
  exportUsers(format: string): Buffer { /* 40 linhas */ }
  // ... 8 métodos públicos a mais
}
```

## ✅ Correto

```typescript
// UserService.ts (30 linhas)
class UserService {
  constructor(
    private readonly repository: UserRepository,
    private readonly validator: UserValidator
  ) {}

  createUser(data: UserData): User {
    this.validator.validate(data);
    return this.repository.save(new User(data));
  }

  updateUser(id: string, data: UserData): User {
    const user = this.repository.findById(id);
    user.update(data);
    return this.repository.save(user);
  }
}

// UserRepository.ts (25 linhas)
class UserRepository {
  findById(id: string): User { /* ... */ }
  findByEmail(email: string): User { /* ... */ }
  save(user: User): User { /* ... */ }
  delete(id: string): void { /* ... */ }
}

// UserExporter.ts (35 linhas)
class UserExporter {
  export(users: User[], format: string): Buffer { /* ... */ }
}
```

## Exceções

- **Classes de Configuração**: Classes que apenas declaram constantes ou mapeamentos
- **Classes de Teste**: Suites de teste onde cada teste é pequeno

## Regras Relacionadas

- [001 - Single Indentation Level](rule-01-single-indentation.md): reforça
- [004 - First Class Collections](rule-04-first-class-collections.md): reforça
- [010 - Princípio da Responsabilidade Única](../../rules/010_principio-responsabilidade-unica.md): reforça
