// MDX exige chaves balanceadas no texto inteiro, inclusive dentro de spans de
// código com um único backtick — um `}` e um `{` soltos no mesmo trecho de
// prosa (ex.: exemplos de template literal quebrados por linha) derrubam a
// compilação. Escapa `{`/`}` só dentro desses spans, e só fora de blocos
// ```fenced```, preservando o `style={{...}}` JSX já gerado por
// fix-inline-html.mjs (esse vive fora de qualquer backtick).
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const ROOTS = [
  join(import.meta.dirname, '..', 'docs'),
  join(import.meta.dirname, '..', 'i18n'),
]

function escapeBracesInInlineCode(content) {
  let inFence = false
  let inInlineCode = false
  let result = ''
  const lines = content.split('\n')

  for (const line of lines) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence
      result += `${line}\n`
      continue
    }
    if (inFence) {
      result += `${line}\n`
      continue
    }

    let rewritten = ''
    for (const char of line) {
      if (char === '`') {
        inInlineCode = !inInlineCode
        rewritten += char
        continue
      }
      if (inInlineCode && (char === '{' || char === '}')) {
        rewritten += `\\${char}`
        continue
      }
      rewritten += char
    }
    result += `${rewritten}\n`
  }
  return result.replace(/\n$/, '')
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await walk(path)))
      continue
    }
    if (entry.name.endsWith('.mdx')) files.push(path)
  }
  return files
}

let changed = 0
for (const root of ROOTS) {
  for (const file of await walk(root)) {
    const original = await readFile(file, 'utf8')
    const fixed = escapeBracesInInlineCode(original)
    if (fixed !== original) {
      await writeFile(file, fixed)
      changed += 1
    }
  }
}
console.log(`${changed} arquivos ajustados`)
