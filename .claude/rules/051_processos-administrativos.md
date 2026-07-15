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

# Processos Administrativos como One-Off (Admin Processes)

**ID**: INFRASTRUCTURE-051
**Severity**: 🟠 High
**Category**: Infrastructure

---

## What it is

Tarefas administrativas ou de manutenção (migrações de banco, scripts de correção, console REPL) devem ser executadas como **processos one-off** no mesmo ambiente e com o mesmo código da aplicação principal, não como scripts separados ou processos persistentes.

## Why it matters

- Processos administrativos fora do ambiente da aplicação podem usar código ou dependências diferentes
- Gera inconsistências entre o que foi testado e o que é executado
- Executar no mesmo contexto garante que scripts usem exatamente o mesmo código em produção
- Reduz a chance de um script administrativo se tornar código órfão e não versionado

## Objective Criteria

- [ ] Scripts de migração de banco devem ser executados como processos one-off usando o mesmo runtime e dependências da aplicação.
- [ ] Tarefas administrativas devem estar **versionadas no repositório** junto com o código da aplicação.
- [ ] É proibido executar scripts administrativos via SSH direto no servidor — devem usar o mesmo mecanismo de deploy.

## Allowed Exceptions

- **Ferramentas de Infraestrutura**: Scripts de provisionamento de infraestrutura (Terraform, Ansible) que operam em nível diferente da aplicação.
- **Debugging de Emergência**: Acesso direto ao ambiente em situações críticas de produção, com auditoria.

## How to Detect

### Manual

- Verificar se scripts de migração ou manutenção são executados via processo separado ou via SSH manual

### Automatic

- CI/CD: pipeline que executa migrations como *step* do deploy, usando o mesmo container/ambiente da aplicação (fora do escopo de um linter)

## Related to

- [040 - Single Codebase](040_base-codigo-unica.md): reinforces
- [041 - Explicit Dependency Declaration](041_declaracao-explicita-dependencias.md): reinforces
- [044 - Build-Release-Run Separation](044_separacao-build-release-run.md): complements
- [049 - Dev/Prod Parity](049_paridade-dev-prod.md): reinforces

---

**Created on**: 2025-01-10
**Updated on**: 2026-07-15
**Version**: 1.1
