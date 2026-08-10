# §4 — Estratégia de Solução

**Section:** 4 de 12
**Audience:** Técnico (tech lead, arquiteto, dev sênior)
**When to update:** Ao iniciar o projeto, ao mudar tecnologia central, ao adotar novo padrão arquitetural.

---

## Purpose

Esta seção documenta as decisões fundamentais que moldam a arquitetura: escolha de tecnologia, estilo arquitetural, estratégia de qualidade e padrões estruturais adotados. É a ponte entre os objetivos de §1 e as decisões detalhadas nos ADRs de §9. Responde à pergunta: "Como vamos construir isso?"

## Template

```markdown
# §4 — Estratégia de Solução

## Visão Geral da Estratégia

[Descrever em 3-5 frases a abordagem geral: qual estilo arquitetural foi adotado, por que, e como ele atende aos objetivos de negócio e requisitos de qualidade de §1.]

## Decisões Tecnológicas Fundamentais

| Decisão | Escolha | Alternativas Consideradas | Motivação |
|---------|---------|--------------------------|-----------|
| Runtime | [ex: Cloudflare Workers] | [ex: Node.js, Deno, Bun] | [ex: Edge computing, custo zero no free tier] |
| Linguagem | [ex: TypeScript strict] | [ex: JavaScript, Go] | [ex: Tipagem estática, tooling maduro] |
| Banco de dados | [ex: D1 SQLite] | [ex: PostgreSQL, MongoDB] | [ex: Integrado ao Workers, sem latência de rede] |
| Testes | [ex: Bun test] | [ex: Jest, Vitest] | [ex: Zero config, compatível com o runtime] |
| Linter/Formatter | [ex: Biome] | [ex: ESLint + Prettier] | [ex: Uma ferramenta, mais rápido] |

## Estilo Arquitetural

| Aspecto | Decisão | Justificativa |
|---------|---------|---------------|
| Estrutura de código | [ex: Vertical Slice Architecture] | [ex: Alta coesão por feature, facilita manutenção isolada] |
| Padrão de camadas | [ex: Controller → Service → Repository] | [ex: Separação de responsabilidades clara] |
| Comunicação | [ex: Síncrona via HTTP REST] | [ex: Simplicidade, sem overhead de message broker] |
| Estado | [ex: Stateless — nenhum estado em memória] | [ex: Compatível com edge workers, horizontal scaling] |

## Estratégia de Qualidade

| Atributo de Qualidade | Abordagem Arquitetural |
|----------------------|------------------------|
| Testabilidade | [ex: Injeção de dependências, interfaces para repositórios] |
| Manutenibilidade | [ex: 70 regras enforced, máx. 50 linhas por classe] |
| Performance | [ex: Edge deployment, cache em KV store] |
| Segurança | [ex: Secrets via env vars, sem hardcode] |
| Observabilidade | [ex: Logs estruturados em JSON para stdout] |

## Padrões de Design Adotados

| Padrão | Onde é Aplicado | Por Quê |
|--------|-----------------|---------|
| [ex: Repository] | Acesso a dados | [ex: Abstrai D1, facilita mock em testes] |
| [ex: Factory] | Criação de entidades | [ex: Centraliza validação e construção] |
| [ex: Strategy] | [Contexto de variação] | [ex: Comportamento intercambiável sem if/switch] |
```

## Conventions

- Cada decisão deve ter ADR correspondente em §9 para rastrear o contexto e a motivação completa
- Alternativas consideradas são obrigatórias — sem "escolhemos X" sem justificativa comparativa
- Estratégia de qualidade deve mapear diretamente para RNFs de §1
- Decisões devem respeitar as restrições de §2

## Related to

- [01_introduction_and_goals.md](01_introduction_and_goals.md): depende — estratégia deve atender aos objetivos e RNFs de §1
- [02_architecture_constraints.md](02_architecture_constraints.md): reforça — estratégia é moldada pelas restrições de §2
- [09_architecture_decisions.md](09_architecture_decisions.md): complementa — ADRs detalham cada decisão aqui resumida
- [c4model Level 2](../../c4model/references/02_container.md): complementa — containers implementam a estratégia tecnológica

---

**Arc42 Section:** §4
**Source:** arc42.org — arc42 Template, adaptado para pt-BR
