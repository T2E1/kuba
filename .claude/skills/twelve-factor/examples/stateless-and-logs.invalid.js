// ❌ Fatores 06 (Processes) e 11 (Logs) violados — rules 045 e 050.
// Correto em: stateless-and-logs.valid.js

// Fator 06: a sessão vive na memória do processo. Consequências:
//
// - Um segundo processo não enxerga a sessão criada pelo primeiro, então
//   escalar horizontalmente quebra o login (fator 08 cai junto).
// - Reiniciar o processo desloga todo mundo (fator 09 cai junto).
const sessions = new Map()

function login(sessionId, data) {
  sessions.set(sessionId, data)
}

// Fator 11: o log vai para um arquivo local. Consequências:
//
// - Some quando o container é recriado.
// - A aplicação passa a ter que se preocupar com rotação e disco cheio.
// - Texto livre não é consultável por campo.
function log(message) {
  fs.appendFileSync('/var/log/app.log', `${message}\n`)
}
