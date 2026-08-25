// Porta a estrutura de docs/_sidebar.md (Docsify) para o formato do
// Docusaurus. Os itens usam o caminho do doc relativo a `docs/` sem
// extensão — mesmo valor que o link do Docsify, menos a barra inicial.
/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Learn',
      items: ['learn/introduction', 'learn/installation', 'learn/quick-start'],
    },
    {
      type: 'category',
      label: 'Foundations',
      items: [
        'foundations/principles',
        'foundations/naming',
        'foundations/events-and-echo',
      ],
    },
    {
      type: 'category',
      label: 'Design tokens',
      items: [
        'foundations/tokens/README',
        'foundations/tokens/colors',
        'foundations/tokens/typography',
        'foundations/tokens/spacing',
        'foundations/tokens/border',
        'foundations/tokens/shadows',
        'foundations/tokens/opacity',
      ],
    },
    {
      type: 'category',
      label: 'Build UI',
      items: [
        'components/README',
        {
          type: 'category',
          label: 'Components',
          items: [
            'components/button',
            'components/card',
            'components/cover',
            'components/icon',
            'components/logo',
            'components/progress',
          ],
        },
        {
          type: 'category',
          label: 'Layout',
          items: [
            'components/header',
            'components/footer',
            'components/main',
            'components/stack',
            'components/inset',
          ],
        },
        {
          type: 'category',
          label: 'Typography',
          items: ['components/text', 'components/label', 'components/helper'],
        },
        {
          type: 'category',
          label: 'Forms',
          items: [
            'build-ui/forms',
            'components/form',
            'components/input',
            'components/textarea',
            'components/fileupload',
            'components/validity',
          ],
        },
        {
          type: 'category',
          label: 'Data',
          items: [
            'components/fetch',
            'components/dataset',
            'components/filter',
            'components/find',
          ],
        },
        {
          type: 'category',
          label: 'Behavior',
          items: ['components/render', 'components/on', 'components/redirect'],
        },
        {
          type: 'category',
          label: 'Making it yours',
          items: [
            'build-ui/theming',
            'build-ui/patterns/README',
            'build-ui/patterns/search-as-you-type',
            'build-ui/patterns/user-crud',
            'build-ui/patterns/declarative-navigation',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Build Elements',
      items: [
        'build-elements/README',
        'build-elements/lifecycle',
        'build-elements/decorators',
        'build-elements/directive',
        'build-elements/dom',
        'build-elements/mixin',
        'build-elements/echo',
        'build-elements/event',
        'build-elements/spark',
        'build-elements/http',
        'build-elements/router',
        'build-elements/tools',
      ],
    },
    'contributing',
  ],
}

export default sidebars
