# Padrão de Agents

Como todo agent em `.claude/agents/` deve ser escrito.

Este arquivo não é um agent: não tem `name`, não é invocável e não aparece na lista de
subagentes. É a especificação de forma dos que são.

---

## O que é um agent

Um **ofício**. O conjunto de processos e boas práticas de um profissional real —
arquiteto, engenheiro, designer, QA, pesquisador — reduzido a instruções executáveis
neste repositório.

Um agent responde a três perguntas, e é a resposta a elas que o distingue de uma skill:

1. **Quem ele é** — o profissional cujo julgamento ele reproduz.
2. **O que ele não faz** — a fronteira que impede um agent de virar todos os agents.
3. **O que ele entrega** — o artefato concreto ao fim do trabalho.

### Agent, skill ou rule?

As três camadas se empilham, e confundi-las é o erro que este arquivo existe para evitar:

| Camada | Responde | Exemplo |
|---|---|---|
| **rule** | *O que é proibido* | "Métodos com no máximo **3** parâmetros" |
| **skill** | *Como se faz* | Como nomear um Symbol; como demonstrar um componente |
| **agent** | *Quem faz, com que método* | O QA que decide o que testar e quando reprovar |

A rule **exige**, a skill **executa**, o agent **decide**. Um agent que ensina sintaxe
está fazendo trabalho de skill; uma skill que define papel está fazendo trabalho de agent.

## Sem fluxo

Nenhum agent conhece outro agent como etapa seguinte. Não há sequência fixa, não há
handoff, não há contador de tentativas, não há diretório de contexto compartilhado.

**O agente principal — a sessão com quem o usuário conversa — é o orquestrador.** Ele
decide quem chamar, com que escopo e em que ordem. Cada agent é chamável isoladamente e
precisa funcionar sem que nenhum outro tenha rodado antes.

Consequências diretas na escrita:

- ❌ "Encaminhar ao @tester" → ✅ "Reportar o veredito"
- ❌ "Ler `changes/00X/specs.md`" → ✅ "Ler o escopo recebido"
- ❌ "Máximo 3 iterações; após isso escalar" → ✅ (nada — quem decide reiterar é o orquestrador)
- ❌ "Sequência: @architect → @developer → @tester" → ✅ (nada)

Um agent **pode** recomendar que outro ofício seja acionado — "isto precisa de decisão
arquitetural antes de implementar" —, mas quem aciona é o orquestrador.

## Arquivo

```
<oficio>.md
```

- Nome em **inglês**, palavra única, minúsculas: `architect.md`, `developer.md`.
- `name:` no frontmatter igual ao nome do arquivo sem extensão.
- Um arquivo por ofício. Um ofício que precisa de dois arquivos são dois ofícios.

## Idioma

Mesma convenção bilíngue das rules e skills, com uma diferença: aqui os **cabeçalhos de
seção são em português**, porque não há esqueleto compartilhado com ferramenta externa a
preservar — o que se pesquisa em agents é o conteúdo, não a forma.

| Elemento | Idioma |
|---|---|
| Nome do arquivo e `name:` | Inglês |
| Cabeçalhos de seção | Português |
| Corpo | Português |
| Identificadores, comandos, caminhos | Como são no código |

## Frontmatter

```yaml
---
name: <igual ao nome do arquivo>
description: <o ofício em uma frase> Use quando <gatilhos>. Não use para <escopo excluído>.
model: <sonnet | opus>
tools: Read, Write, Edit, Bash, Glob, Grep
color: <cor>
---
```

- `description` é o que faz o orquestrador escolher este agent e não outro. Precisa do
  ofício **e** dos gatilhos, como nas skills.
- `tools` declarado explicitamente. Um agent que não escreve arquivos não recebe `Write`
  nem `Edit` — a restrição é o que torna o anti-objetivo verificável em vez de decorativo.
- `color` distingue o agent no output. Uma cor por agent, sem repetir.
- Sem `haiku`: todo agent decide algo. O modelo mais barato serve a skills mecânicas,
  não a ofícios.

## Seções do corpo

Nesta ordem. Seções sem conteúdo real são omitidas, não preenchidas com texto vazio.

