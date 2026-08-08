# Inset

Cancela el padding de un ancestro en los lados que nombres, usando un margen
negativo, para que su contenido sangre hasta los bordes de ese ancestro — la
imagen a todo ancho en la parte superior de una tarjeta con padding. Es la
válvula de escape para un hijo, no un layout para muchos: flexiona su contenido,
recorta el desbordamiento, y redondea las esquinas que quedan dentro.

```html preview
<kb-card>
  <kb-inset side="top">
    <kb-cover
      src="https://picsum.photos/id/1084/640/360"
      alt="Un perro corriendo en la playa"
    ></kb-cover>
  </kb-inset>
  <kb-text size="xs" weight="bold">De borde a borde</kb-text>
  <kb-text size="xxxs" color="master">La imagen toca los bordes de la tarjeta; este texto no.</kb-text>
</kb-card>
```

## Uso

```html
<kb-inset side="top">
  <img src="/banner.png" alt="" />
</kb-inset>
```

## Cuándo usarlo

- **Una franja de medios dentro de una superficie con padding** — una imagen de
  portada o un mapa que deba tocar los bordes de la tarjeta mientras el texto
  alrededor sigue recogido.
- **Un divisor o franja teñida que abarca toda la superficie** — un corte de
  sección dentro de una `<kb-card>` que de otro modo se quedaría corto en ambos
  bordes.
- **Una barra de acciones al pie de un contenedor con padding** —
  `side="bottom"` mantiene las esquinas superiores rectas contra el contenido de
  arriba y redondea las dos que encuentran el borde del contenedor.

## Cuándo no usarlo

- **Espaciar hermanos** — eso es `<kb-stack>`. Un inset quita espacio; no lo
  distribuye.
- **Centrar el contenido de la página** — `<kb-main>` ya limita el ancho y
  centra la columna.
- **Cuando el padre no tiene padding.** El margen negativo entonces empuja el
  contenido *fuera* del padre en vez de hasta su borde. La distancia de la
  sangría es fija, no medida a partir del padre.
- **Redondear una imagen por sí sola** — un `border-radius` en la imagen es más
  simple. Recurre a esto solo cuando la sangría es el objetivo.

## Composición

- **Puede contener**: cualquier cosa — el shadow root es un único `<slot>` sin
  nombre. Los medios son el caso común, y el `overflow: hidden` significa que
  una imagen mayor que la caja queda recortada por las esquinas redondeadas en
  lugar de escaparse de ellas.
- **Puede ser hijo de**: un contenedor con padding cuyo padding coincida con la
  sangría. `<kb-card>` es el padre previsto; la sangría por defecto (16px) es
  exactamente el inset de la propia tarjeta, y por eso los dos encajan sin
  configuración.

El host es en sí mismo un contenedor flex, así que `direction` organiza varios
hijos como lo haría `<kb-stack>` — pero limítalo a lo que pertenece a la
sangría.

## Qué lado

`side` elige qué bordes sangran. El valor también dirige el redondeo de las
esquinas, para que las que encuentran el borde del padre sigan redondas y las
que encuentran el contenido queden rectas.

```html preview
<kb-card>
  <kb-inset side="bottom">
    <kb-cover
      src="https://picsum.photos/id/1069/640/360"
      alt="Sangrando hasta el borde inferior"
    ></kb-cover>
  </kb-inset>
</kb-card>
```

| `side` | Sangra | Redondea |
|---|---|---|
| `all` (por defecto) | todos los bordes | las cuatro esquinas |
| `top` | arriba, izquierda, derecha | las dos esquinas superiores |
| `bottom` | abajo, izquierda, derecha | las dos esquinas inferiores |
| `left` / `right` | ese borde más arriba y abajo | las dos esquinas de ese borde |
| `x` | izquierda y derecha solamente | nada — la franja queda abierta por ambos lados |
| `y` | arriba y abajo solamente | nada |

Un valor no reconocido cae a `all`, así que un error de tipeo sangra por todos
los lados en vez de fallar de forma visible.

## Atributos

| Atributo | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `side` | `all` \| `top` \| `bottom` \| `left` \| `right` \| `x` \| `y` | `all` | Qué bordes reciben el margen negativo, y qué esquinas siguen redondeadas. |
| `direction` | `row` \| `column` | `column` | Dirección flex del contenido colocado. |
| `width` | `auto` \| `fill` \| longitud | `auto` | Ancho del host. |
| `height` | `auto` \| longitud | `auto` | Alto del host. |
| `hidden` | `boolean` | `false` | Elimina el elemento y su contenido del layout y del árbol de accesibilidad. |

Este elemento no despacha eventos.

## Estilos

| Custom property | Por defecto | Controla |
|---|---|---|
| `--inset-space-bleed` | `var(--spacing_inset-xs)` (16px) | Cuánto se empuja el contenido hacia fuera en cada lado nombrado. Se aplica como margen negativo. |
| `--inset-border-radius` | `var(--border-radius-sm)` (8px) | Redondeo de las esquinas que quedan en el borde del padre. |

Haz coincidir la sangría con el padding del padre — ese es todo el contrato. Un
contenedor con padding de `--spacing_inset-md` necesita el mismo valor aquí, o
el contenido se queda corto respecto al borde o se pasa de él:

```html preview
<div style="--card-space-inset: 32px;">
  <kb-card>
    <kb-inset side="top" style="--inset-space-bleed: 32px; --inset-border-radius: 16px;">
      <kb-cover
        src="https://picsum.photos/id/1025/640/360"
        alt="Sangría ajustada a una tarjeta más holgada"
      ></kb-cover>
    </kb-inset>
    <kb-text size="xxs">Sangría y padding ambos a 32px.</kb-text>
  </kb-card>
</div>
```

!> El margen se declara con `!important` para sobrevivir a un padre que
establece márgenes en sus hijos. No puedes sobrescribir la sangría con un
`margin` normal desde fuera — cambia la custom property en su lugar.

## Estados y accesibilidad

- `hidden` añade el custom state `hidden` y `display: none`, eliminando el
  elemento y su contenido del layout y del árbol de accesibilidad.
- El elemento no renderiza rol ni landmark — es un contenedor visual. El
  contenido de dentro conserva su propia semántica, y el margen negativo no
  cambia el orden de lectura ni el de foco.
- `overflow: hidden` recorta, no desplaza. El contenido más alto que una
  `height` fija se corta en silencio, así que deja la altura automática salvo
  que busques el recorte.

## Recomendado y no recomendado

| Haz | No hagas |
|---|---|
| Ajustar `--inset-space-bleed` al padding del padre | Dejar la sangría por defecto dentro de un contenedor con otro padding |
| Usar `side` para sangrar solo los bordes que tocan al padre | Usar `all` y luego pelearte con el redondeo en los bordes internos |
| Poner un bloque de medios o una franja dentro | Tratarlo como contenedor de layout general — eso es `<kb-stack>` |
| Dejar que la altura siga al contenido | Fijar una altura y confiar en `overflow: hidden` para recortar en silencio |
