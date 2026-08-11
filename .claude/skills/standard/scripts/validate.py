#!/usr/bin/env python3
"""Check the four `.claude/` layers against the standards in `../references/`.

Each function mirrors the `## Verificação` section of its reference. When a standard
changes, changing this file is the other half of the change — and the lack of automatic
extraction from the markdown is deliberate: a validator derived from the text goes quiet
exactly when the text changes shape, which is when it should speak loudest.

    python3 skills/standard/scripts/validate.py            # all four
    python3 skills/standard/scripts/validate.py rules      # one layer
"""

import os
import re
import sys
from collections import Counter, defaultdict

CLAUDE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
FENCE = re.compile(r"^\s*```")
INLINE = re.compile(r"`[^`]*`")  # bracket notation `obj[x](y)` matches link syntax
LINK = re.compile(r"\]\((?!https?:|#)([^)\s]+)\)")


def path_in(*parts):
    return os.path.join(CLAUDE, *parts)


# ─────────────────────────────────────────────────────────────────────────────
# rules
# ─────────────────────────────────────────────────────────────────────────────
def check_rules(errors):
    SECTIONS = ["## What it is", "## Why it matters", "## Objective Criteria",
              "## Allowed Exceptions", "## How to Detect", "## Related to"]
    SEVERITY = {"🔴 Critical", "🟠 High", "🟡 Medium"}
    CATEGORY = {"Structural", "Behavioral", "Creational", "Infrastructure"}
    RELATIONS = {"reinforces", "complements", "depends on", "supersedes"}
    ids = defaultdict(list)

    files = sorted(f for f in os.listdir(path_in("rules")) if re.match(r"\d{3}_.*\.md$", f))
    for name in files:
        t = open(path_in("rules", name)).read()
        if not re.fullmatch(r"\d{3}_[a-z0-9-]+\.md", name):
            errors[name].append("filename outside NNN_kebab-case.md")

        positions = []
        for sec in SECTIONS:
            m = re.search(rf"^{re.escape(sec)}\s*$", t, re.M)
            if not m:
                errors[name].append(f"missing: {sec}")
            else:
                positions.append((m.start(), sec))
        if positions != sorted(positions):
            errors[name].append("sections out of order")
        for sub in ("### Manual", "### Automatic"):
            if not re.search(rf"^{re.escape(sub)}\s*$", t, re.M):
                errors[name].append(f"missing: {sub}")

        if m := re.search(r"^\*\*ID\*\*:\s*(\S+)", t, re.M):
            ids[m.group(1)].append(name)
            if cat := re.search(r"^\*\*Category\*\*:\s*(\S+)", t, re.M):
                if m.group(1).split("-")[0] != cat.group(1).upper():
                    errors[name].append(f"ID '{m.group(1)}' does not match Category '{cat.group(1)}'")
            if not m.group(1).endswith(name[:3]):
                errors[name].append(f"ID '{m.group(1)}' does not end in {name[:3]}")
        else:
            errors[name].append("no **ID**")

        if m := re.search(r"^\*\*Severity\*\*:\s*(.+)$", t, re.M):
            if m.group(1).strip() not in SEVERITY:
                errors[name].append(f"invalid Severity: {m.group(1)}")
        else:
            errors[name].append("no **Severity**")

        if m := re.search(r"^\*\*Category\*\*:\s*(\S+)", t, re.M):
            if m.group(1) not in CATEGORY:
                errors[name].append(f"invalid Category: {m.group(1)}")
        else:
            errors[name].append("no **Category**")

        for campo in ("Created on", "Updated on"):
            if not re.search(rf"^\*\*{campo}\*\*:\s*\d{{4}}-\d{{2}}-\d{{2}}", t, re.M):
                errors[name].append(f"sem **{campo}** em AAAA-MM-DD")
        if not re.search(r"^\*\*Version\*\*:\s*\d+\.\d+", t, re.M):
            errors[name].append("no **Version** MAJOR.MINOR")

        criteria = t[t.find("## Objective Criteria"):t.find("## Allowed Exceptions")]
        if "- [ ]" not in criteria:
            errors[name].append("Objective Criteria has no checkbox")

        exceptions = t[t.find("## Allowed Exceptions"):t.find("## How to Detect")]
        if not re.search(r"^- \*\*", exceptions, re.M):
            errors[name].append("Allowed Exceptions has no named exception")

        auto = t[t.find("### Automatic"):t.find("## Related to")]
        if not (re.search(r"^- [^:\n]+:", auto, re.M) or "Sem regra" in auto):
            errors[name].append("Automatic names no tool and declares no absence")

        rel = t[t.find("## Related to"):]
        for target, rest in re.findall(r"^- \[.*?\]\((\d{3}_[a-z0-9-]+\.md)\)(.*)$", rel, re.M):
            if not os.path.exists(path_in("rules", target)):
                errors[name].append(f"broken link: {target}")
            if not any(r in rest for r in RELATIONS):
                errors[name].append(f"relation not declared in {target}")

    for rid, which in ids.items():
        if len(which) > 1:
            errors["IDs"].append(f"'{rid}' em {which}")
    return len(files), "rules"


