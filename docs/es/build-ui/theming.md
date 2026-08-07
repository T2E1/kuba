# Estilos

Cada decisión visual en kuba es una CSS custom property, y cada propiedad tiene
por defecto un design token. Re-estilizas un componente definiendo propiedades
desde fuera — nunca alcanzando su shadow DOM, cosa que además no podrías.

Hay exactamente dos capas, y saber cuál usar es la mayor parte de esta página.

## Las dos capas

**Los design tokens** son globales: `--color-primary`, `--spacing_inset-xs`,
`--font-size-md`. Cambia uno y cada componente que lo usa lo sigue. Son tu tema.

**Las propiedades de componente** son locales: `--button-size-height`,
`--card-space-inset`, `--input-color-focus`. Cada una tiene por defecto un token.
Cambia una y solo ese componente cambia.

```css
/* Capa 1 — todo el producto recibe otro acento */
:root {
  --color-primary: #0b7285;
}

/* Capa 2 — solo los botones del checkout se hacen más altos */
.checkout kb-button {
  --button-size-height: 56px;
}
```

Usa el token cuando el cambio es una decisión sobre el producto. Usa la propiedad
de componente cuando es una decisión sobre un lugar.

## Por qué funciona: la herencia cruza el shadow boundary

Las custom properties se heredan, y la herencia atraviesa los shadow roots. Ese
es el mecanismo sobre el que descansa todo el sistema: un valor definido en
`:root`, en un ancestro o en el propio elemento alcanza el CSS **dentro** del
componente, aunque tu hoja de estilo no pueda seleccionar nada ahí.

```css
kb-button { --button-color-accent: rebeccapurple; }
```

La regla interna del componente lee `var(--button-color-accent, var(--color-primary))`,
encuentra tu valor y lo usa. Sin `::part`, sin `!important`, sin perforar el
shadow.

?> Eso también significa que un override en un ancestro cascadea a cada
descendiente que coincida — `.panel-dark { --text-color: white }` re-estiliza
todos los `<kb-text>` de ese panel a la vez.

## La escala de tokens

Todo viene en `dist/kuba.css`. Los valores son los mismos que usa el diseño; los
nombres son el contrato entre ambos lados.

| Grupo | Pasos |
|---|---|
| `--color-*` | `primary`, `master`, `success`, `warning`, `danger`, `info`, `complete`, `menu`, cada uno con variantes `-light` / `-lighter` / `-dark` / `-darker`, más `pure-white` y `pure-black` |
| `--spacing-*` | `quarck` 4px → `giant` 200px — para gaps y márgenes entre cosas |
| `--spacing_inset-*` | `quarck` 4px → `giant` 56px — para padding dentro de una superficie |
| `--font-size-*` | `xxxs` 12px → `giant` 96px |
| `--font-weight-*` | `regular` 400, `medium` 500, `bold` 700 |
| `--line-height-*` | `default` 100% → `xxl` 200% |
| `--font-family-*` | `base` (Roboto), `highlight` (Roboto Condensed) |
| `--border-radius-*` | `none`, `sm` 8px, `md` 16px, `lg` 24px, `pill`, `circular` |
| `--border-width-*` | `none`, `hairline`, `thin`, `thick`, `heavy` |
| `--opacity-level-*` | `semitransparent` 0.08 → `semiopaque` 0.72 |

Las dos escalas de espaciado están separadas a propósito: `--spacing-*` mide la
distancia *entre* elementos, `--spacing_inset-*` el padding *dentro* de uno. Usar
la escala inset para un gap funciona, pero se desvía del ritmo que mantienen los
propios componentes.

## Nomenclatura de las propiedades de componente

Siguen `--{componente}-{grupo}-{nombre}`:

| Patrón | Ejemplos |
|---|---|
| `--{c}-color-*` | `--button-color-accent`, `--input-color-focus` |
| `--{c}-size-*` | `--button-size-height`, `--main-size-max-width` |
| `--{c}-space-*` | `--card-space-inset`, `--stack-space-gap` |
| `--{c}-font-*` | `--text-font-size`, `--label-font-weight` |
| `--{c}-border-*` | `--card-border-radius`, `--input-border-radius` |

El sufijo `_disabled` marca una variante de estado:
`--input-color-background_disabled`.

Cada página de componente lista su tabla completa. Los nombres son API estable —
trátalos como cualquier otra superficie pública.

## Temas

Un tema es un bloque de overrides de token. Ponlo en `:root` para todo el
producto, o en un contenedor para una región:

