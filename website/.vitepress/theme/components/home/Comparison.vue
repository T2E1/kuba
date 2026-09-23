<template>
  <section class="comparison">
    <h2 class="title"><slot name="title" /></h2>
    <!--
      #table chega como markdown já compilado para `<table><thead>…` puro —
      light DOM do Vue, não Shadow DOM. `::slotted` (que a tarefa cita) é um
      seletor de Shadow DOM e não se aplica aqui; o equivalente do Vue é
      `:deep()` em CSS com escopo, usado abaixo.
    -->
    <div class="table-wrapper"><slot name="table" /></div>
  </section>
</template>

<style scoped>
.comparison {
  margin: 0 auto;
  max-width: var(--vp-layout-max-width);
  padding: var(--spacing-xl, 64px) var(--spacing_inset-md, 32px);
}

.title {
  color: var(--vp-c-text-1);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-sm);
  margin: 0 0 var(--spacing_inset-sm, 24px);
}

.table-wrapper {
  overflow-x: auto;
}

.table-wrapper :deep(table) {
  border-collapse: collapse;
  display: table;
  font-size: var(--font-size-xxxs);
  width: 100%;
}

.table-wrapper :deep(th),
.table-wrapper :deep(td) {
  border: var(--border-width-hairline, 1px) solid var(--vp-c-divider);
  padding: var(--spacing_inset-xs, 16px);
  text-align: left;
}

.table-wrapper :deep(th) {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-family: var(--font-family-highlight);
  font-weight: var(--font-weight-medium);
}

.table-wrapper :deep(td:first-child) {
  color: var(--vp-c-text-1);
  font-weight: var(--font-weight-medium);
}

.table-wrapper :deep(td) {
  color: var(--vp-c-text-2);
}

/* Última coluna da tabela é sempre "kuba" (ver #table em website/docs/index.md)
   — destaque sutil de fundo para ancorar a leitura na coluna do produto. */
.table-wrapper :deep(th:last-child),
.table-wrapper :deep(td:last-child) {
  background: var(--vp-c-brand-soft);
}

.table-wrapper :deep(td:last-child) {
  color: var(--vp-c-text-1);
  font-weight: var(--font-weight-medium);
}
</style>
