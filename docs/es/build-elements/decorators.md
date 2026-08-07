# Decorators

Los decorators son cómo un elemento de kuba declara su comportamiento. Se dividen
en cuatro grupos: **ciclo de vida** (cubierto en
[Ciclo de vida](/es/build-elements/lifecycle)), **escucha**, **middleware** y **disparo**.
Esta página cubre los tres últimos, y cómo escribir los tuyos.

Todos son decorators de método/accesor aplicados a un miembro de clase — sin
registro en runtime, sin contenedor de inyección de dependencias. Cada uno
envuelve una función.

## Escuchar: `@on`

`@on` registra un listener delegado en el **shadow root** del elemento, con el
alcance de un `AbortController` que aborta al desconectarse. Cualquier tipo de
evento funciona — el objeto es un proxy, así que `on.click`, `on.input`,
`on.submit`, `on.clicked` son todos válidos.

```js
import on from '@t2e1/kuba/event'

@on.input('input', value)
[change](newValue) {
  this.value = newValue
  return this
}
```

Léelo así: *cuando un evento `input` se dispare dentro de mi shadow root en algo
que coincida con el selector `input`, pasa el evento por el filtro `value` y
llama a este método con el resultado.*

Tres detalles que importan:

- **El listener vive en `shadowRoot`, no en el host.** Solo ve eventos originados
  dentro del componente. Un evento disparado en el propio host no lo activa.
- **El selector se compara con `event.target`.** Es delegación, así que los
  elementos añadidos por un repaint posterior ya están cubiertos sin volver a
  enlazar nada.
- **El desmontaje es automático.** El controller aborta en
  `disconnectedCallback`.

### Filtros de evento

Los argumentos tras el selector son filtros, aplicados de izquierda a derecha,
cada uno transformando el evento antes de que el método lo reciba:

| Filtro | Convierte el evento en |
|---|---|
| `value` | `event.target.value` |
| `files` | `event.target.files` |
| `formData` | los datos del formulario, parseados en un objeto plano |
| `dataset` | `event.target.dataset` |
| `detail` | `event.detail` |
| `prevent` | el evento, tras `preventDefault()` |
| `stop` | el evento, tras `stopPropagation()` |

Se componen, y así una sola declaración expresa "intercepta el submit nativo, no
dejes que navegue, y entrégame los datos parseados":

```js
@on.submit('form', prevent, stop, formData)
[submitted](data) {
  this.dispatchEvent(customEvent('submitted', data))
  return this
}
```

## Middleware: `@before`, `@after`, `@around`

Envuelven un método o setter con otro método de la misma clase. Existen para que
un componente separe *qué* guarda un setter de *qué más* debe ocurrir cuando eso
cambia.

```js
@attributeChanged('hidden', booleanAttribute)
@around(hideable)
@before(cleanup)
set hidden(value) {
  this.#hidden = value
}
```

- **`@before(método)`** ejecuta `método` primero, de forma síncrona, y su retorno
  se pasa al original — úsalo para normalizar la entrada.
- **`@after(método)`** ejecuta `método` con el resultado del original.
- **`@around(método)`** agenda `método` en un tick posterior con `setImmediate`,
  **descarta su retorno** y devuelve el valor del original sin cambios.

!> `@around` no envuelve la llamada como sugiere el nombre. No corre antes *y*
después, y no puede modificar el retorno — es "y además haz esto, pronto".
Úsalo cuando un cambio de estado tiene un efecto secundario que no debe bloquear
el setter, como reflejar un estado personalizado.

## Disparar: `@dispatchEvent`

Reemite el retorno de un método (o el nuevo valor de un setter) como un
`CustomEvent` que burbujea, una vez que el host está conectado — así una
propiedad se vuelve observable por Echo sin escribir `dispatchEvent` a mano:

```js
import { dispatchEvent } from '@t2e1/kuba/echo'

@dispatchEvent('clicked')
click() {
  return this.value
}
```

## Escribir los tuyos

Un decorator aquí es solo una función que recibe el descriptor y sustituye la
función envuelta. Este registra cada llamada al método que decora:

```js
const logged = (label) => (_target, _key, descriptor) => {
  const original = descriptor.value

  descriptor.value = function (...args) {
    console.log(label, args)
    return original.apply(this, args)
  }
}
```

Si te enganchas a un callback nativo en lugar de a un método, usa el helper
`execute` en vez de sobrescribir el callback — se encadena, así que varios
decorators pueden usar el mismo:

```js
import execute from '@t2e1/kuba/directive'

const ready = (target, method) =>
  execute(method).on(target).after('connectedCallback')
```

Así es exactamente como están implementados `@connected`, `@disconnected`,
`@adopted` y los callbacks de formulario — cada uno son dos líneas sobre
`execute`.

## Un elemento completo

Juntando los grupos: un elemento que renderiza un contador, reacciona a un clic
dentro de su shadow root y publica el nuevo valor como evento.

```js
import { connected, define } from '@t2e1/kuba/directive'
import attributeChanged from '@t2e1/kuba/directive/attributeChanged'
import { paint, repaint } from '@t2e1/kuba/dom'
import Echo, { dispatchEvent } from '@t2e1/kuba/echo'
import on from '@t2e1/kuba/event'
import { html, css } from '@t2e1/kuba/dom'

const component = (counter) => html`<button>${counter.count}</button>`
const style = () => css`:host { display: inline-block; }`

@define('my-counter')
@paint(component, style)
class Counter extends Echo(HTMLElement) {
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

  @on.click('button')
  @dispatchEvent('counted')
  increment() {
    this.count = this.count + 1
    return this.count
  }
}
```

Como extiende `Echo(HTMLElement)`, otro elemento ya puede reaccionar a él solo
desde el markup: `on="my-counter/counted:setter/textContent"`.

## Después

- **[Componentes](/es/components/)** — los elementos construidos con estos
  decorators.
- **[Reference › Packages](/es/build-elements/)** — cada export, por paquete.
