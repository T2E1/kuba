<template>
  <section class="boundary">
    <div class="s1-container">
      <div class="card">
        <h2 class="title"><slot name="title" /></h2>
        <div class="body"><slot name="body" /></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/**
 * Main.dc.html:210-238 arranja os três princípios (este, `ZeroFramework.vue`
 * e `Accessible.vue`) num grid de 3 colunas com `margin-top` escalonado
 * (0/56/112px), dentro de UMA seção. `docs/index.md` os compõe como três
 * `<section>` de nível superior e separados — mudar isso para um grid
 * exigiria uma quarta camada agrupadora ali (fora do artefato de token e
 * estado visual deste ofício). Cada um fica empilhado, largura de leitura
 * própria em vez da coluna de ~328px que caberia num grid de 3.
 */
.boundary {
  background: var(--s1-blush);
  padding: 48px 0;
}

.card {
  border: 2px solid var(--s1-line);
  background: var(--s1-panel);
  box-shadow: var(--s1-shadow-hard-lg);
  margin: 0 auto;
  max-width: 640px;
  /* Main.dc.html:215 — padding literal do cartão. */
  padding: 22px 22px 26px;
}

.title {
  color: var(--s1-ink);
  font-family: var(--s1-font-base);
  font-size: 30px;
  font-weight: 700;
  font-stretch: 88%;
  letter-spacing: -0.03em;
  line-height: 1;
  margin: 0 0 var(--spacing_inset-sm, 24px);
}

.body {
  color: var(--s1-ink);
  font-size: 15px;
  line-height: 23px;
}

.body :deep(p + p) {
  margin-top: var(--spacing_inset-xs, 16px);
}
</style>
