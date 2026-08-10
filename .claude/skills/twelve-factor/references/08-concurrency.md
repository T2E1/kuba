# Fator 08 — Concurrency

**Regra deMGoncalves:** [047 - Escalabilidade via Modelo de Processos](../../../rules/047_concorrencia-via-processos.md)
**Questão:** Aplicação escala via múltiplos processos (não threads ou processo único)?

## O que é

A aplicação deve escalar horizontalmente através da execução de **múltiplos processos independentes**, não através de threads internas ou um único processo monolítico. Diferentes tipos de trabalho (web, worker, scheduler) devem ser separados em tipos de processos distintos.

**Escalabilidade elástica = adicionar processos conforme a demanda.**

## Critérios de Conformidade

- [ ] Aplicação suporta execução de **múltiplas instâncias** do mesmo processo sem conflito
- [ ] Diferentes cargas de trabalho (HTTP, background jobs, tarefas agendadas) separadas em processos distintos
- [ ] Processo não faz *daemonize* nem escreve arquivos PID (gerenciamento é responsabilidade do ambiente)

## ❌ Violação

```typescript
// Processo único que faz tudo ❌
const app = express();
app.listen(3000);

// Jobs de background no mesmo processo
setInterval(() => {
  processQueue();  // viola a concorrência
}, 5000);

// Não escala horizontalmente
// Se duplicar o processo, processQueue() roda 2x
```

## ✅ Conforme

```typescript
// Processo web separado (web.ts) ✅
const app = express();
app.listen(process.env.PORT);

// Processo worker separado (worker.ts) ✅
const queue = new Queue(process.env.REDIS_URL);
queue.process('email', sendEmail);

// Procfile define tipos de processo
# Procfile
web: bun run src/web.ts
worker: bun run src/worker.ts
scheduler: bun run src/scheduler.ts

# Escalonamento independente
heroku ps:scale web=4 worker=2 scheduler=1
```

## Codetag quando violado

```typescript
// FIXME: Job de background no processo web — extrair para processo worker
setInterval(cleanupDatabase, 3600000);
```
