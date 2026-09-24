<script setup>
/**
 * Faixa de fundo de ponta a ponta com a coluna de 1040px dentro — a mesma
 * estrutura de toda seção da landing (`section` colorida + `.s1-container`),
 * compartilhada por Manifesto e Sobre em vez de repetida em cada componente.
 *
 * `tone` escolhe uma superfície do Tema; `blush`, `fog` e `cloud` são
 * superfícies claras nos dois modos, então viram `.s1-light-island`
 * (`custom.css`) e trazem a tinta escura de volta.
 */
import { computed } from 'vue'

const LIGHT_TONES = ['blush', 'fog', 'cloud']

const props = defineProps({
  tone: {
    type: String,
    default: 'bg',
    validator: (value) =>
      ['bg', 'paper', 'blush', 'fog', 'cloud'].includes(value),
  },
  pattern: {
    type: String,
    default: 'none',
    validator: (value) => ['none', 'dots'].includes(value),
  },
})

const classes = computed(() => [
  `tone-${props.tone}`,
  {
    's1-dots': props.pattern === 'dots',
    's1-light-island': LIGHT_TONES.includes(props.tone),
  },
])
</script>

<template>
  <section class="band" :class="classes">
    <div class="s1-container column">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.band {
  background-color: var(--band-bg, var(--s1-bg));
  border-top: 2px solid var(--s1-line);
  color: var(--s1-ink);
  padding: 96px 0 104px;
}

.tone-paper {
  --band-bg: var(--s1-panel);
}


.tone-blush {
  --band-bg: #f28aa0;
}

.tone-fog {
  --band-bg: #afbfbc;
}

/* Tema.dc.html — `--color-accent-cloud`, o magenta das nuvens da landing. */
.tone-cloud {
  --band-bg: #e03ad2;
}

.column {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 72px;
}
</style>
