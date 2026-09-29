---
title: "Intimidade Inadequada (Inappropriate Intimacy)"
category: "Code Smells"
type: reference
id: "STRUCTURAL-032"
severity: "🟠 High"
tags: [code-smells]
---

# Intimidade Inadequada (Inappropriate Intimacy)

## Explanation

### O que é

Duas classes acessam excessivamente os campos e métodos privados/internos uma da outra, comportando-se como se fossem uma única classe. O limite de encapsulamento entre elas existe apenas formalmente.

### Por que importa

- Cria acoplamento tão forte quanto o de uma única classe, mas espalhado em dois arquivos
- Uma mudança interna em uma classe frequentemente quebra a outra
- Torna impossível testar ou reutilizar uma classe sem trazer a outra junto
- Costuma ser sinal de que as duas classes deveriam ser fundidas ou ter a interface entre elas redesenhada

## Reference

### Critérios Objetivos

- [ ] Uma classe não deve acessar campos privados de outra classe por meio de *getters* expostos apenas para esse fim.
- [ ] O número de chamadas entre duas classes específicas não deve superar o número de chamadas que cada uma faz para o restante do sistema.
- [ ] É proibido que duas classes se modifiquem mutuamente em ciclo (A altera estado de B, que altera estado de A).

### Exceções Permitidas

- **Pares Bidirecionais Intencionais**: relações modeladas deliberadamente como bidirecionais (ex: `Parent`/`Child` em uma árvore), desde que documentadas como tal.

### Como Detectar

#### Manual

- Verificar se duas classes específicas trocam chamadas com mais frequência entre si do que com qualquer outra parte do sistema

#### Automático

- Sem regra nativa de Biome para esta análise de acoplamento — usar ferramenta dedicada de métricas (ex: acoplamento aferente/eferente por classe)

## Related to

- [Tell, Don't Ask (Law of Demeter)](../skills/calisthenics/references/diga-nao-pergunte.md): reinforces
- [SRP - Single Responsibility Principle](../skills/solid/SKILL.md): reinforces
- [Direct State Exposure (Getters/Setters)](../skills/calisthenics/references/getters-setters.md): reinforces
- [029 — Feature Envy](029_feature-envy.md): reinforces — Feature Envy não corrigido evolui para Inappropriate Intimacy entre as duas classes.
- [Mediator](../skills/gof/references/mediator.md): complements — introduzir um Mediator remove a comunicação direta e íntima entre as duas classes.
- [035 — Middle Man](035_middle-man.md): contrasts — extremos opostos de acoplamento: intimidade excessiva versus indireção que não agrega valor.
