# Padrão de Rules

Como toda rule em `.claude/rules/` deve ser escrita. Derivado das 70 rules existentes,
que seguem a forma abaixo sem exceção.

Este arquivo não é uma rule: não tem ID, não entra na numeração e não é carregado como
instrução. É a especificação de forma das que são.

---

## O que é uma rule

Uma **restrição verificável** sobre o código deste repositório. É carregada como
instrução permanente em toda sessão, e por isso obedece a três exigências:

1. **É verificável.** Todo critério tem número, nome de arquivo ou padrão buscável. Se
   duas pessoas podem discordar se a rule foi cumprida, ela não está pronta.
2. **É restritiva.** Diz o que não fazer ou qual limite não ultrapassar. Guia, tutorial
   e "como fazer" pertencem a uma **skill**, não a uma rule.
3. **É curta.** Fica sempre em contexto. Toda linha aqui custa em toda sessão — o
   aprofundamento vai para a skill correspondente.

### Rule ou skill?

| Se… | Vai para |
|---|---|
| É um limite ou proibição verificável | **rule** |
| É um procedimento, um passo a passo, um catálogo | **skill** |
| Precisa de exemplo de código para se entender | **skill** |
| Precisa estar em contexto o tempo todo | **rule** |
| Só importa quando você está fazendo aquela tarefa | **skill** |

As duas se ligam: a rule **exige**, a skill **executa**. Toda rule com uma skill
correspondente é citada na seção `## Rules relacionadas` daquela skill.

## Arquivo

```
NNN_titulo-em-kebab-case.md
```

- `NNN` — três dígitos com zero à esquerda, na faixa da categoria (ver abaixo).
- Título do arquivo em **português**, kebab-case, descrevendo a restrição:
  `037_proibicao-argumentos-sinalizadores.md`.
- Um arquivo por rule. Nunca duas rules no mesmo arquivo.
- Rules não são deletadas quando perdem validade — são marcadas e substituídas, como
  ADRs. A numeração nunca é reciclada.

## Idioma

Convenção bilíngue deliberada, seguida pelas 70:

| Elemento | Idioma |
|---|---|
| Nome do arquivo | Português |
| Título (`# …`) | Português |
| **Cabeçalhos de seção** | **Inglês** — `## What it is`, `## Why it matters` |
| Corpo | Português |
| Rótulo dos links em `Related to` | **Inglês** — `[010 - Single Responsibility Principle (SRP)]` |
| Campos de metadado | Inglês — `**ID**`, `**Severity**` |

O esqueleto em inglês torna a estrutura reconhecível e pesquisável (`grep '## Objective
Criteria'`); o conteúdo em português é o idioma de trabalho.

## Faixas de numeração

A faixa comunica a natureza da rule antes de abrir o arquivo:

| Faixa | Tema | Categoria dominante |
|---|---|---|
| 001–009 | Object Calisthenics | Structural |
| 010–014 | SOLID | Behavioral |
| 015–020 | Princípios de pacote | Structural |
| 021–039 | Clean Code | Behavioral / Structural |
| 040–051 | Twelve-Factor | Infrastructure |
| 052–070 | Anti-patterns | Structural / Behavioral |

Uma rule nova entra na faixa do tema. Se não pertence a nenhuma, a faixa 052–070 é a
extensível — e vale perguntar antes se aquilo não é uma skill.

## Estrutura

Toda rule tem **exatamente** estas seis seções, nesta ordem. Nenhuma é opcional; as 70
existentes cumprem todas.

```markdown
# Título em Português

**ID**: <CATEGORIA>-NNN
**Severity**: 🔴 Critical | 🟠 High | 🟡 Medium
**Category**: Structural | Behavioral | Creational | Infrastructure

---

## What it is
## Why it matters
## Objective Criteria
## Allowed Exceptions
## How to Detect
### Manual
### Automatic
## Related to

---

**Created on**: AAAA-MM-DD
**Updated on**: AAAA-MM-DD
**Version**: X.Y
```

### `## What it is`

Um parágrafo. A definição da restrição, direta. Quando a rule cobre um anti-pattern
conhecido, uma linha em itálico e parênteses conecta os dois:

> *(Previne o anti-pattern Primitive Obsession: uso de `string`, `number`, `boolean` para
> representar conceitos de domínio.)*

### `## Why it matters`

Lista de bullets. **Consequências**, nunca reafirmação da regra. Cada linha responde "o
que quebra quando isso não é seguido" — quatro bullets é a média das 70.

❌ "Métodos devem ter um só nível de indentação."
✅ "Facilita a escrita de testes unitários focados em um único caminho de execução."

### `## Objective Criteria`

Checkboxes (`- [ ]`). É a seção que decide se a rule serve: cada item precisa ser
verificável por alguém que não escreveu a rule.

- Números em **negrito** quando são o limite: "no máximo **3** parâmetros".
- Nomes de arquivo, padrões buscáveis, comandos.
- Sem "deve ser simples", "evitar complexidade", "usar bom senso".

### `## Allowed Exceptions`