| Seção | Obrigatória | Conteúdo |
|---|---|---|
| `## Papel` | ✅ | Duas a quatro frases. Quem é o profissional e o que ele julga |
| `## Anti-objetivos` | ✅ | O que este agent **não** faz, e de quem é aquele trabalho |
| `## Entrada` | ✅ | O que o orquestrador precisa fornecer para o agent trabalhar |
| `## Entrega` | ✅ | O artefato concreto produzido. Verificável, não "análise" |
| `## Skills` | ✅ | Tabela contexto → skill, com links reais para `../skills/<n>/SKILL.md` |
| `## Rules` | ✅ | As rules que este ofício faz cumprir, com link real |
| `## Método` | ✅ | Passos numerados do ofício. Imperativos e verificáveis |
| `## Heurísticas` | — | Tabela situação → decisão, quando o ofício tem julgamento recorrente |
| `## Quando parar` | ✅ | Critério mensurável de pronto, e o que fazer quando bloqueia |
| Rodapé | ✅ | Criado em / Atualizado em / Versão |

### `## Papel`

O profissional, não a função de software. "Engenheiro de qualidade que decide o que vale
ser testado" diz mais do que "responsável por executar testes".

Termine declarando o que o agent **julga** — é o julgamento que justifica um agent existir
em vez de uma skill.

### `## Anti-objetivos`

Cada linha nomeia o trabalho excluído **e** o ofício a quem ele pertence. É o que impede
a erosão para um agent genérico:

> - NÃO escreve código de produção — é o ofício do `developer`.

Nomear o outro ofício não cria fluxo: informa o orquestrador de quem chamar em seguida,
sem que o agent tente chamá-lo.

### `## Skills`

O que liga o agent ao resto do repositório. Sem esta seção o agent reinventa convenções
que já estão escritas.

```markdown
| Contexto | Skill |
|---|---|
| Nomear um Symbol de contrato | [naming](../skills/naming/SKILL.md) |
| Ordem dos membros da classe | [anatomy](../skills/anatomy/SKILL.md) |
```

Só skills que existem. O link é relativo, de `agents/` para `skills/` — um nível acima.

### `## Método`

Passos numerados que um profissional do ofício seguiria. Cada passo tem verbo no
imperativo e resultado observável. Se um passo não pode ser verificado por terceiro, ele
é conselho, não método — reescreva ou remova.

### `## Quando parar`

Duas coisas: o critério mensurável de trabalho pronto, e o que fazer quando não dá para
concluir. Um agent que não sabe parar consome o turno inteiro.

Bloqueio **reporta ao orquestrador**. Não escala, não decide sozinho, não segue em frente
com suposição silenciosa.

## Escrita

- **Um ofício por agent.** Se o `## Papel` tem "e", provavelmente são dois.
- **Sem exemplo de código extenso.** Código mora em `examples/` das skills. O agent cita
  a skill; não a duplica.
- **Sem ensinar convenção.** Se a convenção está numa skill, linke. Se não está, ela
  provavelmente deveria virar uma skill.
- **Números e caminhos exatos.** `bun run test`, `packages/<categoria>/<nome>/`,
  `rules/031`. Nunca "rodar os testes do projeto".

## Verificação

Rodar de `.claude/`, antes de commitar um agent novo ou alterado.

| Item | Critério |
|---|---|
| `name` | Igual ao nome do arquivo |
| Frontmatter | Exatamente `name`, `description`, `model`, `tools`, `color` |
| `description` | Com gatilho positivo (`Use ao…`) e negativo (`Não use para…`) |
| `model` | `sonnet` ou `opus` — agent não usa `haiku` |
| `color` | Não repetida entre agents |
| Seções | As oito obrigatórias, **na ordem** deste arquivo |
| Rodapé | Criado em / Atualizado em / Versão |
| Fluxo | Nenhum `changes/00`, `attempts-`, "Encaminhar ao @" ou sequência de agentes |
| `tools` | Coerente com o que os anti-objetivos declaram |

Dois itens continuam fora do alcance do script, e ficam para a leitura: se cada passo do
`## Método` é verificável por terceiro, e se o `## Papel` descreve **um** ofício.

