// Viola rule 070: observer nunca cancela a inscrição, referência fica presa para sempre
class PriceTicker {
  #observers = new Set();

  subscribe(observer) {
    this.#observers.add(observer);
  }

  notify(price) {
    for (const observer of this.#observers) observer(price);
  }
}

const ticker = new PriceTicker();
function onPriceChange(price) {
  updateWidget(price);
}
ticker.subscribe(onPriceChange);
// widget é destruído, mas onPriceChange continua no Set para sempre
