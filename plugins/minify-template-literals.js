function minifyCSS(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,>~+])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim()
}

function minifyHTML(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*(<[^>]+>)\s*/g, '$1')
    .trim()
}

function transformTaggedTemplate(code, tag, fn) {
  return code.replace(
    new RegExp(`\\b${tag}\`([\\s\\S]*?)\``, 'g'),
    (_, content) => {
      const result = content
        .split(/(\$\{[^}]*\})/g)
        .map((part) => (part.startsWith('${') ? part : fn(part)))
        .join('')
      return `${tag}\`${result}\``
    },
  )
}

export default function minifyTemplateLiterals() {
  return {
    name: 'minify-template-literals',
    transform(code, id) {
      if (!/\.(js|ts)$/.test(id)) return null
      let result = transformTaggedTemplate(code, 'css', minifyCSS)
      result = transformTaggedTemplate(result, 'html', minifyHTML)
      return result !== code ? { code: result, map: null } : null
    },
  }
}
