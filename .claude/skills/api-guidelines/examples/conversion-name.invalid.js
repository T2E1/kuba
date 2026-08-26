// Viola C-CONV: o prefixo de conversão mente sobre custo e posse.
// Correto em conversion-name.valid.js.

export class FormValue {
  entries // ERRO C-STRUCT-PRIVATE — campo público vira contrato para sempre

  constructor(entries) {
    this.entries = entries
  }

  // ERRO 1 — `as` promete custo zero, e este método aloca um FormData inteiro.
  // O leitor confia no prefixo e chama isto dentro de um laço.
  asFormData() {
    const form = new FormData()
    for (const [key, value] of this.entries) form.append(key, value)
    return form
  }

  // ERRO 2 — `to` promete que o original continua válido, e este método
  // esvazia a origem. É o contrato de `into`, com o nome de `to`.
  // Nada avisa; o segundo uso do objeto devolve vazio em silêncio.
  toEntries() {
    const entries = this.entries
    this.entries = null
    return entries
  }

  // ERRO 3 — C-GETTER: prefixo `get` num acessor, e sem lógica nenhuma.
  // Viola também a rule 008 deste repositório.
  getEntries() {
    return this.entries
  }

  // ERRO 4 — C-CUSTOM-TYPE: boolean decidindo o comportamento.
  // No ponto de chamada, `serialize(true)` não diz nada.
  serialize(asJson) {
    if (asJson) return JSON.stringify(this.entries)
    return String(this.entries)
  }
}

// ERRO 5 — C-CTOR: construtor como função solta em vez de método estático.
export function createFormValue(source) {
  return new FormValue([...source])
}

// Ponto de uso: onde o preço aparece.
export function submit(value) {
  const payload = value.asFormData()  // parece barato, aloca
  const first = value.toEntries()     // parece não consumir, consome
  const second = value.toEntries()    // devolve null, e ninguém avisou
  return { payload, first, second }
}
