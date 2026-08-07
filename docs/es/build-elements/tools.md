# Herramientas y flujos de trabajo

Cómo un elemento kuba declara sus estilos, qué hacen las herramientas del
repositorio, y cómo se publican los tipos sin paso de build.

## Estilos

Los estilos se escriben por elemento en un `style.js` y se devuelven como
`CSSStyleSheet` mediante el helper `css`, no como hoja global. Cada elemento
adopta la suya, aislada por el shadow DOM.

El único archivo global es `dist/kuba.css`, que lleva los design tokens — los
valores contra los que resuelven los valores por defecto de cada elemento.

## Herramientas

Lo que vive en `devDependencies` no es para consumir kuba; es para construirlo.

| Herramienta | Rol |
|---|---|
| `vite` | Empaqueta `dist/` en `bun run release`. |
| `vitest` + `playwright` | Ejecutan la suite de pruebas en un Chromium real (`bun run test`). |
| `typescript` | No compila nada — solo verifica tipos contra los `types.d.ts` escritos a mano que documentan la superficie pública de cada elemento. |
| `@biomejs/biome` | Lint y formato (`bun run check`). |
| `husky` + `lint-staged` | Ejecutan Biome sobre los archivos en stage antes del commit. |
| `commitlint` | Impone Conventional Commits. |
| `docsify` | Renderiza esta documentación. Se carga desde un CDN en runtime — no hay paso de build de la documentación. |

## Tipos sin paso de build

kuba entrega tipos, pero nada está escrito en TypeScript. El contrato público de
cada elemento vive en un `types.d.ts` escrito a mano junto a la implementación,
y registra la etiqueta en `HTMLElementTagNameMap`:

```ts
const input = document.querySelector('kb-input') // KUBAInputElement
```

El intercambio es deliberado. La implementación sigue siendo JavaScript puro que
se ejecuta en un navegador sin compilación, y la superficie de tipos queda lo
bastante pequeña como para escribirse a mano — lo que además significa que
describe lo que es *público*, y no lo que la implementación expone por
casualidad.
