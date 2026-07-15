# Proibição de Funcionalidade Especulativa (Princípio YAGNI)

**ID**: BEHAVIORAL-023
**Severity**: 🟡 Medium
**Category**: Behavioral

---

## What it is

Exige que o código seja implementado apenas quando uma funcionalidade é **necessária** (e não *talvez necessária* no futuro), evitando a inclusão de código ou abstrações desnecessárias.

*(Previne o anti-pattern Speculative Generality: hooks, parâmetros, classes abstratas e configurações criadas para casos de uso hipotéticos sem uso atual.)*

## Why it matters

- Aumenta a complexidade e o código morto no sistema
- Desperdiça tempo de desenvolvimento com abstrações sem uso real
- Aumenta a superfície de ataque com código não testado em produção
- Reduz a agilidade na resposta a mudanças reais, pois há mais código especulativo para manter

## Objective Criteria

- [ ] Classes ou métodos *vazios* que visam ser *placeholders* para funcionalidades futuras são proibidos.
- [ ] É proibida a adição de parâmetros ou opções de configuração que não são usados imediatamente pelo menos por **um** cliente.
- [ ] O código não deve conter mais de **5%** de linhas marcadas como desabilitadas ou com comentários indicando "TODO: futura implementação".

## Allowed Exceptions

- **Requisitos de Interface**: Métodos de interface exigidos por um contrato externo (ex: `Disposable` ou `Closable`) que são trivialmente implementados.

## How to Detect

### Manual

- Buscar métodos vazios, parâmetros não utilizados, ou código que nunca é chamado (código morto)

### Automatic

- Biome: `correctness/noUnusedVariables`, `correctness/noUnusedImports`

## Related to

- [007 - Maximum Lines per Class File](007_limite-maximo-linhas-classe.md): reinforces
- [022 - Simplicity and Clarity (KISS)](022_priorizacao-simplicidade-clareza.md): complements
- [056 - Prohibition of Zombie Code (Lava Flow)](056_proibicao-codigo-zombie-lava-flow.md): reinforces
- [064 - Prohibition of Overengineering](064_proibicao-overengineering.md): complements
- [069 - Prohibition of Premature Optimization](069_proibicao-otimizacao-prematura.md): complements

---

**Created on**: 2025-10-08
**Updated on**: 2026-07-15
**Version**: 1.1
