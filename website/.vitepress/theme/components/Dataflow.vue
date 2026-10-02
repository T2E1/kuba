<script setup>
/**
 * Diagrama de dataflow das receitas do Cookbook: os elementos de cima para
 * baixo, ligados pelos arcos que os conectam. Vertical de propósito — cabe na
 * coluna de conteúdo da doc e no celular sem rolagem lateral.
 *
 * O desenho tem uma espinha: toda linha é uma grade de três colunas, e a do
 * meio — a largura de um nó — guarda os nós e as setas. Assim cada seta sai
 * do centro de um nó e chega no centro do seguinte, sem cálculo de posição.
 * As colunas laterais levam o que comenta a espinha: o serviço externo ao
 * lado do fetch e os rótulos dos arcos (sucesso à esquerda, falha à direita
 * quando o fluxo se divide).
 *
 * A forma vem toda de `steps`, declarada num `<script setup>` da página; o
 * texto traduzível (`note`, `payload`, `caption`) fica com cada locale, e o
 * que é código (tag, nome, arco) é o mesmo nos três idiomas.
 *
 * Cada passo é um de três:
 *
 * - `{ node: { tag, name, note, external } }` — um elemento. `external`,
 *   opcional, é o serviço que ele chama (`{ host, path }`), desenhado ao lado.
 * - `{ arcs: [{ arc, payload, kind }] }` — uma ou mais setas lado a lado.
 *   `kind` é `ok` (sucesso), `fail` (falha) ou ausente (neutro).
 * - `{ group: { tag, name, note, fields: [{ name, chips: [{ kind, text }] }] } }`
 *   — um contêiner (o `<kb-form>`) com os campos que reagem aos arcos.
 */
const props = defineProps({
  steps: {
    type: Array,
    required: true,
  },
  caption: {
    type: String,
    default: '',
  },
})

/**
 * `source/event:type/sink` quebrado no `:` — a origem e o evento numa linha,
 * o que o arco faz na outra. Mantém o rótulo estreito o bastante para a
 * coluna lateral sem cortar o arco no meio de um nome.
 */
const split = (arc) => {
  const at = arc.indexOf(':')
  return at === -1 ? [arc] : [arc.slice(0, at), arc.slice(at)]
}
</script>

<template>
  <figure class="dataflow">
    <div class="bar"><i /><b>dataflow</b></div>
    <ol class="flow">
      <li
        v-for="(step, i) in props.steps"
        :key="i"
        class="row"
        :class="{ arcs: step.arcs }"
      >
        <template v-if="step.node">
          <div class="node center">
            <code class="tag">&lt;{{ step.node.tag }}&gt;</code>
            <span class="name">{{ step.node.name }}</span>
            <span v-if="step.node.note" class="note">{{ step.node.note }}</span>
          </div>
          <div v-if="step.node.external" class="external right">
            <span class="wire" aria-hidden="true" />
            <span class="service">
              <code>{{ step.node.external.host }}</code>
              <code class="path">{{ step.node.external.path }}</code>
            </span>
          </div>
        </template>

        <template v-else-if="step.arcs">
          <div class="lines center" aria-hidden="true">
            <span
              v-for="arc in step.arcs"
              :key="arc.arc"
              class="line"
              :class="arc.kind"
            />
          </div>
          <div
            v-for="(arc, a) in step.arcs"
            :key="arc.arc"
            class="label"
            :class="[arc.kind, step.arcs.length > 1 && a === 0 ? 'left' : 'right']"
          >
            <code class="grammar">
              <span v-for="part in split(arc.arc)" :key="part">{{ part }}</span>
            </code>
            <span v-if="arc.payload" class="payload">{{ arc.payload }}</span>
          </div>
        </template>

        <div v-else-if="step.group" class="group">
          <div class="group-head">
            <code class="tag">&lt;{{ step.group.tag }}&gt;</code>
            <span class="name">{{ step.group.name }}</span>
            <span v-if="step.group.note" class="note">{{ step.group.note }}</span>
          </div>
          <ul class="fields">
            <li v-for="field in step.group.fields" :key="field.name" class="field">
              <span class="field-name">{{ field.name }}</span>
              <span class="chips">
                <span
                  v-for="chip in field.chips"
                  :key="chip.text"
                  class="chip"
                  :class="chip.kind"
                >{{ chip.text }}</span>
              </span>
            </li>
          </ul>
        </div>
      </li>
    </ol>
    <figcaption v-if="props.caption" class="caption">{{ props.caption }}</figcaption>
  </figure>
</template>

<style scoped>
.dataflow {
  --df-node: 220px;
  --df-ok: var(--s1-s);
  --df-fail: var(--s1-danger);
  margin: 1.5rem 0;
  border: 2px solid var(--s1-line);
  background: var(--s1-panel);
  box-shadow: var(--s1-shadow-hard-lg);
}

:global(.dark) .dataflow {
  --df-fail: #f59b97;
}

.bar {
  height: var(--s1-bar-height);
  box-sizing: border-box;
  border-bottom: 2px solid var(--s1-line);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 6px;
  background: var(--s1-pattern-stripe);
  background-clip: content-box;
}

.bar i {
  width: 12px;
  height: 12px;
  border: 2px solid var(--s1-line);
  background: var(--s1-panel);
  flex: none;
  box-sizing: border-box;
}

