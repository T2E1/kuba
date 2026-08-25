# Ferramentas e fluxos de trabalho

Como um elemento kuba declara seus estilos, o que as ferramentas do
repositório fazem, e como os tipos são publicados sem etapa de build.

## Estilo

Estilos são escritos por elemento num `style.js` e retornados como
`CSSStyleSheet` pelo helper `css`, não como folha global. Cada elemento adota a
sua, isolada pelo shadow DOM.

O único arquivo global é o `dist/kuba.css`, que carrega os design tokens — os
valores contra os quais os padrões de todo elemento resolvem.

## Ferramentas

O que está em `devDependencies` não é para consumir o kuba; é para construí-lo.

| Ferramenta | Papel |
|---|---|
| `vite` | Empacota o `dist/` no `bun run release`. |
| `vitest` + `playwright` | Roda a suíte de testes num Chromium real (`bun run test`). |
| `typescript` | Não compila nada — apenas verifica tipos contra os `types.d.ts` escritos à mão que documentam a superfície pública de cada elemento. |
| `@biomejs/biome` | Lint e formatação (`bun run check`). |
| `husky` + `lint-staged` | Rodam o Biome nos arquivos em stage antes do commit. |
| `commitlint` | Impõe Conventional Commits. |
| `docsify` | Renderiza esta documentação. Carregado de um CDN em runtime — não há etapa de build da doc. |

## Tipos sem etapa de build

kuba entrega tipos, mas nada é escrito em TypeScript. O contrato público de cada
elemento vive num `types.d.ts` escrito à mão ao lado da implementação, e
registra a tag em `HTMLElementTagNameMap`:

```ts
const input = document.querySelector('kb-input') // KUBAInputElement
```

A troca é deliberada. A implementação continua JavaScript puro, que roda no
navegador sem compilação, e a superfície de tipos fica pequena o bastante para
ser escrita à mão — o que também significa que ela descreve o que é *público*,
e não o que a implementação por acaso expõe.
