// ❌ Repository como Middle Man — repassa cada chamada ao ORM sem agregar nada.
// Correto em: repository.valid.js

class SubscriberRepository {
  #orm

  constructor(orm) {
    this.#orm = orm
  }

  // Cada método é uma linha só, delegando direto para o ORM (rule 061,
  // Middle Man). Nenhum deles expressa um conceito de domínio — só
  // reembalam a API que já existia.
  findAll() { return this.#orm.find('subscribers') }
  findById(id) { return this.#orm.findOne('subscribers', id) }
  findWhere(criteria) { return this.#orm.find('subscribers', criteria) }
  save(entity) { return this.#orm.upsert('subscribers', entity) }
  delete(id) { return this.#orm.delete('subscribers', id) }
}

// O cliente que precisa de "assinantes ativos" acaba escrevendo o critério
// na mão, toda vez que precisa dele:
async function billActiveSubscribers(repo) {
  const active = await repo.findWhere({ status: 'active' })
  return active.map(subscriber => charge(subscriber))
}

// Consequências:
//
// - Nenhuma regra de domínio ganhou um lugar único para morar — o
//   critério "ativo" está espalhado por todo cliente que o repete
//   (rule 021, DRY).
// - Adicionar um Repository aqui só trocou `orm.find(...)` por
//   `repo.find(...)` — zero valor, uma camada a mais para manter
//   (rule 064, overengineering).
// - Se o Repository nunca ganha vocabulário de domínio, ele deve sair:
//   o cliente pode falar direto com o ORM.
