# Aplicação do Princípio de Inversão de Dependência (DIP)

**ID**: BEHAVIORAL-014
**Severity**: 🔴 Critical
**Category**: Behavioral

---

## What it is

Módulos de alto nível não devem depender de módulos de baixo nível. Ambos devem depender de abstrações (interfaces).

## Why it matters

- Desacopla a política de negócio da implementação concreta
- Cria acoplamento rígido quando violado, dificultando testes de unidade e integração
- Impede que o módulo de alto nível seja reutilizado em um novo contexto
- Bloqueia a substituição de uma implementação por outra sem alterar o consumidor

## Objective Criteria

- [ ] A criação de novas instâncias de classes concretas (*new Class()*) é proibida dentro de classes de alto nível (ex: *Services* e *Controllers*).
- [ ] Módulos de alto nível devem referenciar apenas interfaces ou classes abstratas (o que será injetado).
- [ ] O número de *imports* para classes concretas em construtores deve ser zero (apenas injeção de abstrações).

## Allowed Exceptions

- **Entidades e Value Objects**: Classes de dados puras que podem ser instanciadas livremente.
- **Root Composer**: O módulo de inicialização do sistema onde a injeção de dependência é configurada.

## How to Detect

### Manual

- Buscar `new NomeConcreto()` dentro do código de *Services* ou *Business Logic*

### Automatic

- Sem regra nativa de Biome para impor inversão de dependência — detecção via revisão de código

## Related to

- [011 - Open/Closed Principle (OCP)](011_principio-aberto-fechado.md): reinforces
- [015 - Release-Reuse Equivalence Principle (REP)](015_principio-equivalencia-lancamento-reuso.md): reinforces
- [018 - Acyclic Dependencies Principle (ADP)](018_principio-dependencias-aciclicas.md): reinforces
- [019 - Stable Dependencies Principle (SDP)](019_principio-dependencias-estaveis.md): reinforces
- [020 - Stable Abstractions Principle (SAP)](020_principio-abstracoes-estaveis.md): reinforces
- [041 - Explicit Dependency Declaration](041_declaracao-explicita-dependencias.md): complements

---

**Created on**: 2025-10-04
**Updated on**: 2026-07-15
**Version**: 1.2
