---
title: "Decomposição Funcional (Functional Decomposition)"
category: "Anti-Patterns"
type: reference
id: "STRUCTURAL-006"
severity: "🟡 Medium"
tags: [anti-patterns]
---

# Decomposição Funcional (Functional Decomposition)

## Explanation

### O que é

Um desenvolvedor experiente em programação procedural usa uma linguagem orientada a objetos, mas modela o sistema como uma sequência de funções decompostas em classes que são meros contêineres de um único método — sem estado real, sem polimorfismo e sem colaboração entre objetos.

### Por que importa

- Desperdiça os recursos da linguagem orientada a objetos (herança, polimorfismo, encapsulamento) sem usar nenhum deles de fato
- Produz classes com nomes de verbo (`CalcularFrete`, `ValidarPedido`) que são, na prática, funções disfarçadas de classe
- Gera um sistema tão rígido quanto um programa procedural, mas com a complexidade acidental extra de classes
- É frequentemente confundido com "boas práticas de OO" por criar muitas classes pequenas, quando na verdade nenhuma delas colabora de forma orientada a objetos

## How-to

### Como aplicar

- Verificar se as classes do sistema colaboram entre si com polimorfismo ou se apenas chamam umas às outras em sequência fixa, como uma lista de funções
- Introduzir estado e colaboração real, ou assumir explicitamente que a classe é um [Command](../skills/gof/references/command.md)/Use Case de método único

## Reference

### Critérios Objetivos

- [ ] Uma classe cujo único método público não-trivial é um verbo de ação (ex: `execute()`, `run()`) sem nenhum estado relevante deve ser questionada.
- [ ] O sistema deve ter herança ou composição polimórfica real em pontos de variação de comportamento, não apenas cadeias de chamada de função.
- [ ] Classes que não mantêm nenhum estado entre chamadas de método devem ser avaliadas quanto a serem, na verdade, funções puras.

### Exceções Permitidas

- **Command Pattern e Use Cases**: classes com um único método de execução são legítimas quando representam explicitamente um comando ou caso de uso, e não uma tentativa disfarçada de programação procedural.

### Como Detectar

#### Manual

- Verificar se as classes do sistema colaboram entre si com polimorfismo ou se apenas chamam umas às outras em sequência fixa, como uma lista de funções

#### Automático

- Sem regra nativa de Biome para esta análise semântica — detecção via revisão de arquitetura

## Related to

- [SRP - Single Responsibility Principle](../skills/solid/SKILL.md): complements — decomposição funcional não é o mesmo que responsabilidade única bem aplicada
- [001 — The Blob (God Object)](001_anti-pattern-the-blob.md): complements — extremos opostos do mesmo problema de modelagem OO malfeita
- [028 — Switch Statements](028_declaracoes-switch.md): reinforces
- [Command](../skills/gof/references/command.md): contrasts — a exceção legítima quando o método único representa de fato um caso de uso
- [003 — Código Spaghetti](003_codigo-spaghetti.md): complements — outra forma de modelagem sem estrutura orientada a objetos
- [Reusability — Reusabilidade](../skills/quality/references/reusability.md): contrasts — classes sem estado nem polimorfismo raramente são reaproveitadas de forma OO
