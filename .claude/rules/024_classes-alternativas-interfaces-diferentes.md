---
title: "Classes Alternativas com Interfaces Diferentes (Alternative Classes with Different Interfaces)"
category: "Code Smells"
type: reference
id: "STRUCTURAL-024"
severity: "🟡 Medium"
tags: [code-smells]
---

# Classes Alternativas com Interfaces Diferentes (Alternative Classes with Different Interfaces)

## Explanation

### O que é

Duas classes fazem coisas equivalentes ou intercambiáveis, mas expõem métodos com nomes, assinaturas ou ordens de parâmetros diferentes, impedindo que sejam usadas de forma polimórfica ou substituídas uma pela outra sem alterar o código cliente.

### Por que importa

- Impede o uso de polimorfismo mesmo quando as classes resolvem o mesmo problema
- Força o código cliente a conhecer qual classe concreta está usando, mesmo lidando com conceitos equivalentes
- Dificulta trocar uma implementação pela outra (ex: trocar um provedor de pagamento por outro)
- É frequentemente causado por duas classes evoluírem em paralelo sem coordenação

## Reference

### Critérios Objetivos

- [ ] Classes que resolvem o mesmo problema de domínio devem implementar a mesma interface.
- [ ] Métodos equivalentes em classes alternativas devem ter o mesmo nome, mesma ordem de parâmetros e mesmo tipo de retorno.
- [ ] Não deve haver dois métodos como `salvar()` e `persistir()` fazendo exatamente a mesma coisa em classes irmãs.

### Exceções Permitidas

- **Bibliotecas de Terceiros**: quando as classes alternativas vêm de bibliotecas externas não controladas pelo time, um *[Adapter](../skills/gof/references/adapter.md)* deve ser criado em vez de forçar a mudança na biblioteca.

### Como Detectar

#### Manual

- Comparar classes que resolvem o mesmo problema de domínio e verificar se poderiam compartilhar uma interface comum sem alterações relevantes

#### Automático

- Sem regra nativa de Biome para esta análise semântica — detecção via revisão de código

## Related to

- [LSP - Liskov Substitution Principle](../skills/solid/SKILL.md): reinforces
- [ISP - Interface Segregation Principle](../skills/solid/SKILL.md): complements
- [Misleading Names](../skills/naming/references/nomes-enganosos.md): complements
- [Strategy](../skills/gof/references/strategy.md): complements — unificar a interface é o que permite tratar as classes alternativas como Strategies intercambiáveis.
- [Separated Interface](../skills/poeaa/references/separated-interface.md): reinforces — a interface comum extraída é uma Separated Interface de PoEAA.
- [020 — Classe de Biblioteca Incompleta](020_classe-biblioteca-incompleta.md): complements — quando a divergência vem de bibliotecas de terceiros, o Adapter é a mesma solução usada para lacunas de biblioteca.
