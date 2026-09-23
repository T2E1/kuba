<script setup>
defineProps({
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
</script>

<template>
  <div class="preview">
    <div class="bar"><i /><b>preview</b></div>
    <!--
      O HTML de `code` vem só das páginas de website/docs, escritas pelo
      próprio time — nunca de input de visitante. v-html é seguro aqui pela
      mesma razão que dangerouslySetInnerHTML era seguro na versão React
      (website/src/components/Preview/index.jsx): a fonte é confiável, não
      é dado externo.
    -->
    <div class="stage" v-html="code" />
    <details class="source">
      <summary>Code</summary>
      <!--
        O plugin markdown-it (`.vitepress/plugins/preview.js`) injeta aqui o
        HTML já destacado pelo Shiki no build, via o slot padrão. Enquanto o
        plugin for um no-op, não há conteúdo de slot — o fallback abaixo
        mostra a fonte como texto plano em vez de quebrar a página.
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
  background-image: var(--s1-pattern-dots);
  background-size: var(--s1-pattern-dots-size);
  background-color: var(--s1-stage);
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
