# §6 — Runtime View

**Section:** 6 de 12
**Audience:** Técnico (dev, QA, arquiteto)
**When to update:** Ao implementar novo fluxo crítico de negócio, ao mudar a sequência de chamadas entre componentes, ao adicionar passo assíncrono.

---

## Purpose

Esta seção documenta como o sistema se comporta em tempo de execução: a sequência de chamadas entre componentes, os fluxos de dados em cenários concretos (happy path e error path), e os padrões de comunicação assíncrona. Onde §5 mostra a estrutura estática, §6 mostra o comportamento dinâmico.

## Template

```markdown
# §6 — Runtime View

## Cenário 1 — [Nome do Fluxo Principal]

[Descrever o cenário: quem inicia, qual é o objetivo, qual é o resultado esperado.]

### Diagrama de Sequência

```
[Ator / Cliente]     [Controller]      [Service]       [Repository]    [Sistema Ext.]
       │                   │               │                 │               │
       │── POST /[rota] ──►│               │                 │               │
       │                   │─ validate() ─►│                 │               │
       │                   │               │─ findById() ───►│               │
       │                   │               │                 │── SELECT ─────►│
       │                   │               │                 │◄── result ────│
       │                   │               │◄── entity ─────│               │
       │                   │               │─ process() ────────────────────►│
       │                   │               │◄── response ───────────────────│
       │                   │               │─ save() ───────►│               │
       │                   │               │                 │── INSERT ─────►│
       │                   │               │                 │◄── ok ────────│
       │                   │◄── result ───│                 │               │
       │◄── 200 OK ────────│               │                 │               │
```

### Passos do Fluxo

| Passo | Componente | Ação | Entrada | Saída |
|-------|------------|------|---------|-------|
| 1 | [Cliente] → Controller | [Chama endpoint] | `[payload JSON]` | — |
| 2 | Controller | Valida entrada | Request body | Schema validado |
| 3 | Controller → Service | Delega caso de uso | DTO validado | — |
| 4 | Service → Repository | Consulta dados | ID | Entity |
| 5 | Service | Aplica regra de negócio | Entity | Entity modificada |
| 6 | Service → Repository | Persiste | Entity | void |
| 7 | Controller → Cliente | Responde | Result DTO | `200 OK + JSON` |

## Cenário 2 — [Nome do Fluxo de Erro]

[Descrever o cenário de erro mais comum ou mais crítico.]

### Diagrama de Sequência (Error Path)

```
[Cliente]       [Controller]      [Service]       [Repository]
     │                │               │                 │
     │── POST /rota ─►│               │                 │
     │                │─ validate() ─►│ (lança erro)    │
     │                │◄─ ValidationError              │
     │◄── 400 Bad ────│               │                 │
     │    Request      │               │                 │
```

### Tratamento de Erros por Camada

| Camada | Tipo de Erro | Ação | Status HTTP |
|--------|-------------|------|-------------|
| Controller | ValidationError | Retorna 400 com detalhes | 400 |
| Service | DomainError | Relança para controller | 422 |
| Repository | NotFoundError | Relança para service | 404 |
| Geral | Error inesperado | Log + 500 | 500 |

## Cenário 3 — [Nome do Fluxo Assíncrono]

[Descrever se há processamento assíncrono, filas, eventos, webhooks.]

### Fluxo Assíncrono

```
[Trigger]       [Handler]         [Queue]         [Worker]
     │               │               │               │
     │── evento ────►│               │               │
     │               │── enqueue ───►│               │
     │◄── 202 ───────│               │               │
     │               │               │── dequeue ───►│
     │               │               │               │── processa
     │               │               │               │── persiste
```
```

## Conventions

- Cada cenário deve ter nome descritivo que reflita a ação de negócio (não técnica)
- Diagramas de sequência mostram nomes de métodos reais, não abstratos
- Error path é obrigatório para cada happy path documentado
- Cenários assíncronos devem mostrar o que acontece em caso de falha no worker

## Related to

- [05_building_block_view.md](05_building_block_view.md): depende — §6 anima os blocos estáticos de §5
- [07_deployment_view.md](07_deployment_view.md): complementa — deployment define onde cada componente roda
- [rule 028 Exceção Assíncrona](../../../rules/028_tratamento-excecao-assincrona.md): complementa — error paths devem seguir a regra de tratamento assíncrono
- [rule 027 Erros de Domínio](../../../rules/027_qualidade-tratamento-erros-dominio.md): complementa — erros nos fluxos devem ser de domínio

---

**Arc42 Section:** §6
**Source:** arc42.org — arc42 Template, adaptado para pt-BR
