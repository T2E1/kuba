<template>
  <section class="boundary">
    <div class="card">
      <h2 class="title"><slot name="title" /></h2>
      <div class="body"><slot name="body" /></div>
    </div>
  </section>
</template>

<style scoped>
.boundary {
  margin: 0 auto;
  max-width: var(--vp-layout-max-width);
  padding: var(--spacing-lg, 56px) var(--spacing_inset-md, 32px);
}

.card {
  border: var(--border-width-hairline, 1px) solid var(--vp-c-divider);
  border-radius: var(--border-radius-md, 16px);
  margin: 0 auto;
  max-width: 720px;
  padding: var(--spacing_inset-lg, 40px);
}

.title {
  color: var(--vp-c-text-1);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-sm);
  margin: 0 0 var(--spacing_inset-sm, 24px);
}

.body {
  color: var(--vp-c-text-2);
  font-size: var(--font-size-xs);
  line-height: var(--line-height-lg);
}

.body :deep(p + p) {
  margin-top: var(--spacing_inset-xs, 16px);
}
</style>
