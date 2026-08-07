# Formularios

Los controles de formulario de kuba son **custom elements asociados a
formulario**: desde el punto de vista del `<form>` propietario, se comportan como
inputs nativos. Envían, validan, se resetean. Esta página es cómo encajan las
piezas; la página de cada elemento tiene el contrato completo.

## Las piezas

| Elemento | Papel |
|---|---|
| `<kb-form>` | Renderiza campos desde un `<template>`, publica `submitted` con los datos parseados |
| `<kb-input>` | Valor de una línea |
| `<kb-textarea>` | Valor de varias líneas, crece con el contenido |
| `<kb-fileupload>` | Una imagen, como data URL en base64 |
| `<kb-label>` | El nombre visible del campo |
| `<kb-helper>` | La pista bajo el campo |
| `<kb-validity>` | Un mensaje de error, ligado a una regla de validación |

Los tres últimos se asignan al slot correcto al conectarse, así que componer un
campo es anidar y nada más:

```html preview
<kb-input name="email" type="email" required>
  <kb-label>Correo</kb-label>
  <kb-helper>Nunca lo compartiremos.</kb-helper>
  <kb-validity state="valueMissing">El correo es obligatorio.</kb-validity>
  <kb-validity state="typeMismatch">Eso no es un correo.</kb-validity>
</kb-input>
```

## La validación es del navegador

No escribes lógica de validación. Declara restricciones como atributos, y el
navegador las evalúa mediante la Constraint Validation API:

| Atributo | Falla con |
|---|---|
| `required` | `valueMissing` |
| `type="email"` / `type="url"` | `typeMismatch` |
| `pattern` | `patternMismatch` |
| `minlength` / `maxlength` | `tooShort` / `tooLong` |
| `min` / `max` | `rangeUnderflow` / `rangeOverflow` |
| `step` | `stepMismatch` |

El resultado se refleja en el host como un estado personalizado `invalid`, que
gobierna tanto el estilo del campo como la visibilidad de cada `<kb-validity>`.

**Un mensaje por regla.** Un `<kb-validity state="tooShort">` aparece solo
mientras esa bandera concreta es verdadera, así la persona lee el motivo en lugar
de "inválido":

```html preview
<kb-input name="password" type="password" required minlength="8">
  <kb-label>Contraseña</kb-label>
  <kb-helper>Al menos 8 caracteres.</kb-helper>
  <kb-validity state="valueMissing">Elige una contraseña.</kb-validity>
  <kb-validity state="tooShort">Al menos 8 caracteres.</kb-validity>
</kb-input>
```

?> `<kb-textarea>` y `<kb-fileupload>` solo reenvían `required` — las
restricciones de longitud, rango y patrón son exclusivas de `<kb-input>`.

### El texto de ayuda desaparece

Mientras un campo es inválido, `<kb-input>` y `<kb-textarea>` ocultan el slot
`helper` para que el error ocupe su lugar en vez de apilarse debajo. Dos
consecuencias:

- No hagas que la pista y el error digan lo mismo — la persona ve uno a la vez.
- Si la pista lleva un requisito que sigue haciendo falta durante la corrección,
  repítelo en el mensaje de validez.

`<kb-fileupload>` no hace esto; su texto de ayuda permanece visible.

## Leer los valores

`<kb-form>` publica `submitted` con los datos ya parseados en un objeto indexado
por el `name` de cada campo:

```html preview
<kb-form autorender id="signup-demo">
  <template>
    <kb-input name="email" type="email" required>
      <kb-label>Correo</kb-label>
    </kb-input>
    <kb-input name="company">
      <kb-label>Empresa</kb-label>
    </kb-input>
    <kb-button type="submit">Crear cuenta</kb-button>
  </template>
</kb-form>

<kb-text id="signup-out" size="xxs" color="master">nada enviado aún</kb-text>

<script type="module">
  document.querySelector('#signup-demo').addEventListener('submitted', (event) => {
    document.querySelector('#signup-out').textContent = JSON.stringify(event.detail)
  })
</script>
```

La validación nativa corre primero, así que `submitted` nunca dispara con un
campo inválido. No hay un "¿el formulario es válido?" que escribir.

También puedes prescindir del elemento de formulario y leer los campos
directamente — cada control expone `value`, `validity`, `checkValidity()` y
`reportValidity()`, la misma API de un input nativo.

## Los campos viven en un shadow root

`<kb-form>` renderiza su `<template>` en su propio shadow DOM. Eso tiene
consecuencias que conviene interiorizar:

- **Los hijos de light DOM fuera del template no se proyectan.** Los campos deben
  estar dentro del `<template>`.
- **Un `<label for>` externo no alcanza un campo.** Etiqueta cada uno con su
  propio `<kb-label>`.
- **`document.querySelector('input')` no los encuentra.** Lee los valores de
  `submitted`, no consultando.
- **El control de envío también debe estar dentro del template** — un botón fuera
  pertenece a otro formulario, o a ninguno.

## Rellenar para una edición

`autorender` renderiza un formulario en blanco al conectarse. Para editar,
prescinde de ese atributo y llama a `render(data)` cuando llegue el registro —
cada `{path}` del template se sustituye:

```html
<kb-form id="edit-user">
  <template>
    <kb-input name="name" value="{name}"><kb-label>Nombre</kb-label></kb-input>
    <kb-button type="submit">Guardar</kb-button>
  </template>
</kb-form>
```

```js
document.querySelector('#edit-user').render({ name: 'Ada Lovelace' })
```

!> Cada llamada a `render()` reemplaza los campos — **y lo que la persona haya
escrito**. Renderiza cuando llegan los datos, nunca en cada cambio.

## Accesibilidad

Las partes que requieren tu atención, porque los elementos no las hacen por ti:

- **Da nombre a cada campo.** El `<label for>` interno apunta al control interno
  por el `id`, cayendo en `name`. Un campo sin ninguno de los dos queda sin
  etiqueta — el `<kb-label>` visible por sí solo no lo nombra para la tecnología
  asistiva.
- **`<kb-validity>` no está ligado al campo.** La asociación es estructural, no
  programática. Añade `aria-describedby` en el control cuando un lector de
  pantalla deba unirlos, y `aria-live` cuando el error deba anunciarse al
  aparecer.
- **Nombra el formulario** cuando la página tiene más de uno:
  `<kb-form aria-label="Registro">`.
- **`disabled` frente a `readonly`**: `disabled` saca el campo del envío por
  completo; `readonly` mantiene su valor en los datos. Elige según deba enviarse
  o no.

## Resetear

`reset()` en un campo limpia su valor y su estado inválido. El `reset()` de
`<kb-form>` se propaga a todos los campos y publica `resetted`. Un
`<kb-button type="reset">` dentro del template hace lo mismo desde el markup.

Un patrón común es un formulario que se limpia tras una alta exitosa:

```html
<kb-form name="add-item" autorender>
  <template>…</template>
  <kb-on value="add-item/submitted:method/reset"></kb-on>
</kb-form>
```

## Después

- **[Form](/es/components/form)**, **[Input](/es/components/input)**,
  **[Validity](/es/components/validity)** — los contratos completos.
- **[Recetario › CRUD de usuarios](/es/build-ui/patterns/user-crud)** — un formulario
  conectado a un dataset y una lista, sin ningún listener.
