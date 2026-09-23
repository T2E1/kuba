# Stack

Un contenedor flex con espaciado basado en tokens: organiza lo que se coloque en
él en una fila o una columna, alineado y espaciado por atributo. Una primitiva
de layout sin superficie propia — sin fondo, sin padding, sin borde — así que
nunca parece nada por sí sola.

```html preview
<kb-stack direction="row" spacing="xs">
  <kb-button>Guardar</kb-button>
  <kb-button variant="naked">Cancelar</kb-button>
</kb-stack>
```

## Uso

```html
<kb-stack direction="column" align="stretch" spacing="nano">…</kb-stack>
```

## Cuándo usarlo

- **Espaciando un grupo de hermanos de forma consistente** — una fila de
  botones, una columna de campos, una barra de herramientas — sin una regla flex
  puntual por grupo.
- **Anclando contenido en extremos opuestos** con `justify="space-between"`.
- **Agrupando contenido dentro del slot de otro componente**, donde el padre te
  da una región y necesitas varios elementos organizados en ella.

## Cuándo no usarlo

- **Una barra de cabecera o pie de página** — `<kb-header>` y `<kb-footer>` son
  las versiones con landmark de la misma idea de fila centrada, con altura fija
  y ancho máximo. Un stack no tiene ninguno de los dos y no expone landmark.
- **Una superficie visible** — una agrupación que necesita fondo, padding o
  borde es una `<kb-card>`.
- **Una rejilla bidimensional** — esta es una única línea flex; los hijos nunca
  saltan de línea. Usa CSS Grid cuando importan filas *y* columnas.
- **Espaciar texto dentro de un párrafo** — `<kb-text>` lleva su propio ritmo.

## Composición

- **Puede contener**: cualquier cosa. El shadow root es un único `<slot>` sin
  nombre, así que cada hijo se renderiza en el orden del código como un ítem
  flex. Uno o más `<kb-on>` también funcionan como hijos, para arcos extra
  más allá del atributo único `on` — se conectan directamente al stack y no
  renderizan nada, así que tampoco cuentan como ítems flex.
- **Puede ser hijo de**: cualquier cosa, incluido otro `kb-stack`. Anidar una
  columna de filas es la forma normal de construir un layout bidimensional a
  partir de esta primitiva, ya que un solo stack nunca salta de línea.

```html preview
<kb-stack direction="column" spacing="nano" align="stretch">
  <kb-stack direction="row" justify="space-between">
    <kb-text size="xxs" weight="bold">Total</kb-text>
    <kb-text size="xxs">R$ 240,00</kb-text>
  </kb-stack>
  <kb-button width="fill">Finalizar compra</kb-button>
</kb-stack>
```

Como el host es el contenedor flex, los hijos se estiran o encogen según las
reglas habituales de flex — un hijo con `flex: 1` llena el espacio sobrante.

## Dirección, alineación y espaciado

`direction`, `align`, `justify` y `spacing` aceptan todos un conjunto cerrado
de valores. Un valor desconocido se ignora y la *propiedad* conserva su
último valor válido — nunca llega a la hoja de estilos sin verificar. El
atributo en el DOM sigue mostrando lo que se haya escrito; lee la propiedad,
no `getAttribute()`, para ver lo que realmente se aplica.

| Atributo | Actúa a lo largo de | Valores aceptados |
|---|---|---|
| `justify` | la dirección del stack (eje principal) | `normal`, `start`, `end`, `center`, `stretch`, `left`, `right`, `space-between`, `space-around`, `space-evenly`, `flex-start`, `flex-end` |
| `align` | transversal a ella (eje cruzado) | `normal`, `start`, `end`, `center`, `stretch`, `baseline`, `flex-start`, `flex-end`, `self-start`, `self-end` |

`start`/`end` son la grafía preferida para ambos atributos; `flex-start`/
`flex-end` se aceptan como alias heredados.

En una `row`, `align="center"` centra verticalmente ítems de distintas alturas;
en una `column`, `align="stretch"` hace que los hijos llenen el ancho. Cambiar
`direction` intercambia qué atributo hace qué — revisa ambos cuando un stack
cambia de orientación.

