# Icon

Renderiza un glifo de Material Symbols por su nombre. Es un glifo, no un
control: sin comportamiento de clic, sin foco, sin etiqueta propia — ponlo
dentro de un `<kb-button variant="icon">` cuando la marca deba pulsarse.

```html preview
<kb-icon use="home"></kb-icon>
<kb-icon use="search" size="lg"></kb-icon>
<kb-icon use="favorite" color="danger"></kb-icon>
<kb-icon use="settings" size="xl" color="primary"></kb-icon>
```

## Uso

```html
<kb-icon use="home" size="md" color="primary"></kb-icon>
```

## Cuándo usarlo

- **Reforzando una acción etiquetada** — un icono junto al texto en un botón o
  elemento de menú, donde el glifo acelera el reconocimiento pero el texto lleva
  el significado.
- **Sustituyendo texto donde el espacio escasea** — una barra de herramientas de
  botones solo con icono, una affordance de cerrar, un marcador de estado en una
  fila densa.
- **Marcando estado junto al contenido** — un check, un aviso, una marca de
  error emparejada con un `<kb-text>`, tomando su color del mismo token
  semántico que el mensaje.

## Cuándo no usarlo

- **Como el propio elemento clicable.** No hay evento de clic, ni `tabindex`, ni
  nombre accesible. Envuélvelo en un `<kb-button variant="icon">`, que aporta el
  área de pulsación, el anillo de foco y la etiqueta.
- **Para la marca del producto** — usa `<kb-logo>`, que renderiza el logo real
  como SVG inline en lugar de un glifo de fuente.
- **Para ilustración decorativa o un bitmap** — este solo resuelve nombres de
  ligadura en una única familia de fuente.

## Composición

- **Puede contener**: ningún hijo relevante. El shadow root renderiza `use` tal
  cual como su contenido de texto, así que los hijos del light DOM se ignoran.
  Establece el glifo mediante el atributo, nunca escribiendo la ligadura entre
  las etiquetas.
- **Puede ser hijo de**: cualquier cosa que acepte contenido inline. Es
  `inline-flex` con `line-height: 1`, así que se apoya en la línea base del
  texto de un `<kb-text>`, dentro de la etiqueta de un `<kb-button>`, o en un
  `<kb-stack direction="row">` sin alineación extra.

```html preview
<kb-button>
  <kb-icon use="download"></kb-icon>
  Descargar
</kb-button>
<kb-button variant="icon" alt="Buscar">
  <kb-icon use="search"></kb-icon>
</kb-button>
```

## Tamaño

`size` selecciona un escalón de la escala tipográfica compartida, así que un
icono dimensionado como el texto de al lado se alinea con él — ese es el sentido
de reutilizar la escala en vez de valores en píxeles.

```html preview
<kb-icon use="star" size="xxxs"></kb-icon>
<kb-icon use="star" size="xs"></kb-icon>
<kb-icon use="star" size="md"></kb-icon>
<kb-icon use="star" size="xl"></kb-icon>
<kb-icon use="star" size="xxxl"></kb-icon>
```

| `size` | Se renderiza a | Úsalo para |
|---|---|---|
| `xxxs`–`xs` | 12–16px | Marcas inline dentro del texto corrido, filas densas de tabla. |
| `sm`–`md` | 20–24px | El rango por defecto: botones, affordances de formulario, elementos de lista. |
| `lg`–`xl` | 32–40px | Acciones aisladas en una barra de herramientas, marcas de estado vacío. |
| `xxl` en adelante | 48px+ | Ilustraciones destacadas, donde el glifo es el punto focal. |

## Color

Deja `color` sin definir en el caso común: el icono resuelve a `currentColor` y
hereda del texto que lo rodea, así que sigue siendo correcto sobre cualquier
fondo sin volver a especificarlo. Establécelo solo cuando el glifo lleve un
significado que el texto no lleva.

```html preview
<kb-icon use="check_circle" color="success"></kb-icon>
<kb-icon use="warning" color="warning"></kb-icon>
<kb-icon use="error" color="danger"></kb-icon>
<kb-icon use="info" color="info"></kb-icon>
```

`color` acepta una de ocho familias semánticas — un conjunto cerrado, no
cualquier sufijo de `--color-*`. Un valor no reconocido cae en `currentColor`.

| `color` | Significado |
|---|---|
| `primary` | Énfasis de marca — el icono de la acción principal de un grupo. |
| `success` / `complete` | Un estado terminado o válido. |
| `warning` | Un estado que necesita atención pero no bloquea. |
| `danger` | Un error, o la marca de una acción destructiva. |
| `info` | Un resalte informativo o neutro. |
| `menu` | Iconos dentro de superficies de navegación y menú. |
| `master` | Grises neutros, para iconos que deben retroceder respecto al texto. |

