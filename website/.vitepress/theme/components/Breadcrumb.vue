<script setup>
import { useData } from 'vitepress'
import { isActive } from 'vitepress/dist/client/shared.js'
import { computed } from 'vue'

/**
 * "construir ui / componentes / button", acima do `<h1>` de cada página de
 * doc — Docs.dc.html:85. `theme.sidebar` já é a árvore resolvida do locale
 * atual (website/.vitepress/navigation/sidebar.js, com o texto de
 * labels.js) — a mesma árvore que `VPSidebar` desenha à esquerda. Em vez de
 * duplicar essa árvore, ela é percorrida até achar o item cujo `link` é a
 * página aberta, acumulando o rótulo de cada grupo ancestral.
 *
 * `isActive` é o mesmo comparador de rota que `VPSidebarItem` usa para
 * marcar o item corrente (node_modules/vitepress/dist/client/theme-default/composables/sidebar.js:96) —
 * reaproveitado em vez de reescrito, para não divergir do critério "esta
 * página está ativa" que o resto do tema já segue.
 */
const { theme, page } = useData()

function trailTo(items, path) {
  for (const item of items) {
    if (item.link && isActive(path, item.link)) {
      return [item.text]
    }
    if (item.items) {
      const nested = trailTo(item.items, path)
      if (nested) {
        return [item.text, ...nested]
      }
    }
  }
  return null
}

const trail = computed(() => {
  const sidebar = theme.value.sidebar
  if (!Array.isArray(sidebar)) {
    return []
  }
  return trailTo(sidebar, page.value.relativePath) ?? []
})
</script>

<template>
  <p v-if="trail.length" class="s1-breadcrumb">{{ trail.join(' / ') }}</p>
</template>
