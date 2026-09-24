<script setup>
/**
 * As quatro partes do arco na ordem em que se escrevem. O exemplo
 * (`dog/changed:method/get`) e os nomes das partes são código, iguais nos
 * três idiomas; só a explicação de cada uma vem dos slots da página.
 */
const PARTS = [
  { name: 'source', value: 'dog', separator: '/', tone: '#6d5cae' },
  { name: 'event', value: 'changed', separator: ':', tone: '#e03ad2' },
  { name: 'type', value: 'method', separator: '/', tone: '#0e7c6b' },
  { name: 'sink', value: 'get', separator: '', tone: '#111111' },
]
</script>

<template>
  <section class="how-it-works s1-light-island s1-rails">
    <div class="s1-container column">
      <p class="s1-chip"><slot name="eyebrow" /></p>
      <h2 class="title"><slot name="title" /></h2>
      <div class="intro"><slot name="intro" /></div>

      <div class="panel s1-dots">
        <div class="s1-win anatomy">
          <div class="s1-bar"><i /><b>arc</b></div>
          <p class="arc" aria-label="dog/changed:method/get">
            <template v-for="part in PARTS" :key="part.name">
              <span class="part">
                <span class="value" :style="{ borderColor: part.tone }">{{ part.value }}</span>
                <span class="name">{{ part.name }}</span>
              </span>
              <span v-if="part.separator" class="separator">{{ part.separator }}</span>
            </template>
          </p>
        </div>
      </div>

      <div class="parts">
        <article v-for="part in PARTS" :key="part.name" class="s1-win">
          <div class="s1-bar"><i /><b>{{ part.name }}</b></div>
          <div class="part-body"><slot :name="part.name" /></div>
        </article>
      </div>

      <div class="reading"><slot name="reading" /></div>
    </div>
  </section>
</template>

<style scoped>
/**
 * Main.dc.html:176-205 — etiqueta, título de 88px, o arco em letras de 64px
 * dentro de uma janela sobre fundo pontilhado, as quatro partes em janelas
 * pequenas e a leitura do arco em prosa. Ilha clara em blush.
 */
.how-it-works {
  background: #f28aa0;
  border-top: 2px solid #111111;
  padding: 120px 0 112px;
}

.column {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.title {
  font-family: var(--s1-font-base);
  font-size: clamp(2.25rem, 8vw, 88px);
  font-weight: 700;
  font-stretch: 88%;
  letter-spacing: -0.045em;
  line-height: 0.95;
  margin: 24px 0 0;
}

.intro {
  font-size: 18px;
  line-height: 27px;
  margin-top: 22px;
  max-width: 620px;
}

.intro :deep(p),
.reading :deep(p),
.part-body :deep(p) {
  margin: 0;
}

.intro :deep(code),
.reading :deep(code),
.part-body :deep(code) {
  font-family: var(--s1-font-mono);
  font-size: 0.86em;
}

.panel {
  width: 100%;
  box-sizing: border-box;
  margin-top: 56px;
  padding: 44px 40px;
  border: 2px solid #111111;
  background-color: #ffffff;
}

.anatomy {
  max-width: 940px;
  margin: 0 auto;
}

.arc {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  justify-content: center;
  align-items: flex-start;
  margin: 0;
  padding: 36px 24px 30px;
  font-family: var(--s1-font-mono);
  font-size: clamp(1.25rem, 4.6vw, 58px);
  line-height: 1;
}

.part {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.value {
  font-weight: 600;
  border-bottom: 6px solid;
  padding: 0 6px 6px;
}

.name {
  font-family: var(--s1-font-chrome);
  font-size: 12px;
}

.separator {
  color: #9a9a9a;
}

.parts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-top: 40px;
  width: 100%;
  text-align: left;
}

.part-body {
  font-size: 15px;
  line-height: 22px;
  padding: 14px 16px 18px;
}

.reading {
  font-size: 20px;
  font-weight: 500;
  line-height: 30px;
  margin-top: 56px;
  max-width: 760px;
}
</style>
