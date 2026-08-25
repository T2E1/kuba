# Find

Selecciona el **primer** registro de la colección de su padre cuyo campo `key`
es igual a `value`, y lo publica. Como `<kb-filter>`, no renderiza nada y
despacha el resultado **en el padre**, no en sí mismo — la diferencia es que
devuelve un registro en lugar de un array.

```html preview
<kb-dataset id="detail-demo" name="breeds" upsert="id">
  <kb-find key="id" value="2"></kb-find>
</kb-dataset>

<kb-render>
  <kb-on value="breeds/found:method/render"></kb-on>
  <template>
    <kb-card>
      <kb-text size="xs" weight="bold">{name}</kb-text>
      <kb-text size="xxxs" color="master">{temperament}</kb-text>
    </kb-card>
  </template>
</kb-render>

<script type="module">
  const dataset = document.querySelector('#detail-demo')
  requestAnimationFrame(() => {
    dataset.push([
      { id: '1', name: 'Akita', temperament: 'Dócil, valiente' },
      { id: '2', name: 'Corgi', temperament: 'Tenaz, juguetón' },
    ])
    document.querySelector('kb-find').value = '2'
  })
</script>
```

## Uso

```html
<kb-dataset name="users" upsert="id">
  <kb-find key="id" value="1"></kb-find>
</kb-dataset>
```

```js
document.querySelector('kb-dataset').addEventListener('found', (event) => {
  showDetail(event.detail) // un registro, o undefined
})
```

## Cuándo usarlo

- **Una vista de detalle dirigida por una selección** — una lista publica el id
  pulsado, un arco lo asigna al `value` de este elemento, y el registro
  correspondiente llega al renderizador de detalle.
- **Leyendo un registro de una colección que ya tienes**, sin una segunda
  petición.

## Cuándo no usarlo

- **Varias coincidencias.** Este devuelve solo la primera. Usa `<kb-filter>`
  cuando más de un registro pueda coincidir, aunque esperes uno.
- **Un predicado más allá de la igualdad.** La comparación es un `===` estricto
  entre el campo `key` del registro y `value`.
- **Traer un registro que no tienes.** Este busca en memoria; no hace ninguna
  petición. Combínalo con `<kb-fetch>` cuando el registro pueda no estar
  cargado.

## La inversión del padre

Igual que `<kb-filter>`: el evento `found` se despacha en `parentElement`, así
que un arco debe nombrar al **padre** como origen.

```html
<kb-dataset name="breeds" upsert="id">
  <kb-find key="id" value="2"></kb-find>
</kb-dataset>

<!-- el origen es el dataset, no el find -->
<kb-render>
  <kb-on value="breeds/found:method/render"></kb-on>
</kb-render>
```

!> Un arco que apunta al `name` del propio elemento find nunca se dispara. Esta
es la razón más probable de que una vista de detalle se quede vacía.

## Composición

- **Puede contener**: nada.
- **Puede ser hijo de**: un elemento que exponga un array en `value` — en la
  práctica, `<kb-dataset>`. Espera a que el padre se inicialice antes de leerlo.

## Dirigirlo desde una selección

El patrón para el que existe este elemento — una lista de tarjetas, cada una
publicando su propio id, alimentando una vista de detalle:

```html
<kb-dataset name="breeds" upsert="id">
  <kb-find key="id" value=""></kb-find>
</kb-dataset>

<kb-render>
  <kb-on value="breeds/changed:method/render"></kb-on>
  <template>
    <kb-card value="{id}"><kb-text size="xxs">{name}</kb-text></kb-card>
  </template>
</kb-render>

<kb-render>
  <kb-on value="breeds/found:method/render"></kb-on>
  <template><kb-text size="sm">{name}</kb-text></template>
</kb-render>
```

El payload del `clicked` de la tarjeta tiene que llegar al `value` del elemento
find — conéctalo con un arco en el propio find:
`on="kb-card/clicked:setter/value"`.

## Cuándo reevalúa

La búsqueda se ejecuta cuando **`value` cambia**, y solo entonces. Un registro
empujado al padre después no la vuelve a disparar; reasigna `value` para forzar
una nueva pasada. Asignar el *mismo* valor dos veces tampoco la vuelve a
disparar necesariamente, ya que el setter se ejecuta al cambiar el atributo.

## Atributos

| Atributo | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `key` | `string` | — | Campo del registro a comparar. |
| `value` | `string` | — | Valor con el que debe ser igual. Asignarlo dispara una nueva pasada. |
| `on` | cadena de arco | — | Conexión de Echo, `origen/evento:tipo/destino`. |

## Eventos

| Evento | Despachado en | `detail` |
|---|---|---|
| `found` | **el elemento padre** | el primer registro coincidente, o `undefined` |

!> **Ninguna coincidencia despacha `undefined`, no un objeto vacío.** Un
consumidor que lo interpola — `<kb-render>`, por ejemplo — renderiza
placeholders contra nada en lugar de mostrar un estado vacío. Protégete de eso
cuando una búsqueda sin resultado sea posible.

## Estados y accesibilidad

- Headless: sin salida renderizada, sin superficie de accesibilidad.
- Una región de detalle que cambia sin mover el foco deja sin enterarse a quien
  usa lector de pantalla. Cuando la selección la dirige la persona, mueve el
  foco a la región de detalle o dale un valor de `aria-live`.

## Recomendado y no recomendado

| Haz | No hagas |
|---|---|
| Apuntar el `origen` del arco al **padre** | Usar el `name` del propio elemento find como origen |
| Usar `<kb-filter>` cuando varios registros pueden coincidir | Confiar en `find` y descartar el resto en silencio |
| Manejar el caso `undefined` de una búsqueda sin resultado | Suponer que siempre vuelve un registro |
| Reasignar `value` para reevaluar tras la llegada de nuevos datos | Esperar que un `push` posterior rehaga la búsqueda |
