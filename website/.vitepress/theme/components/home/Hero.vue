<template>
  <header class="hero s1-light-island s1-rails">
    <div class="sky" aria-hidden="true">
      <span class="cloud cloud-left" />
      <span class="cloud cloud-right" />
      <span class="cloud cloud-top" />
      <span class="fade" />
      <span class="dither" />
    </div>
    <div class="s1-container pitch">
      <!--
        As duas janelas ligadas pelo arco (Main.dc.html:61-75): a origem
        (`#source`), o arco no meio (`#arc`) e o destino (`#sink`, código e
        a frase que o explica). Os blocos ` ```html ` chegam já realçados pelo
        Shiki — este componente só dá a eles a moldura de janela.
      -->
      <div class="s1-win window window-source">
        <div class="s1-bar"><i /><b>search.html</b></div>
        <div class="code"><slot name="source" /></div>
      </div>
      <div class="arc">
        <span class="wire" />
        <span class="arc-label"><slot name="arc" /></span>
        <span class="wire" />
      </div>
      <div class="s1-win window window-sink">
        <div class="s1-bar"><i /><b>api.html</b></div>
        <div class="code"><slot name="sink" /></div>
      </div>

      <p class="meta"><slot name="meta" /></p>
      <h1 class="title"><slot name="title" /></h1>
      <p class="tagline"><slot name="tagline" /></p>
      <div class="subtitle"><slot name="subtitle" /></div>
      <div class="actions"><slot name="actions" /></div>
    </div>
  </header>
</template>

<style scoped>
/**
 * Main.dc.html:47-86 — céu claro com três nuvens magenta pontilhadas, as
 * duas janelas de código ligadas pelo arco, e o texto centralizado abaixo.
 * É uma ilha clara (`.s1-light-island`): o céu não escurece no modo escuro,
 * igual às faixas coloridas do resto da landing.
 */
.hero {
  background: #e4f1f6;
  overflow: hidden;
  padding: 72px 0 96px;
}

.sky {
  position: absolute;
  inset: 0;
}

.cloud {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(closest-side, #e03ad2, rgba(255, 255, 255, 0));
}

.cloud-left {
  left: -220px;
  top: -160px;
  width: 760px;
  height: 760px;
}

.cloud-right {
  right: -240px;
  top: -80px;
  width: 820px;
  height: 820px;
}

.cloud-top {
  left: calc(50% - 340px);
  top: -360px;
  width: 700px;
  height: 560px;
  opacity: 0.55;
}

.fade {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 520px;
  background: linear-gradient(rgba(255, 255, 255, 0), #ffffff 70%);
}

.dither {
  position: absolute;
  inset: 0;
  opacity: 0.55;
  background-image: radial-gradient(rgba(255, 255, 255, 0.95) 1px, transparent 1.4px);
  background-size: 4px 4px;
}

.pitch {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.window {
  width: 100%;
  text-align: left;
}

.window-source {
  max-width: 440px;
}

.window-sink {
  max-width: 520px;
}

.code :deep(div[class*='language-']) {
  background: none;
  margin: 0;
  overflow-x: auto;
}

.code :deep(pre) {
  margin: 0;
  padding: 14px 16px;
  font-size: 13px;
  line-height: 20px;
}

.code :deep(button.copy),
.code :deep(span.lang) {
  display: none;
}

.code :deep(p) {
  color: #3a3a3a;
  font-size: 13px;
  line-height: 19px;
  margin: 0;
  padding: 0 16px 14px;
}

.code :deep(p code) {
  font-family: var(--s1-font-mono);
  font-size: 0.92em;
}

.arc {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 64px;
  justify-content: center;
}

.wire {
  width: 2px;
  height: 18px;
  background: #111111;
}

.arc-label {
  background: #111111;
  color: #ffffff;
  font-family: var(--s1-font-chrome);
  font-size: 11px;
  padding: 3px 8px;
}

.meta {
  font-family: var(--s1-font-chrome);
  font-size: 11px;
  margin: 44px 0 0;
  word-spacing: 0.4em;
}

.title {
  font-family: var(--s1-font-base);
  font-size: clamp(2.75rem, 11vw, 104px);
  font-weight: 700;
  font-stretch: 88%;
  letter-spacing: -0.045em;
  line-height: 0.92;
  margin: 22px 0 0;
  max-width: 960px;
}

.tagline {
  font-size: clamp(1.4rem, 3.4vw, 32px);
  font-weight: 600;
  font-stretch: 88%;
  letter-spacing: -0.02em;
  line-height: 1.15;
  margin: 22px 0 0;
}

.subtitle {
  color: #2b2b2b;
  font-size: 18px;
  line-height: 27px;
  margin-top: 20px;
  max-width: 600px;
}

.subtitle :deep(p) {
  margin: 0;
}

.subtitle :deep(code) {
  font-family: var(--s1-font-mono);
  font-size: 0.85em;
}

.actions :deep(p) {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px 40px;
  margin: 30px 0 0;
  font-size: 20px;
  font-weight: 700;
}

.actions :deep(a) {
  color: #111111;
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 6px;
}

.actions :deep(a:hover) {
  color: var(--s1-accent);
}
</style>