.bar b {
  background: var(--s1-panel);
  padding: 0 10px;
  margin: 0 auto;
  font-family: var(--s1-font-chrome);
  font-size: 11px;
  font-weight: 400;
}

.flow {
  list-style: none;
  margin: 0;
  padding: 28px 16px;
  background: var(--s1-bg);
}

/* A espinha: lateral | nó | lateral. */
.row {
  margin: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) var(--df-node) minmax(0, 1fr);
  grid-template-areas: "left center right";
  align-items: center;
  column-gap: 14px;
}

.center {
  grid-area: center;
}

.left {
  grid-area: left;
  justify-self: end;
  text-align: right;
}

.right {
  grid-area: right;
  justify-self: start;
}

/* Mais específico que `.vp-doc code`, que daria fundo e borda a cada nome. */
.dataflow code {
  font-family: var(--s1-font-mono);
  background: none;
  border: 0;
  border-radius: 0;
  padding: 0;
}

.node,
.group {
  box-sizing: border-box;
  border: 2px solid var(--s1-line);
  background: var(--s1-panel);
  box-shadow: var(--s1-shadow-hard-sm);
}

.node {
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tag {
  font-size: 12px;
  color: var(--s1-t);
}

.name {
  font-size: 22px;
  line-height: 1.1;
  font-weight: 700;
  font-stretch: 88%;
  color: var(--s1-ink);
}

.note {
  font-size: 13px;
  line-height: 18px;
  color: var(--s1-muted);
}

/* O serviço que o fetch chama, ligado ao nó por um fio tracejado. */
.external {
  display: flex;
  align-items: center;
  margin-left: -14px;
  min-width: 0;
}

.wire {
  width: 22px;
  flex: none;
  border-top: 2px dashed var(--s1-line);
}

.service {
  min-width: 0;
  display: flex;
  flex-direction: column;
  padding: 6px 10px;
  border: 2px dashed var(--s1-line);
  background: var(--s1-panel);
}

.service code {
  font-size: 12px;
  line-height: 18px;
  overflow-wrap: anywhere;
}

.service .path {
  color: var(--s1-muted);
}

/* As setas: hastes verticais na coluna do meio, de nó a nó. Com um arco, a
   haste fica no centro; com dois, uma em cada terço. */
.lines {
  align-self: stretch;
  min-height: 72px;
  display: flex;
  justify-content: space-evenly;
}

.line {
  --df-color: var(--s1-ink);
  position: relative;
  width: 3px;
  margin-bottom: 10px;
  background: var(--df-color);
}

.line.ok {
  --df-color: var(--df-ok);
}

.line.fail {
  --df-color: var(--df-fail);
}

.line::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -10px;
  transform: translateX(-50%);
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-top: 10px solid var(--df-color);
}

.label {
  --df-color: var(--s1-ink);
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 0;
  color: var(--df-color);
}

.label.ok {
  --df-color: var(--df-ok);
}

.label.fail {
  --df-color: var(--df-fail);
}

.grammar {
  display: flex;
  flex-direction: column;
  font-size: 12px;
  line-height: 17px;
  font-weight: 600;
  color: inherit;
}

.payload {
  font-family: var(--s1-font-mono);
  font-size: 11px;
  line-height: 16px;
  color: var(--s1-muted);
  overflow-wrap: anywhere;
}

/* O contêiner ocupa a linha inteira, centrado sob a espinha. */
.group {
  grid-column: 1 / -1;
  justify-self: center;
  width: 100%;
  max-width: 560px;
  border-style: dashed;
  padding: 12px 14px 14px;
}

.group-head {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 4px 10px;
  margin-bottom: 12px;
}

.group-head .name {
  font-size: 18px;
}

.fields {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field {
  margin: 0;
  display: grid;
  grid-template-columns: 110px minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border: 2px solid var(--s1-line);
  background: var(--s1-panel);
}

.field-name {
  font-weight: 700;
  font-stretch: 88%;
  color: var(--s1-ink);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip {
  font-family: var(--s1-font-mono);
  font-size: 11px;
  font-weight: 600;
  line-height: 16px;
  padding: 2px 8px;
  border: 2px solid currentColor;
  color: var(--s1-ink);
  overflow-wrap: anywhere;
}

.chip.ok {
  color: var(--df-ok);
}

.chip.fail {
  color: var(--df-fail);
}

.caption {
  padding: 12px 16px;
  border-top: 2px solid var(--s1-line);
  font-size: 14px;
  line-height: 21px;
  color: var(--s1-muted);
}

/* Estreito demais para três colunas: a espinha vira uma coluna só, e o que
   ficava ao lado desce para baixo do nó ou da seta que comenta. */
@media (max-width: 640px) {
  .row {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
      "center"
      "left"
      "right";
    justify-items: center;
  }

  /* Numa linha de setas, os rótulos vêm antes das hastes, para que cada
     ponta continue chegando no nó seguinte. */
  .row.arcs {
    grid-template-areas:
      "left"
      "right"
      "center";
  }

  .left,
  .right {
    justify-self: center;
    text-align: center;
  }

  .external {
    margin: 8px 0 0;
  }

  .wire {
    display: none;
  }

  .node {
    width: var(--df-node);
  }

  .lines {
    width: var(--df-node);
    min-height: 48px;
  }

  .label {
    align-items: center;
  }

  .grammar {
    align-items: center;
  }

  .field {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
