import { breadcrumbId } from './identifiers.js'
import { SITE_NAME } from './site.js'
import { absoluteUrl, linkUrl } from './url.js'

// Um grupo da sidebar ("Learn", "Build UI") não tem link próprio, e o
// BreadcrumbList exige URL em todo degrau menos o último. O grupo vira degrau
// só quando abre numa página-índice (`components/`, `build-elements/`) — uma
// página que fala do grupo inteiro. "Learn", que abre em "Introduction",
// ficaria apontando para uma página que não é ele, e é omitido.
const DIRECTORY_LINK = /\/$/

const firstLink = (item) => item.link ?? firstLink(item.items[0])

const hasLandingPage = (item) => DIRECTORY_LINK.test(firstLink(item))

const ancestorCrumb = (item) => ({
  name: item.text,
  url: linkUrl(firstLink(item)),
})

const ancestorsOf = (trail) => {
  const groups = trail.slice(0, -1)
  const landed = groups.filter(hasLandingPage)
  return landed.map(ancestorCrumb)
}

/**
 * Home → grupos da sidebar → página. A trilha é a mesma que o
 * `Breadcrumb.vue` desenha acima do `<h1>`: os dois leem a árvore da sidebar
 * do locale com `trailTo` (`theme/components/trail.js`). Página fora da
 * sidebar (manifesto, sobre) fica com home → página.
 *
 * @param {object} page contexto da página
 */
function crumbsOf(page) {
  const home = { name: SITE_NAME, url: absoluteUrl(page.locale.prefix) }
  const ancestors = ancestorsOf(page.trail)
  const label = page.trail.at(-1)?.text ?? page.title
  const crumbs = [home, ...ancestors, { name: label, url: page.url }]
  // Grupo cuja primeira página é a própria página seguinte repetiria o degrau.
  return crumbs.filter((crumb, index) => crumb.url !== crumbs[index + 1]?.url)
}

/** @param {object} page contexto da página */
export function breadcrumb(page) {
  const crumbs = crumbsOf(page)
  return {
    '@type': 'BreadcrumbList',
    '@id': breadcrumbId(page.url),
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  }
}
