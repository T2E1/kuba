# §7 — Deployment View

**Section:** 7 de 12
**Audience:** Técnico (DevOps, tech lead, arquiteto)
**When to update:** Ao mudar plataforma de infraestrutura, ao adicionar novo ambiente, ao alterar pipeline de CI/CD.

---

## Purpose

Esta seção documenta onde e como o sistema é executado: infraestrutura física/cloud, ambientes (dev, staging, prod), mapeamento de componentes para nós de execução, e o pipeline de entrega. Responde à pergunta: "Em que máquina/serviço cada parte roda?"

## Template

```markdown
# §7 — Deployment View

## Diagrama de Infraestrutura

```
┌──────────────────────────────────────────────────────────────────┐
│                        [Provedor Cloud]                           │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    Ambiente: Production                      │ │
│  │                                                             │ │
│  │  ┌───────────────────────┐    ┌──────────────────────────┐  │ │
│  │  │   [Edge Worker]       │    │  [Banco de Dados]        │  │ │
│  │  │   [Runtime]           │───►│  [Tipo / Região]         │  │ │
│  │  │                       │    │                          │  │ │
│  │  │  - [Componente A]     │    │  [Schema principal]      │  │ │
│  │  │  - [Componente B]     │    └──────────────────────────┘  │ │
│  │  └───────────────────────┘                                   │ │
│  │                 │                                            │ │
│  │                 ▼                                            │ │
│  │  ┌───────────────────────┐    ┌──────────────────────────┐  │ │
│  │  │   [KV Store / Cache]  │    │  [Queue / Pub-Sub]       │  │ │
│  │  │   [Tipo]              │    │  [Tipo]                  │  │ │
│  │  └───────────────────────┘    └──────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

## Mapeamento: Componentes → Nós de Execução

| Componente | Nó de Execução | Tecnologia | Região |
|------------|----------------|------------|--------|
| API Handler | [ex: Cloudflare Worker] | [ex: V8 Isolate] | [ex: Global Edge] |
| Banco de dados | [ex: Cloudflare D1] | [ex: SQLite] | [ex: São Paulo] |
| Cache | [ex: Cloudflare KV] | [ex: Key-Value] | [ex: Global] |
| Fila | [ex: Cloudflare Queue] | [ex: FIFO Queue] | [ex: Global] |
| Arquivos estáticos | [ex: Cloudflare R2] | [ex: S3-compatible] | [ex: Global] |

## Ambientes

| Ambiente | URL / Endpoint | Banco | Propósito |
|----------|---------------|-------|-----------|
| **Desenvolvimento** | `localhost:3000` | SQLite local | Desenvolvimento e testes unitários |
| **Staging** | `[URL staging]` | [Banco isolado] | Testes de integração e homologação |
| **Produção** | `[URL prod]` | [Banco prod] | Usuários finais |

## Pipeline de Entrega (CI/CD)

```
[Push / PR]
     │
     ▼
[Lint + Typecheck]  ←── falha → bloqueia merge
     │
     ▼
[Testes unitários]  ←── falha → bloqueia merge
     │
     ▼
[Build]             ←── falha → bloqueia deploy
     │
     ▼
[Deploy Staging]    ←── automático em merge para main
     │
     ▼
[Testes E2E]        ←── falha → rollback automático
     │
     ▼
[Deploy Produção]   ←── manual ou automático (definir)
```

## Configuração de Ambiente

| Variável | Ambiente | Descrição | Origem |
|----------|----------|-----------|--------|
| `DATABASE_URL` | Todos | String de conexão com o banco | Secret manager |
| `API_KEY_[SERVICO]` | Prod/Staging | Chave da API externa | Secret manager |
| `LOG_LEVEL` | Todos | Nível de log (info/debug/error) | Env var |
| `NODE_ENV` | Todos | Ambiente de execução | Plataforma |
```

## Conventions

- Secrets nunca em código — sempre via variáveis de ambiente (regra 030 e 042)
- Ambientes de staging e produção devem ser isolados (banco separado)
- Pipeline de CI/CD é obrigatório — deploy manual em produção é proibido
- Diagrama deve refletir a infraestrutura real, não a desejada

## Related to

- [06_runtime_view.md](06_runtime_view.md): complementa — §6 mostra o fluxo; §7 mostra onde ele executa
- [rule 046 Port Binding](../../../rules/046_port-binding.md): complementa — serviço deve se auto-configurar via porta
- [rule 047 Concorrência via Processos](../../../rules/047_concorrencia-via-processos.md): complementa — stateless permite horizontal scaling
- [rule 045 Processos Stateless](../../../rules/045_processos-stateless.md): complementa — nós de execução devem ser stateless
- [rule 030 Funções Inseguras](../../../rules/030_proibicao-funcoes-inseguras.md): complementa — secrets via env, nunca hardcoded

---

**Arc42 Section:** §7
**Source:** arc42.org — arc42 Template, adaptado para pt-BR
