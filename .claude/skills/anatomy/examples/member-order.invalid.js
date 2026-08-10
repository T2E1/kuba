// ❌ Ordem arbitrária — cada classe do repositório fica diferente.
// Correto em: member-order.valid.js

class UserService {
  constructor(repository) {
    this.repository = repository
  }

  get name() {
    return this.#name
  }

  // Campo privado declarado depois de ser usado pelo getter acima.
  #name = ''

  findById(id) {
    return this.repository.find(id)
  }

  // Privacidade por convenção de underscore: não é privacidade nenhuma.
  _reset() {
    this.#name = ''
  }

  static create() {
    return new UserService(new UserRepository())
  }

  set name(value) {
    this.#name = value
  }
}

// O que falha:
//
// - Ordem dos grupos embaralhada: constructor primeiro, campo privado no
//   meio, setter no fim.
// - Getter e setter de `name` separados por quatro membros — o par que
//   deveria ser lido junto está espalhado.
// - `_reset` usa underscore em vez de `#`, que o JavaScript garante de fato.
// - Sem alfabética: encontrar um membro exige ler o arquivo todo.
//
// Multiplicado por 30 classes, o custo é procurar em cada arquivo em vez
// de saber onde olhar.
