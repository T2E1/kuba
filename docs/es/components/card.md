# Card

Una tarjeta agrupa contenido relacionado en una superficie, y puede actuar como
una única unidad clicable — un clic en cualquier punto de su interior se absorbe
y se vuelve a despachar como un solo evento `clicked` que lleva el `value` de la
tarjeta. Es una primitiva de agrupación, no un control: por sí sola no tiene
anillo de foco, cursor ni rol.

```html preview
<kb-card>
  <kb-text size="xs" weight="bold">Akita</kb-text>
  <kb-text size="xxxs" color="master">Dócil, valiente, digno</kb-text>
  <kb-button width="fill">Detalles</kb-button>
</kb-card>
```

## Uso

```html
<kb-card direction="column" variant="filled" value="42">…</kb-card>
```

```js
document.querySelector('kb-card').addEventListener('clicked', (event) => {
  select(event.detail) // el `value` de la tarjeta
})
```

## Cuándo usarlo

- **Agrupando contenido relacionado** — un título, un texto, una acción — en una
  única superficie visualmente contenida.
- **Haciendo que toda una región emita un único evento `clicked`**, como una
  celda de resultado que se selecciona, conectada a otro elemento con `on` o
  `<kb-on>`.

## Cuándo no usarlo

- **Una acción única.** Usa `<kb-button>`: un control real asociado a
  formulario, con las affordances correctas y comportamiento de teclado, y no un
  contenedor que resulta ser clicable.
- **Navegar a una URL.** Pon un `<a>` dentro, o un `<kb-button>` conectado a un
  `<kb-redirect>`. La tarjeta no tiene concepto de destino.

## Composición

- **Puede contener**: cualquier cosa — el shadow root es un único `<slot>`, y el
  contenedor flex de la tarjeta lo dispone. Un clic en cualquier descendiente se
  absorbe y se reemite como el `clicked` de la propia tarjeta, así que un hijo
  interactivo y la tarjeta compiten por el mismo gesto. Mantén una tarjeta como
  grupo pasivo **o** como unidad clicable única, nunca ambas.
- **Puede ser hijo de**: cualquier cosa. Habitualmente dentro de una lista de
  `<kb-render>` o de una región de layout.

```html preview
<kb-card direction="row">
  <kb-cover src="https://picsum.photos/id/237/120/120" landscape></kb-cover>
  <kb-stack direction="column" spacing="quarck">
    <kb-text size="xxs" weight="bold">Labrador</kb-text>
    <kb-text size="xxxs" color="master">Amable, extrovertido, ágil</kb-text>
  </kb-stack>
</kb-card>
```

## Dirección

`direction` controla cómo se apila el contenido colocado, no cómo se ve.

| Dirección | Disposición | Úsala para |
|---|---|---|
| `column` (por defecto) | Pila vertical | El caso común — título sobre cuerpo sobre acciones. |
| `row` | Fila horizontal | Contenido pensado para ir lado a lado, como una miniatura junto a una etiqueta. |

## Variantes

`variant` lo lee directamente el CSS — no existe una propiedad `variant` en JS.
Expresa el tratamiento de la superficie, no el énfasis.

```html preview
<kb-card variant="filled">
  <kb-text size="xxs">Filled — el valor por defecto, en una página normal</kb-text>
</kb-card>
<kb-card variant="outlined">
  <kb-text size="xxs">Outlined — para usar sobre una superficie rellena</kb-text>
</kb-card>
```

| Variante | Superficie | Úsala para |
|---|---|---|
| `filled` (por defecto) | Fondo relleno sutil | La tarjeta por defecto sobre un fondo de página normal. |
| `outlined` | Fondo blanco con borde fino | Una tarjeta apoyada **sobre** una superficie rellena, donde una `filled` se confundiría. |

## Atributos

| Atributo | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `direction` | `row` \| `column` | `column` | Dirección flex del contenido colocado. |
| `variant` | `filled` \| `outlined` | `filled` | Tratamiento de la superficie. Solo CSS; sin propiedad JS. |
| `value` | `string` | `''` | Payload enviado como `detail` del evento `clicked`. |
| `width` | `auto` \| `fill` \| longitud | `auto` | Cómo llena la tarjeta su contenedor. |
| `height` | `auto` \| longitud | `auto` | Alto de la tarjeta. |
| `hidden` | `boolean` | `false` | Elimina la tarjeta del layout y del árbol de accesibilidad. |
| `on` | cadena de arco | — | Conexión de Echo, `origen/evento:tipo/destino`. |

## Eventos

| Evento | Se dispara cuando | `detail` |
|---|---|---|
| `clicked` | cualquier clic dentro de la tarjeta | el atributo `value` |

## Estilos

Cada decisión visual es una custom property `--card-*` con valor por defecto en
un token global. Heredan a través de la frontera del shadow — establécelas en el
elemento o en cualquier ancestro, nunca metas mano en el shadow DOM.

| Custom property | Por defecto | Controla |
|---|---|---|
| `--card-color-background` | `var(--color-master-lighter)` | Fondo de la tarjeta `filled`. |
| `--card-color-background-outlined` | `var(--color-pure-white)` | Fondo de la variante `outlined`. |
| `--card-color-border` | `var(--color-master-light)` | Color del borde de `outlined`. |
| `--card-border-width` | `var(--border-width-hairline)` | Grosor del borde de `outlined`. |
| `--card-border-radius` | `var(--border-radius-md)` | Radio de las esquinas, en ambas variantes. |
| `--card-space-gap` | `var(--spacing_inset-xs)` | Espaciado entre hijos colocados. |
| `--card-space-inset` | `var(--spacing_inset-xs)` | Padding interno. |

```html preview
<div style="--card-border-radius: 8px; --card-space-inset: 8px;">
  <kb-card>
    <kb-text size="xxs">Más plana y más ajustada, acotado a un área</kb-text>
  </kb-card>
</div>
```

## Estados y accesibilidad

- `hidden` elimina la tarjeta del layout y de la interacción. Prefiérelo a no
  renderizar el elemento cuando la presencia o ausencia deba seguir siendo
  localizable.
- **Una tarjeta clicable es invisible para la tecnología de asistencia por
  defecto.** El elemento no añade `role`, `tabindex` ni manejador de teclado,
  así que `clicked` es solo de ratón. Si toda la tarjeta debe ser accionable,
  añade `role="button"` y `tabindex="0"` y conecta la activación por teclado —
  o mejor, anida un `<kb-button>` real y deja que la tarjeta siga siendo un
  grupo pasivo.

## Recomendado y no recomendado

| Haz | No hagas |
|---|---|
| Mantener una tarjeta como grupo pasivo o como unidad clicable única | Anidar un hijo interactivo *y* confiar en el `clicked` de la tarjeta — pelean por el mismo clic |
| Usar `outlined` para una tarjeta sobre una superficie rellena | Usar `outlined` sobre un fondo normal, donde `filled` ya se lee bien |
| Anidar un `<kb-button>` o `<a>` real para una tarjeta accionable | Confiar en el `clicked` de la tarjeta como única affordance para quien usa teclado |
| Sobrescribir los tokens `--card-*` para re-skin | Meter mano en el shadow DOM para cambiar fondo o padding |
