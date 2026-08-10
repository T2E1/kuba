// ❌ Viola as regras 1, 2, 5 e 8 (rules 001, 002, 005, 008).
// Correto em: guard-clause.valid.js

class UserManager {
  processUser(userId) {
    // Regra 5: três chamadas encadeadas — o método conhece a estrutura
    // interna de database e de user.
    // Regra 8: getStatus() é um getter puro; o cliente pergunta o estado
    // para decidir, em vez de dizer ao objeto o que fazer.
    if (this.database.findUser(userId).getStatus() === 'active') {
      // Regra 1: segundo nível de indentação de bloco.
      if (this.config.getFeatureFlag('premium')) {
        this.applyPremium(userId)
      } else {
        // Regra 2: else usado como fluxo de controle.
        this.applyBasic(userId)
      }
    }
  }
}
