---
name: clean-code
model: opus
description: Práticas de Clean Code de Robert C. Martin aplicadas às rules 021–039 — nomenclatura que revela intenção, funções pequenas com até 3 parâmetros, exceções de domínio em vez de null, imutabilidade, separação Command/Query, segurança e a Regra do Escoteiro. Use ao escrever ou revisar qualquer código, ao encontrar nome abreviado ou enganoso, `return null` em regra de negócio, `catch` vazio, flag booleana em assinatura, constante mágica, comentário redundante ou função com muitos parâmetros. Não use para métricas objetivas de complexidade — use a skill complexity.
---

# Clean Code

## O que é

O conjunto de práticas de *Clean Code: A Handbook of Agile Software Craftsmanship*
(Robert C. Martin, 2008) que as rules 021 a 039 codificam com critérios verificáveis.
É a camada qualitativa: onde uma métrica não alcança, o julgamento treinado por estas
práticas alcança.

## Quando usar

| Situação | Ação |
|---|---|
| Escrevendo qualquer código em `packages/` | Aplicar durante a escrita, não depois |
| Revisando um diff | Passar o detector de smell abaixo |
| Tocando um arquivo por outro motivo | Regra do Escoteiro — deixar melhor do que encontrou |
| Nome não revela intenção | Renomear antes de comentar |

Não se aplica a arquivos de configuração puros e DTOs estruturais. Para medir
complexidade com número, use `complexity`; esta skill trata do que a métrica não vê.

## Como aplicar

| Tema | Rules | Pergunta-chave | Detalhe |
|---|---|---|---|
| Nomenclatura | 006, 034, 035 | O nome revela a intenção sem comentário? | [naming.md](references/naming.md) |
| Funções | 033, 037 | Faz uma coisa só, com até 3 parâmetros? | [functions.md](references/functions.md) |
| Tratamento de erros | 027, 028 | Exceção de domínio em vez de `null` ou código? | [error-handling.md](references/error-handling.md) |
| Estrutura | 021, 022, 023, 026 | Simples, DRY, sem especulação, autodocumentado? | [code-structure.md](references/code-structure.md) |
| Imutabilidade | 029, 036, 038 | Imutável, sem efeito colateral, CQS respeitado? | [immutability.md](references/immutability.md) |
| Segurança | 030, 031, 042 | Sem `eval`, sem `../`, segredo no ambiente? | [security.md](references/security.md) |
| Testes | 032 | Cobertura ≥ 85% no domínio, padrão AAA? | [testing.md](references/testing.md) |
| Refatoração contínua | 039 | O arquivo saiu melhor do que entrou? | [boy-scout-rule.md](references/boy-scout-rule.md) |

### Detector rápido de smell

| Vejo no código | Rule | Ação imediata |
|---|---|---|
| `accountList` sendo um `Set` | 035 | Renomear para `accountSet` |
| `process(data, shouldLog)` | 037 | Separar em `processAndLog()` e `process()` |
| `return null` em service | 027 | Lançar `UserNotFoundError` |
| `eval(userInput)` | 030 | Usar mapa de funções |
| `../../../utils/helper` | 031 | Usar `@utils/helper` |
| `const strName = 'John'` | 035 | Remover o prefixo de tipo |
| Função com 6 parâmetros | 033 | Criar Parameter Object |
| `try {} catch (error) {}` | 027 | Relançar ou tratar de fato |
| Classe com 80 linhas | 007 | Extrair responsabilidades |
| `API_KEY = 'sk-123'` | 042 | Mover para `process.env` |
| `// retorna o valor` | 026 | Apagar — o código já diz isso |

### Fluxo

1. Identificar o tema pelo sintoma (tabela acima).
2. Abrir a referência correspondente.
3. Aplicar a correção seguindo os exemplos de lá.
4. Confirmar com `bun run lint` que nenhuma regra do Biome ficou pendente.

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Nome que revela intenção, flag removida, exceção de domínio (rules 006, 027, 037) | [intention-revealing.valid.js](examples/intention-revealing.valid.js) | [intention-revealing.invalid.js](examples/intention-revealing.invalid.js) |
| Parameter Object no lugar de lista longa (rules 033, 053) | [parameter-object.valid.js](examples/parameter-object.valid.js) | [parameter-object.invalid.js](examples/parameter-object.invalid.js) |

## Checklist