```html preview
<kb-stack direction="row" justify="space-between" align="center" style="width: 100%">
  <kb-text size="xxs">Fijado a la izquierda</kb-text>
  <kb-button variant="link">Fijado a la derecha</kb-button>
</kb-stack>
```

`spacing` selecciona un escalón de la escala de inset, lo que mantiene el ritmo
entre grupos predecible a lo largo de una página:

| `spacing` | Espaciado | Úsalo para |
|---|---|---|
| `quarck` / `nano` | 4 / 8px | Elementos que se leen como una unidad — icono y etiqueta, campo y helper. |
| `xs` | 16px | El valor por defecto: hermanos dentro de un grupo. |
| `sm` / `md` | 24 / 32px | Separando grupos dentro de una sección. |
| `lg` / `huge` / `giant` | 40px+ | Separación a nivel de sección, donde `<kb-inset>` puede servir mejor. |

`spacing` acepta solo estos ocho escalones de la escala de inset. Un valor
desconocido se ignora y el espaciado conserva su último escalón válido.

## Atributos

| Atributo | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `direction` | `row` \| `column` | `row` | Dirección flex aplicada al host. |
| `align` | conjunto cerrado, ver [arriba](#dirección-alineación-y-espaciado) | `start` | Alineación en el eje cruzado. |
| `justify` | conjunto cerrado, ver [arriba](#dirección-alineación-y-espaciado) | `start` | Alineación en el eje principal. |
| `spacing` | conjunto cerrado, ver [arriba](#dirección-alineación-y-espaciado) | `xs` | Espaciado, resuelto contra `--spacing_inset-{valor}`. |
| `width` | `auto` \| `fill` \| longitud | `auto` | Ancho del host. |
| `height` | `auto` \| longitud | `auto` | Alto del host. |
| `hidden` | `boolean` | `false` | Elimina el stack y sus hijos del layout y del árbol de accesibilidad. |
| `on` | cadena de arco | — | Conexión de Echo, `origen/evento:tipo/destino`. |

Este elemento no despacha eventos.

## Estilos

El espaciado es la única decisión también expuesta como custom property — útil
cuando debe responder a una media query, algo que un atributo no puede hacer.

| Custom property | Por defecto | Controla |
|---|---|---|
| `--stack-space-gap` | `var(--spacing_inset-{spacing})` | Espaciado entre hijos, sobrescribiendo el atributo `spacing`. |

```css
@media (width < 600px) {
  kb-stack.toolbar { --stack-space-gap: var(--spacing_inset-nano); }
}
```

Todo lo demás (`align`, `direction`, `justify`, `height`, `width`) es un
atributo aplicado directamente al host — establece esos en lugar de sobrescribir
las mismas propiedades en CSS.

## Estados y accesibilidad

- `hidden` añade el custom state `hidden` y `display: none`, eliminando el stack
  y sus hijos del layout y del árbol de accesibilidad.
- **El host se declara presentacional** (`role="none"`), así que la pila en sí
  no añade ningún nodo al árbol de accesibilidad, y no tiene nombre
  accesible — no hay atributo `alt`. La semántica de grupo tiene que venir de
  lo que pongas dentro — un `<nav>`, una `<ul>`, un fieldset.
- El orden visual sigue al orden del código, así que el orden de teclado
  coincide con el de la pantalla. No lo inviertas con
  `flex-direction: row-reverse` desde fuera.

## Recomendado y no recomendado

| Haz | No hagas |
|---|---|
| Elegir un escalón de `spacing` de la escala | Definir un espaciado puntual en píxeles junto a una escala que ya sirve |
| Anidar stacks para construir un layout bidimensional | Esperar que los hijos salten de línea — un stack es una única línea flex |
| Recurrir a `<kb-card>` cuando el grupo necesita superficie | Añadir fondo y padding a un stack para simular una |
| Mantener el orden del código igual al orden de lectura | Reordenar visualmente con `row-reverse` u `order` |
