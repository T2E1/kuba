# Limite Máximo de Linhas por Arquivo de Classe

**ID**: STRUCTURAL-007
**Severity**: 🔴 Critical
**Category**: Structural

---

## What it is

Impõe um limite máximo no número de linhas de código em um arquivo de classe (entidade, *service*, controlador), forçando a extração de responsabilidades para outras classes.

*(Previne o anti-pattern Large Class: uma classe com muitos atributos e métodos, indicando responsabilidades excessivas.)*

## Why it matters

- Forte indicador de violação do Princípio da Responsabilidade Única (SRP)
- Resulta em classes com baixa coesão e alto acoplamento
- Dificulta extremamente a manutenção e a escrita de testes focados
- Sinaliza responsabilidades excessivas concentradas em um único arquivo

## Objective Criteria

- [ ] Arquivos de classe (incluindo declarações, métodos e propriedades) devem ter, no máximo, 50 linhas de código (excluindo linhas em branco e comentários).
- [ ] Classes que atingem 40 linhas devem ser imediatamente candidatas à refatoração.
- [ ] Métodos individuais devem ter, no máximo, 15 linhas de código.

## Allowed Exceptions

- **Classes de Configuração/Inicialização**: Classes que apenas declaram constantes ou mapeamentos (ex: *Mappers*, *Configuration*).
- **Classes de Teste**: *Suites* de teste onde cada método de teste é pequeno, mas o arquivo cresce devido ao número de cenários.

## How to Detect

### Manual

- Contagem visual do arquivo ou uso de ferramentas de análise de métricas
- Verificar se o nome da classe já sugere múltiplas responsabilidades (ex: `UserManagerAndValidator`)

### Automatic

- Sem regra numérica nativa no Biome para `max-lines-per-file`/`max-lines-per-method` — verificação via script de CI (`wc -l`) ou revisão de código

## Related to

- [001 - Single-Level Indentation Rule](001_nivel-unico-indentacao.md): reinforces
- [004 - First-Class Collections](004_colecoes-primeira-classe.md): reinforces
- [010 - Single Responsibility Principle (SRP)](010_principio-responsabilidade-unica.md): reinforces
- [021 - Prohibition of Logic Duplication (DRY)](021_proibicao-duplicacao-logica.md): reinforces
- [023 - Prohibition of Speculative Functionality (YAGNI)](023_proibicao-funcionalidade-especulativa.md): reinforces
- [025 - Prohibition of The Blob Anti-Pattern](025_proibicao-anti-pattern-the-blob.md): reinforces
- [016 - Common Closure Principle (CCP)](016_principio-fechamento-comum.md): reinforces

---

**Created on**: 2025-10-04
**Updated on**: 2026-07-15
**Version**: 1.1
