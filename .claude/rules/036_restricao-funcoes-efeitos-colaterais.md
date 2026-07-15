# Restrição de Funções com Efeitos Colaterais (Side Effects)

**ID**: BEHAVIORAL-036
**Severity**: 🔴 Critical
**Category**: Behavioral

---

## What it is

Exige que as funções ou métodos, exceto aqueles explicitamente designados como **Comandos** (que alteram estado), sejam puras e **não alterem o estado** de variáveis de instância, objetos globais ou objetos externos passados por referência.

## Why it matters

- Efeitos colaterais inesperados introduzem erros graves e difíceis de rastrear
- Quebram a previsibilidade e o Princípio da Surpresa Mínima
- Código impuro é difícil de testar isoladamente e de depurar
- Dificulta reutilizar uma função com confiança em outro contexto

## Objective Criteria

- [ ] Funções que são puramente **Consultas (Queries)** não devem modificar variáveis de instância da classe ou objetos globais/externos.
- [ ] Objetos mutáveis passados como parâmetro devem ser clonados antes de qualquer modificação, a menos que a modificação seja a intenção de negócio do método.
- [ ] Funções que alteram o estado devem ter nomes que começam com verbos de Comando (ex: `update`, `save`, `delete`).

## Allowed Exceptions

- **Comandos de Persistência**: Métodos de `Repository` ou `Service` que explicitamente alteram o estado do sistema (ex: `save`, `delete`).
- **Interfaces Fluidas/Builders**: Classes que retornam `this` para modificar o próprio objeto.

## How to Detect

### Manual

- Buscar métodos que retornam um valor de consulta, mas também chamam um `setter` ou modificam um atributo interno/externo

### Automatic

- Biome: `style/noParameterAssign` (impede reatribuição de parâmetros, um vetor comum de efeito colateral)

## Related to

- [009 - Tell, Don't Ask](009_diga-nao-pergunte.md): reinforces
- [038 - Command-Query Separation (CQS)](038_conformidade-principio-inversao-consulta.md): reinforces
- [029 - Object Immutability (freeze)](029_imutabilidade-objetos-freeze.md): reinforces
- [052 - Prohibition of Accidental Mutation](052_proibicao-mutacao-acidental.md): reinforces
- [070 - Prohibition of Shared Mutable State](070_proibicao-estado-mutavel-compartilhado.md): reinforces

---

**Created on**: 2025-10-08
**Updated on**: 2026-07-15
**Version**: 1.1
