// ❌ Privacidade por convenção — não é privacidade.
// Correto em: private-method.valid.js

class Component extends HTMLElement {
  _privateMethod() {
    // O underscore é um pedido, não uma garantia. Qualquer código externo
    // chama `element._privateMethod()` normalmente.
  }

  __init() {
    // Duplo underscore não muda nada — só sugere mais fortemente.
  }
}

// Três problemas:
//
// - rule 035: o nome promete privacidade que a linguagem não entrega.
//   É desinformação, no sentido exato da regra.
// - O membro aparece em `Object.getOwnPropertyNames`, no autocomplete e na
//   serialização. Consumidores passam a depender dele sem saber que não
//   deveriam, e removê-lo vira breaking change.
// - Não há distinção entre "privado de verdade" e "privado com contrato":
//   ambos ficam com underscore, e ninguém sabe qual pode ser tocado.
