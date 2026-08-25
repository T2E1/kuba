// MDX parseia HTML solto como JSX: `class="x"` e `style="css: value"` — que o
// Markdown do Docsify aceitava ao pé da letra — quebram a compilação. Reescreve
// os dois para a forma JSX, só fora de blocos de código (```), em todo
// website/docs e website/i18n.
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const ROOTS = [
  join(import.meta.dirname, '..', 'docs'),
  join(import.meta.dirname, '..', 'i18n'),
]

function cssToJsxObject(css) {
  const props = css
    .split(';')
    .map((declaration) => declaration.trim())
    .filter(Boolean)
    .map((declaration) => {
      const [prop, ...rest] = declaration.split(':')
      const value = rest.join(':').trim()
      const camel = prop
        .trim()
        .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
      return `${camel}: '${value.replace(/'/g, "\\'")}'`
    })
  return `{{${props.join(', ')}}}`
}

function fixLine(line) {
  return line
    .replace(/\bclass="/g, 'className="')
    .replace(/\bstyle="([^"]*)"/g, (_, css) => `style=${cssToJsxObject(css)}`)
}

function fixContent(content) {
  let inFence = false
  return content
    .split('\n')
    .map((line) => {
      if (/^\s*```/.test(line)) {
        inFence = !inFence
        return line
      }
      return inFence ? line : fixLine(line)
    })
    .join('\n')
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
    const fixed = fixContent(original)
    if (fixed !== original) {
      await writeFile(file, fixed)
      changed += 1
    }
  }
}
console.log(`${changed} arquivos ajustados`)
