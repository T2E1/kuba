// ❌ Comentário livre — não é buscável, não ensina, não indica ação.
// Correto em: codetag.valid.js

// TODO: fix this later
// fix: validation doesn't work
function calculateDiscount(amount) {
  return amount * 0.1 // this is wrong
}

// O que falha aqui:
//
// - `TODO: fix this later` não diz o que consertar, nem quando, nem por quê.
//   Daqui a seis meses ninguém sabe se ainda é relevante.
// - `fix:` não é uma tag do catálogo. Uma varredura por FIXME não encontra.
// - `this is wrong` descreve o sentimento do autor, não o defeito.
// - Nenhuma rule citada: quem lê não sabe qual critério foi violado.
//
// São duas violações reais escondidas atrás de três comentários inúteis:
// a função aceita valores negativos, e 0.1 é constante mágica (rule 024).
