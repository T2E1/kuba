import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { derivedDescription } from './description.js'
import { localeOf } from './locales.js'
import { isHome } from './url.js'

// A home é a página do produto: sem título ou descrição no frontmatter, os
// do locale, escritos com as palavras-chave em `locales.js`. Derivar do
// conteúdo pegaria a legenda de um exemplo de código. `titleTemplate: false`
// porque o título da home já carrega o nome do site.
const homeData = (pageData, locale) => {
  const { title, description } = pageData.frontmatter
  return {
    title: title ?? locale.homeTitle,
    titleTemplate: false,
    description: description ?? locale.description,
  }
}

const describedData = (pageData, siteConfig, locale) => {
  const declared = pageData.frontmatter.description
  const file = join(siteConfig.srcDir, pageData.filePath)
  const source = readFileSync(file, 'utf8')
  const description = declared ?? derivedDescription(source, locale.description)
  return { description }
}

/**
 * `transformPageData`: toda página sai com `description` — a do frontmatter
 * quando existe, senão derivada do conteúdo — e a home com o título de busca.
 * Roda antes do render, então o mesmo valor serve ao `<head>` estático e ao
 * que o cliente atualiza ao navegar.
 */
export function transformPageData(pageData, { siteConfig }) {
  const locale = localeOf(pageData.relativePath)
  if (isHome(pageData.relativePath)) {
    return homeData(pageData, locale)
  }
  return describedData(pageData, siteConfig, locale)
}
