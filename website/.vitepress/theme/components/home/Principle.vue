<script setup>
defineProps({
  file: { type: String, required: true },
})
</script>

<template>
  <article class="s1-win principle">
    <div class="s1-bar"><i /><b>{{ file }}</b></div>
    <div class="content">
      <h2 class="title"><slot name="title" /></h2>
      <div class="body"><slot name="body" /></div>
    </div>
  </article>
</template>

<style scoped>
/* Main.dc.html:211-237 — janela com título de 30px e corpo de 15px. */
.content {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 22px 22px 26px;
}

.title {
  border: 0;
  font-family: var(--s1-font-base);
  font-size: 30px;
  font-weight: 700;
  font-stretch: 88%;
  letter-spacing: -0.03em;
  line-height: 1;
  margin: 0;
  padding: 0;
}

.body {
  font-size: 15px;
  line-height: 23px;
}

.body :deep(p) {
  margin: 0;
}

.body :deep(p + p) {
  margin-top: 14px;
}

.body :deep(code) {
  font-family: var(--s1-font-mono);
  font-size: 0.86em;
}
</style>
