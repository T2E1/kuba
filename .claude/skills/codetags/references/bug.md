# BUG — Defeito Conhecido, Documentado e Rastreado

**Severidade:** 🔴 Crítica
**Bloqueia PR:** Não (mas deve ser priorizado)

## O Que É

Documenta um defeito conhecido que causa falha ou comportamento inesperado, mas está sendo rastreado e será corrigido em momento planejado. Diferente de FIXME (correção imediata), BUG indica um problema documentado com ticket/issue associado.

## Quando Usar

- Defeito com ticket aberto (bug reportado e priorizado no backlog)
- Problema conhecido com contorno (usuários trabalham ao redor temporariamente)
- Bug de terceiro aguardando correção (dependência com issue aberta)
- Problema intermitente em investigação (race condition difícil de reproduzir)

## Quando NÃO Usar

- Bug precisando de correção imediata → usar FIXME
- Código funciona mas é ruim → usar REFACTOR
- Problema de segurança → usar SECURITY
- Código temporário → usar HACK

## Formato

```typescript
// BUG: descrição do problema - ticket/issue
// BUG: [JIRA-123] descrição do comportamento incorreto
// BUG: descrição - contorno: como contornar
```

## Exemplo

```typescript
// BUG: [PROJ-456] notificação toast não aparece no Safari iOS
// Contorno: usuários podem ver notificações na página de histórico
function showNotification(message: string): void {
  toast.show(message); // Não funciona no Safari iOS < 15
}

// BUG: race condition quando múltiplas requisições chegam simultaneamente
// Ocorre em ~2% dos casos de alto tráfego
// Investigação em andamento - ticket PERF-789
async function processOrder(order: Order): Promise<void> {
  const inventory = await getInventory();
  // Inventário pode mudar entre get e update
  await updateInventory(order);
}
```

## Resolução

- **Prazo:** Sprint atual (crítico) ou próximas 2 sprints (com contorno)
- **Ação:** Documentar → Criar ticket → Adicionar referência → Documentar contorno → Priorizar → Remover após correção
- **Convertido em:** N/A (removido após correção)

## Relacionado a

- Rules: [027](../../../.claude/rules/027_qualidade-tratamento-erros-dominio.md), [032](../../../.claude/rules/032_cobertura-teste-minima-qualidade.md)
- Tags similares: BUG é planejado, FIXME é imediato
