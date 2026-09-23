# mixin

```js
import { Headless, Height, Hidden, Identity, Template, Value, Width } from '@t2e1/kuba/mixin'
```

Comportamiento de atributo reutilizable. Cada mixin recibe una clase y devuelve
una subclase que añade una propiedad respaldada por un atributo — compuestos en
cadena:

```js
class Stack extends Hidden(Width(Height(Echo(HTMLElement)))) {}
```

El orden solo importa en que cada uno envuelve al anterior; las propiedades no
interactúan entre sí.

## `Hidden(Base)`

Añade `hidden`, reflejado desde el atributo `hidden`, y lo refleja en
`internals.states` como un custom state `hidden`.

```css
:host(:state(hidden)) { display: none; }
```

El mixin establece el estado; **es la hoja de estilos del propio elemento la que
decide qué significa eso**. Cada elemento kuba que lo usa aplica `display:
none`, pero el mixin no lo impone.

Poner `hidden = false` también elimina el atributo, así que el DOM se mantiene
consistente con la propiedad.

| Miembro | Tipo | Por defecto |
|---|---|---|
| `hidden` | `boolean` | `false` |

Requiere que el host exponga `internals` (un `ElementInternals`) mediante un
getter perezoso.

## `Identity(Base)`

Da al elemento una identidad en el árbol de accesibilidad: el **rol** que
cumple y — para elementos sin texto legible propio — el **nombre** por el que
responde. Sin esto, un custom element es una caja anónima: `<kb-progress
value="40">` no anuncia nada en absoluto.

A diferencia de los demás mixins, el rol no es un atributo. El elemento lo
declara implementando `[role]`, que el mixin lee al conectar:

```js
import { Identity, role } from '@t2e1/kuba/mixin'

class Progress extends Identity(Echo(HTMLElement)) {
  get [role]() {
    return 'progressbar'
  }
}
```

`role` es un `Symbol.for`, así que el elemento que lo declara y el mixin que lo
lee coinciden en la misma clave incluso empaquetados por separado.

El nombre viene del atributo `alt`, para elementos cuyo contenido es un glifo en
lugar de texto:

```html
<kb-button variant="icon" alt="Eliminar">
  <kb-icon use="delete"></kb-icon>
</kb-button>
```

Usa `alt` solo donde no hay texto visible. Cuando el elemento tiene una etiqueta
que se ve, usa `<kb-label>` — poner ambos hace que el nombre anunciado difiera
del escrito, lo que rompe el control por voz.

| Miembro | Tipo | Por defecto |
|---|---|---|
| `alt` | `string` | `''` |
| `[role]` | `string` | — (lo declara el elemento) |

Ambos se publican como **semántica por defecto** en `ElementInternals`, así que
un `role` o `aria-label` escrito en el markup gana — el elemento entrega
valores correctos sin quitarle la decisión a quien lo consume.

Requiere que el host exponga `internals`, como `Hidden`. El mixin nunca llama a
`attachInternals()` por su cuenta: solo se permite llamarlo una vez por
elemento, así que esa llamada pertenece al elemento.

## `Headless(Base)`

Oculta el elemento incondicionalmente, aplicándole `display: none` una vez
conectado. Para elementos que guardan o piden datos y no renderizan nada —
`<kb-fetch>`, `<kb-dataset>`, `<kb-filter>`, `<kb-find>`, `<kb-headers>`,
`<kb-on>`, `<kb-redirect>`.

No añade atributo ni propiedad. No hay nada que configurar: un elemento que lo
usa es invisible por construcción.

## `Width(Base)` y `Height(Base)`

Añaden `width` y `height`, reflejados desde los atributos correspondientes y
aplicados directamente al host. Ambos usan `@retouch`, así que un cambio de
tamaño reproduce solo la hoja de estilos, no el markup.

| Miembro | Tipo | Por defecto |
|---|---|---|
| `width` | `string` | `'auto'` |
| `height` | `string` | `'auto'` |

Los valores pasan por un filtro `resizing`: los valores numéricos en px/% se
usan tal cual, y las palabras clave `fill` y `hug` se normalizan a `100%` y
`auto`.

## `Value(Base)`

Añade `value`, mantenido en sincronía con el atributo `value`. Sin valor por
defecto, sin transformación — el más simple del conjunto, para elementos cuyo
payload es una sola cadena.

| Miembro | Tipo | Por defecto |
|---|---|---|
| `value` | `string \| undefined` | `undefined` |

## `Template(Base)`

Añade `template`, que resuelve al markup de un `<template>` — ya sea el hijo del
propio elemento, o uno referenciado por id mediante el atributo `template`.

```html
<kb-render>
  <template>{name}</template>
</kb-render>

<kb-render template="shared-row"></kb-render>
```

Leer la propiedad devuelve el `innerHTML` de la plantilla, con reserva al
`outerHTML` concatenado de sus hijos.

!> **Los frameworks que crean el `<template>` en JavaScript pueden romper
esto.** React añade los hijos de la plantilla a la lista de hijos del propio
elemento en lugar de a su fragmento `content`, lo que deja el `innerHTML` vacío.
La reserva cubre el caso de los elementos, pero descarta los nodos de texto y
los espacios entre elementos. Leer la propiedad antes de que exista el contenido
de la plantilla no devuelve nada, y nada vuelve a leerla después.

| Miembro | Tipo | Descripción |
|---|---|---|
| `template` | `string` | El markup resuelto. Establecer el atributo apunta a un `<template>` por id. |
