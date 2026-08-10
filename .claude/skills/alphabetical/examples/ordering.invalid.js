// ❌ Ordem arbitrária — cada arquivo com uma convenção diferente.
// Correto em: ordering.valid.js

const config = {
  timeout: 3000,
  apiUrl: 'https://api.example.com',
  debug: false,
  retries: {
    max: 3,
    delayMs: 500,
    backoff: 'exponential',
  },
  cache: true,
}

// Nenhuma ordem: nem alfabética, nem por importância, nem por tipo. Para
// achar `debug`, é preciso ler tudo — e num objeto de 30 chaves isso deixa
// de ser trivial.
//
// Efeito colateral pior: quando alguém adiciona uma chave, ela vai para o
// fim. Dois desenvolvedores adicionando chaves em paralelo produzem
// conflito de merge na mesma linha, sempre.

export { Icon } from './icon/index.js'
export { Button } from './button/index.js'
export { Card } from './card/index.js'

// Mesmo problema no index: a lista de exports é a documentação da API do
// pacote, e uma lista desordenada esconde o que existe.
