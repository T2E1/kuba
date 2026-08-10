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

**Exceção histórica:** as rules de anti-pattern usam `AP-<n>-NNN`, onde `<n>` é a posição
no catálogo de anti-patterns de origem: `AP-03-060`. Esse contador é herdado e **tem uma
colisão conhecida** — `AP-19` aparece em `055_limite-maximo-linhas-metodo.md` e em
`061_proibicao-middle-man.md`. Rules novas de anti-pattern devem usar o formato de
categoria (`STRUCTURAL-NNN`), não estender o contador `AP-`.

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

Antes de commitar uma rule nova ou alterada:

- As seis seções presentes, na ordem, com os cabeçalhos em inglês
- `### Manual` e `### Automatic` dentro de `How to Detect`
- Todo item de `Objective Criteria` verificável por terceiro
- Ao menos uma exceção em `Allowed Exceptions`
- `Automatic` cita ferramenta real, ou declara que não existe regra nativa
- Links de `Related to` resolvendo, com relação declarada do vocabulário
- `ID` coerente com `Category`, sem colidir com um existente
- `Updated on` e `Version` refletindo a alteração

```bash
# links quebrados
grep -ohE '\]\([0-9]{3}_[a-z-]+\.md\)' *.md | tr -d '()' | sed 's/^]//' | sort -u |
  while read f; do [ -f "$f" ] || echo "quebrado: $f"; done

# seções obrigatórias
for f in *.md; do
  for s in "What it is" "Why it matters" "Objective Criteria" \
           "Allowed Exceptions" "How to Detect" "Related to"; do
    grep -q "^## $s" "$f" || echo "$f falta: $s"
  done
done
```

---

**Criado em**: 2026-08-10
**Atualizado em**: 2026-08-10
**Versão**: 1.0
