// ✅ Domain Model + Data Mapper — o domínio não sabe que existe banco.

// ─── domain/user.js ───────────────────────────────────────────────────────
// Nenhum import de infraestrutura. Testável com `new User(...)`, sem banco.

export class User {
  #credits
  #plan

  constructor({ credits, plan }) {
    this.#credits = credits
    this.#plan = plan
  }

  activateSubscription(plan) {
    if (this.#credits < plan.price) throw new InsufficientCreditsError(this)
    this.#credits -= plan.price
    this.#plan = plan.name
  }

  // O estado é exposto ao mapper por um método de intenção, não por
  // getters campo a campo (rules 008 e 009).
  snapshot() {
    return { credits: this.#credits, plan: this.#plan }
  }
}

// ─── infrastructure/userMapper.js ─────────────────────────────────────────
// Só o mapper conhece as duas formas. A dependência aponta do volátil para
// o estável (rule 019), nunca o contrário.

export class UserMapper {
  #database

  constructor(database) {
    this.#database = database
  }

  async load(id) {
    const row = await this.#database.query('SELECT * FROM users WHERE id = ?', id)
    return new User({ credits: row.credits, plan: row.plan })
  }

  async store(id, user) {
    const { credits, plan } = user.snapshot()
    await this.#database.query('UPDATE users SET credits = ?, plan = ? WHERE id = ?', credits, plan, id)
  }
}

// O ganho concreto: a regra de assinatura é testada com um objeto em
// memória, e trocar de banco toca só o mapper.
