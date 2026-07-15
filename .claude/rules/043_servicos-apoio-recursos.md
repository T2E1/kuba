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

# Serviços de Apoio como Recursos Anexáveis (Backing Services)

**ID**: INFRASTRUCTURE-043
**Severity**: 🔴 Critical
**Category**: Infrastructure

---

## What it is

Serviços de apoio (bancos de dados, filas, caches, serviços de email, APIs externas) devem ser tratados como **recursos anexáveis**, acessados via URL ou localizador de recurso armazenado em configuração. A aplicação não deve distinguir entre serviços locais e de terceiros.

## Why it matters

- Permite trocar um banco de dados local por um gerenciado (ex: RDS) sem alteração de código
- Aumenta a resiliência e flexibilidade de deploy da aplicação
- Evita lógica condicional acoplada a onde o serviço está hospedado
- Facilita testes ao substituir o serviço real por um equivalente local via configuração

## Objective Criteria

- [ ] Todos os serviços externos devem ser acessados via **URL ou string de conexão** configurável por variável de ambiente.
- [ ] O código não deve conter lógica condicional que diferencie serviços locais de remotos (ex: `if (isLocal) useLocalDB()`).
- [ ] A troca de um serviço de apoio deve exigir **apenas** alteração de configuração, não de código.

## Allowed Exceptions

- **Mocks de Teste**: Substituição de serviços por mocks em ambiente de teste unitário, controlada via injeção de dependência.

## How to Detect

### Manual

- Verificar se a troca de um serviço (ex: MySQL para PostgreSQL, ou Redis local para ElastiCache) exige alteração de código

### Automatic

- Sem regra nativa de Biome para esta análise arquitetural — buscar URLs/hosts hardcoded ou condicionais baseados em ambiente via revisão de código

## Related to

- [014 - Dependency Inversion Principle (DIP)](014_principio-inversao-dependencia.md): reinforces
- [042 - Environment-Based Configuration](042_configuracoes-via-ambiente.md): complements
- [049 - Dev/Prod Parity](049_paridade-dev-prod.md): reinforces
- [011 - Open/Closed Principle (OCP)](011_principio-aberto-fechado.md): reinforces

---

**Created on**: 2025-01-10
**Updated on**: 2026-07-15
**Version**: 1.1
