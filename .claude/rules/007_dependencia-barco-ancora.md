---
title: "Dependência Barco-Âncora (Boat Anchor)"
category: "Anti-Patterns"
type: reference
id: "STRUCTURAL-007"
severity: "🟡 Medium"
tags: [anti-patterns]
---

# Dependência Barco-Âncora (Boat Anchor)

## Explanation

### O que é

Boat Anchor ocorre quando uma dependência, biblioteca ou componente é importado para a base de código, instalado no `package.json`, mas nunca é usado ou usado apenas superficialmente. Como uma âncora de barco que interfere no movimento, essas dependências não usadas adicionam complexidade e custo de manutenção sem trazer valor. Variante de Lava Flow para dependências.

### Por que importa

- Inchaço de dependências: mais arquivos, mais downloads, mais tempo de build/CI/CD
- Vulnerabilidades de segurança: dependências não usadas não são monitoradas mas podem ter CVEs
- Dificuldade de onboarding: desenvolvedores se perguntam "para que serve X?" e perdem tempo pesquisando
- Confusão tecnológica: parece ser usado mas não é; falsa impressão de capacidades
- Licenças complexas: dependências não usadas podem introduzir problemas de licenciamento sem razão

## How-to

### Como aplicar

- Criar módulo/dependência apenas quando a feature for realmente necessária, com testes desde o início ([YAGNI](../skills/clean-code/references/funcionalidade-especulativa.md))
- Rodar auditoria de dependências não usadas periodicamente, não só na criação

### Exemplo

```javascript
// ❌ Dependência instalada "para quando precisarmos"
// package.json tem: "pdfkit", "sharp", "node-cron"
// Nenhuma delas tem uma única linha de uso no código

// ❌ Módulo criado "para o próximo sprint"
export class ReportExporter {
  exportToExcel() { /* TODO: implementar */ }
  exportToPowerPoint() { /* TODO: implementar */ }
}
```

```javascript
// ✅ Só existe o que é usado (YAGNI)
// package.json: apenas dependências com referências reais no código
// Módulo criado quando a feature for necessária, com testes desde o início

// Usar: npm-check, depcheck, pipreqs, go mod tidy para detectar
```

Codetag sugerido:

```typescript
// FIXME: Boat Anchor — pdfkit/sharp/node-cron instalados mas nunca referenciados
// TODO: npm uninstall; criar módulo quando a necessidade for real
```

## Reference

### Critérios Objetivos

- [ ] Dependência listada em `package.json`, mas nunca importada
- [ ] Biblioteca importada mas nunca chamada (`import X` sem uso de `X.method()`)
- [ ] Dependência morta (não mantida) mantida "just in case" sem timeline de uso futuro
- [ ] Framework/biblioteca instalado mas apenas 1-2 features usadas quando alternativa simples existe

### Exceções Permitidas

- **DevDependencies de Tooling**: Ferramenta de build — linter, formatter — nunca referenciada em produção.
- **Dependências Opcionais**: Plugin cujo uso só se resolve em tempo de execução.
- **Adoção Planejada**: Com prazo definido, registrada em comentário ou ticket.

### Como Detectar

#### Manual

- Comparar `package.json` com `grep -rE "^import|^from"` — diferenças são boat anchors
- Buscar bibliotecas onde docs mencionam "usamos X" mas grep na base de código mostra zero uso
- Verificar testes: se a biblioteca só aparece em código de produção não importado, é boat anchor

#### Automático

- `depcheck`: detecta dependências declaradas mas não usadas no código JS/TS
- Biome: `correctness/noUnusedImports` (complementa, sinalizando imports não usados dentro de arquivos)

## Related to

- [004 — Zombie Code (Lava Flow)](004_codigo-zombie-lava-flow.md): complements
- [Explicit Dependency Declaration](../skills/twelve-factor/SKILL.md): reinforces
- [Boy Scout Rule (Continuous Refactoring)](../skills/clean-code/references/regra-escoteiro-refatoracao-continua.md): reinforces
- [Simplicity and Clarity (KISS)](../skills/clean-code/references/priorizacao-simplicidade-clareza.md): reinforces
- [Speculative Generality (YAGNI)](../skills/clean-code/references/funcionalidade-especulativa.md): reinforces — dependência instalada "para quando precisarmos" é a mesma especulação em nível de pacote
- [013 — Overengineering](013_overengineering.md): complements — ambos adicionam complexidade não demandada pelo problema atual
- [Portability — Portabilidade](../skills/quality/references/portability.md): contrasts — dependências não usadas ainda assim ampliam a superfície de portabilidade a manter
