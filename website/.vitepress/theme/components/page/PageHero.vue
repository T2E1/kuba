<template>
  <header class="page-hero">
    <div class="s1-container pitch">
      <div v-if="$slots.art" class="art"><slot name="art" /></div>
      <p class="s1-chip eyebrow"><slot name="eyebrow" /></p>
      <h1 class="title"><slot name="title" /></h1>
      <div v-if="$slots.actions" class="actions"><slot name="actions" /></div>
    </div>
  </header>
</template>

<style scoped>
/**
 * Abertura das páginas de apresentação (Manifesto, Sobre): o mesmo eyebrow
 * e título de 104px de `home/Hero.vue`, com uma arte opcional acima e links
 * sublinhados abaixo — Manifesto.dc.html e Sobre.dc.html, topo.
 */
.page-hero {
  background: var(--s1-bg);
  padding: 88px 0 104px;
}

.pitch {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.art {
  width: 100%;
  max-width: 860px;
  margin-bottom: 64px;
}

.eyebrow {
  margin: 0;
}

.title {
  color: var(--s1-ink);
  font-family: var(--s1-font-base);
  font-size: clamp(2.5rem, 12vw, 104px);
  font-weight: 700;
  font-stretch: 88%;
  letter-spacing: -0.045em;
  line-height: 0.92;
  margin: 24px 0 0;
  max-width: 900px;
}

.actions :deep(p) {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px 40px;
  margin: 36px 0 0;
  font-size: 20px;
  font-weight: 700;
}

.actions :deep(a) {
  color: var(--s1-ink);
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 6px;
}

.actions :deep(a:hover) {
  color: var(--s1-accent);
}
</style>
