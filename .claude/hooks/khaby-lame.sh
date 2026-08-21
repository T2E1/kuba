#!/usr/bin/env bash
#
# Khaby Lame: o vídeo é sempre o mesmo formato — alguém complica um gesto simples com dez
# passos e um gadget, e ele responde sem falar nada, fazendo a mesma coisa com as mãos. A
# piada nunca é a solução; é o quanto do problema já não existia.
#
# Este hook é essa reação, aplicada a pacote nascendo. Registrado no evento `PreToolUse`
# para `Write` (ver `settings.json`), roda no instante anterior a um arquivo nascer, e faz
# a pergunta que o vídeo faz em silêncio: isso precisava mesmo de um pacote novo? A regra é
# parar no primeiro degrau que responder que não.
#
# Não bloqueia nada — ele não é o corte seco do vídeo, é a pausa antes dele. "Isto é
# especulativo?" não tem resposta binária, e negar transformaria heurística em regra. Ele
# injeta contexto: os degraus que têm resposta mecânica vêm respondidos com o inventário
# real do repositório, e os demais vêm como pergunta.
#
# Dispara uma vez por pacote, no primeiro arquivo. Arquivo em pacote que já existe é
# continuação, não decisão — e continuação não precisa de piada.

set -uo pipefail

claude=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
root=$(dirname "$claude")
cd "$root" || exit 0

# ── 1. Que arquivo vai nascer? ─────────────────────────────────────────────────────────
# O primeiro `file_path` do JSON de entrada. `head -1` importa: o conteúdo do arquivo
# também é enviado, e pode conter a mesma chave.

file=$(grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*"\([^"]*\)"$/\1/')
[ -n "$file" ] || exit 0

relative=${file#"$root"/}

# ── 2. Vale interromper? ───────────────────────────────────────────────────────────────
# Só quando um pacote nasce: `src/<categoria>/<nome>/` (elemento consumível) ou
# `packages/<categoria>/<nome>/` (infraestrutura) que ainda não existe. Editar, continuar
# um pacote, mexer em qualquer outro lugar — nada disso é uma decisão nova.

case $relative in
  src/*/*/*|packages/*/*/*) package=$(cut -d/ -f1-3 <<<"$relative") ;;
  *) exit 0 ;;
esac

[ -d "$package" ] && exit 0

# ── 3. Montar a escada ─────────────────────────────────────────────────────────────────
# Os degraus 02 e 05 têm resposta objetiva, e ela é lida do repositório agora — inventário
# desatualizado seria pior que pergunta nenhuma. Os outros são julgamento, e chegam como
# pergunta porque este é o momento em que ainda dá para respondê-las.

# `index`, `types.d` e `interfaces` existem em todo pacote e não são comportamento
# reaproveitável — listá-los só afogaria o que importa.
list() {
  ls "$1" 2>/dev/null | sed 's/\.[jt]s$//;s/\.d$//' |
    grep -vxE 'index|types|interfaces' | sort -u | tr '\n' ' '
}

ladder=$(cat <<TEXT
$package está nascendo, com dez passos e um gadget imaginados antes da primeira linha.
Suba a escada e pare no primeiro degrau que já resolver — a resposta mais simples costuma
estar aí, e o resto era só o vídeo.

01 · Precisa existir agora?
     Necessidade especulativa é para depois (rule 023).

02 · Já existe neste código?
     mixin/      $(list packages/mixin)
     directive/  $(list packages/directive)
     dom/        $(list packages/dom)
     echo/       $(list packages/echo)
     event/      $(list packages/event)
     middleware/ $(list packages/middleware)
     Reaproveitar mixin vem antes de escrever comportamento novo.

03 · A plataforma cobre?
     É a premissa do projeto: o navegador é o runtime, HTML é a API. ElementInternals,
     :state(), Shadow DOM e form association resolvem mais do que parece.

04 · Alguma dependência instalada resolve?
     Runtime: nenhuma, por decisão. Adicionar uma transfere o custo para quem instala
     (rule 067), e essa decisão é do \`architect\`.

05 · Cabe em menos do que você planejou?
     Um elemento pequeno que faz uma coisa, não um configurável que faz várias (rule 064).

Se depois disso o pacote ainda precisa nascer: o fluxo é o \`/craft\` —
\`architect\` decide a forma, \`designer\` a aparência, \`developer\` escreve, \`tester\` prova,
\`writer\` documenta. E leia um vizinho da mesma categoria antes de escrever.
TEXT
)

# ── 4. Devolver como contexto ──────────────────────────────────────────────────────────
# `PreToolUse` lê a decisão do stdout em JSON. O escape fica com o python3 que o validador
# já exige — montar JSON à mão em bash quebra no primeiro caractere especial.

python3 -c 'import json,sys; print(json.dumps({"hookSpecificOutput":{"hookEventName":"PreToolUse","additionalContext":sys.stdin.read()}}))' <<<"$ladder"
