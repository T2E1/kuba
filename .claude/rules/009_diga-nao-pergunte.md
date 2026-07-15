# Aplicação do Princípio do "Diga, Não Pergunte" (Law of Demeter)

**ID**: BEHAVIORAL-009
**Severity**: 🔴 Critical
**Category**: Behavioral

---

## What it is

Exige que um método chame métodos ou acesse propriedades apenas de seus "vizinhos imediatos": o próprio objeto, objetos passados como argumento, objetos que ele cria ou objetos que são propriedades internas diretas.

*(Previne o anti-pattern Message Chains / Train Wreck: ao dizer ao objeto o que fazer em vez de navegar sua estrutura interna via getters encadeados.)*

## Why it matters

- Acoplamento alto e transitivo torna o código frágil a mudanças internas distantes
- Obscurece a responsabilidade de cada objeto na cadeia
- Dificulta testes, pois é preciso simular objetos aninhados inteiros
- Viola o encapsulamento ao expor a estrutura interna via getters encadeados

## Objective Criteria

- [ ] Um método deve evitar chamar métodos de um objeto retornado por outro método (ex: `a.getB().getC().f()`).
- [ ] A chamada de métodos deve ser restrita aos objetos que o método tem conhecimento direto.
- [ ] O objeto cliente deve *dizer* ao objeto dependente o que fazer, em vez de *perguntar* pelo estado interno para tomar uma decisão.

## Allowed Exceptions

- **Padrões de Interface Fluida (Chaining)**: Desde que o método retorne `this` (ou a mesma interface), como em Builders.
- **Acesso a DTOs/Value Objects**: Acesso a dados de objetos que são puramente recipientes de dados.

## How to Detect

### Manual

- Buscar encadeamento de chamadas (*dot-chaining*) com três ou mais chamadas consecutivas, indicando conhecimento de objetos aninhados

### Automatic

- Sem regra nativa de Biome equivalente à Lei de Demeter — detecção via revisão de código

## Related to

- [008 - Prohibition of Getters/Setters](008_proibicao-getters-setters.md): reinforces
- [005 - Method Chaining Restriction](005_maximo-uma-chamada-por-linha.md): reinforces
- [012 - Liskov Substitution Principle (LSP)](012_principio-substituicao-liskov.md): reinforces
- [003 - Primitive Domain Encapsulation](003_encapsulamento-primitivos.md): reinforces
- [004 - First-Class Collections](004_colecoes-primeira-classe.md): complements
- [018 - Acyclic Dependencies Principle (ADP)](018_principio-dependencias-aciclicas.md): reinforces
- [057 - Prohibition of Feature Envy](057_proibicao-feature-envy.md): complements

---

**Created on**: 2025-10-04
**Updated on**: 2026-07-15
**Version**: 1.1
