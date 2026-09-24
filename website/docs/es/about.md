---
layout: page
sidebar: false
title: Acerca de
---

<script setup>
import PageHero from '@page/PageHero.vue'
import Band from '@page/Band.vue'
import Heading from '@page/Heading.vue'
import Creator from '@page/Creator.vue'
import WindowGrid from '@page/WindowGrid.vue'
import Window from '@page/Window.vue'
import Closing from '@page/Closing.vue'
</script>

<PageHero>
  <template #eyebrow>acerca de</template>
  <template #title>Hecho a mano, sobre la plataforma.</template>
  <template #actions>

[Ver en GitHub](https://github.com/deMGoncalves) [Leer el manifiesto](/es/manifesto)

  </template>
</PageHero>

<Band tone="cloud" pattern="dots">

<Heading>
  <template #label>01 — creador</template>
  <template #title>Quién lo construye</template>
</Heading>

<Creator photo="https://github.com/deMGoncalves.png" alt="Retrato de Cleber de M. Goncalves">
  <template #name>Cleber de M. Goncalves</template>
  <template #role>creador y mantenedor de kuba</template>
  <template #bio>

Escribe y mantiene kuba — los custom elements, el bus de Echo y este sitio.

  </template>
  <template #links>

[github/deMGoncalves](https://github.com/deMGoncalves)

  </template>

<Window file="stack.txt">

JavaScript puro, Web Components, Bun, Biome, Vitest y Playwright.

</Window>
<Window file="org.txt">

Publica kuba como `@t2e1/kuba`, bajo la organización **T2E1**, con licencia MIT.

</Window>
<Window file="ahora.txt">

Trabajando hacia la primera versión estable.

</Window>
</Creator>

</Band>

<Band tone="blush">

<Heading>
  <template #label>02 — por qué existe kuba</template>
  <template #title>La versión corta</template>
  <template #body>

Acortar la distancia entre "el servidor entrega HTML" y "la interfaz reacciona
como si hubiera un framework detrás" — sin runtime de estado, sin paso de build,
sin un nuevo lenguaje de plantillas. La versión larga es el
[manifiesto](/es/manifesto).

  </template>
</Heading>

<Closing>
  <template #title>"kuba no abstrae el DOM — confía en él."</template>
</Closing>

</Band>

<Band>

<Heading>
  <template #label>03 — valores</template>
  <template #title>Lo que guía cada decisión</template>
</Heading>

<WindowGrid :columns="3">
<Window file="simple.txt" icon="simple" swatch="#f28aa0">
  <template #title>Simple</template>

Un elemento que necesita documentación extensa para entenderse probablemente
hace demasiado.

</Window>
<Window file="accessible.txt" icon="accessible" swatch="#b8acf3">
  <template #title>Accesible</template>

La plataforma hace el trabajo pesado: un `<input>` real, un `<form>` real,
landmarks nativos.

</Window>
<Window file="flexible.txt" icon="flexible" swatch="#afbfbc">
  <template #title>Flexible</template>

El mismo `<kb-button>`, con otro aspecto, cambiando solo qué tokens están
activos.

</Window>
<Window file="platform.txt" icon="platform" swatch="#f8d053">
  <template #title>Confía en la plataforma</template>

Escribir código solo cuando el navegador genuinamente no ofrece el comportamiento.

</Window>
<Window file="interaction.txt" icon="interaction" swatch="#48b0f7">
  <template #title>Cada interacción importa</template>

Cómo se nombra un evento, la redacción de un mensaje de validación, el
`aria-*` que falta.

</Window>
<Window file="token.txt" icon="token" swatch="#e03ad2">
  <template #title>Tokens, no excepciones</template>

Un valor que no es token es un bug del design system, no un atajo.

</Window>
</WindowGrid>

</Band>

<Band tone="fog">

<Closing>
  <template #title>Constrúyelo con nosotros.</template>
  <template #body>

kuba tiene licencia MIT y está abierto a contribuciones. Empieza por la guía de
contribución, abre un issue o envía un pull request.

  </template>
  <template #actions>

[Leer la guía de contribución](/es/contributing) [Ver los issues](https://github.com/T2E1/kuba/issues)

  </template>
</Closing>

</Band>
