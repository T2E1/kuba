# Proibição de Feature Envy

**ID**: AP-13-057
**Severity**: 🟡 Medium
**Category**: Behavioral

---

## What it is

Feature Envy ocorre quando um método usa dados e comportamentos de outra classe mais do que da sua própria. Indica que o método está na classe errada — ele "inveja" a outra classe e deveria estar lá. O método parece mais interessado nos dados de outro objeto do que nos seus próprios.

## Why it matters

- Violação de encapsulamento: método precisa expor dados internos de outra classe (`getters`)
- Acoplamento desnecessário: dificulta mudar uma classe sem quebrar a outra
- Lógica fragmentada: para entender uma regra de negócio completa, precisa ler múltiplas classes
- Dificuldade de teste: testar o método requer construir objeto de outra classe com estado correto
- Violação de Tell, Don't Ask: perguntando por estado em vez de solicitar comportamento

## Objective Criteria

- [ ] Método chama getters de outro objeto 3 ou mais vezes
- [ ] Método acessa propriedades de outro objeto mais do que `this`
- [ ] Método parece estar trabalhando nos dados de outro objeto em vez dos seus próprios
- [ ] Para testar o método, precisa configurar estado complexo de objetos dependentes
- [ ] Método que não usa nenhum atributo ou método da própria classe, apenas dependências

## Allowed Exceptions

- Métodos em controllers/orchestrators que orquestram fluxos entre múltiplos objetos de serviço
- DTOs/Data mappers que extraem dados de múltiplos objetos para formatar/serializar
- Event handlers que agregam dados de diferentes fontes para processamento único
- Código legado onde refatoração traria alto risco sem ganho claro

## How to Detect

### Manual

- Ler métodos: identificar aqueles que repetidamente chamam `obj.getSomething()`
- Verificar métodos que não usam `this` internamente (ou usam minimamente)
- Analisar testes: se testar método requer setup complexo de dependências externas, pode ser feature envy

### Automatic

- Sem regra nativa de Biome para acoplamento por acesso a dados externos — detecção via revisão de código

## Related to

- [009 - Tell, Don't Ask](009_diga-nao-pergunte.md): reinforces
- [008 - Prohibition of Getters/Setters](008_proibicao-getters-setters.md): reinforces
- [018 - Acyclic Dependencies Principle (ADP)](018_principio-dependencias-aciclicas.md): complements
- [061 - Prohibition of Middle Man](061_proibicao-middle-man.md): complements
- [003 - Primitive Domain Encapsulation](003_encapsulamento-primitivos.md): reinforces

---

**Created on**: 2026-03-28
**Updated on**: 2026-07-15
**Version**: 1.1
