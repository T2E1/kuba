---
description: "Cria um artefato novo em .claude/ — rule, skill, agent ou command — decidindo a camada, preparando o terreno e validando o resultado. Usar ao acrescentar uma restrição, um procedimento, um ofício ou um fluxo ao ferramental do repositório."
argument-hint: "[o que você quer que passe a existir]"
allowed-tools: Bash(ls *), Bash(find *), Bash(grep *), Bash(mkdir *), Bash(python3 *), Bash(git status), Read, Write, Edit, Glob, Grep
---

## Propósito

Acrescenta uma peça ao ferramental que estende o Claude Code neste repositório. A decisão
que mais importa vem primeiro e não é sobre forma: **a qual das quatro camadas a ideia
pertence.** Errar aí produz um artefato que duplica outro, e os dois divergem em silêncio.

O que criar: **$ARGUMENTS**

Rules existentes, e o próximo número livre por faixa:
!`python3 -c "
import os,re
d=os.path.join(os.popen('git rev-parse --show-toplevel').read().strip(),'.claude/rules')
n=sorted(int(f[:3]) for f in os.listdir(d) if re.match(r'\d{3}_',f))
for a,b,t in [(1,9,'Calisthenics'),(10,14,'SOLID'),(15,20,'Pacote'),(21,39,'Clean Code'),(40,51,'Twelve-Factor'),(52,70,'Anti-patterns')]:
    livres=[x for x in range(a,b+1) if x not in n]
    print(f'{a:03d}-{b:03d} {t:15} livres: ' + (', '.join(f'{x:03d}' for x in livres) if livres else 'nenhum'))
print(f'acima de 070    livre a partir de {max(n)+1:03d}')"`

Skills existentes:
!`ls "$(git rev-parse --show-toplevel)/.claude/skills"`

Agents e cores em uso:
!`grep -h '^color:' "$(git rev-parse --show-toplevel)"/.claude/agents/*.md | sed 's/color: //' | sort | tr '\n' ' '`

## Fluxo

| # | Agent | Recebe | Entrega |
|---|---|---|---|
| — | nenhum | — | — |

**Este é o único command sem agent, e a razão é que o ofício não existe.** Os dez ofícios
tratam do produto: código, aparência, teste, documentação, release, infraestrutura. Nenhum
escreve o ferramental.

O julgamento — a que camada pertence, se o critério é verificável por terceiro — vem da
skill [standard](../skills/standard/SKILL.md), carregada no passo 1. O command não carrega
tabela de decisão nenhuma: ele prepara o terreno, e verifica o que saiu.

Se um dia isto virar trabalho frequente o bastante para ter dono, o ofício se justifica, e
este command passa a acioná-lo. Enquanto for episódico, um décimo agent só diluiria a
escolha entre os nove que resolvem o produto.

## Instruções

1. **Carregar a skill `standard`.** Ela traz a árvore que decide a camada, os quatro
   references e o validador. Sem ela, o resto é chute com boa aparência.

2. **Exigir o problema, não a solução.** Se `$ARGUMENTS` já vem como "criar uma rule para
   X", pergunte o que acontece hoje que não deveria — a camada se decide pelo problema. É
   comum alguém pedir rule quando o que falta é skill.

3. **Decidir a camada** pela árvore da skill. Registre a escolha em uma frase, com a razão:
   ela vai para a mensagem de commit, e é o que permite contestar depois.

4. **Ler o reference da camada inteiro**, e **um artefato irmão**. A forma nova imita a
   existente; o reference diz o que é obrigatório.

5. **Escrever o artefato** no caminho da camada:
   - rule → `rules/NNN_titulo-kebab.md`, número da faixa do tema listada acima
   - skill → `skills/<nome>/SKILL.md`, mais `examples/` com ao menos um par
   - agent → `agents/<oficio>.md`, com cor fora da lista acima
   - command → `commands/<verbo>.md`

6. **Nomear pela skill `naming`** — substantivo singular para o que é uma coisa, verbo para
   command. O nome precisa dizer a natureza sem mentir.

7. **Validar**, de `.claude/`:
   `python3 skills/standard/scripts/validate.py`
   Vermelho encerra: corrigir antes de reportar pronto.

8. **Ligar o artefato ao que já existe.** Rule cita rules em `Related to`; skill cita
   rules e skills; agent cita as skills que carrega. Artefato sem vínculo é órfão, e
   órfão não é encontrado quando importa.

9. **Relatar** o caminho, a camada escolhida com a razão, e o que ficou de fora.

## Observações

- **Este fluxo não commita.** Terminar aqui e disparar `/ship` mantém revisão e versão no
  lugar delas.
- Um artefato por vez. A camada de um não decide a do outro.
- Rule nova entra na faixa do tema. Todas as seis estão cheias hoje: uma rule fora dos
  temas existentes é sinal para reler a árvore — quase sempre é skill.
- Camada nova — uma quinta pasta em `.claude/` — não sai daqui. Exige problema concreto
  que as quatro não cobrem, e é decisão de arquitetura, não de fluxo.

---

**Criado em**: 2026-08-11
**Atualizado em**: 2026-08-11
**Versão**: 1.0
