# Dynamic Import

## Problema

Reduzir o bundle inicial evitando carregar módulos que só são necessários sob demanda.

## Como funciona

`import()` retorna uma Promise e suspende o módulo até ser chamado — em vez de
`import` estático, que entra sempre no bundle inicial (ver [static-import.md](static-import.md)).

```javascript
button.addEventListener("click", async () => {
  const { default: sortBy } = await import("lodash.sortby");
  sortBy(items, "name");
});
```

## Quando não aplicar

- Se o módulo é necessário na renderização inicial — import dinâmico introduz latência
  perceptível exatamente onde o static import é mais simples e mais rápido.

## Relação com as rules deste repositório

- **031 (Imports Relativos)**: `import()` dinâmico ainda exige path alias — a regra vale
  igual para import estático e dinâmico.
- Ver [import-on-visibility.md](import-on-visibility.md) e
  [import-on-interaction.md](import-on-interaction.md) para os dois gatilhos mais comuns
  de quando disparar o import dinâmico.
