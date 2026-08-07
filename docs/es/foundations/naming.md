# Nomenclatura

No usamos Atomic Design. Lo intentamos al principio, pero gastar energía
clasificando qué era un "átomo", una "molécula" o un "organismo" no encajaba con
lo que kuba realmente es: custom elements nativos, no un árbol de composición.
Conservamos la mentalidad y simplificamos, llegando a tres capas.

## Prefijo de etiqueta

| Prefijo | Significado | Ejemplos |
|---|---|---|
| `kb-` | Todo custom element de kuba, visual o headless. | `<kb-button>`, `<kb-input>`, `<kb-dataset>`, `<kb-fetch>` |

Un prefijo único mantiene el namespace predecible y hace que cualquier elemento
de kuba sea reconocible de un vistazo en el markup de otra persona. Si un
elemento renderiza algo o no lo dice su `types.d.ts` y la existencia de una
página en [Componentes](/es/components/) — no la etiqueta.

Los elementos headless — `<kb-dataset>`, `<kb-filter>`, `<kb-find>`,
`<kb-fetch>`, `<kb-headers>`, `<kb-on>`, `<kb-redirect>` — guardan o piden datos
y publican eventos en Echo, pero no renderizan nada.

## Design tokens

Las variables semánticas de estilo, reflejadas entre diseño y código. Cada token
sigue `--{grupo}-{escala}`: `--spacing-md`, `--color-primary-dark`.

**El nombre nunca describe *dónde* se usa el token, solo *qué* representa.** Eso
es lo que permite reutilizarlo en cualquier componente sin que el nombre llegue
a ser engañoso — `--color-danger` sigue siendo correcto tanto si colorea un
botón, un borde o un mensaje de validación.

## Elements

Los componentes indivisibles — las partes más pequeñas de una interfaz: un
botón, un input, una etiqueta. Cada uno corresponde a un único directorio en
`packages/`, con su `types.d.ts` y su `style.js`, y se construye puramente con
combinaciones de design tokens. Sin valores sueltos.

## Blocks

Los componentes más complejos, montados componiendo varios Elements. Un
`<kb-card>` que agrupa `<kb-text>`, `<kb-label>` y `<kb-button>` es un Block.

Los tokens de espaciado gobiernan esas composiciones, para que el ritmo entre
Elements dentro de un Block sea predecible en todo el producto.

## Qué + semántica + variante

La práctica para nombrar tanto design tokens como los atributos de un
`types.d.ts`: empieza por el **qué** (el concepto), sigue con la **semántica**
(la variación) y añade una **variante** de intensidad cuando haga falta.

| | qué | semántica | variante |
|---|---|---|---|
| Token | `color` | `primary` | `dark` |
| Token | `spacing_inset` | `md` | — |
| Propiedad | `--button-color` | `accent` | — |
| Atributo | `variant` | `outlined` | — |

No es obligatorio — entra en juego cuando hay una necesidad real de diferenciar.

## Antes de crear un Element nuevo

Puedes tener un `<kb-card>` y en algún momento necesitar una "tarjeta con
imagen". Comprueba primero si eso no es simplemente una composición distinta del
mismo `<kb-card>` — un Block, no un Element nuevo.

Las preguntas, en este orden:

1. **¿Es una composición de Elements existentes?** Entonces es un Block. Escribe
   el markup, no un paquete nuevo.
2. **¿Es el mismo Element con otra apariencia?** Entonces es un override de
   token o un atributo `variant` — ve [Estilos](/es/learn/styling).
3. **¿Es genuinamente una parte indivisible nueva?** Solo entonces merece un
   paquete, un `types.d.ts` y una página aquí.

## Eventos

Los eventos se nombran en **pasado** — informan un hecho, no piden una acción:
`clicked`, `changed`, `submitted`, `filtered`, `found`, `succeeded`, `failed`.

La regla importa más de lo que parece. Un elemento que publica `save` le está
diciendo a alguien qué hacer, lo que significa que sabe quién escucha. Un
elemento que publica `submitted` declara lo que ocurrió, y no le importa quién
reacciona — que es justamente por lo que los elementos de kuba nunca se importan
entre sí.
