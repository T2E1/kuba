# §12 — Glossary

**Section:** 12 de 12
**Audience:** Todos (stakeholders, gestão, técnico, dev, novos membros)
**When to update:** Ao introduzir novo termo de domínio ou técnico no sistema; ao refinar definição existente.

---

## Purpose

Esta seção centraliza as definições precisas de todos os termos relevantes do domínio de negócio e termos técnicos específicos do projeto. Um glossário vivo elimina ambiguidades na comunicação entre time técnico e negócio, e acelera o onboarding de novos membros.

## Template

```markdown
# §12 — Glossary

## Termos de Domínio de Negócio

| Termo | Definição | Sinônimos | Usado em |
|-------|-----------|-----------|----------|
| **[Termo A]** | [Definição precisa do conceito de negócio, em 1-3 frases. Incluir o que é, o que não é, e qual o contexto de uso.] | [Termos alternativos usados no negócio] | [§3, §5, BDD features] |
| **[Termo B]** | [Definição.] | [Sinônimos.] | [Seções onde aparece] |
| **[Entidade Principal]** | [O que representa no domínio, seus atributos principais, seu ciclo de vida.] | — | [§3, §5, §6] |
| **[Regra de Negócio X]** | [Descrição da regra: condição, consequência, exceções.] | — | [§1 RF, BDD] |

## Termos Técnicos do Projeto

| Termo | Definição | Contexto de Uso |
|-------|-----------|-----------------|
| **Vertical Slice** | Fatia vertical que contém todos os artefatos de uma feature: controller, service, repository, model e testes. Estrutura: `src/[context]/[container]/[component]/` | Estrutura do projeto |
| **Context** | Primeiro nível da Vertical Slice Architecture. Representa o domínio de negócio. Ex: `user_auth`, `billing`. | Estrutura do projeto |
| **Container** | Segundo nível. Subdomínio ou serviço dentro do context. Ex: `login`, `checkout`. | Estrutura do projeto |
| **Component** | Terceiro nível. Feature específica dentro do container. Ex: `authentication`. | Estrutura do projeto |
| **Value Object** | Objeto de domínio imutável identificado por seu valor (não por ID). Ex: `Email`, `CPF`, `Money`. | Código TypeScript |
| **Repository** | Abstração de acesso a dados. Interface define o contrato; implementação acessa D1/KV/API. | Código TypeScript |
| **ADR** | Architecture Decision Record. Documento que captura uma decisão arquitetural, seu contexto e consequências. | docs/adr/ |
| **Guard Clause** | Retorno antecipado que verifica pré-condições no início de uma função, evitando aninhamento. | Padrão de código |

## Abreviações e Acrônimos

| Acrônimo | Significado | Contexto |
|----------|-------------|---------|
| RF | Requisito Funcional | §1, specs.md |
| RNF | Requisito Não-Funcional | §1, §10 |
| ADR | Architecture Decision Record | §9, docs/adr/ |
| SRP | Single Responsibility Principle | rules/010 |
| DIP | Dependency Inversion Principle | rules/014 |
| BDD | Behavior-Driven Development | docs/bdd/ |
| CI/CD | Continuous Integration / Continuous Delivery | §7 |
| DTO | Data Transfer Object | Padrão de código |
| API | Application Programming Interface | §3, §7 |
| SLA | Service Level Agreement | §10 |
| MTTR | Mean Time To Recovery | §10 |
| p95 | Percentil 95 (latência) | §10 |

## Termos de Domínio vs Termos de Implementação

Esta seção ajuda a distinguir termos de negócio (usados por stakeholders) de termos técnicos (usados pelo time de dev):

| Termo de Negócio | Equivalente Técnico | Diferença |
|-----------------|---------------------|-----------|
| "[Conceito de negócio]" | `[NomeDaClasse]` | [O que cada um representa e em que contexto é usado] |
| "[Processo de negócio]" | `[NomeDoServico].execute()` | [O que cada um representa] |
```

## Conventions

- Todo termo introduzido em §1 ou §3 deve ter definição aqui
- Definições devem usar linguagem do domínio, não de implementação (exceto na coluna "Equivalente Técnico")
- Sinônimos devem ser listados para evitar que diferentes pessoas usem termos diferentes para a mesma coisa
- Termos técnicos do projeto (padrões, acrônimos internos) ficam na segunda tabela, não na de domínio
- Glossário é ponto de partida para Ubiquitous Language do DDD

## Related to

- [01_introduction_and_goals.md](01_introduction_and_goals.md): complementa — termos usados nos RF e stakeholders devem estar aqui
- [03_context_and_scope.md](03_context_and_scope.md): complementa — atores e sistemas externos introduzem termos que pertencem ao glossário
- [rule 006 Nomes Abreviados](../../../rules/006_proibicao-nomes-abreviados.md): complementa — nomes no código devem refletir termos do glossário
- [rule 035 Nomes Enganosos](../../../rules/035_proibicao-nomes-enganosos.md): complementa — nomes de variáveis devem ser consistentes com definições do glossário

---

**Arc42 Section:** §12
**Source:** arc42.org — arc42 Template, adaptado para pt-BR
