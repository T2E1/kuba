# Progress

Muestra cuánto ha avanzado una tarea, como una fracción rellena de una pista
horizontal. Es determinada únicamente: `value` es un porcentaje que tú
estableces, así que la barra no puede expresar "trabajando, duración
desconocida" — simplemente se quedaría en el número que recibió.

```html preview
<div style="width: 100%">
  <kb-progress value="60"></kb-progress>
</div>
```

## Uso

```html
<kb-progress
  value="60"
  role="progressbar"
  aria-valuenow="60"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-label="Subiendo"
></kb-progress>
```

## Cuándo usarlo

- **Una tarea con una fracción completada conocida** — una subida, un formulario
  de varios pasos, un job por lotes que reporta elementos procesados.
- **Una cantidad frente a un techo** — almacenamiento usado, cuota consumida,
  fuerza de la contraseña — donde la barra se lee como un indicador y no como un
  cronómetro.

## Cuándo no usarlo

- **Trabajo de duración desconocida.** Un spinner o un skeleton es la señal
  honesta; una barra congelada en un valor se lee como atascada.
- **Un valor que la persona puede cambiar.** Esto es salida, no entrada — una
  barra que la persona arrastra es un slider (`<input type="range">`).
- **Un contador de pasos que la gente navega.** Un stepper etiquetado comunica
  "paso 2 de 5" mejor, y sigue siendo operable.

## Composición

- **Puede contener**: ningún hijo relevante. El shadow root renderiza un único
  `<div>` indicador y no declara ningún slot. Una etiqueta pertenece junto a la
  barra, no dentro de ella.
- **Puede ser hijo de**: cualquier cosa. El host es `display: block` al 100% de
  ancho, así que toma el ancho de su contenedor.

```html preview
<kb-stack direction="column" spacing="quarck" align="stretch" style="width: 100%">
  <kb-stack direction="row" justify="space-between">
    <kb-text size="xxxs">Subiendo</kb-text>
    <kb-text size="xxxs" color="master">45%</kb-text>
  </kb-stack>
  <kb-progress value="45"></kb-progress>
</kb-stack>
```

## La escala del valor

`value` es un número puro interpolado directamente en un ancho CSS en `%` — sin
acotación, sin `min`/`max`. Tres consecuencias que vale la pena conocer:

- **Pasa `0`–`100`.** Por encima de `100` el indicador es simplemente más ancho
  que la pista; el `overflow: hidden` evita que pinte fuera, así que un exceso
  se ve idéntico a `100` y oculta el bug.
- **Un valor negativo o no numérico** produce un ancho inválido y el indicador
  se colapsa a nada — la misma imagen que `0`.
- **Calcula el porcentaje antes de establecerlo**: `value="${(hecho / total) *
  100}"`. El elemento no hace ninguna aritmética por su cuenta.

No hay transición en el ancho, así que cada actualización pinta de inmediato —
una barra guiada por actualizaciones frecuentes se anima como una serie de
escalones. Es deliberado: el indicador vive en el shadow DOM sin `::part()`
expuesto, así que no se le puede adjuntar una curva de easing desde fuera.
Actualiza a una cadencia que se lea bien, no en cada byte.

## Atributos

| Atributo | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `value` | `string` | `'0'` | Porcentaje de relleno, `0`–`100`. Se aplica directamente como ancho CSS en `%`. |
| `on` | cadena de arco | — | Conexión de Echo, `origen/evento:tipo/destino`. |

Este elemento no despacha eventos.

## Estilos

No existe `::part()` en este elemento, así que estas propiedades son toda la
superficie de extensión.

| Custom property | Por defecto | Controla |
|---|---|---|
| `--progress-color-track` | `var(--color-pure-white)` | Fondo de la parte sin rellenar. |
| `--progress-color-indicator` | `var(--color-primary)` | Color de relleno de la parte completada. |
| `--progress-size-height` | `6px` | Grosor de la barra. |
| `--progress-border-radius` | `var(--border-radius-pill)` | Redondeo de las esquinas, pista e indicador juntos. |

Usa el color del indicador de forma semántica, no decorativa — `success` para un
trabajo terminado, `warning` para una cuota cerca de su límite, `danger` para
una que se pasó.

```html preview
<div
  style="width: 100%; --progress-color-indicator: var(--color-warning); --progress-color-track: var(--color-master-lighter); --progress-size-height: 12px; --progress-border-radius: 8px;"
>
  <kb-progress value="88"></kb-progress>
</div>
```

## Estados y accesibilidad

- `kb-progress` no tiene atributo `hidden` ni custom states — elimina el
  elemento cuando no haya nada que reportar.
- **El elemento no expone ningún rol ARIA.** La tecnología de asistencia ve dos
  `<div>` vacíos, así que añade la semántica en el host: `role="progressbar"`,
  `aria-valuenow`, `aria-valuemin`, `aria-valuemax` y una etiqueta. Mantén
  `aria-valuenow` en sincronía con `value` — se establecen de forma
  independiente.
- La pista usa `--color-pure-white` por defecto, que desaparece sobre una
  superficie blanca. En una página clara, establece `--progress-color-track` a
  un neutro para que la parte sin rellenar siga siendo visible.
- Nunca dependas solo del relleno para comunicar un cambio de estado — acompaña
  una barra `danger` o `warning` con texto, ya que el color es la única
  diferencia.

## Recomendado y no recomendado

| Haz | No hagas |
|---|---|
| Acotar el porcentaje antes de establecer `value` | Pasar una razón cruda (`0.6`) o un conteo sin límite |
| Añadir `role="progressbar"` y los atributos `aria-value*` | Publicar el elemento pelado y suponer que el relleno se anuncia |
| Darle a la pista un color visible en superficies claras | Dejar el blanco por defecto en una página blanca |
| Usar un spinner para trabajo de duración desconocida | Aparcar la barra en un valor arbitrario para señalar "cargando" |
