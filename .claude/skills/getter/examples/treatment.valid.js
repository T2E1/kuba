// ✅ Cada getter trata a leitura, e a decisão ficou dentro do objeto.

class User {
  #controller
  #email
  #name

  // Valor padrão: `??=` resolve o caso nulo na primeira leitura, sem `if`
  // e sem duplicar o default em cada ponto de uso.
  get displayName() {
    return (this.#name ??= 'anônimo')
  }

  // Derivação: o valor não é armazenado, é calculado a partir de um campo.
  // O nome anuncia a transformação, então não engana (rule 035).
  get initials() {
    return this.#name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
  }

  // Inicialização preguiçosa: o recurso caro só nasce quando alguém precisa.
  // É a exceção legítima ao "getter sem efeito colateral" — cache, não
  // regra de negócio.
  get controller() {
    return (this.#controller ??= new AbortController())
  }

  // Predicado derivado de um campo. Permite que o cliente diga em vez de
  // perguntar (rule 009).
  get isCorporate() {
    return this.#email.endsWith('@empresa.com')
  }
}

// Do lado do cliente, a diferença:
//
//   ❌  if (user.role === 'admin' && user.email.includes('@empresa.com'))
//   ✅  if (user.isCorporate)
//
// A decisão mora com os dados. Muda uma vez, vale em todo lugar.
//
// O que NÃO virou getter: "pode acessar o painel?" combina papel e e-mail —
// dois campos. Getter é um campo só (rule 010); isso é método.
