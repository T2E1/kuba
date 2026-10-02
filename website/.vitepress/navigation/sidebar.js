/**
 * Forma da sidebar — a mesma nos três idiomas. Só mudam o prefixo da rota
 * (`''` no inglês, `/pt-br` e `/es` nas traduções) e o texto, que vem de
 * `labels.js`.
 *
 * O corpo é um mapeamento declarativo de rotas, herdado de `sidebars.js` do
 * Docusaurus: uma tabela de navegação, não lógica.
 *
 * Uma sidebar por item do navbar (`nav.js`): Docs, Componentes e Cookbook
 * não se misturam — a página aberta mostra só a árvore da seção dela. É o
 * formato "múltiplas sidebars" do VitePress: um objeto cujas chaves são
 * prefixos de rota. O tema escolhe a chave mais profunda que casa com a
 * página, então `build-ui/patterns/` (Cookbook) vence `build-ui/forms`
 * (Componentes) sem conflito. Uma seção que mora em mais de um diretório
 * aparece sob várias chaves apontando para a mesma árvore.
 *
 * @param {string} prefix prefixo de rota do locale, sem barra final
 * @param {object} label entrada de `labels.js` correspondente ao locale
 */
function sidebar(prefix, label) {
  const route = (path) => `${prefix}/${path}`
  // Página cujo título é traduzido: o texto vem de `labels.js`.
  const page = (path) => ({ text: label.pages[path], link: route(path) })
  // Página cujo título é o mesmo nos três idiomas — nome de elemento ou de
  // pacote. Traduzi-lo quebraria a correspondência com o que se escreve no
  // HTML ou se importa no JavaScript.
  const namedPage = (path, text) => ({ text, link: route(path) })
  const category = (key, items) => ({ text: label.categories[key], items })

  // Navbar "Docs": aprender, fundamentos, tokens e a construção de elementos.
  const docs = [
    category('learn', [
      page('learn/introduction'),
      page('learn/installation'),
      page('learn/quick-start'),
    ]),
    category('foundations', [
      page('foundations/principles'),
      page('foundations/naming'),
      page('foundations/events-and-echo'),
    ]),
    category('designTokens', [
      page('foundations/tokens/'),
      page('foundations/tokens/colors'),
      page('foundations/tokens/typography'),
      page('foundations/tokens/spacing'),
      page('foundations/tokens/border'),
      page('foundations/tokens/shadows'),
      page('foundations/tokens/opacity'),
    ]),
    category('buildElements', [
      page('build-elements/'),
      page('build-elements/lifecycle'),
      namedPage('build-elements/decorators', 'Decorators'),
      namedPage('build-elements/directive', 'directive'),
      namedPage('build-elements/dom', 'dom'),
      namedPage('build-elements/mixin', 'mixin'),
      namedPage('build-elements/echo', 'echo'),
      namedPage('build-elements/event', 'event'),
      namedPage('build-elements/spark', 'spark'),
      namedPage('build-elements/http', 'http'),
      namedPage('build-elements/router', 'router'),
      page('build-elements/tools'),
    ]),
    page('contributing'),
  ]

  // Navbar "Componentes": o catálogo de elementos, o guia de formulários e a
  // estilização — tudo o que se escreve como `<kb-*>` numa página.
  const components = [
    category('buildUi', [
      page('components/'),
      category('components', [
        namedPage('components/button', 'Button'),
        namedPage('components/card', 'Card'),
        namedPage('components/cover', 'Cover'),
        namedPage('components/icon', 'Icon'),
        namedPage('components/logo', 'Logo'),
        namedPage('components/progress', 'Progress'),
      ]),
      category('layout', [
        namedPage('components/header', 'Header'),
        namedPage('components/footer', 'Footer'),
        namedPage('components/main', 'Main'),
        namedPage('components/stack', 'Stack'),
        namedPage('components/inset', 'Inset'),
      ]),
      category('typography', [
        namedPage('components/text', 'Text'),
        namedPage('components/label', 'Label'),
        namedPage('components/helper', 'Helper'),
      ]),
      category('forms', [
        page('build-ui/forms'),
        namedPage('components/form', 'Form'),
        namedPage('components/input', 'Input'),
        namedPage('components/textarea', 'Textarea'),
        namedPage('components/validity', 'Validity'),
      ]),
      category('data', [
        namedPage('components/fetch', 'Fetch'),
        namedPage('components/dataset', 'Dataset'),
        namedPage('components/filter', 'Filter'),
        namedPage('components/find', 'Find'),
      ]),
      category('behavior', [
        namedPage('components/render', 'Render'),
        namedPage('components/on', 'On'),
        namedPage('components/redirect', 'Redirect'),
      ]),
      category('makingItYours', [page('build-ui/theming')]),
    ]),
  ]

  // Navbar "Cookbook": as receitas — telas inteiras montadas com arcos.
  const cookbook = [
    category('cookbook', [
      page('build-ui/patterns/'),
      page('build-ui/patterns/search-as-you-type'),
      page('build-ui/patterns/address-by-cep'),
    ]),
  ]

  return {
    [route('learn/')]: docs,
    [route('foundations/')]: docs,
    [route('build-elements/')]: docs,
    [route('contributing')]: docs,
    [route('components/')]: components,
    [route('build-ui/forms')]: components,
    [route('build-ui/theming')]: components,
    [route('build-ui/patterns/')]: cookbook,
  }
}

export default sidebar
