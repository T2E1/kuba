# Level 4 — Code

[Descrição da implementação interna de um componente específico em código. Mostra as classes, interfaces e funções que compõem o componente, seus contratos, padrões de design aplicados e como se relacionam. Este nível é destinado ao desenvolvedor que vai implementar ou modificar o componente.]

## Componente em Foco: [Nome do Componente]

[Identificar qual componente está sendo detalhado. Ex: "Service do contexto `user_auth`, container `login`, componente `authentication` — responsável pela lógica de autenticação de usuários."]

## Diagrama de Classes / Interfaces

```
┌─────────────────────────────────────────────────────────────────────┐
│                   [NomeDoComponente] — Interfaces                    │
│                                                                     │
│  «interface»                        «interface»                     │
│  I[NomeDoService]                   I[NomeDoRepository]             │
│  ┌──────────────────────┐           ┌─────────────────────────┐    │
│  │ + execute(           │           │ + findById(             │    │
│  │     input: InputDTO  │           │     id: string          │    │
│  │   ): Promise<Output> │           │   ): Promise<Entity>    │    │
│  │                      │           │ + save(                 │    │
│  │ + validate(          │           │     entity: Entity      │    │
│  │     input: unknown   │           │   ): Promise<void>      │    │
│  │   ): InputDTO        │           │ + delete(               │    │
│  └──────────┬───────────┘           │     id: string          │    │
│             │ implements            │   ): Promise<void>      │    │
│             ▼                       └──────────┬──────────────┘    │
│  [NomeDoService]                               │ implements        │
│  ┌──────────────────────┐                      ▼                   │
│  │ - repository:        │           [NomeDoRepository]             │
│  │     I[NomeRepo]      │           ┌─────────────────────────┐    │
│  │                      │           │ - db: D1Database         │    │
│  │ + execute(...)       │           │                          │    │
│  │ + validate(...)      │           │ + findById(...)          │    │
│  │ - applyRule(...)     │           │ + save(...)              │    │
│  └──────────────────────┘           │ + delete(...)            │    │
│                                     └─────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                   [NomeDoComponente] — Value Objects / Types         │
│                                                                     │
│  «Value Object»           «DTO»                «interface»          │
│  [NomeEntity]             InputDTO             OutputDTO            │
│  ┌──────────────┐         ┌────────────┐       ┌─────────────────┐  │
│  │ + id: string │         │ + field1:  │       │ + id: string    │  │
│  │ + field: X   │         │     string │       │ + result: Y     │  │
│  │              │         │ + field2:  │       └─────────────────┘  │
│  │ (readonly)   │         │     number │                            │
│  │ (frozen)     │         └────────────┘                            │
│  └──────────────┘                                                   │
└─────────────────────────────────────────────────────────────────────┘
```

## Tabela de Classes e Interfaces

| Classe / Interface | Tipo | Responsabilidade | Pattern Aplicado |
|-------------------|------|-----------------|-----------------|
| `I[NomeDoService]` | Interface | Contrato do service — desacopla controller do service | DIP (rule 014) |
| `[NomeDoService]` | Classe concreta | Implementa a lógica de negócio do caso de uso | SRP (rule 010) |
| `I[NomeDoRepository]` | Interface | Contrato de acesso a dados — desacopla service do DB | Repository Pattern |
| `[NomeDoRepository]` | Classe concreta | Acesso ao D1 — queries SQL via prepared statements | Repository Pattern |
| `[NomeEntity]` | Value Object | Entidade de domínio imutável (Object.freeze) | Value Object |
| `InputDTO` | DTO | Schema de entrada validado por Zod | DTO |
| `OutputDTO` | DTO | Shape de resposta ao cliente | DTO |

## Esqueleto de Implementação TypeScript

```typescript
// model.ts — Types, interfaces, schemas, Value Objects
import { z } from "zod";

export const InputSchema = z.object({
  field1: z.string().min(1).max(255),
  field2: z.number().positive(),
});

export type InputDTO = z.infer<typeof InputSchema>;

export interface OutputDTO {
  readonly id: string;
  readonly result: string;
}

export interface Entity {
  readonly id: string;
  readonly field1: string;
  readonly field2: number;
}

// repository.ts — Interface de acesso a dados
export interface I[NomeDoRepository] {
  findById(id: string): Promise<Entity | null>;
  save(entity: Entity): Promise<void>;
}

// service.ts — Interface e implementação de business logic
export interface I[NomeDoService] {
  execute(input: InputDTO): Promise<OutputDTO>;
}

export class [NomeDoService] implements I[NomeDoService] {
  constructor(private readonly repository: I[NomeDoRepository]) {}

  async execute(input: InputDTO): Promise<OutputDTO> {
    const entity = await this.repository.findById(input.field1);
    if (!entity) {
      throw new NotFoundError("[ENTITY_NOT_FOUND]", "Entidade não encontrada");
    }
    // aplicar regra de negócio...
    return { id: entity.id, result: "..." };
  }
}

// controller.ts — HTTP handler
export function registerRoutes(app: Hono, service: I[NomeDoService]): void {
  app.post("/[rota]", async (context) => {
    const raw = await context.req.json();
    const result = InputSchema.safeParse(raw);
    if (!result.success) {
      throw new ValidationError("INVALID_INPUT", result.error.message);
    }
    const output = await service.execute(result.data);
    return context.json(output, 201);
  });
}
```

## Restrições de Implementação

| Restrição | Regra | Critério |
|-----------|-------|---------|
| Máximo 50 linhas por classe | rule 007 | Excluindo linhas em branco e comentários |
| Máximo 15 linhas por método | rule 055 | Excluindo linhas em branco |
| Máximo 3 parâmetros por função | rule 033 | Usar DTO para mais de 3 |
| Complexidade ciclomática ≤ 5 | rule 022 | Por método |
| Zero getters/setters puros | rule 008 | Usar métodos de domínio |
| Dependência via interface | rule 014 | Nunca instanciar concreto em service |

---

## Relacionado a

- [c4model Level 3 — Component](03_component.md): depende — Level 4 detalha a implementação de um componente de Level 3
- [gof patterns](../../gof/SKILL.md): complementa — patterns aplicados nas classes aqui diagramadas
- [rule 007 Limite de Linhas](../../../rules/007_limite-maximo-linhas-classe.md): reforça — máximo 50 linhas por classe
- [rule 010 SRP](../../../rules/010_principio-responsabilidade-unica.md): reforça — cada classe tem responsabilidade única
- [rule 014 DIP](../../../rules/014_principio-inversao-dependencia.md): reforça — classes de alto nível dependem de interfaces
- [rule 029 Imutabilidade](../../../rules/029_imutabilidade-objetos-freeze.md): reforça — Value Objects são frozen

---

**Author:** [Nome] · [Link]
