<script setup>
/**
 * Arte decorativa do topo do Manifesto (Manifesto.dc.html, janela
 * `eventos.log`): colunas verticais com nomes de evento reais do kuba sobre
 * rosa, cortadas por diagonais, e o arco do logo em arame sobre o fog.
 * Puramente visual — `aria-hidden` no todo; o título da página é o conteúdo.
 */
const EVENTS = [
  'changed',
  'succeeded',
  'failed',
  'clicked',
  'submitted',
  'filtered',
  'found',
  'changed',
  'succeeded',
  'clicked',
  'failed',
  'found',
]

const columns = EVENTS.map((event, index) => ({
  key: `${event}-${index}`,
  text: `${event} · `.repeat(4),
  faded: index % 3 === 1,
}))
</script>

<template>
  <div class="s1-win s1-light-island event-log" aria-hidden="true">
    <div class="s1-bar"><i></i><b>events.log</b></div>
    <div class="canvas">
      <div class="stream">
        <span v-for="column in columns" :key="column.key" :class="{ faded: column.faded }">{{ column.text }}</span>
        <svg class="cuts" viewBox="0 0 600 220" preserveAspectRatio="none">
          <path d="M170 0 L600 160 M170 0 L170 220 M360 0 L600 128 M0 196 L600 24" />
        </svg>
      </div>
      <div class="arch s1-dots">
        <svg viewBox="0 0 256 220">
          <path class="outer" d="M48 220 V120 C48 70 78 40 128 40 C178 40 208 70 208 120 V220" />
          <path class="inner" d="M80 220 V122 C80 90 98 72 128 72 C158 72 176 90 176 122 V220" />
          <path d="M48 120 L6 96 M208 120 L250 96 M128 40 L160 0" />
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>

.canvas {
  display: flex;
  height: 220px;
  overflow: hidden;
}

.stream {
  position: relative;
  flex: 1 1 600px;
  display: flex;
  gap: 14px;
  padding-left: 14px;
  overflow: hidden;
  background: #f28aa0;
}

.stream span {
  color: #111111;
  font-family: var(--s1-font-mono);
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0.18em;
  line-height: 20px;
  white-space: nowrap;
  writing-mode: vertical-rl;
}

.stream span.faded {
  opacity: 0.45;
}

.cuts {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.cuts path,
.arch path {
  fill: none;
  stroke: #111111;
  stroke-width: 2px;
}

.arch {
  flex: 0 0 256px;
  background-color: #afbfbc;
  border-left: 2px solid #111111;
}

.arch svg {
  width: 100%;
  height: 100%;
}

.arch .outer {
  fill: #ffffff;
}

.arch .inner {
  fill: #afbfbc;
}

@media (max-width: 640px) {
  .arch {
    display: none;
  }
}
</style>
