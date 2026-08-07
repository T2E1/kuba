# Tecnología

kuba está escrito en JavaScript puro, con **cero dependencias de runtime**.
Revisa el `package.json`: la sección `dependencies` está vacía.

No fue por falta de opciones. Se desprende de los
[principios](/es/foundations/principles):

1. **Los Web Components son nativos.** No necesitan un framework para existir ni
   para registrarse.
2. **Una dependencia menos es una cadena de suministro menos** que auditar,
   actualizar y ver romperse en producción.
3. **Una curva de aprendizaje más suave.** Quien conoce el DOM y `CustomEvent`
   ya puede leer el código de kuba.
4. **Todo desarrollador front-end sabe JavaScript**, sea cual sea el framework
   del día a día.

## Las APIs nativas en las que se apoya

Ninguna es una dependencia instalable. Son capacidades que el navegador ya trae,
y que kuba expone mediante una API declarativa en lugar de esconder tras una
abstracción propia.

| API | Se usa para |
|---|---|
| **Custom Elements** | Cada etiqueta `<kb-*>`, registrada por el decorator `define`. |
| **Shadow DOM** | El markup y los estilos de cada elemento, aislados de la página. |
| **Constraint Validation API** | Validación nativa en `<kb-input>`, `<kb-textarea>`, `<kb-fileupload>`. |
| **`ElementInternals`** | Asociación a formulario y estados personalizados (`:state(invalid)`, `:state(hidden)`) sin reimplementar la semántica de `<form>`. |
| **`CustomEvent`** | Todo el bus de Echo. Los elementos se comunican como el DOM ya lo hace. |
| **Constructable stylesheets** | `adoptedStyleSheets`, para que una hoja se parsee una vez y se comparta entre instancias. |
| **History API** | Navegación en el cliente en `router` y `<kb-redirect>`. |
| **CSS `light-dark()`** | Valores claro y oscuro en un solo token de color, resueltos por el `color-scheme` de la página. |
| **CSS custom properties** | Toda la superficie de temas, heredando a través del shadow boundary. |

El único shim del código es `setImmediate`, usado para agrupar repintados —
unas pocas líneas, no una biblioteca.

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

## Cómo se construye esta documentación

Este sitio es markdown renderizado por docsify en el navegador, y carga kuba
**desde el CDN en una versión fijada** — las mismas dos etiquetas que
escribiría cualquier consumidor.

No es un detalle: cada ejemplo en vivo de este sitio se ejecuta contra el
paquete publicado. Si una versión se rompe, la documentación se rompe de forma
visible, en lugar de pasar en verde contra código fuente que solo existe en la
máquina de quien desarrolla.
