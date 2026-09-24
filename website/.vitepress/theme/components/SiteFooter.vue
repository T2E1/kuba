<script setup>
import { useData, withBase } from 'vitepress'

/**
 * Substitui o `VPFooter` nativo em toda página (home e doc). O nativo se
 * esconde sozinho quando a página tem sidebar (ver a nota em
 * `custom.css`, seção 15) e, mesmo visível, só aceita duas strings de HTML
 * (`footer.message` / `footer.copyright`) — não comporta o logo, o comando
 * de instalação numa janela e a navegação que Main.dc.html:344-358 e
 * Docs.dc.html:214-218 mostram. Instalado via slot `layout-bottom` em
 * `theme/Layout.vue`, portanto sempre no fim da página, fora do fluxo do
 * `VPFooter` escondido.
 */
const { site, theme } = useData()
</script>

<template>
  <footer class="s1-footer">
    <div class="s1-footer-inner">
      <a class="s1-footer-logo" :href="withBase('/')" :aria-label="site.title">
        <svg width="62" height="96" viewBox="0 0 60 93" aria-hidden="true">
          <path
            d="M18.25 92.25H0V29.75C0 22.75 1.29 17.04 3.88 12.63C6.42 8.25 9.94 5.04 14.44 3C18.94 1 24.08 0 29.88 0C35.71 0 40.9 1 45.44 3C49.98 5.04 53.52 8.25 56.06 12.63C58.56 17.04 59.81 22.75 59.81 29.75V92.25H41.56V29.75C41.56 25.79 41.13 22.75 40.25 20.63C39.33 18.5 38.02 17.04 36.31 16.25C34.56 15.5 32.42 15.13 29.88 15.13C27.29 15.13 25.17 15.5 23.5 16.25C21.79 17.04 20.5 18.5 19.63 20.63C18.71 22.75 18.25 25.79 18.25 29.75V92.25Z"
            fill="currentColor"
          />
        </svg>
        <span>kuba</span>
      </a>
      <p class="s1-footer-install"><code>npm install @t2e1/kuba</code></p>
      <nav class="s1-footer-nav" aria-label="Footer">
        <a v-for="item in theme.nav" :key="item.link" :href="withBase(item.link)">{{ item.text }}</a>
        <a
          v-for="link in theme.socialLinks"
          :key="link.link"
          :href="link.link"
          target="_blank"
          rel="noopener"
        >
          {{ link.icon === 'github' ? 'GitHub' : link.icon }}
        </a>
      </nav>
      <p v-if="theme.footer?.copyright" class="s1-footer-copyright" v-html="theme.footer.copyright" />
    </div>
  </footer>
</template>

<style scoped>
/**
 * Sempre escuro, nos dois modos — Docs.dc.html:214 fixa
 * `background:#111111;color:#F4F1EA` em vez de usar `var(--bg)`/`var(--ink)`,
 * que trocariam de lado no modo escuro. Mesmo padrão de sombreamento local
 * das variáveis usado em `Playground.vue` para a mesma razão.
 */
/* Main.dc.html:344-358 (a versão da doc, Docs.dc.html:214-218, é a mesma
   janela mais compacta — 120px de altura fixa contra os 440px da landing;
   usamos o layout da landing, mais completo, nos dois lugares, já que o
   `SiteFooter.vue` é compartilhado). */
.s1-footer {
  /* Acima da sidebar fixa das docs (z 25 no desktop), abaixo do cabeçalho
     (z 30): no fim da página o rodapé ocupa a largura inteira, como na
     landing, em vez de a sidebar branca cobrir a parte esquerda dele. */
  position: relative;
  z-index: 26;
  --s1-ink: #111111;
  --s1-bg: #f4f1ea;
  --s1-muted: #b8b3a8;
  background: var(--s1-ink);
  color: var(--s1-bg);
  /* Linha clara nos dois modos — a mesma cor do texto do rodapé (papel),
     delimitando o bloco escuro também no modo escuro, onde ele encostaria
     no fundo da página sem nenhum limite visível. */
  border-top: 2px solid var(--s1-bg);
  padding: 80px 24px 40px;
}

.s1-footer-inner {
  max-width: 1040px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 36px;
  text-align: center;
}

.s1-footer-logo {
  display: flex;
  align-items: center;
  gap: 22px;
  color: var(--s1-bg);
  text-decoration: none;
}

.s1-footer-logo span {
  /* Main.dc.html:348 — 120px literal, com piso responsivo para telas
     estreitas (a referência não demonstra esse caso). */
  font-size: clamp(3.5rem, 12vw, 120px);
  line-height: 0.8;
  font-weight: 700;
  font-stretch: 88%;
  letter-spacing: -0.06em;
}

.s1-footer-install {
  margin: 0;
}

/* Main.dc.html:350 — janela de instalação com sombra rosa. */
.s1-footer-install code {
  font-family: var(--s1-font-mono);
  font-size: 15px;
  border: 2px solid var(--s1-bg);
  box-shadow: 6px 6px 0 var(--s1-blush, #f28aa0);
  background: none;
  color: var(--s1-bg);
  padding: 12px 18px;
}

.s1-footer-nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 36px;
  font-size: 16px;
  font-weight: 600;
}

.s1-footer-nav a {
  color: var(--s1-bg);
  text-underline-offset: 4px;
}

.s1-footer-copyright {
  margin: 0;
  font-family: var(--s1-font-chrome);
  font-size: 10px;
  color: var(--s1-muted);
}
</style>
