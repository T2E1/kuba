# §5 — Building Block View

**Section:** 5 de 12
**Audience:** Técnico (dev, arquiteto)
**When to update:** Ao adicionar novo contexto, container ou componente; ao refatorar a estrutura interna de um módulo.

---

## Purpose

Esta seção decompõe o sistema em blocos de construção (building blocks) em níveis progressivos de detalhe: Nível 1 (sistema inteiro), Nível 2 (containers/módulos principais), Nível 3 (componentes internos). Cada nível mostra responsabilidades e interfaces. É o equivalente Arc42 do C4 Levels 2 e 3.

## Template

```markdown
# §5 — Building Block View

## Nível 1 — Visão Geral do Sistema

[Descrever os principais módulos ou subsistemas do sistema e como se relacionam.]

```
┌─────────────────────────────────────────────────────────────┐
│                     [Nome do Sistema]                        │
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌───────────────┐  │
│  │              │    │              │    │               │  │
│  │  [Módulo A]  │───►│  [Módulo B]  │───►│  [Módulo C]   │  │
│  │              │    │              │    │               │  │
│  └──────────────┘    └──────────────┘    └───────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Responsabilidades dos Módulos (Nível 1)

| Módulo | Responsabilidade | Interface Exportada |
|--------|-----------------|---------------------|
| **[Módulo A]** | [O que este módulo faz] | [Quais funções/classes expõe] |
| **[Módulo B]** | [O que este módulo faz] | [Quais funções/classes expõe] |
| **[Módulo C]** | [O que este módulo faz] | [Quais funções/classes expõe] |

## Nível 2 — Decomposição de [Módulo Principal]

[Detalhar internamente o módulo mais complexo ou mais relevante para a arquitetura.]

```
┌─────────────────────────────────────────────────────────┐
│                     [Módulo Principal]                   │
│                                                         │
│  ┌────────────┐    ┌────────────┐    ┌────────────────┐  │
│  │            │    │            │    │                │  │
│  │ Controller │───►│  Service   │───►│  Repository    │  │
│  │            │    │            │    │                │  │
│  └────────────┘    └────────────┘    └────────────────┘  │
│         │                │                              │
│         ▼                ▼                              │
│  ┌────────────┐    ┌────────────┐                       │
│  │   Model    │    │  Validator │                       │
│  │  (types)   │    │            │                       │
│  └────────────┘    └────────────┘                       │
└─────────────────────────────────────────────────────────┘
```

### Responsabilidades dos Componentes (Nível 2)

| Componente | Arquivo | Responsabilidade |
|------------|---------|-----------------|
| **Controller** | `controller.ts` | HTTP handlers, validação de entrada, roteamento |
| **Service** | `service.ts` | Business logic pura, orquestração de casos de uso |
| **Repository** | `repository.ts` | Acesso a dados (D1, KV, API externa) |
| **Model** | `model.ts` | Types, interfaces, schemas, Value Objects |

## Nível 3 — Interfaces Internas de [Componente]

[Opcional: mostrar interfaces públicas do componente mais crítico.]

| Interface / Função | Assinatura | Responsabilidade |
|-------------------|------------|-----------------|
| `[functionName]` | `(input: InputType) => Promise<OutputType>` | [O que faz] |
| `[ClassName]` | `implements [Interface]` | [O que representa] |
```

## Conventions

- Nível 1 sempre obrigatório; Nível 2 para módulos com mais de 3 componentes; Nível 3 opcional
- Cada bloco deve ter responsabilidade única (regra SRP)
- Diagrama ASCII deve alinhar com a estrutura real de diretórios em `src/`
- Interfaces exportadas são contratos — alterá-las exige ADR

## Related to

- [c4model Level 2](../../c4model/references/02_container.md): equivalente — containers do C4 correspondem ao Nível 1 aqui
- [c4model Level 3](../../c4model/references/03_component.md): equivalente — componentes do C4 correspondem ao Nível 2 aqui
- [06_runtime_view.md](06_runtime_view.md): complementa — §6 mostra como estes blocos interagem em runtime
- [03_context_and_scope.md](03_context_and_scope.md): complementa — §3 mostra a fronteira externa; §5 mostra o interior
- [rule 010 SRP](../../../rules/010_principio-responsabilidade-unica.md): reforça — cada bloco deve ter responsabilidade única

---

**Arc42 Section:** §5
**Source:** arc42.org — arc42 Template, adaptado para pt-BR
