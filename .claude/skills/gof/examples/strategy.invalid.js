// ❌ Ramificação por tipo — viola a rule 011 (OCP).
// Correto em: strategy.valid.js

class ShippingCalculator {
  calculate(order) {
    // Cada modalidade nova de frete obriga a editar este método. A classe
    // não está fechada para modificação, e a rule 011 limita a 3 as
    // ramificações por tipo — esta já tem 4.
    if (order.shipping === 'standard') {
      return order.weight * 1.5
    }
    if (order.shipping === 'express') {
      return order.weight * 3 + 10
    }
    if (order.shipping === 'pickup') {
      return 0
    }
    if (order.shipping === 'international') {
      return order.weight * 8 + order.customsFee
    }
    throw new Error('unknown shipping')
  }
}

// O sintoma que confirma: o mesmo `switch` por modalidade tende a reaparecer
// em outros lugares — no cálculo do prazo, na validação do endereço. Isso é
// Shotgun Surgery (rule 058): uma modalidade nova toca N arquivos.
