<template>
  <div class="closing">
    <p class="title"><slot name="title" /></p>
    <div v-if="$slots.body" class="body"><slot name="body" /></div>
    <div v-if="$slots.actions" class="actions"><slot name="actions" /></div>
  </div>
</template>

<style scoped>
/**
 * Fecho de página: frase de 104px e os links de saída — Manifesto.dc.html
 * ("Construímos com o DOM, não sobre ele.") e o "Construa junto" da Sobre.
 * Os links do slot `#actions` viram botões do Tema: o primeiro sólido em
 * violeta, os demais brancos, os dois com sombra dura de 3px.
 */
.closing {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: var(--s1-ink);
}

.title {
  font-family: var(--s1-font-base);
  font-size: clamp(2.5rem, 11vw, 104px);
  font-weight: 700;
  font-stretch: 88%;
  letter-spacing: -0.045em;
  line-height: 0.92;
  margin: 0;
  max-width: 960px;
}

.body {
  margin-top: 22px;
  max-width: 560px;
  font-size: 18px;
  line-height: 27px;
}

.body :deep(p) {
  margin: 0;
}

.body :deep(code) {
  font-family: var(--s1-font-mono);
  font-size: 0.86em;
}

.actions :deep(p) {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 18px;
  margin: 36px 0 0;
}

.actions :deep(a) {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 20px;
  border: 2px solid var(--s1-line);
  background: var(--s1-panel);
  box-shadow: var(--s1-shadow-hard-sm);
  color: var(--s1-ink);
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
}

.actions :deep(a:first-child) {
  background: #6d5cae;
  color: #ffffff;
}

.actions :deep(a:active) {
  box-shadow: none;
  transform: translate(3px, 3px);
}
</style>
