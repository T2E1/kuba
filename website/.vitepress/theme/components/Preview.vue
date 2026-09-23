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
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--border-radius-sm, 8px);
  margin: 1.5rem 0;
  overflow: hidden;
}

.stage {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing_inset-xs, 16px);
  padding: var(--spacing_inset-md, 32px);
}

.source {
  border-top: 1px solid var(--vp-c-divider);
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
