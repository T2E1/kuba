// ✅ A flag virou duas funções nomeadas; a falha virou exceção de domínio.
//
// rule 006/034: o nome diz o que faz, sem precisar de comentário.
// rule 037: nenhuma flag decide o caminho — a escolha está no nome chamado.
// rule 027: falha de negócio lança exceção nomeada; o erro não pode ser
//           ignorado por acidente e carrega stack trace.

function transformValidated(payload) {
  if (payload.isInvalid()) throw new InvalidPayloadError(payload)
  return transform(payload)
}

function transformRaw(payload) {
  return transform(payload)
}

// Na chamada, a intenção é legível sem abrir a implementação:
//
//   transformValidated(payload)   em vez de   proc(payload, true)
//   transformRaw(payload)         em vez de   proc(payload, false)
//
// O erro é capturado só na fronteira que sabe tratá-lo — no meio do
// caminho, ele sobe.
