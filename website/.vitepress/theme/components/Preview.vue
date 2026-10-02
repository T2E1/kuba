<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps({
  /**
   * Marcação HTML executada ao vivo no estágio — a mesma fonte que aparece
   * no bloco "Code" abaixo, quando o slot padrão não fornece uma versão já
   * destacada.
   */
  code: {
    type: String,
    required: true,
  },
})

/**
 * O exemplo é montado só no cliente. No SSR o estágio sai vazio: os `<kb-*>`
 * só ganham comportamento depois que o `kuba.js` do CDN define os elementos,
 * e um `v-html` hidratado compararia a marcação do servidor com um DOM que os
 * próprios elementos já alteraram (slots atribuídos, shadow roots), gerando
 * mismatch. Montar em `onMounted` também cobre a navegação SPA: cada página
 * monta o seu estágio de novo, e o Echo religa os arcos no `connectedCallback`.
 */
const stage = ref(null)

onMounted(() => {
  stage.value.innerHTML = props.code
})
</script>

<template>
  <div class="preview">
    <div class="bar"><i /><b>preview</b></div>
    <!--
      O HTML de `code` vem só das páginas de website/docs, escritas pelo
      próprio time — nunca de input de visitante. innerHTML é seguro aqui pela
      mesma razão que dangerouslySetInnerHTML era seguro na versão React
      (website/src/components/Preview/index.jsx): a fonte é confiável, não
      é dado externo.
    -->
    <div ref="stage" class="stage s1-stage" />
    <details class="source">
      <summary>Code</summary>
      <!--
        O plugin markdown-it (`.vitepress/plugins/preview.js`) injeta aqui o
        HTML já destacado pelo Shiki no build, via o slot padrão. Usado fora
        do plugin, sem slot, o fallback abaixo mostra a fonte como texto
        plano.
      -->
      <slot>
        <pre class="source-fallback"><code>{{ code }}</code></pre>
      </slot>
    </details>
  </div>
</template>

<style scoped>
.preview {
  border: 2px solid var(--s1-line);
  box-shadow: var(--s1-shadow-hard-lg);
  margin: 1.5rem 0;
  overflow: hidden;
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

.stage {
  align-items: center;
  justify-content: center;
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  padding: var(--spacing_inset-md, 32px);
  /* Docs.dc.html:91 — 150px é a altura do primeiro preview da página; usado
     como piso, não altura travada, porque este componente é reaproveitado
     por qualquer página de doc — um preview com mais linhas de conteúdo
     não pode ser cortado nos 150px de um exemplo de uma linha só. */
  min-height: 150px;
  /* Fundo, pontilhado e esquema de cor: `.s1-stage` em custom.css. */
}

.source {
  border-top: 2px solid var(--s1-line);
}

.source summary {
  cursor: pointer;
  font-size: 0.85rem;
  padding: 0.6rem 1rem;
  user-select: none;
}

.source summary:hover {
  background: var(--vp-c-default-soft);
}

.source :deep(pre),
.source-fallback {
  border-radius: 0;
  margin: 0;
}

@media (max-width: 768px) {
  .stage {
    padding: var(--spacing_inset-xs, 16px);
  }
}
</style>
