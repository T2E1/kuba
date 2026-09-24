/**
 * Itens do navbar. O seletor de idioma e o link do GitHub não entram aqui: o
 * tema padrão do VitePress os deriva de `locales` e de `themeConfig.socialLinks`.
 *
 * @param {string} prefix prefixo de rota do locale, sem barra final
 * @param {object} label entrada de `labels.js` correspondente ao locale
 */
function nav(prefix, label) {
  return [
    { text: label.nav.manifesto, link: `${prefix}/manifesto` },
    { text: label.nav.about, link: `${prefix}/about` },
    { text: label.nav.docs, link: `${prefix}/learn/introduction` },
    { text: label.nav.components, link: `${prefix}/components/` },
  ]
}

export default nav
