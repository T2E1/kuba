// C-CONV correto: o prefixo declara custo e posse, e nenhum mente.
//
//   as    grátis    — vista sobre o mesmo dado, sem cópia
//   to    caro      — valor novo; o original continua válido
//   into  variável  — consome o original, que não deve ser usado depois

export class FormValue {
  #entries

  constructor(entries) {
    this.#entries = entries
  }

  // `as` — devolve uma vista sobre a mesma estrutura. Nada é alocado.
  // O consumidor pode chamar isto num laço sem pensar duas vezes.
  asEntries() {
    return this.#entries
  }

  // `to` — aloca. Constrói um FormData novo a cada chamada, e o FormValue
  // original continua válido e utilizável depois.
  toFormData() {
    const form = new FormData()
    for (const [key, value] of this.#entries) form.append(key, value)
    return form
  }

  // `to` — aloca. Mesmo contrato: caro, e não consome.
  toJSON() {
    return Object.fromEntries(this.#entries)
  }

  // `into` — consome. Transfere as entradas e esvazia a origem: depois disto
  // o FormValue não deve ser usado. O nome avisa; o campo privado garante.
  intoEntries() {
    const entries = this.#entries
    this.#entries = null
    return entries
  }

  // C-CTOR — construtor é método estático inerente, não função solta.
  static from(source) {
    return new FormValue([...source])
  }
}

// Ponto de uso: o custo de cada chamada é legível sem abrir a implementação.
export function submit(value) {
  const preview = value.asEntries()      // barato — pode ir num laço
  const payload = value.toFormData()     // caro — uma vez só
  return { size: preview.length, payload }
}
