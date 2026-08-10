// ✅ Os sete grupos na ordem, alfabética dentro de cada um.

class UserService {
  // 1 — campos privados, alfabética
  #name = ''
  #repository

  // 2 — getters e setters, alfabética; par de mesmo nome junto, getter antes
  get name() {
    return this.#name
  }

  set name(value) {
    this.#name = value
  }

  // 3 — getters e setters estáticos (nenhum aqui)

  // 4 — constructor
  constructor(repository) {
    this.#repository = repository
  }

  // 5 — métodos, alfabética
  findById(id) {
    return this.#repository.find(id)
  }

  reset() {
    this.#name = ''
  }

  // 6 — métodos estáticos, alfabética
  static create() {
    return new UserService(new UserRepository())
  }

  // 7 — bloco static (nenhum aqui)
}

// O ganho não é estético: abrir qualquer classe do repositório e saber que
// o estado está no topo, o ciclo de vida no meio e a criação no fim elimina
// a leitura exploratória.
//
// `reset` deixou de ser `_reset`: privacidade é `#`, que o JavaScript
// garante, não convenção de nome que qualquer código externo ignora.
