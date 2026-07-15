# Proibição da Cláusula ELSE para Fluxo de Controle

**ID**: BEHAVIORAL-002
**Severity**: 🟠 High
**Category**: Behavioral

---

## What it is

Restringe o uso das cláusulas `else` e `else if`, promovendo a substituição por *guard clauses* (retorno antecipado) ou padrões de polimorfismo para lidar com diferentes caminhos de execução.

## Why it matters

- Melhora a clareza do fluxo de controle ao eliminar ramificações aninhadas
- Evita Complexidade Ciclomática desnecessária
- Força aderência ao Princípio da Responsabilidade Única (SRP), pois cada bloco lida com uma única condição
- Torna o "caminho feliz" visível no nível zero de indentação, em vez de escondido em um `else`

## Objective Criteria

- [ ] O uso explícito das palavras-chave `else` ou `else if` é proibido.
- [ ] Condicionais devem ser usados primariamente como *guard clauses* (verificação de pré-condições e retorno/lançamento de erro).
- [ ] Lógica de ramificação complexa deve ser resolvida via polimorfismo (padrões *Strategy* ou *State*).

## Allowed Exceptions

- **Estruturas de Controle de Linguagem**: Estruturas como `switch` (que geralmente se comportam como `if/else if`) podem ser usadas, desde que cada `case` retorne ou encerre a execução.

## How to Detect

### Manual

- Buscar ` else ` ou ` else if ` no código
- Identificar blocos condicionais que poderiam virar *guard clauses* com retorno antecipado

### Automatic

- Biome: `style/noUselessElse` (detecta `else` desnecessário quando o bloco anterior já encerra a execução)

## Related to

- [001 - Single-Level Indentation Rule](001_nivel-unico-indentacao.md): reinforces
- [008 - Prohibition of Getters/Setters](008_proibicao-getters-setters.md): reinforces
- [011 - Open/Closed Principle (OCP)](011_principio-aberto-fechado.md): reinforces
- [022 - Simplicity and Clarity (KISS)](022_priorizacao-simplicidade-clareza.md): complements
- [027 - Domain Error Handling Quality](027_qualidade-tratamento-erros-dominio.md): complements

---

**Created on**: 2025-10-04
**Updated on**: 2026-07-15
**Version**: 1.1
