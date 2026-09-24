<script setup>
import { ref } from 'vue'

/**
 * Identificadores estruturais dos frameworks comparados no lado "Sem kuba".
 * Servem só para montar o nome dinâmico dos slots (`code-before-<id>` /
 * `code-before-<id>-label`) — nenhum texto exibido vem daqui. O rótulo de
 * cada aba é inteiramente o conteúdo do slot `-label` correspondente,
 * escrito em `docs/index.md` (e nas traduções).
 */
const frameworks = ['react', 'vue', 'angular']

const activeFramework = ref(frameworks[0])
const tabElements = {}

function setTabRef(framework, element) {
  tabElements[framework] = element
}

function selectFramework(framework) {
  activeFramework.value = framework
}

function focusFramework(framework) {
  selectFramework(framework)
  tabElements[framework]?.focus()
}

function frameworkAt(offsetFromActive) {
  const currentIndex = frameworks.indexOf(activeFramework.value)
  const total = frameworks.length
  const nextIndex = (currentIndex + offsetFromActive + total) % total
  return frameworks[nextIndex]
}

/**
 * Ativação automática do padrão ARIA APG Tabs: a seta já troca a aba
 * selecionada (e o painel visível), não só o foco — Home/End pulam para a
 * primeira/última aba. `Enter`/`Space` funcionam pelo comportamento nativo
 * de `<button>`, sem handler extra.
 */
function onTabKeydown(event) {
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    focusFramework(frameworkAt(1))
    return
  }
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    focusFramework(frameworkAt(-1))
    return
  }
  if (event.key === 'Home') {
    event.preventDefault()
    focusFramework(frameworks[0])
    return
  }
  if (event.key === 'End') {
    event.preventDefault()
    focusFramework(frameworks[frameworks.length - 1])
  }
}
</script>

<template>
  <section class="problem s1-light-island s1-rails">
    <div class="s1-container">
      <div class="intro">
        <p class="s1-chip"><slot name="eyebrow" /></p>
        <h2 class="title"><slot name="title" /></h2>
        <div class="body"><slot name="body" /></div>
      </div>
      <div class="comparison">
        <div class="column s1-win">
          <div class="s1-bar"><i /><b id="code-before-tablist-label"><slot name="code-before-label" /></b></div>
          <div class="tablist" role="tablist" aria-labelledby="code-before-tablist-label">
            <button
              v-for="framework in frameworks"
              :id="`tab-${framework}`"
              :key="framework"
              :ref="(element) => setTabRef(framework, element)"
              class="tab"
              role="tab"
              type="button"
              :aria-controls="`panel-${framework}`"
              :aria-selected="activeFramework === framework ? 'true' : 'false'"
              :tabindex="activeFramework === framework ? 0 : -1"
              @click="selectFramework(framework)"
              @keydown="onTabKeydown"
            >
              <slot :name="`code-before-${framework}-label`" />
            </button>
          </div>
          <div
            v-for="framework in frameworks"
            v-show="activeFramework === framework"
            :id="`panel-${framework}`"
            :key="framework"
            :aria-labelledby="`tab-${framework}`"
            class="code"
            role="tabpanel"
            tabindex="0"
          >
            <slot :name="`code-before-${framework}`" />
          </div>
        </div>
        <div class="column column-after">
          <div class="s1-win">
            <div class="s1-bar"><i /><b><slot name="code-after-label" /></b></div>
            <div class="code"><slot name="code-after" /></div>
          </div>
          <div class="caption"><slot name="code-after-caption" /></div>
        </div>
      </div>
      <div class="stat">
        <p class="stat-figure"><slot name="stat" /></p>
        <p class="stat-caption"><slot name="stat-caption" /></p>
      </div>
    </div>
  </section>
</template>

<style scoped>
/**
 * Main.dc.html:88-172 — etiqueta, título de 72px, dois parágrafos em
 * colunas, as duas janelas de código lado a lado (a do kuba descida 56px)
 * e o número grande no fim. Ilha clara em blush nos dois modos.
 */
.problem {
  background: #f28aa0;
  border-top: 2px solid #111111;
  padding: 120px 0 104px;
}

.intro {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.title {
  font-family: var(--s1-font-base);
  font-size: clamp(2rem, 6.5vw, 72px);
  font-weight: 700;
  font-stretch: 88%;
  letter-spacing: -0.04em;
  line-height: 0.95;
  margin: 24px 0 0;
  max-width: 920px;
}

.body {
  font-size: 16px;
  line-height: 25px;
  margin-top: 48px;
  text-align: left;
  display: grid;
  gap: 24px 48px;
}

.body :deep(p) {
  margin: 0;
}

.comparison {
  display: grid;
  gap: 28px;
  margin-top: 64px;
  width: 100%;
  align-items: start;
}

.column {
  min-width: 0;
}

.column-after {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.tablist {
  border-bottom: 2px solid #111111;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 0 8px;
}

.tab {
  background: none;
  border: none;
  border-bottom: 4px solid transparent;
  color: #111111;
  cursor: pointer;
  font-family: var(--s1-font-chrome);
  font-size: 11px;
  margin-bottom: -2px;
  /* 44×44px é o alvo de toque mínimo do WCAG 2.5.5. */
  min-height: 44px;
  padding: 4px 12px;
  text-transform: lowercase;
}

.tab[aria-selected='true'] {
  border-bottom-color: #111111;
}

.tab:focus-visible {
  outline: 3px dashed #111111;
  outline-offset: -3px;
}

/* Fora de `.vp-doc` (`layout: page`), o bloco do Shiki chega sem rolagem
   horizontal, botão de copiar posicionado nem rótulo de linguagem — a
   moldura de janela já nomeia o arquivo, então os dois somem. */
.code :deep(div[class*='language-']) {
  background: none;
  margin: 0;
  overflow-x: auto;
}

.code :deep(pre) {
  margin: 0;
  padding: 16px;
  font-size: 12.5px;
  line-height: 20px;
}

.code :deep(button.copy),
.code :deep(span.lang) {
  display: none;
}

.caption {
  font-size: 15px;
  line-height: 23px;
  padding: 0 4px;
}

.caption :deep(p) {
  margin: 0;
}

.caption :deep(code) {
  font-family: var(--s1-font-mono);
  font-size: 0.86em;
}

.caption :deep(a) {
  color: #111111;
  font-weight: 700;
  text-underline-offset: 4px;
}

.stat {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-top: 96px;
  border-top: 2px solid #111111;
  padding-top: 28px;
}

.stat-figure {
  font-family: var(--s1-font-base);
  font-size: clamp(3rem, 10vw, 104px);
  font-weight: 700;
  font-stretch: 88%;
  letter-spacing: -0.05em;
  line-height: 0.9;
  margin: 0;
}

.stat-caption {
  font-family: var(--s1-font-chrome);
  font-size: 11px;
  line-height: 18px;
  margin: 0;
  max-width: 260px;
  text-align: right;
}

@media (min-width: 768px) {
  .body {
    grid-template-columns: 1fr 1fr;
  }

  .comparison {
    grid-template-columns: minmax(0, 490fr) minmax(0, 522fr);
  }

  .column-after {
    margin-top: 56px;
  }
}
</style>
