// ❌ Integrity = 1 — bloqueia o merge, independente do resto estar bom.
// Correto em: integrity.valid.js

// O segredo está no código-fonte. Consequências que a nota 1 resume:
//
// - Vaza para todo mundo com acesso de leitura ao repositório.
// - Fica no histórico do git para sempre, mesmo removido depois.
// - Rotacionar a chave passa a exigir um deploy.
// - O mesmo artefato não pode ser promovido entre ambientes.
//
// Viola a rule 030 (funções inseguras e segredos) e a rule 042 (config
// via ambiente).

const API_KEY = 'sk-live-4a9f2c8e1b7d'

fetch(`https://api.service.com/data?key=${API_KEY}`)
