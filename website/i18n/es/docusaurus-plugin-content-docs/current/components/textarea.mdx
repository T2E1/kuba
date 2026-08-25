# Textarea

Un campo de texto multilínea que crece con lo que se escribe en él. Envuelve un
`<textarea>` real y reporta valor y validez al `<form>` propietario mediante
`ElementInternals`, así que se envía como un control nativo — con el tirador de
redimensionado manual eliminado, ya que la altura se gestiona por ti.

```html preview
<kb-textarea name="bio" placeholder="Cuéntanos sobre ti" required>
  <kb-label>Bio</kb-label>
  <kb-helper>Una o dos frases.</kb-helper>
</kb-textarea>
```

## Uso

```html
<kb-textarea name="bio" required>
  <kb-label>Bio</kb-label>
</kb-textarea>
```

```js
document.querySelector('kb-textarea').addEventListener('changed', (event) => {
  console.log(event.detail) // el valor actual
})
```

## Cuándo usarlo

- **Texto libre más largo que una línea** — una bio, una nota, un mensaje, una
  descripción.
- **Contenido cuya longitud varía mucho entre personas** — el campo crece en vez
  de forzar un desplazamiento dentro de una caja fija.

## Cuándo no usarlo

- **Un valor de una línea** — usa `<kb-input>`, que lleva el conjunto completo
  de atributos de restricción (`type`, `pattern`, `min`/`max`) que este elemento
  no tiene.
- **Texto enriquecido** — esto es texto plano: sin formato, sin vista previa,
  sin barra de herramientas.
- **Documentos muy largos** — un campo que crece sin límite empuja la acción de
  envío fuera de la pantalla. Pasados unos pocos párrafos, una vista de editor
  sirve mejor.

## Composición

- **Puede contener**: contenido para sus tres slots con nombre — `label`,
  `helper` y `validity`. Cualquier cosa sin slot se descarta. `<kb-label>`,
  `<kb-helper>` y `<kb-validity>` se asignan al slot correspondiente al
  conectarse, así que anidarlos es toda la configuración.
- **Puede ser hijo de**: un `<form>`, la plantilla de un `<kb-form>`, o de nada
  — funciona por sí solo, solo que no tiene formulario al que enviarse.

```html preview
<kb-textarea name="note" required>
  <kb-label>Nota</kb-label>
  <kb-validity state="valueMissing">Escribe algo primero.</kb-validity>
</kb-textarea>
```

## Altura y crecimiento

El campo empieza en `--textarea-size-min-height` (128px, unas cuatro líneas) y
crece con cada entrada: el manejador restablece la altura y vuelve a aplicar
`scrollHeight`, así que la caja siempre se ajusta exactamente a su contenido.

Dos consecuencias:

- **Nunca se encoge por debajo del mínimo, y nunca se desplaza.**
  `overflow: hidden` con `resize: none` significa que el contenido siempre está
  completamente visible. Una respuesta larga hace un campo largo.
- **El crecimiento es estilo inline en el elemento interno**, aplicado por cada
  evento de entrada. Establecer una `height` desde fuera se sobrescribe en
  cuanto la persona escribe — usa `--textarea-size-min-height` para cambiar el
  tamaño inicial.

Elige la altura mínima para señalar la longitud de respuesta esperada: una caja
de dos líneas invita a una frase, una de ocho líneas invita a un párrafo.

```html preview
<div style="--textarea-size-min-height: 72px;">
  <kb-textarea name="brief" placeholder="Con una frase basta">
    <kb-label>Resumen</kb-label>
  </kb-textarea>
</div>
```

## Validación

Las restricciones se declaran como atributos y las evalúa el navegador; el
desenlace se refleja en el host como un custom state `invalid`.

- `required` es la restricción que aplica aquí — las restricciones de longitud y
  formato de `<kb-input>` no las reenvía este elemento.
- Lee el resultado mediante `checkValidity()`, `reportValidity()`, `validity` y
  `validationMessage`.
- Mientras el host es `invalid`, el slot `helper` se oculta, así que el mensaje
  de error sustituye a la pista en vez de apilarse debajo.

`reset()` limpia el valor y el estado inválido y despacha `reset`, que es como
el reinicio de `<kb-form>` llega al campo.

## Atributos

