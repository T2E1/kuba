// Viola rule 014 (DIP): módulo de alto nível acopla-se por import direto ao Singleton
import { FeatureFlags } from "@service/feature-flags";

class CheckoutService {
  isExpressCheckoutEnabled() {
    return FeatureFlags.getInstance().isEnabled("express-checkout");
  }
}
