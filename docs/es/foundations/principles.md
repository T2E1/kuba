# Principios

Los principios existen para quitarle subjetividad a las decisiones. Cada uno
cabe en una palabra, y cada uno lleva la razón de existir — sin eso, es un
eslogan.

Tres bastan para kuba hoy. Divídelos en subgrupos si tu producto lo necesita;
solo mantenlos claros y tangibles como para zanjar una discusión.

## Simple

Buscamos simplicidad en cómo se construye cada componente, en las reglas que
escribimos y en cómo se aplica kuba para construir un producto.

**Un elemento que necesita documentación extensa para entenderse probablemente
hace demasiado.** Esa es la prueba, y corta hacia ambos lados: cuando la página
de un componente crece aquí porque el elemento tiene demasiadas reglas, es el
elemento lo que debe cambiar.

*Palabras clave: fácil, directo, claro, enfocado.*

## Accesible

Diseñamos para todos, y por eso los criterios de accesibilidad nunca se omiten
— ni en una decisión de diseño ni en una de código.

En la práctica, eso significa que la plataforma hace el trabajo pesado: un
`<input>` real dentro de `<kb-input>`, un `<form>` real dentro de `<kb-form>`,
landmarks nativos en `<kb-header>` y `<kb-footer>`. Aportan comportamiento de
teclado, orden de foco y semántica de lector de pantalla que un `<div>` nunca
tendría.

También significa ser honestos sobre dónde se detiene un elemento. El clic de
`<kb-card>` es solo de ratón; `<kb-icon>` no tiene nombre accesible;
`<kb-validity>` no se anuncia cuando aparece. Cada página de componente lo dice
en su propia sección de accesibilidad, porque una carencia que conoces es una
carencia que puedes cerrar.

*Palabras clave: inclusivo, considerado, universal.*

## Flexible

Los componentes deben adaptarse a múltiples marcas y escenarios distintos — sin
bifurcar el componente para cada variación.

Eso es lo que hacen posible los design tokens y las custom properties: el mismo
`<kb-button>`, con otra apariencia, cambiando qué tokens están activos. Cada
decisión visual de cada elemento se expone como una propiedad
`--{componente}-*` con valor por defecto tomado de un token, así que
re-estilizar nunca implica alcanzar un shadow root — ve
[Estilos](/es/learn/styling).

*Palabras clave: adaptable, versátil, dinámico.*

## Principios de diseño

Todo se reduce a la simplicidad visual. **Cada design token existe para eliminar
una decisión arbitraria — no para multiplicar opciones.** La escala de
espaciado, la paleta de colores, los niveles de sombra: cada una es lo bastante
pequeña para memorizarse, y lo bastante restringida para que dos pantallas del
mismo producto nunca parezcan hechas por personas distintas.

Esto se ve en cómo se componen los componentes. Un `<kb-card>` no define su
espaciado interno — usa la escala de espaciado. Un `<kb-button>` no inventa su
paleta — resuelve `--color-{valor}` contra los tokens activos. La apariencia
cambia cuando cambia el token, nunca porque alguien decidió que en esa pantalla
concreta se ve mejor distinto.

El corolario merece decirse: **un valor que no es token es un bug del design
system, no un atajo.** Cuando necesitas un tamaño que la escala no tiene, la
pregunta es si la escala está mal — no si esa pantalla puede ser una excepción.
