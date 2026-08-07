# Sombras

Niveles de elevación, definidos en `packages/pixel/tokens/shadow.css`.

| Token | Desplazamiento Y | Blur | Muestra |
|---|---|---|---|
| `--shadow-level-0` | — | `none` | <span class="box" style="background: var(--color-pure-white); box-shadow: var(--shadow-level-0)"></span> |
| `--shadow-level-1` | 1px | 3px | <span class="box" style="background: var(--color-pure-white); box-shadow: var(--shadow-level-1)"></span> |
| `--shadow-level-2` | 3px | 8px | <span class="box" style="background: var(--color-pure-white); box-shadow: var(--shadow-level-2)"></span> |
| `--shadow-level-3` | 6px | 18px | <span class="box" style="background: var(--color-pure-white); box-shadow: var(--shadow-level-3)"></span> |
| `--shadow-level-4` | 8px | 14px | <span class="box" style="background: var(--color-pure-white); box-shadow: var(--shadow-level-4)"></span> |
| `--shadow-level-5` | 12px | 22px | <span class="box" style="background: var(--color-pure-white); box-shadow: var(--shadow-level-5)"></span> |

Cada nivel es un `box-shadow` **compuesto** — tres capas apiladas con distintos
desplazamientos y opacidades, no un solo valor. Eso es lo que hace que la
profundidad se lea como luz cayendo sobre un objeto, y no como un borrón gris
detrás.

Cuanto más alto el nivel, más debe leerse el elemento como situado por encima de
la superficie:

| Nivel | Para |
|---|---|
| 0 | El valor por defecto en reposo. La mayoría de los componentes nunca lo abandona. |
| 1–2 | Algo levantado de la página pero aún parte de ella — una tarjeta en hover, una barra elevada. |
| 3–4 | Flotando sobre el contenido — un dropdown, un popover. |
| 5 | Despegado de la página por completo — un modal, un panel lateral. |

?> **Ningún componente de kuba usa sombra hoy.** Tarjetas, botones e inputs son
planos por diseño, distinguidos por relleno y borde. Estos tokens existen para el
producto que construyas encima — úsalos cuando un elemento genuinamente flote
sobre los demás, no para dar peso visual a algo que no flota.

```html preview
<kb-stack direction="row" spacing="xs">
  <kb-card style="box-shadow: var(--shadow-level-2)">
    <kb-text size="xxs">Nivel 2</kb-text>
  </kb-card>
  <kb-card style="box-shadow: var(--shadow-level-4)">
    <kb-text size="xxs">Nivel 4</kb-text>
  </kb-card>
</kb-stack>
```

!> Las sombras están calibradas para superficies claras — son negras a baja
opacidad. Sobre fondo oscuro resultan casi invisibles, ya que una sombra no puede
oscurecer lo que ya está oscuro. La elevación en modo oscuro viene de un color de
superficie más claro: sube un paso en la rampa `master` en lugar de añadir
sombra.
