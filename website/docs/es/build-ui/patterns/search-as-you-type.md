---
description: "Receta del Recetario: un campo de búsqueda que consulta una API mientras escribes y renderiza los resultados desde un template, conectado con tres arcos de Echo y nada de JavaScript."
---

<script setup>
const steps = [
  { node: { tag: 'kb-input', name: 'breed', note: 'escribes "corgi"' } },
  { arcs: [{ arc: 'breed/changed:method/get', payload: 'detail: "corgi"' }] },
  {
    node: {
      tag: 'kb-fetch',
      name: 'dogs',
      note: 'GET con el payload en {}',
      external: { host: 'api.thedogapi.com', path: '/v1/breeds/search?q=corgi' },
    },
  },
  {
    arcs: [
      { arc: 'dogs/succeeded:method/render', payload: 'detail: [{ name, temperament }, …]', kind: 'ok' },
      { arc: 'dogs/failed:method/clear', payload: 'detail: el error', kind: 'fail' },
    ],
  },
  { node: { tag: 'kb-render', name: 'resultados', note: 'una tarjeta por elemento' } },
]
</script>

# Búsqueda al escribir

Un input que consulta una API en cada tecla, renderiza los resultados desde un
template y los limpia cuando la petición falla. Tres elementos, tres arcos, nada
de JavaScript.

## El código, bloque a bloque

### 1. El input publica

`<kb-input>` dispara `changed` en cada tecla, con el valor actual como payload.
El nombre importa: `name="breed"` es lo que compara el segmento `source` de un
arco. El `<kb-stack>` que lo envuelve solo ordena el layout; no participa del
cableado.

```html
<kb-stack direction="column" spacing="xs" width="fill">
  <kb-input name="breed" width="fill" placeholder="Prueba 'akita' o 'corgi'">
    <kb-label>Buscar razas de perro</kb-label>
    <kb-helper>Los resultados se actualizan mientras escribes.</kb-helper>
  </kb-input>
```

### 2. El renderizador se suscribe al desenlace

`<kb-render>` interpola su `<template>` una vez por elemento de un array, así que
una lista no necesita bucle: `{name}` y `{temperament}` se leen de cada elemento
de la respuesta. Sus dos arcos dicen qué hacer con cada desenlace de la
petición: `succeeded` renderiza la lista, `failed` la limpia.

```html
  <kb-render>
    <kb-on value="dogs/succeeded:method/render"></kb-on>
    <kb-on value="dogs/failed:method/clear"></kb-on>
    <template>
      <kb-card>
        <kb-text size="xs" weight="bold">{name}</kb-text>
        <kb-text size="xxxs" color="master">{temperament}</kb-text>
      </kb-card>
    </template>
  </kb-render>
</kb-stack>
```

Conectar `failed` con `clear` es lo que evita que resultados viejos se queden
bajo una consulta fallida. Sin eso, un error de red deja los resultados
anteriores en pantalla, pareciendo actuales.

### 3. El fetch se suscribe y solicita

`<kb-fetch>` no renderiza nada. Su arco llama a `get` con el valor del input, y
el `{}` de la `url` — el placeholder vacío — se reemplaza por el payload entero.
Cuando llega la respuesta, publica `succeeded` con los datos ya parseados, o
`failed` con el error.

```html
<kb-fetch name="dogs" url="https://api.thedogapi.com/v1/breeds/search?q={}">
  <kb-headers key="x-api-key" value="DEMO-API-KEY"></kb-headers>
  <kb-on value="breed/changed:method/get"></kb-on>
</kb-fetch>
```

Cada petición nueva aborta la que está en curso, así que las respuestas fuera de
orden no sobrescriben resultados más recientes — lo que escribirías a mano con un
`AbortController` y un número de secuencia.

## El flujo de datos

<Dataflow :steps="steps" caption="Ninguno de los tres elementos guarda una referencia a otro. Cada uno solo conoce el nombre del origen que escucha." />

| Arco | Se lee |
|---|---|
| `breed/changed:method/get` | cuando `breed` cambie, llama al `get` de este fetch con el nuevo valor |
| `dogs/succeeded:method/render` | cuando `dogs` tenga éxito, renderiza el template una vez por elemento |
| `dogs/failed:method/clear` | cuando `dogs` falle, limpia lo renderizado |

## Pruébalo

Escribe una raza. Cada tecla es una petición real a The Dog API.

```html preview
<kb-stack direction="column" spacing="xs" width="fill">
  <kb-input name="breed" width="fill" placeholder="Prueba 'akita' o 'corgi'">
    <kb-label>Buscar razas de perro</kb-label>
    <kb-helper>Los resultados se actualizan mientras escribes.</kb-helper>
  </kb-input>

  <kb-render>
    <kb-on value="dogs/succeeded:method/render"></kb-on>
    <kb-on value="dogs/failed:method/clear"></kb-on>
    <template>
      <kb-card>
        <kb-text size="xs" weight="bold">{name}</kb-text>
        <kb-text size="xxxs" color="master">{temperament}</kb-text>
      </kb-card>
    </template>
  </kb-render>
</kb-stack>

<kb-fetch name="dogs" url="https://api.thedogapi.com/v1/breeds/search?q={}">
  <kb-headers key="x-api-key" value="DEMO-API-KEY"></kb-headers>
  <kb-on value="breed/changed:method/get"></kb-on>
</kb-fetch>
```

## Cosas que conviene saber

### Dispara en cada tecla

`changed` no tiene debounce, y los filtros de arco no pueden hacerlo: son
transformaciones síncronas del payload y no pueden diferir la llamada. Para una
API real, limita la frecuencia antes de solicitar. Eso significa cambiar el arco
por un listener en el input:

```js
let timer
document.querySelector('kb-input').addEventListener('changed', (event) => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    document.querySelector('kb-fetch').get(event.detail)
  }, 300)
})
```

Esta es la frontera honesta del enfoque declarativo: en cuanto entra el tiempo,
un arco es la herramienta equivocada. Todo lo demás en la página sigue siendo
declarativo.

### El estado vacío

`<kb-render>` no renderiza nada para un array vacío, así que una consulta sin
coincidencias deja un espacio en blanco en vez de decir "sin resultados". Si la
diferencia importa, escucha `succeeded` y decide según `detail.length`.

### Cabeceras

Una API que pide una clave recibe un hijo `<kb-headers>`, uno por nombre de
cabecera.

::: warning
Una clave en el markup es visible para cualquiera que abra la página. Úsalo solo
para claves de demostración públicas y con límite de uso; cualquier cosa real va
detrás de tu propio endpoint.
:::

## Relacionados

- [Eventos y Echo](/es/foundations/events-and-echo) — la gramática del arco
  completa.
- [Fetch](/es/components/fetch) — todos los atributos y eventos.
- [Dirección por CEP](/es/build-ui/patterns/address-by-cep) — el mismo patrón de
  petición, con la respuesta repartida en un formulario.
