# Module Pattern

## Problema

Organizar código em unidades com escopo próprio, controlando o que é público e o que
permanece privado, sem poluir o escopo global.

## Como funciona

Cada arquivo ES Module é seu próprio escopo: o que não é `export`ado é privado ao
arquivo. `import` estático é resolvido e *hoisted* antes da execução; `import()` dinâmico
retorna uma Promise resolvida sob demanda.

```javascript
// inventory.js
const cache = new Map();

export function get(sku) {
  return cache.get(sku);
}

export async function refresh() {
  const items = await fetch("/api/inventory").then((r) => r.json());
  cache.clear();
  for (const item of items) cache.set(item.sku, item);
}
```

`cache` é inacessível fora do arquivo; só `get` e `refresh` são superfície pública.

## Quando não aplicar

- Não é uma escolha — é a unidade de organização padrão da linguagem. A pergunta certa
  não é "usar módulos", e sim "o que este módulo exporta" (skill `revelation`).

## Relação com as rules deste repositório

- **031 (Proibição de Imports Relativos)**: o Module Pattern é a base sobre a qual os
  path aliases deste repositório operam — todo módulo é uma unidade endereçável por alias.
- **015/017 (REP/CRP)**: a granularidade do módulo é a granularidade de reuso — um módulo
  que mistura conceitos não relacionados viola esses princípios de pacote.
- **056 (Código Zombie)**: exports nunca importados por ninguém são o sintoma mais direto
  desta rule em nível de módulo.
