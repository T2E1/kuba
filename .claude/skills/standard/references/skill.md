# Padrão de Skills

Como toda skill em `.claude/skills/` deve ser escrita. Derivado de *The Complete
Guide to Building Skills for Claude* (Anthropic) e de
https://code.claude.com/docs/en/skills.

Este arquivo vive na raiz de `skills/`, **nunca dentro** de uma pasta de skill —
o guia proíbe `README.md` dentro do diretório da skill.

---

## Estrutura de arquivos

```
<nome>/
├── SKILL.md               # obrigatório — exatamente este nome, case-sensitive
├── examples/              # código de exemplo, um arquivo por caso
│   ├── <tema>.valid.js
│   └── <tema>.invalid.js
├── references/            # aprofundamento, carregado sob demanda
│   └── <tema>.md
├── scripts/               # opcional — código executável
└── assets/                # opcional — templates, fontes, ícones
```

Regras invioláveis:

- O arquivo principal é `SKILL.md` — não `skill.md`, não `SKILL.MD`.
- Sem `README.md` dentro da pasta da skill. Documentação vai em `SKILL.md` ou `references/`.
- `SKILL.md` abaixo de 5.000 palavras. O que passar disso vai para `references/`.
- **Nenhum bloco de código no `SKILL.md`.** Todo exemplo vive em `examples/`.
  Blocos cercados continuam permitidos para o que **não é código**: diagramas ASCII,
  árvores de decisão, fórmulas, notação de sintaxe e estruturas de diretório. A
  distinção é se aquilo poderia ser executado ou lintado — se sim, é `examples/`.

## `examples/`

Código não mora no `SKILL.md`. Mora em `examples/`, um arquivo por caso, com a
extensão real da linguagem — assim o exemplo é lintado, destacado pelo editor e pode
ser aberto, executado e corrigido como código de verdade.

Convenção de nome:

| Arquivo | Conteúdo |
|---|---|
| `<tema>.valid.js` | A forma correta. O que copiar. |
| `<tema>.invalid.js` | A forma errada, com o comentário do porquê. O que reconhecer e substituir. |

- Um par `valid`/`invalid` por conceito distinto — não um arquivo gigante com tudo.
- `<tema>` em kebab-case, descrevendo o conceito: `guard-clause`, `value-object`,
  `parameter-object`, `argtypes-from-types`.
- Skills sem código (`adr`, `arc42`, `c4-model`, `bdd`) usam `.md` na mesma convenção.
- O arquivo `.invalid` abre com um comentário de uma linha dizendo qual rule ou regra
  ele viola, e o `.valid` correspondente é citado logo abaixo.

A pasta é feita para crescer. Quando um caso novo aparecer no code review, ele vira mais
um par de arquivos aqui — sem tocar o `SKILL.md`.

No `SKILL.md`, a seção `## Exemplos` vira uma tabela apontando para os arquivos:

```markdown
## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Guard clause no lugar de else | [guard-clause.valid.js](examples/guard-clause.valid.js) | [guard-clause.invalid.js](examples/guard-clause.invalid.js) |
| Value Object para primitivo de domínio | [value-object.valid.js](examples/value-object.valid.js) | [value-object.invalid.js](examples/value-object.invalid.js) |
```

## Nomenclatura

- `kebab-case`, sem espaços, sem underscore, sem maiúsculas.
- `name:` no frontmatter **igual** ao nome da pasta.
- **Palavra única** sempre que o conceito for único: `solid`, `mixin`, `token`, `render`.
- Hífen apenas quando o conceito é genuinamente composto: `c4-model`, `anti-pattern`,
  `clean-code`, `twelve-factor`, `big-o`.
- Proibido conter `claude` ou `anthropic` (reservados).

## Frontmatter

```yaml
---
name: <igual ao nome da pasta>
model: <haiku | sonnet | opus>
description: <o que faz> Use quando <gatilhos>. Não use para <escopo excluído>.
---
```

**Apenas estes três campos.** O Claude Code aceita outros — `when_to_use`,
`allowed-tools`, `paths`, `effort`, `context`, `hooks`, `metadata` — e a restrição aqui é
deliberada, não desconhecimento: cada campo extra é mais uma coisa a manter sincronizada
em 38 arquivos. Um campo novo entra quando houver um problema concreto que ele resolva.

`description` é o primeiro nível do *progressive disclosure* — é a única coisa
sempre carregada no system prompt, e é por ela que a skill é escolhida.

