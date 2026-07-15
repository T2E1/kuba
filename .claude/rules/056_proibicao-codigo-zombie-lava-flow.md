# Proibição de Código Zombie (Lava Flow)

**ID**: AP-02-056
**Severity**: 🟠 High
**Category**: Structural

---

## What it is

Lava Flow (Dead Code / Zombie Code) ocorre quando código não é mais utilizado mas permanece no sistema porque ninguém tem certeza se pode ser removido com segurança. Como lava que solidifica e endurece, este código se torna um obstáculo permanente à manutenção. Código abandonado, comentado ou nunca chamado.

## Why it matters

- Carga cognitiva extra: desenvolvedores precisam entender código inútil para encontrar código útil
- Confusão perpetuada: novos desenvolvedores não sabem o que está ativo ou obsoleto
- Débito técnico crescente: o sistema se torna maior e mais lento para navegar
- Bugs preservados: código morto pode ser reativado acidentalmente e introduzir bugs antigos
- Complexidade falsa: sistema parece fazer mais do que realmente faz

## Objective Criteria

- [ ] Funções, classes ou módulos nunca chamados/executados
- [ ] Código comentado com marcadores como `// versão antiga`, `// deprecated`, `// TODO remover`
- [ ] Imports de módulos/pacotes que nunca são referenciados
- [ ] Branches de `if` ou `switch` que nunca são executados (cobertura de teste = 0%)
- [ ] Variáveis declaradas e nunca lidas
- [ ] Arquivos inteiros que ninguém sabe para que servem

## Allowed Exceptions

- Código temporariamente desabilitado/comentado com @TODO bem documentado e prazo
- Feature flags ou testes A/B com uso conhecido
- Código mantido para rollback imediato (< 1 dia) quando há funcionalidade crítica
- Documentação histórica mantida em comentários quando possui valor educacional

## How to Detect

### Manual

- Procurar comentários com prefixos `//`, `#` e TODO, FIXME, DEPRECATED
- Identificar funções/classes sem testes unitários, sem imports, sem referências
- Verificar módulos importados mas nunca usados

### Automatic

- Biome: `correctness/noUnusedVariables`, `correctness/noUnusedImports`
- Cobertura de código (Bun test runner): branches/linhas com 0% de cobertura são suspeitas
- Ferramentas de IDE: "Find Unused Code"

## Related to

- [039 - Boy Scout Rule (Continuous Refactoring)](039_regra-escoteiro-refatoracao-continua.md): reinforces
- [021 - Prohibition of Logic Duplication (DRY)](021_proibicao-duplicacao-logica.md): complements
- [025 - Prohibition of The Blob Anti-Pattern](025_proibicao-anti-pattern-the-blob.md): reinforces
- [010 - Single Responsibility Principle (SRP)](010_principio-responsabilidade-unica.md): reinforces
- [032 - Minimum Test Coverage Quality](032_cobertura-teste-minima-qualidade.md): complements

---

**Created on**: 2026-03-28
**Updated on**: 2026-07-15
**Version**: 1.1
