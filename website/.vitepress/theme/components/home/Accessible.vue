<template>
  <section class="accessible">
    <div class="s1-container">
      <div class="card">
        <h2 class="title"><slot name="title" /></h2>
        <div class="body"><slot name="body" /></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Ver a nota de layout em `Boundary.vue` sobre o grid de 3 colunas da
   referência (Main.dc.html:210-238) não replicado aqui. */
.accessible {
  background: var(--s1-blush);
  padding: 48px 0 96px;
}

.card {
  border: 2px solid var(--s1-line);
  background: var(--s1-panel);
  box-shadow: var(--s1-shadow-hard-lg);
  margin: 0 auto;
  max-width: 640px;
  padding: 22px 22px 26px;
  text-align: left;
}

.title {
  color: var(--s1-ink);
  font-family: var(--s1-font-base);
  font-size: 30px;
  font-weight: 700;
  font-stretch: 88%;
  letter-spacing: -0.03em;
  line-height: 1;
  margin: 0 0 14px;
}

.body {
  color: var(--s1-ink);
  font-size: 15px;
  line-height: 23px;
}

.body :deep(code) {
  font-family: var(--s1-font-mono);
  font-size: 0.85em;
}

.body :deep(p + p) {
  margin-top: 14px;
}
</style>
