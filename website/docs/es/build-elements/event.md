# event

```js
import on, {
  customEvent,
  dataset,
  detail,
  files,
  formData,
  prevent,
  stop,
  value,
} from '@t2e1/kuba/event'
```

Escuchar dentro de tu propio componente, y construir los eventos que publica.
Donde [`echo`](/build-elements/echo) conecta *elementos*, este paquete
conecta un elemento a *su propio* shadow DOM.

## `on.<tipo>(selector, ...filtros)`

Fábrica de decorator de método. `on` es un proxy, así que cualquier tipo de
evento funciona: `on.click`, `on.input`, `on.submit`, `on.clicked`.

```js
@on.input('input', value)
[change](newValue) {
  this.value = newValue
  return this
}
```

| Parámetro | Tipo | Descripción |
|---|---|---|
| `type` | nombre de propiedad | El tipo de evento a escuchar. |
| `selector` | `string` | Se compara con `event.target`; el método solo se ejecuta si coincide. |
| `...filters` | `(event) => unknown` | Se aplican en orden; el resultado es el argumento del método. |

Tres propiedades que definen su comportamiento:

- **El listener está en el `shadowRoot`, no en el host.** Solo ve eventos que
  nacen dentro del componente. Un evento despachado sobre el propio host nunca
  lo activa.
- **Es delegación.** El selector se compara en el momento del despacho, así que
  los elementos añadidos por un repaint posterior quedan cubiertos sin volver a
  enlazar.
- **El desmontaje es automático.** El listener está acotado a un
  `AbortController` que aborta en `disconnectedCallback`.

## Filtros

Cada uno transforma el evento antes de que el método lo reciba. Se componen de
izquierda a derecha.

| Filtro | Produce |
|---|---|
| `value` | `event.target.value` |
| `files` | `event.target.files` |
| `formData` | los datos del formulario, convertidos en un objeto plano |
| `dataset` | `event.target.dataset` |
| `detail` | `event.detail` |
| `prevent` | el evento, tras `preventDefault()` |
| `stop` | el evento, tras `stopPropagation()` |

Una sola declaración puede expresar interceptar-y-parsear:

```js
@on.submit('form', prevent, stop, formData)
[submitted](data) {
  this.dispatchEvent(customEvent('submitted', data))
  return this
}
```

## `customEvent(type, detail?)`

Construye un `CustomEvent` que **burbujea** y es **cancelable**, para que se
comporte como un evento nativo cuando se despacha desde dentro de un shadow
tree.

```js
this.dispatchEvent(customEvent('changed', this.value))
```

| Parámetro | Tipo | Descripción |
|---|---|---|
| `type` | `string` | Nombre del evento. Usa el pasado — mira la [convención de nombres de evento](/foundations/events-and-echo). |
| `detail` | `unknown` | Payload entregado como `event.detail`. |

Prefiere esto a `new CustomEvent`, para que cada evento de la librería lleve las
mismas opciones de propagación.
