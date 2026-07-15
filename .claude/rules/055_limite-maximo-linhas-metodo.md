# Limite Máximo de Linhas por Método

**ID**: AP-19-055
**Severity**: 🟠 High
**Category**: Structural

---

## What it is

Long Method ocorre quando um método possui muitas linhas de código, tipicamente fazendo várias coisas diferentes. Métodos longos são difíceis de entender, testar, reutilizar e manter. E frequentemente contêm múltiplas abstrações ocultas.

## Why it matters

- Baixa legibilidade: desenvolvedores perdem o fluxo lógico em métodos extensos
- Dificuldade de teste: testar múltiplas responsabilidades em um único método é complexo
- Baixa reusabilidade: partes do método não podem ser reutilizadas isoladamente
- Code smell: métodos longos frequentemente indicam violação de SRP e baixa coesão
- Bugs ocultos: é fácil se perder no fluxo de controle complexo e introduzir bugs

## Objective Criteria

- [ ] Métodos com mais de 20 linhas de código (excluindo linhas em branco e comentários)
- [ ] Métodos com mais de 3 níveis de indentação aninhada
- [ ] Métodos que fazem mais de 3 coisas diferentes (ex: valida + persiste + loga)
- [ ] Métodos com múltiplas responsabilidades em sequência sem dependência clara
- [ ] Métodos onde até o autor não consegue explicar "o que ele faz" em uma frase

## Allowed Exceptions

- Construtores de objetos complexos quando não há alternativa mais legível
- Métodos implementando algoritmos matemáticos ou científicos onde quebrar a lógica reduziria clareza
- Compatibilidade com código legado onde refatoração traria alto risco
- Event handlers ou callbacks externos com código de terceiros arbitrário

## How to Detect

### Manual

- Ler métodos: se você precisa pausar no meio para continuar entendendo, está longo demais
- Buscar comentários explicando "aqui ele faz X, agora faz Y" — pontos de extração
- Identificar métodos onde CTRL+F mostra padrões repetidos, condições ou validações

### Automatic

- Biome: `complexity/noExcessiveCognitiveComplexity` (sinaliza métodos com complexidade acumulada alta, correlacionada a métodos longos)

## Related to

- [001 - Single-Level Indentation Rule](001_nivel-unico-indentacao.md): reinforces
- [010 - Single Responsibility Principle (SRP)](010_principio-responsabilidade-unica.md): reinforces
- [007 - Maximum Lines per Class File](007_limite-maximo-linhas-classe.md): complements
- [009 - Tell, Don't Ask](009_diga-nao-pergunte.md): complements
- [037 - Prohibition of Flag Arguments](037_proibicao-argumentos-sinalizadores.md): reinforces
- [059 - Prohibition of Refused Bequest](059_proibicao-heranca-refusao.md): reinforces

---

**Created on**: 2026-03-28
**Updated on**: 2026-07-15
**Version**: 1.1
