<script setup>
/**
 * Grade de `Window.vue` — 2 colunas nas crenças do Manifesto, 3 nos valores
 * da Sobre; uma coluna só em tela estreita. `#label` é a etiqueta
 * numerada centralizada acima da grade ("04 — quatro coisas…").
 */
defineProps({
  columns: {
    type: Number,
    default: 2,
    validator: (value) => [2, 3].includes(value),
  },
})
</script>

<template>
  <div class="window-group">
    <p v-if="$slots.label" class="s1-chip label"><slot name="label" /></p>
    <div class="window-grid" :style="{ '--columns': columns }">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.window-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  width: 100%;
}

.label {
  margin: 0;
}

.window-grid {
  display: grid;
  grid-template-columns: repeat(var(--columns), minmax(0, 1fr));
  gap: 28px;
  width: 100%;
}

@media (max-width: 768px) {
  .window-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
