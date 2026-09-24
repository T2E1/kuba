<template>
  <aside class="s1-win notes">
    <div class="s1-bar"><i></i><b><slot name="file" /></b></div>
    <div class="s1-prose list"><slot /></div>
  </aside>
</template>

<style scoped>
/**
 * Notas de rodapé numeradas numa janela `notes.txt` — Manifesto.dc.html,
 * fim da página. O conteúdo é a lista ordenada do markdown.
 */
.notes {
  width: 100%;
  max-width: 600px;
  margin-top: 24px;
  color: var(--s1-ink);
}

.list {
  font-size: 13px;
  line-height: 20px;
  padding: 16px 20px 18px;
}

.list :deep(ol) {
  display: flex;
  flex-direction: column;
  gap: 6px;
  list-style: decimal;
  margin: 0;
  padding-left: 18px;
}
</style>
