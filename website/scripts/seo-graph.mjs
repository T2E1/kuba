/**
 * Leitura do grafo JSON-LD: os nós que ele define e os `{ "@id" }` que ele
 * cita. Uma citação pode apontar para nó de outra página (a biblioteca, uma
 * tradução), então a resolução é feita contra o site inteiro.
 */
const FORBIDDEN_TYPES = ['HowTo', 'SearchAction']

const isObject = (value) => typeof value === 'object' && value !== null

const isReference = (value) => {
  const keys = Object.keys(value)
  return keys.length === 1 && keys[0] === '@id'
}

/** @param {unknown} value qualquer trecho do grafo */
export function referencesIn(value) {
  if (Array.isArray(value)) {
    return value.flatMap(referencesIn)
  }
  if (!isObject(value)) {
    return []
  }
  if (isReference(value)) {
    return [value['@id']]
  }
  return Object.values(value).flatMap(referencesIn)
}

/** @param {unknown} value qualquer trecho do grafo */
export function typesIn(value) {
  if (Array.isArray(value)) {
    return value.flatMap(typesIn)
  }
  if (!isObject(value)) {
    return []
  }
  const own = [value['@type'] ?? []].flat()
  return [...own, ...Object.values(value).flatMap(typesIn)]
}

/**
 * @param {string} source conteúdo do `<script type="application/ld+json">`
 * @returns {{ nodes: object[], errors: string[] }}
 */
export function readGraph(source) {
  try {
    const document = JSON.parse(source)
    const nodes = Array.isArray(document['@graph']) ? document['@graph'] : []
    return { nodes, errors: graphErrors(nodes) }
  } catch (error) {
    return { nodes: [], errors: [`JSON-LD does not parse: ${error.message}`] }
  }
}

const hasType = (node, type) => [node['@type']].flat().includes(type)

const isAnswered = (question) =>
  Boolean(question?.name && question.acceptedAnswer?.text)

// FAQPage sem perguntas é uma promessa vazia ao buscador — o sinal de que a
// extração de `plugins/seo/faq.js` deixou de casar com a fonte da home.
function faqErrors(nodes) {
  const faqs = nodes.filter((node) => hasType(node, 'FAQPage'))
  return faqs.flatMap((faq) => {
    const questions = [faq.mainEntity ?? []].flat()
    const unanswered = questions.filter((question) => !isAnswered(question))
    return [
      ...(questions.length ? [] : ['FAQPage has no questions in mainEntity']),
      ...unanswered.map(() => 'FAQPage question without name or answer text'),
    ]
  })
}

function graphErrors(nodes) {
  const anonymous = nodes.filter((node) => !node['@id'] || !node['@type'])
  const forbidden = typesIn(nodes).filter((type) =>
    FORBIDDEN_TYPES.includes(type),
  )
  return [
    ...(nodes.length ? [] : ['JSON-LD has no @graph nodes']),
    ...anonymous.map(() => 'JSON-LD node without @id or @type'),
    ...forbidden.map((type) => `JSON-LD declares forbidden type ${type}`),
    ...faqErrors(nodes),
  ]
}
