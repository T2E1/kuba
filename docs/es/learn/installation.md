# Instalación

kuba se distribuye como módulos ES y no requiere paso de build. Elige la
configuración que encaje con tu proyecto.

## Desde un CDN

El camino más rápido, y el que usa esta misma documentación: dos etiquetas en tu
página, sin herramientas.

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@t2e1/kuba@0.1.0-alpha.33/dist/kuba.css"
/>
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/@t2e1/kuba@0.1.0-alpha.33/dist/kuba.js"
></script>
```

La hoja de estilo lleva los design tokens (`--color-*`, `--spacing-*`,
`--font-size-*`…) contra los que resuelven los valores por defecto de cada
componente. Sin ella, los componentes se renderizan sin estilo — referencian
tokens que no existen.

El script registra todos los custom elements. Es un módulo, así que ya viene
diferido por defecto, y los elementos se actualizan en cuanto se evalúa, estén en
el HTML inicial o añadidos después.

?> **Fija la versión.** kuba está en alpha y los cambios incompatibles salen con
frecuencia — nombres de evento y de etiqueta ya han cambiado. `@latest` significa
que tu página cambia sin que la toques.

## Desde npm

```bash
npm install @t2e1/kuba
```

Importa la biblioteca completa, lo que registra todos los elementos:

```js
import '@t2e1/kuba'
import '@t2e1/kuba/dist/kuba.css'
```

O importa solo los paquetes primitivos que necesites, sin registrar ningún
elemento:

```js
import { define, connected } from '@t2e1/kuba/directive'
import { paint, repaint } from '@t2e1/kuba/dom'
import { Hidden, Width } from '@t2e1/kuba/mixin'
```

Los subcaminos exportados son `cookie`, `directive`, `dom`, `echo`, `event`,
`middleware`, `mixin`, `renderer`, `result`, `router` y `spark`. Ve
**[Reference › Packages](/es/build-elements/)** para saber qué contiene cada uno.

## Verificar la instalación

Pon esto en una página. Si ves un botón que registra el clic, todo está
conectado.

```html preview
<kb-button id="ping" value="pong">Haz clic</kb-button>
<kb-text id="ping-output" size="xxs" color="master">aún sin clic</kb-text>

<script type="module">
  const button = document.querySelector('#ping')
  const output = document.querySelector('#ping-output')
  button.addEventListener('clicked', (event) => {
    output.textContent = `clic, detail: ${event.detail}`
  })
</script>
```

Si el botón aparece como texto plano en lugar de un control con estilo, el script
no cargó o aún no se evaluó. Si aparece sin estilo — forma correcta, colores y
espaciado equivocados — falta la hoja de estilo.

## Soporte de navegadores

kuba usa custom elements, shadow DOM, `ElementInternals`, estados personalizados
(`:state()`) y constructable stylesheets, sin polyfill para ninguno de ellos más
allá de un pequeño shim de `setImmediate`. Eso significa Chrome, Edge, Firefox y
Safari actuales. No hay build legado, y no lo habrá — la biblioteca existe para
usar esas APIs, no para abstraer su ausencia.

## TypeScript

Los tipos están escritos a mano y vienen en el paquete. El contrato público de
cada elemento vive en su propio `types.d.ts`, y la etiqueta se registra en
`HTMLElementTagNameMap`, así que `document.querySelector('kb-input')` ya viene
tipado sin configuración extra.
