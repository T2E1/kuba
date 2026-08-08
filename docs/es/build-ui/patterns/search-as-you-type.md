# Búsqueda al escribir

Un input que consulta una API en cada tecla, renderiza los resultados desde un
template y los limpia cuando la petición falla. Tres elementos, tres arcos, nada
de JavaScript.

## El resultado final

```html preview
<kb-stack direction="column" spacing="xs">
  <kb-input name="breed" placeholder="Prueba 'akita' o 'corgi'">
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

## Cómo se construye

### 1. El input publica

`<kb-input>` dispara `changed` en cada tecla, con el valor actual como payload.
Nombrarlo importa — `name="breed"` es con lo que coincide el segmento `source` de
un arco.

```html
<kb-input name="breed" placeholder="Prueba 'akita'"></kb-input>
```

### 2. El fetch se suscribe y solicita

`<kb-fetch>` no renderiza nada. Su `url` lleva un placeholder `{}`, sustituido
por el payload que llegue a su método `get` — que es exactamente el valor del
input.

```html
<kb-fetch name="dogs" url="https://api.thedogapi.com/v1/breeds/search?q={}">
  <kb-on value="breed/changed:method/get"></kb-on>
</kb-fetch>
```

Cada nueva petición aborta la que está en vuelo, así que las respuestas fuera de
orden no sobrescriben resultados más nuevos — lo que de otro modo escribirías a
mano con un `AbortController` y un número de secuencia.

### 3. El renderizador se suscribe al desenlace

`<kb-fetch>` publica `succeeded` con los datos parseados, o `failed` con el
error. `<kb-render>` interpola su `<template>` una vez por elemento del array,
así que una lista no necesita bucle:

```html
<kb-render>
  <kb-on value="dogs/succeeded:method/render"></kb-on>
  <kb-on value="dogs/failed:method/clear"></kb-on>
  <template>
    <kb-card>
      <kb-text size="xs" weight="bold">{name}</kb-text>
    </kb-card>
  </template>
</kb-render>
```

Conectar `failed` a `clear` es lo que impide que resultados viejos permanezcan
bajo una consulta fallida. Sin eso, un error de red deja en pantalla las
coincidencias anteriores, aparentando ser actuales.

## Cosas que conviene saber

### Dispara en cada tecla

`changed` no está limitado, y los filtros de arco no pueden limitarlo — son
transformaciones síncronas del payload y no aplazan la llamada. Para una API
real, limita la frecuencia antes de solicitar. Eso implica cambiar el arco por un
listener en el input:

```js
let timer
document.querySelector('kb-input').addEventListener('changed', (event) => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    document.querySelector('kb-fetch').get(event.detail)
  }, 300)
})
```

Ese es el límite honesto del enfoque declarativo: en cuanto entra el tiempo en
juego, un arco es la herramienta equivocada. Todo lo demás de la página sigue
siendo declarativo.

### El estado vacío

`<kb-render>` no renderiza nada para un array vacío, así que una consulta sin
coincidencias deja un espacio en blanco en lugar de decir "sin resultados". Si la
distinción importa, escucha `succeeded` y ramifica según `detail.length`.

### Cabeceras

Una API que exige clave recibe un hijo `<kb-headers>`, uno por nombre de
cabecera:

```html
<kb-fetch name="dogs" url="https://api.thedogapi.com/v1/breeds/search?q={}">
  <kb-headers key="x-api-key" value="TU-CLAVE"></kb-headers>
  <kb-on value="breed/changed:method/get"></kb-on>
</kb-fetch>
```

!> Una clave en el markup es visible para cualquiera que abra la página. Úsalo
solo con claves públicas de demostración con límite de uso; algo real pertenece
detrás de tu propio endpoint.

## Relacionados

- [Eventos y Echo](/es/foundations/events-and-echo) — la gramática completa del arco.
- [Componentes › Fetch](/es/components/fetch) — cada atributo y evento.
