// A instância única é injetada, não importada — CheckoutService depende da abstração
class CheckoutService {
  #featureFlags;

  constructor(featureFlags) {
    this.#featureFlags = featureFlags;
  }

  isExpressCheckoutEnabled() {
    return this.#featureFlags.isEnabled("express-checkout");
  }
}

// Root composer é o único lugar que conhece a instância concreta
const checkout = new CheckoutService(FeatureFlags.getInstance());