# ─────────────────────────────────────────────────────────────────────────────
# skills
# ─────────────────────────────────────────────────────────────────────────────
def check_skills(errors):
    FM = {"name", "model", "description"}
    MODELS = {"haiku", "sonnet", "opus"}
    SECTIONS = ["## O que é", "## Quando usar", "## Como aplicar", "## Exemplos",
              "## Checklist", "## Rules relacionadas", "## Skills relacionadas"]
    EXEC = {"js", "javascript", "ts", "typescript", "jsx", "tsx", "css", "html", "json"}
    models = Counter()

    names = sorted(d for d in os.listdir(path_in("skills")) if os.path.isdir(path_in("skills", d)))
    for s in names:
        p = path_in("skills", s, "SKILL.md")
        if not os.path.isfile(p):
            errors[s].append("no SKILL.md")
            continue
        raw = open(p).read()
        m = re.match(r"^---\n(.*?)\n---\n", raw, re.S)
        if not m:
            errors[s].append("no frontmatter")
            continue
        fm, body = m.group(1), raw[m.end():]

        keys = set(re.findall(r"^([a-z_-]+):", fm, re.M))
        if extra := keys - FM:
            errors[s].append(f"campo extra: {sorted(extra)}")
        if missing := FM - keys:
            errors[s].append(f"campo faltando: {sorted(missing)}")
        if (n := re.search(r"^name:\s*(\S+)", fm, re.M)) and n.group(1) != s:
            errors[s].append(f"name '{n.group(1)}' != folder")
        if mo := re.search(r"^model:\s*(\S+)", fm, re.M):
            models[mo.group(1)] += 1
            if mo.group(1) not in MODELS:
                errors[s].append(f"invalid model: {mo.group(1)}")
        if d := re.search(r"^description:\s*(.+)$", fm, re.M):
            if len(d.group(1)) > 1024:
                errors[s].append(f"description {len(d.group(1))} > 1024")
            if re.search(r"[<>]", d.group(1)):
                errors[s].append("description contains < or >")

        for sec in SECTIONS:
            if not re.search(rf"^{re.escape(sec)}\s*$", body, re.M):
                errors[s].append(f"missing: {sec}")
        if not body.lstrip().startswith("# "):
            errors[s].append("no H1 title")
        if not re.search(r"\*\*Criado em\*\*.*\n\*\*Atualizado em\*\*.*\n\*\*Versão\*\*", body):
            errors[s].append("incomplete footer")
        for lang in re.findall(r"^\s*```([a-zA-Z]+)", body, re.M):
            if lang.lower() in EXEC:
                errors[s].append(f"executable code block in SKILL.md: {lang}")
        if (w := len(body.split())) > 5000:
            errors[s].append(f"{w} words > 5000")

        if not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", s):
            errors[s].append("name fora do kebab-case")
        if "claude" in s or "anthropic" in s:
            errors[s].append("name reservado")
        if os.path.isfile(path_in("skills", s, "README.md")):
            errors[s].append("README.md inside the folder")
        if not os.path.isdir(path_in("skills", s, "examples")):
            errors[s].append("no examples/")
        else:
            themes = defaultdict(set)
            for f in os.listdir(path_in("skills", s, "examples")):
                if e := re.match(r"(.+)\.(valid|invalid)\.[a-z]+$", f):
                    themes[e.group(1)].add(e.group(2))
                else:
                    errors[s].append(f"examples outside the convention: {f}")
            for tema, kinds in themes.items():
                if kinds != {"valid", "invalid"}:
                    errors[s].append(f"'{tema}' only has {sorted(kinds)}")

    standard = open(path_in("skills", "standard", "references", "skill.md")).read()
    for model, count in models.items():
        if f"| `{model}` | {count} |" not in standard:
            errors["references/skill.md"].append(f"model table: {model} is {count}")
    return len(names), "skills"


