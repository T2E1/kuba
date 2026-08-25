# echo

```js
import Echo, { dispatchEvent } from '@t2e1/kuba/echo'
```

La capa de conexión declarativa. `Echo` convierte una clase en un host que hace
eco de sus propios eventos en un bus compartido y se suscribe a ese bus mediante
**arcos**. Mira [Eventos y Echo](/foundations/events-and-echo) para los
conceptos; esta página es el contrato.

## `Echo(Base)`

Mixin. Devuelve una subclase de `Base` que:

- añade `on` a `observedAttributes`,
- conecta un arco cuando `on` cambia, desconectando el anterior,
- hace eco de cada llamada a `dispatchEvent` en el bus compartido, etiquetada
  con el `id`, el `name` y el nombre de etiqueta del elemento,
- desmonta todos los arcos en `disconnectedCallback`.

```js
class Counter extends Echo(HTMLElement) {}
```

Cada custom element de kuba está construido sobre él, y por eso cualquiera de
ellos puede ser origen o destino de un arco sin configuración extra.

## La gramática del arco

```
origen/evento:tipo/destino|filtro=valor|filtro=valor
```

| Segmento | Acepta | Significado |
|---|---|---|
| `origen` | `*`, `#id`, un `name`, un nombre de etiqueta | De qué elemento escuchar los eventos. No distingue mayúsculas. |
| `evento` | cualquier tipo de evento | El nombre del evento en el bus compartido. |
| `tipo` | `method`, `setter`, `attribute` | Cómo se aplica el payload. |
| `destino` | nombre de método, propiedad o atributo | A qué aplicarlo, en el host. |
| `filtro` | pares `nombre=valor`, separados por `\|` | Transformaciones aplicadas al payload, en orden. |

Los tres valores de `tipo`:

| `tipo` | Efecto en el host |
|---|---|
| `method` | `this[destino](payload)` |
| `setter` | `this[destino] = payload` |
| `attribute` | `this.setAttribute(destino, payload)` |

Un arco que no coincide con la gramática se ignora en silencio — no existe error
de parseo.

## Filtros

Resueltos por nombre mediante el registro [`spark`](/build-elements/spark) y
aplicados de izquierda a derecha, cada uno recibiendo `(payload, value)`.

```html
<kb-text on="user/changed:setter/textContent|prop=email"></kb-text>
```

!> Un nombre de filtro desconocido resuelve a la función identidad en lugar de
lanzar, así que un error de tipeo deja el payload intacto y sin ningún error.

Los filtros son transformaciones síncronas del payload. No pueden retrasar,
descartar ni agrupar una llamada, así que **hacer debounce de un arco no es
posible** — haz el throttle dentro del método de destino.

## `dispatchEvent(eventName)`

Decorator de método o accessor. Vuelve a despachar el valor de retorno del
método decorado — o el nuevo valor del setter — como un `CustomEvent` que
burbujea y es compuesto, una vez que el host está conectado.

```js
@dispatchEvent('clicked')
click() {
  return this.value
}
```

Hace que una propiedad o método sea observable mediante arcos sin escribir
`dispatchEvent` a mano.

## El bus

Los arcos no se suscriben a elementos; se suscriben a un destino compartido en
memoria. Cada host Echo vuelve a despachar sus eventos ahí, envueltos con
información de identidad, y cada arco filtra por su segmento de `origen`.

Dos consecuencias que vale la pena conocer:

- **No hace falta ninguna referencia al elemento.** Un suscriptor puede
  declararse antes de que su origen exista, o en una parte completamente
  distinta del árbol.
- **Los eventos llegan al bus incluso a través de fronteras de shadow**, ya que
  no se trata de propagación del DOM.

!> **El bus es global, y `origen` coincide por identidad, no por proximidad.**
Un arco cuyo origen es `users` se dispara para *todo* elemento de la página
llamado `users` — en otro componente, en otra funcionalidad, en otra instancia
del mismo widget. No existe mecanismo de alcance, así que los nombres tienen que
llevar el alcance por sí mismos: prefíjalos por funcionalidad
(`checkout-items`, no `items`) siempre que una página pueda contener más de una
cosa del mismo tipo.

## Tiempo de vida

Cada arco tiene su propio `AbortController`, guardado por cadena de arco.
Cambiar el atributo `on` aborta la suscripción antigua y crea la nueva;
desconectar el elemento las aborta todas. No hay nada que cancelar manualmente,
y un elemento eliminado no deja ningún listener detrás.
