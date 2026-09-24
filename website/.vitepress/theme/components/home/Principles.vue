<template>
  <section class="principles s1-light-island s1-dots">
    <div class="s1-container grid">
      <slot />
    </div>
  </section>
</template>

<style scoped>
/**
 * Main.dc.html:208-238 — os três princípios (`Principle.vue`) numa grade de
 * três colunas sobre blush pontilhado, cada janela descendo 56px em relação
 * à anterior.
 */
.principles {
  background-color: #f28aa0;
  border-top: 2px solid #111111;
  padding: 110px 0 120px;
}

.grid {
  display: grid;
  gap: 28px;
  align-items: start;
}

@media (min-width: 900px) {
  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .grid > :deep(:nth-child(2)) {
    margin-top: 56px;
  }

  .grid > :deep(:nth-child(3)) {
    margin-top: 112px;
  }
}
</style>
