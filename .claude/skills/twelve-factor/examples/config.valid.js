// ✅ Fator 03 (Config) — o ambiente decide, o artefato é o mesmo (rule 042).
//
// O mesmo build é promovido de dev para produção sem recompilar. Trocar o
// banco é trocar uma variável, não fazer um deploy.

const databaseUrl = process.env.DATABASE_URL
const timeout = Number(process.env.REQUEST_TIMEOUT_MS)

// Validar na inicialização e falhar com nome: variável ausente não pode
// virar `undefined` propagado silenciosamente (rule 027).

if (!databaseUrl) throw new MissingConfigurationError('DATABASE_URL')
if (!Number.isFinite(timeout)) throw new MissingConfigurationError('REQUEST_TIMEOUT_MS')
