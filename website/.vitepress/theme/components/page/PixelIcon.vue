<script setup>
import { computed } from 'vue'

/**
 * Ícone de 8×8 pixels desenhado em SVG — o lugar dos sprites pixelados da
 * página de time do typesafe, sem emoji (Sobre.dc.html, seção 03). Cada
 * bitmap é uma linha por fileira: `#` pinta, `.` deixa vazio.
 */
const BITMAPS = Object.freeze({
  simple: [
    '........',
    '.######.',
    '.#....#.',
    '.#....#.',
    '.#....#.',
    '.#....#.',
    '.######.',
    '........',
  ],
  accessible: [
    '...##...',
    '...##...',
    '........',
    '.######.',
    '...##...',
    '...##...',
    '..#..#..',
    '.#....#.',
  ],
  flexible: [
    '........',
    '..#.....',
    '.##.....',
    '########',
    '.....##.',
    '.....#..',
    '........',
    '........',
  ],
  platform: [
    '########',
    '#.#.#..#',
    '########',
    '#......#',
    '#......#',
    '#......#',
    '#......#',
    '########',
  ],
  interaction: [
    '#.......',
    '##......',
    '#.#.....',
    '#..#....',
    '#...#...',
    '#.###...',
    '##......',
    '#.......',
  ],
  token: [
    '...#....',
    '..###...',
    '.#####..',
    '#######.',
    '.#####..',
    '..###...',
    '...#....',
    '........',
  ],
})

const props = defineProps({
  name: {
    type: String,
    required: true,
    // `defineProps` é içado para fora do setup, então não enxerga BITMAPS.
    validator: (value) =>
      [
        'simple',
        'accessible',
        'flexible',
        'platform',
        'interaction',
        'token',
      ].includes(value),
  },
})

const path = computed(() =>
  BITMAPS[props.name]
    .flatMap((row, y) =>
      [...row].map((cell, x) => (cell === '#' ? `M${x} ${y}h1v1h-1z` : '')),
    )
    .join(''),
)
</script>

<template>
  <svg class="pixel-icon" viewBox="0 0 8 8" shape-rendering="crispEdges" aria-hidden="true">
    <path :d="path" />
  </svg>
</template>

<style scoped>
.pixel-icon {
  display: block;
  width: 32px;
  height: 32px;
}

.pixel-icon path {
  fill: currentColor;
}
</style>
