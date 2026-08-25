# Main

El cuerpo de una página: una columna centrada, limitada a un ancho legible, con
padding, con un espaciado consistente entre sus hijos, y lo bastante alta como
para empujar el pie de página al final en páginas cortas. La tercera pieza del
marco de la página — `<kb-header>` arriba, `kb-main` en medio, `<kb-footer>`
abajo.

```html preview
<kb-main>
  <kb-text size="lg" weight="bold">Título de la página</kb-text>
  <kb-text size="xs">Los hijos directos se apilan en vertical con el espaciado incorporado.</kb-text>
  <kb-card>
    <kb-text size="xxs">No hace falta ningún wrapper extra.</kb-text>
  </kb-card>
</kb-main>
```

## Uso

```html
<kb-main>
  <h1>Título de la página</h1>
  <p>Contenido de la página.</p>
</kb-main>
```

## Cuándo usarlo

- **La región de contenido de una página**, una vez por página, entre la
  cabecera y el pie.
- **Cualquier pantalla que deba seguir siendo legible en un monitor ancho** — el
  límite de ancho mantiene la longitud de línea en rango sin un wrapper propio.
- **Páginas cuyo contenido es corto** — la altura mínima mantiene el pie al
  final del viewport en lugar de flotando a media pantalla.

## Cuándo no usarlo

- **Una sección dentro de la página.** Esta es la región `main` de la página y
  solo hay una por página. Agrupa una sección con `<kb-stack>` o `<kb-card>`.
- **Un layout a sangre.** La columna está limitada y centrada por diseño. El
  contenido que deba abarcar el viewport va fuera de ella, o escapa del padding
  con `<kb-inset>`.
- **Un layout de dos columnas.** Esta es una única columna flex; anida un
  `<kb-stack direction="row">` dentro para regiones lado a lado.

## Composición

- **Puede contener**: cualquier cosa — el shadow root es un único `<slot>` sin
  nombre. Los hijos se apilan en vertical con el espaciado entre ellos, así que
  la mayoría de las páginas no necesita wrapper extra: secciones, tarjetas y
  títulos pueden ser hijos directos.
- **Puede ser hijo de**: la raíz de la página, típicamente `<body>`. Se centra
  solo y ocupa el 100% del ancho disponible hasta su límite.

## El marco de la página

La altura mínima por defecto es `calc(100svh - 144px)`, donde 144px son los 72px
de `<kb-header>` más los 72px de `<kb-footer>`. Eso es lo que hace que una
página casi vacía siga llenando el viewport, con el pie descansando al final en
lugar de subir hacia el medio.

Cambia cualquiera de las tres alturas y tienen que cambiar juntas — una cabecera
más alta con el desplazamiento por defecto deja la página con scroll
exactamente por la diferencia:

```css
:root {
  --header-size-height: 96px;
  --footer-size-height: 96px;
}

kb-main {
  --main-size-offset: 192px; /* 96 + 96 */
}
```

Las páginas sin cabecera o pie deberían reducir el desplazamiento a `0px`, no
mantener el valor por defecto.

## Atributos

| Atributo | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `alt` | `string` | `''` | Nombre accesible del landmark, para páginas que llevan más de uno. |

No despacha eventos.

## Estilos

| Custom property | Por defecto | Controla |
|---|---|---|
| `--main-size-max-width` | `480px` | Límite de la columna de contenido. |
| `--main-space-inset` | `var(--spacing_inset-xs)` | Padding alrededor de la columna. |
| `--main-space-gap` | `var(--spacing_inset-md)` | Espaciado vertical entre hijos directos. |
| `--main-size-offset` | `144px` | Altura restada del viewport para la altura mínima — la cabecera más el pie. |

El valor por defecto de 480px es una medida de columna única, mobile-first. Una
aplicación densa de escritorio que combine `kb-main` con `<kb-header>`
normalmente quiere que la columna coincida con la propia franja de 1024px de la
cabecera:

```html preview
<div style="--main-size-max-width: 720px; --main-space-gap: 16px; --main-size-offset: 0px;">
  <kb-main>
    <kb-text size="xs">Una columna más ancha, con un espaciado más ajustado.</kb-text>
    <kb-text size="xs">Desplazamiento a cero, ya que aquí no hay cabecera ni pie.</kb-text>
  </kb-main>
</div>
```

## Estados y accesibilidad

- `kb-main` no tiene atributo `hidden` ni custom states.
- **El host lleva el landmark `main`**, publicado mediante `ElementInternals`,
  así que "saltar al contenido" funciona sin markup propio. El shadow root es
  solo un slot, y por eso el rol pertenece al host.
- Mantén uno por página. Dos regiones de contenido hacen el landmark ambiguo,
  igual que lo harían dos `<kb-header>`.
- El límite de ancho es lo que mantiene legible la longitud de línea;
  sobrescribirlo mucho más allá de ~75 caracteres de texto cambia legibilidad
  por densidad.

## Recomendado y no recomendado

| Haz | No hagas |
|---|---|
| Usar exactamente un `kb-main` por página | Anidar uno dentro de otro, o reutilizarlo por sección |
| Mantener `--main-size-offset` en sincronía con las alturas de las barras | Cambiar las barras y dejar el desplazamiento en 144px |
| Dejar que los hijos directos hereden el espaciado incorporado | Añadir márgenes a los hijos para recrear el espaciado que la columna ya da |
| Nombrar el landmark con `alt` cuando la página lleva más de uno | Añadir `role="main"` a mano — el elemento ya lo publica |
