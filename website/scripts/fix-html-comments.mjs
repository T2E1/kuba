// `<!-- ... -->` é HTML puro; MDX só entende `{/* ... */}`. Converte, só fora
// de blocos ```fenced```, permitindo o comentário se espalhar por várias
// linhas (os TODOs deste repositório costumam fazer isso).
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const ROOTS = [
  join(import.meta.dirname, '..', 'docs'),
  join(import.meta.dirname, '..', 'i18n'),
]

function convertComments(content) {
  const lines = content.split('\n')
  let inFence = false
  let inComment = false
  const out = []

  for (const line of lines) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence
      out.push(line)
      continue
    }
    if (inFence) {
      out.push(line)
      continue
    }

    let rewritten = line
    if (!inComment && rewritten.includes('<!--')) {
      rewritten = rewritten.replace('<!--', '{/*')
      inComment = true
    }
    if (inComment && rewritten.includes('-->')) {
      rewritten = rewritten.replace('-->', '*/}')
      inComment = false
    }
    out.push(rewritten)
  }
  return out.join('\n')
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
    const fixed = convertComments(original)
    if (fixed !== original) {
      await writeFile(file, fixed)
      changed += 1
    }
  }
}
console.log(`${changed} arquivos ajustados`)
