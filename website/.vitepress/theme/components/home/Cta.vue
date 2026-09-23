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
          : '',
    )
    .join('')
    .trim()
}
</script>

<template>
  <section class="cta" aria-label="Get started">
    <div class="s1-container">
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
    </div>
  </section>
</template>

<style scoped>
.cta {
  background: var(--s1-bg);
  padding: 64px 0;
  text-align: center;
}

.install {
  margin: 0 0 30px;
}

/* Main.dc.html:350 — mesma janela de instalação do rodapé. */
.install code {
  background: var(--s1-panel);
  border: 2px solid var(--s1-line);
  box-shadow: var(--s1-shadow-hard-lg);
  color: var(--s1-ink);
  font-family: var(--s1-font-mono);
  font-size: 15px;
  padding: 12px 18px;
}

.links {
  display: flex;
  flex-wrap: wrap;
  /* Main.dc.html:80 — gap 40px. */
  gap: 40px;
  justify-content: center;
}

/* Docs.dc.html não tem esta seção — o CTA de link sublinhado sem borda vem
   da home (Main.dc.html:80-83): ênfase mínima, igual à variante `link` de
   `<kb-button>` descrita em Tema.dc.html:83. */
.link {
  align-items: center;
  color: var(--s1-ink);
  display: inline-flex;
  font-size: 20px;
  font-weight: 700;
  /* Alvo de toque >= 44x44px. */
  min-height: 44px;
  padding: 0 4px;
  text-decoration: underline;
  text-underline-offset: 6px;
  text-decoration-thickness: 2px;
}

.link.primary {
  color: var(--s1-accent);
}

.link:hover,
.link:focus-visible {
  color: var(--s1-accent-dark);
}

.link:focus-visible {
  outline: 3px dashed var(--s1-line);
  outline-offset: 4px;
}
</style>
