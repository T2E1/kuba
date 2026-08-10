# Refused Bequest

**Severidade:** 🟡 Média
**Regra Associada:** Regra 059

## O Que É

Subclasse que herda métodos e dados da classe pai mas não os usa ou não os quer. A subclasse "recusa" a herança, indicando que a hierarquia de herança está errada ou deveria usar composição em vez de herança.

## Sintomas

- Subclasse sobrescreve métodos do pai para lançar `throw new Error('Not supported')`
- Métodos herdados que nunca são chamados na subclasse (60%+ não utilizados)
- Necessidade de verificar `instanceof` para saber o que o objeto suporta
- Subclasse que herda para "reutilizar código" mas não porque é o mesmo tipo
- Implementações vazias (`pass`) ou stubs para métodos herdados que não fazem sentido

## ❌ Exemplo (violação)

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

## ✅ Refatoração

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

## Codetag Sugerido

```typescript
// FIXME: Refused Bequest — ReadOnlyList herda de List mas recusa add/remove
// TODO: Substituir Herança por Composição — criar ReadOnlyList independente
```
