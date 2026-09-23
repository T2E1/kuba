<template>
  <section class="how-it-works">
    <div class="s1-container">
      <h2 class="title"><slot name="title" /></h2>
      <div class="body"><slot name="body" /></div>
    </div>
  </section>
</template>

<style scoped>
/* Main.dc.html:177,179,181-182 — padding-top 120px, h2 88px, corpo 620px. */
.how-it-works {
  background: var(--s1-blush);
  border-top: 2px solid var(--s1-line);
  padding: 120px 0 96px;
  text-align: center;
}

.title {
  color: var(--s1-ink);
  font-family: var(--s1-font-base);
  font-size: clamp(2.25rem, 7vw, 88px);
  font-weight: 700;
  font-stretch: 88%;
  letter-spacing: -0.045em;
  line-height: 0.95;
  margin: 0;
}

/* Main.dc.html:182 centraliza só a frase de abertura; o resto do corpo
   (lista `source/event/type/sink`, blocos de código, parágrafo final) lê
   melhor alinhado à esquerda — é prosa técnica, não uma legenda curta. */
.body {
  color: var(--s1-ink);
  font-size: 18px;
  line-height: 27px;
  margin: 22px auto 0;
  max-width: 620px;
  text-align: left;
}

.body :deep(p:first-child) {
  text-align: center;
}

.body :deep(strong) {
  color: var(--s1-ink);
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
  color: var(--s1-ink);
  display: inline-block;
  font-family: var(--s1-font-mono);
  font-weight: 600;
  margin-inline-end: var(--spacing_inset-quarck, 4px);
}

.body :deep(div[class*='language-']) {
  border: 2px solid var(--s1-line);
  background: var(--s1-code);
  box-shadow: var(--s1-shadow-hard-lg);
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
