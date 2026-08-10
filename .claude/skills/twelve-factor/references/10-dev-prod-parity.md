# Fator 10 — Dev/Prod Parity

**Regra deMGoncalves:** [049 - Paridade Dev/Prod](../../../rules/049_paridade-dev-prod.md)
**Questão:** Dev ≈ Staging ≈ Prod (stack tecnológica + tempo de deploy + pessoas)?

## O que é

Os ambientes de desenvolvimento, staging e produção devem ser o mais **similares possível**. Isso inclui minimizar gaps de tempo (deploy frequente), gaps de pessoal (quem desenvolve também faz deploy) e gaps de ferramentas (mesmas tecnologias em todos os ambientes).

**Divergência = bugs que só aparecem em produção.**

## Critérios de Conformidade

- [ ] Mesmos **serviços de apoio** (banco de dados, cache, fila) em dev e prod (ex: PostgreSQL em ambos, não SQLite em dev + PostgreSQL em prod)
- [ ] Tempo entre escrever código e deploy em prod < **1 dia** (idealmente horas)
- [ ] Configurações de container/ambiente **idênticas** (ex: mesmo Dockerfile)

## ❌ Violação

```typescript
// Serviços de apoio diferentes ❌
const db = process.env.NODE_ENV === 'production'
  ? new PostgresClient(process.env.DATABASE_URL)
  : new SQLiteClient('dev.db');  // violação

// Deploy manual/pouco frequente ❌
# Dev → Prod leva 2 semanas
# Desenvolvedor não tem permissão de deploy
```

## ✅ Conforme

```typescript
// Mesmo serviço de apoio ✅
const db = new PostgresClient(process.env.DATABASE_URL);

# .env (dev)
DATABASE_URL=postgresql://localhost/myapp_dev

# .env (prod)
DATABASE_URL=postgresql://db.prod.com/myapp

// Docker Compose para dev com os mesmos serviços ✅
# docker-compose.yml
services:
  db:
    image: postgres:15  # mesma versão de prod
  redis:
    image: redis:7  # mesma versão de prod
  app:
    build: .  # mesmo Dockerfile

// Deploy contínuo ✅
# Pipeline CI/CD
# Git push → Build → Test → Deploy (< 30min)
```

## Codetag quando violado

```typescript
// FIXME: SQLite em dev mas PostgreSQL em prod — usar PostgreSQL em ambos
const db = isProduction ? new PostgresClient() : new SQLiteClient();
```
