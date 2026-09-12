// ✅ Repository com linguagem de domínio — não é um repasse ao ORM.

export class SubscriberRepository {
  #database

  constructor(database) {
    this.#database = database
  }

  // O nome expressa intenção de domínio, não a forma da query (rule 034).
  // Quem chama não sabe — nem precisa saber — que existe um WHERE por trás.
  async findActiveSubscribers() {
    const rows = await this.#database.query(
      "SELECT * FROM subscribers WHERE status = 'active' AND expires_at > now()",
    )
    return rows.map(row => new Subscriber(row))
  }

  async save(subscriber) {
    const { id, ...fields } = subscriber.snapshot()
    await this.#database.upsert('subscribers', id, fields)
  }
}

// O ganho concreto: o critério "quem é um assinante ativo" mora em um só
// lugar. Se a regra mudar (ex: incluir período de graça), muda aqui, e só.
