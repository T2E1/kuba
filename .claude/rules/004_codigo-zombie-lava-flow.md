---
title: "Lava Flow (Código Zumbi)"
category: "Anti-Patterns"
type: reference
id: "STRUCTURAL-004"
severity: "🟠 High"
tags: [anti-patterns]
---

# Lava Flow (Código Zumbi)

## Explanation

### O que é

Lava Flow (Dead Code / Zombie Code) ocorre quando código não é mais utilizado mas permanece no sistema porque ninguém tem certeza se pode ser removido com segurança. Como lava que solidifica e endurece, este código se torna um obstáculo permanente à manutenção. Código abandonado, comentado ou nunca chamado.

### Por que importa

- Carga cognitiva extra: desenvolvedores precisam entender código inútil para encontrar código útil
- Confusão perpetuada: novos desenvolvedores não sabem o que está ativo ou obsoleto
- Débito técnico crescente: o sistema se torna maior e mais lento para navegar
- Bugs preservados: código morto pode ser reativado acidentalmente e introduzir bugs antigos
- Complexidade falsa: sistema parece fazer mais do que realmente faz

## How-to

### Como aplicar

- Confiar no controle de versão para guardar histórico — não em código comentado
- Remover, não desativar: se algo precisa ser desligado temporariamente, usar feature flag documentada com prazo, não comentário

### Exemplo

```javascript
// ❌ Funções que ninguém chama, código comentado acumulado
function calculateOldDiscount(price) { // deprecated - use calculateDiscount
  return price * 0.1;
}

// function formatUserV1(user) {
//   return user.name + ' (' + user.email + ')';
// }

function getUser(id) {
  // const cache = loadCache(); // removido em 2023 mas mantido por segurança
  return db.find(id);
}
```

```javascript
// ✅ Só existe o que é usado no código
function getUser(id) {
  return db.find(id);
}

// Código morto eliminado — o controle de versão guarda o histórico
```

Codetag sugerido:

```typescript
// FIXME: Lava Flow — calculateOldDiscount nunca chamado, código comentado acumulado
// TODO: Remover código morto; o git guarda o histórico
```

## Reference

### Critérios Objetivos

- [ ] Funções, classes ou módulos nunca chamados/executados
- [ ] Código comentado com marcadores como `// versão antiga`, `// deprecated`, `// TODO remover`
- [ ] Imports de módulos/pacotes que nunca são referenciados
- [ ] Branches de `if` ou `switch` que nunca são executados (cobertura de teste = 0%)
- [ ] Variáveis declaradas e nunca lidas
- [ ] Arquivos inteiros que ninguém sabe para que servem

### Exceções Permitidas

- **Desativação Temporária**: Desabilitado com `@TODO` documentado e prazo definido.
- **Feature Flags**: Caminhos de feature flag ou teste A/B com uso conhecido.
- **Rollback Imediato**: Mantido por menos de um dia para reverter funcionalidade crítica.
- **Documentação Histórica**: Comentário histórico preservado por valor educacional.

### Como Detectar

#### Manual

- Procurar comentários com prefixos `//`, `#` e [TODO](../skills/codetags/references/TODO.md), [FIXME](../skills/codetags/references/FIXME.md), [DEPRECATED](../skills/codetags/references/DEPRECATED.md)
- Identificar funções/classes sem testes unitários, sem imports, sem referências
- Verificar módulos importados mas nunca usados

#### Automático

- Biome: `correctness/noUnusedVariables`, `correctness/noUnusedImports`
- Cobertura de código (Bun test runner): branches/linhas com 0% de cobertura são suspeitas
- Ferramentas de IDE: "Find Unused Code"

## Related to

- [Boy Scout Rule (Continuous Refactoring)](../skills/clean-code/references/regra-escoteiro-refatoracao-continua.md): reinforces
- [Logic Duplication (DRY)](../skills/clean-code/references/duplicacao-logica.md): complements
- [001 — The Blob Anti-Pattern](001_anti-pattern-the-blob.md): reinforces
- [Single Responsibility Principle (SRP)](../skills/solid/SKILL.md): reinforces
- [Minimum Test Coverage Quality](../skills/clean-code/references/cobertura-teste-minima-qualidade.md): complements
- [026 — Código Morto (Dead Code)](026_codigo-morto.md): reinforces — mesmo sintoma, granularidade de Code Smell em vez de anti-pattern arquitetural
- [Maintainability — Manutenibilidade](../skills/quality/references/maintainability.md): reinforces — código morto é o principal vilão desta qualidade McCall
- [REFACTOR](../skills/codetags/references/REFACTOR.md): complements — a codetag apropriada para marcar a remoção planejada
