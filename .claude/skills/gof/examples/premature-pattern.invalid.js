// ❌ Pattern sem problema — viola as rules 064 e 023.
// Correto em: premature-pattern.valid.js

// Existe exatamente UMA estratégia. A abstração não abstrai nada: foi criada
// "para quando aparecerem outras", que é a definição de Speculative
// Generality (rule 023).

class FormatterStrategy {
  format(value) {
    throw new NotImplementedError('FormatterStrategy#format')
  }
}

class UpperCaseFormatter extends FormatterStrategy {
  format(value) {
    return value.toUpperCase()
  }
}

class FormatterFactory {
  static create() {
    return new UpperCaseFormatter()
  }
}

class TextProcessor {
  #formatter

  constructor(formatter = FormatterFactory.create()) {
    this.#formatter = formatter
  }

  process(value) {
    return this.#formatter.format(value)
  }
}

// Quatro classes, três arquivos e um nível de indireção para chamar
// `toUpperCase()`. O custo é real e imediato; o benefício é hipotético.
//
// O teste que expõe: existe uma segunda implementação concreta? Não.
// Então não há variação, e sem variação não há Strategy — há cerimônia.
