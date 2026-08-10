// ✅ O(n) — o loop interno virou busca O(1) num Set.

function findDuplicates(items) {
  const seen = new Set()
  const duplicates = new Set()

  for (const item of items) {          // O(n), uma passagem
    if (seen.has(item)) {              // O(1) — é o que elimina o segundo loop
      duplicates.add(item)
      continue
    }
    seen.add(item)
  }

  return [...duplicates]
}

// Como o custo escala:
//
//     1.000 itens  →     1.000 operações
//    10.000 itens  →    10.000 operações
//   100.000 itens  →   100.000 operações
//
// Dobrar a entrada dobra o trabalho.
//
// Ganho adicional: o Set de duplicates elimina de graça o bug do exemplo
// inválido, que registra o mesmo item várias vezes quando ele aparece três
// ou mais vezes na entrada.
