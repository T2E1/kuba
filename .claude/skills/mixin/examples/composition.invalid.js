// ❌ Herança em cadeia para reuso — acopla tudo a tudo.
// Correto em: composition.valid.js

class LoggingBase extends HTMLElement {
  log(message) {
    console.log(message)
  }
}

class ValidationBase extends LoggingBase {
  validate(value) {
    return value != null
  }
}

class SizingBase extends ValidationBase {
  get width() {
    return this.getAttribute('width')
  }
}

class UserCard extends SizingBase {
  // Herda log, validate e width — usa apenas width.
}

// Três problemas encadeados:
//
// - rule 059 (Refused Bequest): UserCard carrega `log` e `validate` que nunca
//   usa. A herança foi recusada de fato, mas continua na cadeia.
// - rule 010: SizingBase mudou de responsabilidade três vezes para atender
//   componentes diferentes. É Divergent Change (rule 054).
// - A ordem é rígida: para um componente ter `width` sem `validate`, é
//   preciso reescrever a hierarquia inteira.
//
// O sintoma que confirma: a "base" cresce toda vez que um componente novo
// precisa de algo, e ninguém consegue removê-la de nada.
