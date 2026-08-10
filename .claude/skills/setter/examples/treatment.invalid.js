// ❌ Setters puros e setter com nome de mecânica.
// Correto em: treatment.valid.js

class Order extends HTMLElement {
  #email
  #status

  // Atribuição pura: qualquer string entra, inclusive vazia ou sem "@".
  // O objeto perdeu a capacidade de proteger o próprio estado (rule 008).
  set email(value) {
    this.#email = value
  }

  // Pior que puro: expõe a mecânica interna do estado.
  set status(value) {
    this.#status = value
  }
}

// O que isso permite do lado do cliente:
//
//   pedido.status = 'cancelado'
//   registrarMotivo(motivo)
//   notificarCliente()
//
// A operação "cancelar" existe de verdade no domínio, mas está espalhada em
// três chamadas na mão de quem consome. Quem esquecer uma delas deixa o
// sistema inconsistente, e nada impede `pedido.status = 'banana'`.
//
// É rule 009 violada: o cliente manipula estado em vez de pedir a operação.
