{/* TODO(058): sincronizar com docs/components/logo.md — a proporção da marca
     mudou de quadrado 1:1 para retrato 60:93 (--logo-size agora é altura, não
     lado); esta tradução ainda descreve "cuadrado"/"1:1" em vários pontos. */}

# Logo

La marca como SVG inline, dimensionada en un cuadrado y coloreada a partir de
`currentColor`. Es solo la marca — sin atributos, sin logotipo escrito, sin
comportamiento de enlace.

```html preview
<kb-logo></kb-logo>
```

## Uso

```html
<kb-logo></kb-logo>
```

## Cuándo usarlo

- **Identificando el producto en la parte superior de una página** — colocada en
  la región `leading` de `<kb-header>`, que es para lo que esa región está
  pensada.
- **Anclando una pantalla de entrada** — inicio de sesión, splash, estado vacío,
  donde la marca aparece sola sobre el contenido.
- **Marcando la propiedad en una barra de cierre** — junto a la línea de
  copyright en `<kb-footer>`.

## Cuándo no usarlo

- **Como enlace a la home por sí solo.** El elemento no renderiza ningún ancla;
  envuélvelo en un `<a href="/">` para que la marca sea navegable y enfocable.
- **Como icono genérico** — usa `<kb-icon>`, que resuelve cualquier glifo de
  Material Symbols por su nombre. Este renderiza un SVG fijo.
- **Para un conjunto con el nombre del producto.** Aquí es solo el símbolo; pon
  un `<kb-text>` al lado dentro de un `<kb-stack>` cuando necesites marca más
  nombre escrito.

## Composición

- **Puede contener**: ningún hijo relevante. El shadow root renderiza un `<svg>`
  fijo y no declara ningún slot, así que los hijos del light DOM nunca aparecen.
- **Puede ser hijo de**: cualquier cosa. Es un cuadrado de tamaño fijo que ni
  crece ni se encoge con su contenedor, así que compone de forma predecible
  dentro de una fila flex.

```html preview
<kb-stack direction="row" align="center" spacing="nano">
  <kb-logo></kb-logo>
  <kb-text size="sm" weight="bold">kuba</kb-text>
</kb-stack>
```

## Atributos

| Atributo | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `alt` | `string` | `''` | Nombre accesible de la marca. Sin poner, el logo queda oculto a la tecnología de asistencia. |

No despacha eventos; todo lo demás se controla mediante CSS.

## Estilos

| Custom property | Por defecto | Controla |
|---|---|---|
| `--logo-color` | `var(--color-primary)` | Color de relleno. El SVG se rellena con `currentColor`, así que esto es el `color` del host. |
| `--logo-size` | `40px` | Lado del cuadrado; alto y ancho se mueven juntos, manteniendo la proporción 1:1. |

Como la marca hereda `currentColor`, una sola declaración de `color` en un
ancestro la invierte sobre una superficie oscura — `--logo-color` es para el
caso en que la marca *no* deba seguir al texto que la rodea.

```html preview
<div style="--logo-size: 64px; --logo-color: var(--color-danger);">
  <kb-logo></kb-logo>
</div>
```

## Estados y accesibilidad

- `kb-logo` no tiene atributo `hidden` ni custom states.
- **Un logo sin nombre se oculta solo.** El SVG inline no lleva `<title>`, así
  que sería un gráfico sin etiqueta. Sin `alt`, el elemento se pone
  `aria-hidden="true"` — lo correcto siempre que un nombre escrito visible
  identifique el producto al lado.
- **Pon `alt` cuando la marca está sola**, como único contenido de un enlace a
  la home: `<kb-logo alt="kuba, inicio">`. Nombrar el enlace también sirve; haz
  una cosa o la otra, no ambas.
- La marca es un único trazado (`path`) relleno, así que mantiene sus
  proporciones en cualquier `--logo-size`; no necesita una variante pequeña
  aparte.

## Recomendado y no recomendado

| Haz | No hagas |
|---|---|
| Envolver la marca en un `<a>` cuando deba llevar a la home | Añadir un listener de clic — no tiene semántica de foco ni de enlace |
| Dejar que herede `currentColor` en superficies invertidas | Fijar un color que se rompe cuando la superficie cambia |
| Redimensionar con `--logo-size` para que el cuadrado siga siendo cuadrado | Poner `height` o `width` directamente y estirar la marca |
| Etiquetar el enlace que la envuelve, u ocultar la marca a los lectores de pantalla | Dejar un gráfico sin etiqueta como único contenido de un enlace |
