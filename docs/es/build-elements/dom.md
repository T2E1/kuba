# dom

```js
import { css, html, paint, repaint, retouch } from '@t2e1/kuba/dom'
```

Renderizado. `paint` escribe el shadow DOM de un elemento una vez, al conectar;
`repaint` y `retouch` programan actualizaciones después. Mira
[Ciclo de vida](/es/build-elements/lifecycle) para la secuencia.

## `paint(component, ...styles)`

Decorator de clase. Envuelve `connectedCallback` para que, tras ejecutarse la
lógica de conexión del propio elemento, se escriba su shadow DOM.

```js
@define('my-counter')
@paint(component, style)
class Counter extends HTMLElement {}
```

| Parámetro | Tipo | Devuelve |
|---|---|---|
| `component` | `(element) => string` | El markup a escribir dentro del shadow root. |
| `...styles` | `(element) => CSSStyleSheet` | Hojas de estilos adoptadas por el shadow root. |

Ambos reciben el elemento, y así es como el markup y los estilos leen sus
atributos actuales. La secuencia por paint:

1. `willPaintCallback`, si está definido en la clase.
2. Markup y estilos escritos — ambos diferidos al mismo
   `requestAnimationFrame`, así que caen en un mismo frame.
3. Se marca la bandera de pintado.
4. `didPaintCallback`, si está definido.

!> **El shadow root está vacío hasta ese frame.** Consultarlo de forma síncrona
en `connectedCallback` devuelve `null`. Usa `didPaintCallback`, o espera un
frame.

## `repaint`

Decorator de método o accessor. Vuelve a ejecutar el paint completo — markup y
estilos — después de que la función decorada retorna.

```js
@attributeChanged('use')
@repaint
set use(value) { this.#use = value }
```

## `retouch`

La mitad más barata: reproduce **solo** la hoja de estilos, dejando el markup
intacto. Para propiedades que afectan a la apariencia, pero no a la estructura.

```js
@attributeChanged('size')
@retouch
set size(value) { this.#size = value }
```

`<kb-icon>` usa ambos, y la división muestra por qué: `use` cambia el glifo
renderizado, así que repinta; `size` y `color` solo alimentan el CSS, así que
retocan.

Ambos comparten tres propiedades:

- **Agrupados.** El trabajo se programa con `setImmediate`, así que la función
  decorada retorna de forma síncrona y varias escrituras en una misma tarea
  colapsan en un único paint.
- **Protegidos.** Escribir una propiedad antes del primer paint no dispara un
  renderizado redundante.
- **No reactivos.** Nada rastrea lo que leyó el markup; la función de componente
  entera se vuelve a ejecutar. No hay diffing.

## `html` y `css`

Plantillas literales con tag. `html` devuelve una cadena de markup; `css`
devuelve un `CSSStyleSheet` listo para adoptar.

```js
const component = (button) => html`<button>${button.label}</button>`
const style = (button) => css`
  :host { width: ${button.width}; }
`
```

La interpolación es sustitución pura de cadenas — **los valores no se escapan**.
Nunca interpoles entrada no confiable dentro de `html`.

## Callbacks de ciclo de vida

Métodos opcionales que una clase pintada puede definir. Se buscan por símbolo,
así que importa las claves cuando los implementes:

| Símbolo | Se ejecuta |
|---|---|
| `willPaintCallback` | antes de cada paint |
| `didPaintCallback` | después de que cada paint se asienta |
| `isPainted` | bandera, legible para saber si el primer paint terminó |

`htmlCallback` y `cssCallback` son internos — guardados en la instancia por
`paint` para que `repaint` y `retouch` puedan reproducir exactamente el mismo
trabajo.
