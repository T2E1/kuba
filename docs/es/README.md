# kuba

Primitivos de Web Components y custom elements. Sin framework, sin paso de
build — el navegador es el runtime, el HTML es la API.

Una funcionalidad completa — buscar razas de perro mientras se escribe y
renderizar los resultados — conectada enteramente en HTML, sin nada de
JavaScript escrito por ti. Escribe en ella:

```html preview
<kb-stack direction="column" spacing="xs" width="fill">
  <kb-input name="dog" width="fill">
    <kb-label>Búsqueda de razas de perro</kb-label>
    <kb-helper>Prueba 'akita' o 'corgi'.</kb-helper>
  </kb-input>

  <kb-render layout="grid">
    <template>
      <kb-card>
        <kb-inset side="top">
          <kb-cover src="{image.url}"></kb-cover>
        </kb-inset>
        <kb-text family="highlight" weight="medium" size="xs" color="primary-dark">{name}</kb-text>
        <kb-stack direction="column" spacing="quarck">
          <kb-text size="xxxs"><strong>Criado para:</strong> {bred_for}</kb-text>
          <kb-text size="xxxs"><strong>Esperanza de vida:</strong> {life_span}</kb-text>
          <kb-text size="xxxs"><strong>Temperamento:</strong> {temperament}</kb-text>
        </kb-stack>
      </kb-card>
    </template>
    <kb-on value="api/succeeded:method/render"></kb-on>
    <kb-on value="api/failed:method/clear"></kb-on>
  </kb-render>
</kb-stack>

<kb-fetch name="api" url="https://api.thedogapi.com/v1/breeds/search?q={}">
  <kb-headers key="x-api-key" value="DEMO-API-KEY"></kb-headers>
  <kb-on value="dog/changed:method/get"></kb-on>
</kb-fetch>
```

Cada conexión es un **arco** — `origen/evento:tipo/destino`:

- `<kb-input name="dog">` publica un evento `changed`; `<kb-fetch>` se suscribe
  con `dog/changed:method/get` y pide `…/search?q={el valor escrito}`.
- `<kb-fetch name="api">` publica `succeeded` (o `failed`); `<kb-render>` se
  suscribe con `api/succeeded:method/render` para pintar su `<template>` una vez
  por resultado, y con `api/failed:method/clear` para vaciarlo.
- Los placeholders `{name}`, `{bred_for}`, `{temperament}`… de la plantilla se
  rellenan a partir de cada objeto de resultado.

Ningún componente referencia a otro en código — solo acuerdan nombres de
evento. La misma funcionalidad se desarma paso a paso en
**[Búsqueda al escribir](/es/build-ui/patterns/search-as-you-type)**.

Todo en este sitio se ejecuta contra el paquete publicado, cargado desde un CDN
— las mismas dos líneas que pondrías en tu propia página. Si un ejemplo aquí se
renderiza, la versión publicada funciona.

## Qué es

kuba es un conjunto de custom elements y los pequeños primitivos que los
componen: decorators para el ciclo de vida del custom element, mixins para
atributos comunes, una capa de eventos y un sistema declarativo de conexión
llamado Echo.

- **Los componentes son HTML.** `<kb-input name="email" required>` es toda la
  API — entran atributos, salen eventos. No hay instancia que importar, ni
  objeto de props, ni función de render.
- **Los componentes se comunican por eventos.** Ningún elemento importa a otro.
  Acuerdan nombres de evento, y Echo los conecta desde el markup:
  `on="query/changed:method/get"`.
- **El estilo son CSS custom properties.** Cada decisión visual es un token que
  sobrescribes desde fuera; nada exige alcanzar un shadow root.

## Empieza aquí

- **[Introducción](/es/learn/introduction)** — por qué existe, y el hueco
  que ocupa entre un framework y HTML puro.
- **[Instalación](/es/learn/installation)** — una etiqueta de script, o
  instalación por paquete.
- **[Inicio rápido](/es/learn/quick-start)** — un formulario funcionando en diez
  minutos.
- **[Componentes](/es/components/)** — cada elemento, con ejemplos en vivo.
- **[Recetario](/es/build-ui/patterns/)** — pantallas completas: búsqueda al escribir,
  CRUD, navegación declarativa.

## Qué no es

kuba no es una alternativa a React en el sentido de reemplazar un modelo de
componentes — no hay virtual DOM, ni sistema de reactividad, ni reconciliación.
El estado vive en el DOM y en tus propios objetos. Si tu aplicación necesita
grafos de estado derivado y re-renderizado granular, usa un framework diseñado
para eso; kuba es para construir interfaces con elementos que la plataforma ya
entiende.

?> Esta traducción está en curso. Las páginas aún no traducidas aparecen en
inglés — la navegación sigue funcionando con normalidad.