| Atributo | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `name` | `string` | `''` | Nombre del campo en el `FormData` del formulario propietario. |
| `value` | `string` | — | Valor actual. Establecerlo reejecuta la validación y despacha `changed`. |
| `placeholder` | `string` | — | Placeholder, reenviado al `<textarea>` interno. |
| `required` | `boolean` | `false` | Si se exige un valor para la validez. |
| `disabled` | `boolean` | `false` | Deshabilita el campo y lo excluye del envío. |
| `readonly` | `boolean` | `false` | Bloquea la edición pero mantiene el valor en `FormData`. |
| `id` | `string` | cae a `name` | Lo usa el `<label for>` interno. |
| `width` | `auto` \| `fill` \| longitud | `auto` | Cómo llena el campo su contenedor. |
| `hidden` | `boolean` | `false` | Elimina el campo del layout y del árbol de accesibilidad. |

## Métodos

| Método | Devuelve | Descripción |
|---|---|---|
| `checkValidity()` | `boolean` | Valida y dispara `invalid` si falla. |
| `reportValidity()` | `boolean` | Valida y reporta el problema a la persona. |
| `reset()` | `this` | Limpia el valor y el estado inválido, despacha `reset`. |

## Eventos

| Evento | Se dispara cuando | `detail` |
|---|---|---|
| `changed` | el valor cambia, en cada tecla | el valor nuevo |

Es el mismo nombre de evento que publican `<kb-input>` y `<kb-fileupload>`, así
que un solo arco sirve para cualquiera de los tres campos.

## Estilos

| Custom property | Por defecto | Controla |
|---|---|---|
| `--textarea-color-background` | `var(--color-master-lightest)` | Fondo del campo. |
| `--textarea-color-background_disabled` | `var(--color-master-lighter)` | Fondo cuando está deshabilitado o es de solo lectura. |
| `--textarea-color-border` | `var(--color-master-light)` | Borde en reposo. |
| `--textarea-color-focus` | `var(--color-primary)` | Borde al enfocar. |
| `--textarea-color-invalid` | `var(--color-danger)` | Borde mientras es `invalid`. |
| `--textarea-color-text` | `var(--color-master-darkest)` | Texto escrito. |
| `--textarea-color-text_disabled` | `var(--color-master)` | Texto cuando está deshabilitado o es de solo lectura. |
| `--textarea-color-placeholder` | `var(--color-master)` | Texto del placeholder. |
| `--textarea-font-family` | `var(--font-family-base)` | Familia tipográfica. |
| `--textarea-font-size` | `var(--font-size-xxs)` | Tamaño de la tipografía. |
| `--textarea-line-height` | `var(--line-height-lg)` | Interlínea — la palanca principal sobre cuántas líneas caben en la altura inicial. |
| `--textarea-size-min-height` | `128px` | Altura inicial, antes de que el campo crezca. |
| `--textarea-space-inset` | `var(--spacing_inset-nano) var(--spacing_inset-xs)` | Padding; acepta el atajo completo. |
| `--textarea-border-radius` | `var(--border-radius-sm)` | Redondeo de las esquinas. |
| `--textarea-space-gap` | `var(--spacing-nano)` | Espaciado entre etiqueta, campo y helper. |

El ancho es un atributo, no una custom property — establece `width` en lugar de
una regla CSS.

## Estados y accesibilidad

- `hidden` elimina el campo del layout y del árbol de accesibilidad.
- `invalid` es un custom state derivado de la API de Validación de
  Restricciones, no un atributo que tú pongas.
- El `<label for>` interno apunta al textarea interno vía `id`, con reserva a
  `name` — un campo sin ninguno de los dos tiene un control sin etiqueta.
- Al crecer el campo, todo lo que hay debajo baja. Mantén la acción de envío en
  una posición que sobreviva a eso, para que no se escape mientras la persona
  escribe.
- `disabled` elimina el campo del envío; `readonly` mantiene su valor en el
  `FormData`.

## Recomendado y no recomendado

| Haz | No hagas |
|---|---|
| Dimensionar `--textarea-size-min-height` según la respuesta esperada | Publicar los 128px por defecto para un campo que siempre guarda una línea |
| Establecer `name` (o `id`) para que la etiqueta asocie y el valor se envíe | Confiar en un `<kb-label>` visible por sí solo para nombrar el campo |
| Usar `<kb-input>` cuando la respuesta es de una línea | Recurrir a un textarea porque "se ve más espacioso" |
| Hacer throttle antes de lanzar una petición desde `changed` | Disparar una petición por tecla directamente desde el evento |
