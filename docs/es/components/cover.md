# Cover

Una única imagen recortada, restringida a una proporción fija, construida a
partir de un par `src`/`alt`. Una primitiva de visualización, no un contenedor:
no tiene `<slot>`, así que nada compone dentro de ella, y no lleva
comportamiento de clic propio.

```html preview
<kb-cover
  src="https://picsum.photos/id/1025/640/360"
  alt="Un pug envuelto en una manta"
></kb-cover>
```

## Uso

```html
<kb-cover src="/banner.jpg" alt="El equipo en el encuentro de 2026"></kb-cover>
```

## Cuándo usarlo

- **Una imagen recortada de proporción fija** — un banner, un hero, una
  miniatura — donde el layout necesita una proporción predecible sin importar
  las dimensiones de la imagen de origen.
- **El área de imagen de una tarjeta**, típicamente envuelta en
  `<kb-inset side="top">` para un aspecto de borde a borde.

## Cuándo no usarlo

- **Contenido que no es puramente una imagen.** No hay `<slot>`; usa
  `<kb-card>` o markup normal para cualquier cosa que mezcle una imagen con
  texto o acciones.
- **Dirección de arte responsive** — múltiples fuentes por viewport, carga
  perezosa nativa. Este acepta un único `src`; usa un `<img>` o `<picture>`
  normal cuando necesites `srcset`, `sizes` o `loading`.

## Composición

- **Puede contener**: nada. El elemento renderiza un `<img>` interno a partir de
  `src` y `alt`; cualquier cosa colocada entre sus etiquetas se ignora.
- **Puede ser hijo de**: cualquier cosa. Suele anidarse dentro de un
  `<kb-inset>` dentro de una `<kb-card>`.

```html preview
<kb-card>
  <kb-inset side="top">
    <kb-cover
      src="https://picsum.photos/id/1062/640/360"
      alt="Un golden retriever en un campo"
    ></kb-cover>
  </kb-inset>
  <kb-text size="xs" weight="bold">Golden Retriever</kb-text>
  <kb-text size="xxxs" color="master">Inteligente, amigable, devoto</kb-text>
</kb-card>
```

## Orientación

`orientation` establece la proporción a la que se recorta la imagen, mediante
`object-fit: cover` en el `<img>` interno. No toca `src`, así que la misma
imagen funciona en cualquiera de las dos proporciones.

```html preview
<kb-cover
  src="https://picsum.photos/id/1025/640/360"
  alt="Recorte apaisado"
  orientation="landscape"
></kb-cover>
<kb-cover
  src="https://picsum.photos/id/1025/640/360"
  alt="Recorte vertical de la misma imagen"
  orientation="portrait"
></kb-cover>
```

| Orientación | Proporción | Úsala para |
|---|---|---|
| `landscape` (por defecto) | 16/9 | Banners anchos, heros, miniaturas en un layout horizontal. |
| `portrait` | 4/5 | Imágenes altas — fotos verticales, tarjetas mobile-first, miniaturas verticales. |

## Contenido

`alt` debe describir la imagen para quien no puede verla. Déjalo vacío
(`alt=""`) solo cuando la imagen es decorativa y el texto cercano ya transmite
la misma información — nunca lo omitas, y nunca repitas al pie de la letra un
pie de foto visible.

## Atributos

| Atributo | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `src` | `string` | `''` | URL de la imagen, reenviada al `<img>` interno. |
| `alt` | `string` | `''` | Texto alternativo, reenviado al `<img>` interno. |
| `orientation` | `landscape` \| `portrait` | `landscape` | Proporción a la que se recorta la imagen. |
| `on` | cadena de arco | — | Conexión de Echo, `origen/evento:tipo/destino`. |

Este elemento no despacha eventos.

## Estilos

| Custom property | Por defecto | Controla |
|---|---|---|
| `--cover-aspect-ratio-landscape` | `16/9` | Proporción cuando `orientation="landscape"`. |
| `--cover-aspect-ratio-portrait` | `4/5` | Proporción cuando `orientation="portrait"`. |
| `--cover-color-background` | `var(--color-pure-white)` | Fondo visible mientras la imagen carga, o si falla. |
| `--cover-border-radius` | `var(--border-radius-md)` | Radio de las esquinas del host y de su imagen recortada. |

```html preview
<div style="--cover-aspect-ratio-landscape: 1/1; --cover-border-radius: 8px;">
  <kb-cover
    src="https://picsum.photos/id/1074/400/400"
    alt="Una miniatura casi cuadrada"
  ></kb-cover>
</div>
```

## Estados y accesibilidad

- `kb-cover` no tiene atributo `hidden` ni custom states — no usa el mixin
  `Hidden`, así que elimina o envuelve el elemento cuando deba desaparecer del
  layout.
- El `<img>` interno conserva su rol nativo. Un `alt` ausente o vacío en una
  imagen con significado la hace invisible para los lectores de pantalla.
- El elemento no tiene comportamiento de clic. Envuélvelo en una `<kb-card>` o
  en un `<a>` cuando la imagen deba ser accionable.

## Recomendado y no recomendado

| Haz | No hagas |
|---|---|
| Escribir un `alt` real que describa la imagen | Dejar el `alt` vacío para una imagen que lleva significado |
| Elegir `orientation` según la proporción del layout | Suponer que un `src` dado coincide con ella — `object-fit: cover` recorta igualmente |
| Envolverlo en `<kb-card>` o `<a>` cuando deba ser clicable | Esperar que `kb-cover` despache un evento de clic |
| Sobrescribir los tokens `--cover-*` para re-skin | Meter mano en el shadow DOM para cambiar fondo o radio |
