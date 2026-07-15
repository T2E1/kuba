# Proibição de Herança Recusada

**ID**: AP-17-059
**Severity**: 🟡 Medium
**Category**: Structural

---

## What it is

Refused Bequest ocorre quando uma classe herda de outra mas não usa a maioria dos métodos ou atributos herdados. A classe recusa/rejeita a herança que recebe. Indica hierarquia de herança mal modelada — a classe filha não deveria herdar da mãe ou a herança deveria ser composição em vez de herança.

## Why it matters

- Interface abstrata vazia ou inútil: herança faz classe implementar métodos que não fazem sentido
- Violação de LSP (Princípio de Substituição de Liskov): substituir o pai pelo filho quebra o comportamento esperado
- Complexidade desnecessária: classe filha carrega bagagem inútil da classe pai
- Bugs sutis: métodos não usados podem ser invocados acidentalmente (ex: via reflexão, chamadas super)
- Indica design errado: se não usa a herança, não deveria ter herdado

## Objective Criteria

- [ ] Classe sobrescreve métodos do pai com exceções (throw UnsupportedOperationException)
- [ ] Classe herda métodos/atributos que nunca são chamados ou usados
- [ ] 60%+ dos métodos/atributos da classe pai nunca são usados na classe filha
- [ ] Classe filha usa apenas 1-2 métodos da classe pai mas herda 10+
- [ ] Implementações vazias (pass) ou stubs para métodos herdados que não fazem sentido

## Allowed Exceptions

- Interfaces marcadoras onde subclasse intencionalmente herda "capacidade" mesmo se não usada
- Padrões de template method abstrato onde subclasse sobrescreve maior parte do comportamento mas herda contrato
- Classes de framework onde métodos não usados fazem parte de interface obrigatória
- Código legado onde refatoração imediata traria alto risco sem ganho claro

## How to Detect

### Manual

- Ler subclasses: identificar aquelas com muitos métodos sobrescritos vazios ou lançando exceções
- Buscar classes onde apenas 1-2 métodos herdados são realmente usados
- Verificar herança onde subclasse não "comporta-se como um" superclasse (violação semântica)

### Automatic

- Sem regra nativa de Biome para detectar herança recusada — detecção via revisão de código e cobertura de métodos herdados

## Related to

- [012 - Liskov Substitution Principle (LSP)](012_principio-substituicao-liskov.md): reinforces
- [010 - Single Responsibility Principle (SRP)](010_principio-responsabilidade-unica.md): reinforces
- [011 - Open/Closed Principle (OCP)](011_principio-aberto-fechado.md): complements
- [014 - Dependency Inversion Principle (DIP)](014_principio-inversao-dependencia.md): complements
- [008 - Prohibition of Getters/Setters](008_proibicao-getters-setters.md): reinforces

---

**Created on**: 2026-03-28
**Updated on**: 2026-07-15
**Version**: 1.1
