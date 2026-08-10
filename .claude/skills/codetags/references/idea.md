# IDEA — Sugestão de Melhoria Futura

**Severidade:** 🟢 Baixa | Avaliar depois
**Bloqueia PR:** Não

## O Que É

Marca sugestão de melhoria futura ou ideia que ainda não foi validada ou priorizada. Diferente de TODO (tarefa confirmada), IDEA é uma proposta a ser considerada no planejamento ou retrospectivas.

## Quando Usar

- Melhoria não confirmada ("seria bom se...")
- Exploração futura (tecnologia a avaliar)
- Otimização potencial (pode ou não valer a pena)
- Solicitação informal de feature (ideia do desenvolvedor)

## Quando NÃO Usar

- Tarefa confirmada → usar **TODO**
- Otimização necessária → usar **OPTIMIZE**
- Refatoração identificada → usar **REFACTOR**
- Dúvida sobre abordagem → usar **QUESTION**

## Formato

```typescript
// IDEA: sugestão de melhoria
// IDEA: explorar X para resolver Y
// IDEA: considerar para v2 ou próxima iteração
```

## Exemplo

```typescript
// IDEA: adicionar suporte a exportação CSV além de JSON
// Alguns usuários solicitaram, mas não é prioridade agora
function exportData(data: any[], format = 'json'): string {
  if (format === 'json') {
    return JSON.stringify(data);
  }
  throw new Error('Formato não suportado');
}

// IDEA: avaliar Rust/WASM para este cálculo pesado
// Benchmark atual: 500ms para 100k itens
// WASM poderia reduzir para ~50ms
function heavyComputation(items: Item[]): number {
  return items.reduce((acc, item) => {
    // Cálculo intensivo
  }, 0);
}

// IDEA: adicionar skeleton loading em vez de spinner
// Melhor experiência percebida em conexões lentas
function LoadingState() {
  return <Spinner />;
}

// IDEA: migrar para event sourcing quando a escala exigir
// Atual: ~1000 eventos/dia - CRUD suficiente
// Se ultrapassar 100k/dia, reconsiderar
async function saveOrder(order: Order) {
  return db.orders.upsert(order);
}

// IDEA: aceitar array de IDs para requisição em lote
// Hoje: clientes fazem N requisições para N itens
// Futuro: uma requisição com [id1, id2, ...idN]
app.get('/api/items/:id', async (req, res) => {
  const item = await getItem(req.params.id);
  res.json(item);
});

// IDEA: criar CLI para scaffolding de novos módulos
// Hoje: copiar pasta de template manualmente
// Futuro: `npm run create-module nome-do-modulo`

// IDEA: adicionar testes de regressão visual para componentes
// Ferramentas a avaliar: Chromatic, Percy, Playwright
function Button({ variant, children }) {
  return <button className={`btn-${variant}`}>{children}</button>;
}
```

## Resolução

- **Prazo:** Backlog / avaliar no planejamento ou retrospectiva
- **Ação:** Registrar com contexto, avaliar periodicamente, promover para TODO se aprovado, remover se não fizer sentido
- **Convertido em:** TODO (se aprovado) ou removido (se descartado)

## Relacionado a

- Rules: [023 - YAGNI](../../../.claude/rules/023_proibicao-funcionalidade-especulativa.md) (IDEA ≠ implementar agora)
- Tags similares: IDEA (não confirmado) vs TODO (confirmado e priorizado)
