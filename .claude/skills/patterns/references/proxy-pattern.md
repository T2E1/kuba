# Proxy Pattern

## Problema

Controlar o acesso a um objeto — interceptar leitura, escrita ou chamada — sem alterar o
objeto original: validação, log, formatação transparente, proteção contra propriedade
inexistente.

## Como funciona

`new Proxy(target, handler)` intercepta operações via `handler.get`, `handler.set` e
demais *traps*, delegando ao objeto real quando não há nada a customizar.

```javascript
const personProxy = new Proxy(person, {
  get: (obj, prop) => obj[prop],
  set: (obj, prop, value) => {
    if (prop === "age" && typeof value !== "number") {
      throw new TypeError("age deve ser number");
    }
    obj[prop] = value;
    return true;
  },
});
```

## Quando não aplicar

- Em caminho quente de execução: cada acesso passa pelo *trap*, e o custo é mensurável
  sob profiling (rule 069 — otimização prematura ao evitar, mas também ao usar sem medir).
- Quando o objetivo é só formatar uma leitura — um getter com lógica resolve mais simples
  (skill `getter`).

## Relação com as rules deste repositório

- **052 (Mutação Acidental)**: o trap `set` é o lugar certo para normalizar ou congelar
  antes de aceitar a mutação.
- **009 (Tell, Don't Ask)**: um Proxy que só expõe leitura ainda é "perguntar" — prefira
  método de intenção quando o cliente decide algo com o valor lido.
- **036 (Efeitos Colaterais)**: o trap `get` não deveria mutar o objeto interceptado;
  isso o transforma em Query com efeito colateral, violando CQS (rule 038).
