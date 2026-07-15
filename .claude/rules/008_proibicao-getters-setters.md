# Proibição de Exposição Direta de Estado (Getters/Setters)

**ID**: BEHAVIORAL-008
**Severity**: 🔴 Critical
**Category**: Behavioral

---

## What it is

Proíbe a criação de métodos puramente para acesso ou modificação direta do estado interno do objeto (como `getPropriedade()` e `setPropriedade()`), reforçando o encapsulamento e o princípio "Diga, Não Pergunte".

## Why it matters

- Expor estado interno diretamente viola o encapsulamento
- Força o código cliente a decidir lógica de negócio (programação procedural)
- Resulta em classes anêmicas, sem comportamento próprio
- Acopla clientes a detalhes de implementação que deveriam ser privados

## Objective Criteria

- [ ] Métodos que retornam o valor exato de uma propriedade interna sem transformações ou lógica são proibidos (puros *getters*).
- [ ] Métodos que apenas atribuem um valor a uma propriedade interna são proibidos (puros *setters*).
- [ ] A interação com o objeto deve ocorrer por métodos que expressam *intenção* de negócio (ex: `agendarReuniao()` em vez de `setStatus(Agendado)`).

## Allowed Exceptions

- **Objetos de Transferência de Dados (DTOs)**: Classes puras usadas apenas para transferência de dados entre camadas, sem lógica de negócio.
- **Frameworks de Serialização**: Bibliotecas que exigem *getters* e *setters* para mapeamento.

## How to Detect

### Manual

- Buscar métodos que contenham prefixos `get` ou `set` seguidos por um nome de propriedade
- Identificar métodos que não possuam lógica de negócio própria além de ler/atribuir um campo

### Automatic

- Sem regra nativa de Biome para detectar getters/setters triviais — detecção via revisão de código

## Related to

- [009 - Tell, Don't Ask](009_diga-nao-pergunte.md): reinforces
- [003 - Primitive Domain Encapsulation](003_encapsulamento-primitivos.md): complements
- [002 - Prohibition of ELSE Clause](002_proibicao-clausula-else.md): reinforces
- [004 - First-Class Collections](004_colecoes-primeira-classe.md): reinforces
- [005 - Method Chaining Restriction](005_maximo-uma-chamada-por-linha.md): reinforces
- [029 - Object Immutability (freeze)](029_imutabilidade-objetos-freeze.md): reinforces
- [036 - Side-Effect Function Restrictions](036_restricao-funcoes-efeitos-colaterais.md): complements

---

**Created on**: 2025-10-04
**Updated on**: 2026-07-15
**Version**: 1.1
