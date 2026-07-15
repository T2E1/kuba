# Proibição de Dependência Barco-Âncora

**ID**: AP-01-067
**Severity**: 🟡 Medium
**Category**: Structural

---

## What it is

Boat Anchor ocorre quando uma dependência, biblioteca ou componente é importado para a base de código, instalado no `package.json`, mas nunca é usado ou usado apenas superficialmente. Como uma âncora de barco que interfere no movimento, essas dependências não usadas adicionam complexidade e custo de manutenção sem trazer valor. Variante de Lava Flow para dependências.

## Why it matters

- Inchaço de dependências: mais arquivos, mais downloads, mais tempo de build/CI/CD
- Vulnerabilidades de segurança: dependências não usadas não são monitoradas mas podem ter CVEs
- Dificuldade de onboarding: desenvolvedores se perguntam "para que serve X?" e perdem tempo pesquisando
- Confusão tecnológica: parece ser usado mas não é; falsa impressão de capacidades
- Licenças complexas: dependências não usadas podem introduzir problemas de licenciamento sem razão

## Objective Criteria

- [ ] Dependência listada em `package.json`, mas nunca importada
- [ ] Biblioteca importada mas nunca chamada (`import X` sem uso de `X.method()`)
- [ ] Dependência morta (não mantida) mantida "just in case" sem timeline de uso futuro
- [ ] Framework/biblioteca instalado mas apenas 1-2 features usadas quando alternativa simples existe

## Allowed Exceptions

- DevDependencies usadas apenas em build-tooling (linters, formatters não referenciados em código prod)
- Dependências opcionais onde uso é desconhecido em runtime até execução (plugins)
- Dependência futura com roadmap bem definido (ex: feature requerendo X no próximo trimestre) se documentado em comments/tickets

## How to Detect

### Manual

- Comparar `package.json` com `grep -rE "^import|^from"` — diferenças são boat anchors
- Buscar bibliotecas onde docs mencionam "usamos X" mas grep na base de código mostra zero uso
- Verificar testes: se a biblioteca só aparece em código de produção não importado, é boat anchor

### Automatic

- `depcheck`: detecta dependências declaradas mas não usadas no código JS/TS
- Biome: `correctness/noUnusedImports` (complementa, sinalizando imports não usados dentro de arquivos)

## Related to

- [056 - Prohibition of Zombie Code (Lava Flow)](056_proibicao-codigo-zombie-lava-flow.md): complements
- [041 - Explicit Dependency Declaration](041_declaracao-explicita-dependencias.md): reinforces
- [039 - Boy Scout Rule (Continuous Refactoring)](039_regra-escoteiro-refatoracao-continua.md): reinforces
- [022 - Simplicity and Clarity (KISS)](022_priorizacao-simplicidade-clareza.md): reinforces

---

**Created on**: 2026-03-28
**Updated on**: 2026-07-15
**Version**: 1.1
