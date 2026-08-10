// ❌ Viola a regra 3 — primitivo carregando conceito de domínio (rule 003).
// Correto em: value-object.valid.js

// O tipo diz `string`, mas o conceito é Email. Consequências:
//
// 1. A validação precisa ser repetida em cada função que recebe o valor —
//    e uma delas vai esquecer (rule 021, duplicação).
// 2. Nada impede passar um CPF onde se espera um e-mail: ambos são string.
// 3. O formato e a formatação não têm dono; ficam espalhados.

function sendInvoice(email) {
  if (!email.includes('@')) throw new Error('invalid')
  // ...
}

function subscribe(email) {
  // Validação esquecida aqui. O bug só aparece três camadas adiante.
  // ...
}
