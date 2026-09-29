---
title: "Declarações Switch (Switch Statements)"
category: "Code Smells"
type: reference
id: "BEHAVIORAL-028"
severity: "🟠 High"
tags: [code-smells]
---

# Declarações Switch (Switch Statements)

## Explanation

### O que é

O mesmo bloco `switch`/`if-else if` que verifica um código de tipo aparece repetido em vários pontos do código. Sempre que um novo tipo é adicionado, todos esses pontos precisam ser localizados e alterados manualmente.

### Por que importa

- Cada novo tipo exige caçar e editar todas as ocorrências do switch espalhadas pelo código
- É fácil esquecer uma ocorrência, gerando bug silencioso
- Sinaliza ausência de polimorfismo onde ele resolveria o problema de forma mais segura
- É o sintoma de código mais associado à violação do Open/Closed Principle

## Reference

### Critérios Objetivos

- [ ] Nenhuma lógica de decisão baseada no mesmo código de tipo deve se repetir em mais de **1** lugar no código.
- [ ] Um `switch`/`if-else if` sobre tipo deve existir, no máximo, na *Factory* ou ponto único de criação do objeto polimórfico.
- [ ] Adicionar um novo tipo não deve exigir editar mais de um arquivo além da própria classe do novo tipo.

### Exceções Permitidas

- **[Factory Methods](../skills/gof/references/factory-method.md)**: o único lugar onde o `switch` decide qual classe concreta instanciar é aceitável.

### Como Detectar

#### Manual

- Buscar o mesmo conjunto de `case` ou condições de tipo repetido em múltiplos arquivos

#### Automático

- Biome: `complexity/noExcessiveCognitiveComplexity` (penaliza `switch`/`if-else if` extensos, indício do smell)

## Related to

- [OCP - Open/Closed Principle](../skills/solid/SKILL.md): reinforces — este smell é o sintoma mais direto da violação do OCP
- [LSP - Liskov Substitution Principle](../skills/solid/SKILL.md): complements
- [Logic Duplication (DRY)](../skills/clean-code/references/duplicacao-logica.md): reinforces
- [Strategy](../skills/gof/references/strategy.md): complements — substituir o switch por Strategy é a refatoração clássica (Replace Conditional with Polymorphism).
- [Factory Method](../skills/gof/references/factory-method.md): complements — concentra o switch remanescente no único ponto de criação aceitável.
- [State](../skills/gof/references/state.md): complements — quando o switch decide comportamento por estado do objeto, o padrão State é a alternativa polimórfica.
- [038 — Shotgun Surgery](038_shotgun-surgery.md): reinforces — o switch duplicado é a causa raiz mais comum de Shotgun Surgery ao adicionar um tipo novo.
