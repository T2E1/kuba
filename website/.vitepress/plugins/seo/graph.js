import { breadcrumb } from './breadcrumb.js'
import { author, organization, website } from './entities.js'
import { webpage } from './webpage.js'

const SCHEMA_CONTEXT = 'https://schema.org'

// `</script>` dentro de uma string fecharia a tag antes do fim do JSON.
// `<` é o mesmo `<` para o parser de JSON, e nada para o de HTML.
const OPENING_BRACKET = /</g
const ESCAPED_OPENING_BRACKET = '\\u003c'

const trailOf = (page) => (page.kind.hasBreadcrumb ? [breadcrumb(page)] : [])

/**
 * O grafo JSON-LD de uma página: quem publica, quem escreve, o site do
 * idioma, a página, os nós do tipo dela e a trilha de migalhas.
 *
 * @param {object} page contexto da página (`page-context.js`)
 */
export function graphOf(page) {
  return {
    '@context': SCHEMA_CONTEXT,
    '@graph': [
      organization(),
      author(),
      website(page.locale),
      webpage(page),
      ...page.kind.nodes(page),
      ...trailOf(page),
    ],
  }
}

/** @param {object} graph o grafo de `graphOf` */
export function serialize(graph) {
  const json = JSON.stringify(graph)
  return json.replace(OPENING_BRACKET, ESCAPED_OPENING_BRACKET)
}
