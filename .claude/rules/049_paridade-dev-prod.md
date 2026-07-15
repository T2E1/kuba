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

# Paridade entre Desenvolvimento e Produção (Dev/Prod Parity)

**ID**: INFRASTRUCTURE-049
**Severity**: 🔴 Critical
**Category**: Infrastructure

---

## What it is

Os ambientes de desenvolvimento, staging e produção devem ser o mais **similares possível**. Isso inclui minimizar gaps de tempo (deploy frequente), gaps de pessoal (quem desenvolve também faz deploy), e gaps de ferramentas (mesmas tecnologias em todos os ambientes).

## Why it matters

- Divergências entre ambientes causam bugs que só aparecem em produção
- Torna debugging difícil e deploys arriscados
- Reduz a confiança de que o que funciona localmente funcionará em produção
- Aumenta o tempo até detectar um problema real de integração

## Objective Criteria

- [ ] Os mesmos **serviços de apoio** (banco de dados, cache, fila) devem ser usados em dev e prod — é proibido usar SQLite em dev e PostgreSQL em prod.
- [ ] O tempo entre escrever código e fazer deploy em produção deve ser inferior a **1 dia** (idealmente horas).
- [ ] Containers ou configurações de ambiente devem ser **idênticos** entre dev e prod (ex: mesmo Dockerfile).

## Allowed Exceptions

- **Escala de Recursos**: Diferenças de escala (menos réplicas, menor CPU/memória) são aceitáveis desde que a arquitetura seja idêntica.
- **Dados de Teste**: Uso de dados sintéticos ou anonimizados em dev é obrigatório por razões de segurança.

## How to Detect

### Manual

- Comparar stack tecnológica e versões de serviços entre ambientes; verificar se bugs reportados em prod são reproduzíveis em dev

### Automatic

- Infrastructure as Code: comparar manifests (Terraform, Docker Compose) entre ambientes para detectar divergências (fora do escopo de um linter)

## Related to

- [042 - Environment-Based Configuration](042_configuracoes-via-ambiente.md): reinforces
- [043 - Backing Services as Resources](043_servicos-apoio-recursos.md): reinforces
- [044 - Build-Release-Run Separation](044_separacao-build-release-run.md): reinforces
- [032 - Minimum Test Coverage Quality](032_cobertura-teste-minima-qualidade.md): complements

---

**Created on**: 2025-01-10
**Updated on**: 2026-07-15
**Version**: 1.1
