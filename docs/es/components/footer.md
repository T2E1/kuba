# Footer

La barra de cierre de una página: una franja que llena el ancho que recibe y
fija un grupo de contenido al inicio de una fila centrada (`leading`) y otro a
su final (`trailing`). Es un landmark a nivel de página, no un contenedor
genérico — sin atributos, sin eventos, y sin slot por defecto, así que cualquier
cosa no asignada a `leading` o `trailing` se descarta.

```html preview
<kb-footer>
  <kb-text slot="leading" size="xxxs">© 2026 Memoize</kb-text>
  <kb-text slot="trailing" size="xxxs">Política de Privacidad</kb-text>
</kb-footer>
```

## Uso

```html
<kb-footer>
  <kb-text slot="leading" size="xxxs">© 2026 Tu Empresa</kb-text>
  <kb-text slot="trailing" size="xxxs">Términos</kb-text>
</kb-footer>
```

## Cuándo usarlo

- **Cerrando una página** con el contenido legal o secundario que pertenece al
  final — línea de copyright, enlaces de privacidad y términos, selector de
  idioma.
- **Emparejándolo con `<kb-header>`** para que una página abra y cierre con la
  misma columna centrada de 1024px y la misma altura de barra de 72px.

## Cuándo no usarlo

- **La barra superior de la página** — usa `<kb-header>`, la misma primitiva de
  fila centrada, que dispone sus regiones como filas flex y es el landmark
  correspondiente de ese extremo.
- **Un pie dentro de una tarjeta, diálogo o sección.** Este renderiza un
  `<footer>` nativo y expone un landmark `contentinfo`, que pertenece a la
  página — usa un `<kb-stack>` para la fila de acciones al final de una
  superficie contenida.
- **Agrupar contenido arbitrario en dos columnas** — usa `<kb-stack>` o un
  `<kb-card direction="row">`. Este fija la altura y el ancho máximo.

## Composición

- **Puede contener**: cualquier cosa que lleve `slot="leading"` o
  `slot="trailing"`. El elemento renderiza solo esos dos slots con nombre y
  ningún slot por defecto, así que los hijos sin slot nunca aparecen. El
  contenido típico es `<kb-text>` para la línea de copyright y
  `<kb-button variant="link">` o `<a>` para enlaces secundarios.
- **Puede ser hijo de**: cualquier cosa. La barra llena el 100% del ancho que
  recibe y solo limita su fila interna, así que se adapta a un contenedor más
  estrecho en lugar de desbordarlo. Semánticamente sigue perteneciendo a la raíz
  de la página.

El wrapper de cada slot es un elemento simple y sin estilos — a diferencia de
`<kb-header>`, no dispone a sus hijos como fila flex. Dos elementos colocados en
la misma región fluyen inline sin espaciado, así que envuélvelos en un
`<kb-stack direction="row">` cuando necesites espacio entre ellos.

```html preview
<kb-footer>
  <kb-text slot="leading" size="xxxs">© 2026 Memoize</kb-text>
  <kb-stack slot="trailing" direction="row" spacing="nano">
    <kb-button variant="link">Privacidad</kb-button>
    <kb-button variant="link">Términos</kb-button>
  </kb-stack>
</kb-footer>
```

## Contenido

`leading` tiene contenido de reserva incorporado — una línea de copyright — que
se muestra siempre que no se coloca nada en él.

```html preview
<kb-footer>
  <kb-text slot="trailing" size="xxxs">Solo trailing está relleno</kb-text>
</kb-footer>
```

!> Trata la reserva como un placeholder, no como un valor por defecto para
publicar: fija un año, un nombre de empresa y un texto en portugués. Cualquier
página real debería colocar su propia línea. `trailing` no tiene reserva y queda
vacío hasta que se rellena.

Mantén ambos lados cortos — la barra mide 72px fijos de alto y no crece, así que
el contenido que salta de línea la desbordará en vez de agrandarla.

## Atributos

Este elemento no tiene atributos y no despacha eventos. Toda su superficie es el
par de slots con nombre.

## Estilos

| Custom property | Por defecto | Controla |
|---|---|---|
| `--footer-size-height` | `72px` | Altura de la barra, tanto en el host como en la fila centrada interna. |
| `--footer-size-max-width` | `1024px` | Límite de la fila de contenido centrada; por debajo, la fila sigue el ancho de la barra. |
| `--footer-space-inset` | `var(--spacing_inset-xs)` | Padding interno de la fila centrada. |

`kb-footer` no pinta ningún fondo propio, así que el fondo de la página se ve a
través — establece `background-color` directamente cuando la barra deba leerse
como una superficie separada:

```html preview
<div style="--footer-size-height: 96px;">
  <kb-footer style="background-color: var(--color-master-lighter)">
    <kb-text slot="leading" size="xxxs">Una barra más alta y teñida</kb-text>
    <kb-text slot="trailing" size="xxxs">Contacto</kb-text>
  </kb-footer>
</div>
```

## Estados y accesibilidad

- `kb-footer` no tiene atributo `hidden` ni custom states — elimina el propio
  elemento cuando la barra no deba estar en el layout.
- El `<footer>` interno expone un landmark `contentinfo` para la página. Usa un
  único `kb-footer` por página; un segundo divide ese landmark y hace ambiguo el
  "saltar al pie de página".
- El elemento no añade gestión del foco, así que los enlaces y botones colocados
  mantienen su orden de foco nativo — mantenlos en el orden de lectura que
  quieres, `leading` primero.

## Recomendado y no recomendado

| Haz | No hagas |
|---|---|
| Colocar tu propia línea de copyright en `leading` | Publicar la reserva incorporada, que fija un año, un nombre y un idioma |
| Mantener un único `kb-footer`, en la raíz de la página | Reutilizarlo como barra inferior de una tarjeta o diálogo |
| Envolver varios enlaces en un `<kb-stack direction="row">` | Colocar varios elementos lado a lado esperando que la región los espacie |
| Mantener ambos lados en una sola línea corta | Llenar la barra con contenido que salta de línea — la altura de 72px es fija |
