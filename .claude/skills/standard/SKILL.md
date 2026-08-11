---
name: standard
model: opus
description: A forma dos artefatos que estendem o Claude Code neste repositório — rule, skill, agent e command. Diz a que camada uma ideia pertence, que seções e metadados cada artefato exige, e traz o validador que reprova o que sai da forma. Use ao criar ou revisar uma rule, uma skill, um agent ou um command, ao decidir se algo é limite, procedimento, ofício ou fluxo, e antes de commitar qualquer mudança em `.claude/`. Não use para o conteúdo do artefato — a forma é aqui, o assunto é da camada.
---

# Standard

## O que é

A especificação de forma das quatro camadas de `.claude/`, e o validador que a verifica.

Cada camada tem um reference próprio, íntegro e detalhado. Este arquivo é o que decide
**a qual delas** uma ideia pertence — a decisão que, errada, produz a duplicação que todas
as quatro proíbem.

| Camada | Responde | Reference |
|---|---|---|
| **rule** | O que é proibido | [rule.md](references/rule.md) |
| **skill** | Como se faz | [skill.md](references/skill.md) |
| **agent** | Quem faz, com que julgamento | [agent.md](references/agent.md) |
| **command** | Em que ordem, e o que roda entre as etapas | [command.md](references/command.md) |

**A rule exige, a skill executa, o agent decide, o command sequencia.**

## Quando usar

| Situação | Ação |
|---|---|
| Criando rule, skill, agent ou command | Ler o reference da camada antes de escrever |
| Não sei a que camada a ideia pertence | Aplicar a árvore abaixo |
| Alterando um artefato existente | Rodar o validador antes de commitar |
| Revisando `.claude/` em pull request | Rodar o validador; ele cobre as quatro |
| Escrevendo o conteúdo do artefato | ❌ Não é aqui — a forma é aqui, o assunto é da camada |
| Nomeando o artefato | Complementar — a skill `naming` dá o critério de nome |

## Como aplicar

1. **Decidir a camada** pela árvore abaixo. Errar aqui custa mais que errar a forma:
   um artefato na camada errada duplica outro, e os dois divergem em silêncio.
2. **Ler o reference correspondente** inteiro. Cada um traz as seções obrigatórias, os
   metadados, a convenção de idioma e as armadilhas próprias da camada.
3. **Ler um artefato irmão** da mesma camada. A forma nova imita a existente.
4. **Escrever**, seguindo a ordem de seções do reference — a ordem é verificada.
5. **Rodar o validador**, de `.claude/`:
   `python3 skills/standard/scripts/validate.py`
   Sem argumento roda as cinco checagens; com o nome de uma camada roda só ela.
6. **Ler o que o validador não alcança.** Cada reference termina dizendo o que exige
   leitura humana — e é sempre o critério que decide se o artefato serve.

### A qual camada isto pertence

```
É um limite que vale sempre, e dá para verificar objetivamente?
    → rule          ex.: "no máximo 3 parâmetros"

É um procedimento, um catálogo, algo que precisa de exemplo para se entender?
    → skill         ex.: como nomear um Symbol

Tem julgamento próprio, e um profissional real assinaria?
    → agent         ex.: o QA que decide o que vale ser testado

É uma sequência fixa que a pessoa dispara?
    → command       ex.: revisar, versionar e enviar

Deve rodar sozinho, sem ninguém pedir?
    → nenhuma — é infraestrutura: hook, pre-commit, CI
```

O sintoma de camada errada é sempre o mesmo: **a mesma tabela de decisão em dois lugares.**
Um command com tabela de impacto de versão duplica o `releaser`. Um agent que ensina
sintaxe duplica uma skill. Quando as duas divergem, ninguém percebe até uma delas dar a
resposta errada.

### O que o validador cobre

