// ✅ Regras 1, 2, 5 e 9 aplicadas.
//
// Regra 1: um único nível de indentação — o guard não conta.
// Regra 2: guard clause no lugar do else; o caminho feliz fica no nível zero.
// Regra 5: um ponto por instrução, sem encadeamento.
// Regra 9: o objeto decide por si (isInactive), e o colaborador recebe uma
//          ordem (applyTo) em vez de ser interrogado.

class UserActivation {
  #users
  #features

  constructor(users, features) {
    this.#users = users
    this.#features = features
  }

  activate(userId) {
    const user = this.#users.find(userId)
    if (user.isInactive()) return
    this.#features.applyTo(user)
  }
}