```css
:root {
  --color-primary: #0b7285;
  --color-primary-dark: #095c6b;
  --font-family-base: 'Inter', sans-serif;
  --border-radius-sm: 2px;
}
```

Esa última línea merece atención: cambiar `--border-radius-sm` deja rectas las
esquinas de botones, inputs, imágenes de portada y las esquinas internas de las
tarjetas a la vez, porque todos lo tienen por defecto. Es la palanca que dan los
tokens — y la razón para tocarlos de forma deliberada, no componente a
componente.

### Una marca es una hoja de tokens

Como cada elemento consume color, tipografía y espaciado exclusivamente mediante
`var(--nombre-del-token)` — nunca un literal en su `style.js` — **una marca es un
conjunto de valores, no de componentes.**

Crear una significa cambiar la hoja, no bifurcar nada. En el repositorio es
`packages/pixel/tokens/color.css` (y `fontFamily.css`, si la marca tiene otra voz
tipográfica) sustituido por un archivo equivalente con los mismos nombres de
variable y valores distintos. Como consumidor, es una hoja cargada después de
`kuba.css`:

```html
<link rel="stylesheet" href=".../kuba.css" />
<link rel="stylesheet" href="/brand/acme.css" />
```

Ningún componente sabe que la marca cambió, porque ningún componente supo nunca
qué marca estaba renderizando.

### Varios temas por marca

El mismo mecanismo cubre variaciones de temporada y apariencias por tier. Una
campaña de Black Friday, o una distinción plata/oro, es un bloque de overrides de
color acotado a un contenedor — sin Elements duplicados, sin inventar un atributo
`variant`:

```css
.tier-gold {
  --color-primary: #b8860b;
  --color-primary-dark: #8b6508;
}
```

Dale al alcance la amplitud que merece el cambio: `:root` para el producto, una
sección para una campaña, un solo elemento para una excepción.

### Modo oscuro

Cada token de color ya se declara con `light-dark()` de CSS, llevando un valor
claro y uno oscuro:

```css
--color-master-dark: light-dark(#2c2c2c, #c9c9c9);
```

Cuál se aplica lo decide el `color-scheme` de la página, no kuba. Nada en la hoja
publicada lo declara, así que una página asume claro y los valores oscuros nunca
afloran. **Enciendes el modo oscuro declarando el esquema:**

```css
:root {
  color-scheme: light dark; /* seguir la preferencia del sistema */
}
```

Esa única línea voltea la paleta entera — sin overrides de token, sin una segunda
hoja de estilo, sin una clase que alternar. Fuerza un modo con
`color-scheme: dark` o `color-scheme: light`.

Dos componentes aún asumen una superficie clara, porque sus valores por defecto
nombran un color fijo en lugar de un paso de la rampa: la pista de
`<kb-progress>` es `--color-pure-white`, y `<kb-card variant="outlined">` se
rellena de blanco. Sobrescribe esos dos por superficie hasta que sus valores por
defecto pasen a la rampa.

## Lo que no puedes estilizar

- **Cualquier cosa seleccionada desde fuera del shadow root.**
  `kb-button button { … }` no coincide con nada. Si un componente no expone una
  propiedad para lo que quieres cambiar, eso es una carencia del componente, no
  una técnica que te falte — abre una issue en lugar de rodearlo.
- **`::part()`** — hoy ningún componente expone parts.
- **Contenido slotted desde dentro.** Las reglas `::slotted()` viven dentro del
  componente; el contenido slotted lo estilizas desde tu propia hoja, ya que está
  en tu DOM.

## Atributos de layout frente a CSS

Algunas cosas que parecen estilo son atributos, no propiedades — `width`,
`height`, `align`, `justify`, `direction`, `spacing`. Se aplican directamente al
host, así que definir la propiedad CSS equivalente desde fuera pelea con ellas.

```html
<!-- Haz -->
<kb-stack direction="column" spacing="md" width="fill">

<!-- No hagas: el atributo gana, y la intención vive en dos lugares -->
<kb-stack style="flex-direction: column; gap: 32px">
```

La regla práctica: si el componente documenta un atributo para eso, usa el
atributo. Las custom properties son para lo que los atributos no cubren — y para
valores que deben responder a una media query, cosa que un atributo no hace.

## Después

- **[Componentes](/es/components/)** — la sección Styling de cada página lista su
  tabla completa de propiedades.
- **[Design tokens](/es/foundations/tokens/)** — la escala completa.
