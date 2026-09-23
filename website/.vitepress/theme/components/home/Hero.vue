<template>
  <header class="hero">
    <div class="pitch">
      <p class="eyebrow"><slot name="eyebrow" /></p>
      <h1 class="title"><slot name="title" /></h1>
      <div class="subtitle"><slot name="subtitle" /></div>
    </div>
    <!--
      O bloco ` ```html ` dentro de #proof não carrega a variante `preview`
      — passa pelo destaque de sintaxe padrão do VitePress (Shiki, em tempo
      de build), não pelo plugin em `.vitepress/plugins/preview.js`. Por
      isso este componente só estiliza o contêiner; o HTML que chega aqui já
      vem realçado.
    -->
    <div class="proof"><slot name="proof" /></div>
  </header>
</template>

<style scoped>
.hero {
  display: grid;
  gap: var(--spacing-lg, 56px);
  margin: 0 auto;
  max-width: var(--vp-layout-max-width);
  padding: var(--spacing-xl, 64px) var(--spacing_inset-md, 32px);
}

.eyebrow {
  background: var(--vp-c-brand-soft);
  border-radius: var(--border-radius-pill);
  color: var(--vp-c-brand-1);
  display: inline-block;
  font-family: var(--font-family-highlight);
  font-size: var(--font-size-xxxs);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.08em;
  margin: 0 0 var(--spacing_inset-xs, 16px);
  padding: var(--spacing_inset-quarck, 4px) var(--spacing_inset-xs, 16px);
  text-transform: uppercase;
}

.title {
  color: var(--vp-c-text-1);
  font-size: clamp(2rem, 4.5vw, var(--font-size-xxxl));
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-sm);
  margin: 0 0 var(--spacing_inset-sm, 24px);
}

.subtitle {
  color: var(--vp-c-text-2);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-lg);
  /* Medida de leitura confortável (~75 caracteres); kuba não tem um token
     de escala para largura de coluna de texto — dívida registrada aqui. */
  max-width: 640px;
}

.subtitle :deep(code) {
  font-size: 0.9em;
}

.proof {
  background: var(--vp-c-bg-soft);
  border-left: var(--border-width-thick, 4px) solid var(--vp-c-brand-1);
  border-radius: var(--border-radius-md, 16px);
  padding: var(--spacing_inset-md, 32px);
}

.proof :deep(p:last-child) {
  color: var(--vp-c-text-2);
  margin: var(--spacing_inset-xs, 16px) 0 0;
}

.proof :deep(div[class*='language-']) {
  margin: 0;
}

@media (min-width: 960px) {
  .hero {
    align-items: center;
    grid-template-columns: 1.1fr 1fr;
  }
}
</style>
