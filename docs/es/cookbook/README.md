# Recetario

Recetas completas y funcionales — pantallas enteras, no elementos sueltos. Cada
una parte de un markup que puedes pegar en una página con las dos etiquetas de la
[Instalación](/es/learn/installation), y evoluciona hasta la versión que
publicarías.

Las recetas asumen que has leído [Eventos y Echo](/es/learn/events-and-echo);
buena parte de lo que las hace cortas es la conexión por arcos.

## Recetas

- **[Búsqueda al escribir](/es/cookbook/search-as-you-type)** — un input que
  dispara una petición, resultados renderizados desde un template, con estados de
  error y vacío. Tres elementos, ningún listener.
- **[CRUD de usuarios](/es/cookbook/user-crud)** — añadir, listar y eliminar
  registros. Cuatro arcos que cierran un ciclo: formulario → dataset → lista →
  dataset.
- **[Navegación declarativa](/es/cookbook/declarative-navigation)** — un botón
  que navega sin conocer su destino, y un solo redirect sirviendo una lista
  entera.

## Una nota sobre los nombres

El bus de Echo se comparte en toda la página, y un arco identifica su origen por
`id`, `name` o nombre de etiqueta. Dos funcionalidades que llamen `users` a un
elemento se cruzarán — el arco dispara para cualquiera de ellas.

Las recetas de aquí prefijan sus nombres (`crud-users`, `crud-form`) porque este
sitio renderiza varios ejemplos en vivo por página. En una aplicación, dale a los
nombres el alcance de la funcionalidad por la misma razón.
