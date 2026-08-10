# Fator 12 — Admin Processes

**Regra deMGoncalves:** [051 - Processos Administrativos](../../../rules/051_processos-administrativos.md)
**Questão:** Tarefas administrativas executadas como processos one-off (não scripts separados)?

## O que é

Tarefas administrativas ou de manutenção (migrações de banco, scripts de correção, console REPL) devem ser executadas como **processos one-off** no mesmo ambiente e com o mesmo código da aplicação principal, não como scripts separados ou processos persistentes.

**Tarefas admin = mesmo código + mesmo ambiente + mesmo runtime.**

## Critérios de Conformidade

- [ ] Scripts de migração executados como one-off usando o mesmo runtime e dependências da aplicação
- [ ] Tarefas administrativas **versionadas no repositório** junto com o código da aplicação
- [ ] Zero execução de scripts via SSH direto no servidor (usar o mesmo mecanismo de deploy)

## ❌ Violação

```bash
# SSH direto em prod ❌
ssh prod-server
cd /app
node scripts/fix-data.js  # código fora do repositório

# Script de migração com dependências diferentes ❌
# migrations/001_add_users.sql executado manualmente
mysql -u root -p < migrations/001_add_users.sql
```

## ✅ Conforme

```bash
# Migração como processo one-off ✅
# Mesmo runtime, mesmas dependências, mesmo código da aplicação

# Heroku
heroku run npm run db:migrate

# Kubernetes
kubectl run migration --image=myapp:v1.2.3 --restart=Never \
  --command -- npm run db:migrate

# Docker
docker run --rm myapp:v1.2.3 npm run db:migrate

# Scripts versionados no repositório ✅
repo/
├── src/
│   └── app.ts
├── migrations/
│   └── 001_add_users.ts  # TypeScript, não SQL
└── package.json
    "scripts": {
      "db:migrate": "bun run migrations/run.ts"
    }
```

## Codetag quando violado

```typescript
// FIXME: Script administrativo não versionado — adicionar em migrations/
// Arquivo executado via SSH: /tmp/fix-users.js
```
