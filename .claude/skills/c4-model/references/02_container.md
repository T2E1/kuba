# Level 2 — Container

[Descrição do sistema decomposto em containers: cada processo, aplicação, armazenamento ou canal de comunicação que compõe o sistema. Mostra a tecnologia de cada parte e como os containers se comunicam entre si.]

## Diagrama de Containers

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                            [Nome do Sistema]                                  │
│                                                                              │
│  ┌─────────────────┐     ┌─────────────────┐     ┌──────────────────────┐   │
│  │                 │     │                 │     │                      │   │
│  │   [Web App]     │     │   [API Server]  │     │   [Worker / Queue]   │   │
│  │   [Tecnologia]  │────►│   [Tecnologia]  │────►│   [Tecnologia]       │   │
│  │                 │     │                 │     │                      │   │
│  │  [Responsabi-   │     │  [Responsabi-   │     │  [Responsabi-        │   │
│  │   lidade]       │     │   lidade]       │     │   lidade]            │   │
│  └─────────────────┘     └────────┬────────┘     └──────────────────────┘   │
│                                   │                                          │
│                    ┌──────────────┴──────────────┐                          │
│                    │                             │                          │
│           ┌────────▼────────┐          ┌─────────▼────────┐                │
│           │                 │          │                   │                │
│           │  [Database]     │          │  [Cache / KV]     │                │
│           │  [Tecnologia]   │          │  [Tecnologia]     │                │
│           │                 │          │                   │                │
│           │  [O que arma-   │          │  [O que arma-     │                │
│           │   zena]         │          │   zena]           │                │
│           └─────────────────┘          └───────────────────┘                │
└──────────────────────────────────────────────────────────────────────────────┘
         │                                         │
         ▼                                         ▼
┌─────────────────┐                      ┌─────────────────┐
│                 │                      │                 │
│  [Sistema Ext.  │                      │  [Sistema Ext.  │
│   Principal]    │                      │   Secundário]   │
│ [Sistema Externo]                      │ [Sistema Externo]
│                 │                      │                 │
└─────────────────┘                      └─────────────────┘
```

## Containers do Sistema

| Container | Tipo | Tecnologia | Responsabilidade |
|-----------|------|------------|-----------------|
| **[Web App]** | Single Page App / SSR | [ex: React, Next.js, HTML] | [Interface do usuário — formulários, visualizações, navegação] |
| **[API Server]** | API REST / GraphQL | [ex: Cloudflare Workers, Hono, Express] | [Lógica de negócio, autenticação, validação, orquestração] |
| **[Worker]** | Background Worker | [ex: Cloudflare Queue, BullMQ] | [Processamento assíncrono — envio de emails, relatórios, sync] |
| **[Database]** | Banco Relacional | [ex: Cloudflare D1, PostgreSQL, SQLite] | [Persistência de dados transacionais do domínio] |
| **[Cache]** | Key-Value Store | [ex: Cloudflare KV, Redis] | [Cache de sessões, dados frequentes, rate limiting] |
| **[Storage]** | Object Storage | [ex: Cloudflare R2, S3] | [Arquivos binários — imagens, documentos, exports] |

## Interações entre Containers

| De | Para | Protocolo | Formato | Descrição |
|----|------|-----------|---------|-----------|
| Web App | API Server | HTTPS | JSON | Chamadas REST autenticadas via Bearer token |
| API Server | Database | SQL | SQL/Resultset | Queries via prepared statements |
| API Server | Cache | KV API | Bytes | Leitura/escrita de cache com TTL |
| API Server | Worker | Queue | JSON | Enfileiramento de jobs assíncronos |
| Worker | Database | SQL | SQL/Resultset | Leitura e atualização de jobs processados |
| API Server | [Sistema Externo] | HTTPS | JSON | Chamadas para API externa com retry |

## Tecnologias por Container

| Container | Runtime | Linguagem | Framework | Deploy |
|-----------|---------|-----------|-----------|--------|
| **[API Server]** | [ex: V8 Isolate] | TypeScript | [ex: Hono] | [ex: Cloudflare Workers] |
| **[Web App]** | [ex: Browser / Node] | TypeScript | [ex: React] | [ex: Cloudflare Pages] |
| **[Worker]** | [ex: V8 Isolate] | TypeScript | — | [ex: Cloudflare Queue Consumer] |

---

## Relacionado a

- [arc42 §3 — Contexto e Escopo](../../arc42/references/03_context_and_scope.md): complementa — §3 mostra sistemas externos; Level 2 mostra o interior do sistema
- [arc42 §5 — Building Block View](../../arc42/references/05_building_block_view.md): equivalente — Nível 1 de §5 corresponde aos containers aqui
- [c4model Level 1 — System Context](01_system-context.md): depende — Level 2 decompõe o sistema mostrado em Level 1
- [c4model Level 3 — Component](03_component.md): complementa — Level 3 decompõe internamente cada container aqui listado

---

**Author:** [Nome] · [Link]
