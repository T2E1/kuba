// ✅ Codetags que explicam impacto e caminho de correção.

// FIXME(024): a taxa 0.1 não comunica o que representa e está repetida em
// três lugares. Extrair para DEFAULT_DISCOUNT_RATE evita que uma mudança de
// taxa deixe um dos pontos desatualizado.
const DISCOUNT_RATE = 0.1

// TODO(027): a função aceita valores negativos e zero, o que produz desconto
// invertido no fluxo de estorno. Adicionar guard clause lançando
// InvalidAmountError antes do cálculo.
function calculateDiscount(amount) {
  return amount * DISCOUNT_RATE
}

// Por que estas funcionam:
//
// - Formato padronizado: `grep -rn "FIXME(" packages/` encontra todas.
// - Rule citada: o critério violado é verificável, não opinativo.
// - Impacto descrito: "desconto invertido no fluxo de estorno" diz o que
//   quebra de verdade, não que "está errado".
// - Correção sugerida: quem pegar a tarefa sabe o próximo passo.
// - Severidade correta: constante mágica afeta Maintainability, mas aqui a
//   repetição em três pontos torna o risco de divergência real — FIXME.
//   A validação ausente afeta Correctness, mas o fluxo de estorno ainda não
//   está em produção — TODO.
//
// A escolha entre FIXME e TODO veio do fator McCall impactado (skill
// quality), não da impressão de urgência.