Bullets em negrito com o nome da exceção, seguidos da condição. É o que impede a rule de
virar dogma — e o que evita a discussão recorrente sobre o caso óbvio que não se aplica:

> - **Testes Unitários**: Configuração de *fixtures* para cenários específicos.

Toda rule tem ao menos uma. Se não consegue imaginar exceção legítima, provavelmente a
rule está genérica demais.

### `## How to Detect`

Duas subseções obrigatórias:

- **`### Manual`** — o que procurar lendo o código. Bullets no imperativo: "Buscar
  `return null` em código de negócio".
- **`### Automatic`** — a ferramenta e a regra exata: `Biome:
  complexity/noExcessiveCognitiveComplexity`. **Quando não existe regra automática, diga
  isso explicitamente** — é o padrão das 70: *"Sem regra nativa de Biome para X —
  detecção via revisão de código"*. Nunca invente um nome de regra que não existe.

### `## Related to`

Links para outras rules, com o rótulo em inglês e a relação declarada:

```markdown
- [010 - Single Responsibility Principle (SRP)](010_principio-responsabilidade-unica.md): reinforces
```

Vocabulário, com o uso real nas 70:

| Relação | Uso | Significado |
|---|---|---|
| `reinforces` | 208× | A outra rule reforça esta no mesmo eixo |
| `complements` | 116× | A outra cobre a face oposta do mesmo problema |
| `depends on` | 1× | Esta rule pressupõe a outra satisfeita |
| `supersedes` | 1× | Esta substitui a outra no caso citado |

O link é relativo e sem `../` — as rules vivem todas no mesmo diretório.

## Metadados

### `ID`

`<CATEGORIA>-NNN`, com a categoria em maiúsculas: `BEHAVIORAL-037`, `STRUCTURAL-007`,
`CREATIONAL-024`, `INFRASTRUCTURE-042`.

Sem exceção: os 70 IDs seguem esta forma. As rules de anti-pattern usaram
`AP-<n>-NNN` até 2026-08-10, herdado do catálogo de onde vieram — um contador sem dono,
sem regra de geração e impossível de verificar, que acabou atribuindo `AP-19` a duas
rules ao mesmo tempo. O número da rule já é único; o contador só duplicava a identidade
com pior garantia.

### `Severity`

| Nível | Uso | Significado |
|---|---|---|
| 🔴 Critical | 28× | Bloqueia o merge. Quebra arquitetura, segurança ou correção |
| 🟠 High | 26× | Exige justificativa explícita para passar |
| 🟡 Medium | 16× | Melhoria esperada; vira codetag quando adiada |

A severidade é a da **violação**, não a da importância do tema. Calibração em contexto é
a skill `quality`, que pesa pelo fator McCall impactado.

### `Category`

| Categoria | Uso | O que governa |
|---|---|---|
| Structural | 33× | Forma do código: tamanho, organização, dependência |
| Behavioral | 22× | O que o código faz: fluxo, contrato, efeito |
| Infrastructure | 12× | Execução e deploy |
| Creational | 3× | Construção de objetos |

### Datas e versão

- `Created on` — nunca muda.
- `Updated on` — a data da última alteração de conteúdo.
- `Version` — `MAJOR.MINOR`. Sobe a MINOR quando o texto muda sem alterar o que é
  exigido; sobe a MAJOR quando um critério objetivo muda, porque isso pode reprovar
  código que passava antes.

## Escrita

- **Uma restrição por rule.** Se o título tem "e", provavelmente são duas.
- **Termos técnicos em itálico** na primeira ocorrência: *guard clauses*, *Value Object*.
- **Código e identificadores em `crase`**: `return null`, `Object.freeze()`.
- **Sem exemplo de código extenso.** Um trecho curto inline é aceitável em
  `Objective Criteria`; um bloco cercado significa que aquilo é conteúdo de skill.
- **Sem tom de tutorial.** A rule enuncia a restrição; ensinar a cumpri-la é da skill.

## Verificação

Rodar de `.claude/`, antes de commitar uma rule nova ou alterada.

| Item | Critério |
|---|---|
| Nome do arquivo | `NNN_kebab-case.md` |
| Seções | As seis obrigatórias, **na ordem**, com os cabeçalhos em inglês |
| `How to Detect` | Contém `### Manual` e `### Automatic` |
| `ID` | Presente, coerente com `Category`, terminando no número do arquivo |
| `Severity` | Uma das três, com o emoji |
| `Category` | Uma das quatro |
| Datas | `Created on` e `Updated on` em AAAA-MM-DD; `Version` em MAJOR.MINOR |
| `Objective Criteria` | Ao menos um checkbox `- [ ]` |
| `Allowed Exceptions` | Ao menos uma exceção nomeada em negrito |
| `Automatic` | Cita ferramenta nomeada, ou declara que não existe regra nativa |
| `Related to` | Todo link resolve, e traz relação do vocabulário |
| IDs | Sem duplicata |

Fora do alcance do script, e por isso o que mais merece atenção na leitura: se **todo item
de `Objective Criteria` é verificável por terceiro**. É o critério que decide se a rule
serve, e nenhuma regex o mede.

