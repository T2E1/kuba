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
    <div class="s1-container">
      <p class="eyebrow"><slot name="eyebrow" /></p>
      <h2 class="title"><slot name="title" /></h2>
      <div class="body"><slot name="body" /></div>
      <div class="workbench s1-light-island">
        <div class="pane pane-edit">
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
        <div class="pane pane-live">
          <div class="pane-header">
            <span class="pane-label">Live</span>
          </div>
          <div class="stage" v-html="rendered" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/**
 * Main.dc.html:270-305 — seção sempre preta, com os dois painéis sempre
 * claros por dentro (`.s1-light-island` no `.workbench`) e sombras duras
 * coloridas: violeta no editor, magenta no ao vivo.
 */
.playground {
  background: #111111;
  color: #f4f1ea;
  border-top: 2px solid #111111;
  padding: 120px 0 96px;
  text-align: center;
}

.eyebrow {
  display: inline-block;
  border: 2px solid #f4f1ea;
  font-family: var(--s1-font-chrome);
  font-size: 11px;
  margin: 0 0 24px;
  padding: 3px 8px;
  text-transform: lowercase;
}

.title {
  color: #f4f1ea;
  font-family: var(--s1-font-base);
  /* Main.dc.html:275 — 88px/0.95/-0.045em. */
  font-size: clamp(2.25rem, 7vw, 88px);
  font-weight: 700;
  font-stretch: 88%;
  letter-spacing: -0.045em;
  line-height: 0.95;
  margin: 0;
}

.body {
  color: #d8d4cb;
  font-size: 18px;
  line-height: 27px;
  margin: 22px auto 0;
  max-width: 600px;
}

.workbench {
  display: flex;
  flex-direction: column;
  gap: 28px;
  margin-top: 56px;
  color: var(--s1-ink);
  text-align: left;
}

.pane {
  border: 2px solid var(--s1-line);
  background: var(--s1-panel);
  overflow: hidden;
}

.pane-edit {
  box-shadow: 6px 6px 0 #6d5cae;
}

.pane-live {
  box-shadow: 6px 6px 0 #e03ad2;
}

.pane-header {
  align-items: center;
  height: var(--s1-bar-height);
  box-sizing: border-box;
  background: var(--s1-pattern-stripe);
  background-clip: content-box;
  border-bottom: 2px solid var(--s1-line);
  display: flex;
  justify-content: space-between;
  padding: 5px 6px;
}

.pane-label {
  background: var(--s1-panel);
  color: var(--s1-ink);
  font-family: var(--s1-font-chrome);
  font-size: 11px;
  font-weight: 400;
  padding: 0 10px;
}

.reset {
  background: var(--s1-panel);
  border: 2px solid var(--s1-line);
  color: var(--s1-ink);
  cursor: pointer;
  font-family: var(--s1-font-chrome);
  font-size: 11px;
  /* Alvo de toque >= 44x44px mesmo em um botão pequeno de texto. */
  min-height: 32px;
  padding: 0 10px;
}

.reset:hover,
.reset:focus-visible {
  background: #e2deef;
}

.reset:active {
  transform: translate(2px, 2px);
}

.code-input {
  background: var(--s1-code);
  border: 0;
  box-sizing: border-box;
  color: var(--s1-ink);
  display: block;
  font-family: var(--s1-font-mono);
  /* Main.dc.html:281 — pre do editor: 12px/19px. */
  font-size: 12px;
  line-height: 19px;
  min-height: 320px;
  padding: 16px;
  resize: vertical;
  width: 100%;
}

.code-input:focus-visible {
  outline: 3px dashed var(--s1-line);
  outline-offset: -3px;
}

.stage {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  min-height: 320px;
  padding: 28px 24px;
  background-image: var(--s1-pattern-dots);
  background-size: var(--s1-pattern-dots-size);
  background-color: #f7c6d1;
}

/* Main.dc.html:278-303 — os dois painéis não dividem o espaço igualmente:
   o editor tem largura própria (540px) e o "ao vivo" cresce para preencher
   o resto (`flex-grow: 1`), em vez do `1fr 1fr` que existia aqui antes. */
@media (min-width: 860px) {
  .workbench {
    flex-direction: row;
    align-items: stretch;
  }

  .pane-edit {
    flex: 0 0 540px;
  }

  .pane-live {
    flex: 1 1 auto;
    min-width: 0;
  }
}
</style>
