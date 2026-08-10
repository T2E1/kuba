---
name: arc42
model: opus
description: Documentação arquitetural no template arc42 — 12 seções em docs/arc42/ cobrindo objetivos, restrições, contexto, estratégia de solução, blocos de construção, runtime, deployment, conceitos transversais, índice de decisões, requisitos de qualidade, riscos e glossário. Use ao documentar a arquitetura de um sistema ou feature já implementada, ao atualizar a documentação após uma mudança arquitetural, ou ao criar a documentação inicial de um projeto novo. Não use para registrar uma decisão isolada — use a skill adr.
---

# arc42

## O que é

Template consagrado para documentação de arquitetura de software: 12 seções com escopo
fixo, cada uma respondendo a uma pergunta que alguém realmente faz sobre o sistema.

A vantagem sobre documentação livre: a estrutura fixa torna a ausência visível. Se a §11
está vazia, ninguém mapeou riscos técnicos — e isso fica evidente sem auditoria.

## Quando usar

| Situação | Ação |
|---|---|
| Sistema ou feature implementada | Sincronizar as seções afetadas |
| Projeto novo | Criar §1, §2, §3 e §4 antes; o resto conforme implementa |
| Mudança arquitetural | Atualizar as seções tocadas e a §9 |
| Decisão isolada | Não é aqui — é um ADR, indexado pela §9 |

Não documente antes da implementação: arc42 descreve o que **é**, não o que se planeja.
O que se planeja vive em specs. A §9 é apenas índice de ADRs — nunca duplique o conteúdo
deles aqui.

Idioma obrigatório: português brasileiro.

## Como aplicar

| Seção | Arquivo | Responde | Template |
|---|---|---|---|
| §1 Introdução e Objetivos | `01_introduction_and_goals.md` | O que o sistema faz e para quem | [01](references/01_introduction_and_goals.md) |
| §2 Restrições Arquiteturais | `02_architecture_constraints.md` | O que não pode ser mudado | [02](references/02_architecture_constraints.md) |
| §3 Contexto e Escopo | `03_context_and_scope.md` | Onde termina o sistema e começa o mundo | [03](references/03_context_and_scope.md) |
| §4 Estratégia de Solução | `04_solution_strategy.md` | As decisões fundamentais, em resumo | [04](references/04_solution_strategy.md) |
| §5 Blocos de Construção | `05_building_block_view.md` | Como o sistema se decompõe | [05](references/05_building_block_view.md) |
| §6 Visão em Runtime | `06_runtime_view.md` | Como as partes interagem em execução | [06](references/06_runtime_view.md) |
| §7 Visão de Deployment | `07_deployment_view.md` | Onde cada parte roda | [07](references/07_deployment_view.md) |
| §8 Conceitos Transversais | `08_concepts.md` | Padrões que atravessam tudo | [08](references/08_concepts.md) |
| §9 Decisões Arquiteturais | `09_architecture_decisions.md` | Índice dos ADRs | [09](references/09_architecture_decisions.md) |
| §10 Requisitos de Qualidade | `10_quality_requirements.md` | O que é "bom o bastante", com número | [10](references/10_quality_requirements.md) |
| §11 Riscos Técnicos | `11_technical_risks.md` | O que pode dar errado e a mitigação | [11](references/11_technical_risks.md) |
| §12 Glossário | `12_glossary.md` | Os termos do domínio | [12](references/12_glossary.md) |

### Como as seções se conectam

- **§5** é a mesma decomposição do nível Component do C4 — use a skill `c4-model` para os
  diagramas e referencie aqui, sem redesenhar.
- **§9** indexa os ADRs escritos com a skill `adr`. Só título, status e link.
- **§10** define os alvos que a skill `quality` mede. Sem número, a seção não serve.
- **§8** é onde moram logging, tratamento de erro e segurança — os conceitos que as rules
  027, 028, 030 e 050 governam.

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Seção §10 com cenários mensuráveis vs. adjetivos | [quality-requirements.valid.md](examples/quality-requirements.valid.md) | [quality-requirements.invalid.md](examples/quality-requirements.invalid.md) |

## Checklist

- [ ] As 12 seções existem, mesmo que algumas declarem explicitamente "não se aplica"
- [ ] Nenhuma seção documenta o que ainda não foi implementado
- [ ] §9 é índice — nenhum ADR copiado por inteiro
- [ ] §10 tem números, não adjetivos
- [ ] §5 referencia os diagramas C4 em vez de redesenhá-los
- [ ] §12 define todo termo de domínio usado nas outras seções
- [ ] Tudo em pt-BR

## Troubleshooting

### A documentação desatualizou em duas semanas

**Causa:** seções descrevendo detalhe de implementação que muda a cada commit.
**Solução:** arc42 documenta estrutura e decisão, não implementação. O que muda toda
semana pertence ao código e ao JSDoc.

### §5 virou uma cópia dos diagramas C4

**Causa:** duplicação entre as duas ferramentas (rule 021).
**Solução:** o C4 tem os diagramas; a §5 tem as responsabilidades e interfaces de cada
bloco, com link para o diagrama.

### Ninguém sabe se a documentação ainda vale

**Causa:** ausência de data e de vínculo com a versão.
**Solução:** cada seção registra quando foi sincronizada pela última vez.

## Referências

- `references/01…12` — template de cada seção, com o que entra e o que não entra.

Fonte: https://arc42.org

## Rules relacionadas

- [026 — Qualidade de Comentários: o Porquê](../../rules/026_qualidade-comentarios-porque.md): a documentação carrega o porquê que não cabe no código.
- [021 — Proibição de Duplicação](../../rules/021_proibicao-duplicacao-logica.md): a §9 indexa ADRs e a §5 referencia o C4 — nada é copiado.
- [040 — Base de Código Única](../../rules/040_base-codigo-unica.md): a documentação vive no mesmo repositório que descreve.
- [012 — Glossário de domínio](../../rules/006_proibicao-nomes-abreviados.md): a §12 é o que torna os nomes do código verificáveis.

## Skills relacionadas

- [prose](../prose/SKILL.md): reinforces — documento de arquitetura é o terreno favorito da frase que infla significado.
- [c4-model](../c4-model/SKILL.md): complements — fornece os diagramas da §5.
- [adr](../adr/SKILL.md): depends on — a §9 é o índice dos ADRs.
- [quality](../quality/SKILL.md): depends on — a §10 define os alvos que o modelo McCall mede.
- [bdd](../bdd/SKILL.md): complements — os cenários Gherkin detalham o comportamento que a §6 descreve em fluxo.

---

**Criado em**: 2026-04-01
**Atualizado em**: 2026-08-09
**Versão**: 2.0
