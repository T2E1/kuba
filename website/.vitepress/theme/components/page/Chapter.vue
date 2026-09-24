<template>
  <section class="chapter">
    <p class="s1-chip chip"><slot name="label" /></p>
    <div v-if="$slots.lead" class="s1-prose lead"><slot name="lead" /></div>
    <div v-if="$slots.body" class="s1-prose body"><slot name="body" /></div>
  </section>
</template>

<style scoped>
/**
 * Um capítulo de texto corrido na coluna estreita de 600px, com fio de 2px à
 * esquerda e a etiqueta numerada acima — Manifesto.dc.html, seções 01, 02, 05.
 * `#lead` é a frase-tese em negrito de 22px (a missão); `#body`, o corrido.
 */
.chapter {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  border-left: 2px solid var(--s1-line);
  padding-left: 24px;
  color: var(--s1-ink);
}

.chip {
  margin: 0 0 18px;
}

.lead {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 30px;
}

.lead + .body {
  margin-top: 16px;
}
</style>
