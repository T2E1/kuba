#!/usr/bin/env python3
"""Valida as quatro camadas do `.claude/` contra os padrões em `../references/`.

Cada função espelha a seção `## Verificação` do reference correspondente. Quando o padrão
mudar, alterar aqui é a segunda metade da mudança — e é deliberado que não haja extração
automática do markdown: um validador derivado do texto silencia quando o texto muda de
forma, que é exatamente quando ele mais deveria falar.

    python3 skills/standard/scripts/validate.py            # as quatro
    python3 skills/standard/scripts/validate.py rules      # uma só
"""

import os
import re
import sys
from collections import Counter, defaultdict

CLAUDE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
FENCE = re.compile(r"^\s*```")
INLINE = re.compile(r"`[^`]*`")  # bracket notation `obj[x](y)` casa com sintaxe de link
LINK = re.compile(r"\]\((?!https?:|#)([^)\s]+)\)")


def caminho(*partes):
    return os.path.join(CLAUDE, *partes)


# ─────────────────────────────────────────────────────────────────────────────
# rules
# ─────────────────────────────────────────────────────────────────────────────
def valida_rules(erros):
    SECOES = ["## What it is", "## Why it matters", "## Objective Criteria",
              "## Allowed Exceptions", "## How to Detect", "## Related to"]
    SEVERITY = {"🔴 Critical", "🟠 High", "🟡 Medium"}
    CATEGORY = {"Structural", "Behavioral", "Creational", "Infrastructure"}
    RELACAO = {"reinforces", "complements", "depends on", "supersedes"}
    ids = defaultdict(list)

    arquivos = sorted(f for f in os.listdir(caminho("rules")) if re.match(r"\d{3}_.*\.md$", f))
    for nome in arquivos:
        t = open(caminho("rules", nome)).read()
        if not re.fullmatch(r"\d{3}_[a-z0-9-]+\.md", nome):
            erros[nome].append("nome fora do padrão NNN_kebab-case.md")

        posicoes = []
        for sec in SECOES:
            m = re.search(rf"^{re.escape(sec)}\s*$", t, re.M)
            if not m:
                erros[nome].append(f"falta: {sec}")
            else:
                posicoes.append((m.start(), sec))
        if posicoes != sorted(posicoes):
            erros[nome].append("seções fora da ordem")
        for sub in ("### Manual", "### Automatic"):
            if not re.search(rf"^{re.escape(sub)}\s*$", t, re.M):
                erros[nome].append(f"falta: {sub}")

        if m := re.search(r"^\*\*ID\*\*:\s*(\S+)", t, re.M):
            ids[m.group(1)].append(nome)
            if cat := re.search(r"^\*\*Category\*\*:\s*(\S+)", t, re.M):
                if m.group(1).split("-")[0] != cat.group(1).upper():
                    erros[nome].append(f"ID '{m.group(1)}' não bate com Category '{cat.group(1)}'")
            if not m.group(1).endswith(nome[:3]):
                erros[nome].append(f"ID '{m.group(1)}' não termina em {nome[:3]}")
        else:
            erros[nome].append("sem **ID**")

        if m := re.search(r"^\*\*Severity\*\*:\s*(.+)$", t, re.M):
            if m.group(1).strip() not in SEVERITY:
                erros[nome].append(f"Severity inválida: {m.group(1)}")
        else:
            erros[nome].append("sem **Severity**")

        if m := re.search(r"^\*\*Category\*\*:\s*(\S+)", t, re.M):
            if m.group(1) not in CATEGORY:
                erros[nome].append(f"Category inválida: {m.group(1)}")
        else:
            erros[nome].append("sem **Category**")

        for campo in ("Created on", "Updated on"):
            if not re.search(rf"^\*\*{campo}\*\*:\s*\d{{4}}-\d{{2}}-\d{{2}}", t, re.M):
                erros[nome].append(f"sem **{campo}** em AAAA-MM-DD")
        if not re.search(r"^\*\*Version\*\*:\s*\d+\.\d+", t, re.M):
            erros[nome].append("sem **Version** MAJOR.MINOR")

        criterios = t[t.find("## Objective Criteria"):t.find("## Allowed Exceptions")]
        if "- [ ]" not in criterios:
            erros[nome].append("Objective Criteria sem checkbox")

        excecoes = t[t.find("## Allowed Exceptions"):t.find("## How to Detect")]
        if not re.search(r"^- \*\*", excecoes, re.M):
            erros[nome].append("Allowed Exceptions sem exceção nomeada")

        auto = t[t.find("### Automatic"):t.find("## Related to")]
        if not (re.search(r"^- [^:\n]+:", auto, re.M) or "Sem regra" in auto):
            erros[nome].append("Automatic não cita ferramenta nem declara ausência")

        rel = t[t.find("## Related to"):]
        for alvo, resto in re.findall(r"^- \[.*?\]\((\d{3}_[a-z0-9-]+\.md)\)(.*)$", rel, re.M):
            if not os.path.exists(caminho("rules", alvo)):
                erros[nome].append(f"link quebrado: {alvo}")
            if not any(r in resto for r in RELACAO):
                erros[nome].append(f"relação não declarada em {alvo}")

    for rid, quais in ids.items():
        if len(quais) > 1:
            erros["IDs"].append(f"'{rid}' em {quais}")
    return len(arquivos), "rules"


