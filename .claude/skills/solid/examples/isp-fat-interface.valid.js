// ✅ Interface segregada — cada cliente depende só do que usa (rule 013).

class Printer {
  print(document) {}
}

class Scanner {
  scan() {}
}

// Uma impressora simples implementa só Printer. Uma multifuncional
// implementa as duas, mas nenhum cliente é forçado a conhecer Scanner
// só porque precisa de Printer.
class SimplePrinter extends Printer {}

class MultiFunctionDevice extends Printer {
  scan() {}
}

function printReport(printer) {
  printer.print('relatório') // só conhece o método que usa
}
