<script setup>
import { useSlots } from 'vue'

const slots = useSlots()

/**
 * #docs-link e #github-link carregam a URL como texto simples, não como
 * href — não dá para usar `:href="slot"` direto num named slot. Extrai o
 * texto do(s) nó(s) do slot para virar o destino do link.
 *
 * Assume que os dois slots continuam texto puro (como estão hoje em
 * website/docs/index.md, sem `` ` `` nem ênfase). Se o writer algum dia
 * envolver a URL em formatação markdown, a extração para de achar texto e
 * o link cai para "#" — fragilidade aceita agora para não generalizar um
 * parser de VNode para um único uso (YAGNI).
 */
function linkFrom(name) {
  const nodes = slots[name]?.() ?? []
  return nodes
    .map((node) =>
      typeof node === 'string'
        ? node
        : typeof node?.children === 'string'
          ? node.children
          : ''
    )
    .join('')
    .trim()
}
</script>

<template>
  <section class="cta" aria-label="Get started">
    <p class="install">
      <code><slot name="install" /></code>
    </p>
    <div class="links">
      <a class="link primary" :href="linkFrom('docs-link') || '#'">
        <slot name="docs-label" />
      </a>
      <a
        class="link"
        :href="linkFrom('github-link') || '#'"
        target="_blank"
        rel="noopener"
      >
        <slot name="github-label" />
      </a>
    </div>
  </section>
</template>

<style scoped>
.cta {
  margin: 0 auto;
  max-width: var(--vp-layout-max-width);
  padding: var(--spacing-xl, 64px) var(--spacing_inset-md, 32px);
  text-align: center;
}

.install {
  margin: 0 0 var(--spacing_inset-md, 32px);
}

.install code {
  background: var(--vp-c-bg-alt);
  border: var(--border-width-hairline, 1px) solid var(--vp-c-divider);
  border-radius: var(--border-radius-sm, 8px);
  color: var(--vp-c-text-1);
  font-size: var(--font-size-xs);
  padding: var(--spacing_inset-nano, 8px) var(--spacing_inset-sm, 24px);
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing_inset-xs, 16px);
  justify-content: center;
}

.link {
  align-items: center;
  border: var(--border-width-thin, 2px) solid var(--vp-c-brand-1);
  border-radius: var(--border-radius-pill);
  color: var(--vp-c-brand-1);
  display: inline-flex;
  font-weight: var(--font-weight-medium);
  /* Alvo de toque >= 44x44px. */
  min-height: 44px;
  padding: 0 var(--spacing_inset-md, 32px);
  text-decoration: none;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.link.primary {
  background: var(--vp-c-brand-1);
  color: var(--vp-c-white);
}

.link:hover,
.link:focus-visible {
  background: var(--vp-c-brand-2);
  border-color: var(--vp-c-brand-2);
  color: var(--vp-c-white);
}

.link:focus-visible {
  outline: var(--border-width-thin, 2px) solid var(--vp-c-brand-1);
  outline-offset: 2px;
}
</style>
