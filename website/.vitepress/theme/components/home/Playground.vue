<script setup>
import { ref } from 'vue'

// A cópia em #body promete "the same search-dog-breeds feature from the top
// of this page" — este é o mesmo bloco kuba do slot #code-after de
// Problem.vue (website/docs/index.md), não um exemplo novo.
const DEFAULT_CODE = `<kb-stack direction="column" spacing="xs" width="fill">
  <kb-input name="dog" width="fill">
    <kb-label>Dog Breed Search</kb-label>
    <kb-helper>Try 'akita' or 'corgi'.</kb-helper>
  </kb-input>

  <kb-render layout="grid">
    <template>
      <kb-card>
        <kb-inset side="top">
          <kb-cover src="{image.url}"></kb-cover>
        </kb-inset>
        <kb-text family="highlight" weight="medium" size="xs" color="primary-dark">{name}</kb-text>
        <kb-stack direction="column" spacing="quarck">
          <kb-text size="xxxs"><strong>Bred for:</strong> {bred_for}</kb-text>
          <kb-text size="xxxs"><strong>Life span:</strong> {life_span}</kb-text>
          <kb-text size="xxxs"><strong>Temperament:</strong> {temperament}</kb-text>
        </kb-stack>
      </kb-card>
    </template>
    <kb-on value="api/succeeded:method/render"></kb-on>
    <kb-on value="api/failed:method/clear"></kb-on>
  </kb-render>
</kb-stack>

<kb-fetch name="api" url="https://api.thedogapi.com/v1/breeds/search?q={}">
  <kb-headers key="x-api-key" value="DEMO-API-KEY"></kb-headers>
  <kb-on value="dog/changed:method/get"></kb-on>
</kb-fetch>`

const source = ref(DEFAULT_CODE)
const rendered = ref(DEFAULT_CODE)
let debounce

/**
 * Atualiza o estágio ao vivo com atraso em vez de a cada tecla: trocar
 * `rendered` remonta os custom elements (o `connectedCallback` roda de
 * novo), e `<kb-fetch>` dispara uma chamada de rede real a cada montagem —
 * sem debounce, digitar rápido multiplicaria requisições à API pública do
 * The Dog API.
 */
function schedule() {
  clearTimeout(debounce)
  debounce = setTimeout(() => {
    rendered.value = source.value
  }, 400)
}

function reset() {
  clearTimeout(debounce)
  source.value = DEFAULT_CODE
  rendered.value = DEFAULT_CODE
}
</script>

<template>
  <section class="playground">
    <h2 class="title"><slot name="title" /></h2>
    <div class="body"><slot name="body" /></div>
    <div class="workbench">
      <div class="pane">
        <div class="pane-header">
          <span class="pane-label">Edit</span>
          <button type="button" class="reset" @click="reset">Reset</button>
        </div>
        <!--
          O visitante só edita o próprio texto, renderizado só na própria
          aba — nenhum dado sai daqui. v-html abaixo é o mesmo padrão
          documentado em Preview.vue, aplicado a uma fonte editável em vez
          de fixa.
        -->
        <textarea
          v-model="source"
          class="code-input"
          spellcheck="false"
          aria-label="kuba markup, editable"
          @input="schedule"
        />
      </div>
      <div class="pane">
        <div class="pane-header">
          <span class="pane-label">Live</span>
        </div>
        <div class="stage" v-html="rendered" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.playground {
  margin: 0 auto;
  max-width: var(--vp-layout-max-width);
  padding: var(--spacing-xl, 64px) var(--spacing_inset-md, 32px);
}

.title {
  color: var(--vp-c-text-1);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-sm);
  margin: 0 0 var(--spacing_inset-sm, 24px);
}

.body {
  color: var(--vp-c-text-2);
  font-size: var(--font-size-xs);
  line-height: var(--line-height-lg);
  margin: 0 0 var(--spacing-lg, 56px);
  max-width: 640px;
}

.workbench {
  display: grid;
  gap: var(--spacing_inset-md, 32px);
}

.pane {
  border: var(--border-width-hairline, 1px) solid var(--vp-c-divider);
  border-radius: var(--border-radius-md, 16px);
  overflow: hidden;
}

.pane-header {
  align-items: center;
  background: var(--vp-c-bg-soft);
  border-bottom: var(--border-width-hairline, 1px) solid var(--vp-c-divider);
  display: flex;
  justify-content: space-between;
  padding: var(--spacing_inset-nano, 8px) var(--spacing_inset-xs, 16px);
}

.pane-label {
  color: var(--vp-c-text-2);
  font-family: var(--font-family-highlight);
  font-size: var(--font-size-xxxs);
  font-weight: var(--font-weight-medium);
}

.reset {
  background: transparent;
  border: var(--border-width-hairline, 1px) solid var(--vp-c-divider);
  border-radius: var(--border-radius-sm, 8px);
  color: var(--vp-c-text-2);
  cursor: pointer;
  font-size: var(--font-size-xxxs);
  /* Alvo de toque >= 44x44px mesmo em um botão pequeno de texto. */
  min-height: 44px;
  padding: 0 var(--spacing_inset-xs, 16px);
  transition: border-color 0.15s ease;
}

.reset:hover,
.reset:focus-visible {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.code-input {
  background: var(--vp-c-bg-alt);
  border: 0;
  box-sizing: border-box;
  color: var(--vp-c-text-1);
  display: block;
  font-family: var(--vp-font-family-mono);
  font-size: var(--font-size-xxxs);
  line-height: var(--line-height-lg);
  min-height: 320px;
  padding: var(--spacing_inset-xs, 16px);
  resize: vertical;
  width: 100%;
}

.code-input:focus-visible {
  outline: var(--border-width-thin, 2px) solid var(--vp-c-brand-1);
  outline-offset: -2px;
}

.stage {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing_inset-xs, 16px);
  min-height: 320px;
  padding: var(--spacing_inset-md, 32px);
}

@media (min-width: 960px) {
  .workbench {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
