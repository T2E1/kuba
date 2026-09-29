---
title: "Código Morto (Dead Code)"
category: "Code Smells"
type: reference
id: "STRUCTURAL-026"
severity: "🟠 High"
tags: [code-smells]
---

# Código Morto (Dead Code)

## Explanation

### O que é

Variáveis, parâmetros, campos, métodos, classes ou branches condicionais que nunca são executados ou referenciados em tempo de execução, mas continuam presentes no código-fonte.

### Por que importa

- Aumenta o tamanho do código sem agregar valor, elevando o custo cognitivo de leitura
- Confunde o leitor, que assume que código presente é código relevante e usado
- Pode ficar desatualizado silenciosamente e, se um dia for reativado por engano, reintroduzir comportamento incorreto
- Diferente de Lava Flow: aqui o código é comprovadamente inalcançável, não apenas "código do qual ninguém tem certeza"

## Reference

### Critérios Objetivos

- [ ] É proibido manter no repositório principal métodos, classes ou branches condicionais sem nenhuma referência ativa no código ou em testes.
- [ ] Código comentado ("comentado para o caso de precisar depois") deve ser removido; o histórico do Git já cumpre esse papel.
- [ ] *Feature flags* permanentemente desligadas e o código que elas guardam devem ser removidos após a decisão de não usar a feature.

### Exceções Permitidas

- **Código de Compatibilidade Documentado**: trechos mantidos deliberadamente para suportar uma versão externa antiga, com comentário explicando a razão e uma condição de remoção.

### Como Detectar

#### Manual

- Buscar blocos de código comentados e branches condicionais cuja condição nunca pode ser verdadeira

#### Automático

- Biome: `correctness/noUnusedVariables`, `correctness/noUnusedImports` (detectam declarações nunca referenciadas)
- Cobertura de testes: métodos com 0% de cobertura e nenhuma chamada em produção são candidatos fortes

## Related to

- [004 — Lava Flow](004_codigo-zombie-lava-flow.md): complements — Lava Flow é código que ninguém ousa remover; Dead Code é código comprovadamente inalcançável
- [Boy Scout Rule](../skills/clean-code/references/regra-escoteiro-refatoracao-continua.md): reinforces
- [Funcionalidade Especulativa (YAGNI)](../skills/clean-code/references/funcionalidade-especulativa.md): complements — código especulativo nunca usado é uma das origens mais comuns de código morto.
- [DEPRECATED](../skills/codetags/references/DEPRECATED.md): complements — a marcação DEPRECATED sinaliza o caminho até o código virar Dead Code e ser removido.
- [002 — Beco Sem Saída (Dead End)](002_beco-sem-saida.md): contrasts — Dead End é uma decisão arquitetural irreversível; Dead Code é apenas trecho de fonte não executado.
