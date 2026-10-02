# Recetario

Recetas completas y funcionales — pantallas enteras, no elementos sueltos. Cada
una parte de un markup que puedes pegar en una página con las dos etiquetas de la
[Instalación](/learn/installation), y evoluciona hasta la versión que
publicarías.

Las recetas asumen que has leído [Eventos y Echo](/foundations/events-and-echo);
buena parte de lo que las hace cortas es la conexión por arcos.

## Recetas

- **[Búsqueda al escribir](/build-ui/patterns/search-as-you-type)** — un input que
  dispara una petición, resultados renderizados desde un template, con estados de
  error y vacío. Tres elementos, ningún listener.
- **[Dirección por CEP](/build-ui/patterns/address-by-cep)** — un formulario
  de dirección brasileño completado por ViaCEP a partir del código postal. Una
  petición repartida en seis campos, cada arco tomando la clave que necesita.

## Una nota sobre los nombres

El bus de Echo se comparte en toda la página, y un arco identifica su origen por
`id`, `name` o nombre de etiqueta. Dos funcionalidades que llamen `users` a un
elemento se cruzarán — el arco dispara para cualquiera de ellas.

Cada receta de aquí ejecuta un solo ejemplo en vivo, así que sus nombres son
cortos (`breed`, `cep`). En una aplicación, donde varias funcionalidades
comparten una página, dale a los nombres el alcance de la funcionalidad
(`checkout-cep`) para que no se crucen.
