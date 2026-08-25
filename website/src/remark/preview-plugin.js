import { visit } from 'unist-util-visit'

// Porta o antigo previewRenderer do Docsify para o pipeline MDX:
// um bloco ```html preview vira o componente <Preview>, que monta o HTML ao
// vivo e guarda a fonte num <details> colapsado — mesmo padrão shadcn.
function previewPlugin() {
  return (tree) => {
    visit(tree, 'code', (node, index, parent) => {
      if (!parent || typeof index !== 'number') {
        return
      }
      if (node.lang !== 'html' || node.meta !== 'preview') {
        return
      }

      parent.children[index] = {
        type: 'mdxJsxFlowElement',
        name: 'Preview',
        attributes: [
          { type: 'mdxJsxAttribute', name: 'code', value: node.value },
        ],
        children: [],
      }
    })
  }
}

export default previewPlugin
