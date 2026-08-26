// O eixo por camada torna a visibilidade restrita inalcançável: todo arquivo
// precisa ser público, porque todo consumidor está em outra pasta.
// Correto em visibility.valid.js.
//
//   src/
//   ├── components/field.js
//   ├── validators/validateComment.js
//   └── services/commentApi.js

// ── src/validators/validateComment.js ───────────────────────────────────────
// ERRO 1 — público por construção, não por decisão.
// O único consumidor real é components/field.js. Mas está em outra pasta,
// então isto precisa atravessar a fronteira — e ao atravessar, vira contrato
// para qualquer arquivo do projeto.
const MIN_LENGTH = 3

export function validateComment(text) {
  return text.trim().length >= MIN_LENGTH
}

// ERRO 2 — o limite também vazou, pelo mesmo motivo: alguém em outra camada
// vai precisar dele, então foi exportado "por precaução".
export { MIN_LENGTH }

// ── src/components/field.js ─────────────────────────────────────────────────
// ERRO 3 — import que atravessa camada para alcançar o que deveria ser vizinho.
import { validateComment } from '@validators/validateComment'

export function field(text) {
  return { text, valid: validateComment(text) }
}

// ── src/components/moderationPanel.js — feature completamente diferente ─────
// ERRO 4 — e aqui o preço é cobrado.
// Nada impediu que um recurso não relacionado passasse a depender de um detalhe
// interno do formulário de comentário. Não houve decisão: o recorte tornou
// `validateComment` alcançável, e alcançável vira usado.
import { validateComment, MIN_LENGTH } from '@validators/validateComment'

export function moderationPanel(items) {
  // Mudar MIN_LENGTH agora quebra um recurso que ninguém associava ao outro,
  // e o grep que provaria isso precisa varrer o projeto inteiro — porque não
  // há fronteira que limite onde procurar.
  return items.filter((item) => validateComment(item.text) && item.text.length > MIN_LENGTH)
}
