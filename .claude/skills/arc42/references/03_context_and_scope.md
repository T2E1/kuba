# §3 — Contexto e Escopo

**Section:** 3 de 12
**Audience:** Todos (stakeholders, gestão, técnico)
**When to update:** Ao iniciar o projeto, ao adicionar novo ator ou sistema externo, ao mudar fronteira do sistema.

---

## Purpose

Esta seção define a fronteira do sistema: o que está dentro (responsabilidade do sistema) e o que está fora (atores e sistemas externos). O diagrama de contexto mostra o sistema como caixa preta interagindo com o mundo externo. É o equivalente Arc42 do C4 Level 1.

## Template

```markdown
# §3 — Contexto e Escopo

## Diagrama de Contexto do Sistema

```
┌───────────────┐                  ┌────────────────────────────────────────┐
│               │  [ação / dados]  │                                        │
│  [Ator        │─────────────────►│          [Nome do Sistema]             │
│   Principal]  │                  │          [Tipo do Sistema]             │
│   [Papel]     │◄─────────────────│                                        │
│               │  [resposta]      │  [O que o sistema faz em 1-2 linhas]  │
└───────────────┘                  │                                        │
                                   │                                        │───►  [Sistema Externo A]
┌───────────────┐                  │                                        │      [SaaS / API]
│               │  [ação / dados]  │                                        │
│  [Ator        │─────────────────►│                                        │───►  [Sistema Externo B]
│   Secundário] │                  │                                        │      [Banco / Storage]
│   [Papel]     │                  └────────────────────────────────────────┘
│               │
└───────────────┘
```

## Contexto de Negócio

| Elemento | Tipo | Descrição | Interface |
|----------|------|-----------|-----------|
| **[Ator Principal]** | Pessoa | [Quem é, qual papel no processo] | [Canal: Web, API, CLI, Webhook] |
| **[Ator Secundário]** | Pessoa | [Quem é, qual papel no processo] | [Canal] |
| **[Sistema Externo A]** | Sistema SaaS | [O que é e para que serve] | **IN:** [o que enviamos]. **OUT:** [o que recebemos] |
| **[Sistema Externo B]** | Banco de dados | [O que armazena] | **IN:** queries SQL. **OUT:** result sets |

## Contexto Técnico

| Interface | Protocolo | Formato | Direção |
|-----------|-----------|---------|---------|
| [API externa A] | HTTPS REST | JSON | Saída (nosso sistema chama) |
| [Webhook de B] | HTTPS POST | JSON | Entrada (sistema externo nos chama) |
| [Canal de notificação] | [Protocolo] | [Formato] | [Direção] |

## O Que Está Fora do Escopo

- [Funcionalidade X — tratada pelo sistema Y]
- [Funcionalidade Z — responsabilidade do ator A]
- [Integração com W — fora do MVP, backlog para v2]
```

## Conventions

- O diagrama deve mostrar apenas o nível de sistema (caixa preta)
- Não mostrar detalhes internos de implementação aqui
- Cada sistema externo deve ter direção de fluxo explícita (IN / OUT)
- Atores são pessoas ou papéis — não nomes próprios de indivíduos
- Esta seção é equivalente ao C4 Level 1 e deve ser mantida sincronizada

## Related to

- [c4model Level 1](../../c4model/references/01_system-context.md): equivalente — mesmo diagrama em formato C4
- [05_building_block_view.md](05_building_block_view.md): complementa — §5 decompõe o interior da caixa preta de §3
- [01_introduction_and_goals.md](01_introduction_and_goals.md): complementa — atores de §3 são os stakeholders de §1
- [12_glossary.md](12_glossary.md): complementa — termos de domínio introduzidos aqui devem ser definidos em §12

---

**Arc42 Section:** §3
**Source:** arc42.org — arc42 Template, adaptado para pt-BR
