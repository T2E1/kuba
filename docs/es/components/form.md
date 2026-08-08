# Form

Un form envuelve un `<form>` nativo y convierte sus dos momentos en eventos
personalizados: `submitted`, que lleva los datos ya parseados como objeto plano,
y `resetted`. Su contenido viene de un hijo `<template>`, opcionalmente
interpolado con datos — así que el mismo markup se renderiza vacío para un flujo
de creación y relleno para uno de edición.

```html preview
<kb-form autorender>
  <template>
    <kb-input name="email" type="email" required>
      <kb-label>Email</kb-label>
      <kb-validity state="valueMissing">El email es obligatorio.</kb-validity>
      <kb-validity state="typeMismatch">Eso no es una dirección de email.</kb-validity>
    </kb-input>
    <kb-button type="submit">Enviar</kb-button>
  </template>
</kb-form>
```

## Uso

```html
<kb-form autorender>
  <template>
    <kb-input name="email" required></kb-input>
    <kb-button type="submit">Enviar</kb-button>
  </template>
</kb-form>
```

```js
document.querySelector('kb-form').addEventListener('submitted', (event) => {
  save(event.detail) // { email: '…' }
})
```

## Cuándo usarlo

- **Recogiendo un conjunto de campos y actuando sobre el resultado en JS** —
  `submitted` te entrega los datos ya parseados, sin ningún recorrido de
  `FormData` propio.
- **Editando un registro existente** — `render(data)` rellena los
  `{placeholders}` de la plantilla con los valores actuales antes de que la
  persona vea el formulario.
- **Conectando un formulario a otros elementos de forma declarativa** —
  `submitted` es un evento de Echo, así que un `<kb-fetch>` puede publicarlo sin
  listener.

## Cuándo no usarlo

- **Un post clásico al servidor.** El `<form>` interno no tiene `action` ni
  `method` y su envío nativo está impedido; una página que deba navegar al
  enviar quiere un `<form>` normal.
- **Un único campo con un botón** — un `<kb-input>` y un `<kb-button>` en un
  `<kb-stack>` es menos maquinaria cuando no hay nada que parsear.
- **Solo layout.** El elemento existe para el ciclo de envío/reinicio; para
  organizar campos sin eso, usa `<kb-stack>`.

## Composición

- **Puede contener**: exactamente un hijo `<template>`, que guarda los campos y
  el control de envío. Su markup es lo que se renderiza dentro del `<form>` del
  shadow. **Los hijos del light DOM fuera de la plantilla no se proyectan** — no
  existe ningún `<slot>`.
- **Puede ser hijo de**: cualquier cosa. El host ocupa todo el ancho y dispone
  sus campos como una columna.

Dentro de la plantilla, usa los controles de formulario de la librería —
`<kb-input>`, `<kb-textarea>`, `<kb-fileupload>` — más un
`<kb-button type="submit">`. Al estar asociados a formulario, se registran en el
`<form>` interno y aparecen en los datos enviados por su `name`.

## Renderizar la plantilla

El contenido no se renderiza hasta que se ejecuta `render()`. Hay dos formas de
dispararlo, y elegir entre ellas es la principal decisión que este elemento te
pide.

**`autorender`** renderiza una vez al conectarse, sin datos. Adecuado para un
formulario en blanco: los campos aparecen tal como se escribieron y los
`{placeholders}` resuelven a nada.

**`render(data)`** lo llamas tú cuando llegan los datos. Cada `{path}` de la
plantilla se sustituye por el valor correspondiente — `{}` es el objeto entero,
`{user.email}` una búsqueda anidada — y así es como un formulario de edición
llega prerrelleno:

```js
document.querySelector('kb-form').render({ email: 'ada@ejemplo.com' })
```

Cada llamada rerrenderiza el shadow DOM, sustituyendo los campos actuales **y
cualquier valor que la persona haya escrito**. Renderiza cuando llegan los
datos, no en cada tecla.

