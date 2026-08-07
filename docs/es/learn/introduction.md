# Introducción

Web Components, el propio navegador como capa de flujo de datos, y ninguna
promesa de reinventar lo que la plataforma ya resuelve.

Nadie necesita muchas herramientas para construir una interfaz que *funciona*.
Construir una que siga funcionando dentro de dos años, con otra persona
manteniendo el código, es el verdadero desafío — y eso viene de convenciones
explícitas, no del talento individual.

Cuando el dominio está claro — qué elementos existen, cómo se comunican, dónde
vive el estado — la cantidad de decisiones que cada persona toma sola cae
drásticamente. Los cambios se vuelven quirúrgicos: sabes qué archivo tocar y qué
esperar de la edición.

> kuba no abstrae el DOM — confía en él.

## Por qué existe

**Propósito.** Acortar la distancia entre "el servidor entrega HTML" y "la
interfaz reacciona como si hubiera un framework detrás" — sin obligar a quien
construye el producto a aprender un runtime de estado, un paso de build o un
nuevo lenguaje de plantillas.

**Misión.** Ofrecer un conjunto pequeño y cohesionado de primitivos — custom
elements y utilidades — que cualquier equipo pueda adoptar progresivamente: un
solo `<kb-button>` en una página existente, o una pantalla entera orquestada por
el bus de Echo.

**Visión.** Que los equipos de producto traten el DOM como una capa legítima de
flujo de datos, no como un detalle de implementación a esconder tras un Virtual
DOM — y que el HTML que envía el servidor siga siendo, de hecho, la aplicación.

## El hueco que ocupa

Los frameworks de componentes — React, Vue, Angular — resuelven el flujo de
datos en el cliente al costo de un runtime entero. htmx resuelve la simplicidad
devolviendo el HTML al servidor, pero no tiene flujo de datos local.

kuba existe para ocupar exactamente ese punto medio: reactividad inmediata entre
elementos, sin renunciar al HTML como fuente de la aplicación.

```html
<kb-input name="query"></kb-input>

<kb-fetch name="api" url="/search?q={}">
  <kb-on value="query/changed:method/get"></kb-on>
</kb-fetch>
```

Dos elementos reaccionan entre sí, y ninguno importa al otro. Ese es el modelo
completo — ve [Eventos y Echo](/es/foundations/events-and-echo).

## Cuatro cosas que creemos

### Confía en la plataforma antes de reinventarla

Cada elemento nuevo empieza con la misma pregunta: *¿el navegador ya resuelve
esto?* `<kb-input>` delega la validación a la Constraint Validation API.
`<kb-redirect>` usa la History API. Echo se apoya en el `dispatchEvent` nativo.
Solo escribimos código cuando la plataforma genuinamente no ofrece el
comportamiento — nunca por preferencia estilística.

### Sé creativo, pero responsable

El comportamiento se documenta antes de considerarse terminado. Un `types.d.ts`
sin implementación no es un contrato, y una implementación sin `types.d.ts` no
es un componente público. Esa frontera evita que experimentar dentro de un
paquete se convierta en inestabilidad para quien lo consume.

### Cada interacción importa

Esto vale en todas las capas: cómo se nombra un evento, la redacción de un
mensaje de validación, el atributo `aria-*` que falta en un elemento. Decisiones
pequeñas, mantenidas consistentes en todo el paquete, suman una experiencia
coherente — para quien usa la interfaz y para quien lee el código.

### No trates una restricción como excusa

Un requisito duro no es razón para abrir una excepción en la arquitectura.
Cuando un escenario no encaja en el modelo actual — publicador/suscriptor sobre
Echo, HTML como fuente de verdad — el camino es entender *por qué* el modelo se
resiste, no rodearlo. Eso es lo que mantiene fiables los
[principios](/es/foundations/principles) con el tiempo.

## Qué buscamos

**Reducir el costo del cambio.** Al apoyarse en APIs nativas — eventos,
`CustomEvent`, `ElementInternals`, la Constraint Validation API — cada elemento
evoluciona aislado, sin cascada de ediciones por otras capas.

**Ahorrar tiempo.** Componentes pequeños, cada uno con una responsabilidad,
significan menos deuda técnica acumulada y actualizaciones más rápidas de
aplicar.

**Construir una cultura de documentación viva.** Todo paquete público lleva un
`types.d.ts` como contrato, y este sitio se ejecuta contra el paquete publicado
desde un CDN — así una versión rota rompe la documentación, de forma visible, en
lugar de pasar desapercibida.

**Hacer visible el razonamiento.** Cada paquete en `packages/` documenta una
decisión: por qué Echo sobrescribe `dispatchEvent`, por qué `<kb-input>` delega
en la Constraint Validation API en lugar de reimplementarla, por qué no hay un
store central. Hacer explícito ese razonamiento importa tanto como el código —
es lo que permite extender la biblioteca, no solo consumirla.

## La plataforma sobre la que se apoya

kuba está escrito en JavaScript puro, con **cero dependencias de runtime**.
Revisa el `package.json`: la sección `dependencies` está vacía.

No fue por falta de opciones. Se desprende de los
[principios](/es/foundations/principles):

1. **Los Web Components son nativos.** No necesitan un framework para existir ni
   para registrarse.
2. **Una dependencia menos es una cadena de suministro menos** que auditar,
   actualizar y ver romperse en producción.
3. **Una curva de aprendizaje más suave.** Quien conoce el DOM y `CustomEvent`
   ya puede leer el código de kuba.
4. **Todo desarrollador front-end sabe JavaScript**, sea cual sea el framework
   del día a día.

### Las APIs nativas en las que se apoya

Ninguna es una dependencia instalable. Son capacidades que el navegador ya trae,
y que kuba expone mediante una API declarativa en lugar de esconder tras una
abstracción propia.

| API | Se usa para |
|---|---|
| **Custom Elements** | Cada etiqueta `<kb-*>`, registrada por el decorator `define`. |
| **Shadow DOM** | El markup y los estilos de cada elemento, aislados de la página. |
| **Constraint Validation API** | Validación nativa en `<kb-input>`, `<kb-textarea>`, `<kb-fileupload>`. |
| **`ElementInternals`** | Asociación a formulario y estados personalizados (`:state(invalid)`, `:state(hidden)`) sin reimplementar la semántica de `<form>`. |
| **`CustomEvent`** | Todo el bus de Echo. Los elementos se comunican como el DOM ya lo hace. |
| **Constructable stylesheets** | `adoptedStyleSheets`, para que una hoja se parsee una vez y se comparta entre instancias. |
| **History API** | Navegación en el cliente en `router` y `<kb-redirect>`. |
| **CSS `light-dark()`** | Valores claro y oscuro en un solo token de color, resueltos por el `color-scheme` de la página. |
| **CSS custom properties** | Toda la superficie de temas, heredando a través del shadow boundary. |

El único shim del código es `setImmediate`, usado para agrupar repintados —
unas pocas líneas, no una biblioteca.

## Adónde ir ahora

- **[Principios](/es/foundations/principles)** — los tres que guían cada
  decisión.
- **[Instalación](/es/learn/installation)** — una etiqueta de script, o una
  instalación de paquete.
- **[Inicio rápido](/es/learn/quick-start)** — un formulario funcionando en diez
  minutos.
