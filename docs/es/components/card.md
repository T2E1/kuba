# Card

Una tarjeta agrupa contenido relacionado en un contenedor flex, estilizado
por tokens `--card-*`. Es una primitiva de layout, no un control — no tiene
acción propia. Cualquier clic, navegación o interacción por teclado
pertenece por completo al contenido colocado, como un `<kb-button>` o `<a>`
real, nunca a la tarjeta.

```html preview
<kb-card>
  <kb-text size="xs" weight="bold">Akita</kb-text>
  <kb-text size="xxxs" color="master">Dócil, valiente, digno</kb-text>
  <kb-button width="fill">Detalles</kb-button>
</kb-card>
```

## Uso

```html
<kb-card direction="row">
  <kb-text>Contenido</kb-text>
</kb-card>
```

## Cuándo usarlo

- **Agrupando contenido relacionado** — un título, un texto, una acción — en
  una única superficie visualmente contenida.
- **Organizando una fila o columna de contenido** con espaciado y padding
  consistentes, guiados por tokens de diseño en lugar de CSS suelto.

## Cuándo no usarlo

- **Esperando un evento `clicked` de la propia tarjeta.** La tarjeta no
  despacha nada — pon un `<kb-button>` o `<a>` real en el slot y escucha
  ahí.
- **Esperando que la tarjeta sea enfocable o anunciada por un lector de
  pantalla.** La tarjeta no añade rol, `tabindex` ni nombre accesible — es
  transparente para el árbol de accesibilidad. Solo el contenido colocado es
  alcanzable por teclado o tecnología de asistencia.

## Composición

- **Puede contener**: cualquier cosa — el shadow root es un único `<slot>`,
  y el contenedor flex de la tarjeta lo dispone. Nada se intercepta: un hijo
  interactivo conserva su propio clic, foco y comportamiento de teclado
  intactos.
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

Un valor no reconocido se ignora — la propiedad conserva el último
`direction` válido que tuvo (o el valor por defecto, si nunca se estableció
ninguno).

## Atributos

| Atributo | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `direction` | `row` \| `column` | `column` | Dirección flex del contenido colocado. Un valor no reconocido se ignora — la propiedad conserva el último direction válido que tuvo. |
| `width` | `auto` \| `fill` \| `hug` \| longitud | `auto` | Cómo llena la tarjeta su contenedor. |
| `height` | `auto` \| `fill` \| `hug` \| longitud | `auto` | Alto de la tarjeta. |
| `hidden` | `boolean` | `false` | Elimina la tarjeta del layout y del árbol de accesibilidad. |
| `on` | cadena de arco | — | Conexión de Echo, `origen/evento:tipo/destino`. |

## Eventos

Ninguno. La tarjeta no despacha nada propio — solo el contenido colocado
despacha.

## Estilos

Cada decisión visual es una custom property `--card-*` con valor por defecto
en un token global. Heredan a través de la frontera del shadow — establécelas
en el elemento o en cualquier ancestro, nunca metas mano en el shadow DOM.

| Custom property | Por defecto | Controla |
|---|---|---|
| `--card-color-background` | `var(--color-master-lighter)` | Fondo de la tarjeta. |
| `--card-border-radius` | `var(--border-radius-md)` | Radio de las esquinas. |
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
- La tarjeta no añade `role`, `tabindex` ni nombre accesible — nunca recibe
  foco, y un lector de pantalla ve exactamente el contenido colocado, como
  si la tarjeta no existiera.

## Recomendado y no recomendado

| Haz | No hagas |
|---|---|
| Anidar un `<kb-button>` o `<a>` real para cualquier cosa accionable | Esperar que la tarjeta emita `clicked` o actúe por sí sola |
| Confiar en el propio foco y comportamiento de teclado del control colocado | Añadir `tabindex` o un rol a la tarjeta para hacer que "parezca" interactiva |
| Sobrescribir los tokens `--card-*` para re-skin | Meter mano en el shadow DOM para cambiar fondo o padding |
