---
title: "Obsolescência Contínua (Continuous Obsolescence)"
category: "Anti-Patterns"
type: reference
id: "STRUCTURAL-011"
severity: "🟡 Medium"
tags: [anti-patterns]
---

# Obsolescência Contínua (Continuous Obsolescence)

## Explanation

### O que é

A velocidade de mudança da tecnologia (linguagens, frameworks, plataformas) supera a capacidade da equipe de acompanhar, fazendo com que o sistema fique tecnicamente obsoleto antes mesmo de ser concluído ou logo depois de entrar em produção.

### Por que importa

- Times entram em um ciclo permanente de reescrita para "acompanhar" a tecnologia mais recente, sem nunca estabilizar
- Decisões de arquitetura tomadas hoje já nascem como débito técnico amanhã
- Consome orçamento e energia que deveriam ir para funcionalidade de negócio
- É frequentemente confundido com "modernização saudável", mascarando a falta de uma estratégia de evolução tecnológica

## How-to

### Como aplicar

- Definir critério explícito de fim de suporte (LTS) e plano de atualização incremental no momento da escolha da tecnologia
- Manter o ciclo de atualização de dependências contínuo, em vez de concentrado em grandes reescritas esporádicas

## Reference

### Critérios Objetivos

- [ ] A escolha de uma tecnologia/framework deve ser acompanhada de um critério explícito de fim de suporte (LTS) e um plano de atualização, não de reescrita.
- [ ] Reescritas motivadas apenas por "a tecnologia atual está desatualizada" (sem dor concreta de negócio ou de manutenção) devem ser questionadas.
- [ ] O ciclo de atualização de dependências deve ser contínuo e incremental, não concentrado em grandes reescritas esporádicas.

### Exceções Permitidas

- **Fim de Vida Real (End-of-Life)**: quando a tecnologia efetivamente para de receber patches de segurança, a migração deixa de ser opcional.

### Como Detectar

#### Manual

- Verificar o histórico do projeto: se há reescritas completas recorrentes motivadas por "nova tecnologia", em vez de por necessidade de negócio

#### Automático

- Ferramentas de auditoria de dependências (ex: `npm outdated`, Dependabot) para acompanhar deriva de versão de forma incremental, evitando o acúmulo que motiva reescritas

## Related to

- [Dev/Prod Parity](../skills/twelve-factor/SKILL.md): complements
- [010 — Golden Hammer](010_martelo-de-ouro.md): complements — os dois lidam com má gestão da escolha tecnológica, em direções opostas
- [013 — Overengineering](013_overengineering.md): complements
- [002 — Beco Sem Saída (Dead End)](002_beco-sem-saida.md): complements — ambos nascem de dependências e tecnologias mal geridas ao longo do tempo
- [Portability — Portabilidade](../skills/quality/references/portability.md): contrasts — reescritas motivadas por moda tecnológica raramente melhoram esta qualidade McCall
- [Descartabilidade de Processos (Disposability)](../skills/twelve-factor/SKILL.md): complements — ciclos incrementais de atualização dependem de processos facilmente substituíveis
