# Vertical Slice — Referência Completa

## Estrutura de src/ para Projeto Real

```
src/
│
├── user/                         ← Contexto: domínio "user"
│   ├── auth/                     ← Container: autenticação
│   │   ├── login/                ← Componente
│   │   │   ├── controller.ts
│   │   │   ├── service.ts
│   │   │   ├── model.ts
│   │   │   ├── repository.ts
│   │   │   └── login.test.ts
│   │   ├── register/
│   │   │   ├── controller.ts
│   │   │   ├── service.ts
│   │   │   ├── model.ts
│   │   │   ├── repository.ts
│   │   │   └── register.test.ts
│   │   └── refresh/
│   │       └── [mesmos arquivos]
│   │
│   └── profile/                  ← Container: perfil de usuário
│       ├── update/
│       └── avatar/
│
├── order/                        ← Contexto: domínio "order"
│   ├── cart/                     ← Container: carrinho de compras
│   │   ├── add-item/
│   │   ├── remove-item/
│   │   └── checkout/
│   │
│   └── history/                  ← Container: histórico de pedidos
│       └── list/
│
└── notification/                 ← Contexto: domínio "notification"
    └── in-app/                   ← Container
        ├── list/
        └── mark-read/
```

---

## Guia de Decisão

### Quando Criar um Novo Contexto?

Criar um novo Contexto quando ele representa um **domínio de negócio independente** — algo que poderia ser um microserviço separado.

| Situação | Decisão |
|----------|---------|
| É um domínio de negócio diferente? | Novo Contexto |
| Compartilha entidades com outro contexto? | Avaliar: subdomínio ou contexto separado |
| É uma feature de um domínio existente? | Container dentro do Contexto existente |

### Quando Criar um Novo Container?

Criar um Container para **agrupar operações relacionadas** dentro de um Contexto.

| Situação | Decisão |
|----------|---------|
| Conjunto de operações CRUD para uma entidade | Container (ex: `profile/`) |
| Funcionalidade específica com múltiplos endpoints | Container (ex: `auth/`) |
| Processo de negócio com etapas sequenciais | Container (ex: `checkout/`) |

### Quando Criar um Novo Componente?

Cada Componente representa **uma operação específica** — tipicamente um endpoint HTTP ou um caso de uso.

| Operação | Componente |
|----------|------------|
| POST /users/auth/login | `user/auth/login/` |
| GET /orders/cart | `order/cart/list/` |
| PUT /users/profile/avatar | `user/profile/avatar/` |

---

## Regras de Nomenclatura

| Nível | Formato | Exemplos |
|-------|---------|----------|
| Contexto | `kebab-case` singular | `user`, `order`, `notification` |
| Container | `kebab-case` singular ou verbo | `auth`, `cart`, `profile`, `in-app` |
| Componente | `kebab-case` verbo ou substantivo de ação | `login`, `checkout`, `add-item`, `list` |
| Arquivo de teste | `[componente].test.ts` | `login.test.ts`, `checkout.test.ts` |

---

## Como uma Feature Mapeia para o Caminho

Ao receber uma solicitação de feature como *"implementar login com JWT"*:

1. **Contexto**: `user` — domínio de usuário
2. **Container**: `auth` — autenticação
3. **Componente**: `login` — operação específica de login
4. **Caminho**: `src/user/auth/login/`
5. **Arquivos**:
   - `controller.ts` — POST /auth/login
   - `service.ts` — validação + geração de JWT
   - `model.ts` — LoginRequest, LoginResponse, JwtPayload
   - `repository.ts` — busca de usuário no banco
   - `login.test.ts` — testes da feature

---

## Benefícios para o Workflow do oh my claude

| Benefício | Como se Manifesta |
|-----------|-------------------|
| **Eficiência do LLM** | @coder lê apenas `src/user/auth/login/` — sem precisar processar todo o src/ |
| **Isolamento de tarefas** | Cada Task tem um caminho único — zero conflito entre tasks paralelas |
| **Higiene de Git** | Uma feature = um diretório = PR limpo sem diffs espalhados |
| **Cobertura de testes** | Cada componente tem seu `.test.ts` co-localizado — fácil de medir cobertura |
| **Onboarding** | Novo dev encontra tudo em um lugar — sem "onde está X?" |
