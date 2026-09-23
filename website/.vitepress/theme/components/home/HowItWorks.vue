<template>
  <section class="how-it-works">
    <h2 class="title"><slot name="title" /></h2>
    <div class="body"><slot name="body" /></div>
  </section>
</template>

<style scoped>
.how-it-works {
  background: var(--vp-c-bg-soft);
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

.body {
  color: var(--vp-c-text-2);
  font-size: var(--font-size-xs);
  line-height: var(--line-height-lg);
  /* Medida de leitura mais generosa que Problem.vue/Hero.vue: este corpo
     intercala prosa com bloco de código, que se beneficia de mais largura. */
  max-width: 720px;
}

.body :deep(strong) {
  color: var(--vp-c-text-1);
}

/**
 * `layout: page` (ver nota equivalente em `Problem.vue`) tira este `<ul>`
 * do alcance de `.vp-doc ul`, que é quem normalmente desfaz o reset global
 * `ol, ul { list-style: none; margin: 0; padding: 0; }` de
 * `node_modules/vitepress/dist/client/theme-default/styles/base.css`. Sem
 * o `list-style` de volta, os quatro itens (`source`, `event`, `type`,
 * `sink`) caem em cima uns dos outros sem marcador nem recuo — a lista
 * "parece HTML cru". As três declarações abaixo restauram só o suficiente
 * para a lista voltar a se ler como lista.
 */
.body :deep(ul) {
  list-style: disc;
  margin: var(--spacing_inset-xs, 16px) 0;
  padding-inline-start: var(--spacing_inset-sm, 24px);
}

.body :deep(li + li) {
  margin-top: var(--spacing_inset-quarck, 4px);
}

/* Termo em destaque: o `<strong>` inicial de cada item vira o rótulo da
   definição, em vez de só um trecho em negrito no meio da frase. */
.body :deep(li strong:first-child) {
  color: var(--vp-c-brand-1);
  display: inline-block;
  font-family: var(--vp-font-family-mono);
  margin-inline-end: var(--spacing_inset-quarck, 4px);
}

.body :deep(div[class*='language-']) {
  background: var(--vp-c-bg);
  border-radius: var(--border-radius-md, 16px);
  margin: var(--spacing_inset-sm, 24px) 0;
  overflow-x: auto;
}

.body :deep(div[class*='language-'] pre) {
  margin: 0;
  padding: var(--spacing_inset-xs, 16px);
}

/* Mesmo motivo de `Problem.vue`: sem `.vp-doc`, botão de copiar e rótulo
   de linguagem do Shiki chegam sem posição nem estado hover — viram um
   botão vazio e um rótulo cru colados ao código. */
.body :deep(button.copy),
.body :deep(span.lang) {
  display: none;
}
</style>
