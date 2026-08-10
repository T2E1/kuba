// ✅ Alfabética, recursiva, com a exceção explícita onde há significado.

const config = {
  apiUrl: 'https://api.example.com',
  cache: true,
  debug: false,
  // Objeto aninhado também ordenado — a regra é recursiva.
  retries: {
    backoff: 'exponential',
    delayMs: 500,
    max: 3,
  },
  timeout: 3000,
}

// Exports do index em ordem: a lista é a documentação da API do pacote.
export { Button } from './button/index.js'
export { Card } from './card/index.js'
export { Icon } from './icon/index.js'

// ─── A exceção ────────────────────────────────────────────────────────────
// Aqui a ordem carrega significado: trocar duas propriedades muda o
// comportamento. Esse é o teste objetivo para invocar a exceção.

const margin = {
  top: 8,
  right: 16,
  bottom: 8,
  left: 16,
}

const point = { x: 0, y: 0, z: 0 }

// O que NÃO é exceção: "fica melhor assim", "as importantes primeiro",
// "agrupei as relacionadas". Se o agrupamento é mesmo essencial, ele vira
// um objeto aninhado com nome próprio — e aí a alfabética volta a valer
// dentro dele, com o agrupamento explícito em vez de implícito na ordem.
//
// Ganho prático: chave nova entra na posição alfabética, não no fim. Dois
// desenvolvedores adicionando chaves diferentes não conflitam na mesma linha.
