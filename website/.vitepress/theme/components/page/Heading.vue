<template>
  <div class="heading">
    <p class="s1-chip chip"><slot name="label" /></p>
    <h2 class="title"><slot name="title" /></h2>
    <div v-if="$slots.body" class="body"><slot name="body" /></div>
  </div>
</template>

<style scoped>
/**
 * Etiqueta Silkscreen + título de 88px centralizados — o cabeçalho de toda
 * seção da landing ("02 — como funciona", Main.dc.html) e da Sobre.
 */
.heading {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 56px;
}

.chip {
  margin: 0;
}

.title {
  border: 0;
  color: var(--s1-ink);
  font-family: var(--s1-font-base);
  font-size: clamp(2.5rem, 9vw, 88px);
  font-weight: 700;
  font-stretch: 88%;
  letter-spacing: -0.045em;
  line-height: 0.95;
  margin: 24px 0 0;
  padding: 0;
}

.body {
  margin-top: 22px;
  max-width: 600px;
  font-size: 18px;
  line-height: 27px;
}

.body :deep(p) {
  margin: 0;
}

.body :deep(a) {
  color: var(--s1-ink);
  font-weight: 700;
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;
}

.body :deep(code) {
  font-family: var(--s1-font-mono);
  font-size: 0.86em;
}
</style>
