---
title: "Herança Recusada (Refused Bequest)"
category: "Code Smells"
type: reference
id: "STRUCTURAL-030"
severity: "🟡 Medium"
tags: [code-smells]
---

# Herança Recusada (Refused Bequest)

## Explanation

### O que é

Refused Bequest ocorre quando uma classe herda de outra mas não usa a maioria dos métodos ou atributos herdados. A classe recusa/rejeita a herança que recebe. Indica hierarquia de herança mal modelada — a classe filha não deveria herdar da mãe ou a herança deveria ser composição em vez de herança.

**Sintomas:**

- Subclasse sobrescreve métodos do pai para lançar `throw new Error('Not supported')`
- Métodos herdados que nunca são chamados na subclasse (60%+ não utilizados)
- Necessidade de verificar `instanceof` para saber o que o objeto suporta
- Subclasse que herda para "reutilizar código" mas não porque é o mesmo tipo
- Implementações vazias (`pass`) ou stubs para métodos herdados que não fazem sentido

### Por que importa

- Interface abstrata vazia ou inútil: herança faz classe implementar métodos que não fazem sentido
- Violação de LSP (Princípio de Substituição de Liskov): substituir o pai pelo filho quebra o comportamento esperado
- Complexidade desnecessária: classe filha carrega bagagem inútil da classe pai
- Bugs sutis: métodos não usados podem ser invocados acidentalmente (ex: via reflexão, chamadas super)
- Indica design errado: se não usa a herança, não deveria ter herdado

## How-to

### Exemplo

```javascript
// ❌ ReadOnlyList herda de List mas recusa os métodos de escrita
class List {
  add(item) { this.items.push(item); }
  remove(item) { ... }
  get(index) { return this.items[index]; }
}

class ReadOnlyList extends List {
  add() { throw new Error('Lista somente leitura!'); }    // recusa herança
  remove() { throw new Error('Lista somente leitura!'); } // recusa herança
}
```

```javascript
// ✅ Composição: ReadOnlyList não herda, usa
class ReadOnlyList {
  #items;
  constructor(items) { this.#items = [...items]; }
  get(index) { return this.#items[index]; }
  get length() { return this.#items.length; }
}

// Se precisar de comportamento comum: extrair para helper/mixin
const listBehavior = { iterate() { ... }, map() { ... } };
```

Codetag sugerido para dívida não resolvida agora:

```typescript
// FIXME: Refused Bequest — ReadOnlyList herda de List mas recusa add/remove
// TODO: Substituir Herança por Composição — criar ReadOnlyList independente
```

## Reference

### Critérios Objetivos

- [ ] Classe sobrescreve métodos do pai com exceções (throw UnsupportedOperationException)
- [ ] Classe herda métodos/atributos que nunca são chamados ou usados
- [ ] 60%+ dos métodos/atributos da classe pai nunca são usados na classe filha
- [ ] Classe filha usa apenas 1-2 métodos da classe pai mas herda 10+
- [ ] Implementações vazias (pass) ou stubs para métodos herdados que não fazem sentido

### Exceções Permitidas

- **Interfaces Marcadoras**: Herança de capacidade declarativa, sem comportamento a usar.
- **[Template Method](../skills/gof/references/template-method.md)**: A subclasse sobrescreve o comportamento e herda apenas o contrato.
- **Contratos de Framework**: Quando o método não usado faz parte de interface obrigatória.
- **Código Legado**: Quando a refatoração imediata traria alto risco sem ganho claro.

### Como Detectar

#### Manual

- Ler subclasses: identificar aquelas com muitos métodos sobrescritos vazios ou lançando exceções
- Buscar classes onde apenas 1-2 métodos herdados são realmente usados
- Verificar herança onde subclasse não "comporta-se como um" superclasse (violação semântica)

#### Automático

- Sem regra nativa de Biome para detectar herança recusada — detecção via revisão de código e cobertura de métodos herdados

## Related to

- [Liskov Substitution Principle (LSP)](../skills/solid/SKILL.md): reinforces
- [Single Responsibility Principle (SRP)](../skills/solid/SKILL.md): reinforces
- [Open/Closed Principle (OCP)](../skills/solid/SKILL.md): complements
- [Dependency Inversion Principle (DIP)](../skills/solid/SKILL.md): complements
- [Getters/Setters](../skills/calisthenics/references/getters-setters.md): reinforces
- [Template Method](../skills/gof/references/template-method.md): contrasts — Template Method usa herança de forma legítima; Refused Bequest é herança usada apenas para "roubar" código.
- [031 — Parallel Inheritance Hierarchies](031_hierarquias-heranca-paralelas.md): complements — ambos são sintomas de hierarquias de herança mal modeladas.
- [Strategy](../skills/gof/references/strategy.md): complements — Strategy via composição é a alternativa recomendada quando a herança é recusada.
