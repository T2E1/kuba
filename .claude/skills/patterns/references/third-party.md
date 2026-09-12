# Optimize Loading Third-Parties

## Problema

Scripts de terceiros (analytics, chat, ads) causam requisições extras, JavaScript
pesado e comportamento imprevisível, prejudicando Core Web Vitals.

## Como funciona

Duas estratégias: **remover/substituir** (avaliar se o valor justifica o custo) ou
**otimizar a sequência** — `async`/`defer`, resource hints (`dns-prefetch`,
`preconnect`), lazy-load de embeds abaixo da dobra, self-hosting para controlar cache, ou
executar em web worker (Partytown).

```html
<link rel="preconnect" href="https://example.com" />
<script src="https://example.com/gtm.js" async></script>
```

## Quando não aplicar

- Scripts de teste A/B ou personalização geralmente exigem execução síncrona antes do
  paint — otimizar aqui é trade-off, não ganho livre.

## Relação com as rules deste repositório

- **067 (Boat Anchor)**: script de terceiro carregado "porque sempre foi assim", sem uso
  medido, é a mesma dependência-âncora que essa rule proíbe em nível de código.
