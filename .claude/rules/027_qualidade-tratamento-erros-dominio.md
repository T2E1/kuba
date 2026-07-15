# Qualidade no Tratamento de Erros: Use Exceções de Domínio

**ID**: BEHAVIORAL-027
**Severity**: 🟠 High
**Category**: Behavioral

---

## What it is

Exige que a lógica de negócio use **exceções (erros)** para relatar problemas, em vez de códigos de retorno ou valores nulos. Exceções devem ser específicas do domínio (ex: `UsuarioNaoEncontradoError`).

## Why it matters

- Códigos de erro ou valores nulos forçam o cliente a verificar o retorno em toda chamada
- Espalha lógica de tratamento de erro por todo o código consumidor
- Exceções garantem que o erro não seja silenciosamente ignorado
- Fornecem *stack trace* útil para depuração, o que `return null` não oferece

## Objective Criteria

- [ ] Métodos de negócio (Services, Use Cases) devem retornar tipos válidos ou lançar exceção, **proibindo** `return null` ou `return undefined`.
- [ ] É proibido o uso de `catch` vazio ou que apenas loga o erro e continua o fluxo (deve relançar ou tratar).
- [ ] Exceções lançadas devem ser customizadas para o domínio (ex: estender uma classe `BaseDomainError`).

## Allowed Exceptions

- **Funções de Parse/Utilidade**: Funções de baixo nível que podem retornar `null` ou `undefined` para indicar falha na leitura ou conversão.

## How to Detect

### Manual

- Buscar `return null`, `return -1`, ou `catch (e) {}` no código de negócio

### Automatic

- Biome: `suspicious/noEmptyBlockStatements` (sinaliza blocos `catch` vazios); ausência de regra nativa para `return null` — detecção via revisão de código

## Related to

- [002 - Prohibition of ELSE Clause](002_proibicao-clausula-else.md): complements
- [022 - Simplicity and Clarity (KISS)](022_priorizacao-simplicidade-clareza.md): reinforces
- [028 - Async Exception Handling](028_tratamento-excecao-assincrona.md): reinforces
- [036 - Side-Effect Function Restrictions](036_restricao-funcoes-efeitos-colaterais.md): reinforces
- [050 - Logs as Event Streams](050_logs-fluxo-eventos.md): complements

---

**Created on**: 2025-10-08
**Updated on**: 2026-07-15
**Version**: 1.1
