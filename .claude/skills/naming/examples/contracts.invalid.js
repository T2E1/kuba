// ❌ Contratos Symbol com sufixo que não corresponde à natureza.
// Correto em: contracts.valid.js

// src/component/badge/interface.js   ← singular; o padrão é plural

// Capacidade nomeada como ação. `setVariant` promete um comando que o
// chamador executa; isto é um hook acionado pelo middleware `before`.
// O nome mente sobre quem chama e quando (rule 035).
export const setVariant = Symbol('setVariant')

// Callback de ciclo de vida sem o sufixo. `paint` poderia ser o decorator,
// a função ou o hook — três coisas diferentes com o mesmo nome.
export const paint = Symbol('paint')

// Descrição divergente do nome da constante: no stack trace aparece
// "toggle visibility state", que não é pesquisável pelo nome do import.
export const hideable = Symbol('toggle visibility state')

// Descrição ausente: vira `Symbol()` no stack trace, e depurar fica cego.
export const controller = Symbol()

// Symbol.for sem necessidade: registro GLOBAL do processo. Qualquer código
// que conheça a string alcança o contrato, o que anula o encapsulamento.
// Este contrato é interno ao pacote — Symbol() bastaria.
export const decorative = Symbol.for('decorative')

// Abreviação num contrato público (rule 006).
export const btnAct = Symbol('btnAct')
