// ✅ Superfície pública escolhida símbolo por símbolo.

// ─── packages/component/button/index.js ───────────────────────────────────
// O index do componente re-exporta apenas o componente.
export { default } from './button.js'

// ─── packages/component/index.js ──────────────────────────────────────────
// O index do pacote agrega os componentes, em ordem alfabética.
export { default as Button } from './button/index.js'
export { default as Card } from './card/index.js'
export { default as Icon } from './icon/index.js'

// `helpers.js` existe, mas não sai daqui: é detalhe de implementação e pode
// mudar sem quebrar ninguém. Essa é a diferença que `export *` apaga.

// ─── packages/echo/index.js ───────────────────────────────────────────────
// Import com efeito colateral registra o custom element. Comentado, porque
// o efeito não é visível na linha (rule 026).
import './echo.js' // registra <kb-echo> no CustomElementRegistry

export { default as Echo } from './echo.js'

// O que o index NÃO tem, e por quê:
//
//   const  → declarar variável é comportamento, não declaração de superfície
//   if     → decisão de runtime pertence a um módulo próprio
//   export * → tornaria pública toda adição futura, sem escolha
//
// Resultado: abrir o index responde "o que este pacote oferece" em segundos,
// e adicionar um arquivo interno nunca amplia a API por acidente.
