import { software } from './entities.js'
import { faqQuestions } from './faq.js'
import { AUTHOR_ID, reference, SOFTWARE_ID } from './identifiers.js'
import { isHome } from './url.js'
import { article } from './webpage.js'

/**
 * O que cada tipo de página declara: o `@type` da página, o `og:type`, se tem
 * trilha de migalhas, as propriedades próprias do nó da página e os nós extras
 * que ela traz ao grafo. Tipo novo é uma entrada nova, não um `if` novo.
 */
const noProperties = () => ({})
const noNodes = () => []

const HOME = Object.freeze({
  pageType: 'FAQPage',
  ogType: 'website',
  hasBreadcrumb: false,
  pageProperties: (page) => ({
    about: reference(SOFTWARE_ID),
    mainEntity: faqQuestions(page),
  }),
  nodes: (page) => [software(page)],
})

const ABOUT = Object.freeze({
  pageType: 'AboutPage',
  ogType: 'website',
  hasBreadcrumb: true,
  pageProperties: () => ({
    about: reference(SOFTWARE_ID),
    mainEntity: reference(AUTHOR_ID),
  }),
  nodes: (page) => [software(page)],
})

const TECHNICAL = Object.freeze({
  pageType: 'WebPage',
  ogType: 'article',
  hasBreadcrumb: true,
  pageProperties: noProperties,
  nodes: (page) => [article(page, 'TechArticle')],
})

const ESSAY = Object.freeze({
  pageType: 'WebPage',
  ogType: 'article',
  hasBreadcrumb: true,
  pageProperties: noProperties,
  nodes: (page) => [article(page, 'Article')],
})

const PLAIN = Object.freeze({
  pageType: 'WebPage',
  ogType: 'website',
  hasBreadcrumb: true,
  pageProperties: noProperties,
  nodes: noNodes,
})

const ESSAYS = ['manifesto.md', 'contributing.md']
const TECHNICAL_SECTIONS = [
  'learn/',
  'foundations/',
  'components/',
  'build-ui/',
  'build-elements/',
]

const KINDS = [
  { matches: isHome, kind: HOME },
  { matches: (path) => path === 'about.md', kind: ABOUT },
  { matches: (path) => ESSAYS.includes(path), kind: ESSAY },
  {
    matches: (path) =>
      TECHNICAL_SECTIONS.some((section) => path.startsWith(section)),
    kind: TECHNICAL,
  },
]

/**
 * @param {string} sharedPath caminho da página sem o prefixo do locale,
 *   ex. `components/button.md`
 */
export function kindOf(sharedPath) {
  const entry = KINDS.find((candidate) => candidate.matches(sharedPath))
  return entry?.kind ?? PLAIN
}
