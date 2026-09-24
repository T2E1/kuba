<template>
  <section class="faq">
    <div class="s1-container grid">
      <h2 class="title"><slot name="title" /></h2>
      <div class="items"><slot /></div>
    </div>
  </section>
</template>

<style scoped>
/**
 * Main.dc.html:305-318 — "Perguntas" à esquerda e o acordeão à direita,
 * continuando o fundo preto do playground. Cada pergunta é um `<details>`
 * nativo escrito na própria página: abre e fecha por teclado e é anunciado
 * como expansível sem nenhum script.
 */
.faq {
  background: #111111;
  color: #f4f1ea;
  padding: 24px 0 120px;
}

.grid {
  display: grid;
  gap: 32px 48px;
}

.title {
  border: 0;
  color: #f4f1ea;
  font-family: var(--s1-font-base);
  font-size: clamp(2.25rem, 5vw, 56px);
  font-weight: 700;
  font-stretch: 88%;
  letter-spacing: -0.04em;
  line-height: 0.95;
  margin: 0;
  padding: 0;
}

.items {
  border-top: 1px solid rgba(244, 241, 234, 0.4);
}

.items :deep(details) {
  border-bottom: 1px solid rgba(244, 241, 234, 0.4);
}

.items :deep(summary) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 60px;
  cursor: pointer;
  font-size: 19px;
  font-weight: 600;
  list-style: none;
}

.items :deep(summary::-webkit-details-marker) {
  display: none;
}

.items :deep(summary::after) {
  content: "+";
  flex: none;
  width: 28px;
  height: 28px;
  box-sizing: border-box;
  border: 2px solid #f4f1ea;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--s1-font-chrome);
  font-size: 16px;
}

.items :deep(details[open] summary::after) {
  content: "–";
}

.items :deep(summary:focus-visible) {
  outline: 3px dashed #f4f1ea;
  outline-offset: 4px;
}

.items :deep(details p) {
  color: #d8d4cb;
  font-size: 16px;
  line-height: 25px;
  margin: 0;
  padding: 0 60px 22px 0;
}

.items :deep(details code) {
  font-family: var(--s1-font-mono);
  font-size: 0.88em;
}

@media (min-width: 900px) {
  .grid {
    grid-template-columns: 320px minmax(0, 1fr);
  }
}
</style>
