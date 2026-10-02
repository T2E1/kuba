/**
 * Plugin markdown-it que transforma um bloco ```html preview no componente
 * `<Preview>` — o exemplo montado ao vivo, com a fonte num `<details>`.
 *
 * A regra embrulha a `fence` que o VitePress já instalou (Shiki, botão de
 * copiar, rótulo de linguagem): o bloco é renderizado como um ```html comum e
 * esse HTML destacado entra no slot padrão do `<Preview>`. A fonte crua vai
 * na prop `code`, codificada com `encodeURIComponent` — aspas, chaves e `<`
 * do exemplo não podem ser lidos pelo compilador de template do Vue, que
 * processa a saída do markdown. `'` não é escapado por `encodeURIComponent`
 * e fecharia a string da expressão, por isso vira `%27` à mão.
 *
 * `md.renderer.rules.fence` é lido na chamada, não no registro: o plugin roda
 * em `markdown.config`, depois dos plugins internos do VitePress.
 */
function previewPlugin(md) {
  const fence = md.renderer.rules.fence

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const [lang, ...flags] = token.info.trim().split(/\s+/)

    if (lang !== 'html' || !flags.includes('preview')) {
      return fence(tokens, idx, options, env, self)
    }

    token.info = 'html'
    const source = fence(tokens, idx, options, env, self)
    const code = encodeURIComponent(token.content).replace(/'/g, '%27')

    return `<Preview :code="decodeURIComponent('${code}')">${source}</Preview>\n`
  }
}

export default previewPlugin
