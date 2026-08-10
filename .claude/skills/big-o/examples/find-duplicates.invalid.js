// ❌ O(n²) — loop aninhado sobre a mesma coleção.
// Correto em: find-duplicates.valid.js

function findDuplicates(items) {
  const duplicates = []

  for (let i = 0; i < items.length; i++) {        // O(n)
    for (let j = i + 1; j < items.length; j++) {  // O(n) → O(n²)
      if (items[i] === items[j]) duplicates.push(items[i])
    }
  }

  return duplicates
}

// Como o custo escala:
//
//     1.000 itens  →     500.000 comparações
//    10.000 itens  →  50.000.000 comparações
//   100.000 itens  →   5 bilhões de comparações
//
// Dobrar a entrada quadruplica o trabalho. O método funciona bem em teste com
// dez itens e trava em produção.
//
// Viola também a rule 001 (loop dentro de loop = dois níveis de bloco).
