# Ciclo de vida

Un elemento de kuba no tiene bucle de render ni sistema de reactividad. Lo que
tiene es el ciclo de vida nativo de custom element, más cuatro decorators que
deciden *cuándo* se escribe su shadow DOM. Entender esos cuatro es la mayor parte
de entender la biblioteca.

## El ciclo nativo, sin cambios

kuba no sustituye los callbacks de la plataforma — los envuelve. Un elemento
sigue pasando por:

| Callback | Se dispara cuando |
|---|---|
| `constructor` | el elemento se crea o se actualiza |
| `connectedCallback` | se inserta en el documento |
| `attributeChangedCallback` | cambia un atributo observado |
| `disconnectedCallback` | se elimina del documento |

Cada decorator de abajo se engancha a uno de ellos. Nada agenda trabajo por su
cuenta fuera de ahí, y no hay un scheduler en el que pensar.

## Registrar: `@define`

```js
@define('my-counter')
class Counter extends HTMLElement {}
```

`@define` registra la clase en el registro de custom elements — y omite el
registro si la etiqueta ya existe, así que un módulo evaluado dos veces (dos
copias empaquetadas, un hot reload) no lanza error.

Nada ocurre en el momento de la definición más allá del registro. Los elementos
ya presentes en la página se actualizan en ese instante; los añadidos después, al
insertarse.

## Pintar: `@paint`

```js
@define('my-counter')
@paint(component, style)
class Counter extends HTMLElement {}
```

`@paint` recibe una función **component** (devuelve la cadena de markup) y
cualquier número de funciones **style** (cada una devuelve un `CSSStyleSheet`), y
envuelve `connectedCallback` para que, tras ejecutarse tu propia lógica de
conexión, el elemento:

1. Ejecute `willPaintCallback`, si la clase define uno.
2. Escriba el markup en `shadowRoot.innerHTML` y adopte las hojas de estilo —
   ambos diferidos al mismo `requestAnimationFrame`, para caer en el mismo
   fotograma en lugar de forzar layout a mitad del callback.
3. Se marque como pintado.
4. Ejecute `didPaintCallback`, si la clase define uno.

Ambas funciones reciben el elemento, que es como el markup y los estilos leen sus
atributos actuales:

```js
const component = (button) => html`<button>${button.label}</button>`
const style = (button) => css`:host { width: ${button.width}; }`
```

?> **El shadow root no existe hasta ese fotograma.** Es la sorpresa más común:
consultar `shadowRoot.querySelector('button')` de forma síncrona dentro de
`connectedCallback` devuelve `null`. Espera la pintura — en pruebas, con
`waitFor`; en código, con `didPaintCallback`.

## Repintar: `@repaint` y `@retouch`

Un setter decorado con `@repaint` vuelve a ejecutar la pintura completa — markup
y estilos — después de que el setter retorna:

```js
@attributeChanged('use')
@repaint
set use(value) {
  this.#use = value
}
```

`@retouch` es la mitad barata: reproduce **solo** la hoja de estilo, dejando el
markup intacto. Úsalo cuando una propiedad afecta a la apariencia pero no a la
estructura:

```js
@attributeChanged('size')
@retouch
set size(value) {
  this.#size = value
}
```

`<kb-icon>` usa ambos, y la división muestra por qué están separados: `use`
cambia el glifo renderizado, así que repinta; `size` y `color` solo alimentan
custom properties, así que retocan. Repintar por un cambio de color reescribiría
el DOM para nada.

Tres propiedades de este diseño que conviene conocer:

- **Ambos se agrupan.** El trabajo se agenda con `setImmediate`, así que el
  setter decorado retorna de forma síncrona y varias escrituras en la misma tarea
  colapsan en una sola pintura.
- **Ambos están protegidos por la bandera de pintado.** Escribir una propiedad
  antes de la primera pintura no dispara un render redundante — la pintura
  inicial recogerá el valor de todos modos.
- **Ninguno es reactivo.** Nada rastrea lo que leyó el markup. El decorator
  vuelve a ejecutar la función de componente entera; no hace diff.

## Reaccionar a atributos: `@attributeChanged`

```js
@attributeChanged('width')
set width(value) {
  this.#width = value
}
```

Esto añade el atributo a `observedAttributes` y sincroniza la propiedad desde él
en cada `attributeChangedCallback`. Los filtros opcionales transforman la cadena
cruda antes — `booleanAttribute` convierte la presencia en `true`:

```js
@attributeChanged('hidden', booleanAttribute)
set hidden(value) {
  this.#hidden = value
}
```

La dirección es atributo → propiedad. Asignar la propiedad directamente **no**
escribe el atributo de vuelta.

## Enganchar conexión y desconexión: `@connected`, `@disconnected`

```js
@connected
[slottable]() {
  this.setAttribute('slot', 'helper')
  return this
}
```

Ejecutan un método *después* del callback nativo correspondiente, sin sobrescribir
una implementación que ya exista — varios decorators pueden engancharse al mismo
callback y se encadenan. `<kb-helper>` usa `@connected` para asignarse su propio
slot, que es por lo que anidar uno dentro de un campo es toda la conexión
necesaria.

`@disconnected` es donde pertenece la limpieza. Los controles de formulario
abortan ahí un `AbortController`, lo que da de baja de una vez todos los
listeners que registraron en el formulario propietario.

Hay directivas equivalentes para el resto de callbacks de la plataforma:
`@adopted`, `@formAssociated`, `@formDisabled`, `@formReset` y
`@formStateRestore`.

## Todo junto

```js
import { attributeChanged, connected, define } from '@t2e1/kuba/directive'
import { paint, repaint } from '@t2e1/kuba/dom'

@define('my-counter')
@paint(component, style)
class Counter extends HTMLElement {
  #count

  get count() {
    return (this.#count ??= 0)
  }

  @attributeChanged('count')
  @repaint
  set count(value) {
    this.#count = Number(value)
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  @connected
  [ready]() {
    // Se ejecuta tras connectedCallback, antes de que caiga la primera pintura.
    return this
  }
}
```

El orden para un elemento que entra en la página: constructor →
`attributeChangedCallback` por cada atributo presente → `connectedCallback` → tus
ganchos `@connected` → `willPaintCallback` → markup y estilos escritos en un
fotograma → bandera de pintado → `didPaintCallback`.

## Después

- **[Eventos y Echo](/es/foundations/events-and-echo)** — cómo se comunican los
  elementos una vez en pantalla.
- **[Decorators](/es/build-elements/decorators)** — escribir los tuyos, y los decorators
  de middleware (`@before`, `@after`, `@around`).
