// ❌ Três níveis de aninhamento e três responsabilidades na mesma função.
// Correto em: nesting-reduction.valid.js
// ICP: CC_base 4, aninhamento 3, responsabilidades 2, acoplamento 2 → 11 🔴

class OrderCheckout {
  submit(order) {
    if (order.isValid()) {
      if (order.total() > 0) {
        this.repository.save(order).then(() => {
          this.notifier.orderSubmitted(order) // 3º nível — validação, persistência e notificação misturadas
        })
      } else {
        throw new EmptyOrderError(order)
      }
    } else {
      throw new InvalidOrderError(order)
    }
  }
}

// Consequências:
//
// - Três níveis de bloco (rule 001): validar, verificar total e agendar
//   a notificação estão um dentro do outro.
// - Três responsabilidades na mesma função (rule 010): validação,
//   persistência e notificação mudam por três razões diferentes.
// - O componente dominante do ICP é aninhamento + responsabilidades, não
//   complexidade ciclomática — extrair método resolve os dois de uma vez.
