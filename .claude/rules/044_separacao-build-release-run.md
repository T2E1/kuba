---
paths:
  - "**/*.yml"
  - "**/*.yaml"
  - "**/*.json"
  - "**/Dockerfile*"
  - "**/docker-compose*"
  - "**/.env*"
  - "**/package.json"
  - "**/tsconfig.json"
---

# Separação Estrita de Build, Release e Run

**ID**: INFRASTRUCTURE-044
**Severity**: 🔴 Critical
**Category**: Infrastructure

---

## What it is

O processo de deploy deve ser separado em três estágios distintos e imutáveis: **Build** (compila o código), **Release** (combina build com configuração), e **Run** (executa a aplicação). Cada release deve ter um identificador único e ser imutável.

## Why it matters

- Permite rollbacks rápidos para uma release anterior conhecida
- Facilita auditoria de qual código está rodando em cada ambiente
- Garante que o código em execução seja exatamente o mesmo que foi testado
- Misturar estágios cria ambiguidade sobre o que está rodando e impede reprodutibilidade

## Objective Criteria

- [ ] O estágio de **Build** deve produzir um artefato executável (bundle, container image) sem dependências de configuração de ambiente.
- [ ] O estágio de **Release** deve ser imutável — uma vez criada, a release não pode ser alterada; correções exigem nova release.
- [ ] Toda release deve ter um **identificador único** (timestamp, hash, número sequencial) para rastreabilidade.

## Allowed Exceptions

- **Ambiente de Desenvolvimento Local**: Build e run podem ser combinados para agilizar o ciclo de desenvolvimento (ex: `bun run dev`).

## How to Detect

### Manual

- Verificar se é possível alterar código ou configuração de uma release já em produção sem criar uma nova release

### Automatic

- CI/CD: pipeline que rejeita deploys manuais e exige passagem pelos três estágios com versionamento (fora do escopo de um linter)

## Related to

- [040 - Single Codebase](040_base-codigo-unica.md): complements
- [041 - Explicit Dependency Declaration](041_declaracao-explicita-dependencias.md): reinforces
- [042 - Environment-Based Configuration](042_configuracoes-via-ambiente.md): complements
- [049 - Dev/Prod Parity](049_paridade-dev-prod.md): reinforces

---

**Created on**: 2025-01-10
**Updated on**: 2026-07-15
**Version**: 1.1
