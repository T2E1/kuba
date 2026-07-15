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

# Logs como Fluxo de Eventos (Logs)

**ID**: INFRASTRUCTURE-050
**Severity**: 🔴 Critical
**Category**: Infrastructure

---

## What it is

A aplicação deve tratar logs como um **fluxo contínuo de eventos** ordenados por tempo, escritos em `stdout`. A aplicação nunca deve se preocupar com roteamento, armazenamento, ou rotação de logs — isso é responsabilidade do ambiente de execução.

## Why it matters

- Logs em arquivos locais são perdidos quando containers são destruídos
- São difíceis de agregar em sistemas distribuídos com múltiplas instâncias
- Criam dependência desnecessária de filesystem
- `stdout` permite que o ambiente de execução capture, agregue e roteie logs para qualquer destino

## Objective Criteria

- [ ] Todos os logs devem ser escritos em **stdout** (ou stderr para erros), nunca em arquivos locais.
- [ ] É proibido o uso de bibliotecas de logging que escrevem diretamente em arquivos ou fazem rotação de logs.
- [ ] Logs devem ser estruturados (JSON) para facilitar parsing e análise automatizada.

## Allowed Exceptions

- **Ambiente de Desenvolvimento Local**: Formatação colorida e legível para console em dev, desde que stdout seja mantido.
- **Logs de Debug Temporários**: `console.log` para debugging local, removidos antes do commit.

## How to Detect

### Manual

- Verificar configuração de bibliotecas de logging para identificar escritas em arquivo ou configuração de rotação

### Automatic

- Sem regra nativa de Biome para destino de log — buscar `FileAppender`/`RotatingFileHandler` ou caminhos de arquivo em revisão de código

## Related to

- [027 - Domain Error Handling Quality](027_qualidade-tratamento-erros-dominio.md): complements
- [045 - Stateless Processes](045_processos-stateless.md): reinforces
- [048 - Process Disposability](048_descartabilidade-processos.md): complements
- [026 - Comment Quality: Why, Not What](026_qualidade-comentarios-porque.md): complements

---

**Created on**: 2025-01-10
**Updated on**: 2026-07-15
**Version**: 1.1
