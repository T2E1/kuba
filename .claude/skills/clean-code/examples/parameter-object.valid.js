// ✅ O agrupamento virou um conceito nomeado — rules 033, 053 e 003.

function createUser(name, email, address) {}

// `Address` é um Value Object: valida no construtor, é imutável e leva
// junto o comportamento do conceito (rules 003 e 029).

class Address {
  #street
  #city
  #zipCode
  #country

  constructor({ street, city, zipCode, country }) {
    if (!ZIP_CODE.test(zipCode)) throw new InvalidZipCodeError(zipCode)
    this.#street = street
    this.#city = city
    this.#zipCode = zipCode
    this.#country = country
    Object.freeze(this)
  }

  format() {
    return `${this.#street}, ${this.#city} — ${this.#zipCode}, ${this.#country}`
  }
}

// Ganhos diretos:
//
// - A ordem dos campos deixa de importar: eles são nomeados.
// - A validação do CEP acontece uma vez, no construtor.
// - Um campo novo no endereço não muda nenhuma assinatura de função.
