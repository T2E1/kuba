# Fator 01 — Codebase

**Regra deMGoncalves:** [040 - Base de Código Única](../../../rules/040_base-codigo-unica.md)
**Questão:** Uma aplicação = um repositório rastreado em controle de versão?

## O que é

Uma aplicação deve ter exatamente uma base de código rastreada em controle de versão, com múltiplos deploys originados dessa mesma base. A relação entre codebase e aplicação é sempre **1:1**.

**Múltiplas bases de código = sistema distribuído, não uma aplicação.**
**Código compartilhado = extrair para biblioteca com versionamento independente.**

## Critérios de Conformidade

- [ ] A aplicação possui **um único repositório** no Git com branches para ambientes (dev, staging, prod)
- [ ] Código compartilhado entre aplicações foi extraído em **bibliotecas independentes** com versionamento próprio
- [ ] Zero ocorrências de *copy-paste deployment* entre repositórios

## ❌ Violação

```bash
# Estrutura com múltiplas bases de código para a mesma app
repo-app-frontend/
repo-app-backend/
repo-app-workers/

# Código duplicado em múltiplos repositórios
repo-app-a/src/utils/validation.js  # duplicado
repo-app-b/src/utils/validation.js  # violação
```

## ✅ Conforme

```bash
# Repositório único com múltiplos ambientes
repo-app/
├── .git/
├── src/
│   ├── frontend/
│   ├── backend/
│   └── workers/
└── branches: main, staging, dev

# Código compartilhado extraído como biblioteca
@company/validation-lib  # pacote npm independente
  ├── version: 1.2.3
  └── usado por: app-a, app-b, app-c
```

## Codetag quando violado

```typescript
// FIXME: Código duplicado em múltiplos repositórios — extrair para @company/shared-utils
function validateEmail(email: string): boolean { /* ... */ }
```
