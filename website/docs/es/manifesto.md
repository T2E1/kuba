---
layout: page
sidebar: false
title: Manifiesto
---

<script setup>
import PageHero from '@page/PageHero.vue'
import EventLog from '@page/EventLog.vue'
import Band from '@page/Band.vue'
import Chapter from '@page/Chapter.vue'
import EventFigure from '@page/EventFigure.vue'
import WindowGrid from '@page/WindowGrid.vue'
import Window from '@page/Window.vue'
import Closing from '@page/Closing.vue'
import Notes from '@page/Notes.vue'
</script>

<PageHero>
  <template #art><EventLog /></template>
  <template #eyebrow>manifiesto</template>
  <template #title>El HTML es la aplicación, no el destino.</template>
</PageHero>

<Band tone="fog">

<Chapter>
  <template #label>01 — nuestra misión</template>
  <template #lead>

Ofrecer un conjunto pequeño y cohesionado de primitivos que cualquier equipo
pueda adoptar de forma progresiva<sup>1</sup> — y acortar la distancia entre
"el servidor entrega HTML" y "la interfaz reacciona como si hubiera un
framework detrás".

  </template>
</Chapter>

<Chapter>
  <template #label>02 — dos escuelas</template>
  <template #body>

React, Vue y Angular tratan el DOM como un detalle de implementación a
abstraer. El estado vive en JavaScript, la interfaz es una función de él, y el
costo es un universo paralelo: un runtime enviado al navegador, un paso de
build, y un modelo de estado que no tiene nada que ver con el DOM que produce.

htmx va en la dirección opuesta y devuelve al HTML el papel de aplicación. Pero
no hay flujo de datos *dentro del cliente*: un filtro reaccionando a un input se
convierte en una petición de red, porque no hay otro canal.<sup>2</sup>

El hueco entre estas dos escuelas es el que kuba cierra: <mark>flujo de datos en
el cliente sin salir del HTML, y sin un runtime de estado en JavaScript que
mantener.</mark>

  </template>
</Chapter>

<EventFigure alt="Tres elementos de kuba — kb-input, kb-fetch y kb-render — conectados por los arcos de los eventos changed y succeeded.">
  <template #caption>fig. 1 — el sistema de eventos del DOM, disponible desde 1995<sup>3</sup></template>
  <template #label>03 — cómo lo resuelve kuba</template>
  <template #body>

Cada elemento puede despachar un evento; cada elemento puede escuchar uno. Los
frameworks reinventaron esa capacidad en userland — props, stores, observables
— porque los eventos crudos están demasiado poco estructurados para componer
una aplicación.

La respuesta de kuba es estandarizar el vocabulario, no reemplazar el
mecanismo. Un atributo `on` describe, en markup puro, qué evento de qué
elemento guía qué método, propiedad o atributo de destino.

El `CustomEvent` nativo hace la entrega real; kuba solo aporta la gramática. Dos
elementos reaccionan entre sí, y ninguno importa al otro.

Escrito en JavaScript puro, con <mark>cero dependencias de runtime</mark>.<sup>4</sup>

  </template>
</EventFigure>

<WindowGrid :columns="2">
  <template #label>04 — cuatro cosas que creemos</template>
<Window file="creencia-1.txt">
  <template #title>Confía en la plataforma antes de reinventarla</template>

Solo escribimos código cuando el navegador genuinamente no ofrece el
comportamiento — nunca por preferencia estilística.

</Window>
<Window file="creencia-2.txt">
  <template #title>Sé creativo, pero responsable</template>

Un `types.d.ts` sin implementación no es un contrato; una implementación sin
`types.d.ts` no es un componente público.

</Window>
<Window file="creencia-3.txt">
  <template #title>Cada interacción importa</template>

Cómo se nombra un evento, la redacción de un mensaje de validación, el atributo
`aria-*` que falta en un elemento.

</Window>
<Window file="creencia-4.txt">
  <template #title>No trates una restricción como excusa</template>

Cuando un escenario no encaja en el modelo, el camino es entender por qué se
resiste, no rodearlo.

</Window>
</WindowGrid>

<Chapter>
  <template #label>05 — qué buscamos</template>
  <template #body>

**Reducir el costo del cambio.** Apoyado en APIs nativas, cada elemento
evoluciona aislado, sin cascada de ediciones por otras capas.

**Documentación viva.** Este sitio se ejecuta contra el paquete publicado desde
un CDN — así <mark>una versión rota rompe la documentación, de forma
visible</mark>, en lugar de pasar desapercibida.

**Hacer visible el razonamiento.** Por qué Echo sobrescribe `dispatchEvent`, por
qué no hay un store central. Es lo que permite extender la biblioteca, no solo
consumirla.

  </template>
</Chapter>

<Closing>
  <template #title>Construimos con el DOM, no encima de él.</template>
  <template #actions>

[Leer la documentación](/es/learn/introduction) [Ver en GitHub](https://github.com/T2E1/kuba)

  </template>
</Closing>

<Notes>
  <template #file>notas.txt</template>

1. Un único `<kb-button>` en una página existente, o una pantalla entera
   orquestada por el bus de Echo.
2. La interactividad que debería ser instantánea y local se modela como un
   viaje de ida y vuelta al servidor.
3. Cada elemento despacha y escucha eventos; Echo solo les da una gramática:
   `origen/evento:tipo/destino`.
4. Revisa el `package.json`: la sección `dependencies` está vacía. El único shim
   es `setImmediate`.

</Notes>

</Band>
