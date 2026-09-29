---
title: "Classe Preguiçosa (Lazy Class)"
category: "Code Smells"
type: reference
id: "STRUCTURAL-023"
severity: "🟡 Medium"
tags: [code-smells]
---

# Classe Preguiçosa (Lazy Class)

## Explanation

### O que é

Uma classe faz tão pouco que não justifica o custo de mantê-la separada. Costuma ser resultado de uma refatoração anterior que reduziu suas responsabilidades, ou de um design especulativo que previa mais funcionalidade do que a classe acabou tendo.

### Por que importa

- Adiciona um nível de indireção que exige navegação extra sem ganho real de clareza ou coesão
- Aumenta o número de arquivos/classes que o time precisa entender sem retorno proporcional
- Frequentemente é sintoma de [Funcionalidade Especulativa](../skills/clean-code/references/funcionalidade-especulativa.md) (YAGNI violado)
- Some devem ser eliminadas por *inline* ou fundidas a outra classe relacionada

## Reference

### Critérios Objetivos

- [ ] Uma classe com menos de **2** métodos públicos e nenhuma razão prevista de crescimento deve ser eliminada via *inline*.
- [ ] Classes criadas "para o futuro" sem uso atual devem ser removidas até que o uso real apareça.
- [ ] Uma subclasse que não sobrescreve nenhum comportamento da classe base deve ser questionada.

### Exceções Permitidas

- **Classes de Interface/Contrato**: classes ou interfaces enxutas que existem deliberadamente para desacoplar módulos (ex: uma interface com um único método, usada para inversão de dependência).

### Como Detectar

#### Manual

- Revisar classes com poucos métodos e perguntar se seu conteúdo poderia viver dentro de outra classe sem perda de clareza

#### Automático

- Sem regra nativa de Biome para este smell — detecção via revisão de código

## Related to

- [Speculative Functionality (YAGNI)](../skills/clean-code/references/funcionalidade-especulativa.md): reinforces
- [SRP - Single Responsibility Principle](../skills/solid/SKILL.md): complements
- [013 — Overengineering](013_overengineering.md): reinforces
- [022 — Large Class](022_classe-grande.md): contrasts — extremos opostos: uma classe faz de menos, a outra faz demais.
- [035 — Middle Man](035_middle-man.md): complements — uma Lazy Class que só delega chamadas é também um Middle Man.
- [Priorização da Simplicidade e Clareza (KISS)](../skills/clean-code/references/priorizacao-simplicidade-clareza.md): reinforces — eliminar a classe preguiçosa é aplicar KISS ao design.