Este script roda automaticamente a cada prompt, pelo hook `UserPromptSubmit` — ver
`hooks/validate.py`. Rodá-lo à mão só é necessário para conferir uma correção na hora.

```bash
python3 - <<'PY'
import os, re, glob, sys
from collections import defaultdict

SECOES = ["## What it is", "## Why it matters", "## Objective Criteria",
          "## Allowed Exceptions", "## How to Detect", "## Related to"]
SEVERITY = {"🔴 Critical", "🟠 High", "🟡 Medium"}
CATEGORY = {"Structural", "Behavioral", "Creational", "Infrastructure"}
RELACAO = {"reinforces", "complements", "depends on", "supersedes"}
erros, ids = defaultdict(list), defaultdict(list)

arquivos = sorted(glob.glob("rules/[0-9][0-9][0-9]_*.md"))
for p in arquivos:
    nome = os.path.basename(p)
    t = open(p).read()
    if not re.fullmatch(r"\d{3}_[a-z0-9-]+\.md", nome):
        erros[nome].append("nome fora do padrão NNN_kebab-case.md")
    # seções, na ordem
    pos = []
    for sec in SECOES:
        m = re.search(rf"^{re.escape(sec)}\s*$", t, re.M)
        if not m: erros[nome].append(f"falta: {sec}")
        else: pos.append((m.start(), sec))
    if pos != sorted(pos): erros[nome].append("seções fora da ordem")
    for sub in ["### Manual", "### Automatic"]:
        if not re.search(rf"^{re.escape(sub)}\s*$", t, re.M): erros[nome].append(f"falta: {sub}")
    # metadados
    if m := re.search(r"^\*\*ID\*\*:\s*(\S+)", t, re.M):
        ids[m.group(1)].append(nome)
        cat_id = m.group(1).split("-")[0]
        if m2 := re.search(r"^\*\*Category\*\*:\s*(\S+)", t, re.M):
            if cat_id != m2.group(1).upper():
                erros[nome].append(f"ID '{m.group(1)}' não bate com Category '{m2.group(1)}'")
        if not m.group(1).endswith(nome[:3]):
            erros[nome].append(f"ID '{m.group(1)}' não termina no número do arquivo ({nome[:3]})")
    else: erros[nome].append("sem **ID**")
    if m := re.search(r"^\*\*Severity\*\*:\s*(.+)$", t, re.M):
        if m.group(1).strip() not in SEVERITY: erros[nome].append(f"Severity inválida: {m.group(1)}")
    else: erros[nome].append("sem **Severity**")
    if m := re.search(r"^\*\*Category\*\*:\s*(\S+)", t, re.M):
        if m.group(1) not in CATEGORY: erros[nome].append(f"Category inválida: {m.group(1)}")
    else: erros[nome].append("sem **Category**")
    for campo in ["Created on", "Updated on"]:
        if not re.search(rf"^\*\*{campo}\*\*:\s*\d{{4}}-\d{{2}}-\d{{2}}", t, re.M):
            erros[nome].append(f"sem **{campo}** em AAAA-MM-DD")
    if not re.search(r"^\*\*Version\*\*:\s*\d+\.\d+", t, re.M): erros[nome].append("sem **Version** MAJOR.MINOR")
    # conteúdo das seções
    criterios = t[t.find("## Objective Criteria"):t.find("## Allowed Exceptions")]
    if criterios.count("- [ ]") == 0: erros[nome].append("Objective Criteria sem checkbox")
    excecoes = t[t.find("## Allowed Exceptions"):t.find("## How to Detect")]
    if not re.search(r"^- \*\*", excecoes, re.M): erros[nome].append("Allowed Exceptions sem exceção nomeada")
    auto = t[t.find("### Automatic"):t.find("## Related to")]
    if not (re.search(r"^- [^:\n]+:", auto, re.M) or "Sem regra" in auto):
        erros[nome].append("Automatic não cita ferramenta nomeada nem declara ausência")
    # Related to: link resolve e relação declarada
    rel = t[t.find("## Related to"):]
    for linha in re.findall(r"^- \[.*?\]\((\d{3}_[a-z0-9-]+\.md)\)(.*)$", rel, re.M):
        if not os.path.exists(f"rules/{linha[0]}"): erros[nome].append(f"link quebrado: {linha[0]}")
        if not any(r in linha[1] for r in RELACAO): erros[nome].append(f"relação não declarada em {linha[0]}")

for rid, quais in ids.items():
    if len(quais) > 1: erros["IDs"].append(f"'{rid}' em {quais}")

for alvo in sorted(erros):
    print(f"X {alvo}")
    for e in erros[alvo]: print(f"    {e}")
print(f"\n{len(arquivos)} rules · {sum(len(v) for v in erros.values())} problemas")
sys.exit(1 if erros else 0)
PY
```

### Divergências

Nenhuma. O script sai com código 0 nas 70 rules, e todo `ID` é verificado contra a
`Category` — o que só passou a valer depois que o formato `AP-` foi eliminado.
---

**Criado em**: 2026-08-10
**Atualizado em**: 2026-08-10
**Versão**: 2.0
