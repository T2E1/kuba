// ❌ Quatro violações numa função de cinco linhas.
// Correto em: intention-revealing.valid.js

function proc(data, shouldValidate) {
  // rule 006: `proc` e `data` não revelam nada. O que é processado? Em quê?
  // rule 037: `shouldValidate` é flag — a função tem dois comportamentos
  //           escondidos atrás de um booleano na chamada. Quem lê
  //           `proc(payload, true)` não sabe o que vai acontecer.
  try {
    // rule 027: falha de negócio vira `null`. Todo chamador precisa testar
    //           o retorno, e um deles vai esquecer.
    if (shouldValidate && !data.ok) return null
    return transform(data)
  } catch (error) {
    // rule 027: catch vazio engole o erro. O stack trace morre aqui e o
    //           bug reaparece três camadas adiante, sem origem.
  }
}
