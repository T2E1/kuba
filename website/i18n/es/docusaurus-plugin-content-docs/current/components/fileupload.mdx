# Fileupload

Un objetivo de clic para elegir **una imagen**, que muestra en vista previa en
el sitio y envía como data URL en base64. Asociado a formulario, así que la
imagen codificada viaja en el `FormData` del formulario como cualquier otro
campo — sin manejo de multipart en la página.

```html preview
<kb-fileupload name="avatar" required>
  <kb-label>Sube una foto</kb-label>
  <kb-helper>PNG o JPG, hasta 5MB</kb-helper>
</kb-fileupload>
```

## Uso

```html
<kb-fileupload name="avatar" required>
  <kb-label>Sube una foto</kb-label>
</kb-fileupload>
```

```js
document.querySelector('kb-fileupload').addEventListener('changed', (event) => {
  console.log(event.detail) // 'data:image/png;base64,…'
})
```

## Cuándo usarlo

- **Una única imagen ligada a un registro** — un avatar, una portada, un logo —
  donde ver la elección antes de enviar importa.
- **Formularios que publican JSON** — el valor ya es una cadena, así que encaja
  en un cuerpo JSON sin un endpoint de subida aparte.

## Cuándo no usarlo

- **Varios archivos.** El input interno acepta un archivo y el elemento guarda
  un valor; una galería necesita otro control.
- **Archivos que no son imagen.** El input interno es `accept="image/*"` y la
  vista previa es un `<img>` — un selector de PDF mostraría una vista previa
  rota.
- **Archivos grandes.** El base64 infla el payload en torno a un tercio, y la
  cadena entera se mantiene en memoria y se publica inline. Pasados unos pocos
  megabytes, sube a un endpoint de almacenamiento y envía la URL resultante.

## Composición

- **Puede contener**: contenido para sus tres slots con nombre — `label`,
  `helper` y `validity`. Los dos primeros se renderizan dentro del propio
  objetivo, centrados bajo el icono; `validity` se renderiza debajo. Los tres se
  autoasignan al conectarse.
- **Puede ser hijo de**: un `<form>`, la plantilla de un `<kb-form>`, o de nada.

```html preview
<kb-fileupload name="cover" required>
  <kb-label>Imagen de portada</kb-label>
  <kb-helper>En horizontal funciona mejor.</kb-helper>
  <kb-validity state="valueMissing">Se requiere una imagen.</kb-validity>
</kb-fileupload>
```

## El valor

`file` guarda la imagen seleccionada como data URL en base64, producida por un
`FileReader` cuando la persona elige algo. Esa única decisión explica la mayor
parte del comportamiento del elemento:

- **Es una cadena.** Establece `file` con una data URL almacenada para
  prerrellenar la vista previa al editar un registro existente, y léela de
  vuelta igual.
- **La vista previa es el valor.** La capa de vista previa aparece exactamente
  cuando `file` no está vacío, así que no hay un estado aparte de "tiene
  selección" que rastrear.
- **El tamaño es responsabilidad tuya.** Ni el elemento ni el input interno
  imponen un máximo — enuncia el límite en el texto del helper y compruébalo al
  enviar, o el formulario publicará en silencio un payload demasiado grande.

`reset()` limpia el archivo y el estado inválido y despacha `reset`. El botón de
eliminar en la esquina de la vista previa hace lo mismo para la persona.

## Validación

- `required` es la única restricción: con él establecido y ningún archivo
  elegido, el elemento reporta `valueMissing`.
- Lee el desenlace con `checkValidity()`, `reportValidity()`, `validity` y
  `validationMessage`, como en cualquier control nativo.
- A diferencia de `<kb-input>` y `<kb-textarea>`, el texto del helper **no** se
  oculta mientras es inválido — la pista (formatos, límite de tamaño) sigue
  visible junto al error, que aquí suele ser lo que quieres.

## Atributos

