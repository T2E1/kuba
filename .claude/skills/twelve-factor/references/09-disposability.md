# Fator 09 — Disposability

**Regra deMGoncalves:** [048 - Descartabilidade de Processos](../../../rules/048_descartabilidade-processos.md)
**Questão:** Startup rápido (<10s) + shutdown graceful (SIGTERM tratado)?

## O que é

Os processos da aplicação devem ser **descartáveis** — podem ser iniciados ou parados a qualquer momento. Isso requer inicialização rápida, shutdown graceful e robustez contra terminação súbita (SIGTERM/SIGKILL).

**Descartabilidade = deploys rápidos + escalabilidade elástica + recuperação rápida.**

## Critérios de Conformidade

- [ ] Tempo de **startup** inferior a **10 segundos** para estar pronto
- [ ] Processo trata **SIGTERM** e finaliza requisições em andamento graciosamente
- [ ] Jobs de background são **idempotentes** e usam retry (podem ser interrompidos)

## ❌ Violação

```typescript
// Startup lento (>30s) ❌
app.listen(3000, async () => {
  await loadHugeDatasetIntoMemory();  // 45s
  await warmupAllCaches();  // 20s
  console.log('Pronto');
});

// Sem tratamento de SIGTERM ❌
// Processo é encerrado abruptamente
// Requisições em andamento são perdidas
```

## ✅ Conforme

```typescript
// Startup rápido (<5s) ✅
const server = app.listen(process.env.PORT, () => {
  console.log('Servidor pronto');
});

// Shutdown graceful ✅
process.on('SIGTERM', async () => {
  console.log('SIGTERM recebido, encerrando servidor graciosamente');

  server.close(async () => {
    // Finalizar requisições em andamento
    await cleanupConnections();
    process.exit(0);
  });

  // Timeout se não finalizar em 30s
  setTimeout(() => {
    console.error('Encerramento forçado');
    process.exit(1);
  }, 30000);
});

// Jobs idempotentes ✅
queue.process('email', async (job) => {
  const { userId, templateId } = job.data;

  // Verificar se já foi processado (idempotência)
  const sent = await db.emailLog.findOne({ userId, templateId });
  if (sent) return;

  await sendEmail(userId, templateId);
});
```

## Codetag quando violado

```typescript
// FIXME: Sem tratamento de SIGTERM — adicionar shutdown graceful
process.on('SIGTERM', () => process.exit(0));  // violação
```
