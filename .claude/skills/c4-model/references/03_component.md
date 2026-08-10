# Level 3 — Component

[Descrição da organização interna de um container específico em componentes. Mostra como o container é estruturado, quais são as responsabilidades de cada componente e como eles se comunicam entre si. Este nível é destinado ao time de desenvolvimento — quem vai implementar ou modificar o container.]

## Container em Foco: [Nome do Container]

[Identificar qual container está sendo decomposto. Ex: "API Server — Cloudflare Worker implementado em TypeScript com Hono, responsável pela lógica de negócio e orquestração."]

## Diagrama de Componentes

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                          [Nome do Container]                                  │
│                          [Tecnologia do Container]                            │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐   │
│  │  [Context / Domínio A]                                                │   │
│  │                                                                       │   │
│  │  ┌──────────────┐     ┌──────────────┐     ┌──────────────────────┐  │   │
│  │  │              │     │              │     │                      │  │   │
│  │  │  Controller  │────►│   Service    │────►│    Repository        │  │   │
│  │  │              │     │              │     │                      │  │   │
│  │  │  HTTP routes │     │  Use cases   │     │  Data access (D1/KV) │  │   │
│  │  │  Validation  │     │  Biz rules   │     │                      │  │   │
│  │  └──────┬───────┘     └──────┬───────┘     └──────────────────────┘  │   │
│  │         │                   │                                         │   │
│  │         └─────────┬─────────┘                                         │   │
│  │                   ▼                                                   │   │
│  │         ┌──────────────────┐                                          │   │
│  │         │      Model       │                                          │   │
│  │         │  Types, schemas  │                                          │   │
│  │         │  Value Objects   │                                          │   │
│  │         └──────────────────┘                                          │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐   │
│  │  [Context / Domínio B]   (mesmo padrão)                               │   │
│  │  Controller → Service → Repository → Model                            │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌──────────────────────────┐   ┌──────────────────────────────────────────┐ │
│  │  [Shared / Infraestrutura│   │  [Middleware / Cross-cutting]            │ │
│  │  Logger, ErrorHandler    │   │  Auth guard, Rate limiter, CORS          │ │
│  │  DB Client, KV Client]   │   │                                          │ │
│  └──────────────────────────┘   └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
                                        │
          ┌─────────────────────────────┼─────────────────────────────┐
          ▼                             ▼                             ▼
  ┌───────────────┐           ┌──────────────────┐          ┌─────────────────┐
  │ [Database]    │           │ [Cache / KV]     │          │ [Sistema Ext.]  │
  │ [Container]   │           │ [Container]      │          │ [Externo]       │
  └───────────────┘           └──────────────────┘          └─────────────────┘
```

## Componentes do Container

| Componente | Arquivo | Responsabilidade | Interface Pública |
|------------|---------|-----------------|-------------------|
| **Controller** | `controller.ts` | HTTP handlers: recebe request, valida schema, delega ao service, retorna response | Handlers Hono/Express registrados no router |
| **Service** | `service.ts` | Lógica de negócio pura: orquestra casos de uso, aplica regras de domínio | Métodos de caso de uso tipados |
| **Repository** | `repository.ts` | Acesso a dados: queries SQL (D1), leitura/escrita KV, chamadas a APIs externas | Interface `IRepository` com métodos CRUD |
| **Model** | `model.ts` | Types, interfaces, schemas Zod, Value Objects, DTOs | Types/interfaces exportados |
| **Logger** | `shared/logger.ts` | Logging estruturado em JSON para stdout | `logger.info()`, `logger.error()` |
| **ErrorHandler** | `shared/errors.ts` | Classes de erro de domínio: `ValidationError`, `NotFoundError`, `DomainError` | Classes de erro exportadas |
| **AuthGuard** | `middleware/auth.ts` | Verificação de token JWT em cada request protegido | Middleware Hono |

## Dependências entre Componentes

| Componente | Depende de | Tipo de Dependência | Direção |
|------------|-----------|---------------------|---------|
| Controller | Service | Injeção de dependência via interface | Controller → Service |
| Controller | Model (types) | Import de tipos | Controller → Model |
| Service | Repository | Injeção de dependência via interface | Service → Repository |
| Service | Model (types) | Import de tipos | Service → Model |
| Repository | DB Client (shared) | Import direto | Repository → Shared |
| Controller | ErrorHandler | Import de classes de erro | Controller → Shared |
| Service | ErrorHandler | Import de classes de erro | Service → Shared |

## Estrutura de Diretórios Correspondente

```
src/
└── [context]/
    └── [container]/
        └── [component]/
            ├── controller.ts      ← HTTP handlers
            ├── service.ts         ← Business logic
            ├── repository.ts      ← Data access
            ├── model.ts           ← Types, interfaces, schemas
            └── [component].test.ts ← Testes unitários
```

---

## Relacionado a

- [arc42 §5 — Building Block View](../../arc42/references/05_building_block_view.md): equivalente — Nível 2 de §5 corresponde aos componentes aqui
- [c4model Level 2 — Container](02_container.md): depende — Level 3 decompõe um container específico de Level 2
- [c4model Level 4 — Code](04_code.md): complementa — Level 4 mostra a implementação interna de cada componente aqui
- [rule 010 SRP](../../../rules/010_principio-responsabilidade-unica.md): reforça — cada componente deve ter responsabilidade única
- [rule 014 DIP](../../../rules/014_principio-inversao-dependencia.md): reforça — componentes dependem de interfaces, não de concretos

---

**Author:** [Nome] · [Link]
