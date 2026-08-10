// ✅ Testability = 5 — a fonte é injetada (rule 014).
//
// O teste passa um duplo e verifica só a formatação, que é a
// responsabilidade real desta classe. Sem rede, sem espera, determinístico.
// Flexibility sobe junto: trocar a fonte não toca esta classe.

class ReportService {
  #source

  constructor(source) {
    this.#source = source
  }

  async generate() {
    return this.#format(await this.#source.fetch())
  }

  #format(data) {
    return data
  }
}

// No teste, seguindo o padrão AAA da rule 032:
//
//   const source = { fetch: async () => ({ total: 42 }) }   // Arrange
//   const report = await new ReportService(source).generate() // Act
//   expect(report.total).toBe(42)                             // Assert
