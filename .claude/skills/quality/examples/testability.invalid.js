// ❌ Testability = 1 — impede o merge.
// Correto em: testability.valid.js

// A dependência é criada dentro do método, não recebida. Para testar
// `generate()` é preciso rede real, um servidor no ar e uma resposta
// estável — três coisas que um teste unitário não pode garantir.
//
// Viola a rule 014 (inversão de dependência), e por consequência derruba
// também Flexibility: trocar a fonte de dados exige editar esta classe.

class ReportService {
  async generate() {
    const response = await fetch('https://api.service.com/data')
    return this.#format(await response.json())
  }

  #format(data) {
    return data
  }
}
