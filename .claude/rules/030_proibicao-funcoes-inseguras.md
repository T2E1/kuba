# Proibição de Funções Inseguras (eval, new Function, Secrets)

**ID**: BEHAVIORAL-030
**Severity**: 🔴 Critical
**Category**: Behavioral

---

## What it is

Proíbe o uso de funções que executam código arbitrário a partir de strings (ex: `eval()`) ou que criam vulnerabilidades de segurança graves, como o *hardcoding* de segredos.

## Why it matters

- `eval()` e `new Function()` são vetores de ataque para Execução Remota de Código (RCE)
- Abrem espaço para injeção de código a partir de entrada não confiável
- *Hardcoding* de segredos viola a política de segurança e torna o deployment inseguro
- Concatenar entrada de usuário em comandos de shell/filesystem expõe o sistema a injeção

## Objective Criteria

- [ ] O uso das funções `eval()` e `new Function()` (sem a finalidade de compilação isolada) é proibido.
- [ ] Chaves de API ou segredos devem ser injetados exclusivamente via `process.env` ou ferramenta de gerenciamento de segredos.
- [ ] É proibida a concatenação de *strings* de entrada de usuário em consultas diretas ao sistema de arquivos ou a comandos de *shell*.

## Allowed Exceptions

- **Tooling/Build Steps**: Uso controlado de *eval* ou *new Function* em *build scripts* para otimizar *bundling*.

## How to Detect

### Manual

- Buscar `eval`, `new Function`, ou chaves de API *hardcoded*

### Automatic

- Biome: `security/noGlobalEval` (bloqueia `eval()`/execução de código a partir de string)
- Gitleaks/git-secrets: varredura de segredos *hardcoded* no repositório (fora do escopo de um linter)

## Related to

- [024 - Prohibition of Magic Constants](024_proibicao-constantes-magicas.md): complements
- [042 - Environment-Based Configuration](042_configuracoes-via-ambiente.md): reinforces

---

**Created on**: 2025-10-08
**Updated on**: 2026-07-15
**Version**: 1.1
