// ❌ CC = 7 — excede o limite de 5 da rule 022.
// Correto em: reduce-cc.valid.js

function processOrder(order) {
  //                                        base ............... 1
  if (order.status === 'pending') {       // +1 ................. 2
    if (order.items.length > 0) {         // +1 ................. 3
      if (order.payment === 'card') {     // +1 ................. 4
        if (order.amount > 1000) {        // +1 ................. 5
          return applyDiscount(order)
        } else {                          // +1 ................. 6
          return processPayment(order)
        }
      } else if (order.payment === 'pix') { // +1 ............... 7
        return processPix(order)
      }
    }
  }
  return 'invalid'
}

// Além da CC, o trecho acumula três violações que andam juntas:
//
// - rule 001: quatro níveis de indentação de bloco.
// - rule 002: else e else if como fluxo de controle.
// - rule 066: Pyramid of Doom — o caminho feliz (applyDiscount) está no
//   nível mais profundo, e o retorno de erro fica no fim, longe da condição
//   que o causou.
//
// Consequência prática: sete caminhos para cobrir em teste, e adicionar um
// meio de pagamento novo exige reindentar o bloco inteiro.
