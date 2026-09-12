# PRPL Pattern

## Problema

Experiência lenta de carregamento em rede móvel, causada por uma cadeia de idas e
vindas sequenciais entre navegador e servidor.

## Como funciona

Quatro pilares: **Push** (entregar recursos críticos via `preload`/`modulepreload` ou
`103 Early Hints`), **Render** (priorizar LCP via SSR/streaming e code splitting por
rota), **Pre-cache** (service worker com estratégia de cache), **Lazy-load** (adiar o
resto via `import()` dinâmico e `loading="lazy"`).

```javascript
registerRoute(
  ({ request }) => request.destination === "script",
  new StaleWhileRevalidate({ cacheName: "scripts" })
);
```

## Quando não aplicar

- A nomenclatura é de 2016; hoje as métricas de referência são Core Web Vitals, não
  "time-to-interactive" isolado. Use o pattern como checklist de pilares, não como
  receita literal.

## Relação com as rules deste repositório

- Combina [preload.md](preload.md), [dynamic-import.md](dynamic-import.md) e
  [bundle-splitting.md](bundle-splitting.md) como peças táticas dentro da estratégia.
