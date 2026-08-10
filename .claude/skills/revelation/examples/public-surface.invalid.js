// ❌ `export *` com lógica no index.
// Correto em: public-surface.valid.js

// packages/component/index.js

// `export *` transforma toda adição interna em adição à API pública, sem
// que ninguém decida. Um helper novo exportado dentro de qualquer um desses
// arquivos vira contrato — e removê-lo depois é breaking change.
export * from './button/button.js'
export * from './card/card.js'
export * from './internal/helpers.js' // vaza detalhe de implementação

// Lógica no index: o arquivo deixou de ser declaração de superfície e
// virou módulo com comportamento (rule 010).
const isProduction = process.env.NODE_ENV === 'production'

export const config = isProduction ? productionConfig : developmentConfig

// Dois efeitos práticos:
//
// - Quem importa @component recebe helpers internos junto (rule 017, CRP):
//   passa a depender de classes que não usa.
// - Não dá para saber a superfície do pacote sem abrir todos os arquivos
//   referenciados — o index deixou de responder "o que este pacote oferece".
