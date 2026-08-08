# Filter

Estrecha la colección de registros de su **padre** comparando el campo `key` de
cada registro contra `value`, y publica las coincidencias. No renderiza nada y —
esta es la parte que sorprende a todo el mundo — despacha el resultado **en el
padre**, no en sí mismo.

```html preview
<kb-dataset id="stock-demo" name="stock" upsert="id">
  <kb-filter key="available" value="true"></kb-filter>
</kb-dataset>

<kb-render>
  <kb-on value="stock/filtered:method/render"></kb-on>
  <template>
    <kb-text size="xxs">{name} — disponible</kb-text>
  </template>
</kb-render>

<script type="module">
  const dataset = document.querySelector('#stock-demo')
  requestAnimationFrame(() => {
    dataset.push([
      { id: 1, name: 'Akita', available: 'true' },
      { id: 2, name: 'Corgi', available: 'false' },
      { id: 3, name: 'Beagle', available: 'true' },
    ])
    document.querySelector('kb-filter').value = 'true'
  })
</script>
```

## Uso

```html
<kb-dataset name="users" upsert="id">
  <kb-filter key="active" value="true"></kb-filter>
</kb-dataset>
```

```js
document.querySelector('kb-dataset').addEventListener('filtered', (event) => {
  render(event.detail) // los registros coincidentes
})
```

## Cuándo usarlo

- **Mostrando un subconjunto de una colección** — usuarios activos, artículos
  disponibles, una categoría — dirigido por un atributo en vez de por script.
- **Refiltrando a partir del evento de otro elemento**, conectando un arco al
  `value` de este elemento.

## Cuándo no usarlo

- **Predicados complejos.** La comparación es un `===` estricto entre el campo
  `key` del registro y `value`. No hay rangos, ni substrings, ni comparación sin
  distinguir mayúsculas, ni lógica multicampo. Filtra en tu propio código y
  empuja el resultado a un segundo `<kb-dataset>` cuando la regla sea más que
  igualdad.
- **Filtrar algo que no es una colección del padre.** Lee
  `parentElement.value`; sin ese padre no hace nada.

## La inversión del padre

Todos los demás elementos de la librería despachan sus eventos en sí mismos.
Este no:

```html
<kb-dataset name="stock" upsert="id">
  <kb-filter key="available" value="true"></kb-filter>
</kb-dataset>

<!-- El origen del arco es el DATASET, no el filter -->
<kb-render>
  <kb-on value="stock/filtered:method/render"></kb-on>
</kb-render>
```

!> **Conectar un arco al `name` del propio filter nunca se dispara.** El evento
`filtered` se despacha en `parentElement`, así que el segmento de `origen` debe
coincidir con el padre — su `name`, su `#id`, o su nombre de etiqueta
(`kb-dataset`). Esta es la razón más probable de que un filtro "no haga nada".

Lo mismo aplica a `<kb-find>`. Es el único lugar donde la regla de la librería
"un elemento publica sus propios eventos" no se cumple.

## Composición

- **Puede contener**: nada. No renderiza shadow DOM.
- **Puede ser hijo de**: un elemento que exponga un array en `value` — en la
  práctica, `<kb-dataset>`. Espera a que el padre se inicialice antes de leerlo,
  así que declararlo antes de que el padre esté definido es seguro.

Varios filtros bajo el mismo padre publican cada uno su propio evento `filtered`
en ese padre, de forma independiente — no se componen en un AND. Dos filtros
significan dos eventos con dos conjuntos de resultados distintos, y el que se
dispare último gana en el consumidor.

## Cuándo reevalúa

El filtrado se ejecuta cuando **`value` cambia** — ese es el único disparador.
Dos consecuencias:

- **Es establecer el atributo lo que lo dispara**, así que un filtro con `value`
  estático evalúa una vez, al inicializarse, contra lo que el padre contuviera
  en ese momento.
- **Un `push` posterior en el padre no refiltra.** El dataset despacha
  `changed`, no `filtered`. Si la colección crece después, reasigna el `value`
  del filtro para forzar una nueva pasada, o conecta el consumidor al `changed`
  del padre.

## Atributos

| Atributo | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `key` | `string` | — | Campo del registro a comparar. |
| `value` | `string` | — | Valor con el que debe ser igual. Asignarlo dispara una nueva pasada. |
| `on` | cadena de arco | — | Conexión de Echo, `origen/evento:tipo/destino`. |

## Eventos

| Evento | Despachado en | `detail` |
|---|---|---|
| `filtered` | **el elemento padre** | un array de los registros coincidentes |

Un resultado vacío publica un array vacío, no nada — el consumidor se dispara
igual y puede mostrar un estado vacío.

## Estados y accesibilidad

- Headless: sin salida renderizada, sin superficie de accesibilidad.
- Filtrar cambia lo que hay en pantalla sin mover el foco ni anunciar nada.
  Cuando un filtro lo dirige la persona, dale a la región de resultados un valor
  de `aria-live` para que el cambio sea perceptible.

## Recomendado y no recomendado

| Haz | No hagas |
|---|---|
| Apuntar el `origen` del arco al **padre** | Usar el `name` del propio filter como origen — nunca despacha en sí mismo |
| Usarlo para una única comprobación de igualdad | Esperar rangos, substrings o lógica multicampo |
| Reasignar `value` para reevaluar tras un cambio en los datos | Suponer que un `push` posterior refiltra automáticamente |
| Conectar el consumidor a `changed` cuando lo que importa es la colección | Apilar dos filtros esperando que se combinen |