| Atributo | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `name` | `string` | `''` | Nombre del campo en el `FormData` del formulario propietario. |
| `file` | `string` | `''` | La imagen como data URL en base64. Establecerla actualiza la vista previa y despacha `changed`. |
| `required` | `boolean` | `false` | Si debe seleccionarse un archivo para la validez. |
| `width` | `auto` \| `fill` \| longitud | `auto` | Cómo llena el objetivo su contenedor. |
| `hidden` | `boolean` | `false` | Elimina el campo del layout y del árbol de accesibilidad. |

## Métodos

| Método | Devuelve | Descripción |
|---|---|---|
| `checkValidity()` | `boolean` | Valida y dispara `invalid` si falla. |
| `reportValidity()` | `boolean` | Valida y reporta el problema a la persona. |
| `reset()` | `this` | Limpia el archivo y el estado inválido, despacha `reset`. |

## Eventos

| Evento | Se dispara cuando | `detail` |
|---|---|---|
| `changed` | se elige o se limpia un archivo | la data URL en base64 |

El payload es la imagen entera, así que prefiere un listener que la almacene
antes que un arco que la reenvíe por varios elementos.

## Estilos

| Custom property | Por defecto | Controla |
|---|---|---|
| `--fileupload-aspect-ratio` | `1.95/1` | Forma del objetivo **y** de la vista previa — mantenlas iguales para que la caja no salte cuando llega una imagen. |
| `--fileupload-color-background` | `transparent` | Fondo del objetivo vacío. |
| `--fileupload-color-border` | `var(--color-master-light)` | Borde del objetivo. |
| `--fileupload-color-border_hover` | `var(--color-primary)` | Borde al pasar el cursor — la affordance de que es clicable. |
| `--fileupload-color-icon-background` | `var(--color-primary-lighter)` | Disco detrás del icono de subida. |
| `--fileupload-border-radius` | `var(--border-radius-sm)` | Redondeo de las esquinas del objetivo y de la vista previa. |
| `--fileupload-space-inset` | `var(--spacing-xl) var(--spacing-md)` | Padding del objetivo; acepta el atajo completo. |
| `--fileupload-preview-fit` | `cover` | `object-fit` de la vista previa; `contain` muestra la imagen entera en vez de recortarla. |
| `--fileupload-space-gap` | `var(--spacing-nano)` | Espaciado entre el objetivo y el mensaje de validez. |

```html preview
<div style="--fileupload-aspect-ratio: 1/1; --fileupload-preview-fit: contain;">
  <kb-fileupload name="square">
    <kb-label>Avatar cuadrado</kb-label>
  </kb-fileupload>
</div>
```

## Estados y accesibilidad

- `hidden` elimina el campo del layout y del árbol de accesibilidad.
- El `<input type="file">` interno está oculto con `display: none` pero
  permanece en el DOM, envuelto por el `<label>` — eso es lo que hace que todo
  el objetivo sea clicable y alcanzable por teclado. No repliques el clic por
  script.
- La etiqueta no se asocia por `for`/`id` aquí; el input está anidado dentro de
  ella. El contenido colocado en `label` nombra al control solo mientras
  permanece dentro del objetivo — mantenlo ahí.
- El `<img>` de la vista previa se renderiza con `alt` vacío, así que se anuncia
  como decorativo. Es el texto de la etiqueta lo que le dice a quien usa lector
  de pantalla qué guarda el campo.
- El botón de eliminar está dentro del shadow DOM, así que su nombre accesible
  no puede establecerse desde fuera — conviene saberlo al auditar el formulario.

## Recomendado y no recomendado

| Haz | No hagas |
|---|---|
| Enunciar los límites de tamaño y formato en el texto del helper | Suponer que el elemento rechaza un archivo demasiado grande — no lo hace |
| Prerrellenar `file` con una data URL almacenada al editar | Reconstruir tú mismo la vista previa desde un elemento de imagen aparte |
| Mantener objetivo y vista previa en la misma proporción | Cambiar solo uno y dejar que la caja se redimensione cuando llega una imagen |
| Subir medios grandes a un endpoint de almacenamiento y enviar su URL | Publicar base64 de varios megabytes inline porque es cómodo |
