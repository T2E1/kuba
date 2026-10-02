#!/usr/bin/env node
/**
 * Verifica o SEO do site já construído: description, canonical, hreflang
 * recíproco, Open Graph com imagem que existe, um JSON-LD que parseia e cujos
 * `{ "@id" }` existem em algum grafo do site, e um sitemap com o mesmo
 * conjunto de páginas e os mesmos alternates do `<head>`. Falha (exit 1) no
 * primeiro build que publicaria uma página sem isso.
 *
 * O `robots.txt` é conferido só quanto à coerência da linha `Sitemap:` com o
 * endereço do site. Enquanto o site morar em `t2e1.github.io/kuba/`, nenhum
 * crawler o lê (robots.txt só vale na raiz do host) — o sitemap é enviado à
 * mão no Search Console e no Bing Webmaster Tools. Ver `seo-sitemap.mjs`.
 *
 *   node scripts/check-seo.mjs [diretório do build — padrão: build]
 *
 * O endereço do site não é repetido aqui: é o canonical de `index.html`, que
 * `.vitepress/plugins/seo/site.js` gerou. O que se verifica é que o resto do
 * site concorda com ele.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { readHead } from './seo-head.mjs'
import { inspectPage } from './seo-page.mjs'
import { siteErrors } from './seo-site.mjs'

const NOT_FOUND_PAGE = '404.html'
const HOME_PAGE = 'index.html'
const HTML_EXTENSION = '.html'
const INDEX_FILE = /(^|\/)index\.html$/

const buildDirectory = resolve(process.argv[2] ?? 'build')

const htmlPages = (directory) => {
  const files = readdirSync(directory, { recursive: true })
  const pages = files.filter((file) => file.endsWith(HTML_EXTENSION))
  return pages.filter((file) => file !== NOT_FOUND_PAGE)
}

const siteUrlOf = (directory) => {
  const html = readFileSync(join(directory, HOME_PAGE), 'utf8')
  const [canonical] = readHead(html).canonicals
  return canonical
}

function inspectAll(directory, siteUrl) {
  return htmlPages(directory).map((file) => {
    const html = readFileSync(join(directory, file), 'utf8')
    const url = new URL(file.replace(INDEX_FILE, '$1'), siteUrl).href
    return { file, ...inspectPage(html, url) }
  })
}

const abort = (message) => {
  console.error(`✖ ${message}`)
  process.exit(1)
}

function report(problems, pageCount) {
  problems.forEach((problem) => console.error(`✖ ${problem}`))
  if (problems.length) {
    abort(`${problems.length} SEO problem(s) in ${pageCount} page(s).`)
  }
  console.log(`✓ SEO metadata is coherent across ${pageCount} page(s).`)
}

function main() {
  if (!existsSync(join(buildDirectory, HOME_PAGE))) {
    abort(`${buildDirectory}/${HOME_PAGE} not found — build the site first.`)
  }
  const siteUrl = siteUrlOf(buildDirectory)
  if (!siteUrl) {
    abort(`${HOME_PAGE} has no canonical — the site address is unknown.`)
  }
  const pages = inspectAll(buildDirectory, siteUrl)
  const pageProblems = pages.flatMap((page) =>
    page.errors.map((error) => `${page.file}: ${error}`),
  )
  const problems = [
    ...pageProblems,
    ...siteErrors(pages, siteUrl, buildDirectory),
  ]
  report(problems, pages.length)
}

main()
