<script setup>
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { computed } from 'vue'

/**
 * Estende o `Layout` padrão só pelos slots que ele já expõe — nenhuma parte
 * da mecânica de roteamento, build ou renderização do VitePress é tocada
 * aqui, só a composição visual dos pontos que o tema padrão não cobre:
 *
 * - `doc-before`: o fio de migalhas acima do `<h1>` de cada página de doc
 *   (Docs.dc.html:85) — `VPDoc` só renderiza este slot dentro do layout de
 *   doc, então ele nunca aparece na home.
 * - `layout-bottom`: o rodapé do System One (`SiteFooter.vue`), sempre
 *   visível — ver `custom.css`, seção 15, sobre por que o `VPFooter` nativo
 *   não serve.
 * - `s1-home`: a landing usa cabeçalho de 56px (Main.dc.html:33); a doc usa
 *   64px (Docs.dc.html:39). Os dois compartilham o mesmo `VPNavBar`, então a
 *   diferença de altura só existe como variação de contexto — a classe
 *   troca `--vp-nav-height` (ver `custom.css`) sem duplicar o componente.
 *   `relativePath` identifica a home nas três traduções sem comparar rota
 *   contra `base`/prefixo de locale.
 */
const { page } = useData()
const { Layout } = DefaultTheme

const isHome = computed(() =>
  ['index.md', 'pt-br/index.md', 'es/index.md'].includes(
    page.value.relativePath,
  ),
)
</script>

<template>
  <Layout :class="{ 's1-home': isHome }">
    <template #doc-before>
      <Breadcrumb />
    </template>
    <template #layout-bottom>
      <SiteFooter />
    </template>
  </Layout>
</template>
