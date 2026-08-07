# Tipografía

La tipografía transmite jerarquía. Todo texto de la interfaz debe usar uno de
estos tokens según su importancia — nunca un `font-size` libre.

Definidos en `packages/pixel/tokens/fontSize.css`, `lineHeight.css`,
`fontFamily.css` y `fontWeight.css`.

## Tamaño de fuente

| Token | Valor | Muestra |
|---|---|---|
| `--font-size-xxxs` | 12px | <span style="font-size: var(--font-size-xxxs)">Ag</span> |
| `--font-size-xxs` | 14px | <span style="font-size: var(--font-size-xxs)">Ag</span> |
| `--font-size-xs` | 16px | <span style="font-size: var(--font-size-xs)">Ag</span> |
| `--font-size-sm` | 20px | <span style="font-size: var(--font-size-sm)">Ag</span> |
| `--font-size-md` | 24px | <span style="font-size: var(--font-size-md)">Ag</span> |
| `--font-size-lg` | 32px | <span style="font-size: var(--font-size-lg)">Ag</span> |
| `--font-size-xl` | 40px | <span style="font-size: var(--font-size-xl)">Ag</span> |
| `--font-size-xxl` | 48px | <span style="font-size: var(--font-size-xxl)">Ag</span> |
| `--font-size-xxxl` | 64px | <span style="font-size: var(--font-size-xxxl)">Ag</span> |
| `--font-size-display` | 80px | <span style="font-size: var(--font-size-display)">Ag</span> |
| `--font-size-giant` | 96px | <span style="font-size: var(--font-size-giant)">Ag</span> |

`<kb-text>`, `<kb-label>` y `<kb-icon>` resuelven su atributo `size` contra esta
escala, y por eso un icono dimensionado como el texto contiguo se alinea con él.

```html preview
<kb-stack direction="column" spacing="quarck" align="start">
  <kb-text size="xxxs">xxxs — leyendas y metadatos</kb-text>
  <kb-text size="xxs">xxs — el tamaño de cuerpo por defecto</kb-text>
  <kb-text size="xs">xs — cuerpo de texto cómodo</kb-text>
  <kb-text size="md">md — título de componente</kb-text>
</kb-stack>
```

## Altura de línea

| Token | Valor |
|---|---|
| `--line-height-default` | 100% |
| `--line-height-xs` | 115% |
| `--line-height-sm` | 120% |
| `--line-height-md` | 133% |
| `--line-height-lg` | 150% |
| `--line-height-xl` | 170% |
| `--line-height-xxl` | 200% |

Los valores más ajustados sirven a tipografías de display grandes, donde el 100%
mantiene un titular compacto. El cuerpo de texto pide `lg` o `xl` — cuanto mayor
la medida, más interlineado necesita para seguir siendo legible.

## Familia tipográfica

| Token | Valor |
|---|---|
| `--font-family-base` | `"Roboto", sans-serif` |
| `--font-family-highlight` | `"Roboto Condensed", sans-serif` |

`base` es la familia de cuerpo por defecto; `highlight` se reserva para títulos y
énfasis. Cambiar esos dos tokens basta para dar a una marca otra voz tipográfica
sin tocar ningún componente.

!> Las familias se nombran, no se empaquetan. Ninguna de las dos fuentes viene en
el paquete — cárgalas tú (Google Fonts, un `@font-face` propio), o sobrescribe
los tokens con familias que ya sirvas. Sin eso, el navegador cae en
`sans-serif`.

## Peso tipográfico

| Token | Valor | Muestra |
|---|---|---|
| `--font-weight-regular` | 400 | <span style="font-weight: var(--font-weight-regular)">El veloz murciélago</span> |
| `--font-weight-medium` | 500 | <span style="font-weight: var(--font-weight-medium)">El veloz murciélago</span> |
| `--font-weight-bold` | 700 | <span style="font-weight: var(--font-weight-bold)">El veloz murciélago</span> |

Tres pasos, a propósito. `medium` es lo que separa un `<kb-label>` de un
`<kb-helper>` al mismo tamaño — contraste suficiente para leerse como etiqueta,
no tanto como para leerse como título.
