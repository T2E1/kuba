// Docsify exigia prefixo de idioma em todo link (/pt-br/foo, /es/foo) porque o
// próprio Docsify não tinha roteamento de i18n nativo. O Docusaurus já
// prefixa a rota pelo locale ativo, então o mesmo link dentro do conteúdo
// pt-br/es vira duplicado (/pt-br/pt-br/foo). Remove o prefixo redundante,
// só nos arquivos do próprio locale.
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const LOCALES = {
  'pt-br': join(
    import.meta.dirname,
    '..',
    'i18n',
    'pt-br',
    'docusaurus-plugin-content-docs',
    'current',
  ),
  es: join(
    import.meta.dirname,
    '..',
    'i18n',
    'es',
    'docusaurus-plugin-content-docs',
    'current',
  ),
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
for (const [locale, dir] of Object.entries(LOCALES)) {
  const pattern = new RegExp(`\\]\\(/${locale}/`, 'g')
  for (const file of await walk(dir)) {
    const original = await readFile(file, 'utf8')
    const fixed = original.replace(pattern, '](/')
    if (fixed !== original) {
      await writeFile(file, fixed)
      changed += 1
    }
  }
}
console.log(`${changed} arquivos ajustados`)
