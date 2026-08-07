# Opacidad

Niveles de opacidad para estados y superposiciones, definidos en
`packages/pixel/tokens/opacity.css`.

| Token | Valor | Muestra |
|---|---|---|
| `--opacity-level-semiopaque` | 0.72 | <span class="box" style="background: var(--color-primary); opacity: var(--opacity-level-semiopaque)"></span> |
| `--opacity-level-intense` | 0.64 | <span class="box" style="background: var(--color-primary); opacity: var(--opacity-level-intense)"></span> |
| `--opacity-level-medium` | 0.32 | <span class="box" style="background: var(--color-primary); opacity: var(--opacity-level-medium)"></span> |
| `--opacity-level-light` | 0.16 | <span class="box" style="background: var(--color-primary); opacity: var(--opacity-level-light)"></span> |
| `--opacity-level-semitransparent` | 0.08 | <span class="box" style="background: var(--color-primary); opacity: var(--opacity-level-semitransparent)"></span> |

## Para qué sirven

Estados de superposición: el fondo tras un modal, un hover sutil sobre una
superficie, un control deshabilitado.

```css
.backdrop {
  background: var(--color-pure-black);
  opacity: var(--opacity-level-intense);
}
```

## Para qué no sirven

**Nunca uses opacidad para atenuar texto legible.** Bajar la opacidad de un texto
reduce su contraste contra el fondo de un modo invisible para un verificador de
contraste, que lee el color declarado — el resultado computado puede caer por
debajo del mínimo de 4.5:1 mientras el CSS sigue diciendo `--color-master-dark`.

Cuando el texto deba retroceder, elige un paso más claro de la rampa `master`. El
token es honesto sobre el color resultante, y sigue siendo correcto en modo
oscuro, donde la rampa se invierte y la opacidad no.

?> **Ningún componente de kuba usa estos tokens hoy.** Los inputs deshabilitados,
por ejemplo, cambian fondo y color de texto en lugar de atenuarse — precisamente
para mantener el contraste legible. Existen para el producto que construyas
encima.
