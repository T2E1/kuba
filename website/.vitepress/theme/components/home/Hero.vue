<template>
  <header class="hero">
    <div class="s1-container pitch">
      <p class="eyebrow"><slot name="eyebrow" /></p>
      <h1 class="title"><slot name="title" /></h1>
      <div class="subtitle"><slot name="subtitle" /></div>
      <!--
        O bloco ` ```html ` dentro de #proof não carrega a variante `preview`
        — passa pelo destaque de sintaxe padrão do VitePress (Shiki, em
        tempo de build), não pelo plugin em `.vitepress/plugins/preview.js`.
        Por isso este componente só estiliza o contêiner; o HTML que chega
        aqui já vem realçado.
      -->
      <div class="proof"><slot name="proof" /></div>
    </div>
  </header>
</template>

<style scoped>
/**
 * Main.dc.html:48-85 empilha tudo centralizado numa coluna só (janela de
 * código, eyebrow, h1, subtítulo) dentro dos mesmos 1040px de toda seção da
 * landing — não um grid de duas colunas texto/código lado a lado, que é
 * como este componente existia antes. `#proof` aqui carrega só um bloco de
 * código (a referência tem dois, ligados por uma seta com o arco no meio) —
 * sem um segundo slot em `docs/index.md` para o segundo bloco, ele fica
 * centralizado abaixo do texto, sozinho, na largura de leitura do texto
 * (640px) em vez da largura de janela da referência (440-520px) — mais
 * legível para o único bloco que existe aqui.
 */
.hero {
  padding: 64px 0;
  background: var(--s1-bg);
}

.pitch {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.eyebrow {
  background: var(--s1-panel);
  border: 2px solid var(--s1-line);
  color: var(--s1-ink);
  display: inline-block;
  font-family: var(--s1-font-chrome);
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.02em;
  margin: 0;
  padding: 3px 8px;
  text-transform: lowercase;
}

.title {
  color: var(--s1-ink);
  font-family: var(--s1-font-base);
  /* Main.dc.html:77 — 104px/0.92/-0.045em, igual ao `<h1>` de doc
     (Docs.dc.html:86), que usa 0.88/-0.05em: mesmo tamanho, curva de
     título ligeiramente diferente por página. 104px literal só a partir de
     640px — abaixo disso o texto de duas linhas da home real (mais longo
     que o da referência) estouraria a viewport. */
  font-size: clamp(2.25rem, 13vw, 104px);
  font-weight: 700;
  font-stretch: 88%;
  letter-spacing: -0.045em;
  line-height: 0.92;
  max-width: 960px;
  margin: 22px 0 0;
}

.subtitle {
  color: var(--s1-muted);
  font-size: 18px;
  line-height: 27px;
  margin-top: 20px;
  max-width: 600px;
}

.subtitle :deep(code) {
  font-family: var(--s1-font-mono);
  font-size: 0.85em;
}

.proof {
  border: 2px solid var(--s1-line);
  background: var(--s1-panel);
  box-shadow: var(--s1-shadow-hard-lg);
  margin-top: 40px;
  width: 100%;
  max-width: 640px;
}

.proof :deep(p:last-child) {
  color: var(--s1-muted);
  font-size: 15px;
  line-height: 23px;
  margin: 0;
  padding: 14px 16px;
  text-align: left;
}

.proof :deep(p:last-child code) {
  font-family: var(--s1-font-mono);
  font-size: 0.9em;
}

/* `.vp-doc` não envolve esta página (`layout: page` — ver a nota
   equivalente em Problem.vue), então o bloco de código do Shiki chega sem
   a "janela" (borda listrada + rótulo central) que `custom.css` só aplica
   dentro de `.vp-doc`. Reconstrói o mesmo tratamento aqui, igual
   Problem.vue e HowItWorks.vue já fazem para os próprios blocos. */
.proof :deep(div[class*='language-']) {
  position: relative;
  margin: 0;
  padding-top: var(--s1-bar-height);
  background: var(--s1-code);
  border-bottom: 2px solid var(--s1-line);
  text-align: left;
}

.proof :deep(div[class*='language-']::before) {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: var(--s1-bar-height);
  background: var(--s1-pattern-stripe);
  background-clip: content-box;
  padding: 5px 6px;
  box-sizing: border-box;
  border-bottom: 2px solid var(--s1-line);
}

.proof :deep(pre) {
  margin: 0;
  padding: 14px 16px;
  font-size: 13px;
  line-height: 20px;
}

.proof :deep(button.copy),
.proof :deep(span.lang) {
  display: none;
}
</style>
