# Design tokens

Los design tokens son las variables de estilo que están entre el diseño y el
código. En lugar de un valor suelto — `24px`, `#6d5cae` — esparcido por la base,
cada decisión visual recibe un nombre semántico y una única fuente de verdad.

Viven en `packages/pixel/tokens/`, un archivo CSS por grupo, todos declarados en
`:root` y entregados en `dist/kuba.css`. Los componentes los consumen mediante
`var(--nombre-del-token)` en el `style.js` de cada elemento — nunca un valor
fijo.

```css
/* Cambia el token, y cada elemento que lo usa lo sigue */
:root {
  --color-primary: #0b7285;
}
```

## Grupos

| Grupo | Define |
|---|---|
| [Colores](/es/foundations/tokens/colors) | La paleta semántica, con un valor claro y uno oscuro por token. |
| [Tipografía](/es/foundations/tokens/typography) | Tamaño de fuente, altura de línea, familia y peso. |
| [Espaciado](/es/foundations/tokens/spacing) | Espaciado de composición y espaciado interno (`inset`). |
| [Borde](/es/foundations/tokens/border) | Radio y grosor. |
| [Sombras](/es/foundations/tokens/shadows) | Niveles de elevación. |
| [Opacidad](/es/foundations/tokens/opacity) | Niveles de opacidad para estados y superposiciones. |

Todas las páginas de abajo renderizan los tokens en vivo, leyéndolos de la misma
hoja de estilo que cargaría tu página — las muestras cambian cuando cambian los
valores.

## La regla de nomenclatura

Cada token sigue `--{grupo}-{escala}`:

```
--spacing-md
--color-primary-dark
--font-size-xxs
```

**El nombre describe *qué* representa el token, nunca *dónde* se usa.** Eso es
lo que permite que `--color-danger` siga siendo correcto coloreando un botón, un
borde o un mensaje de validación — y lo que impide que la escala gane una
entrada nueva cada vez que se diseña una pantalla.

## Tokens frente a propiedades de componente

Los tokens son globales. Cada componente además expone sus propias propiedades
`--{componente}-*`, cuyo valor por defecto es un token — ve
[Estilos](/es/build-ui/theming) para saber cuándo usar cada uno.

```css
:root { --color-primary: #0b7285 }       /* cada elemento lo sigue */
.checkout kb-button { --button-size-height: 56px }  /* solo estos botones */
```
