# Validity

Un mensaje de error ligado a un fallo. Observa una única clave de
`ValidityState` en su campo padre — `valueMissing`, `typeMismatch`, `tooShort` —
y solo se muestra mientras esa bandera concreta es verdadera, para que la
persona lea el motivo en vez de "inválido".

```html preview
<kb-input name="email" type="email" required minlength="6">
  <kb-label>Email</kb-label>
  <kb-validity state="valueMissing">Este campo es obligatorio.</kb-validity>
  <kb-validity state="typeMismatch">Introduce una dirección de email válida.</kb-validity>
  <kb-validity state="tooShort">Al menos 6 caracteres.</kb-validity>
</kb-input>
```

Escribe una sola letra, luego vacía el campo, para ver los tres mensajes
alternarse.

## Uso

```html
<kb-input name="email" type="email" required>
  <kb-validity state="typeMismatch">Introduce una dirección de email válida.</kb-validity>
</kb-input>
```

## Cuándo usarlo

- **Explicando el fallo de una restricción concreta** — un elemento por cada
  regla que el campo puede romper, cada uno con su propia redacción.
- **Sustituyendo el globo nativo del navegador** por un mensaje que vive en el
  layout, encaja con el diseño, y permanece visible mientras la persona corrige
  el campo.

## Cuándo no usarlo

- **Una pista que siempre es relevante** — eso es `<kb-helper>`, visible desde
  el principio. Este elemento es invisible hasta que su regla falla.
- **Un error a nivel de formulario** ("No se pudo guardar, inténtalo de nuevo")
  — eso no es un `ValidityState` de un campo. Renderízalo cerca de la acción de
  envío.
- **Fuera de un elemento asociado a formulario.** El elemento lee
  `parentElement.validity` directamente; sin ese padre nunca se vuelve visible y
  silenciosamente no hace nada.

## Composición

- **Puede contener**: el texto del mensaje y markup inline. El host es `inline`
  cuando se muestra, así que mantenlo en una frase.
- **Puede ser hijo de**: `<kb-input>`, `<kb-textarea>` o `<kb-fileupload>` — y
  solo como hijo **directo**, ya que es del padre de donde se lee `validity`. Se
  asigna a sí mismo `slot="validity"` al conectarse, así que anidarlo es toda la
  configuración.

Usa tantos como modos de fallo tenga el campo; son mutuamente excluyentes por
construcción, ya que el navegador reporta un fallo a la vez.

## Qué estado

`state` nombra una propiedad del
[`ValidityState`](https://developer.mozilla.org/docs/Web/API/ValidityState)
nativo del padre. Se usa como búsqueda por clave, así que debe coincidir
exactamente con la propiedad del DOM — camelCase, no el nombre del atributo que
la provoca.

| `state` | Se dispara cuando | Provocado por |
|---|---|---|
| `valueMissing` | el campo está vacío | `required` |
| `typeMismatch` | el valor no es del tipo correcto | `type="email"`, `type="url"` |
| `patternMismatch` | el valor no coincide con la regex | `pattern` |
| `tooShort` / `tooLong` | la longitud está fuera de rango | `minlength` / `maxlength` |
| `rangeUnderflow` / `rangeOverflow` | un número o fecha está fuera de rango | `min` / `max` |
| `stepMismatch` | el valor no está en la rejilla del paso | `step` |
| `badInput` | el navegador no puede interpretar lo escrito | letras en un `type="number"` |

!> Una clave mal escrita — `valuemissing`, o el nombre del atributo `required` —
se lee como `undefined` y el mensaje simplemente nunca aparece. No hay ninguna
advertencia. Revisa la ortografía primero cuando un mensaje no se muestre.

El elemento reevalúa en `changed`, `invalid` y `reset` provenientes de su padre,
así que se actualiza mientras la persona escribe y se limpia cuando el campo se
resetea.

## Contenido

Di qué hacer, no que algo está mal: "Introduce una dirección de email válida"
vale más que "Email inválido". Mantén cada mensaje en una línea — el elemento
usa el escalón más pequeño de la escala tipográfica.

## Atributos

| Atributo | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `state` | clave de `ValidityState` | — | Qué bandera de validez observar en el padre. |
| `on` | cadena de arco | — | Conexión de Echo, `origen/evento:tipo/destino`. |

Este elemento no despacha eventos. No tiene atributo `hidden` — la visibilidad
la dirige enteramente el custom state `invalid` que se pone a sí mismo.

## Estilos

| Custom property | Por defecto | Controla |
|---|---|---|
| `--validity-color` | `var(--color-danger)` | Color del mensaje. |
| `--validity-font-family` | `var(--font-family-base)` | Familia tipográfica. |
| `--validity-font-size` | `var(--font-size-xxxs)` | Tamaño de la tipografía. |
| `--validity-font-weight` | `var(--font-weight-regular)` | Peso de la tipografía. |
| `--validity-line-height` | `var(--line-height-lg)` | Interlínea. |

Los valores por defecto coinciden con `<kb-helper>` salvo por el color — algo
deliberado, ya que el error ocupa el lugar del helper en `<kb-input>` y
`<kb-textarea>` mientras el campo es inválido.

```html preview
<div style="--validity-color: var(--color-warning);">
  <kb-input name="nickname" minlength="3">
    <kb-label>Apodo</kb-label>
    <kb-validity state="tooShort">Los nombres cortos son difíciles de encontrar.</kb-validity>
  </kb-input>
</div>
```

## Estados y accesibilidad

- La visibilidad la dirige el custom state `invalid` de **este** elemento, que
  refleja la única clave de `ValidityState` que observa — no la validez general
  del padre. Estilízalo con `:state(invalid)`; no lo establezcas tú.
- `display: none` hasta que la regla falla significa que la tecnología de
  asistencia no ve nada al principio, y el mensaje aparece a mitad de la
  interacción sin ser anunciado. Añade `aria-live="polite"` en el elemento
  cuando el error deba oírse en el momento en que aparece.
- El mensaje no está enlazado al campo por `aria-describedby` — la asociación es
  estructural, no programática. Añade el atributo en el control cuando un lector
  de pantalla deba unirlos.
- El color por sí solo no lleva el error; la redacción sí. Por eso cada mensaje
  enuncia su propia regla.

## Recomendado y no recomendado

| Haz | No hagas |
|---|---|
| Anidar un elemento por cada modo de fallo | Escribir un mensaje genérico para todas las reglas |
| Hacer coincidir `state` con la clave de `ValidityState`, en camelCase | Usar el nombre del atributo (`required`) como estado |
| Mantenerlo como hijo directo del campo | Envolverlo en un `<div>` — es del padre de donde se lee la validez |
| Decirle a la persona cómo corregirlo | Enunciar solo que el valor es inválido |
