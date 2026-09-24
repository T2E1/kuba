<template>
  <section class="comparison s1-light-island s1-rails">
    <div class="s1-container">
      <p class="s1-chip"><slot name="eyebrow" /></p>
      <h2 class="title"><slot name="title" /></h2>
      <!--
        #table chega como markdown já compilado para `<table><thead>…` puro —
        light DOM do Vue, não Shadow DOM. `::slotted` (que a tarefa cita) é um
        seletor de Shadow DOM e não se aplica aqui; o equivalente do Vue é
        `:deep()` em CSS com escopo, usado abaixo.
      -->
      <div class="s1-win table-window">
        <div class="s1-bar"><i /><b>comparison.tbl</b></div>
        <div class="table-wrapper"><slot name="table" /></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Main.dc.html:241,243,245-246 — padding-top 110px, h2 72px/-0.04em à
   esquerda (não centralizado, diferente de Problem.vue/HowItWorks.vue),
   tabela com margin-top 44px. */
/* Ilha clara: o fog da referência (#afbfbc) nos dois modos, não o fog
   escurecido de `html.dark`. */
.comparison {
  background: #afbfbc;
  border-top: 2px solid var(--s1-line);
  padding: 110px 0 96px;
}

.title {
  color: var(--s1-ink);
  font-family: var(--s1-font-base);
  font-size: clamp(2rem, 6vw, 72px);
  font-weight: 700;
  font-stretch: 88%;
  letter-spacing: -0.04em;
  line-height: 0.95;
  margin: 24px 0 0;
}

.table-window {
  margin-top: 44px;
}

.table-wrapper {
  overflow-x: auto;
}

.table-wrapper :deep(table) {
  border-collapse: collapse;
  display: table;
  font-size: 14px;
  width: 100%;
}

.table-wrapper :deep(th),
.table-wrapper :deep(td) {
  border: 1px solid var(--s1-line);
  border-top: none;
  border-right: none;
  padding: 16px;
  text-align: left;
}

.table-wrapper :deep(th:first-child),
.table-wrapper :deep(td:first-child) {
  border-left: none;
}

.table-wrapper :deep(th) {
  background: var(--s1-panel);
  color: var(--s1-ink);
  font-family: var(--s1-font-chrome);
  font-size: 11px;
  font-weight: 400;
  text-transform: lowercase;
  border-bottom: 2px solid var(--s1-line);
}

.table-wrapper :deep(td:first-child) {
  color: var(--s1-ink);
  font-weight: 700;
}

.table-wrapper :deep(td) {
  color: var(--s1-ink);
}

/* Última coluna da tabela é sempre "kuba" (ver #table em website/docs/index.md)
   — destaque de fundo lilás para ancorar a leitura na coluna do produto,
   igual Main.dc.html:255,259-263. */
.table-wrapper :deep(th:last-child),
.table-wrapper :deep(td:last-child) {
  background: #e2deef;
  border-left: 2px solid var(--s1-line);
}

.table-wrapper :deep(th:last-child) {
  background: #111111;
  color: #ffffff;
}

.table-wrapper :deep(td:last-child) {
  color: var(--s1-ink);
  font-weight: 700;
}
</style>
