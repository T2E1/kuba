// ✅ O problema não pediu pattern nenhum.

function format(value) {
  return value.toUpperCase()
}

// Quando a segunda implementação aparecer de verdade — e só então — o
// caminho é: extrair a abstração, mover a escolha para uma Factory,
// aplicar Strategy. A refatoração é barata porque o código é pequeno.
//
// Antecipar não deixa a refatoração mais barata; deixa mais caro o
// caminho até lá (rules 023 e 064).
//
// Critério para o pattern entrar:
//
//   1. Existem duas ou mais implementações concretas reais.
//   2. A escolha entre elas acontece em runtime.
//   3. A ramificação por tipo já apareceu em mais de um lugar.
//
// Nenhum dos três é satisfeito por "vai que um dia precisamos".
