---
title: "Classe de Biblioteca Incompleta (Incomplete Library Class)"
category: "Code Smells"
type: reference
id: "STRUCTURAL-020"
severity: "🟡 Medium"
tags: [code-smells]
---

# Classe de Biblioteca Incompleta (Incomplete Library Class)

## Explanation

### O que é

Uma classe de uma biblioteca ou framework de terceiros não oferece todos os métodos necessários para o caso de uso do projeto, e o código-fonte dessa classe não pode ser modificado diretamente.

### Por que importa

- Força soluções improvisadas (herança frágil, cópia de código da biblioteca, *monkey patching*) para suprir a lacuna
- Sem um ponto único de extensão, a lacuna é contornada de formas diferentes em cada lugar que precisa dela
- Acopla o projeto a detalhes internos de uma biblioteca que pode mudar em futuras versões
- Dificulta a atualização da biblioteca, pois as soluções improvisadas podem depender de comportamento não documentado

## Reference

### Critérios Objetivos

- [ ] Funcionalidade ausente de uma biblioteca de terceiros deve ser suprida por meio de um *[Adapter](../skills/gof/references/adapter.md)* ou classe *Extension*, nunca por cópia do código da biblioteca.
- [ ] É proibido usar herança de uma classe de biblioteca externa apenas para "grudar" métodos extras (ver Boat Anchor/acoplamento indevido).
- [ ] Toda extensão de comportamento de biblioteca deve estar centralizada em um único módulo de *wrapper*.

### Exceções Permitidas

- **Patches Oficiais Documentados**: quando a própria biblioteca oferece mecanismo de [Plugin](../skills/poeaa/references/plugin.md)/extensão para o caso de uso.

### Como Detectar

#### Manual

- Buscar código que estende ou faz *patch* de uma classe de terceiros para adicionar um método ausente

#### Automático

- Sem regra nativa de Biome para este smell — detecção via revisão de código

## Related to

- [DIP - Dependency Inversion Principle](../skills/solid/SKILL.md): reinforces — isolar a lacuna atrás de uma abstração própria
- [007 — Boat Anchor](007_dependencia-barco-ancora.md): complements
- [Encapsulamento de APIs de Terceiros (Boundaries)](../skills/clean-code/references/encapsulamento-apis-terceiros.md): reinforces — o wrapper centralizado é exatamente a prática de Boundaries.
- [Adapter](../skills/gof/references/adapter.md): reinforces — o padrão GoF formaliza a solução recomendada para a lacuna da biblioteca.
- [Facade](../skills/gof/references/facade.md): complements — uma Facade pode simplificar e completar a interface de uma biblioteca de terceiros complexa.
- [035 — Middle Man](035_middle-man.md): contrasts — o wrapper de extensão deve agregar valor real, não apenas repassar chamadas como um Middle Man.