- Menos de 1024 caracteres. É o limite da spec [Agent Skills](https://agentskills.io),
  mais estrito que o do Claude Code (que trunca `description` + `when_to_use` em 1.536).
  Seguimos o menor para que as skills continuem válidas fora do Claude Code.
- Deve conter **o que a skill faz** *e* **quando usá-la** (frases-gatilho que o
  usuário realmente diria).
- Sem `<` ou `>` (colchetes angulares são proibidos no frontmatter).
- Mencionar tipos de arquivo quando relevante (`types.d.ts`, `*.test.js`, `.css`).
- Incluir gatilho negativo quando a skill colide com outra (`Não use para X — use a skill Y`).

## `model` — equilíbrio entre custo e qualidade

O campo existe e é aceito pelo Claude Code, mas tem uma semântica que decide tudo:

> *"The override applies for the rest of the current turn."*

O modelo declarado **não vale só enquanto a skill é lida — vale até o fim do turno**.
Uma skill de referência carregada no meio de uma implementação rebaixa o modelo que
escreve o código depois dela. Por isso o critério não é "quão simples é a skill", e sim:

**Quão simples é o trabalho que ainda vem depois de a skill ser carregada?**

Toda skill declara o modelo. Nenhuma fica omissa: a declaração é a decisão registrada.

| Modelo | Quantas | Quando | Skills |
|---|---|---|---|
| `haiku` | 4 | O trabalho é mecânico e verificável — reordenar, marcar. Nenhuma decisão de design pendente. | `alphabetical`, `anatomy`, `revelation`, `codetags` |
| `sonnet` | 18 | Aplicação de convenção conhecida, com julgamento limitado a um arquivo ou componente. | `bracket`, `colocation`, `constructor`, `dataflow`, `enum`, `event`, `getter`, `jsdoc`, `method`, `mixin`, `naming`, `preview`, `prose`, `render`, `setter`, `state`, `token`, `types` |
| `opus` | 18 | Julgamento arquitetural, trade-off entre princípios, diagnóstico. Rebaixar aqui custa qualidade na decisão **e** no código que vem depois dela. | `adr`, `anti-pattern`, `arc42`, `bdd`, `big-o`, `c4-model`, `calisthenics`, `cdd`, `clean-code`, `complexity`, `gof`, `lld`, `package`, `poeaa`, `quality`, `solid`, `standard`, `twelve-factor` |

Na dúvida, **`opus`**. O custo de um turno mais caro é menor que o de uma decisão de
arquitetura tomada com menos capacidade.

O `opus` explícito também **sobe** o modelo quando a sessão está num mais barato: carregar
`solid` numa sessão em Sonnet promove o resto do turno para Opus. É intencional — decisão
de arquitetura não deve depender de onde a sessão começou.

### Os outros dois campos de custo

- `effort: low | medium | high` — reduz o esforço de raciocínio sem trocar de modelo.
  Mesma semântica de turno; é o ajuste mais fino quando `haiku` seria demais.
- `context: fork` — roda a skill num subagente. Combinado com `model`, é a única forma
  de rebaixar **sem** afetar o turno principal. Só faz sentido quando a skill produz um
  resultado fechado, não quando a convenção precisa ficar em contexto enquanto se escreve.

## Seções do corpo

Toda skill segue esta ordem. Seções sem conteúdo real são omitidas, não preenchidas
com texto vazio.

| Seção | Obrigatória | Conteúdo |
|-------|-------------|----------|
| `# Título` | ✅ | Nome legível da skill |
| `## O que é` | ✅ | Uma a três frases. Definição direta, sem preâmbulo |
| `## Quando usar` | ✅ | Tabela situação → ação, mais os casos em que **não** se aplica |
| `## Como aplicar` | ✅ | Passos numerados, imperativos, verificáveis |
| `## Exemplos` | ✅ | Tabela apontando para os pares em `examples/` — sem código inline |
| `## Checklist` | ✅ | Itens marcáveis a verificar antes de dar por pronto |
| `## Troubleshooting` | — | Sintoma → Causa → Solução, para erros recorrentes |
| `## Referências` | — | Cada `references/*.md` com o que traz e quando abrir |
| `## Rules relacionadas` | ✅ | Links reais para `../../rules/NNN_*.md` |
| `## Skills relacionadas` | ✅ | Cross-reference com relação declarada |
| Rodapé | ✅ | Criado em / Atualizado em / Versão |

## Rules relacionadas

É o que separa uma skill deste repositório de uma skill genérica: a skill **executa**
o que a rule **exige**. Cada item declara a rule e explica como ela sustenta a skill.

```markdown
## Rules relacionadas

- [010 — Princípio da Responsabilidade Única](../../../rules/010_principio-responsabilidade-unica.md):
  a skill operacionaliza o limite de 7 métodos públicos ao dividir a classe.
- [024 — Proibição de Constantes Mágicas](../../../rules/024_proibicao-constantes-magicas.md):
  todo literal de estilo vira token nomeado.
```

Os links devem apontar para arquivos que existem. Verificar antes de commitar.

## Skills relacionadas

Mesmo vocabulário de relação usado nas rules:

- `reinforces` — a outra skill reforça esta no mesmo eixo.
- `complements` — a outra skill cobre a face oposta do mesmo problema.
- `depends on` — esta skill pressupõe a outra aplicada antes.
- `supersedes` — esta skill substitui a outra no caso citado.

```markdown
## Skills relacionadas

- [calisthenics](../../calisthenics/SKILL.md): reinforces — as 9 regras dão a forma concreta.
- [complexity](../../complexity/SKILL.md): depends on — medir CC antes de refatorar.
```

## Escrita das instruções

- **Específico e acionável.** `Rode bun run lint e corrija cada erro de
  noExcessiveCognitiveComplexity` — não `valide o código`.
- **Instruções críticas no topo.** O que não pode ser esquecido vem antes do detalhe.
- **Sem ambiguidade.** Números, nomes de arquivo, comandos exatos.
- **Progressive disclosure.** `SKILL.md` fica com o núcleo; o aprofundamento vai para
  `references/` e é citado explicitamente:
  `Antes de nomear, leia references/niveis.md para o catálogo completo.`

## Rodapé

```markdown
---

**Criado em**: AAAA-MM-DD
**Atualizado em**: AAAA-MM-DD
**Versão**: 1.0
```

## Verificação

O padrão inteiro é verificável por script — não há item aqui que dependa de julgamento.
Rode antes de commitar uma skill nova ou alterada.

### O que é verificado

| Item | Critério |
|---|---|
| `name` | Igual ao nome da pasta |
| `model` | Presente, e entre `haiku`, `sonnet`, `opus` |
| Frontmatter | Exatamente os três campos; nenhum a mais, nenhum a menos |
| `description` | Abaixo de 1024 caracteres, sem `<` nem `>` |
| Seções | As sete obrigatórias, mais o rodapé e o título |
| Código | Nenhum bloco executável no `SKILL.md` |
| Tamanho | `SKILL.md` abaixo de 5.000 palavras |
| Nome da pasta | kebab-case; sem `claude` nem `anthropic` |
| `README.md` | Ausente de dentro da pasta |
| `examples/` | Existe, e todo tema tem o par `valid` **e** `invalid` |
| Links | Resolvem — **em todos os arquivos, não só no `SKILL.md`** |
| Tabela de modelos | O que este arquivo declara bate com o que as skills declaram |

### Duas armadilhas que o script trata

**A profundidade do `../` muda com o diretório**, e é onde os erros acontecem:

| De | Para `rules/` | Para outra skill |
|---|---|---|
| `<skill>/SKILL.md` | `../../rules/NNN_*.md` | `../<outra>/SKILL.md` |
| `<skill>/references/*.md` | `../../../rules/NNN_*.md` | `../../<outra>/SKILL.md` |
| `<skill>/examples/*` | `../../../rules/NNN_*.md` | `../../<outra>/SKILL.md` |

Copiar um link do `SKILL.md` para dentro de `references/` sem acrescentar o nível quebrou
69 links antes desta verificação existir.

**Bracket notation parece link.** `` `this[sink](payload)` `` casa com a sintaxe de link do
markdown, então o script ignora blocos cercados e código inline — sem isso, `dataflow` e
`naming` acusam falso positivo.

Placeholder de template também não é link: `ADR-001_[titulo].md` nunca vai existir com esse
nome. Escreva como código inline.

### O script

Rodar de `.claude/`. Cobre skills e agents de uma vez, porque os dois erram igual.

O validador vive em [`../scripts/validate.py`](../scripts/validate.py), não aqui: um
script extraído de markdown silencia quando o markdown muda de forma. Rodar de `.claude/`:

    python3 skills/standard/scripts/validate.py skills

---

**Criado em**: 2026-08-09
**Atualizado em**: 2026-08-10
**Versão**: 1.4