## Atributos

| Atributo | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `use` | `string` | `''` | Nombre de la ligadura de Material Symbols, p. ej. `home`, `search`. |
| `alt` | `string` | `''` | Nombre accesible. Sin poner, el icono queda oculto a la tecnología de asistencia. |
| `size` | uno de 11 escalones | `md` | Tamaño del glifo, resuelto contra `--font-size-{valor}`. |
| `color` | una de 8 familias | `currentColor` | Color del glifo, resuelto contra `--color-{valor}`. |
| `on` | cadena de arco | — | Conexión de Echo, `origen/evento:tipo/destino`. |

Este elemento no despacha eventos.

## Estilos

Más allá de los atributos, el renderizado del glifo se expone como propiedades
`--icon-*`. Los cuatro ejes de variación son los ejes de Material Symbols.

| Custom property | Por defecto | Controla |
|---|---|---|
| `--icon-color` | el atributo `color`, o `currentColor` | Color del glifo, sobrescribiendo el atributo. |
| `--icon-size` | `var(--font-size-{size})` | Tamaño del glifo, sobrescribiendo el atributo. |
| `--icon-fill` | `1` | Eje `FILL`: `1` sólido, `0` contorneado. |
| `--icon-weight` | `400` | Eje `wght`, `100`–`700` — hazlo coincidir con el texto cercano. |
| `--icon-grade` | `0` | Eje `GRAD`; un valor negativo pequeño adelgaza los glifos sobre fondos oscuros. |
| `--icon-optical-size` | `24` | Eje `opsz`; mantenlo cerca del tamaño renderizado en píxeles. |

```html preview
<div style="--icon-fill: 0; --icon-weight: 300;">
  <kb-icon use="home" size="xl"></kb-icon>
  <kb-icon use="settings" size="xl"></kb-icon>
  <kb-icon use="favorite" size="xl"></kb-icon>
</div>
```

## Por qué Material Symbols

El conjunto se eligió en lugar de dibujar uno desde cero: es gratuito, lo
mantiene Google, cubre la mayor parte de las necesidades de un producto digital
y — el factor decisivo — se entrega como **fuente**. Un glifo es un nombre de
ligadura, así que añadir un icono significa escribir `use="bookmark"`, y no
importar un recurso, registrar un sprite o engordar el bundle.

Esa elección es también lo que hace que `size` y `color` funcionen como
funcionan. Como el glifo es texto, resuelve contra la escala tipográfica y
hereda `currentColor` — por eso un icono se alinea con el texto de al lado, y
por eso cambiar la hoja de tokens de una marca reestiliza cada icono del
producto sin ningún atributo nuevo y sin variante de componente.

Si un glifo que necesitas no está en el conjunto, evalúa una librería de iconos
complementaria antes de dibujar uno a medida.

!> La fuente no viene incluida con kuba. Carga **Material Symbols Rounded** tú
mismo — sin ella, `use` se renderiza como texto literal en vez de glifo.

## Estados y accesibilidad

- `kb-icon` no tiene atributo `hidden` ni custom states.
- **Un icono sin nombre se oculta solo.** El glifo es texto en una fuente de
  símbolos, así que un lector de pantalla anunciaría el nombre crudo de la
  ligadura ("home"). Sin `alt`, el elemento se pone `aria-hidden="true"` — el
  valor correcto siempre que una etiqueta visible ya lleve el significado.
- **Pon `alt` cuando el icono es el significado**, y pasa a ser un `img` con
  nombre: `<kb-icon use="check" alt="Verificado">`.
- Cuando el icono es el único contenido de un control, nombra el control y no el
  icono — `<kb-button variant="icon" alt="Buscar">`. Nombrar ambos hace que lo
  mismo se anuncie dos veces.
- Un valor de `use` desconocido se renderiza como texto literal en vez de glifo;
  esa es la forma más rápida de detectar un error de tipeo en un nombre de
  ligadura.

## Recomendado y no recomendado

| Haz | No hagas |
|---|---|
| Dejar `color` sin definir para que el glifo herede de su texto | Poner color en cada icono "para ser explícito" — se rompe en superficies invertidas |
| Envolver el glifo en un `<kb-button variant="icon">` para hacerlo pulsable | Añadir un listener de clic a `kb-icon` — no tiene foco ni área de pulsación |
| Dejar `alt` sin poner cuando hay etiqueta de texto — el icono se oculta solo | Repetir en `alt` las mismas palabras de la etiqueta al lado, anunciándolas dos veces |
| Hacer coincidir `size` con el texto de al lado | Elegir tamaños a ojo con `--icon-size` cuando un escalón de la escala encaja |