# ─────────────────────────────────────────────────────────────────────────────
# skills
# ─────────────────────────────────────────────────────────────────────────────
def valida_skills(erros):
    FM = {"name", "model", "description"}
    MODELS = {"haiku", "sonnet", "opus"}
    SECOES = ["## O que é", "## Quando usar", "## Como aplicar", "## Exemplos",
              "## Checklist", "## Rules relacionadas", "## Skills relacionadas"]
    EXEC = {"js", "javascript", "ts", "typescript", "jsx", "tsx", "css", "html", "json"}
    modelos = Counter()

    nomes = sorted(d for d in os.listdir(caminho("skills")) if os.path.isdir(caminho("skills", d)))
    for s in nomes:
        p = caminho("skills", s, "SKILL.md")
        if not os.path.isfile(p):
            erros[s].append("sem SKILL.md")
            continue
        raw = open(p).read()
        m = re.match(r"^---\n(.*?)\n---\n", raw, re.S)
        if not m:
            erros[s].append("sem frontmatter")
            continue
        fm, corpo = m.group(1), raw[m.end():]

        chaves = set(re.findall(r"^([a-z_-]+):", fm, re.M))
        if extra := chaves - FM:
            erros[s].append(f"campo extra: {sorted(extra)}")
        if falta := FM - chaves:
            erros[s].append(f"campo faltando: {sorted(falta)}")
        if (n := re.search(r"^name:\s*(\S+)", fm, re.M)) and n.group(1) != s:
            erros[s].append(f"name '{n.group(1)}' != pasta")
        if mo := re.search(r"^model:\s*(\S+)", fm, re.M):
            modelos[mo.group(1)] += 1
            if mo.group(1) not in MODELS:
                erros[s].append(f"model inválido: {mo.group(1)}")
        if d := re.search(r"^description:\s*(.+)$", fm, re.M):
            if len(d.group(1)) > 1024:
                erros[s].append(f"description {len(d.group(1))} > 1024")
            if re.search(r"[<>]", d.group(1)):
                erros[s].append("description com < ou >")

        for sec in SECOES:
            if not re.search(rf"^{re.escape(sec)}\s*$", corpo, re.M):
                erros[s].append(f"falta: {sec}")
        if not corpo.lstrip().startswith("# "):
            erros[s].append("sem título H1")
        if not re.search(r"\*\*Criado em\*\*.*\n\*\*Atualizado em\*\*.*\n\*\*Versão\*\*", corpo):
            erros[s].append("rodapé incompleto")
        for lang in re.findall(r"^\s*```([a-zA-Z]+)", corpo, re.M):
            if lang.lower() in EXEC:
                erros[s].append(f"código executável no SKILL.md: {lang}")
        if (w := len(corpo.split())) > 5000:
            erros[s].append(f"{w} palavras > 5000")

        if not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", s):
            erros[s].append("nome fora do kebab-case")
        if "claude" in s or "anthropic" in s:
            erros[s].append("nome reservado")
        if os.path.isfile(caminho("skills", s, "README.md")):
            erros[s].append("README.md dentro da pasta")
        if not os.path.isdir(caminho("skills", s, "examples")):
            erros[s].append("sem examples/")
        else:
            temas = defaultdict(set)
            for f in os.listdir(caminho("skills", s, "examples")):
                if e := re.match(r"(.+)\.(valid|invalid)\.[a-z]+$", f):
                    temas[e.group(1)].add(e.group(2))
                else:
                    erros[s].append(f"examples fora da convenção: {f}")
            for tema, tipos in temas.items():
                if tipos != {"valid", "invalid"}:
                    erros[s].append(f"'{tema}' só tem {sorted(tipos)}")

    padrao = open(caminho("skills", "standard", "references", "skill.md")).read()
    for modelo, quantos in modelos.items():
        if f"| `{modelo}` | {quantos} |" not in padrao:
            erros["references/skill.md"].append(f"tabela de modelos: {modelo} são {quantos}")
    return len(nomes), "skills"


