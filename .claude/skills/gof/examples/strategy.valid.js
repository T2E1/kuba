// ✅ Strategy — cada modalidade é uma classe; nenhuma edição para adicionar.

class StandardShipping {
  cost(order) {
    return order.weight * 1.5
  }
}

class ExpressShipping {
  cost(order) {
    return order.weight * 3 + 10
  }
}

class PickupShipping {
  cost(order) {
    return 0
  }
}

// A estratégia chega pronta — o calculador não escolhe, não conhece os tipos
// e não muda quando surge uma modalidade nova (rules 011 e 014).
class ShippingCalculator {
  #strategy

  constructor(strategy) {
    this.#strategy = strategy
  }

  calculate(order) {
    return this.#strategy.cost(order)
  }
}

// A escolha vive num único ponto criacional. Esta é a exceção explícita da
// rule 011: a Factory pode centralizar a ramificação, desde que seja o único
// lugar onde ela existe.
const STRATEGIES = {
  standard: StandardShipping,
  express: ExpressShipping,
  pickup: PickupShipping,
}

class ShippingFactory {
  static for(mode) {
    const Strategy = STRATEGIES[mode]
    if (!Strategy) throw new UnknownShippingError(mode)
    return new Strategy()
  }
}

// Adicionar InternationalShipping: uma classe nova e uma linha no mapa.
// Nenhum método existente é editado.
