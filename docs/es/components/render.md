# Render

Renderiza contenido interpolando una plantilla contra datos arbitrarios,
suministrados vía `render()` y vaciados de nuevo vía `clear()`. Es un host de
Echo, así que cualquiera de los dos métodos puede conectarse al evento de otro
elemento — rerrenderizando cuando una fuente de datos publica `succeeded`,
limpiando en un `failed` — sin listener manual ni sistema de reactividad.

```html preview
<kb-render id="greeting-demo">
  <template>
    <kb-text size="xs">¡Hola, {name}! Tienes {count} mensajes.</kb-text>
  </template>
</kb-render>

<script type="module">
  const target = document.querySelector('#greeting-demo')
  requestAnimationFrame(() => target.render({ name: 'Ada', count: 3 }))
</script>
```

## Uso

```html
<kb-render>
  <kb-on value="api/succeeded:method/render"></kb-on>
  <template>{name}</template>
</kb-render>
```

```js
document.querySelector('kb-render').render([{ name: 'Ada' }, { name: 'Grace' }])
```

## Cuándo usarlo

- **Mostrando una lista o rejilla de registros** cuya forma se mantiene pero
  cuyos datos cambian — una plantilla, rerrenderizada contra un nuevo array cada
  vez.
- **Conectando el renderizado a un evento** en lugar de escribir un listener más
  actualizaciones del DOM a mano.

## Cuándo no usarlo

- **Contenido estático que nunca cambia tras el primer renderizado** — el HTML
  normal no necesita nada de esta maquinaria.
- **Contenido que requiere ramificación condicional o estructura anidada** más
  allá de la sustitución simple de `{path.to.value}`. El motor de plantillas
  solo sustituye placeholders; no tiene `if` ni sintaxis de bucle más allá de
  "una interpolación por entrada del array".

## Composición

- **Puede contener**: un único hijo `<template>`, y uno o más hijos `<kb-on>`
  para arcos más allá del único atributo `on`.
- **Puede ser hijo de**: cualquier cosa.

## Resolución de la plantilla

- **Anida el `<template>` directamente como hijo** — el caso común.
- **O establece `template="algun-id"`** para referenciar un `<template>`
  declarado en otro lugar del documento, resuelto una vez y cacheado. Útil
  cuando varias instancias de `<kb-render>` comparten una plantilla.

## Datos y rerrenderizado

`render(data)` acepta un único elemento o un array; un valor único se convierte
en una lista de un elemento, así que la misma interpolación maneja una o muchas
entradas, concatenadas en orden.

```html preview
<kb-render id="list-demo" layout="grid">
  <template>
    <kb-card>
      <kb-text size="xxs" weight="bold">{name}</kb-text>
      <kb-text size="xxxs" color="master">{role}</kb-text>
    </kb-card>
  </template>
</kb-render>

<script type="module">
  const target = document.querySelector('#list-demo')
  requestAnimationFrame(() =>
    target.render([
      { name: 'Ada Lovelace', role: 'Matemática' },
      { name: 'Grace Hopper', role: 'Contraalmirante' },
    ]),
  )
</script>
```

!> **Llamar a `render()` antes del primer paint no hace nada, en silencio.**
Llámalo después de que el elemento esté conectado — en respuesta a un evento, no
de forma síncrona al cargar el módulo. Por eso los ejemplos de arriba esperan un
frame.

`clear()` vacía el contenido renderizado sin tocar la plantilla, así que un
`render()` posterior todavía tiene contra qué interpolar. Es la contraparte
natural para conectar a un evento de fallo, para que una petición fallida limpie
resultados viejos en vez de dejarlos en pantalla pareciendo actuales.

## Layout

`layout` controla cómo se organiza el contenido renderizado, no cómo se ve.

| Layout | Disposición | Úsalo para |
|---|---|---|
| `list` (por defecto) | Columna flex única | Una lista vertical de registros, uno por línea. |
| `grid` | Rejilla de dos columnas | Registros que se leen mejor lado a lado, como pares de nombre/valor. |

## Atributos

| Atributo | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `layout` | `list` \| `grid` | `list` | Disposición de los elementos renderizados. |
| `template` | `string` | — | Id de un `<template>` en otro lugar del documento, usado en vez de uno hijo. |
| `hidden` | `boolean` | `false` | Elimina el elemento del layout y del árbol de accesibilidad. |
| `on` | cadena de arco | — | Conexión de Echo, `origen/evento:tipo/destino`. |

## Métodos

| Método | Devuelve | Descripción |
|---|---|---|
| `render(data)` | `this` | Interpola la plantilla contra `data` — un elemento o un array — y reemplaza el contenido renderizado. |
| `clear()` | `this` | Vacía el contenido renderizado, dejando la plantilla intacta. |

Este elemento no despacha eventos.

## Estilos

| Custom property | Por defecto | Controla |
|---|---|---|
| `--render-space-gap` | `var(--spacing_inset-xs)` | Espaciado entre elementos renderizados, en ambos layouts. |
| `--render-grid-columns` | `2` | Número de columnas en el layout `grid`. Sin efecto en `list`. |

```css
/* Una galería más densa, de tres columnas, acotada a un área */
.gallery kb-render {
  --render-grid-columns: 3;
  --render-space-gap: var(--spacing_inset-nano);
}
```

## Recomendado y no recomendado

| Haz | No hagas |
|---|---|
| Anidar un único hijo `<template>` para el caso común | Referenciar un nodo externo con `template` cuando un hijo bastaría |
| Conectar `render()` al evento de un publicador vía `on` o `<kb-on>` | Escribir un listener a mano cuando un arco ya lo cubre |
| Usar `layout="grid"` para entradas emparejadas y fáciles de recorrer | Usar `grid` para texto libre largo, que no gana nada con columnas |
| Llamar a `render()` solo después de que el elemento esté conectado | Llamarlo de forma síncrona justo tras crear el elemento — no hace nada antes del primer paint |
