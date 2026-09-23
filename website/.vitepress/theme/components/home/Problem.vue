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
  <section class="problem">
    <div class="intro">
      <h2 class="title"><slot name="title" /></h2>
      <div class="body"><slot name="body" /></div>
    </div>
    <div class="comparison">
      <div class="column">
        <p class="label" id="code-before-tablist-label"><slot name="code-before-label" /></p>
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
      <div class="column">
        <p class="label"><slot name="code-after-label" /></p>
        <div class="code"><slot name="code-after" /></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.problem {
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
  /* Mesma medida de leitura usada em Hero.vue — dívida de token já
     registrada lá. */
  max-width: 640px;
}

.body {
  color: var(--vp-c-text-2);
  font-size: var(--font-size-xs);
  line-height: var(--line-height-lg);
  margin: 0 0 var(--spacing-lg, 56px);
  max-width: 640px;
}

.comparison {
  display: grid;
  gap: var(--spacing_inset-md, 32px);
}

.column {
  min-width: 0;
}

.label {
  color: var(--vp-c-text-2);
  font-family: var(--font-family-highlight);
  font-size: var(--font-size-xxxs);
  font-weight: var(--font-weight-medium);
  margin: 0 0 var(--spacing_inset-quarck, 4px);
}

.tablist {
  border-bottom: var(--border-width-hairline, 1px) solid var(--vp-c-divider);
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing_inset-xs, 16px);
  margin: 0 0 var(--spacing_inset-xs, 16px);
}

.tab {
  background: none;
  border: none;
  border-bottom: var(--border-width-thick, 4px) solid transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
  font-family: var(--font-family-highlight);
  font-size: var(--font-size-xxs);
  font-weight: var(--font-weight-medium);
  /* Sobrepõe a borda de 1px do `.tablist` para a borda de estado ativo (4px)
     nascer rente a ela, sem deslocar o texto quando a aba é selecionada. */
  margin-bottom: calc(var(--border-width-hairline, 1px) * -1);
  /* 44×44px é o alvo de toque mínimo do WCAG 2.5.5 — critério fixo da
     especificação, não uma medida do design system. */
  min-height: 44px;
  padding: var(--spacing_inset-quarck, 4px) var(--spacing_inset-xs, 16px);
}

.tab[aria-selected='true'] {
  border-bottom-color: var(--vp-c-brand-1);
  /* `--vp-c-brand-1` como elemento de interface (não texto de corpo) — a
     mesma ressalva de contraste documentada em custom.css. */
  color: var(--vp-c-brand-1);
}

.tab:focus-visible {
  outline: var(--border-width-thin, 2px) solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

/**
 * Sem `.vp-doc` como ancestral (esta página usa `layout: page`, que não
 * envolve o conteúdo nessa classe — ver `node_modules/vitepress/dist/client/theme-default/composables/sidebar.js`
 * e `VPContent.vue`), o bloco de código do Shiki chega sem o
 * `overflow-x: auto` que `.vp-doc [class*='language-'] pre` normalmente
 * aplica. Sem ele, uma linha longa (o `jsx` de `#code-before-react`, por
 * exemplo) estica o `<pre>` além da faixa do grid — que só tem
 * `min-width: 0` no `.column`, não largura travada — e o texto invade
 * visualmente a coluna vizinha. `overflow-x: auto` mantém a rolagem
 * dentro da própria coluna; o card por trás replica o tratamento que
 * `Hero.vue` já dá ao bloco `#proof`, para as colunas não ficarem como
 * texto cru ao lado do card do Hero. A seleção `.code` cobre os quatro
 * blocos — os três painéis de aba e o lado kuba — sem repetir a regra.
 */
.code :deep(div[class*='language-']) {
  background: var(--vp-c-bg-soft);
  border-radius: var(--border-radius-md, 16px);
  margin: 0;
  overflow-x: auto;
}

.code :deep(pre) {
  margin: 0;
  padding: var(--spacing_inset-xs, 16px);
}

/**
 * `button.copy` e `span.lang` só ganham aparência (ícone, posição,
 * esconder-até-hover) via `.vp-doc [class*='language-'] > button.copy` e
 * `.vp-doc [class*='language-'] > span.lang` — de novo, fora do alcance
 * sem `.vp-doc`. Sem essas regras os dois viram um botão vazio e um rótulo
 * de texto cru colados à primeira linha do código, e o rótulo já é
 * redundante com os rótulos das abas / `#code-after-label` acima do bloco.
 * Mais simples esconder os dois aqui do que recriar o posicionamento
 * absoluto e o hover só para este bloco.
 */
.code :deep(button.copy),
.code :deep(span.lang) {
  display: none;
}

@media (min-width: 768px) {
  .comparison {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
