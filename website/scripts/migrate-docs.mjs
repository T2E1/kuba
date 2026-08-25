// Migração mecânica de docs/**/*.md (Docsify) para website/{docs,i18n}/**/*.mdx
// (Docusaurus). Renomeia extensão, pula _sidebar.md/_navbar.md/README de
// idioma raiz duplicado, e adiciona `slug` de frontmatter aos README.md que
// viram índice de pasta — o resto do conteúdo é preservado ao pé da letra.
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'

const REPO_ROOT = join(import.meta.dirname, '..', '..')
const SOURCE = join(REPO_ROOT, 'docs')
const TARGETS = {
  '': join(REPO_ROOT, 'website', 'docs'),
  'pt-br': join(
    REPO_ROOT,
    'website',
    'i18n',
    'pt-br',
    'docusaurus-plugin-content-docs',
    'current',
  ),
  es: join(
    REPO_ROOT,
    'website',
    'i18n',
    'es',
    'docusaurus-plugin-content-docs',
    'current',
  ),
}
const SKIP = new Set(['_sidebar.md', '_navbar.md'])

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (
        entry.name === 'es' ||
        entry.name === 'pt-br' ||
        entry.name === 'assets'
      )
        continue
      files.push(...(await walk(path)))
      continue
    }
    if (entry.name.endsWith('.md') && !SKIP.has(entry.name)) {
      files.push(path)
    }
  }
  return files
}

function slugFor(relativePath) {
  if (relativePath === 'README.md') return '/'
  if (relativePath.endsWith('/README.md')) {
    return `/${relativePath.slice(0, -'/README.md'.length)}/`
  }
  return null
}

async function migrate(locale, sourceDir, targetDir) {
  const files = await walk(sourceDir)
  for (const file of files) {
    const relativePath = relative(sourceDir, file)
    const targetPath = join(targetDir, relativePath.replace(/\.md$/, '.mdx'))
    const content = await readFile(file, 'utf8')
    const slug = slugFor(relativePath)
    const withFrontmatter = slug
      ? `---\nslug: ${slug}\n---\n\n${content}`
      : content

    await mkdir(dirname(targetPath), { recursive: true })
    await writeFile(targetPath, withFrontmatter)
  }
  console.log(`${locale || 'en'}: ${files.length} arquivos migrados`)
}

for (const [locale, target] of Object.entries(TARGETS)) {
  const sourceDir = locale ? join(SOURCE, locale) : SOURCE
  await migrate(locale, sourceDir, target)
}
