# Header

La barra de apertura de una página: una franja que fija un grupo de contenido al
inicio de una fila centrada (`leading`) y otro a su final (`trailing`),
disponiendo cada región como una fila flex con espaciado entre sus hijos. Es un
landmark a nivel de página, no una barra de herramientas genérica — sin
atributos, sin eventos, y sin slot por defecto, así que cualquier cosa no
asignada a `leading` o `trailing` se descarta.

```html preview
<kb-header>
  <kb-logo slot="leading"></kb-logo>
  <nav slot="trailing">
    <kb-button variant="link">Docs</kb-button>
    <kb-button variant="link">Guías</kb-button>
  </nav>
</kb-header>
```

## Uso

```html
<kb-header>
  <kb-logo slot="leading"></kb-logo>
  <nav slot="trailing">…</nav>
</kb-header>
```

## Cuándo usarlo

- **Abriendo una página** con la identidad y la navegación que pertenecen a la
  parte superior — marca, navegación principal, menú de cuenta, un punto de
  entrada de búsqueda.
- **Emparejándolo con `<kb-footer>`** para que una página abra y cierre con la
  misma columna centrada de 1024px y la misma altura de barra de 72px.

## Cuándo no usarlo

- **La barra inferior de la página** — usa `<kb-footer>`, el landmark
  correspondiente de ese extremo. Comparte la geometría de fila centrada, pero
  deja sus regiones de slot sin estilos en lugar de disponerlas como filas flex.
- **Una cabecera dentro de una tarjeta, diálogo o sección.** Este renderiza un
  `<header>` nativo a nivel de página; una fila de título dentro de una
  superficie contenida es un
  `<kb-stack direction="row" justify="space-between">`.
- **Una barra de acciones.** Las dos regiones anclan contenido en extremos
  opuestos de una barra de altura fija. Una fila densa de botones que debería
  saltar de línea o desplazarse quiere un `<kb-stack>`, que crece con su
  contenido.

## Composición

- **Puede contener**: cualquier cosa que lleve `slot="leading"` o
  `slot="trailing"`. El elemento renderiza solo esos dos slots con nombre y
  ningún slot por defecto, así que los hijos sin slot nunca aparecen. `leading`
  suele llevar un `<kb-logo>`, opcionalmente seguido del nombre del producto;
  `trailing` lleva un `<nav>`, un `<kb-stack direction="row">` de botones de
  enlace, o un avatar.
- **Puede ser hijo de**: cualquier cosa, semánticamente la raíz de la página.

A diferencia de `<kb-footer>`, cada región es en sí misma una fila flex con
espaciado, así que varios elementos colocados en el mismo lado quedan espaciados
y centrados verticalmente sin ningún wrapper extra.

```html preview
<kb-header>
  <kb-stack slot="leading" direction="row" align="center" spacing="nano">
    <kb-logo></kb-logo>
    <kb-text size="xxs" weight="bold">kuba</kb-text>
  </kb-stack>
  <kb-button slot="trailing" variant="icon" alt="Cuenta">
    <kb-icon use="account_circle"></kb-icon>
  </kb-button>
</kb-header>
```

!> **El wrapper del shadow mide `100svw` de ancho** — abarca el viewport en vez
de su contenedor. Anidar uno dentro de un elemento más estrecho hace que lo
desborde. `<kb-footer>` tenía el mismo comportamiento y se cambió para llenar su
contenedor; este no.

## Contenido

Ambas regiones están vacías hasta que se rellenan — no hay contenido de reserva
en ninguno de los slots. Mantén cada lado en una línea: la barra mide 72px fijos
de alto y no crece, así que el contenido que salta de línea la desborda en vez
de agrandarla.

## Atributos

| Atributo | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `alt` | `string` | `''` | Nombre accesible del landmark, para páginas que llevan más de uno. |

No despacha eventos; el resto de su superficie es el par de slots con nombre.

## Estilos

| Custom property | Por defecto | Controla |
|---|---|---|
| `--header-size-height` | `72px` | Altura de la barra, tanto en el host como en la fila centrada interna. |
| `--header-size-max-width` | `1024px` | Límite de la fila de contenido centrada. |
| `--header-space-inset` | `var(--spacing_inset-xs)` | Padding interno de la fila centrada. |
| `--header-space-gap` | `var(--spacing_inset-xs)` | Espaciado entre elementos colocados en la misma región. |

`kb-header` no pinta ningún fondo propio, así que el fondo de la página se ve a
través — establece `background-color` directamente cuando la barra deba leerse
como una superficie separada:

```html preview
<div style="--header-size-height: 96px; --header-space-gap: 24px;">
  <kb-header style="background-color: var(--color-master-lightest)">
    <kb-logo slot="leading"></kb-logo>
    <kb-text slot="trailing" size="xxs">Una barra más alta y teñida</kb-text>
  </kb-header>
</div>
```

## Estados y accesibilidad

- `kb-header` no tiene atributo `hidden` ni custom states — elimina el propio
  elemento cuando la barra no deba estar en el layout.
- El host lleva el landmark `banner`, publicado mediante `ElementInternals`. El
  wrapper del shadow es deliberadamente no semántico: un `<header>` ahí también
  mapearía a `banner`, dejando dos landmarks anidados.
- Usa un único `kb-header` por página; un segundo divide ese landmark y hace
  ambiguo el "saltar a la cabecera de la página". Cuando una página necesite dos
  de verdad, dale un `alt` a cada uno para poder distinguirlos.
- Envuelve la navegación principal en un `<nav>` dentro del slot `trailing` para
  que tenga su propio landmark `navigation` — el landmark de la cabecera no
  describe los enlaces que contiene.
- El elemento no añade gestión del foco, así que los enlaces y botones colocados
  mantienen su orden de foco nativo: `leading` primero, siguiendo el orden de
  lectura.

## Recomendado y no recomendado

| Haz | No hagas |
|---|---|
| Colocar la marca en `leading` y la navegación en `trailing` | Dejar hijos sin slot — sin `slot=`, nunca se renderizan |
| Mantener un único `kb-header`, en la raíz de la página | Reutilizarlo como barra de título de una tarjeta o diálogo |
| Colocar varios elementos en una región y dejar que el espaciado incorporado los separe | Añadir un wrapper para recrear el espaciado que la región ya da |
| Mantener cada lado en una sola línea corta | Llenar la barra con contenido que salta de línea — la altura de 72px es fija |
