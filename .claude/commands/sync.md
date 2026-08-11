---
description: "Traz o que mudou no remoto para a branch atual, resolvendo a divergência quando houver. Usar antes de começar a trabalhar, e antes de abrir um pull request."
allowed-tools: Bash(git branch *), Bash(git fetch *), Bash(git pull *), Bash(git checkout *), Bash(git merge *), Bash(git status), Bash(git log *), Bash(git stash *), Bash(bun install), Bash(bun run test), Read
---

## Propósito

Deixa a branch atual em dia com o remoto, e verifica que ela continua funcionando depois
disso — trazer commits de outra pessoa pode quebrar o que estava verde.

Branch atual:
!`git branch --show-current`

Estado do working tree:
!`git status --short`

Divergência com o remoto:
!`git fetch --quiet origin && git rev-list --left-right --count origin/main...HEAD`

## Fluxo

| # | Agent | Recebe | Entrega |
|---|---|---|---|
| 1 | `deepdive` | O teste que passou a falhar | A causa raiz, com `arquivo:linha` |

Nenhum agent é acionado no caminho normal: sincronizar é mecânica de git. O `deepdive`
entra apenas quando a suíte quebra **depois** do merge, porque aí a pergunta deixa de ser
"como atualizo" e passa a ser "por que isto quebrou" — que é julgamento, não sequência.

## Instruções

1. **Ler a divergência acima.** A contagem é `atrás  à frente` em relação a `origin/main`.
   Zero atrás significa que não há o que trazer: reporte e encerre.

2. **Proteger trabalho não commitado.** Se o working tree não está limpo, `git stash push`
   antes de qualquer coisa, e lembre de desempilhar no passo 6.

3. **Trazer o remoto**, conforme a branch:
   - **Em `main`:** `git pull origin main`
   - **Em branch de feature:** `git fetch origin`, depois `git merge origin/main` — sem
     trocar de branch, o que evita perder o contexto do editor e é mais rápido.

4. **Resolver conflito, se houver.** Resolva arquivo a arquivo, e depois releia o arquivo
   inteiro: conflito resolvido linha a linha costuma deixar o resultado sintaticamente
   válido e semanticamente errado.

5. **Reinstalar dependências** se `bun.lock` ou `package.json` mudaram no merge —
   `bun install`. Suíte que falha logo após um sync costuma ser dependência defasada, não
   código.

6. **Desempilhar o stash**, se o passo 2 empilhou: `git stash pop`.

7. **Rodar `bun run test`.** É o que prova que a sincronização não quebrou nada.
   - Verde → reportar o que entrou e encerrar.
   - Vermelho → **acionar o `deepdive`** com o teste que falha, e reportar a causa. Não
     corrigir dentro deste fluxo: a correção é trabalho próprio, com escopo próprio.

## Observações

- Este fluxo nunca envia nada. Sem `git push`, sem commit — exceto o commit de merge que o
  git cria sozinho ao resolver conflito.
- Não use `git pull --rebase` em branch já publicada: reescrever histórico que outra
  pessoa tem quebra o repositório dela.
- Suíte vermelha depois do sync não é motivo para desfazer o merge. O código de outra
  pessoa está certo até prova em contrário — a prova é o que o `deepdive` produz.
