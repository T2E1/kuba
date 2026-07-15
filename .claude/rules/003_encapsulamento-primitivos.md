# Encapsulamento de Primitivos de Domínio (Value Objects)

**ID**: CREATIONAL-003
**Severity**: 🔴 Critical
**Category**: Creational

---

## What it is

Exige que tipos primitivos (como `number`, `boolean`) e a classe `String` que representam conceitos de domínio (ex: *Email*, *CPF*, *Moeda*) sejam encapsulados em seus próprios *Value Objects* imutáveis.

*(Previne o anti-pattern Primitive Obsession: uso de `string`, `number`, `boolean` para representar conceitos de domínio que deveriam ser objetos com comportamento próprio.)*

## Why it matters

- Garante que validação e regras de negócio do valor sejam definidas uma única vez, no construtor
- Evita inconsistências causadas por dados inválidos passados entre métodos
- Centraliza formatação e comportamento do conceito de domínio em um único lugar
- Reduz bugs graves causados por primitivos com o mesmo tipo representando conceitos diferentes

## Objective Criteria

- [ ] Parâmetros de entrada e valores de retorno de métodos públicos não devem ser tipos primitivos/String se representarem um conceito de domínio específico.
- [ ] Todos os *Value Objects* devem ser imutáveis.
- [ ] A lógica de validação do formato e regras de negócio do valor deve estar contida e ser executada no construtor do *Value Object*.

## Allowed Exceptions

- **Primitivos Genéricos**: Tipos primitivos usados para contagem (`i`, `index`), booleanos de controle (`isValid`), ou números sem significado de domínio (ex: delta temporal).

## How to Detect

### Manual

- Identificar `string` ou `number` sendo passado como argumento em múltiplos métodos, representando, por exemplo, um *ID* ou *Path*
- Buscar validações repetidas do mesmo formato de dado em pontos diferentes do código

### Automatic

- TypeScript: tipagem estrita evidencia quando um mesmo primitivo (`string`/`number`) representa conceitos de domínio distintos que deveriam ser classes separadas (sem regra de lint nativa equivalente no Biome)

## Related to

- [008 - Prohibition of Getters/Setters](008_proibicao-getters-setters.md): reinforces
- [009 - Tell, Don't Ask](009_diga-nao-pergunte.md): reinforces
- [024 - Prohibition of Magic Constants](024_proibicao-constantes-magicas.md): reinforces
- [029 - Object Immutability (freeze)](029_imutabilidade-objetos-freeze.md): reinforces
- [033 - Maximum Function Parameters](033_limite-parametros-funcao.md): reinforces
- [035 - Prohibition of Misleading Names](035_proibicao-nomes-enganosos.md): reinforces
- [053 - Prohibition of Data Clumps](053_proibicao-agrupamentos-dados-repetidos.md): complements

---

**Created on**: 2025-10-04
**Updated on**: 2026-07-15
**Version**: 1.1
