# TODO — Tarefa Pendente

**Severidade:** 🟡 Média | Resolver na sprint
**Bloqueia PR:** Não

## O Que É

Marca tarefa pendente ou funcionalidade planejada que ainda não foi implementada. É a codetag mais comum e indica trabalho futuro que está no radar do time.

## Quando Usar

- Funcionalidade parcialmente implementada (falta validação de caso extremo)
- Placeholder para implementação futura (função com stub)
- Melhoria confirmada e planejada (adicionar cache)
- Integração pendente com serviço externo

## Quando NÃO Usar

- Bug para corrigir → usar **FIXME**
- Código para reestruturar → usar **REFACTOR**
- Otimização de performance → usar **OPTIMIZE**
- Ideia futura não confirmada → usar **IDEA**

## Formato

```typescript
// TODO: descrição clara da tarefa
// TODO: [TICKET-123] descrição com rastreamento
// TODO: descrição - prazo se aplicável
```

## Exemplo

```typescript
// TODO: [PROJ-456] adicionar validação de formato de email
function createUser(email: string, password: string) {
  // Validação de email pendente
  return db.users.create({ email, password });
}

// TODO: implementar paginação - limite atual de 100 itens
async function listProducts() {
  return db.products.findAll({ limit: 100 });
}

// TODO: implementar retry com backoff exponencial
async function fetchWithRetry(url: string) {
  return fetch(url);
}
```

## Resolução

- **Prazo:** Sprint planejada (bloqueador de feature) ou próxima sprint (melhoria)
- **Ação:** Criar ticket, priorizar no backlog, implementar quando priorizado
- **Convertido em:** Removido após implementação completa

## Relacionado a

- Rules: [023 - YAGNI](../../../.claude/rules/023_proibicao-funcionalidade-especulativa.md) (não criar TODOs especulativos)
- Tags similares: TODO (confirmado) vs IDEA (não confirmado)
