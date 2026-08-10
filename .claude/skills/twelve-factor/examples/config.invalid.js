// ❌ Fator 03 (Config) violado — a configuração está no código (rule 042).
// Correto em: config.valid.js

// O que denuncia a violação: esses valores mudam entre dev, staging e
// produção. Tudo que varia por ambiente é configuração, e configuração não
// pode viver no artefato — senão cada ambiente precisa do seu próprio build,
// e o fator 05 (Build/Release/Run) cai junto.

const DATABASE_URL = 'postgres://user:pass@prod-db:5432/app'
const TIMEOUT = 30000

// Verificação que pega isso antes do PR:
//
//   grep -rE "(API_KEY|SECRET|TOKEN|postgres://)" packages/
//
// Zero resultados é o esperado.
