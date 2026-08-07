# kuba

Primitivos de Web Components y custom elements. Sin framework, sin paso de
build — el navegador es el runtime, el HTML es la API.

```html preview
<kb-stack direction="row" spacing="xs">
  <kb-button>Primario</kb-button>
  <kb-button variant="outlined">Contorneado</kb-button>
  <kb-button variant="link">Enlace</kb-button>
</kb-stack>
```

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
