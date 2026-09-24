<template>
  <section class="event-figure">
    <figure class="s1-win s1-light-island figure">
      <div class="s1-bar"><i></i><b>fig-1.svg</b></div>
      <div class="stage s1-dots">
        <svg viewBox="0 0 396 380" role="img" :aria-label="alt">
          <g class="boxes">
            <rect x="50" y="40" width="170" height="48" />
            <rect x="176" y="166" width="170" height="48" />
            <rect x="50" y="292" width="170" height="48" />
          </g>
          <g class="arcs">
            <path d="M135 88 C135 130 260 124 260 164" stroke-dasharray="6 5" />
            <path d="M260 214 C260 256 135 250 135 290" stroke-dasharray="6 5" />
            <path d="M253 156 L260 165 L267 156 M128 282 L135 291 L142 282" />
          </g>
          <g class="names">
            <text x="72" y="70">kb-input</text>
            <text x="200" y="196">kb-fetch</text>
            <text x="72" y="322">kb-render</text>
          </g>
          <g class="events">
            <text x="224" y="124">changed</text>
            <text x="200" y="256">succeeded</text>
          </g>
        </svg>
      </div>
      <figcaption><slot name="caption" /></figcaption>
    </figure>
    <div class="text">
      <p class="s1-chip chip"><slot name="label" /></p>
      <div class="s1-prose body"><slot name="body" /></div>
    </div>
  </section>
</template>

<script setup>
/**
 * Figura + texto lado a lado — Manifesto.dc.html, seção 03. O diagrama é
 * fixo (três elementos reais do kuba e os dois arcos que os ligam); só a
 * legenda, a etiqueta e o texto vêm da página traduzida.
 */
defineProps({
  alt: { type: String, required: true },
})
</script>

<style scoped>
.event-figure {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  align-items: flex-start;
  width: 100%;
  margin: 0;
}

.figure {
  flex: 0 1 400px;
  margin: 0;
}

.stage {
  background-color: #f7c6d1;
  border-bottom: 2px solid #111111;
}

.stage svg {
  display: block;
  width: 100%;
  height: auto;
}

.boxes rect {
  fill: #ffffff;
  stroke: #111111;
  stroke-width: 2px;
}

.arcs path {
  fill: none;
  stroke: #111111;
  stroke-width: 2px;
}

.names text {
  fill: #111111;
  font-family: var(--s1-font-mono);
  font-size: 15px;
}

.events text {
  fill: #413768;
  font-family: var(--s1-font-chrome);
  font-size: 11px;
}

figcaption {
  font-family: var(--s1-font-chrome);
  font-size: 10px;
  line-height: 15px;
  padding: 10px 14px;
}

.text {
  flex: 1 1 360px;
  border-left: 2px solid var(--s1-line);
  padding-left: 24px;
  color: var(--s1-ink);
}

.chip {
  margin: 0 0 18px;
}
</style>
