import DefaultTheme from 'vitepress/theme'
import Preview from './components/Preview.vue'
import Layout from './Layout.vue'
import './custom.css'

/**
 * `Preview` alimenta o bloco ` ```html preview ` das páginas de doc — o
 * plugin markdown-it (`.vitepress/plugins/preview.js`) injeta `<Preview>`
 * como HTML puro no meio do conteúdo compilado, sem um `import` por página.
 * Por isso o registro é global (`app.component`) em vez de por página.
 *
 * `Layout` troca o layout padrão pela versão com os dois slots do tema
 * System One (fio de migalhas, rodapé) — ver `Layout.vue`.
 */
export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('Preview', Preview)
  },
}
