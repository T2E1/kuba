// ❌ Domain Model anêmico — a "entidade" só guarda dado; a regra vazou para o cliente.
// Correto em: domain-model.valid.js

class Order {
  lines
  status

  constructor({ lines, status = 'draft' }) {
    this.lines = lines
    this.status = status
  }

  // Getters/setters puros (rule 008): a classe não tem comportamento
  // próprio, só expõe estado para quem quiser mexer.
  getLines() { return this.lines }
  setStatus(status) { this.status = status }
}

// A regra de confirmação foi parar no Service Layer, repetida em todo
// lugar que precisa confirmar um pedido:
function confirmOrder(order) {
  if (order.getLines().length === 0) throw new EmptyOrderError(order)
  if (order.status !== 'draft') throw new OrderAlreadyConfirmedError(order)
  order.setStatus('confirmed')
}

// Consequências:
//
// - Qualquer código com acesso ao objeto pode pular a validação e chamar
//   `order.setStatus('confirmed')` direto — nada impede (viola rule 009).
// - A regra de negócio, que devia estar num só lugar, tende a ser
//   reescrita em cada Service que precisa confirmar um pedido (rule 021).
// - "Domain Model" aqui é só o nome: na prática é Transaction Script com
//   um passo a mais e sem o ganho de nenhum dos dois (rule 022).
