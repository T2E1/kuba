// ❌ Active Record num domínio rico — o negócio herda a persistência.
// Correto em: data-mapper.valid.js

class User extends ActiveRecord {
  static table = 'users'

  // Regra de negócio e SQL na mesma classe: duas razões para mudar
  // (rules 010 e 054). Um índice novo no banco e uma regra nova de
  // assinatura tocam o mesmo arquivo.
  activateSubscription(plan) {
    if (this.credits < plan.price) throw new InsufficientCreditsError(this)
    this.credits -= plan.price
    this.plan = plan.name
    this.save() // ← escreve no banco de dentro da entidade
  }

  static findActive() {
    return this.where('status = ?', 'active')
  }
}

// Consequências:
//
// - Testar `activateSubscription` exige banco: a entidade não existe sem ele
//   (Testability = 1 no modelo McCall).
// - `User` depende de infraestrutura concreta — viola DIP (rule 014).
// - Trocar de banco toca a camada de domínio inteira.
//
// Para um CRUD simples esse trade-off é consciente e aceitável. Aqui não é:
// há regra de negócio de verdade na entidade.
