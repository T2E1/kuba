# directive

```js
import {
  adopted,
  attributeChanged,
  connected,
  define,
  disconnected,
  execute,
  formAssociated,
  formDisabled,
  formReset,
  formStateRestore,
} from '@t2e1/kuba/directive'
```

Decorators sobre el ciclo de vida nativo de los custom elements. Cada uno
envuelve un callback en lugar de reemplazarlo, así que varios pueden engancharse
al mismo callback y se encadenan. Mira
[Ciclo de vida](/es/build-elements/lifecycle) para ver cómo encajan.

## `define(name, options?)`

Decorator de clase. Registra la clase en el registro de custom elements,
omitiendo el registro cuando `name` ya existe — así un módulo evaluado dos veces
no lanza.

```js
@define('my-counter')
class Counter extends HTMLElement {}
```

| Parámetro | Tipo | Descripción |
|---|---|---|
| `name` | `string` | Nombre de la etiqueta. Debe contener un guion, por exigencia de la plataforma. |
| `options` | `ElementDefinitionOptions` | Se pasa a `customElements.define`, p. ej. `{ extends: 'button' }`. |

## `attributeChanged(attribute, ...filters)`

Decorator de accessor. Añade `attribute` a `observedAttributes` y sincroniza la
propiedad decorada desde él en cada `attributeChangedCallback`, pasando antes la
cadena cruda por los `filters`, en orden.

```js
@attributeChanged('count')
set count(value) { this.#count = Number(value) }

@attributeChanged('hidden', booleanAttribute)
set hidden(value) { this.#hidden = value }
```

La dirección es solo atributo → propiedad. Establecer la propiedad **no**
escribe el atributo de vuelta.

### Filtros

Importables desde `@t2e1/kuba/directive/attributeChanged`:

| Filtro | Convierte el valor crudo en |
|---|---|
| `booleanAttribute` | `true` cuando el atributo está presente, `false` cuando se elimina |
| `resizing` | una longitud CSS — los valores numéricos px/% pasan tal cual, las palabras clave se normalizan |

## Ganchos de ciclo de vida

Decorators de método. Cada uno ejecuta el método decorado **después** del
callback nativo correspondiente, recibiendo los mismos argumentos.

| Decorator | Se ejecuta después de |
|---|---|
| `connected` | `connectedCallback` |
| `disconnected` | `disconnectedCallback` |
| `adopted` | `adoptedCallback` |
| `formAssociated` | `formAssociatedCallback` |
| `formDisabled` | `formDisabledCallback` |
| `formReset` | `formResetCallback` |
| `formStateRestore` | `formStateRestoreCallback` |

```js
@connected
[slottable]() {
  this.setAttribute('slot', 'helper')
  return this
}
```

Los métodos con clave de símbolo son la convención aquí — mantienen el gancho
fuera de la superficie pública del elemento. Cada paquete define los suyos en un
`interface.js`.

## `execute(method)`

El constructor detrás de todos los ganchos anteriores. Úsalo para escribir el
tuyo:

```js
const ready = (target, method) =>
  execute(method).on(target).after('connectedCallback')
```

| Paso | Argumento | Descripción |
|---|---|---|
| `execute(method)` | `string \| symbol` | El método a invocar en la instancia. |
| `.on(target)` | prototype | Dónde instalar el wrapper. |
| `.after(event)` | `string` | Nombre del callback a envolver. |

Hace proxy del callback existente en lugar de sobrescribirlo, y eso es lo que
hace los ganchos componibles.
