# Input

Un campo de texto de una línea que se comporta como uno nativo desde el punto de
vista del formulario: envuelve un `<input>` real en su shadow DOM y reporta
valor y validez al `<form>` propietario mediante `ElementInternals`. Asociado a
formulario, así que se envía sin campo oculto ni paso manual de `FormData`.

```html preview
<kb-input name="email" type="email" placeholder="tu@ejemplo.com" required>
  <kb-label>Email</kb-label>
  <kb-helper>Nunca lo compartiremos.</kb-helper>
</kb-input>
```

## Uso

```html
<kb-input name="email" type="email" required>
  <kb-label>Email</kb-label>
</kb-input>
```

```js
document.querySelector('kb-input').addEventListener('changed', (event) => {
  console.log(event.detail) // el valor actual
})
```

## Cuándo usarlo

- **Cualquier valor de una línea** — email, nombre, cantidad, fecha — dentro de
  un `<form>` o de un `<kb-form>`.
- **Campos que deben validar de forma nativa** — `required`, `pattern`, `min`,
  `max`, `minlength`, `maxlength` y `type` se reenvían al input interno, así que
  el navegador hace la comprobación.
- **Campos que publican cambios**, que Echo puede conectar a otro elemento sin
  listener.

## Cuándo no usarlo

- **Texto multilínea** — usa `<kb-textarea>`, que crece con su contenido.
- **Un archivo** — usa `<kb-fileupload>`, que muestra una vista previa de la
  selección y la codifica para el envío.
- **Elegir entre opciones conocidas** — un campo que espera uno de cinco valores
  debería ser un select o un grupo de radio. `pattern` no sustituye a un control
  restringido.

## Composición

- **Puede contener**: contenido para sus tres slots con nombre — `label`,
  `helper` y `validity`. Cualquier cosa sin slot se descarta. `<kb-label>`,
  `<kb-helper>` y `<kb-validity>` se asignan al slot correspondiente al
  conectarse, así que anidarlos es toda la configuración; más de un
  `<kb-validity>` puede compartir el slot.
- **Puede ser hijo de**: un `<form>`, la plantilla de un `<kb-form>`, o de nada
  — funciona por sí solo, solo que no tiene formulario al que enviarse.

```html preview
<kb-input name="password" type="password" required minlength="8">
  <kb-label>Contraseña</kb-label>
  <kb-helper>Al menos 8 caracteres.</kb-helper>
  <kb-validity state="valueMissing">Elige una contraseña.</kb-validity>
  <kb-validity state="tooShort">Al menos 8 caracteres.</kb-validity>
</kb-input>
```

## Validación

Las restricciones se declaran como atributos y las evalúa el navegador; el
resultado se refleja en el host como un custom state `invalid`, al que
reaccionan los estilos y `<kb-validity>`.

- Establece `required`, `pattern`, `min`/`max`, `minlength`/`maxlength` y `type`
  en el elemento — llegan al input interno sin cambios.
- Lee el desenlace mediante `checkValidity()`, `reportValidity()`, `validity` y
  `validationMessage`, la misma API que expone un input nativo.
- Mientras el host es `invalid`, el slot `helper` se oculta, así que el mensaje
  de error sustituye a la pista en vez de apilarse debajo. Una pista y su error
  no deberían repetirse entre sí.
- Dale a cada fallo su propio `<kb-validity state="…">`. Un mensaje genérico
  obliga a la persona a adivinar qué regla rompió.

`reset()` limpia el valor y el estado inválido y despacha `reset` — así es como
el reinicio de `<kb-form>` fluye hasta cada campo.

## Eventos

`changed` se dispara en cada cambio de valor, llevando el valor nuevo:

```html preview
<kb-input name="query" placeholder="Escribe aquí">
  <kb-label>Eco en vivo</kb-label>
</kb-input>
<kb-render>
  <kb-on value="query/changed:method/render"></kb-on>
  <template>Escribiste: {}</template>
</kb-render>
```

Se dispara **por cada tecla**, no al perder el foco, y se llama `changed`, no el
nativo `change`. Los filtros de arco no pueden hacerle debounce — son
transformaciones síncronas del payload y no pueden diferir el destino — así que
haz throttle dentro del método de destino, o usa un listener normal, antes de
lanzar una petición.

## Atributos

