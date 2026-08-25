# Helper

La pequeña línea secundaria bajo un campo de formulario: una pista, un requisito
de formato, una nota. Lleva un único estilo tipográfico fijo y, al conectarse, se
asigna a sí misma `slot="helper"` — así que anidarla dentro de un campo es toda
la conexión que hace falta.

```html preview
<kb-input name="password" type="password" minlength="8">
  <kb-label>Contraseña</kb-label>
  <kb-helper>Debe tener al menos 8 caracteres.</kb-helper>
</kb-input>
```

## Uso

```html
<kb-input name="password">
  <kb-helper>Debe tener al menos 8 caracteres.</kb-helper>
</kb-input>
```

## Cuándo usarlo

- **Enunciando una restricción antes de que la persona choque con ella** — "Debe
  tener al menos 8 caracteres", "Formato: DD/MM/AAAA" — bajo el campo que
  describe.
- **Mostrando una nota sobre el campo** escrita por ti, y no derivada del
  `ValidityState` del navegador.
- **Añadiendo contexto que una etiqueta no debería llevar** — una etiqueta
  nombra el campo y se mantiene corta; el razonamiento va aquí.

## Cuándo no usarlo

- **Un mensaje atado a una clave de `ValidityState`** — usa
  `<kb-validity state="…">`, que escucha al campo padre y solo se muestra para
  ese fallo. Este elemento siempre está visible; no reacciona a la validez.
- **Nombrar el campo** — eso es `<kb-label>`, que se coloca solo en el slot
  `label` y lleva el estilo más grande, de peso medio.
- **Texto corrido** — `<kb-text>` es el elemento de texto general, con el
  conjunto completo de atributos de tamaño, color y peso. Este deliberadamente
  no tiene ninguno.

## Composición

- **Puede contener**: texto y markup inline — el shadow root es un único `<slot>`
  sin nombre. Un enlace dentro de la pista está bien; el contenido de nivel de
  bloque no, ya que el host es `inline-flex`.
- **Puede ser hijo de**: cualquier componente que exponga un slot `helper` —
  `<kb-input>`, `<kb-textarea>`, `<kb-fileupload>`. Colocado en cualquier otro
  sitio sigue renderizando, pero el `slot="helper"` que se pone a sí mismo no
  coincide con nada.

!> **En `<kb-input>` y `<kb-textarea>`, el helper se oculta mientras el campo es
inválido** — el mensaje de `<kb-validity>` ocupa su lugar, en vez de apilarse
debajo. Si la pista lleva un requisito que la persona todavía necesita mientras
corrige el error, repítelo en el mensaje de validez. `<kb-fileupload>` no hace
esto; su helper permanece visible.

```html preview
<kb-input name="username" required minlength="3">
  <kb-label>Nombre de usuario</kb-label>
  <kb-helper>Solo letras y números, mínimo 3 caracteres.</kb-helper>
  <kb-validity state="valueMissing">Elige un nombre de usuario — letras y números, mínimo 3.</kb-validity>
</kb-input>
```

## Contenido

Mantenlo en una línea. La tipografía es el escalón más pequeño de la escala
(12px) con la interlínea más holgada, lo que se lee bien en una línea y mal en
un párrafo.

Escribe el requisito, no el fallo: "Debe tener al menos 8 caracteres" dice qué
hacer antes *y* después del error, mientras que "Contraseña inválida" solo dice
que algo salió mal. Reserva el texto de error para `<kb-validity>`.

## Atributos

Este elemento no tiene atributos y no despacha eventos. Su estilo tipográfico es
fijo por decisión de diseño, para que las pistas se vean igual en todas partes.

## Estilos

| Custom property | Por defecto | Controla |
|---|---|---|
| `--helper-color` | `var(--color-master-dark)` | Color del texto. |
| `--helper-font-family` | `var(--font-family-base)` | Familia tipográfica. |
| `--helper-font-size` | `var(--font-size-xxxs)` (12px) | Tamaño de la tipografía. |
| `--helper-font-weight` | `var(--font-weight-regular)` | Peso de la tipografía. |
| `--helper-line-height` | `var(--line-height-lg)` | Interlínea. |

El color es el que más vale la pena tocar — usa un token semántico para que el
significado viaje con él, en vez de elegir un tono:

```html preview
<div style="--helper-color: var(--color-info);">
  <kb-input name="invite">
    <kb-label>Código de invitación</kb-label>
    <kb-helper>Opcional — déjalo en blanco para unirte al workspace público.</kb-helper>
  </kb-input>
</div>
```

## Estados y accesibilidad

- `kb-helper` no tiene atributo `hidden` ni custom states — elimina el elemento
  cuando la pista ya no aplique.
- **El elemento no lleva ninguna relación ARIA con el campo.** Un lector de
  pantalla solo lo lee si cae junto al input en el orden de lectura. Para
  garantizarlo, dale un `id` al helper y establece `aria-describedby` en el
  control.
- `--color-master-dark` sobre una superficie blanca tiene intencionadamente
  menos contraste que el texto corrido. Mantenlo por encima de 4.5:1 contra la
  superficie; si una pista debe notarse, promuévela a `<kb-validity>` o a un
  `<kb-text>` coloreado en vez de apagarla aún más.
- No dependas solo del color para una pista de advertencia — la redacción tiene
  que decirlo.

## Recomendado y no recomendado

| Haz | No hagas |
|---|---|
| Anidarlo dentro del campo y dejar que se coloque solo | Poner `slot="helper"` a mano — el elemento ya lo hace |
| Mantenerlo en una sola línea corta | Escribir un párrafo a 12px |
| Usar `<kb-validity>` para mensajes atados a un estado de validez | Alternar un `kb-helper` desde script para simular validación |
| Enlazarlo con `aria-describedby` desde el control | Suponer que la proximidad por sí sola lo asocia para lectores de pantalla |
