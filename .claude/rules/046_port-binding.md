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

# Exposição de Serviços via Port Binding

**ID**: INFRASTRUCTURE-046
**Severity**: 🟠 High
**Category**: Infrastructure

---

## What it is

A aplicação deve ser **completamente autocontida** e expor seus serviços através de *port binding*. Ela não deve depender de um servidor web externo (Apache, Nginx) injetado em runtime para ser executável — o servidor HTTP deve ser embutido na aplicação.

## Why it matters

- Garante que a aplicação seja portável e rode em qualquer ambiente sem configuração de servidor externo
- Torna a aplicação um serviço consumível por outras aplicações via URL
- Elimina dependência de configuração externa (VirtualHost, .htaccess) para funcionar
- Simplifica testes locais, pois a aplicação sobe sozinha

## Objective Criteria

- [ ] A aplicação deve iniciar seu próprio servidor HTTP/HTTPS e fazer *bind* em uma porta especificada por variável de ambiente.
- [ ] É proibido depender de configuração de servidor web externo (VirtualHost, .htaccess) para funcionar corretamente.
- [ ] A porta de execução deve ser configurável via `PORT` ou variável equivalente, não hardcoded.

## Allowed Exceptions

- **Reverse Proxy**: Uso de Nginx/HAProxy na frente da aplicação para TLS termination, load balancing, ou roteamento — desde que a aplicação funcione sem ele.
- **Aplicações Frontend SPA**: Aplicações estáticas que são servidas por CDN ou servidor de arquivos estáticos.

## How to Detect

### Manual

- Verificar se a aplicação pode ser iniciada e acessada apenas com `bun run start`, sem configuração adicional de servidor

### Automatic

- CI/CD: testes que iniciam a aplicação em container limpo e verificam se responde na porta configurada (fora do escopo de um linter)

## Related to

- [042 - Environment-Based Configuration](042_configuracoes-via-ambiente.md): reinforces
- [043 - Backing Services as Resources](043_servicos-apoio-recursos.md): complements
- [047 - Concurrency via Processes](047_concorrencia-via-processos.md): complements
- [048 - Process Disposability](048_descartabilidade-processos.md): complements

---

**Created on**: 2025-01-10
**Updated on**: 2026-07-15
**Version**: 1.1
