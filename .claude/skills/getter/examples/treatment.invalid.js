// ❌ Getters puros — viola a rule 008.
// Correto em: treatment.valid.js

class User {
  #email
  #name
  #role

  // Nenhum dos três trata coisa alguma. Remover os getters e tornar os
  // campos públicos daria exatamente o mesmo resultado para quem chama —
  // que é o teste definitivo de que não estão fazendo nada.
  get name() {
    return this.#name
  }

  get email() {
    return this.#email
  }

  get role() {
    return this.#role
  }
}

// O custo real não é a cerimônia: é o que isso permite do lado do cliente.
//
//   if (user.role === 'admin' && user.email.includes('@empresa.com')) {
//     liberarAcesso()
//   }
//
// A regra de negócio "quem pode acessar" migrou para fora do objeto que tem
// os dados. Isso é rule 009 (Diga, Não Pergunte) violada, e a lógica vai se
// repetir em cada ponto que precisar da mesma decisão (rule 021).