Os **links** são verificados junto com os das skills — o script em
[skills/STANDARD.md](../skills/STANDARD.md) cobre `agents/` também, porque os dois erram
a profundidade do `../` do mesmo jeito.

Este script roda automaticamente a cada prompt, pelo hook `UserPromptSubmit` — ver
`hooks/validate.py`. Rodá-lo à mão só é necessário para conferir uma correção na hora.

```bash
python3 - <<'PY'
import os, re, glob, sys
from collections import Counter, defaultdict

FM = ["name", "description", "model", "tools", "color"]
MODELS = {"sonnet", "opus"}
ORDEM = ["## Papel", "## Anti-objetivos", "## Entrada", "## Entrega",
         "## Skills", "## Rules", "## Método", "## Quando parar"]
FLUXO = re.compile(r"changes/00|attempts-|Encaminhar ao @|Sequência de Agentes")
erros = defaultdict(list)
cores = Counter()

for p in sorted(glob.glob("agents/*.md")):
    nome = os.path.basename(p)[:-3]
    if nome == "STANDARD": continue
    raw = open(p).read()
    m = re.match(r"^---\n(.*?)\n---\n", raw, re.S)
    if not m:
        erros[nome].append("sem frontmatter"); continue
    fm, corpo = m.group(1), raw[m.end():]
    chaves = re.findall(r"^([a-z_-]+):", fm, re.M)
    if set(chaves) != set(FM):
        erros[nome].append(f"frontmatter: extra {sorted(set(chaves)-set(FM))}, falta {sorted(set(FM)-set(chaves))}")
    if (n := re.search(r"^name:\s*(\S+)", fm, re.M)) and n.group(1) != nome:
        erros[nome].append(f"name '{n.group(1)}' != arquivo '{nome}'")
    if mo := re.search(r"^model:\s*(\S+)", fm, re.M):
        if mo.group(1) not in MODELS: erros[nome].append(f"model inválido: {mo.group(1)} (agent não usa haiku)")
    if c := re.search(r"^color:\s*(\S+)", fm, re.M): cores[c.group(1)] += 1
    if d := re.search(r"^description:\s*(.+)$", fm, re.M):
        if "Use " not in d.group(1): erros[nome].append("description sem gatilho ('Use ao/quando')")
        if "Não use" not in d.group(1): erros[nome].append("description sem gatilho negativo")
    # seções presentes e na ordem
    pos = []
    for sec in ORDEM:
        m2 = re.search(rf"^{re.escape(sec)}\s*$", corpo, re.M)
        if not m2: erros[nome].append(f"falta: {sec}")
        else: pos.append((m2.start(), sec))
    if pos != sorted(pos): erros[nome].append("seções fora da ordem do STANDARD")
    if not re.search(r"\*\*Criado em\*\*.*\n\*\*Atualizado em\*\*.*\n\*\*Versão\*\*", corpo):
        erros[nome].append("rodapé incompleto")
    if f := FLUXO.search(corpo): erros[nome].append(f"resíduo de fluxo: '{f.group(0)}'")
    # tools coerente com anti-objetivos: quem declara que não escreve não recebe Write/Edit
    anti = corpo[corpo.find("## Anti-objetivos"):corpo.find("## Entrada")]
    tools = re.search(r"^tools:\s*(.+)$", fm, re.M).group(1)
    if re.search(r"NÃO (escreve|altera|edita|corrige)", anti) and "Write" in tools:
        pass  # só sinaliza quando o agent declara não produzir artefato nenhum
    if "Não recebe `Write` nem `Edit`" in corpo and ("Write" in tools or "Edit" in tools):
        erros[nome].append("declara não ter Write/Edit, mas os tools contradizem")

for cor, n in cores.items():
    if n > 1: erros["cores"].append(f"'{cor}' usada por {n} agents")

for alvo in sorted(erros):
    print(f"X {alvo}")
    for e in erros[alvo]: print(f"    {e}")
print(f"\n{len(cores)} agents · {sum(len(v) for v in erros.values())} problemas")
sys.exit(1 if erros else 0)
PY
```
---

**Criado em**: 2026-08-10
**Atualizado em**: 2026-08-10
**Versão**: 1.1
