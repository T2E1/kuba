---
title: "Beco Sem Saída (Dead End)"
category: "Anti-Patterns"
type: reference
id: "STRUCTURAL-002"
severity: "🟠 High"
tags: [anti-patterns]
---

# Beco Sem Saída (Dead End)

## Explanation

### O que é

Um componente de terceiros (biblioteca, framework) é modificado diretamente (*forkado*) para suprir uma necessidade específica, ou é usado de forma tão customizada que o projeto perde a capacidade de receber atualizações futuras dessa dependência.

### Por que importa

- Toda nova versão da biblioteca original precisa ser manualmente reconciliada com o fork, um custo que cresce a cada release
- Correções de segurança e bugs da biblioteca upstream não chegam automaticamente ao projeto
- Conhecimento sobre as modificações feitas no fork se perde com o tempo, especialmente se não documentado
- Eventualmente o time trava na versão forkada, incapaz de evoluir — literalmente um beco sem saída

## How-to

### Como aplicar

- Customizar comportamento por composição, wrapper ou pontos de extensão oficiais da biblioteca — ver [Boundaries](../skills/clean-code/references/encapsulamento-apis-terceiros.md) — nunca por edição direta do código-fonte de terceiros
- Se um fork for genuinamente necessário, mantê-lo como pacote próprio, versionado, com plano explícito de convergência com o upstream

## Reference

### Critérios Objetivos

- [ ] É proibido copiar o código-fonte de uma dependência de terceiros para o repositório do projeto para "fazer um ajuste rápido".
- [ ] Customizações de comportamento de uma dependência devem passar por *composition*, *wrapper* ou pontos de extensão oficiais da própria biblioteca.
- [ ] Se um fork for genuinamente necessário, ele deve ser mantido como pacote próprio, versionado e com plano explícito de convergência com o upstream.

### Exceções Permitidas

- **Fork Estratégico Deliberado**: quando a equipe decide conscientemente assumir a manutenção de uma dependência abandonada, com recursos alocados para isso.

### Como Detectar

#### Manual

- Buscar código de terceiros copiado diretamente na base do projeto (fora de `node_modules`/gerenciador de pacotes) e verificar se há modificações locais

#### Automático

- Sem regra nativa de Biome para dependência forkada — auditoria de dependências:
  `pnpm outdated` e `pnpm licenses list` não enxergam a cópia local, então a checagem é
  confrontar cada import de terceiro com o que o `package.json` declara; o que não vem do
  registro é fork

## Related to

- [007 — Boat Anchor](007_dependencia-barco-ancora.md): complements
- [Single Codebase](../skills/twelve-factor/SKILL.md): reinforces
- [Explicit Dependency Declaration](../skills/twelve-factor/SKILL.md): reinforces
- [Boundaries](../skills/clean-code/references/encapsulamento-apis-terceiros.md): reinforces — o padrão que evita chegar ao beco sem saída
- [011 — Continuous Obsolescence](011_obsolescencia-continua.md): complements — ambos nascem de dependências mal geridas ao longo do tempo
- [Dev/Prod Parity](../skills/twelve-factor/SKILL.md): complements — forks locais de dependências quebram a paridade entre ambientes
