// subscribe devolve a função de cancelamento — o consumidor controla o próprio ciclo de vida
class PriceTicker {
  #observers = new Set();

  subscribe(observer) {
    this.#observers.add(observer);
    return () => this.#observers.delete(observer);
  }

  notify(price) {
    for (const observer of this.#observers) observer(price);
  }
}

const ticker = new PriceTicker();
const unsubscribe = ticker.subscribe(updateWidget);
// ao destruir o widget:
unsubscribe();
