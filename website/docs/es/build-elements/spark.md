# spark

```js
import spark, { equals, gt, len, not, prop, truthy } from '@t2e1/kuba/spark'
```

El registro de operadores detrás de los filtros de arco de
[Echo](/build-elements/echo). Cada operador es una función pura de
`(data, value)` que transforma un payload en su camino de un publicador a un
destino.

```html
<kb-text on="user/changed:setter/textContent|prop=email"></kb-text>
```

## El registro

| Nombre | `(data, value)` devuelve |
|---|---|
| `prop` | `data[value]` — la propiedad nombrada del payload |
| `equals` | si `data` es igual a `value` |
| `different` | si `data` difiere de `value` |
| `not` | la negación de `data` |
| `truthy` | si `data` es truthy |
| `len` | la longitud de `data` |
| `add` / `subtract` | `data` más / menos `value` |
| `inc` / `dec` | `data` incrementado / decrementado |
| `gt` / `gte` | si `data` es mayor que / al menos `value` |
| `lt` / `lte` | si `data` es menor que / como máximo `value` |
| `always` | `value`, ignorando `data` |

Cada uno también es importable directamente, para usarlo fuera de un arco.

## `spark.get(name)`

Resuelve un operador por su nombre.

!> **Un nombre desconocido resuelve a la función identidad**, no a un error. Eso
es lo que hace silencioso un error de tipeo en un filtro de arco: el payload
pasa intacto y nada lo reporta.

## `spark.set(name, fn)`

Registra un operador, o reemplaza uno existente. Devuelve `spark`, así que los
registros se encadenan.

```js
import spark from '@t2e1/kuba/spark'

spark
  .set('uppercase', (value) => String(value).toUpperCase())
  .set('slice', (value, size) => String(value).slice(0, Number(size)))
```

```html
<kb-text on="user/changed:setter/textContent|prop=name|uppercase"></kb-text>
```

Regístralo antes de que conecten los arcos que lo usan — un elemento que se
inicializa antes resuelve el nombre a identidad y mantiene esa resolución para
ese arco.

## Qué no puede ser un operador

Los operadores son **transformaciones síncronas de un valor**. Reciben un
payload y devuelven un payload; no pueden diferir, descartar ni agrupar la
llamada al destino.

Eso descarta toda una categoría que suele ser el primer intento:

- **`debounce` / `throttle`** — necesitarían retrasar la llamada. Haz el
  throttle dentro del método de destino.
- **Cualquier cosa asíncrona** — una promesa se pasaría como el payload.
- **Enrutamiento condicional** — un operador puede devolver `false`, pero el
  destino se invoca igual con ese valor. No existe un "no llames".
