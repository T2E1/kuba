<script setup>
import { useData } from 'vitepress'
import { computed } from 'vue'
import { trailTo } from './trail.js'

/**
 * "construir ui / componentes / button", acima do `<h1>` de cada página de
 * doc — Docs.dc.html:85. `theme.sidebar` já é a árvore resolvida do locale
 * atual (website/.vitepress/navigation/sidebar.js, com o texto de
 * labels.js) — a mesma árvore que `VPSidebar` desenha à esquerda. Em vez de
 * duplicar essa árvore, ela é percorrida por `trailTo` (`trail.js`, que o
 * `BreadcrumbList` do JSON-LD também usa) até o item da página aberta.
 */
const { theme, page } = useData()

const trail = computed(() => {
  const sidebar = theme.value.sidebar
  if (!Array.isArray(sidebar)) {
    return []
  }
  const items = trailTo(sidebar, page.value.relativePath) ?? []
  return items.map((item) => item.text)
})
</script>

<template>
  <p v-if="trail.length" class="s1-breadcrumb">{{ trail.join(' / ') }}</p>
</template>
