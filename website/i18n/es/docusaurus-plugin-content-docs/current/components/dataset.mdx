# Dataset

Una colección de registros en memoria, indexada por el campo nombrado en
`upsert`, que publica `changed` siempre que se muta. No renderiza nada — es el
estado al que otros elementos reaccionan.

```html preview
<kb-dataset id="people-demo" name="people" upsert="id"></kb-dataset>

<kb-render>
  <kb-on value="people/changed:method/render"></kb-on>
  <template>
    <kb-card>
      <kb-text size="xxs" weight="bold">{name}</kb-text>
      <kb-text size="xxxs" color="master">{role}</kb-text>
    </kb-card>
  </template>
</kb-render>

<script type="module">
  const dataset = document.querySelector('#people-demo')
  requestAnimationFrame(() =>
    dataset.push([
      { id: 1, name: 'Ada Lovelace', role: 'Matemática' },
      { id: 2, name: 'Grace Hopper', role: 'Contraalmirante' },
    ]),
  )
</script>
```

## Uso

```html
<kb-dataset name="users" upsert="id"></kb-dataset>
```

```js
const dataset = document.querySelector('kb-dataset')
dataset.addEventListener('changed', (event) => render(event.detail))
dataset.push({ id: 1, name: 'Ada' })
```

## Cuándo usarlo

- **Guardando una lista desde la que renderiza la página** — resultados de
  búsqueda, una tabla, un carrito — donde varios elementos deben reaccionar a la
  misma colección.
- **Fusionando actualizaciones parciales en registros existentes** — un parche
  de websocket, una respuesta que devuelve solo los campos cambiados — sin
  perder lo almacenado.

## Cuándo no usarlo

- **Persistencia.** Esto es solo memoria: una recarga lo vacía. Combínalo con
  `<kb-fetch>` o `localStorage` si los datos deben sobrevivir.
- **Un único valor.** Para un registro, o un escalar, un atributo en el elemento
  consumidor es más simple.
- **Colecciones grandes.** Cada mutación despacha la colección *entera* como
  detalle del evento, y los consumidores rerrenderizan desde cero.

## Composición

- **Puede contener**: hijos `<kb-filter>` y `<kb-find>`, que leen el `value` de
  este elemento y publican resultados estrechados **en este elemento**; más
  `<kb-on>` para arcos. Nada se renderiza.
- **Puede ser hijo de**: cualquier cosa.

```html
<kb-dataset name="users" upsert="id">
  <kb-filter key="active" value="true"></kb-filter>
</kb-dataset>
```

## La clave de upsert

`upsert` nombra el campo que identifica un registro. Es lo que convierte `push`
en una fusión en lugar de un añadido:

- Un registro cuya clave **coincide** con uno existente se **fusiona** en él —
  `Object.assign`, así que los campos ausentes del registro nuevo conservan su
  valor almacenado. Eso es lo que hace seguras las actualizaciones parciales.
- Un registro **sin valor** para esa clave recibe un uuid generado, así que
  siempre se inserta como nuevo.
- La clave se escribe de vuelta en el registro almacenado, así que cada entrada
  lleva su propio identificador incluso cuando llegó sin uno.

```js
dataset.push({ id: 1, name: 'Ada', role: 'Matemática' })
dataset.push({ id: 1, role: 'Condesa' })
// → [{ id: 1, name: 'Ada', role: 'Condesa' }]  — el name sobrevivió
```

!> Con `upsert` sin definir, la clave de cada registro es `undefined`, así que
todos colisionan en una única entrada fusionada. Defínelo siempre que los
registros tengan cualquier identidad.

## Métodos

| Método | Devuelve | Descripción |
|---|---|---|
| `push(data)` | `this` | Inserta o fusiona un registro o un array de registros. |
| `delete(key)` | `this` | Elimina el registro cuyo valor de la clave de upsert es igual a `key`. |
| `reset()` | `this` | Limpia todos los registros almacenados. |

Los tres despachan `changed` después, en un tick posterior — la mutación termina
de forma síncrona, el evento va detrás.

## Atributos

| Atributo | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `upsert` | `string` | — | Nombre del campo usado como clave del registro al fusionar. |
| `name` | `string` | — | Identifica a este elemento como el `origen` de un arco. |
| `on` | cadena de arco | — | Conexión de Echo, `origen/evento:tipo/destino`. |

## Propiedades

| Propiedad | Tipo | Descripción |
|---|---|---|
| `value` | `unknown[]` | Los registros actuales, en orden de inserción. Solo lectura. |

## Eventos

| Evento | Se dispara cuando | `detail` |
|---|---|---|
| `changed` | tras `push`, `delete` o `reset` | la colección completa, como array |

El detalle es siempre la colección **entera**, nunca un delta — los consumidores
renderizan desde la lista completa cada vez, y por eso `<kb-render>` no necesita
diffing.

## Conectarlo a un fetch

El par común: una petición rellena el dataset, y el dataset alimenta la vista.
Nada importa nada.

```html
<kb-fetch name="api" url="/api/users">
  <kb-on value="load/clicked:method/get"></kb-on>
</kb-fetch>

<kb-dataset name="users" upsert="id">
  <kb-on value="api/succeeded:method/push"></kb-on>
</kb-dataset>

<kb-render>
  <kb-on value="users/changed:method/render"></kb-on>
  <template>{name}</template>
</kb-render>
```

## Estados y accesibilidad

- El elemento es headless y no renderiza nada — sin superficie de accesibilidad
  propia.
- Una colección que cambia sin una señal visible es invisible para quien usa
  lector de pantalla. Cuando los registros llegan de forma asíncrona, dale a la
  región que los renderiza un valor de `aria-live` para que la actualización se
  anuncie.

## Recomendado y no recomendado

| Haz | No hagas |
|---|---|
| Establecer `upsert` con un campo identificador real | Dejarlo sin definir y ver cómo cada registro se fusiona en uno |
| Empujar registros parciales para parchear los almacenados | Empujar un reemplazo completo cuando solo cambió un campo |
| Mantener las colecciones lo bastante pequeñas para rerrenderizarlas enteras | Almacenar miles de filas y rerrenderizar en cada mutación |
| Tratarlo como estado efímero | Confiar en que sobreviva a una recarga |