| Atributo | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `name` | `string` | `''` | Nombre del campo en el `FormData` del formulario propietario. |
| `type` | `string` | — | Tipo del input, reenviado al `<input>` interno. |
| `value` | `string` | — | Valor actual. Establecerlo reejecuta la validación y despacha `changed`. |
| `placeholder` | `string` | — | Placeholder, reenviado. |
| `required` | `boolean` | `false` | Si se exige un valor para la validez. |
| `disabled` | `boolean` | `false` | Deshabilita el campo y lo excluye del envío. |
| `readonly` | `boolean` | `false` | Bloquea la edición pero mantiene el valor en `FormData`. |
| `pattern` | `string` | — | Expresión regular con la que el valor debe coincidir. |
| `min` / `max` | `string` | — | Límites del valor, reenviados. |
| `minlength` / `maxlength` | `string` | — | Límites de longitud, reenviados. |
| `step` | `string` | — | Intervalo de paso para tipos numéricos y de fecha. |
| `inputmode` | `string` | — | Pista de teclado virtual, reenviada. |
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

## Estilos

| Custom property | Por defecto | Controla |
|---|---|---|
| `--input-color-background` | `var(--color-master-lightest)` | Fondo del campo. |
| `--input-color-background_disabled` | `var(--color-master-lighter)` | Fondo cuando está deshabilitado o es de solo lectura. |
| `--input-color-border` | `var(--color-master-light)` | Borde en reposo. |
| `--input-color-focus` | `var(--color-primary)` | Borde al enfocar. |
| `--input-color-invalid` | `var(--color-danger)` | Borde mientras es `invalid`. |
| `--input-color-text` | `var(--color-master-dark)` | Texto escrito. |
| `--input-color-text_disabled` | `var(--color-master)` | Texto cuando está deshabilitado o es de solo lectura. |
| `--input-color-placeholder` | `var(--color-master)` | Texto del placeholder. |
| `--input-font-family` | `var(--font-family-base)` | Familia tipográfica. |
| `--input-font-size` | `var(--font-size-xxs)` | Tamaño de la tipografía. |
| `--input-size-height` | `40px` | Alto del campo. |
| `--input-space-inset` | `var(--spacing_inset-nano) var(--spacing_inset-xs)` | Padding; acepta el atajo completo. |
| `--input-border-radius` | `var(--border-radius-sm)` | Redondeo de las esquinas. |
| `--input-space-gap` | `var(--spacing-nano)` | Espaciado entre etiqueta, campo y helper. |

El ancho es un atributo, no una custom property — establece `width` en lugar de
una regla CSS.

```html preview
<div style="--input-size-height: 56px; --input-font-size: 20px;">
  <kb-input name="hero" placeholder="Un campo más grande">
    <kb-label>Una pregunta por paso</kb-label>
  </kb-input>
</div>
```

## Estados y accesibilidad

- `hidden` elimina el campo del layout y del árbol de accesibilidad.
- `invalid` es un custom state establecido a partir de la API de Validación de
  Restricciones, no un atributo que tú pongas. Estilízalo con `:state(invalid)`;
  no lo fuerces.
- El `<label for>` interno apunta al input interno usando `id`, con reserva a
  `name`. **Un campo sin ninguno de los dos tiene un input sin etiqueta** — el
  `<kb-label>` visible por sí solo no lo nombra para la tecnología de
  asistencia.
- `disabled` elimina el campo del envío por completo; `readonly` lo mantiene en
  el `FormData`. Elige según si el valor debe seguir enviándose.
- El mensaje de error sustituye visualmente al helper. Si la pista lleva un
  requisito que la persona todavía necesita mientras corrige el error, repítelo
  en el mensaje de `<kb-validity>`.

## Recomendado y no recomendado

| Haz | No hagas |
|---|---|
| Establecer `name` (o `id`) para que la etiqueta asocie y el valor se envíe | Confiar en un `<kb-label>` visible por sí solo para nombrar el campo |
| Darle a cada restricción su propio `<kb-validity state="…">` | Publicar un "Entrada inválida" genérico para cada fallo |
| Hacer throttle antes de lanzar una petición desde `changed` | Disparar una petición por tecla directamente desde el evento |
| Usar `type` y `pattern` para que el navegador valide | Reimplementar la comprobación de formato en script y poner el estado a mano |
