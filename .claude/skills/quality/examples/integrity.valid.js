// ✅ Integrity = 5 — o segredo é injetado pelo ambiente (rules 030 e 042).
//
// O artefato passa a ser o mesmo em dev, staging e produção; a chave muda
// sem rebuild e pode ser rotacionada sem deploy.

const apiKey = process.env.SERVICE_API_KEY

// Falhar cedo e com nome: variável ausente vira erro de domínio, não
// `undefined` propagado três camadas adiante (rule 027).
if (!apiKey) throw new MissingConfigurationError('SERVICE_API_KEY')

fetch(`https://api.service.com/data?key=${apiKey}`)
