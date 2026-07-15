# Uso Obrigatório de Coleções de Primeira Classe

**ID**: STRUCTURAL-004
**Severity**: 🟠 High
**Category**: Structural

---

## What it is

Determina que qualquer coleção (lista, array, mapa) com lógica de negócio ou comportamento associado deve ser encapsulada em uma classe dedicada (*First Class Collection*).

## Why it matters

- Coleções nativas com lógica de manipulação distribuída violam o SRP
- Encapsular a coleção centraliza a responsabilidade sobre seu comportamento
- Facilita adicionar operações de domínio (filtros, somas, validações) em um único lugar
- Previne que o estado interno da coleção seja exposto e modificado livremente por clientes

## Objective Criteria

- [ ] Tipos nativos de coleção (Array, List, Map) não devem ser passados como parâmetros ou retornados por métodos públicos, exceto para DTOs puros.
- [ ] Cada coleção com significado de domínio deve ser envolvida por uma classe dedicada (ex: `ListaDePedidos`, `Funcionarios`).
- [ ] A classe de coleção deve fornecer métodos de comportamento (ex: `adicionar()`, `filtrarPorStatus()`), e não apenas acesso direto aos elementos.

## Allowed Exceptions

- **Interfaces de Baixo Nível**: Coleções usadas puramente como estruturas de dados internas sem lógica de negócio associada (ex: `tokens` em um *scanner*).
- **APIs de Framework**: Uso de coleções em interfaces de Frameworks (ex: React, ORMs) que as exigem.

## How to Detect

### Manual

- Verificar o uso de `Array.prototype` (map, filter, reduce) em métodos de classes que não sejam *First Class Collections*
- Buscar a mesma lógica de filtro/soma repetida sobre a mesma coleção em pontos diferentes do código

### Automatic

- Sem regra nativa de Biome para esta semântica de domínio — detecção via revisão de código e convenção de nomenclatura de classes de coleção

## Related to

- [007 - Maximum Lines per Class File](007_limite-maximo-linhas-classe.md): reinforces
- [008 - Prohibition of Getters/Setters](008_proibicao-getters-setters.md): reinforces
- [010 - Single Responsibility Principle (SRP)](010_principio-responsabilidade-unica.md): reinforces
- [009 - Tell, Don't Ask](009_diga-nao-pergunte.md): complements
- [003 - Primitive Domain Encapsulation](003_encapsulamento-primitivos.md): complements

---

**Created on**: 2025-10-04
**Updated on**: 2026-07-15
**Version**: 1.1