- [ ] Nenhum nome abreviado fora de `i`/`j` e acrônimos ubíquos
- [ ] Nenhum nome contradizendo o tipo real que armazena
- [ ] Nenhuma função com mais de 3 parâmetros
- [ ] Nenhuma flag booleana decidindo o caminho de execução
- [ ] Nenhum `return null` para falha de negócio
- [ ] Nenhum `catch` vazio ou que apenas loga e segue
- [ ] Nenhuma Promise sem `await` ou `.catch()`
- [ ] Nenhum literal com significado de negócio fora de constante nomeada
- [ ] Nenhum comentário descrevendo o que o código já diz
- [ ] Nenhum segredo no código-fonte
- [ ] O arquivo tocado ficou melhor do que estava

## Troubleshooting

### Renomeei tudo e o código continua difícil de ler

**Causa:** o problema não era nomenclatura, era a função fazer coisas demais — nomes bons
não salvam responsabilidade misturada.
**Solução:** extrair até cada função ter um nome honesto de uma frase.

### Troquei `return null` por exceção e agora há `try/catch` em todo lugar

**Causa:** exceções sendo capturadas onde não podem ser tratadas.
**Solução:** capture na fronteira que sabe o que fazer com o erro. No meio do caminho,
deixe subir. É isso que a rule 027 quer dizer com "não ignorar silenciosamente".

### A Regra do Escoteiro está inflando os diffs

**Causa:** refatoração indo além do escopo tocado.
**Solução:** melhorar apenas o que está no raio da alteração. Fora disso, registrar com
codetag e tratar separado.

## Referências

- `references/naming.md`, `functions.md`, `error-handling.md`, `code-structure.md`,
  `immutability.md`, `security.md`, `testing.md`, `boy-scout-rule.md` — cada tema com
  regras, exemplos e refatorações.

## Rules relacionadas

- [021 — Proibição de Duplicação (DRY)](../../rules/021_proibicao-duplicacao-logica.md)
- [022 — Simplicidade e Clareza (KISS)](../../rules/022_priorizacao-simplicidade-clareza.md)
- [023 — Proibição de Funcionalidade Especulativa](../../rules/023_proibicao-funcionalidade-especulativa.md)
- [024 — Proibição de Constantes Mágicas](../../rules/024_proibicao-constantes-magicas.md)
- [026 — Qualidade de Comentários](../../rules/026_qualidade-comentarios-porque.md)
- [027 — Tratamento de Erros de Domínio](../../rules/027_qualidade-tratamento-erros-dominio.md)
- [028 — Tratamento de Exceção Assíncrona](../../rules/028_tratamento-excecao-assincrona.md)
- [029 — Imutabilidade de Objetos](../../rules/029_imutabilidade-objetos-freeze.md)
- [030 — Proibição de Funções Inseguras](../../rules/030_proibicao-funcoes-inseguras.md)
- [031 — Proibição de Imports Relativos](../../rules/031_restricao-imports-relativos.md)
- [032 — Cobertura Mínima de Teste](../../rules/032_cobertura-teste-minima-qualidade.md)
- [033 — Limite de Parâmetros por Função](../../rules/033_limite-parametros-funcao.md)
- [034 — Nomes Consistentes](../../rules/034_nomes-classes-metodos-consistentes.md)
- [035 — Proibição de Nomes Enganosos](../../rules/035_proibicao-nomes-enganosos.md)
- [036 — Restrição de Efeitos Colaterais](../../rules/036_restricao-funcoes-efeitos-colaterais.md)
- [037 — Proibição de Argumentos Sinalizadores](../../rules/037_proibicao-argumentos-sinalizadores.md)
- [038 — Separação Command-Query](../../rules/038_conformidade-principio-inversao-consulta.md)
- [039 — Regra do Escoteiro](../../rules/039_regra-escoteiro-refatoracao-continua.md)

## Skills relacionadas

- [prose](../prose/SKILL.md): complements — a mesma disciplina de honestidade e concretude, aplicada à prosa.
- [calisthenics](../calisthenics/SKILL.md): reinforces — as 9 regras são o treino prático destas práticas.
- [solid](../solid/SKILL.md): reinforces — a fundação de design sobre a qual Clean Code se apoia.
- [anti-pattern](../anti-pattern/SKILL.md): complements — o catálogo do que acontece quando estas práticas faltam.
- [codetags](../codetags/SKILL.md): complements — registra a pendência que a Regra do Escoteiro decidiu não resolver agora.
- [complexity](../complexity/SKILL.md): complements — a métrica objetiva ao lado do julgamento qualitativo.

---

**Criado em**: 2026-04-01
**Atualizado em**: 2026-08-09
**Versão**: 2.0