# ─────────────────────────────────────────────────────────────────────────────
# agents
# ─────────────────────────────────────────────────────────────────────────────
def check_agents(errors):
    FM = {"name", "description", "model", "tools", "color"}
    ORDEM = ["## Papel", "## Anti-objetivos", "## Entrada", "## Entrega",
             "## Skills", "## Rules", "## Método", "## Quando parar"]
    WORKFLOW = re.compile(r"changes/00|attempts-|Encaminhar ao @|Sequência de Agentes")
    colours = Counter()

    files = sorted(f for f in os.listdir(path_in("agents")) if f.endswith(".md"))
    for arq in files:
        name = arq[:-3]
        raw = open(path_in("agents", arq)).read()
        m = re.match(r"^---\n(.*?)\n---\n", raw, re.S)
        if not m:
            errors[name].append("no frontmatter")
            continue
        fm, body = m.group(1), raw[m.end():]

        keys = set(re.findall(r"^([a-z_-]+):", fm, re.M))
        if keys != FM:
            errors[name].append(f"frontmatter: extra {sorted(keys - FM)}, missing {sorted(FM - keys)}")
        if (n := re.search(r"^name:\s*(\S+)", fm, re.M)) and n.group(1) != name:
            errors[name].append(f"name '{n.group(1)}' != file")
        if mo := re.search(r"^model:\s*(\S+)", fm, re.M):
            if mo.group(1) not in {"sonnet", "opus"}:
                errors[name].append(f"invalid model: {mo.group(1)} — an agent never uses haiku")
        if c := re.search(r"^color:\s*(\S+)", fm, re.M):
            colours[c.group(1)] += 1
        if d := re.search(r"^description:\s*(.+)$", fm, re.M):
            if "Use " not in d.group(1):
                errors[name].append("description without a positive trigger")
            if "Não use" not in d.group(1):
                errors[name].append("description without a negative trigger")

        positions = []
        for sec in ORDEM:
            m2 = re.search(rf"^{re.escape(sec)}\s*$", body, re.M)
            if not m2:
                errors[name].append(f"missing: {sec}")
            else:
                positions.append((m2.start(), sec))
        if positions != sorted(positions):
            errors[name].append("sections out of order")
        if not re.search(r"\*\*Criado em\*\*.*\n\*\*Atualizado em\*\*.*\n\*\*Versão\*\*", body):
            errors[name].append("incomplete footer")
        if f := WORKFLOW.search(body):
            errors[name].append(f"workflow residue: '{f.group(0)}'")
        if "Não recebe `Write` nem `Edit`" in body:
            tools = re.search(r"^tools:\s*(.+)$", fm, re.M).group(1)
            if "Write" in tools or "Edit" in tools:
                errors[name].append("declares no Write/Edit, but tools say otherwise")

    for cor, n in colours.items():
        if n > 1:
            errors["colours"].append(f"'{cor}' used by {n} agents")
    return len(files), "agents"


# ─────────────────────────────────────────────────────────────────────────────
# commands
# ─────────────────────────────────────────────────────────────────────────────
def check_commands(errors):
    AGENTS = "|".join(f[:-3] for f in os.listdir(path_in("agents")) if f.endswith(".md"))
    files = sorted(f for f in os.listdir(path_in("commands")) if f.endswith(".md"))
    for arq in files:
        t = open(path_in("commands", arq)).read()
        if not re.search(r'^description: "', t, re.M):
            errors[arq].append("description not quoted")
        for sec in ("## Propósito", "## Fluxo", "## Instruções"):
            if not re.search(rf"^{re.escape(sec)}\s*$", t, re.M):
                errors[arq].append(f"missing: {sec}")
        if not re.search(r"^\*\*Criado em\*\*", t, re.M):
            errors[arq].append("no footer")
        for cmd in re.findall(r"^!`([^`]+)`", t, re.M):
            if not cmd.startswith("git ") and "rev-parse" not in cmd:
                errors[arq].append(f"! command with an unanchored path: {cmd}")
        for a in set(re.findall(rf"`({AGENTS})`", t)):
            if not os.path.exists(path_in("agents", f"{a}.md")):
                errors[arq].append(f"agent does not exist: {a}")
    return len(files), "commands"


# ─────────────────────────────────────────────────────────────────────────────
# links, everywhere
# ─────────────────────────────────────────────────────────────────────────────
def check_links(errors):
    targets = []
    for root, _, files in os.walk(CLAUDE):
        if "node_modules" in root:
            continue
        targets += [os.path.join(root, f) for f in files if f.endswith(".md")]
    for f in sorted(targets):
        base, inside = os.path.dirname(f), False
        rel = os.path.relpath(f, CLAUDE)
        for n, line in enumerate(open(f), 1):
            if FENCE.match(line):
                inside = not inside
                continue
            if inside:
                continue
            for link in LINK.findall(INLINE.sub("", line)):
                if not os.path.exists(os.path.normpath(os.path.join(base, link))):
                    errors[rel].append(f"line {n}: broken link -> {link}")
    return len(targets), ".md files"


LAYERS = {
    "rules": check_rules,
    "skills": check_skills,
    "agents": check_agents,
    "commands": check_commands,
    "links": check_links,
}


def main():
    requested = sys.argv[1:] or list(LAYERS)
    total = 0
    for layer in requested:
        if layer not in LAYERS:
            print(f"unknown layer: {layer} (use {', '.join(LAYERS)})")
            return 2
        errors = defaultdict(list)
        count, label = LAYERS[layer](errors)
        for target in sorted(errors):
            print(f"X {target}")
            for e in errors[target]:
                print(f"    {e}")
        problems = sum(len(v) for v in errors.values())
        total += problems
        print(f"{count} {label} · {problems} problems")
    return 1 if total else 0


if __name__ == "__main__":
    sys.exit(main())
