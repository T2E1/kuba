# Label

El nombre de un campo de formulario: un estilo tipográfico fijo, algo más pesado
que el texto corrido, que se asigna a sí mismo `slot="label"` al conectarse. Es
el nombre visible — **no** es un `<label>` nativo, así que hacer clic en él no
enfoca el campo.

```html preview
<kb-input name="fullname">
  <kb-label>Nombre completo</kb-label>
</kb-input>
```

## Uso

```html
<kb-input name="email">
  <kb-label>Email</kb-label>
</kb-input>
```

## Cuándo usarlo

- **Nombrando un campo** — dentro de `<kb-input>`, `<kb-textarea>` o
  `<kb-fileupload>`, que exponen todos un slot `label`.
- **Nombrando un grupo de controles**, donde un título sería demasiado fuerte y
  el texto corrido demasiado tenue.

## Cuándo no usarlo

- **Explicando o restringiendo la entrada** — eso es `<kb-helper>`, la línea más
  pequeña bajo el campo. Una etiqueta sigue siendo un nombre.
- **Un mensaje atado a la validación** — usa `<kb-validity>`, que solo aparece
  para la clave de `ValidityState` que observa.
- **Cualquier otro texto** — `<kb-text>` es el elemento de propósito general,
  con atributos de tamaño, color y peso. Este no tiene ninguno, a propósito:
  cada etiqueta de campo del producto se ve igual.
- **Un título de sección** — usa `<kb-text size="lg" weight="bold">`, o un
  elemento de encabezado real para el esquema del documento. Una etiqueta no
  lleva semántica de encabezado.

## Composición

- **Puede contener**: texto y markup inline — el shadow root es un único
  `<slot>` sin nombre. Un marcador de obligatorio o un `<kb-icon>` inline
  funcionan; el contenido de nivel de bloque no, ya que el host es
  `inline-flex`.
- **Puede ser hijo de**: cualquier componente que exponga un slot `label`.
  Colocado en cualquier otro sitio sigue renderizando, pero el `slot="label"`
  que se pone a sí mismo no coincide con nada.

El elemento establece su propio atributo `slot` al conectarse, así que lo anidas
y no escribes nada más:

```html preview
<kb-textarea name="bio">
  <kb-label>Bio</kb-label>
  <kb-helper>Una o dos frases sobre ti.</kb-helper>
</kb-textarea>
```

## Contenido

Nombra el campo con las menos palabras posibles, con mayúscula solo en la
primera: "Nombre completo", no "Por favor escribe aquí tu nombre completo".
Cualquier cosa más larga pertenece a un `<kb-helper>`.

Mantén la etiqueta estable — un nombre que cambia mientras la persona escribe, o
que hace de placeholder, la deja sin nada a lo que volver.

## Atributos

Este elemento no tiene atributos y no despacha eventos. Su estilo tipográfico es
fijo por decisión de diseño, para que las etiquetas de campo sean uniformes en
todo el producto.

## Estilos

| Custom property | Por defecto | Controla |
|---|---|---|
| `--label-color` | `var(--color-master-dark)` | Color del texto. |
| `--label-font-family` | `var(--font-family-base)` | Familia tipográfica. |
| `--label-font-size` | `var(--font-size-xxs)` (14px) | Tamaño de la tipografía. |
| `--label-font-weight` | `var(--font-weight-medium)` | Peso de la tipografía — lo que separa una etiqueta de una línea de helper. |
| `--label-line-height` | `var(--line-height-default)` | Interlínea. |

Existen para cambios a nivel de superficie — un panel invertido, un formulario
más denso — no para ajustes puntuales:

```html preview
<div style="--label-color: var(--color-primary); --label-font-size: 16px;">
  <kb-input name="highlighted">
    <kb-label>Una etiqueta desplazada para una superficie</kb-label>
  </kb-input>
</div>
```

## Estados y accesibilidad

- `kb-label` no tiene atributo `hidden` ni custom states.
- **No es un `<label>`.** No hay atributo `for` ni asociación implícita, así que
  hacer clic en él no enfoca el campo, y un lector de pantalla no lo anunciará
  como el nombre del control solo por proximidad. Dale al control su propio
  nombre accesible — `aria-label` en el campo, o un `id` aquí más
  `aria-labelledby` en el control.
- Marcar un campo como obligatorio aquí es solo visual; establece `required` en
  el propio campo para que el estado se exponga y se valide, y deja que el
  marcador sea el eco visible de eso.
- Una etiqueta oculta o eliminada deja el campo sin nombre. Mantenla presente
  incluso cuando el diseño sea compacto — un placeholder no es sustituto.

## Recomendado y no recomendado

| Haz | No hagas |
|---|---|
| Anidarla dentro del campo y dejar que se coloque sola | Poner `slot="label"` a mano — el elemento ya lo hace |
| Darle al control un nombre accesible propio | Confiar en `kb-label` para nombrar el campo ante la tecnología de asistencia |
| Mantenerla en una frase nominal corta, con mayúscula solo al inicio | Convertirla en una instrucción — eso es `<kb-helper>` |
| Mantener la etiqueta visible junto al campo | Reemplazarla por un placeholder que desaparece al enfocar |
