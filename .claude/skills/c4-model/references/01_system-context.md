# Level 1 — System Context

[Descrição do sistema como caixa preta: o que ele faz em uma frase objetiva e qual problema resolve.]

## Diagrama de Contexto do Sistema

```
                                    ┌─────────────────────────────────────────────┐
                                    │                                             │
                                    │        [Nome do Sistema]                    │
                                    │        [Sistema de Software]                │
                                    │                                             │
                                    │  [Descrição funcional em 1-2 linhas:        │
                                    │  o que o sistema faz automaticamente        │
                                    │  e qual é o resultado principal.]           │
   ┌───────────────┐                │                                             │
   │               │  [Ação do      │                                             │
   │  [Ator        │   ator sobre   │                                             │     ┌─────────────────┐
   │   Principal]  │   o sistema]   │                                             │     │                 │
   │   [Pessoa]    │───────────────►│                                             │────►│  [Sistema Ext.  │
   │               │                │                                             │     │   Principal]    │
   │  [Descrição   │◄───────────────│                                             │     │ [Sistema Externo]│
   │   do papel]   │  [O que o      │                                             │     │                 │
   │               │   sistema      │                                             │     │  [O que armazena│
   │               │   devolve]     │                                             │     │   ou provê]     │
   └───────────────┘                │                                             │     └─────────────────┘
                                    │                                             │
                                    │                                             │     ┌─────────────────┐
                                    │                                             │     │                 │
                                    │                                             │────►│  [Sistema Ext.  │
                                    │                                             │     │   Secundário]   │
                                    │                                             │     │ [Sistema Externo]│
                                    │                                             │     │                 │
                                    │                                             │     │  [Serviço que   │
                                    │                                             │     │   provê]        │
                                    └──────────────────────┬──────────────────────┘     └─────────────────┘
                                                           │
                                              ┌────────────┼────────────┐
                                              │            │            │
                                              ▼            ▼            ▼
                                    ┌──────────────┐ ┌──────────┐ ┌──────────────┐
                                    │ [Sist. Ext.  │ │[Sist.Ext]│ │ [Canal de    │
                                    │  Apoio A]    │ │  Apoio B]│ │  Comunicação]│
                                    │ [Sist. Ext.] │ │[Sist.Ext]│ │  [Canal]     │
                                    │              │ │          │ │              │
                                    │ [Papel/      │ │[Papel/   │ │ [Papel/      │
                                    │  Função]     │ │ Função]  │ │  Função]     │
                                    └──────────────┘ └──────────┘ └──────────────┘
```

## Atores e Sistemas Externos

### Pessoas

| Ator | Descrição | Interação com o Sistema |
|------|-----------|------------------------|
| **[Nome do Ator]** | [Quem é, qual cargo/papel, pré-requisitos para interagir com o sistema.] | [O que envia ao sistema. O que recebe do sistema. Em qual canal.] |

### Sistemas Externos

| Sistema | Tipo | Descrição | Interação |
|---------|------|-----------|-----------|
| **[Nome]** | [SaaS / Self-hosted / Canal] | [O que é e para que serve no contexto do sistema.] | **IN:** [O que este sistema externo recebe do nosso sistema — método HTTP, header, payload]. **OUT:** [O que este sistema externo envia ao nosso sistema — webhook, callback, resposta]. |
| **[Nome]** | [SaaS / Self-hosted / Canal] | [Descrição.] | **IN:** [Detalhe]. **OUT:** [Detalhe]. |

## Fluxo Resumido

```
1. [Ator] [ação iniciada pelo ator]
2. [Sistema Externo A] [o que faz como consequência]
3. [O sistema] [valida / processa / consulta]
4. [Sistema Externo B] [consulta ou atualiza]
5. [O sistema] [responde ou envia] ao [Ator] via [canal]
6. [O sistema] [ação assíncrona opcional, ex: agenda follow-up]
```

## Motivação e Contexto

[Descrever qual processo manual ou ineficiência o sistema substitui ou melhora. Por que este canal/abordagem foi escolhido?]

Benefícios concretos do sistema:
- [Benefício 1 — ex: coleta padronizada de dados]
- [Benefício 2 — ex: validação automática de regras de negócio]
- [Benefício 3 — ex: eliminação de intervenção humana em tarefas repetitivas]
- [Benefício 4 — ex: rastreabilidade e auditoria automática]

### Restrições Externas

- **[Canal único ou tecnologia mandatória]** — [Por que é uma restrição e qual é o impacto.]
- **[Sistema externo com schema fixo]** — [O que não pode ser alterado e por quê.]
- **[Idioma / localização obrigatória]** — [Restrição de língua ou região.]

---

## Relacionado a

- [arc42 §3 — Contexto e Escopo](../arc42/03_context_and_scope.md): equivalente

---

**Author:** [Nome] · [Link]
