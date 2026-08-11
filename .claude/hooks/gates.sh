#!/usr/bin/env bash
#
# Os portões que o trabalho precisa passar para o turno fechar.
#
# Registrado no evento `Stop` (ver `settings.json`), então roda quando o turno acaba. Se o
# que mudou não passa nas verificações que já existem no repositório, devolve o turno em
# vez de deixar a resposta sair — corrigir antes de alguém ler custa menos que depois.
#
# O hook não decide nada por conta própria: cada portão é um comando do projeto, e o
# veredito é o exit code dele. Julgar se um TODO é legítimo ou se falta um arquivo exige
# leitura, e quem lê é o `reviewer`.
#
# Como ele conversa com o Claude Code:
#   exit 0  →  o turno fecha
#   exit 2  →  o turno volta, e o stderr chega como contexto
#
# Insistência: enquanto a lista de portões falhando muda, houve progresso e vale devolver
# de novo. Três rodadas com a mesma lista encerram o bloqueio — o que trava aí não é falta
# de mais uma tentativa, e insistir viraria laço.

set -uo pipefail

claude=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
root=$(dirname "$claude")
cd "$root" || exit 0

# Onde a rodada anterior fica guardada. O nome deriva do caminho do repositório para que
# dois projetos abertos ao mesmo tempo não se sobrescrevam.
state="${TMPDIR:-/tmp}/claude-stop-$(echo "$root" | md5sum | cut -c1-8)"
max_rounds=3

failed=""   # um motivo por linha
details=""  # o fim da saída de cada comando que falhou

# ── 1. Rodar os portões ────────────────────────────────────────────────────────────────
# Um portão só roda se a área dele tem mudança pendente: turno que mexeu apenas em `docs/`
# não paga o preço da suíte de testes.

changed() {
  [ -n "$(git status --porcelain -- "$1")" ]
}

gate() { # <área> <motivo, quando falha> <comando...>
  local area=$1 reason=$2
  shift 2

  changed "$area" || return 0

  local log
  log=$("$@" 2>&1) && return 0

  failed+="$reason"$'\n'
  details+=$'\n\n'"$(tail -n 10 <<<"$log")"
}

gate packages/ "os testes não passam"                bun run test
gate packages/ "o linter acusa erro"                 bun run lint
gate .claude/  "o .claude/ quebra o próprio padrão"  \
  python3 "$claude/skills/standard/scripts/validate.py"

# ── 2. Passou tudo? O turno fecha ──────────────────────────────────────────────────────
# Apagar o estado é o que permite ao próximo problema começar do zero, com as três rodadas
# inteiras à disposição.

if [ -z "$failed" ]; then
  rm -f "$state"
  exit 0
fi

# ── 3. É a mesma lista da rodada anterior? ─────────────────────────────────────────────
# Lista diferente significa que algo foi resolvido, então o contador recomeça. Igual
# significa parado, e a terceira parada encerra o bloqueio.

# A lista vira uma linha só, para caber no arquivo de estado e comparar sem ambiguidade.
signature=$(tr '\n' ' ' <<<"$failed")
round=1
[ -f "$state" ] && [ "$(head -1 "$state")" = "$signature" ] && round=$(( $(tail -1 "$state") + 1 ))
printf '%s\n%s\n' "$signature" "$round" > "$state"

[ "$round" -ge "$max_rounds" ] && exit 0

# ── 4. Devolver o turno ────────────────────────────────────────────────────────────────
# O stderr inteiro chega como contexto. A lista vem primeiro, porque é o que orienta a
# próxima ação; a saída bruta dos comandos vem depois, para quem precisar do detalhe.

{
  echo "Isto ainda não está pronto:"
  echo
  sed '/^$/d; s/^/  · /' <<<"$failed"
  echo "Continue até fechar. Se algum item não puder ser resolvido, resolva os outros e"
  echo "diga qual ficou e por quê — silêncio sobre o que faltou é o pior modo de falhar."
  echo "$details"
} >&2

exit 2
