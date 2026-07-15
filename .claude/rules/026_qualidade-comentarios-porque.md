# Qualidade de Comentários: Apenas o Porquê, Não o O Quê

**ID**: STRUCTURAL-026
**Severity**: 🟡 Medium
**Category**: Structural

---

## What it is

Exige que os comentários expliquem o **porquê** ou a **intenção** do código, o contexto legal, as desvantagens (*trade-offs*) ou a lógica não óbvia, e **proíbe** comentários redundantes que descrevem o que o código já mostra.

## Why it matters

- Comentários redundantes poluem o código sem agregar informação
- Tendem a ficar desatualizados, criando mentiras no sistema
- Sinalizam que o código não está se documentando por bons nomes
- Dificultam distinguir, na leitura, comentários realmente importantes dos triviais

## Objective Criteria

- [ ] É proibido o uso de comentários para descrever o que uma função óbvia faz (ex: `// retorna o valor`).
- [ ] Comentários devem ser usados para explicar regras de negócio não evidentes, *trade-offs* de performance ou solução de bugs específicos.
- [ ] Funções públicas devem ter no máximo **20%** de seu corpo ocupado por linhas de comentários.

## Allowed Exceptions

- **Documentação de API**: Comentários JSDoc ou TSDoc usados para gerar documentação de interface pública.
- **Marcações Especiais**: Comentários como `// TODO:` ou `// FIXME:` (em quantidade limitada).

## How to Detect

### Manual

- Verificar se o código pode ser lido e compreendido sem a necessidade de ler os comentários

### Automatic

- Sem regra nativa de Biome para qualidade semântica de comentários — detecção via revisão de código

## Related to

- [006 - Prohibition of Abbreviated Names](006_proibicao-nomes-abreviados.md): reinforces
- [022 - Simplicity and Clarity (KISS)](022_priorizacao-simplicidade-clareza.md): complements
- [050 - Logs as Event Streams](050_logs-fluxo-eventos.md): complements

---

**Created on**: 2025-10-08
**Updated on**: 2026-07-15
**Version**: 1.1
