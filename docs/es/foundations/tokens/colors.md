# Colores

Los tokens que se cambian por marca y por tema, definidos en
`packages/pixel/tokens/color.css`.

Cada color se declara con `light-dark()` de CSS, llevando un valor claro y uno
oscuro en un solo token:

```css
--color-master-dark: light-dark(#2c2c2c, #c9c9c9);
```

Cuál se aplica lo decide el `color-scheme` de la página — ve
[Modo oscuro](/es/build-ui/theming) para saber cómo activarlo. Las muestras de abajo
renderizan el valor activo en tu navegador ahora mismo.

Cada familia tiene cinco tonos (`lighter`, `light`, base, `dark`, `darker`),
salvo `master` con siete y `menu` con tres.

## Master

La escala neutra — texto, superficies y bordes. La base de cualquier
composición, sin importar la marca.

| | Token | Claro | Oscuro |
|---|---|---|---|
| <span class="swatch" style="background: var(--color-master-lightest)"></span> | `--color-master-lightest` | `#fafafa` | `#1f1f1f` |
| <span class="swatch" style="background: var(--color-master-lighter)"></span> | `--color-master-lighter` | `#f0f0f0` | `#3d3d3d` |
| <span class="swatch" style="background: var(--color-master-light)"></span> | `--color-master-light` | `#e6e6e6` | `#5c5c5c` |
| <span class="swatch" style="background: var(--color-master)"></span> | `--color-master` | `#626262` | `#a3a3a3` |
| <span class="swatch" style="background: var(--color-master-dark)"></span> | `--color-master-dark` | `#2c2c2c` | `#c9c9c9` |
| <span class="swatch" style="background: var(--color-master-darker)"></span> | `--color-master-darker` | `#1a1a1a` | `#e1e1e1` |
| <span class="swatch" style="background: var(--color-master-darkest)"></span> | `--color-master-darkest` | `#0a0a0a` | `#f5f5f5` |

Fíjate en que la rampa **se invierte** entre modos: `master-lightest` es la
superficie más clara en modo claro y la más oscura en modo oscuro. Eso es lo que
hace que un componente estilizado con pasos de la rampa funcione en ambos sin un
solo override.

## Primary

Los tonos principales de la marca — botones y elementos interactivos.

| | Token |
|---|---|
| <span class="swatch" style="background: var(--color-primary-lighter)"></span> | `--color-primary-lighter` |
| <span class="swatch" style="background: var(--color-primary-light)"></span> | `--color-primary-light` |
| <span class="swatch" style="background: var(--color-primary)"></span> | `--color-primary` |
| <span class="swatch" style="background: var(--color-primary-dark)"></span> | `--color-primary-dark` |
| <span class="swatch" style="background: var(--color-primary-darker)"></span> | `--color-primary-darker` |

## Complete

Estado de finalización, progreso, éxito informativo.

| | Token |
|---|---|
| <span class="swatch" style="background: var(--color-complete-lighter)"></span> | `--color-complete-lighter` |
| <span class="swatch" style="background: var(--color-complete-light)"></span> | `--color-complete-light` |
| <span class="swatch" style="background: var(--color-complete)"></span> | `--color-complete` |
| <span class="swatch" style="background: var(--color-complete-dark)"></span> | `--color-complete-dark` |
| <span class="swatch" style="background: var(--color-complete-darker)"></span> | `--color-complete-darker` |

## Success

Confirmaciones y resultados positivos.

| | Token |
|---|---|
| <span class="swatch" style="background: var(--color-success-lighter)"></span> | `--color-success-lighter` |
| <span class="swatch" style="background: var(--color-success-light)"></span> | `--color-success-light` |
| <span class="swatch" style="background: var(--color-success)"></span> | `--color-success` |
| <span class="swatch" style="background: var(--color-success-dark)"></span> | `--color-success-dark` |
| <span class="swatch" style="background: var(--color-success-darker)"></span> | `--color-success-darker` |

## Warning

Avisos que requieren atención pero no bloquean el flujo.

| | Token |
|---|---|
| <span class="swatch" style="background: var(--color-warning-lighter)"></span> | `--color-warning-lighter` |
| <span class="swatch" style="background: var(--color-warning-light)"></span> | `--color-warning-light` |
| <span class="swatch" style="background: var(--color-warning)"></span> | `--color-warning` |
| <span class="swatch" style="background: var(--color-warning-dark)"></span> | `--color-warning-dark` |
| <span class="swatch" style="background: var(--color-warning-darker)"></span> | `--color-warning-darker` |

## Danger

Errores y acciones destructivas.

| | Token |
|---|---|
| <span class="swatch" style="background: var(--color-danger-lighter)"></span> | `--color-danger-lighter` |
| <span class="swatch" style="background: var(--color-danger-light)"></span> | `--color-danger-light` |
| <span class="swatch" style="background: var(--color-danger)"></span> | `--color-danger` |
| <span class="swatch" style="background: var(--color-danger-dark)"></span> | `--color-danger-dark` |
| <span class="swatch" style="background: var(--color-danger-darker)"></span> | `--color-danger-darker` |

## Info

Tonos informativos — texto de ayuda, notificaciones neutras.

| | Token |
|---|---|
| <span class="swatch" style="background: var(--color-info-lighter)"></span> | `--color-info-lighter` |
| <span class="swatch" style="background: var(--color-info-light)"></span> | `--color-info-light` |
| <span class="swatch" style="background: var(--color-info)"></span> | `--color-info` |
| <span class="swatch" style="background: var(--color-info-dark)"></span> | `--color-info-dark` |
| <span class="swatch" style="background: var(--color-info-darker)"></span> | `--color-info-darker` |

## Menu

Superficies de navegación — barras laterales, menús. Tres tonos en lugar de
cinco, ya que los menús rara vez necesitan gradación fina.

| | Token |
|---|---|
| <span class="swatch" style="background: var(--color-menu-light)"></span> | `--color-menu-light` |
| <span class="swatch" style="background: var(--color-menu)"></span> | `--color-menu` |
| <span class="swatch" style="background: var(--color-menu-dark)"></span> | `--color-menu-dark` |

## Pure

| | Token | Valor |
|---|---|---|
| <span class="swatch" style="background: var(--color-pure-white)"></span> | `--color-pure-white` | `#fff` |
| <span class="swatch" style="background: var(--color-pure-black)"></span> | `--color-pure-black` | `#000` |

Los dos únicos tokens sin variación `light-dark()` — representan los extremos
absolutos de la escala, no un color semántico, así que no cambian con el tema.

!> Eso también los convierte en los dos a evitar en una superficie que responde
al tema. Un fondo `--color-pure-white` sigue siendo blanco en modo oscuro; usa
`--color-master-lightest` cuando quieras decir "la superficie más clara", no
"blanco".

## Usar el color

Elige por significado, no por apariencia:

```html preview
<kb-stack direction="row" spacing="nano">
  <kb-button color="primary">Guardar</kb-button>
  <kb-button color="danger">Eliminar</kb-button>
  <kb-button color="success">Confirmar</kb-button>
</kb-stack>
```

Cualquier sufijo de `--color-*` funciona en el atributo `color` de un elemento —
el valor se interpola en `var(--color-{valor})`, así que un nombre desconocido se
resuelve silenciosamente en nada en lugar de fallar de forma visible.
