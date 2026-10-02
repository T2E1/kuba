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
    {
      text: label.nav.docs,
      link: `${prefix}/learn/introduction`,
      // Mesmos diretórios da sidebar "Docs" em `sidebar.js`.
      activeMatch: `^${prefix}/(learn|foundations|build-elements|contributing)`,
    },
    {
      text: label.nav.components,
      link: `${prefix}/components/`,
      // Mesmos diretórios da sidebar "Componentes" em `sidebar.js`.
      activeMatch: `^${prefix}/(components/|build-ui/(forms|theming))`,
    },
    {
      text: label.nav.cookbook,
      link: `${prefix}/build-ui/patterns/`,
      // Mesmo diretório da sidebar "Cookbook" em `sidebar.js` — sem
      // `activeMatch`, o item só ficaria ativo no índice, não em cada receita.
      activeMatch: `^${prefix}/build-ui/patterns/`,
    },
  ]
}

export default nav
