/**
 * Plugin markdown-it que transforma um bloco ```html preview no componente
 * `<Preview>` — o exemplo montado ao vivo, com a fonte num `<details>`.
 *
 * @TODO(developer): ainda é um no-op. A versão remark que rodava no Docusaurus
 * está em `git show HEAD:website/src/remark/preview-plugin.js`; remark e
 * markdown-it não são compatíveis, então a regra precisa ser reescrita sobre
 * `md.renderer.rules.fence`. Enquanto não for, o bloco cai no realce de
 * sintaxe padrão: a página continua correta, sem o exemplo ao vivo.
 */
function previewPlugin() {}

export default previewPlugin
