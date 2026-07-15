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

# Escalabilidade via Modelo de Processos (Concurrency)

**ID**: INFRASTRUCTURE-047
**Severity**: 🟠 High
**Category**: Infrastructure

---

## What it is

A aplicação deve escalar horizontalmente através da execução de **múltiplos processos** independentes, não através de threads internas ou um único processo monolítico. Diferentes tipos de trabalho (web, worker, scheduler) devem ser separados em tipos de processos distintos.

## Why it matters

- Permite escalabilidade elástica: mais processos web para tráfego, mais workers para filas
- Cada tipo de processo pode ser escalado independentemente conforme a demanda
- Isola falhas de um tipo de carga de trabalho das demais
- Simplifica o raciocínio sobre concorrência ao evitar estado compartilhado entre threads

## Objective Criteria

- [ ] A aplicação deve suportar execução de **múltiplas instâncias** do mesmo processo sem conflito.
- [ ] Diferentes cargas de trabalho (HTTP, background jobs, scheduled tasks) devem ser separadas em processos distintos.
- [ ] O processo não deve fazer *daemonize* ou escrever PID files — o gerenciamento de processos é responsabilidade do ambiente de execução.

## Allowed Exceptions

- **Workers Internos**: Uso de worker threads para operações CPU-bound dentro de uma requisição, desde que o estado não seja compartilhado entre requisições.

## How to Detect

### Manual

- Verificar se a aplicação pode rodar N instâncias simultâneas com um load balancer na frente, sem conflitos

### Automatic

- Testes de carga: escalar horizontalmente e verificar se o throughput aumenta linearmente (fora do escopo de um linter)

## Related to

- [045 - Stateless Processes](045_processos-stateless.md): complements
- [046 - Port Binding](046_port-binding.md): complements
- [048 - Process Disposability](048_descartabilidade-processos.md): reinforces
- [010 - Single Responsibility Principle (SRP)](010_principio-responsabilidade-unica.md): reinforces

---

**Created on**: 2025-01-10
**Updated on**: 2026-07-15
**Version**: 1.1
