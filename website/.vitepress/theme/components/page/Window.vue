<script setup>
import PixelIcon from './PixelIcon.vue'

/**
 * Janela do Tema (`.s1-win` + barra listrada) com título e corpo — as
 * crenças do Manifesto e os valores da Sobre. `file` é o nome na barra;
 * `icon` e `swatch`, o ícone pixelado opcional e a cor do quadro dele.
 */
defineProps({
  file: { type: String, required: true },
  icon: { type: String, default: '' },
  swatch: { type: String, default: 'var(--s1-blush)' },
})
</script>

<template>
  <article class="s1-win window">
    <div class="s1-bar"><i></i><b>{{ file }}</b></div>
    <div class="content">
      <div v-if="icon" class="icon" :style="{ background: swatch }">
        <PixelIcon :name="icon" />
      </div>
      <h3 v-if="$slots.title" class="title"><slot name="title" /></h3>
      <div class="s1-prose text"><slot /></div>
    </div>
  </article>
</template>

<style scoped>
.window {
  color: var(--s1-ink);
}

.content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 22px 22px 26px;
}

.icon {
  width: 44px;
  height: 44px;
  border: 2px solid var(--s1-line);
  box-sizing: border-box;
  color: #111111;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title {
  border: 0;
  color: var(--s1-ink);
  font-family: var(--s1-font-base);
  font-size: 28px;
  font-weight: 700;
  font-stretch: 88%;
  letter-spacing: -0.03em;
  line-height: 1;
  margin: 0;
  padding: 0;
}

.text {
  font-size: 15px;
  line-height: 23px;
}
</style>
