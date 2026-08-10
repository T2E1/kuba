# Testability — Testabilidade

**Dimensão:** Revisão
**Severidade Padrão:** 🔴 Crítica
**Questão-Chave:** É fácil de testar?

## O que é

O esforço necessário para testar o software e garantir que funciona corretamente. Alta testabilidade significa que os componentes podem ser testados de forma isolada, com entradas e saídas claras, sem depender de infraestrutura externa.

## Indicadores de Problema

| Situação | Severidade |
|----------|-----------|
| Código de negócio impossível de testar | 🔴 Blocker |
| Singleton usado em lógica crítica | 🔴 Blocker |
| Dependência concreta em Service | 🟠 Importante |
| Date.now() sem injeção | 🟡 Sugestão |

## Exemplo de Violação

```javascript
// ❌ Não testável - cria dependência internamente
class UserService {
  async getUser(id) {
    const db = new DatabaseConnection(); // Impossível de mockar
    return db.query(`SELECT * FROM users WHERE id = ${id}`);
  }
}

// ✅ Testável - dependência injetada
class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async getUser(id) {
    return this.userRepository.findById(id);
  }
}

// No teste:
const mockRepo = { findById: vi.fn().mockResolvedValue(mockUser) };
const service = new UserService(mockRepo);
```

## Codetags Sugeridas

```javascript
// TEST(014): Impossível de testar - dependência concreta interna
// TEST: Necessário mockar o tempo para testar
```

## Calibração de Severidade

| Situação | Severidade |
|----------|-----------|
| Código de negócio impossível de testar | 🔴 Blocker |
| Singleton usado em lógica crítica | 🔴 Blocker |
| Dependência concreta em Service | 🟠 Importante |
| Date.now() sem injeção | 🟡 Sugestão |

## Regras Relacionadas

- 014 - Princípio de Inversão de Dependência
- 032 - Cobertura Mínima de Teste
- 036 - Restrição de Funções com Efeitos Colaterais