| Camada | Checagens |
|---|---|
| `rules` | 12 — seções na ordem, ID coerente com Category, Severity, datas, exceção nomeada, relação declarada, IDs únicos |
| `skills` | 12 — frontmatter de três campos, model, tamanho, pares `valid`/`invalid`, tabela de modelos sincronizada |
| `agents` | 9 — cinco campos, model sem `haiku`, cor única, oito seções na ordem, resíduo de fluxo |
| `commands` | 5 — description, seções, rodapé, comando `!` ancorado, agent existente |
| `links` | Todo link relativo, em todo `.md` de `.claude/` |

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| A ideia na camada certa versus duplicada em duas | [layer-choice.valid.md](examples/layer-choice.valid.md) | [layer-choice.invalid.md](examples/layer-choice.invalid.md) |

## Checklist

- [ ] A camada foi escolhida pela árvore, não por hábito
- [ ] O reference da camada foi lido inteiro
- [ ] Um artefato irmão foi lido antes de escrever
- [ ] As seções estão presentes e na ordem que o reference define
- [ ] Nenhuma tabela de decisão duplica a de outro artefato
- [ ] O rodapé traz Criado em / Atualizado em / Versão
- [ ] `python3 skills/standard/scripts/validate.py` sai com código 0
- [ ] O que o validador não alcança foi lido e conferido

## Troubleshooting

### O validador passa mas o artefato não serve

**Causa:** ele verifica forma, não conteúdo. Um `Objective Criteria` que ninguém consegue
verificar passa; um `## Método` com passos vagos passa.
**Solução:** o critério humano de cada camada está no fim do reference. É o que decide se
o artefato serve, e nenhuma regex o mede.

### Mudei o padrão e o validador continua aprovando

**Causa:** o script não é extraído do markdown — alterar o reference é metade da mudança.
**Solução:** ajustar `scripts/validate.py` junto. É deliberado que sejam dois passos: um
validador derivado do texto silencia justamente quando o texto muda de forma.

### A ideia parece caber em duas camadas

**Causa:** normalmente é uma ideia só, expressa em dois níveis — o limite e o modo de
cumpri-lo.
**Solução:** são dois artefatos, não um. O limite vira rule, o modo vira skill, e a skill
cita a rule na seção `Rules relacionadas`. É o par mais comum do repositório.

## Referências

- `references/rule.md` — as seis seções, as faixas de numeração por tema, a convenção
  bilíngue e o vocabulário de relação.
- `references/skill.md` — a estrutura de pastas, o frontmatter de três campos, e a
  semântica de `model`, que vale até o fim do turno e não só enquanto a skill é lida.
- `references/agent.md` — os oito blocos, a proibição de fluxo entre agents, e por que
  `tools` restrito é o que torna um anti-objetivo verificável.
- `references/command.md` — a tabela de `## Fluxo`, o contexto com `!` e por que caminho
  relativo quebra fora da raiz.

## Rules relacionadas

- [021 — Proibição de Duplicação](../../rules/021_proibicao-duplicacao-logica.md): a mesma tabela em dois artefatos é a violação que a escolha de camada evita.
- [010 — Responsabilidade Única](../../rules/010_principio-responsabilidade-unica.md): um artefato, uma razão para mudar — vale para rule, skill, agent e command.
- [035 — Proibição de Nomes Enganosos](../../rules/035_proibicao-nomes-enganosos.md): o artefato precisa ser o que o nome e a camada prometem.
- [026 — Comentário Explica o Porquê](../../rules/026_qualidade-comentarios-porque.md): o reference diz por que a forma é assim, não só qual é.
- [064 — Proibição de Overengineering](../../rules/064_proibicao-overengineering.md): camada nova exige problema concreto; quatro cobrem o que existe.

## Skills relacionadas

- [naming](../naming/SKILL.md): depends on — o nome do artefato segue o mesmo critério dos nomes de código.
- [prose](../prose/SKILL.md): reinforces — o texto do artefato é lido por alguém, e responde às mesmas regras.
- [colocation](../colocation/SKILL.md): complements — decide onde o arquivo mora; esta decide que forma ele tem.
- [codetags](../codetags/SKILL.md): complements — registra a divergência de forma que não será corrigida agora.

---

**Criado em**: 2026-08-11
**Atualizado em**: 2026-08-11
**Versão**: 1.0
