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
    <div class="s1-container">
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
    </div>
  </section>
</template>

<style scoped>
/* Main.dc.html:88-90,93,98 — padding-top 120px (não 64px, o token de
   espaçamento que existia aqui antes), coluna de 1040px que agora vem de
   `.s1-container` em vez de `.problem` mesmo (a cor de fundo precisa ir de
   ponta a ponta da viewport, não só até 1040px). */
.problem {
  padding: 120px 0 96px;
  background: var(--s1-blush);
  border-top: 2px solid var(--s1-line);
}

.intro {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.title {
  color: var(--s1-ink);
  font-family: var(--s1-font-base);
  /* Main.dc.html:92 — 72px/0.95/-0.04em, max-width 920px. */
  font-size: clamp(2rem, 6vw, 72px);
  font-weight: 700;
  font-stretch: 88%;
  letter-spacing: -0.04em;
  line-height: 0.95;
  margin: 0;
  max-width: 920px;
}

.body {
  color: var(--s1-ink);
  font-size: 16px;
  line-height: 25px;
  margin-top: 48px;
  max-width: 640px;
  text-align: left;
}

.comparison {
  display: grid;
  gap: 28px;
  margin-top: 64px;
  width: 100%;
}

.column {
  min-width: 0;
}

.label {
  color: var(--s1-ink);
  font-family: var(--s1-font-chrome);
  font-size: 11px;
  font-weight: 400;
  text-transform: lowercase;
  margin: 0 0 var(--spacing_inset-quarck, 4px);
}

.tablist {
  border-bottom: 2px solid var(--s1-line);
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing_inset-xs, 16px);
  margin: 0 0 var(--spacing_inset-xs, 16px);
}

.tab {
  background: none;
  border: none;
  border-bottom: 4px solid transparent;
  color: var(--s1-ink);
  cursor: pointer;
  font-family: var(--s1-font-base);
  font-size: 14px;
  font-weight: 600;
  /* Sobrepõe a borda de 2px do `.tablist` para a borda de estado ativo (4px)
     nascer rente a ela, sem deslocar o texto quando a aba é selecionada. */
  margin-bottom: -2px;
  /* 44×44px é o alvo de toque mínimo do WCAG 2.5.5 — critério fixo da
     especificação, não uma medida do design system. */
  min-height: 44px;
  padding: var(--spacing_inset-quarck, 4px) var(--spacing_inset-xs, 16px);
}

.tab[aria-selected='true'] {
  border-bottom-color: var(--s1-ink);
}

.tab:focus-visible {
  outline: 3px dashed var(--s1-line);
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
.code {
  border: 2px solid var(--s1-line);
  background: var(--s1-code);
  box-shadow: var(--s1-shadow-hard-lg);
}

.code :deep(div[class*='language-']) {
  background: none;
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
