// ❌ Interface gorda — todo cliente carrega métodos que não usa.
// Correto em: isp-fat-interface.valid.js

class MultiFunctionDevice {
  print(document) {}
  scan() {}
  fax(document) {}
}

// SimplePrinter não tem scanner nem fax, mas é forçada a "implementar"
// os três porque herda de uma única interface gorda (rule 013).
class SimplePrinter extends MultiFunctionDevice {
  scan() {
    throw new UnsupportedOperationError('SimplePrinter não escaneia')
  }
  fax() {
    throw new UnsupportedOperationError('SimplePrinter não envia fax')
  }
}

// Consequências:
//
// - SimplePrinter recusa a maior parte do que herda (Refused Bequest,
//   rule 059) — sintoma direto de ISP violado.
// - Qualquer cliente que recebe um MultiFunctionDevice por parâmetro
//   pode chamar scan() numa SimplePrinter e só descobre o erro em runtime.
// - Adicionar um quarto método à interface obriga toda subclasse a
//   decidir o que fazer com ele, usada ou não.
