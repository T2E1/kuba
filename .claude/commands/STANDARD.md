# Padrão de Commands

Como todo command em `.claude/commands/` deve ser escrito.

Este arquivo não é um command: não tem `## Fluxo`, não aciona agent e não muda nada. É a
especificação de forma dos que são, e mora aqui pela mesma razão que os outros três moram
nas pastas que governam — o padrão fica ao lado do que ele governa.

Uma peculiaridade da camada, que vale conhecer: `rules/`, `skills/` e `agents/` ignoram
arquivo fora da forma que esperam, mas **todo `.md` em `commands/` é registrado**. Este
aparece como `/STANDARD` na lista, e disparar mostra o padrão — inofensivo, e às vezes
conveniente. Nenhum outro arquivo de apoio entra aqui: se precisar de um, ele vai para
`references/` de uma skill, não para esta pasta.

---

## O que é um command

Um **fluxo determinístico que o usuário dispara**. Ele não decide nada: sequencia ofícios
e executa a mecânica entre eles.

É a quarta camada, e a única acionada por quem usa o repositório:

```
command  →  aciona agents  →  que carregam skills
                  ↑
          rules coexistem em tudo
```

| Camada | Responde | Quem aciona |
|---|---|---|
| **rule** | O que é proibido | ninguém — está sempre em contexto |
| **skill** | Como se faz | o agent, quando o contexto pede |
| **agent** | Quem faz, com que julgamento | o command, ou o orquestrador |
| **command** | **Em que ordem, e o que roda entre as etapas** | **o usuário, digitando `/`** |

### A regra que define a camada

**Command não julga.** Se um passo exige decidir — se algo é breaking, que mixin entra na
cadeia, se o teste prova o que diz — esse passo é de um agent, e o command o aciona.

O sintoma de violação é duplicação: uma tabela de decisão dentro do command que também
existe dentro de um agent. As duas divergem, e ninguém percebe até uma delas dar a resposta
errada.

❌ O command traz a tabela de "o que é breaking change"
✅ O command aciona o `releaser`, que tem a tabela

❌ O command explica como nomear um Symbol
✅ O command aciona o `developer`, que carrega a skill `naming`

### Command, agent ou infraestrutura?

| Se… | Vai para |
|---|---|
| É uma sequência fixa que o usuário dispara | **command** |
| Exige julgamento sobre o caso concreto | **agent** |
| Deve rodar sozinho, sem ninguém pedir | **infraestrutura** — hook ou workflow, ofício do `builder` |

Lint e teste não são commands: rodam no `pre-commit` e no CI. Um command que só embrulha
`bun run test` é um alias com custo de manutenção.

## Arquivo

```
<verbo>.md
```

- Nome em **inglês**, palavra única, minúsculas, e **verbo**: o command faz algo.
- Um arquivo por fluxo. Fluxos que divergem no meio são dois commands.

## Frontmatter

```yaml
---
description: "<o que o fluxo faz, em uma frase>. Usar quando <momento>."
argument-hint: "[o-que-o-usuario-passa]"
allowed-tools: <lista mínima>
---
```

- `description` entre aspas, dizendo **o que acontece** e **quando disparar**.
- `argument-hint` só quando o command recebe argumento. O valor chega em `$ARGUMENTS`.
- `allowed-tools` restrito ao necessário. `Bash(git push *)` num command que não publica é
  permissão pendurada.

## Seções do corpo

| Seção | Obrigatória | Conteúdo |
|---|---|---|
| `## Propósito` | ✅ | Uma a três frases: o que o fluxo entrega ao fim |
| Contexto | ✅ | Saída de comando com `!`, injetada antes das instruções |
| `## Fluxo` | ✅ | A sequência de agents, com o que cada um entrega |
| `## Instruções` | ✅ | Passos numerados. A mecânica entre as etapas |
| `## Observações` | — | Restrições e o que nunca fazer |
| Rodapé | ✅ | Criado em / Atualizado em / Versão, como nas outras três camadas |

### Contexto com `!`

Uma linha iniciada por `!` roda o comando e injeta a saída no prompt. É o que torna o
command situado — ele já chega sabendo o estado do repositório:

```markdown
Estado atual:
!`git status --short`
```

**Rodam a partir do diretório atual, não da raiz do repositório.** O usuário pode disparar
o command de qualquer lugar, e caminho relativo quebra fora da raiz — foi o que aconteceu
com `node -p "require('./package.json').version"`, que falhava quando o cwd era
`.claude/rules/`.

Comando `git` é seguro: ele sobe a árvore até encontrar o `.git`. Qualquer outro precisa
ancorar o caminho:

```
!`ls "$(git rev-parse --show-toplevel)/packages/"`
```

### `## Fluxo`

A tabela que torna a camada visível. Cada linha é um ofício acionado, o que ele recebe e o
que devolve:

```markdown
| # | Agent | Recebe | Entrega |
|---|---|---|---|
| 1 | `architect` | O comportamento esperado | A forma: categoria, mixins, contrato |
| 2 | `developer` | A forma decidida | O código em `packages/` |
```

Agent que não é acionado não entra na tabela. Etapa sem agent — rodar um script, escrever
um arquivo — aparece nas instruções, não aqui.

### `## Instruções`

Passos numerados, imperativos, verificáveis. O que o command faz **entre** as chamadas de
agent: preparar arquivo, rodar comando, conferir resultado, reportar.

Um passo que diz "avaliar se…" é julgamento disfarçado. Reescreva como chamada de agent.

## Escrita

- **Sem tabela de decisão.** Ela mora no agent.
- **Sem convenção ensinada.** Ela mora na skill.
- **Sem `git add -A`.** Arquivo entra por escolha, não por varredura.
- **Caminhos e comandos exatos.** `bun run test`, `packages/<categoria>/<nome>/`.

## Verificação

Antes de commitar um command novo ou alterado:

- `description` entre aspas, com o que faz e quando usar
- `allowed-tools` sem permissão que o fluxo não exerce
- Todo comando `!` roda de qualquer diretório — caminho não-git ancorado em `git rev-parse`
- `## Fluxo` presente, com agents que existem em `../agents/`
- Nenhuma tabela de decisão que duplique a de um agent
- Nenhum passo de `## Instruções` que exija julgamento
- Rodapé presente, com a data da alteração

Rodar de `.claude/`:

Este script roda automaticamente a cada prompt, pelo hook `UserPromptSubmit` — ver
`hooks/validate.py`. Rodá-lo à mão só é necessário para conferir uma correção na hora.

```bash
for f in commands/*.md; do
  [ "$(basename "$f")" = "STANDARD.md" ] && continue   # o padrão não é um command
  grep -q '^description: "' "$f" || echo "$f: description sem aspas"
  for s in "## Propósito" "## Fluxo" "## Instruções"; do
    grep -q "^$s" "$f" || echo "$f falta: $s"
  done
  # comando ! com caminho relativo quebra fora da raiz; git e rev-parse são seguros
  grep -oE '^!`[^`]+`' "$f" | grep -vE '^!`git |rev-parse' &&
    echo "$f: comando ! com caminho não ancorado"
  grep -q '^\*\*Criado em\*\*' "$f" || echo "$f: sem rodapé"
  # agent citado precisa existir
  grep -oE '`(architect|builder|deepdive|designer|developer|releaser|reviewer|tester|writer)`' "$f" |
    tr -d '`' | sort -u | while read a; do
      [ -f "agents/$a.md" ] || echo "$f: agent inexistente '$a'"; done
done
echo "commands verificados"
```

---

**Criado em**: 2026-08-10
**Atualizado em**: 2026-08-10
**Versão**: 1.0
