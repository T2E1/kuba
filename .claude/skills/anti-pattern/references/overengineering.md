# Overengineering

**Severidade:** 🟡 Média
**Regra Associada:** Regra 064

## O Que É

Projetar ou implementar uma solução muito mais complexa do que o problema requer. Adicionar abstrações, camadas, design patterns, sistemas de plugins ou configurabilidade antes de haver evidência de necessidade real.

## Sintomas

- Introduzir padrão sem problema claro sendo resolvido (ex: padrão Strategy sem variação de algoritmos)
- Interfaces com um único implementador "para facilitar testes futuros"
- Sistemas de configuração para algo que nunca vai mudar
- 5 camadas de abstração para uma operação CRUD
- Design Patterns aplicados onde código direto funcionaria
- "Deixei genérico para reutilizar depois"

## ❌ Exemplo (violação)

```javascript
// ❌ Sistema de plugins para salvar um usuário no banco
class UserRepository {
  constructor(storageStrategy) { this.strategy = storageStrategy; }
  save(user) { return this.strategy.persist(user); }
}

class DatabaseStorageStrategy {
  constructor(adapterFactory) { this.adapter = adapterFactory.create(); }
  persist(user) { return this.adapter.execute('INSERT', user); }
}

// Nunca houve outro storage. Nunca haverá.
```

## ✅ Refatoração

```javascript
// ✅ Direto ao ponto — refatorar quando a necessidade for real (YAGNI + KISS)
async function saveUser(user) {
  return db.users.create(user);
}

// Adicionar abstração apenas quando houver MÚLTIPLOS storages REAIS
```

## Codetag Sugerido

```typescript
// FIXME: Overengineering — 4 camadas de abstração para simples db.create()
// TODO: Simplificar: usar db.users.create() diretamente até existir 2º storage
```