!> La plantilla se lee en el momento del renderizado. El markup añadido al
`<template>` después — por un framework que rellena sus hijos de forma asíncrona
— no se recoge a menos que `render()` vuelva a ejecutarse.

## Atributos

| Atributo | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `autorender` | `boolean` | `false` | Renderiza la plantilla al conectarse, sin esperar a `render()`. |
| `template` | `string` | — | Id de un `<template>` en otro lugar del documento, usado en vez de uno hijo. |
| `hidden` | `boolean` | `false` | Elimina el formulario del layout y del árbol de accesibilidad. |
| `on` | cadena de arco | — | Conexión de Echo, `origen/evento:tipo/destino`. |

## Métodos

| Método | Devuelve | Descripción |
|---|---|---|
| `render(data?)` | `this` | Renderiza la plantilla, interpolando los placeholders `{path}` desde `data`. |
| `submit()` | `this` | Envía el formulario interno, disparando la validación y luego `submitted`. |
| `reset()` | `this` | Reinicia el formulario interno, disparando `resetted`. |

## Eventos

| Evento | Se dispara cuando | `detail` |
|---|---|---|
| `submitted` | el formulario interno se envía, de forma nativa o vía `submit()` | los datos del formulario como objeto plano |
| `resetted` | el formulario interno se reinicia, de forma nativa o vía `reset()` | `{}` |

Ambos se vuelven a despachar desde el host después de detener el evento nativo,
así que la página nunca navega. `submit()` y `reset()` pasan por el mismo
camino, lo que significa que la validación de cada campo se ejecuta primero.

```html
<kb-form name="signup" autorender>…</kb-form>
<kb-fetch url="/api/signup" method="post">
  <kb-on value="signup/submitted:method/post"></kb-on>
</kb-fetch>
```

## Estilos

| Custom property | Por defecto | Controla |
|---|---|---|
| `--form-direction` | `column` | `flex-direction` de la lista de campos; `row` para un formulario inline compacto. |
| `--form-align` | `start` | `align-items` de los campos; `stretch` hace que llenen el ancho. |
| `--form-space-gap` | `var(--spacing_inset-xs)` | Espaciado entre campos. |

Los campos quedan a su ancho natural por defecto, ya que `align-items` es
`start`. Un formulario cuyos inputs deban abarcar todo el ancho establece la
alineación:

```html preview
<div style="--form-align: stretch;">
  <kb-form autorender>
    <template>
      <kb-input name="city"><kb-label>Ciudad</kb-label></kb-input>
      <kb-button type="submit" width="fill">Guardar</kb-button>
    </template>
  </kb-form>
</div>
```

## Estados y accesibilidad

- `hidden` elimina el formulario del layout y del árbol de accesibilidad.
- El `<form>` interno es un elemento de formulario real, así que la validación
  nativa se ejecuta al enviar: un campo inválido bloquea `submitted` y se
  reporta a sí mismo. No necesitas comprobar la validez antes de despachar.
- **Los campos viven en el shadow DOM del host**, no en el light DOM de la
  página. Un `<label for>` externo no puede alcanzarlos — etiqueta cada campo
  con su propio `<kb-label>`.
- Dale al formulario un nombre accesible cuando la página tenga más de uno:
  `<kb-form aria-label="Registro">`. No existe etiquetado derivado del `name`.
- Mantén el control de envío dentro de la plantilla. Un botón fuera del elemento
  pertenece a otro formulario, o a ninguno, y no enviará este.

## Recomendado y no recomendado

| Haz | No hagas |
|---|---|
| Poner cada campo y el botón de envío dentro del `<template>` | Colocar campos como hijos del light DOM — nunca se proyectan |
| Usar `autorender` para un formulario en blanco, `render(data)` para uno relleno | Llamar a `render()` en cada cambio y borrar lo que la persona escribió |
| Leer los valores enviados desde `event.detail` | Consultar el shadow DOM en busca de los campos para recoger valores |
| Dejar que la validación nativa controle el envío | Volver a comprobar los campos en script antes de llamar a `submit()` |
