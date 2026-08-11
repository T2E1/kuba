# Proibição de Herança Recusada

**ID**: STRUCTURAL-059
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

- **Interfaces Marcadoras**: Herança de capacidade declarativa, sem comportamento a usar.
- **Template Method**: A subclasse sobrescreve o comportamento e herda apenas o contrato.
- **Contratos de Framework**: Quando o método não usado faz parte de interface obrigatória.
- **Código Legado**: Quando a refatoração imediata traria alto risco sem ganho claro.

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
**Updated on**: 2026-08-10
**Version**: 1.3