# ─────────────────────────────────────────────────────────────────────────────
# agents
# ─────────────────────────────────────────────────────────────────────────────
def valida_agents(erros):
    FM = {"name", "description", "model", "tools", "color"}
    ORDEM = ["## Papel", "## Anti-objetivos", "## Entrada", "## Entrega",
             "## Skills", "## Rules", "## Método", "## Quando parar"]
    FLUXO = re.compile(r"changes/00|attempts-|Encaminhar ao @|Sequência de Agentes")
    cores = Counter()

    arquivos = sorted(f for f in os.listdir(caminho("agents")) if f.endswith(".md"))
    for arq in arquivos:
        nome = arq[:-3]
        raw = open(caminho("agents", arq)).read()
        m = re.match(r"^---\n(.*?)\n---\n", raw, re.S)
        if not m:
            erros[nome].append("sem frontmatter")
            continue
        fm, corpo = m.group(1), raw[m.end():]

        chaves = set(re.findall(r"^([a-z_-]+):", fm, re.M))
        if chaves != FM:
            erros[nome].append(f"frontmatter: extra {sorted(chaves - FM)}, falta {sorted(FM - chaves)}")
        if (n := re.search(r"^name:\s*(\S+)", fm, re.M)) and n.group(1) != nome:
            erros[nome].append(f"name '{n.group(1)}' != arquivo")
        if mo := re.search(r"^model:\s*(\S+)", fm, re.M):
            if mo.group(1) not in {"sonnet", "opus"}:
                erros[nome].append(f"model inválido: {mo.group(1)} — agent não usa haiku")
        if c := re.search(r"^color:\s*(\S+)", fm, re.M):
            cores[c.group(1)] += 1
        if d := re.search(r"^description:\s*(.+)$", fm, re.M):
            if "Use " not in d.group(1):
                erros[nome].append("description sem gatilho positivo")
            if "Não use" not in d.group(1):
                erros[nome].append("description sem gatilho negativo")

        posicoes = []
        for sec in ORDEM:
            m2 = re.search(rf"^{re.escape(sec)}\s*$", corpo, re.M)
            if not m2:
                erros[nome].append(f"falta: {sec}")
            else:
                posicoes.append((m2.start(), sec))
        if posicoes != sorted(posicoes):
            erros[nome].append("seções fora da ordem")
        if not re.search(r"\*\*Criado em\*\*.*\n\*\*Atualizado em\*\*.*\n\*\*Versão\*\*", corpo):
            erros[nome].append("rodapé incompleto")
        if f := FLUXO.search(corpo):
            erros[nome].append(f"resíduo de fluxo: '{f.group(0)}'")
        if "Não recebe `Write` nem `Edit`" in corpo:
            tools = re.search(r"^tools:\s*(.+)$", fm, re.M).group(1)
            if "Write" in tools or "Edit" in tools:
                erros[nome].append("declara não ter Write/Edit, mas os tools contradizem")

    for cor, n in cores.items():
        if n > 1:
            erros["cores"].append(f"'{cor}' usada por {n} agents")
    return len(arquivos), "agents"


