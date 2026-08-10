// ❌ Estado interno representado por atributo.
// Correto em: internals-state.valid.js

class Input extends HTMLElement {
  markValid() {
    // O estado vaza para o DOM inspecionado. Consequências:
    //
    // - Qualquer código externo remove com removeAttribute e corrompe o
    //   estado do componente — não há encapsulamento algum.
    // - O atributo entra no HTML serializado, poluindo o markup.
    // - Vira contrato acidental: alguém vai estilizar por [data-valid] e
    //   passar a depender dele, então renomear vira breaking change.
    this.setAttribute('data-valid', '')
  }

  markInvalid() {
    this.removeAttribute('data-valid')
    this.setAttribute('data-invalid', '')
  }
}

// E o CSS precisa de seletor de atributo:
//
//   kb-input[data-valid] { border-color: green }
//
// que compete em especificidade com qualquer outro seletor de atributo e
// não comunica que aquilo é um estado do componente.
//
// Ainda: `markValid` e `markInvalid` manipulam dois atributos cada, e nada
// garante que os dois não coexistam.
