// ✅ Fatores 06 (Processes) e 11 (Logs) — rules 045 e 050.

// Fator 06: o estado mora num backing service (fator 04), alcançado por
// configuração. Qualquer processo atende qualquer requisição, e derrubar um
// deles não perde nada — é o que torna o fator 08 e o 09 possíveis.

async function login(sessionId, data) {
  await sessionStore.set(sessionId, data)
}

// Fator 11: o log é um fluxo de eventos no stdout. A aplicação não sabe e
// não decide onde ele é guardado — isso é responsabilidade do ambiente de
// execução. Uma linha JSON por evento, consultável por campo.

function log(level, message, context) {
  console.log(JSON.stringify({ level, message, ...context }))
}