# ─────────────────────────────────────────────────────────────────────────────
# commands
# ─────────────────────────────────────────────────────────────────────────────
def valida_commands(erros):
    AGENTS = "|".join(f[:-3] for f in os.listdir(caminho("agents")) if f.endswith(".md"))
    arquivos = sorted(f for f in os.listdir(caminho("commands")) if f.endswith(".md"))
    for arq in arquivos:
        t = open(caminho("commands", arq)).read()
        if not re.search(r'^description: "', t, re.M):
            erros[arq].append("description sem aspas")
        for sec in ("## Propósito", "## Fluxo", "## Instruções"):
            if not re.search(rf"^{re.escape(sec)}\s*$", t, re.M):
                erros[arq].append(f"falta: {sec}")
        if not re.search(r"^\*\*Criado em\*\*", t, re.M):
            erros[arq].append("sem rodapé")
        for cmd in re.findall(r"^!`([^`]+)`", t, re.M):
            if not cmd.startswith("git ") and "rev-parse" not in cmd:
                erros[arq].append(f"comando ! com caminho não ancorado: {cmd}")
        for a in set(re.findall(rf"`({AGENTS})`", t)):
            if not os.path.exists(caminho("agents", f"{a}.md")):
                erros[arq].append(f"agent inexistente: {a}")
    return len(arquivos), "commands"


# ─────────────────────────────────────────────────────────────────────────────
# links, em tudo
# ─────────────────────────────────────────────────────────────────────────────
def valida_links(erros):
    alvos = []
    for raiz, _, arquivos in os.walk(CLAUDE):
        if "node_modules" in raiz:
            continue
        alvos += [os.path.join(raiz, f) for f in arquivos if f.endswith(".md")]
    for f in sorted(alvos):
        base, dentro = os.path.dirname(f), False
        rel = os.path.relpath(f, CLAUDE)
        for n, linha in enumerate(open(f), 1):
            if FENCE.match(linha):
                dentro = not dentro
                continue
            if dentro:
                continue
            for link in LINK.findall(INLINE.sub("", linha)):
                if not os.path.exists(os.path.normpath(os.path.join(base, link))):
                    erros[rel].append(f"linha {n}: link quebrado -> {link}")
    return len(alvos), "arquivos .md"


CAMADAS = {
    "rules": valida_rules,
    "skills": valida_skills,
    "agents": valida_agents,
    "commands": valida_commands,
    "links": valida_links,
}


def main():
    pedidas = sys.argv[1:] or list(CAMADAS)
    total = 0
    for camada in pedidas:
        if camada not in CAMADAS:
            print(f"camada desconhecida: {camada} (use {', '.join(CAMADAS)})")
            return 2
        erros = defaultdict(list)
        quantos, rotulo = CAMADAS[camada](erros)
        for alvo in sorted(erros):
            print(f"X {alvo}")
            for e in erros[alvo]:
                print(f"    {e}")
        problemas = sum(len(v) for v in erros.values())
        total += problemas
        print(f"{quantos} {rotulo} · {problemas} problemas")
    return 1 if total else 0


if __name__ == "__main__":
    sys.exit(main())
