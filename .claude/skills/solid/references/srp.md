# S — Single Responsibility Principle (SRP)

**Rule deMGoncalves:** COMPORTAMENTAL-010
**Pergunta:** Esta classe tem apenas uma razão para mudar?

## O que é

Exige que uma classe ou módulo tenha apenas uma razão para mudar, o que implica que deve ter uma única responsabilidade. Uma classe deve fazer uma coisa e fazê-la bem.

## Quando Violar Indica Problema

- Classe com mais de 7 métodos públicos
- Classe contém lógica de negócio E lógica de persistência
- Classe muda quando requisitos de domínios diferentes mudam
- LCOM (Lack of Cohesion in Methods) > 0.75
- Classe tem múltiplos "concerns" (ex: validação + persistência + logging)

## ❌ Violação

```typescript
class UserService {
  // Responsabilidade 1: Business Logic
  createUser(data: UserData): User {
    this.validateUser(data);
    const user = new User(data);
    this.saveUser(user);  // Responsabilidade 2: Persistence
    this.sendWelcomeEmail(user);  // Responsabilidade 3: Notification
    this.logActivity(user);  // Responsabilidade 4: Logging
    return user;
  }

  // Responsabilidade 2: Persistence
  private saveUser(user: User): void {
    const db = this.database.connect();
    db.insert('users', user);
  }

  // Responsabilidade 3: Notification
  private sendWelcomeEmail(user: User): void {
    this.emailService.send(user.email, 'Welcome!');
  }

  // Responsabilidade 4: Logging
  private logActivity(user: User): void {
    this.logger.info(`User created: ${user.id}`);
  }

  // Violação: 4 razões diferentes para mudar esta classe
}
```

## ✅ Correto

```typescript
// Responsabilidade única: coordenar criação de usuário
class UserService {
  constructor(
    private readonly repository: UserRepository,
    private readonly notifier: UserNotifier,
    private readonly logger: ActivityLogger
  ) {}

  createUser(data: UserData): User {
    this.validateUser(data);
    const user = new User(data);
    const savedUser = this.repository.save(user);
    this.notifier.notifyWelcome(savedUser);
    this.logger.logUserCreation(savedUser);
    return savedUser;
  }

  private validateUser(data: UserData): void {
    // Validação simples aqui ou delegar para Validator
  }
}

// Responsabilidade única: persistência de usuários
class UserRepository {
  save(user: User): User {
    const db = this.database.connect();
    return db.insert('users', user);
  }

  findById(id: string): User {
    const db = this.database.connect();
    return db.findOne('users', { id });
  }
}

// Responsabilidade única: notificações de usuário
class UserNotifier {
  notifyWelcome(user: User): void {
    this.emailService.send(user.email, 'Welcome!');
  }
}

// Responsabilidade única: logging de atividades
class ActivityLogger {
  logUserCreation(user: User): void {
    this.logger.info(`User created: ${user.id}`);
  }
}
```

## Exceções

- **Classes Utilitárias/Helper**: Classes estáticas que agrupam funções puras sem estado para manipulação genérica de dados (ex: formatadores de data)

## Rules Relacionadas

- [007 - Limite Máximo de Linhas por Classe](../../rules/007_limite-maximo-linhas-classe.md): reforça
- [004 - Coleções de Primeira Classe](../../rules/004_colecoes-primeira-classe.md): reforça
- [011 - Princípio Aberto/Fechado](ocp.md): complementa
- [025 - Proibição do Anti-Pattern The Blob](../../rules/025_proibicao-anti-pattern-the-blob.md): complementa
- [054 - Proibição de Mudança Divergente](../../rules/054_proibicao-mudanca-divergente.md): reforça
