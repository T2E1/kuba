<template>
  <section class="zero-framework">
    <h2 class="title"><slot name="title" /></h2>
    <div class="body"><slot name="body" /></div>
  </section>
</template>

<style scoped>
.zero-framework {
  margin: 0 auto;
  max-width: var(--vp-layout-max-width);
  padding: var(--spacing-xl, 64px) var(--spacing_inset-md, 32px);
  text-align: center;
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
  margin: 0 auto;
  max-width: 640px;
}
</style>
